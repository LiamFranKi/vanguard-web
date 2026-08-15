import { NextResponse } from 'next/server'
import {
  getVisitaConfigPublica,
  getFallbackVisitaConfig,
} from '@/lib/visitas-config'

/** Evita caché de CDN/navegador: la config cambia desde la intranet en vivo */
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/visitas-config
 * Días y horarios activos (MySQL).
 * - 0 días/horarios activos → 200 con listas vacías y disponible:false (NO fallback)
 * - Error de MySQL → fallback Martes/Jueves
 */
export async function GET() {
  try {
    const config = await getVisitaConfigPublica()
    return NextResponse.json(
      { ...config, generatedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          'CDN-Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('[visitas-config]', error)
    return NextResponse.json(getFallbackVisitaConfig(), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        'CDN-Cache-Control': 'no-store',
      },
    })
  }
}
