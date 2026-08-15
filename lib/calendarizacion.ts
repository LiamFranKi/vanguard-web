import fs from 'fs'
import path from 'path'
import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export type CalEvento = {
  tipo: string
  color: string
  colorTexto: string
  dia?: number
  rango?: { inicio: number; fin: number }
  texto: string
}

export type CalMesData = {
  nombre: string
  eventos: CalEvento[]
}

export type CalendarizacionData = {
  año: number
  meses: Record<string, CalMesData>
  source: 'mysql' | 'fallback'
  conceptos?: { codigo: string; etiqueta: string; color: string; colorTexto: string }[]
}

const NOMBRES_MES: Record<number, string> = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre',
}

function loadJsonFallback(anioPreferido?: number): CalendarizacionData {
  try {
    const configPath = path.join(process.cwd(), 'config', 'calendarizacion.json')
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8')) as {
      año?: number
      anio?: number
      meses: Record<string, CalMesData>
    }
    return {
      año: anioPreferido || raw.año || raw.anio || 2026,
      meses: raw.meses || {},
      source: 'fallback',
    }
  } catch {
    return { año: anioPreferido || 2026, meses: {}, source: 'fallback' }
  }
}

export async function getCalendarizacion(
  anio?: number
): Promise<CalendarizacionData> {
  const db = getPool()
  if (!db) return loadJsonFallback(anio)

  try {
    let year = anio
    if (!year) {
      const [yearRows] = await db.execute<RowDataPacket[]>(
        `SELECT anio FROM web_calendarizacion WHERE activo = 1 ORDER BY anio DESC LIMIT 1`
      )
      year = yearRows?.[0]?.anio ? Number(yearRows[0].anio) : undefined
    }
    if (!year) {
      const fallback = loadJsonFallback()
      year = fallback.año
    }

    const [evRows] = await db.execute<RowDataPacket[]>(
      `SELECT mes, tipo, color, color_texto, dia, rango_inicio, rango_fin, texto, orden
       FROM web_calendarizacion_eventos
       WHERE anio = ? AND activo = 1
       ORDER BY mes ASC, orden ASC, id ASC`,
      [year]
    )

    if (!evRows || evRows.length === 0) {
      const fb = loadJsonFallback(year)
      return { ...fb, año: year }
    }

    const meses: Record<string, CalMesData> = {}
    for (const r of evRows) {
      const mes = Number(r.mes)
      const key = String(mes)
      if (!meses[key]) {
        meses[key] = {
          nombre: NOMBRES_MES[mes] || `Mes ${mes}`,
          eventos: [],
        }
      }
      const evento: CalEvento = {
        tipo: String(r.tipo),
        color: String(r.color),
        colorTexto: String(r.color_texto || '#ffffff'),
        texto: String(r.texto || ''),
      }
      if (r.dia != null) {
        evento.dia = Number(r.dia)
      } else if (r.rango_inicio != null && r.rango_fin != null) {
        evento.rango = {
          inicio: Number(r.rango_inicio),
          fin: Number(r.rango_fin),
        }
      }
      meses[key].eventos.push(evento)
    }

    let conceptos:
      | { codigo: string; etiqueta: string; color: string; colorTexto: string }[]
      | undefined
    try {
      const [cRows] = await db.execute<RowDataPacket[]>(
        `SELECT codigo, etiqueta, color, color_texto
         FROM web_calendarizacion_conceptos
         WHERE activo = 1
         ORDER BY orden ASC, id ASC`
      )
      conceptos = (cRows || []).map((c) => ({
        codigo: String(c.codigo),
        etiqueta: String(c.etiqueta),
        color: String(c.color),
        colorTexto: String(c.color_texto || '#ffffff'),
      }))
    } catch {
      // tabla conceptos opcional
    }

    return {
      año: year,
      meses,
      source: 'mysql',
      conceptos,
    }
  } catch (error) {
    console.error('[calendarizacion] MySQL:', error)
    return loadJsonFallback(anio)
  }
}
