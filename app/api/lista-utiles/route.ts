import { NextResponse } from 'next/server'
import { getListaUtiles } from '@/lib/lista-utiles'

/** GET /api/lista-utiles — mismo shape que config/lista-utiles.json */
export async function GET() {
  try {
    const data = await getListaUtiles()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[api/lista-utiles]', error)
    return NextResponse.json(
      { error: 'No se pudo cargar la lista de útiles' },
      { status: 500 }
    )
  }
}
