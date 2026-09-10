import fs from 'fs'
import path from 'path'
import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export interface FaqItem {
  categoria?: string
  pregunta: string
  respuesta: string
  pagina_nivel?: string
}

export interface FaqCategoria {
  codigo: string
  etiqueta: string
  orden: number
}

export type FaqsPayload = {
  faqs: FaqItem[]
  categorias?: FaqCategoria[]
  source: 'mysql' | 'fallback'
}

function loadJsonFallback(): FaqsPayload {
  try {
    const filePath = path.join(process.cwd(), 'config', 'faqs.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(data) as { faqs?: FaqItem[] }
    return { faqs: parsed.faqs || [], source: 'fallback' }
  } catch (error) {
    console.error('Error leyendo config/faqs.json:', error)
    return { faqs: [], source: 'fallback' }
  }
}

/**
 * FAQs para la web. Misma forma que el JSON: lista plana con campo categoria.
 * La página agrupa por categoría (áreas) sin cambiar el diseño.
 */
export async function getFaqsData(): Promise<FaqsPayload> {
  const db = getPool()
  if (!db) return loadJsonFallback()

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT c.etiqueta AS categoria, c.codigo, c.orden AS cat_orden,
              f.pregunta, f.respuesta, f.orden AS faq_orden, f.pagina_nivel
       FROM web_faqs f
       INNER JOIN web_faq_categorias c ON c.id = f.categoria_id
       WHERE f.activo = 1 AND c.activo = 1
       ORDER BY c.orden ASC, f.orden ASC, f.id ASC`
    )

    if (!rows || rows.length === 0) {
      return loadJsonFallback()
    }

    const faqs: FaqItem[] = rows.map((r) => ({
      categoria: String(r.categoria),
      pregunta: String(r.pregunta),
      respuesta: String(r.respuesta),
      pagina_nivel: String(r.pagina_nivel || 'todos'),
    }))

    const catMap = new Map<string, FaqCategoria>()
    for (const r of rows) {
      const codigo = String(r.codigo)
      if (!catMap.has(codigo)) {
        catMap.set(codigo, {
          codigo,
          etiqueta: String(r.categoria),
          orden: Number(r.cat_orden) || 0,
        })
      }
    }

    return {
      faqs,
      categorias: Array.from(catMap.values()),
      source: 'mysql',
    }
  } catch (error) {
    const msg = String((error as Error)?.message || error || '')
    if (msg.includes('pagina_nivel')) {
      try {
        const [rows] = await db.execute<RowDataPacket[]>(
          `SELECT c.etiqueta AS categoria, c.codigo, c.orden AS cat_orden,
                  f.pregunta, f.respuesta, f.orden AS faq_orden
           FROM web_faqs f
           INNER JOIN web_faq_categorias c ON c.id = f.categoria_id
           WHERE f.activo = 1 AND c.activo = 1
           ORDER BY c.orden ASC, f.orden ASC, f.id ASC`
        )
        if (rows?.length) {
          return {
            faqs: rows.map((r) => ({
              categoria: String(r.categoria),
              pregunta: String(r.pregunta),
              respuesta: String(r.respuesta),
              pagina_nivel: 'todos',
            })),
            source: 'mysql' as const,
          }
        }
      } catch {
        /* fallback json */
      }
    }
    console.error('[faqs] MySQL:', error)
    return loadJsonFallback()
  }
}

/** Compat: lista plana (como antes) */
export async function getFaqs(): Promise<FaqItem[]> {
  const data = await getFaqsData()
  return data.faqs
}

export async function getFaqsParaNivel(nivel: 'inicial' | 'primaria' | 'secundaria'): Promise<FaqItem[]> {
  const all = await getFaqs()
  const picked = all.filter((faq) => {
    const nv = String(faq.pagina_nivel || 'todos').toLowerCase()
    return nv === 'todos' || nv === nivel
  })
  return picked.slice(0, 10)
}
