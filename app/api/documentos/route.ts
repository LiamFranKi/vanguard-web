import { NextResponse } from 'next/server'
import { getDocumentos } from '@/lib/documentos'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** GET /api/documentos — mismo shape que config/documentos.json */
export async function GET() {
  try {
    const data = await getDocumentos()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[api/documentos]', error)
    return NextResponse.json(
      { error: 'No se pudieron cargar los documentos' },
      { status: 500 }
    )
  }
}
