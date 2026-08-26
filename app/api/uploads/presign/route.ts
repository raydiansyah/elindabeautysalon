/**
 * Module: R2 banner upload API
 * Purpose: Issue validated, short-lived presigned PUT URLs for approved salon images.
 * Used by: Admin image upload forms.
 * Dependencies: Clerk admin authorization, R2 signing service, crypto UUID, API response helper.
 * Public functions: POST().
 * Side effects: Creates a temporary signed URL; the client uploads directly to R2.
 */
import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/authz'
import { apiError } from '@/lib/api-response'
import { allowedUploadTypes, buildR2PublicUrl, createR2UploadUrl, maxUploadBytes } from '@/lib/r2'

export async function POST(request: Request) {
  await requireAdminUser()
  const body = await request.json() as { contentType?: string; size?: number; purpose?: string }
  const contentType = body.contentType?.toLowerCase()
  if (!contentType || !allowedUploadTypes.includes(contentType as typeof allowedUploadTypes[number])) return apiError('VALIDATION_ERROR', 'Tipe file harus JPEG, PNG, atau WebP', 422)
  if (!Number.isInteger(body.size) || body.size! < 1 || body.size! > maxUploadBytes) return apiError('VALIDATION_ERROR', 'Ukuran file maksimal 5 MB', 422)
  const purpose = ['hero', 'about', 'logo', 'gallery', 'course'].includes(body.purpose ?? '') ? body.purpose : 'promotions'
  const extension = contentType === 'image/jpeg' ? 'jpg' : contentType.split('/')[1]
  const key = `${purpose}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`
  const uploadUrl = await createR2UploadUrl(key, contentType)
  const publicUrl = buildR2PublicUrl(key)
  if (!uploadUrl || !publicUrl) return NextResponse.json({ success: false, error: { code: 'STORAGE_NOT_CONFIGURED', message: 'Cloudflare R2 belum dikonfigurasi' } }, { status: 503 })
  return NextResponse.json({ success: true, data: { key, uploadUrl, publicUrl, expiresIn: 900 } })
}
