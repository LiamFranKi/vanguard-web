import { existsSync } from 'fs'
import path from 'path'

function publicRoots(): string[] {
  const extra = [process.env.WEB_VANGUARD_ROOT, '/home/vanguard/web-vanguard'].filter(Boolean)
  return [
    path.join(process.cwd(), 'public'),
    ...extra.map((r) => path.join(String(r), 'public')),
  ]
}

function cleanRel(rel: string) {
  return String(rel || '')
    .replace(/^[/\\]+/, '')
    .replace(/\?.*$/, '')
    .replace(/\.\./g, '')
}

/** Archivo bajo public/ (incluye fotos subidas después del build). */
export function resolvePublicAbs(relOrPublic: string): string | null {
  const rel = cleanRel(relOrPublic)
  if (!rel) return null
  for (const root of publicRoots()) {
    const abs = path.resolve(root, rel)
    const base = path.resolve(root)
    if (abs !== base && !abs.startsWith(base + path.sep)) continue
    if (existsSync(abs)) return abs
  }
  return null
}

export function mimeOf(file: string) {
  const ext = path.extname(file).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.pdf') return 'application/pdf'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  return 'application/octet-stream'
}
