/**
 * Module: Gallery collection API
 * Purpose: Serve portfolio images publicly and manage gallery & before/after records for admins.
 * Used by: Public Gallery section and authenticated admin gallery screen.
 * Dependencies: Drizzle gallery schema, Clerk authorization, API response helper, audit log, R2 media URL normalizer.
 * Public functions: GET(), POST().
 * Side effects: GET reads gallery records; POST inserts one record and writes an audit entry.
 */
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { gallery } from '@/lib/db/schema'
import { requireAdminUser, requireOperationalUser } from '@/lib/authz'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'
import { normalizeR2MediaUrl } from '@/lib/r2'

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

export async function GET(request: Request) {
  try {
    const isPublic = new URL(request.url).searchParams.get('public') === 'true'
    if (!isPublic) await requireOperationalUser()
    const data = await db.select().from(gallery).orderBy(asc(gallery.order), asc(gallery.id))
    return NextResponse.json(
      {
        success: true,
        data: data.map((item) => ({
          ...item,
          imageUrl: normalizeR2MediaUrl(item.imageUrl),
          beforeImageUrl: item.beforeImageUrl ? normalizeR2MediaUrl(item.beforeImageUrl) : null,
        })),
      },
      { headers: isPublic ? { 'Cache-Control': 'no-store' } : undefined }
    )
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal memuat galeri', 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdminUser()
    const parsed = parseGalleryInput(await request.json())
    if (parsed.error || !parsed.value) return apiError('VALIDATION_ERROR', parsed.error ?? 'Data galeri tidak valid', 422)
    const [created] = await db.insert(gallery).values(parsed.value).returning()
    await recordAudit({ userId: user.userId, actionType: 'create', entityType: 'gallery', entityId: String(created.id), after: created })
    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal menambahkan galeri', 500)
  }
}
