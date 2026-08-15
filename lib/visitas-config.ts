import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export type VisitaHorarioPublic = { id: number; etiqueta: string }
export type VisitaDiaPublic = { dia_semana: number; etiqueta: string }

export type VisitaConfigPublica = {
  diasSemana: number[]
  diasEtiquetas: VisitaDiaPublic[]
  horarios: VisitaHorarioPublic[]
  usaSecuencias: boolean
  mensajeDias: string
  disponible: boolean
  source: 'intranet' | 'mysql' | 'fallback'
  generatedAt?: string
  database?: string | null
}

const FALLBACK: VisitaConfigPublica = {
  diasSemana: [2, 4],
  diasEtiquetas: [
    { dia_semana: 2, etiqueta: 'Martes' },
    { dia_semana: 4, etiqueta: 'Jueves' },
  ],
  horarios: [
    { id: 0, etiqueta: 'Mañana (10:00 am - 11:00 am)' },
    { id: 0, etiqueta: 'Tarde (03:00 pm - 04:00 pm)' },
  ],
  usaSecuencias: false,
  mensajeDias: 'Martes y Jueves',
  disponible: true,
  source: 'fallback',
}

export function getFallbackVisitaConfig(): VisitaConfigPublica {
  return { ...FALLBACK, generatedAt: new Date().toISOString() }
}

export function getVisitaConfigCerrada(source: VisitaConfigPublica['source'] = 'mysql'): VisitaConfigPublica {
  return {
    diasSemana: [],
    diasEtiquetas: [],
    horarios: [],
    usaSecuencias: false,
    mensajeDias: 'No hay días disponibles',
    disponible: false,
    source,
    generatedAt: new Date().toISOString(),
  }
}

function normalizeFromPayload(data: Record<string, unknown>, source: VisitaConfigPublica['source']): VisitaConfigPublica {
  const diasSemana = Array.isArray(data.diasSemana) ? data.diasSemana.map(Number).filter(Number.isFinite) : []
  const diasEtiquetas = Array.isArray(data.diasEtiquetas)
    ? (data.diasEtiquetas as VisitaDiaPublic[])
    : []
  const horarios = Array.isArray(data.horarios) ? (data.horarios as VisitaHorarioPublic[]) : []
  const disponible =
    data.disponible !== false && diasSemana.length > 0 && horarios.length > 0

  if (!disponible) {
    return getVisitaConfigCerrada(source)
  }

  return {
    diasSemana,
    diasEtiquetas,
    horarios,
    usaSecuencias: false,
    mensajeDias: String(data.mensajeDias || diasEtiquetas.map((d) => d.etiqueta).join(', ') || 'días configurados'),
    disponible: true,
    source,
    generatedAt: String(data.generatedAt || new Date().toISOString()),
    database: (data.database as string) || null,
  }
}

/**
 * Prioridad:
 * 1) Intranet pública (misma BD que el admin Config. visitas) vía INTRANET_API_URL
 * 2) MySQL directo de la web
 * 3) Fallback solo si falla todo
 */
async function fetchFromIntranet(): Promise<VisitaConfigPublica | null> {
  const base = String(process.env.INTRANET_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')
  const url = `${base}/api/public/visitas-config?t=${Date.now()}`
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(url, {
      cache: 'no-store',
      signal: ctrl.signal,
      headers: { Accept: 'application/json', Pragma: 'no-cache' },
    })
    clearTimeout(timer)
    if (!res.ok) {
      console.warn('[visitas-config] intranet HTTP', res.status)
      return null
    }
    const data = (await res.json()) as Record<string, unknown>
    return normalizeFromPayload(data, 'intranet')
  } catch (e) {
    console.warn('[visitas-config] intranet no disponible:', (e as Error)?.message || e)
    return null
  }
}

async function fetchFromMysql(): Promise<VisitaConfigPublica | null> {
  const db = getPool()
  if (!db) return null

  try {
    const [diasRows] = await db.execute<RowDataPacket[]>(
      `SELECT dia_semana, etiqueta, activo FROM web_visita_dias ORDER BY dia_semana ASC`
    )
    const [horariosRows] = await db.execute<RowDataPacket[]>(
      `SELECT id, etiqueta, activo FROM web_visita_horarios ORDER BY orden ASC, id ASC`
    )

    const isOn = (v: unknown) => {
      if (Buffer.isBuffer(v)) return Boolean(v.length && v[0])
      return v === true || v === 1 || v === '1'
    }

    const diasEtiquetas = (diasRows || [])
      .filter((r) => isOn(r.activo))
      .map((r) => ({
        dia_semana: Number(r.dia_semana),
        etiqueta: String(r.etiqueta),
      }))
    const horarios = (horariosRows || [])
      .filter((r) => isOn(r.activo))
      .map((r) => ({
        id: Number(r.id),
        etiqueta: String(r.etiqueta),
      }))

    if (diasEtiquetas.length === 0 || horarios.length === 0) {
      return getVisitaConfigCerrada('mysql')
    }

    return {
      diasSemana: diasEtiquetas.map((d) => d.dia_semana),
      diasEtiquetas,
      horarios,
      usaSecuencias: false,
      mensajeDias: diasEtiquetas.map((d) => d.etiqueta).join(', '),
      disponible: true,
      source: 'mysql',
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[visitas-config] MySQL:', error)
    return null
  }
}

export async function getVisitaConfigPublica(): Promise<VisitaConfigPublica> {
  const fromIntranet = await fetchFromIntranet()
  if (fromIntranet) return fromIntranet

  const fromMysql = await fetchFromMysql()
  if (fromMysql) return fromMysql

  return getFallbackVisitaConfig()
}

export async function validarVisitaFechaHorario(
  fechaPreferida: string,
  horarioPreferido: string
): Promise<{ ok: boolean; error?: string }> {
  const config = await getVisitaConfigPublica()

  if (!config.disponible || config.diasSemana.length === 0 || config.horarios.length === 0) {
    return {
      ok: false,
      error: 'Por el momento no hay visitas disponibles',
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaPreferida)) {
    return { ok: false, error: 'Fecha inválida' }
  }
  const [y, m, d] = fechaPreferida.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return { ok: false, error: 'Fecha inválida' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date.getTime() <= today.getTime()) {
    return { ok: false, error: 'La fecha debe ser posterior a hoy' }
  }

  const dow = date.getDay()
  if (!config.diasSemana.includes(dow)) {
    return {
      ok: false,
      error: `Ese día no está disponible. Días permitidos: ${config.mensajeDias}`,
    }
  }

  const horariosOk = config.horarios.map((h) => h.etiqueta)
  if (!horariosOk.includes(horarioPreferido)) {
    return { ok: false, error: 'Horario no disponible' }
  }

  return { ok: true }
}
