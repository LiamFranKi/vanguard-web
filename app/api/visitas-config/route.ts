import { NextResponse } from 'next/server'
import { getVisitaConfigPublica } from '@/lib/visitas-config'

/**
 * GET /api/visitas-config
 * Días y horarios activos para el formulario (desde MySQL).
 */
export async function GET() {
  try {
    const config = await getVisitaConfigPublica()
    return NextResponse.json(config, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[visitas-config]', error)
    const { getFallbackVisitaConfig } = await import('@/lib/visitas-config')
    return NextResponse.json(getFallbackVisitaConfig(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
