import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export type VisitaHorarioPublic = { id: number; etiqueta: string }
export type VisitaDiaPublic = { dia_semana: number; etiqueta: string }

export type VisitaConfigPublica = {
  diasSemana: number[]
  diasEtiquetas: VisitaDiaPublic[]
  horarios: VisitaHorarioPublic[]
  /** Si true, solo combinaciones día+horario de secuencias activas */
  usaSecuencias: boolean
  /** Mapa dia_semana -> etiquetas de horario permitidas (solo si usaSecuencias) */
  slotsPorDia?: Record<string, string[]>
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

    let diasEtiquetas = (diasRows || []).map((r) => ({
      dia_semana: Number(r.dia_semana),
      etiqueta: String(r.etiqueta),
    }))
    let horarios = (horariosRows || []).map((r) => ({
      id: Number(r.id),
      etiqueta: String(r.etiqueta),
    }))

    // Config intencionalmente vacía (intranet cerró visitas) — NO fallback Martes/Jueves
    if (diasEtiquetas.length === 0 || horarios.length === 0) {
      return getVisitaConfigCerrada()
    }

    // Secuencias activas (opcional)
    let usaSecuencias = false
    const slotsPorDia: Record<string, string[]> = {}
    try {
      const [seqRows] = await db.execute<RowDataPacket[]>(
        `SELECT s.id
         FROM web_visita_secuencias s
         WHERE s.activo = 1`
      )
      if (seqRows && seqRows.length > 0) {
        const [slotRows] = await db.execute<RowDataPacket[]>(
          `SELECT ss.dia_semana, h.etiqueta AS horario
           FROM web_visita_secuencia_slots ss
           INNER JOIN web_visita_secuencias s ON s.id = ss.secuencia_id AND s.activo = 1
           INNER JOIN web_visita_horarios h ON h.id = ss.horario_id AND h.activo = 1
           INNER JOIN web_visita_dias d ON d.dia_semana = ss.dia_semana AND d.activo = 1`
        )
        if (slotRows && slotRows.length > 0) {
          usaSecuencias = true
          const diasSet = new Set<number>()
          const horariosSet = new Map<string, VisitaHorarioPublic>()
          for (const s of slotRows) {
            const dia = Number(s.dia_semana)
            const et = String(s.horario)
            diasSet.add(dia)
            if (!slotsPorDia[String(dia)]) slotsPorDia[String(dia)] = []
            if (!slotsPorDia[String(dia)].includes(et)) {
              slotsPorDia[String(dia)].push(et)
            }
            horariosSet.set(et, { id: 0, etiqueta: et })
          }
          diasEtiquetas = diasEtiquetas.filter((d) => diasSet.has(d.dia_semana))
          horarios = Array.from(horariosSet.values())
        }
      }
    } catch {
      // Tablas de secuencia aún no creadas: continuar sin secuencias
    }

    // Tras filtrar por secuencias, puede quedar vacío = cerrado
    if (diasEtiquetas.length === 0 || horarios.length === 0) {
      return getVisitaConfigCerrada()
    }

    const diasSemana = diasEtiquetas.map((d) => d.dia_semana)
    const mensajeDias = diasEtiquetas.map((d) => d.etiqueta).join(', ')

    return {
      diasSemana,
      diasEtiquetas,
      horarios,
      usaSecuencias,
      slotsPorDia: usaSecuencias ? slotsPorDia : undefined,
      mensajeDias: mensajeDias || 'días configurados',
      disponible: true,
      source: 'mysql',
    }
  } catch (error) {
    console.error('[visitas-config] MySQL:', error)
    return getFallbackVisitaConfig()
  }
}

/** Valida fecha (YYYY-MM-DD) y horario según config BD */
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

  if (config.usaSecuencias && config.slotsPorDia) {
    const allowed = config.slotsPorDia[String(dow)] || []
    if (!allowed.includes(horarioPreferido)) {
      return {
        ok: false,
        error: 'Esa combinación de día y horario no está disponible',
      }
    }
  }

  return { ok: true }
}
