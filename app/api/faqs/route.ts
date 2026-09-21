import { NextRequest, NextResponse } from 'next/server'
import { FAQ_DESTINOS, FaqDestino, faqTieneDestino, getFaqsData } from '@/lib/faqs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/faqs
 * Por defecto solo las marcadas para el menú Web.
 * ?destino=web|inicial|primaria|secundaria
 */
export async function GET(req: NextRequest) {
  try {
    const raw = String(req.nextUrl.searchParams.get('destino') || 'web')
      .trim()
      .toLowerCase()
    const destino: FaqDestino = (FAQ_DESTINOS as readonly string[]).includes(raw)
      ? (raw as FaqDestino)
      : 'web'
    const data = await getFaqsData()
    const faqs = data.faqs.filter((faq) => faqTieneDestino(faq, destino))
    return NextResponse.json(
      { ...data, faqs },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('[api/faqs]', error)
    return NextResponse.json(
      { error: 'No se pudieron cargar las preguntas frecuentes' },
      { status: 500 }
    )
  }
}
