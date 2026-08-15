import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export type VisitaHorarioPublic = { id: number; etiqueta: string }
export type VisitaDiaPublic = { dia_semana: number; etiqueta: string }

export type VisitaConfigPublica = {
  diasSemana: number[]
  diasEtiquetas: VisitaDiaPublic[]
  horarios: VisitaHorarioPublic[]
  /** Siempre false: la web ignora secuencias; solo días × horarios activos */
  usaSecuencias: boolean
  mensajeDias: string
  /** false cuando MySQL OK pero 0 días o 0 horarios activos (visitas cerradas) */
  disponible: boolean
  source: 'mysql' | 'fallback'
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

/** Solo ante fallo real de MySQL / sin pool — no usar si la BD tiene 0 días a propósito */
export function getFallbackVisitaConfig(): VisitaConfigPublica {
  return { ...FALLBACK }
}

/** MySQL OK pero sin días u horarios activos = visitas cerradas */
export function getVisitaConfigCerrada(): VisitaConfigPublica {
  return {
    diasSemana: [],
    diasEtiquetas: [],
    horarios: [],
    usaSecuencias: false,
    mensajeDias: 'No hay días disponibles',
    disponible: false,
    source: 'mysql',
  }
}

/**
 * Disponibilidad pública = días activos × horarios activos.
 * NO lee web_visita_secuencias ni slots (la intranet ya no las usa en UI).
 */
export async function getVisitaConfigPublica(): Promise<VisitaConfigPublica> {
  const db = getPool()
  if (!db) return getFallbackVisitaConfig()

  try {
    const [diasRows] = await db.execute<RowDataPacket[]>(
      `SELECT dia_semana, etiqueta FROM web_visita_dias WHERE activo = 1 ORDER BY dia_semana ASC`
    )
    const [horariosRows] = await db.execute<RowDataPacket[]>(
      `SELECT id, etiqueta FROM web_visita_horarios WHERE activo = 1 ORDER BY orden ASC, id ASC`
    )

    const diasEtiquetas = (diasRows || []).map((r) => ({
      dia_semana: Number(r.dia_semana),
      etiqueta: String(r.etiqueta),
    }))
    const horarios = (horariosRows || []).map((r) => ({
      id: Number(r.id),
      etiqueta: String(r.etiqueta),
    }))

    if (diasEtiquetas.length === 0 || horarios.length === 0) {
      return getVisitaConfigCerrada()
    }

    const diasSemana = diasEtiquetas.map((d) => d.dia_semana)
    const mensajeDias = diasEtiquetas.map((d) => d.etiqueta).join(', ')

    return {
      diasSemana,
      diasEtiquetas,
      horarios,
      usaSecuencias: false,
      mensajeDias: mensajeDias || 'días configurados',
      disponible: true,
      source: 'mysql',
    }
  } catch (error) {
    console.error('[visitas-config] MySQL:', error)
    return getFallbackVisitaConfig()
  }
}

/** Valida fecha (YYYY-MM-DD) y horario según días × horarios activos */
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
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
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
