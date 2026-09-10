import { NextRequest } from 'next/server'
import { serveWebPublicFile } from '@/lib/serve-web-public-file'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  return serveWebPublicFile(req)
}
