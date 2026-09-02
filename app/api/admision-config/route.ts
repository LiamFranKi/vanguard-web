import { NextResponse } from 'next/server'
import { getAdmisionConfigPublica, getFallbackAdmisionConfig } from '@/lib/admision-config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  'CDN-Cache-Control': 'no-store',
  'Cloudflare-CDN-Cache-Control': 'no-store',
}

export async function GET() {
  try {
    const config = await getAdmisionConfigPublica()
    return NextResponse.json(config, { headers: NO_CACHE })
  } catch (error) {
    console.error('[admision-config]', error)
    return NextResponse.json(getFallbackAdmisionConfig(), { headers: NO_CACHE })
  }
}
