import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'
import { publicFileUrl } from '@/lib/public-asset-url'

export type ConvenioItem = {
  id: number
  nombre: string
  descripcion: string
  beneficios: string[]
  color: string
  logo: string
  imagen: string
  pdf: string
}

export type ConveniosData = {
  titulo: string
  subtitulo: string
  intro: string
  ctaTexto: string
  items: ConvenioItem[]
  source: 'mysql' | 'fallback'
}

const FALLBACK: ConveniosData = {
  titulo: 'Convenios',
  subtitulo: 'Alianzas estratégicas para una educación integral',
  intro:
    'Trabajamos con instituciones reconocidas para ofrecer programas de excelencia que complementan nuestra formación académica.',
  ctaTexto:
    '¿Interesado en nuestros convenios? Contáctanos para más información sobre cómo participar en estos programas.',
  items: [
    {
      id: 1,
      nombre: 'Cambridge (Inglés)',
      descripcion: 'Programa de inglés certificado por Cambridge Assessment English',
      beneficios: [
        'Certificación internacional reconocida',
        'Metodología comunicativa',
        'Preparación para exámenes Cambridge',
        'Docentes certificados',
      ],
      color: 'from-green-500 to-emerald-500',
      logo: '',
      imagen: '',
      pdf: publicFileUrl('/documentos/ConvenioCambridge.pdf'),
    },
    {
      id: 2,
      nombre: 'AquaXtreme (Natación)',
      descripcion: 'Programa de natación y desarrollo acuático',
      beneficios: [
        'Instalaciones modernas',
        'Instructores certificados',
        'Desarrollo físico integral',
        'Seguridad y supervisión constante',
      ],
      color: 'from-cyan-500 to-blue-500',
      logo: '',
      imagen: '',
      pdf: publicFileUrl('/documentos/ConvenioAquaxtreme.pdf'),
    },
    {
      id: 3,
      nombre: 'Valley (Robótica)',
      descripcion: 'Programa de robótica y tecnología educativa',
      beneficios: [
        'Pensamiento computacional',
        'Proyectos prácticos',
        'Competencias y concursos',
        'Preparación para el futuro tecnológico',
      ],
      color: 'from-purple-500 to-pink-500',
      logo: '',
      imagen: '',
      pdf: publicFileUrl('/documentos/ConvenioValley.pdf'),
    },
  ],
  source: 'fallback',
}

function splitBeneficios(raw: unknown): string[] {
  return String(raw || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function fileUrl(ruta: string, stamp?: string | null): string {
  const s = String(ruta || '').trim()
  if (!s) return ''
  return publicFileUrl(s, stamp)
}

function isOn(v: unknown): boolean {
  if (Buffer.isBuffer(v)) return Boolean(v.length && v[0])
  return v === true || v === 1 || v === '1'
}

export async function getConvenios(): Promise<ConveniosData> {
  const db = getPool()
  if (!db) return FALLBACK

  try {
    const [paginas] = await db.execute<RowDataPacket[]>(
      `SELECT titulo, subtitulo, intro, cta_texto, updated_at
       FROM web_paginas_convenios WHERE id = 1 LIMIT 1`
    )
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id, nombre, descripcion, beneficios, color, logo_ruta, imagen_ruta, pdf_ruta, orden, activo, updated_at
       FROM web_paginas_convenio_items
       WHERE activo = 1
       ORDER BY orden ASC, id ASC`
    )
    const pagina = paginas?.[0]
    if (!pagina && (!rows || rows.length === 0)) return FALLBACK

    const stamp = pagina?.updated_at ? String(pagina.updated_at) : null
    return {
      titulo: String(pagina?.titulo || FALLBACK.titulo).trim() || FALLBACK.titulo,
      subtitulo: String(pagina?.subtitulo || FALLBACK.subtitulo).trim() || FALLBACK.subtitulo,
      intro: String(pagina?.intro || FALLBACK.intro).trim() || FALLBACK.intro,
      ctaTexto: String(pagina?.cta_texto || FALLBACK.ctaTexto).trim() || FALLBACK.ctaTexto,
      items: (rows || []).map((r) => {
        const itemStamp = r.updated_at ? String(r.updated_at) : stamp
        return {
          id: Number(r.id),
          nombre: String(r.nombre || '').trim(),
          descripcion: String(r.descripcion || '').trim(),
          beneficios: splitBeneficios(r.beneficios),
          color: String(r.color || 'from-green-500 to-emerald-500'),
          logo: fileUrl(String(r.logo_ruta || ''), itemStamp),
          imagen: fileUrl(String(r.imagen_ruta || ''), itemStamp),
          pdf: fileUrl(String(r.pdf_ruta || ''), itemStamp),
        }
      }),
      source: 'mysql',
    }
  } catch (error) {
    console.error('[convenios] MySQL, se usa contenido de respaldo:', error)
    return FALLBACK
  }
}
