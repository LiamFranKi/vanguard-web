import { NextResponse } from 'next/server'
import { obtenerContactoInstitucional } from '@/lib/contacto-institucional'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const contacto = await obtenerContactoInstitucional()
  return NextResponse.json(contacto, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
