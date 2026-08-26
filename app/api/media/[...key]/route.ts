/**
 * Module: Public R2 media proxy
 * Purpose: Stream approved R2 objects through a server-signed GET request.
 * Used by: Public image URLs returned from the R2 upload API.
 * Dependencies: R2 signing service and NextResponse.
 * Public functions: GET().
 * Side effects: Reads one object from Cloudflare R2; does not expose credentials.
 */
import { NextResponse } from 'next/server'
import { createR2DownloadUrl } from '@/lib/r2'

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: segments } = await params
  const key = segments.map((segment) => decodeURIComponent(segment)).join('/')
  if (!key || key.includes('..')) return NextResponse.json({ success: false, error: { code: 'INVALID_MEDIA_KEY', message: 'Media tidak valid' } }, { status: 400 })
  const downloadUrl = await createR2DownloadUrl(key)
  if (!downloadUrl) return NextResponse.json({ success: false, error: { code: 'STORAGE_NOT_CONFIGURED', message: 'Cloudflare R2 belum dikonfigurasi' } }, { status: 503 })
  const response = await fetch(downloadUrl, { cache: 'no-store' })
  if (!response.ok) return NextResponse.json({ success: false, error: { code: 'MEDIA_NOT_FOUND', message: 'Gambar tidak ditemukan di Cloudflare R2' } }, { status: response.status === 404 ? 404 : 502 })
  return new NextResponse(response.body, { status: 200, headers: { 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Type': response.headers.get('content-type') ?? 'application/octet-stream' } })
}
