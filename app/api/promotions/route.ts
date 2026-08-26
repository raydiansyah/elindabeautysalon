/**
 * Module: Promotion collection API
 * Purpose: List filtered promotions with bounded pagination and create promotions for admins.
 * Used by: Admin promotion management UI and future dashboard clients.
 * Dependencies: Clerk authz, Drizzle Neon client, promotions schema, Zod validation.
 * Public functions: GET(), POST().
 * Side effects: Reads promotions; POST writes one promotion to Neon PostgreSQL.
 */
import { NextResponse } from 'next/server'
import { and, asc, count, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { promotions } from '@/lib/db/schema'
import { requireAdminUser, requireOperationalUser } from '@/lib/authz'
import { promotionInputSchema } from '@/lib/promotions/validation'
import { notifyAdmins, sendPromotionEmail } from '@/lib/notifications/service'
import { recordAudit } from '@/lib/audit'
import { normalizeR2MediaUrl } from '@/lib/r2'

function errorResponse(error: unknown) {
  if (error instanceof Response) return error
  console.error('Promotion API error:', error)
  return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan server' } }, { status: 500 })
}

export async function GET(request: Request) {
  try {
    await requireOperationalUser()
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const page = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '20', 10) || 20))
    const sortBy = url.searchParams.get('sort_by')
    const order = url.searchParams.get('order') === 'asc' ? 'asc' : 'desc'
    const filters = [status ? eq(promotions.status, status) : undefined, type ? eq(promotions.type, type) : undefined].filter(Boolean)
    const where = filters.length ? and(...filters) : undefined
    const sortColumn = sortBy === 'name' ? promotions.name : sortBy === 'ends_at' ? promotions.endsAt : sortBy === 'status' ? promotions.status : promotions.createdAt
    const [data, [{ total }]] = await Promise.all([
      db.select().from(promotions).where(where).orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(promotions).where(where),
    ])
    const pagination = { total: Number(total), page, limit, totalPages: Math.ceil(Number(total) / limit) }
    const normalizedData = data.map((promotion) => ({ ...promotion, bannerUrl: normalizeR2MediaUrl(promotion.bannerUrl) }))
    return NextResponse.json({ success: true, data: normalizedData, promotions: normalizedData, pagination })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdminUser()
    const parsed = promotionInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Data promo tidak valid', details: parsed.error.flatten() } }, { status: 422 })
    }
    const [promotion] = await db.insert(promotions).values({
      ...parsed.data,
      discountValue: parsed.data.discountValue.toString(),
      minTransaction: parsed.data.minTransaction?.toString() ?? null,
      maxDiscount: parsed.data.maxDiscount?.toString() ?? null,
      createdBy: user.userId,
    }).returning()
    await recordAudit({ userId: user.userId, actionType: 'create', entityType: 'promotion', entityId: promotion.id, after: promotion })
    await Promise.allSettled([
      notifyAdmins({ type: 'new_promotion', title: 'Promo baru dibuat', message: `${promotion.name} berhasil dibuat.`, href: `/admin/promotions` }),
      sendPromotionEmail({ subject: `Promo baru: ${promotion.name}`, html: `<h1>${promotion.name}</h1><p>${promotion.description}</p>` }),
    ])
    return NextResponse.json({ success: true, data: promotion }, { status: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
