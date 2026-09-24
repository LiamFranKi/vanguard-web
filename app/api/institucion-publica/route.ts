import { NextResponse } from 'next/server'
import { obtenerInstitucionPublica } from '@/lib/institucion-publica'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const data = await obtenerInstitucionPublica()
  return NextResponse.json(data)
}
