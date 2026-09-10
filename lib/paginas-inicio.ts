import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

const FALLBACK = '/FONDOBANNER.jpg'

export async function getBannerInicio(): Promise<string> {
  const db = getPool()
  if (!db) return FALLBACK
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT banner_ruta, updated_at FROM web_paginas_inicio WHERE id = 1 LIMIT 1`
    )
    const r = rows?.[0]
    const src = String(r?.banner_ruta || '').trim() || FALLBACK
    const stamp = r?.updated_at ? encodeURIComponent(String(r.updated_at)) : ''
    return stamp ? `${src}${src.includes('?') ? '&' : '?'}v=${stamp}` : src
  } catch (error) {
    console.error('[paginas-inicio] MySQL:', error)
    return FALLBACK
  }
}
