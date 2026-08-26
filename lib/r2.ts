/**
 * Module: Cloudflare R2 signing service
 * Purpose: Create short-lived presigned upload URLs for promotion banners.
 * Used by: POST /api/uploads/presign.
 * Dependencies: aws4fetch and R2 server-side environment variables.
 * Public functions: createR2UploadUrl().
 * Side effects: Signs an upload request; does not upload or expose credentials.
 */
import { AwsClient } from 'aws4fetch'

export const allowedUploadTypes = ['image/jpeg', 'image/png', 'image/webp'] as const
export const maxUploadBytes = 5 * 1024 * 1024

export function createR2UploadUrl(key: string, contentType: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const bucket = process.env.R2_BUCKET_NAME
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  if (!accountId || !bucket || !accessKeyId || !secretAccessKey) return null
  const client = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' })
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`
  return client.sign(new Request(`${endpoint}?X-Amz-Expires=900`, { method: 'PUT', headers: { 'Content-Type': contentType } }), { aws: { signQuery: true } }).then((request) => request.url.toString())
}
