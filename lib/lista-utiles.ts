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
}

function loadJsonFallback(): ListaUtilesData {
  try {
    const filePath = path.join(process.cwd(), 'config', 'lista-utiles.json')
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
      niveles?: UtilesNivel[]
    }
    return { niveles: parsed.niveles || [], source: 'fallback' }
  } catch (error) {
    console.error('Error leyendo config/lista-utiles.json:', error)
    return { niveles: [], source: 'fallback' }
  }
}

/**
 * Lista de útiles: mismos niveles/grados que el JSON.
 * PDFs en /public/utiles (ruta pública /utiles/...).
 */
export async function getListaUtiles(): Promise<ListaUtilesData> {
  const db = getPool()
  if (!db) return loadJsonFallback()

  try {
    const [nivelRows] = await db.execute<RowDataPacket[]>(
      `SELECT id, codigo, nombre, color, orden
       FROM web_utiles_niveles
       WHERE activo = 1
       ORDER BY orden ASC, id ASC`
    )
    if (!nivelRows || nivelRows.length === 0) {
      return loadJsonFallback()
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
        archivo: String(g.archivo),
        ruta: String(g.ruta),
      })
      gradosPorNivel.set(nivelId, list)
    }

    const niveles: UtilesNivel[] = nivelRows.map((n) => ({
      id: String(n.codigo),
      nombre: String(n.nombre),
      color: String(n.color || 'blue'),
      grados: gradosPorNivel.get(Number(n.id)) || [],
    }))

    if (niveles.length === 0) return loadJsonFallback()

    return { niveles, source: 'mysql' }
  } catch (error) {
    console.error('[lista-utiles] MySQL:', error)
    return loadJsonFallback()
  }
}
