import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { mimeOf, resolvePublicAbs } from '@/lib/web-public-file'
import { isAllowedPublicRuta } from '@/lib/public-asset-url'
import { utilesDescargasHabilitadas } from '@/lib/lista-utiles'

export async function serveWebPublicFile(req: NextRequest) {
  const raw = String(req.nextUrl.searchParams.get('ruta') || '').trim()
  if (!isAllowedPublicRuta(raw)) {
    return new NextResponse('Ruta no permitida', { status: 400 })
  }
  const clean = raw.split('?')[0]
  if (clean.startsWith('/utiles/')) {
    const on = await utilesDescargasHabilitadas()
    if (!on) {
      return new NextResponse('Las descargas de listas de útiles no están disponibles.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      })
    }
  }
  const abs = resolvePublicAbs(clean)
  if (!abs) {
    return new NextResponse('Archivo no encontrado', { status: 404 })
  }
  const buf = await readFile(abs)
  const type = mimeOf(abs)
  const asDownload = req.nextUrl.searchParams.get('dl') === '1'
  const headers: Record<string, string> = {
    'Content-Type': type,
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  }
  if (type === 'application/pdf') {
    headers['Content-Disposition'] = `${asDownload ? 'attachment' : 'inline'}; filename="${path.basename(abs)}"`
  }
  return new NextResponse(buf, { headers })
}
