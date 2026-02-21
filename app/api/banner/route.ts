import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Evitar cache para que cambios en banner.json se reflejen de inmediato
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'banner.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const bannerData = JSON.parse(data)
    return NextResponse.json(bannerData)
  } catch (error) {
    console.error('Error leyendo config/banner.json:', error)
    return NextResponse.json(
      { error: 'Error al cargar configuración del banner' },
      { status: 500 }
    )
  }
}

