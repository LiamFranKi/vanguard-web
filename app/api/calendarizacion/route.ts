import { NextRequest, NextResponse } from 'next/server'
import { getCalendarizacion } from '@/lib/calendarizacion'

/**
 * GET /api/calendarizacion?anio=2026
 * Mismo shape que config/calendarizacion.json (+ source, conceptos opcionales).
 */
export async function GET(request: NextRequest) {
  try {
    const anioParam = request.nextUrl.searchParams.get('anio')
    const anio = anioParam ? parseInt(anioParam, 10) : undefined
    const data = await getCalendarizacion(
      anio && !Number.isNaN(anio) ? anio : undefined
    )
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[api/calendarizacion]', error)
    return NextResponse.json(
      { error: 'No se pudo cargar la calendarización' },
      { status: 500 }
    )
  }
}
