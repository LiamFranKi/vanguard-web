import { NextResponse } from 'next/server'
import {
  getVisitaConfigPublica,
  getFallbackVisitaConfig,
} from '@/lib/visitas-config'

/**
 * GET /api/visitas-config
 * Días y horarios activos (MySQL).
 * - 0 días/horarios activos → 200 con listas vacías y disponible:false (NO fallback)
 * - Error de MySQL → fallback Martes/Jueves
 */
export async function GET() {
  try {
    const config = await getVisitaConfigPublica()
    return NextResponse.json(config, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[visitas-config]', error)
    return NextResponse.json(getFallbackVisitaConfig(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
