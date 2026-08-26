/**
 * Module: Cloudflare R2 signing service
 * Purpose: Create short-lived upload/download signatures for approved salon images.
 * Used by: POST /api/uploads/presign and GET /api/media/[...key].
 * Dependencies: aws4fetch and R2 server-side environment variables.
 * Public functions: createR2UploadUrl(), createR2DownloadUrl(), buildR2PublicUrl().
 * Side effects: Signs upload/download requests; does not upload or expose credentials.
 */
import { AwsClient } from 'aws4fetch'

export const allowedUploadTypes = ['image/jpeg', 'image/png', 'image/webp'] as const
export const maxUploadBytes = 5 * 1024 * 1024

export function buildR2PublicUrl(key: string) {
  return `/api/media/${key.split('/').map(encodeURIComponent).join('/')}`
}

export function normalizeR2MediaUrl(url: string | null | undefined) {
  if (!url) return url
  const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
  const privateBaseUrl = process.env.CLOUDFLARE_ACCOUNT_ID && process.env.R2_BUCKET_NAME
    ? `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}`
    : null
  const sourceBaseUrl = baseUrl && url.startsWith(`${baseUrl}/`) ? baseUrl : privateBaseUrl
  if (!sourceBaseUrl || !url.startsWith(`${sourceBaseUrl}/`)) return url
  const key = url.slice(sourceBaseUrl.length + 1).split('/').map(encodeURIComponent).join('/')
  return `/api/media/${key}`
}

function createR2SignedUrl(key: string, method: 'GET' | 'PUT', contentType?: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const bucket = process.env.R2_BUCKET_NAME
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  if (!accountId || !bucket || !accessKeyId || !secretAccessKey) return null
  const client = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' })
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`
  return client.sign(new Request(`${endpoint}?X-Amz-Expires=900`, { method, headers: contentType ? { 'Content-Type': contentType } : undefined }), { aws: { signQuery: true } }).then((request) => request.url.toString())
}

export function createR2UploadUrl(key: string, contentType: string) {
  return createR2SignedUrl(key, 'PUT', contentType)
}

export function createR2DownloadUrl(key: string) {
  return createR2SignedUrl(key, 'GET')
}
