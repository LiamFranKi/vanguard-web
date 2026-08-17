import { NextResponse } from 'next/server'
import { getFaqsData } from '@/lib/faqs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/faqs
 * Lista plana con categoria (mismo shape que config/faqs.json) + categorias.
 */
export async function GET() {
  try {
    const data = await getFaqsData()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[api/faqs]', error)
    return NextResponse.json(
      { error: 'No se pudieron cargar las preguntas frecuentes' },
      { status: 500 }
    )
  }
}
