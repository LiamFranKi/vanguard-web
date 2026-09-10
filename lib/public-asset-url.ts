const PREFIXES = ['/inicio/', '/niveles/', '/utiles/', '/documentos/', '/banner/']
const ROOTS = [
  /^\/FONDOBANNER\.jpg$/i,
  /^\/inicial\.jpeg$/i,
  /^\/primaria\.jpeg$/i,
  /^\/secundaria\.jpeg$/i,
]

export function isAllowedPublicRuta(ruta: string): boolean {
  const s = String(ruta || '').trim()
  if (!s.startsWith('/') || s.includes('..')) return false
  const clean = s.split('?')[0]
  return PREFIXES.some((p) => clean.startsWith(p)) || ROOTS.some((re) => re.test(clean))
}

/** URL que Next puede servir en runtime (archivos subidos después del build). */
export function publicFileUrl(
  ruta: string,
  stamp?: string | null,
  opts?: { download?: boolean }
): string {
  const s = String(ruta || '').trim()
  if (!s || s.startsWith('/api/')) return s
  const clean = s.split('?')[0]
  if (!isAllowedPublicRuta(clean)) return s
  const params = new URLSearchParams()
  params.set('ruta', clean)
  if (stamp) params.set('v', String(stamp))
  if (opts?.download) params.set('dl', '1')
  return `/api/web-public-file?${params.toString()}`
}
