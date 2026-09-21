import fs from 'fs'
import path from 'path'
import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export const FAQ_DESTINOS = ['web', 'inicial', 'primaria', 'secundaria'] as const
export type FaqDestino = (typeof FAQ_DESTINOS)[number]

export interface FaqItem {
  categoria?: string
  pregunta: string
  respuesta: string
  pagina_nivel?: string
  pagina_destinos?: FaqDestino[]
  orden?: number
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

function esDestino(v: string): v is FaqDestino {
  return (FAQ_DESTINOS as readonly string[]).includes(v)
}

export function parseFaqDestinos(raw: unknown, legado?: string): FaqDestino[] {
  const fromJson = (value: unknown): FaqDestino[] => {
    if (!Array.isArray(value)) return []
    const out: FaqDestino[] = []
    for (const item of value) {
      const s = String(item || '').trim().toLowerCase()
      if (esDestino(s) && !out.includes(s)) out.push(s)
    }
    return out
  }

  const parsedJson = fromJson(raw)
  if (parsedJson.length) return parsedJson

  if (typeof raw === 'string' && raw.trim().startsWith('[')) {
    try {
      const list = fromJson(JSON.parse(raw))
      if (list.length) return list
    } catch {
      /* legado */
    }
  }

  if (typeof raw === 'string' && raw.includes(',')) {
    const list = fromJson(raw.split(',').map((x) => x.trim()))
    if (list.length) return list
  }

  const s = String(legado ?? (typeof raw === 'string' ? raw : '') ?? '')
    .trim()
    .toLowerCase()
  if (s === 'web') return ['web']
  if (s === 'inicial' || s === 'primaria' || s === 'secundaria') return ['web', s]
  if (s === 'todos' || !s) return [...FAQ_DESTINOS]
  if (esDestino(s)) return [s]
  return [...FAQ_DESTINOS]
}

export function faqTieneDestino(faq: FaqItem, destino: FaqDestino): boolean {
  const destinos = faq.pagina_destinos?.length
    ? faq.pagina_destinos
    : parseFaqDestinos(null, faq.pagina_nivel)
  return destinos.includes(destino)
}

function loadJsonFallback(): FaqsPayload {
  try {
    const filePath = path.join(process.cwd(), 'config', 'faqs.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(data) as { faqs?: FaqItem[] }
    const faqs = (parsed.faqs || []).map((f, i) => {
      const pagina_destinos = parseFaqDestinos(f.pagina_destinos, f.pagina_nivel || 'todos')
      return {
        ...f,
        pagina_destinos,
        pagina_nivel: f.pagina_nivel || 'todos',
        orden: Number(f.orden) || i + 1,
      }
    })
    return { faqs, source: 'fallback' }
  } catch (error) {
    console.error('Error leyendo config/faqs.json:', error)
    return { faqs: [], source: 'fallback' }
  }
}

function mapRows(rows: RowDataPacket[]): FaqItem[] {
  return rows.map((r) => {
    const pagina_destinos = parseFaqDestinos(r.pagina_destinos, String(r.pagina_nivel || 'todos'))
    return {
      categoria: String(r.categoria),
      pregunta: String(r.pregunta),
      respuesta: String(r.respuesta),
      pagina_nivel: String(r.pagina_nivel || 'todos'),
      pagina_destinos,
      orden: Number(r.faq_orden) || 0,
    }
  })
}

function categoriasDesdeRows(rows: RowDataPacket[]): FaqCategoria[] {
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
  return Array.from(catMap.values())
}

/**
 * Todas las FAQs activas (con destinos). La página general y las de nivel filtran después.
 */
export async function getFaqsData(): Promise<FaqsPayload> {
  const db = getPool()
  if (!db) return loadJsonFallback()

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT c.etiqueta AS categoria, c.codigo, c.orden AS cat_orden,
              f.pregunta, f.respuesta, f.orden AS faq_orden, f.pagina_nivel, f.pagina_destinos
       FROM web_faqs f
       INNER JOIN web_faq_categorias c ON c.id = f.categoria_id
       WHERE f.activo = 1 AND c.activo = 1
       ORDER BY f.orden ASC, f.id ASC`
    )

    if (!rows || rows.length === 0) {
      return loadJsonFallback()
    }

    return {
      faqs: mapRows(rows),
      categorias: categoriasDesdeRows(rows),
      source: 'mysql',
    }
  } catch (error) {
    const msg = String((error as Error)?.message || error || '')
    if (msg.includes('pagina_destinos') || msg.includes('pagina_nivel')) {
      try {
        const sql = msg.includes('pagina_nivel')
          ? `SELECT c.etiqueta AS categoria, c.codigo, c.orden AS cat_orden,
                    f.pregunta, f.respuesta, f.orden AS faq_orden
             FROM web_faqs f
             INNER JOIN web_faq_categorias c ON c.id = f.categoria_id
             WHERE f.activo = 1 AND c.activo = 1
             ORDER BY f.orden ASC, f.id ASC`
          : `SELECT c.etiqueta AS categoria, c.codigo, c.orden AS cat_orden,
                    f.pregunta, f.respuesta, f.orden AS faq_orden, f.pagina_nivel
             FROM web_faqs f
             INNER JOIN web_faq_categorias c ON c.id = f.categoria_id
             WHERE f.activo = 1 AND c.activo = 1
             ORDER BY f.orden ASC, f.id ASC`
        const [rows] = await db.execute<RowDataPacket[]>(sql)
        if (rows?.length) {
          return {
            faqs: mapRows(rows),
            categorias: categoriasDesdeRows(rows),
            source: 'mysql',
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

function porOrden(a: FaqItem, b: FaqItem) {
  return (a.orden || 0) - (b.orden || 0)
}

/** Menú Preguntas frecuentes de la web pública. */
export async function getFaqs(): Promise<FaqItem[]> {
  const data = await getFaqsData()
  return data.faqs.filter((faq) => faqTieneDestino(faq, 'web')).sort(porOrden)
}

export async function getFaqsParaNivel(nivel: 'inicial' | 'primaria' | 'secundaria'): Promise<FaqItem[]> {
  const data = await getFaqsData()
  return data.faqs.filter((faq) => faqTieneDestino(faq, nivel)).sort(porOrden).slice(0, 10)
}
