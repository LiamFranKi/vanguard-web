import fs from 'fs'
import path from 'path'
import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export type DocumentoItem = {
  id: string
  nombre: string
  tipo: string
  archivo: string
  ruta: string
}

export type DocumentoCategoria = {
  id: string
  categoria: string
  items: DocumentoItem[]
}

export type DocumentosData = {
  categorias: DocumentoCategoria[]
  source: 'mysql' | 'fallback'
}

function loadJsonFallback(): DocumentosData {
  try {
    const filePath = path.join(process.cwd(), 'config', 'documentos.json')
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
      categorias?: DocumentoCategoria[]
    }
    return { categorias: parsed.categorias || [], source: 'fallback' }
  } catch (error) {
    console.error('Error leyendo config/documentos.json:', error)
    return { categorias: [], source: 'fallback' }
  }
}

/**
 * Documentos de interés: mismas categorías/items que el JSON.
 * PDFs en /public/documentos (ruta pública /documentos/...).
 */
export async function getDocumentos(): Promise<DocumentosData> {
  const db = getPool()
  if (!db) return loadJsonFallback()

  try {
    const [catRows] = await db.execute<RowDataPacket[]>(
      `SELECT id, codigo, etiqueta, orden
       FROM web_documentos_categorias
       WHERE activo = 1
       ORDER BY orden ASC, id ASC`
    )
    if (!catRows || catRows.length === 0) {
      return loadJsonFallback()
    }

    const [docRows] = await db.execute<RowDataPacket[]>(
      `SELECT categoria_id, codigo, nombre, tipo, archivo, ruta, orden
       FROM web_documentos
       WHERE activo = 1
       ORDER BY orden ASC, id ASC`
    )

    const itemsPorCat = new Map<number, DocumentoItem[]>()
    for (const d of docRows || []) {
      const catId = Number(d.categoria_id)
      const list = itemsPorCat.get(catId) || []
      list.push({
        id: String(d.codigo),
        nombre: String(d.nombre),
        tipo: String(d.tipo || 'PDF'),
        archivo: String(d.archivo),
        ruta: String(d.ruta),
      })
      itemsPorCat.set(catId, list)
    }

    const categorias: DocumentoCategoria[] = catRows
      .map((c) => ({
        id: String(c.codigo),
        categoria: String(c.etiqueta),
        items: itemsPorCat.get(Number(c.id)) || [],
      }))
      .filter((c) => c.items.length > 0)

    if (categorias.length === 0) return loadJsonFallback()

    return { categorias, source: 'mysql' }
  } catch (error) {
    console.error('[documentos] MySQL:', error)
    return loadJsonFallback()
  }
}
