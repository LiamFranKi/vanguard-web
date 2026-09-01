import fs from 'fs'
import path from 'path'
import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export type UtilesGrado = {
  id: string
  nombre: string
  archivo: string
  ruta: string
}

export type UtilesNivel = {
  id: string
  nombre: string
  color: string
  grados: UtilesGrado[]
}

export type ListaUtilesData = {
  niveles: UtilesNivel[]
  source: 'mysql' | 'fallback'
  descargas_habilitadas: boolean
}

function isOn(v: unknown): boolean {
  if (Buffer.isBuffer(v)) return Boolean(v.length && v[0])
  return v === true || v === 1 || v === '1'
}

function loadJsonFallback(descargasHabilitadas = false): ListaUtilesData {
  try {
    const filePath = path.join(process.cwd(), 'config', 'lista-utiles.json')
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
      niveles?: UtilesNivel[]
    }
    return {
      niveles: parsed.niveles || [],
      source: 'fallback',
      descargas_habilitadas: descargasHabilitadas,
    }
  } catch (error) {
    console.error('Error leyendo config/lista-utiles.json:', error)
    return { niveles: [], source: 'fallback', descargas_habilitadas: descargasHabilitadas }
  }
}

async function leerDescargasHabilitadas(): Promise<boolean | null> {
  const db = getPool()
  if (!db) return null
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT descargas_habilitadas FROM web_utiles_config WHERE id = 1 LIMIT 1`
    )
    if (!rows?.length) return false
    return isOn(rows[0].descargas_habilitadas)
  } catch (error) {
    console.warn('[lista-utiles] web_utiles_config:', (error as Error)?.message || error)
    return null
  }
}

/**
 * Lista de útiles: mismos niveles/grados que el JSON.
 * PDFs en /public/utiles (ruta pública /utiles/...).
 * descargas_habilitadas lo controla la intranet (web_utiles_config).
 */
export async function getListaUtiles(): Promise<ListaUtilesData> {
  const db = getPool()
  const flag = await leerDescargasHabilitadas()
  // null = no se pudo leer la tabla → no romper descargas; false = apagado desde intranet
  const descargasHabilitadas = flag !== false

  if (!db) return loadJsonFallback(descargasHabilitadas)

  try {
    const [nivelRows] = await db.execute<RowDataPacket[]>(
      `SELECT id, codigo, nombre, color, orden
       FROM web_utiles_niveles
       WHERE activo = 1
       ORDER BY orden ASC, id ASC`
    )
    if (!nivelRows || nivelRows.length === 0) {
      return loadJsonFallback(descargasHabilitadas)
    }

    const [gradoRows] = await db.execute<RowDataPacket[]>(
      `SELECT nivel_id, codigo, nombre, archivo, ruta, orden
       FROM web_utiles_grados
       WHERE activo = 1
       ORDER BY orden ASC, id ASC`
    )

    const gradosPorNivel = new Map<number, UtilesGrado[]>()
    for (const g of gradoRows || []) {
      const nivelId = Number(g.nivel_id)
      const list = gradosPorNivel.get(nivelId) || []
      list.push({
        id: String(g.codigo),
        nombre: String(g.nombre),
        archivo: descargasHabilitadas ? String(g.archivo) : '',
        ruta: descargasHabilitadas ? String(g.ruta) : '',
      })
      gradosPorNivel.set(nivelId, list)
    }

    const niveles: UtilesNivel[] = nivelRows.map((n) => ({
      id: String(n.codigo),
      nombre: String(n.nombre),
      color: String(n.color || 'blue'),
      grados: gradosPorNivel.get(Number(n.id)) || [],
    }))

    if (niveles.length === 0) return loadJsonFallback(descargasHabilitadas)

    return { niveles, source: 'mysql', descargas_habilitadas: descargasHabilitadas }
  } catch (error) {
    console.error('[lista-utiles] MySQL:', error)
    return loadJsonFallback(descargasHabilitadas)
  }
}

