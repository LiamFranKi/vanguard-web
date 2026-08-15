import { NextResponse } from 'next/server'
import {
  getVisitaConfigPublica,
  getFallbackVisitaConfig,
} from '@/lib/visitas-config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  'CDN-Cache-Control': 'no-store',
  'Cloudflare-CDN-Cache-Control': 'no-store',
}

/**
 * Ruta NUEVA (evita caché CDN de /api/visitas-config antigua).
 * GET /api/visitas-disponibilidad
 */
export async function GET() {
  try {
    const config = await getVisitaConfigPublica()
    return NextResponse.json(config, { headers: NO_CACHE })
  } catch (error) {
    console.error('[visitas-disponibilidad]', error)
    return NextResponse.json(getFallbackVisitaConfig(), { headers: NO_CACHE })
  }
}
