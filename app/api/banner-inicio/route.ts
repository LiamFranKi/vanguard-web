import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { getPool } from '@/lib/db'
import { mimeOf, resolvePublicAbs } from '@/lib/web-public-file'
import { RowDataPacket } from 'mysql2/promise'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function rutaDesdeMysql(): Promise<string> {
  const db = getPool()
  if (!db) return 'FONDOBANNER.jpg'
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT banner_ruta FROM web_paginas_inicio WHERE id = 1 LIMIT 1`
    )
    const raw = String(rows?.[0]?.banner_ruta || '').trim()
    return raw.replace(/^[/\\]+/, '').replace(/\?.*$/, '') || 'FONDOBANNER.jpg'
  } catch {
    return 'FONDOBANNER.jpg'
  }
}

export async function GET() {
  const rel = await rutaDesdeMysql()
  const abs = resolvePublicAbs(rel) || resolvePublicAbs('FONDOBANNER.jpg')
  if (!abs) {
    return new NextResponse('Banner no encontrado', { status: 404 })
  }
  const buf = await readFile(abs)
  return new NextResponse(buf, {
    headers: {
      'Content-Type': mimeOf(abs),
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}
