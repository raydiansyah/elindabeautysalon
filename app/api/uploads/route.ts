/**
 * Module: Server-side R2 image upload API
 * Purpose: Receive validated image files and upload them to R2 without browser CORS preflight.
 * Used by: Admin settings, gallery, course, and promotion forms.
 * Dependencies: Clerk admin authorization, R2 signing service, crypto UUID, NextResponse.
 * Public functions: POST().
 * Side effects: Reads a multipart file and writes one object to Cloudflare R2.
 */
import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/authz'
import { allowedUploadTypes, buildR2PublicUrl, createR2UploadUrl, maxUploadBytes } from '@/lib/r2'

export async function POST(request: Request) {
  await requireAdminUser()
  const form = await request.formData()
  const file = form.get('file')
  const contentType = file instanceof File ? file.type.toLowerCase() : ''
  const size = file instanceof File ? file.size : 0
  if (!(file instanceof File) || !allowedUploadTypes.includes(contentType as typeof allowedUploadTypes[number])) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Tipe file harus JPEG, PNG, atau WebP' } }, { status: 422 })
  if (!Number.isInteger(size) || size < 1 || size > maxUploadBytes) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Ukuran file maksimal 5 MB' } }, { status: 422 })
  const requestedPurpose = form.get('purpose')
  const purpose = ['hero', 'about', 'logo', 'gallery', 'course', 'promotions'].includes(String(requestedPurpose)) ? String(requestedPurpose) : 'promotions'
  const extension = contentType === 'image/jpeg' ? 'jpg' : contentType.split('/')[1]
  const key = `${purpose}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`
  const uploadUrl = await createR2UploadUrl(key, contentType)
  const publicUrl = buildR2PublicUrl(key)
  if (!uploadUrl || !publicUrl) return NextResponse.json({ success: false, error: { code: 'STORAGE_NOT_CONFIGURED', message: 'Cloudflare R2 belum dikonfigurasi' } }, { status: 503 })
  const uploadResponse = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: await file.arrayBuffer() })
  if (!uploadResponse.ok) return NextResponse.json({ success: false, error: { code: 'STORAGE_UPLOAD_FAILED', message: 'Gagal mengunggah gambar ke Cloudflare R2' } }, { status: 502 })
  return NextResponse.json({ success: true, data: { key, publicUrl } })
}
