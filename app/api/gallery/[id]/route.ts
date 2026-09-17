/**
 * Module: Gallery item API
 * Purpose: Update and delete one portfolio image record or Before & After transformation.
 * Used by: Authenticated admin gallery screen.
 * Dependencies: Drizzle gallery schema, Clerk authorization, API response helper, audit log.
 * Public functions: PUT(), DELETE().
 * Side effects: Writes or deletes one gallery record and appends an audit entry.
 */
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { gallery } from '@/lib/db/schema'
import { requireAdminUser } from '@/lib/authz'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'

function parseGalleryInput(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Data galeri tidak valid' }
  const value = input as Record<string, unknown>
  const imageUrl = typeof value.imageUrl === 'string' ? value.imageUrl.trim() : ''
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  const category = typeof value.category === 'string' ? value.category.trim() : ''
  const beforeImageUrl = typeof value.beforeImageUrl === 'string' && value.beforeImageUrl.trim() ? value.beforeImageUrl.trim() : null
  const description = typeof value.description === 'string' && value.description.trim() ? value.description.trim() : null
  const order = Number(value.order)
  if (!imageUrl || !title || !category || !Number.isInteger(order) || order < 0) return { error: 'URL, judul, kategori, dan urutan wajib diisi dengan benar' }
  return { value: { imageUrl, title, category, order, beforeAfter: Boolean(value.beforeAfter), beforeImageUrl, description } }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdminUser()
    const { id } = await params
    const galleryId = Number(id)
    const [before] = await db.select().from(gallery).where(eq(gallery.id, galleryId)).limit(1)
    if (!before) return apiError('NOT_FOUND', 'Item galeri tidak ditemukan', 404)
    const parsed = parseGalleryInput(await request.json())
    if (parsed.error || !parsed.value) return apiError('VALIDATION_ERROR', parsed.error ?? 'Data galeri tidak valid', 422)
    const [updated] = await db.update(gallery).set(parsed.value).where(eq(gallery.id, galleryId)).returning()
    await recordAudit({ userId: user.userId, actionType: 'update', entityType: 'gallery', entityId: id, before, after: updated })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal memperbarui galeri', 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdminUser()
    const { id } = await params
    const galleryId = Number(id)
    const [before] = await db.select().from(gallery).where(eq(gallery.id, galleryId)).limit(1)
    if (!before) return apiError('NOT_FOUND', 'Item galeri tidak ditemukan', 404)
    await db.delete(gallery).where(eq(gallery.id, galleryId))
    await recordAudit({ userId: user.userId, actionType: 'delete', entityType: 'gallery', entityId: id, before })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal menghapus galeri', 500)
  }
}
