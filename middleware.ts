import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Bloquea PDFs estáticos /utiles/* cuando la intranet apaga las descargas.
 * Lee el flag vía API de la intranet (Edge no usa mysql2).
 */
export async function middleware(req: NextRequest) {
  const base = String(process.env.INTRANET_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(`${base}/api/public/utiles?t=${Date.now()}`, {
      cache: 'no-store',
      signal: ctrl.signal,
      headers: { Accept: 'application/json', Pragma: 'no-cache' },
    })
    clearTimeout(timer)
    if (res.ok) {
      const data = (await res.json()) as { descargas_habilitadas?: boolean }
      if (data?.descargas_habilitadas === false) {
        return new NextResponse('Las descargas de listas de útiles no están disponibles.', {
          status: 403,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
        })
      }
    }
  } catch {
    /* si la intranet no responde, no cortar el archivo estático */
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/utiles/:path*'],
}
