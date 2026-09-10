import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'
import type { NivelKey, NivelLandingData } from '@/lib/niveles-landing'
import { publicFileUrl } from '@/lib/public-asset-url'

export type NivelMedia = {
  nivel: NivelKey
  home_ruta: string
  hero_ruta: string
  campus1_titulo: string
  campus1_texto: string
  campus1_ruta: string
  campus2_titulo: string
  campus2_texto: string
  campus2_ruta: string
  campus3_titulo: string
  campus3_texto: string
  campus3_ruta: string
  updated_at?: string | null
}

function bust(src: string, stamp?: string | null) {
  return publicFileUrl(src, stamp)
}

export function aplicarMedia(base: NivelLandingData, media: NivelMedia | null): NivelLandingData {
  if (!media) {
    return {
      ...base,
      heroImage: publicFileUrl(base.heroImage),
      campus: base.campus.map((item) => ({ ...item, image: publicFileUrl(item.image) })),
    }
  }
  const v = media.updated_at || null
  const campus = [
    {
      title: media.campus1_titulo || base.campus[0]?.title || '',
      text: media.campus1_texto || base.campus[0]?.text || '',
      image: bust(media.campus1_ruta || base.campus[0]?.image || '', v),
    },
    {
      title: media.campus2_titulo || base.campus[1]?.title || '',
      text: media.campus2_texto || base.campus[1]?.text || '',
      image: bust(media.campus2_ruta || base.campus[1]?.image || '', v),
    },
    {
      title: media.campus3_titulo || base.campus[2]?.title || '',
      text: media.campus3_texto || base.campus[2]?.text || '',
      image: bust(media.campus3_ruta || base.campus[2]?.image || '', v),
    },
  ]
  return {
    ...base,
    heroImage: bust(media.hero_ruta || base.heroImage, v),
    campus,
  }
}

function mapMedia(nivel: NivelKey, r: RowDataPacket): NivelMedia {
  return {
    nivel,
    home_ruta: String(r.home_ruta || r.hero_ruta || ''),
    hero_ruta: String(r.hero_ruta || ''),
    campus1_titulo: String(r.campus1_titulo || ''),
    campus1_texto: String(r.campus1_texto || ''),
    campus1_ruta: String(r.campus1_ruta || ''),
    campus2_titulo: String(r.campus2_titulo || ''),
    campus2_texto: String(r.campus2_texto || ''),
    campus2_ruta: String(r.campus2_ruta || ''),
    campus3_titulo: String(r.campus3_titulo || ''),
    campus3_texto: String(r.campus3_texto || ''),
    campus3_ruta: String(r.campus3_ruta || ''),
    updated_at: r.updated_at ? String(r.updated_at) : null,
  }
}

export async function getNivelMedia(nivel: NivelKey): Promise<NivelMedia | null> {
  const db = getPool()
  if (!db) return null
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT nivel, home_ruta, hero_ruta,
              campus1_titulo, campus1_texto, campus1_ruta,
              campus2_titulo, campus2_texto, campus2_ruta,
              campus3_titulo, campus3_texto, campus3_ruta,
              updated_at
       FROM web_paginas_nivel_media WHERE nivel = ? LIMIT 1`,
      [nivel]
    )
    const r = rows?.[0]
    if (!r) return null
    return mapMedia(nivel, r)
  } catch (error) {
    const msg = String((error as Error)?.message || error || '')
    if (msg.includes('home_ruta')) {
      try {
        const [rows] = await db.execute<RowDataPacket[]>(
          `SELECT nivel, hero_ruta,
                  campus1_titulo, campus1_texto, campus1_ruta,
                  campus2_titulo, campus2_texto, campus2_ruta,
                  campus3_titulo, campus3_texto, campus3_ruta,
                  updated_at
           FROM web_paginas_nivel_media WHERE nivel = ? LIMIT 1`,
          [nivel]
        )
        const r = rows?.[0]
        if (!r) return null
        return mapMedia(nivel, { ...r, home_ruta: r.hero_ruta })
      } catch {
        /* fallthrough */
      }
    }
    console.error('[niveles-media] MySQL:', error)
    return null
  }
}

export async function getAllNivelMedia(): Promise<Record<NivelKey, NivelMedia | null>> {
  const [inicial, primaria, secundaria] = await Promise.all([
    getNivelMedia('inicial'),
    getNivelMedia('primaria'),
    getNivelMedia('secundaria'),
  ])
  return { inicial, primaria, secundaria }
}

export function fotoInicio(nivel: NivelKey, fallback: string, media: NivelMedia | null): string {
  if (!media) return publicFileUrl(fallback)
  return bust(media.home_ruta || media.hero_ruta || fallback, media.updated_at)
}
