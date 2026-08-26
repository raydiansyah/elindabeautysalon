/**
 * Module: Promo redemption API
 * Purpose: Validate promo eligibility, process redemptions atomically, and list redemption history.
 * Used by: Staff redemption screen and admin monitoring.
 * Dependencies: Clerk authz, Drizzle Neon transaction, promotions/redemptions schema, Zod.
 * Public functions: GET(), POST().
 * Side effects: POST locks and updates a promotion quota/count and inserts redemption history.
 */
import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { promotions, redemptions } from '@/lib/db/schema'
import { requireOperationalUser } from '@/lib/authz'
import { redemptionInputSchema } from '@/lib/promotions/validation'
import { notifyAdmins } from '@/lib/notifications/service'
import { apiError } from '@/lib/api-response'
import { consumeRateLimit } from '@/lib/rate-limit'
import { recordAudit } from '@/lib/audit'
import { calculateDiscount } from '@/lib/promotions/calculation'

function failure(error: unknown) {
  if (error instanceof Response) {
    const status = error.status
    const code = status === 409 ? 'CONFLICT' : 'BAD_REQUEST'
    const message = status === 409 ? 'Kuota promo baru saja habis, silakan ulangi' : 'Redemption tidak dapat diproses'
    return apiError(code, message, status)
  }
  console.error('Redemption API error:', error)
  return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Redemption gagal diproses' } }, { status: 500 })
}

function eligibility(promotion: typeof promotions.$inferSelect, transactionTotal?: number) {
  const now = Date.now()
  if (promotion.status !== 'active' || promotion.startsAt.getTime() > now || promotion.endsAt.getTime() < now) return 'Promo tidak aktif atau sudah berakhir'
  if (promotion.quota !== null && promotion.redemptionCount >= promotion.quota) return 'Kuota promo sudah habis'
  if (transactionTotal !== undefined && promotion.minTransaction && transactionTotal < Number(promotion.minTransaction)) return `Minimum transaksi Rp${Number(promotion.minTransaction).toLocaleString('id-ID')}`
  return null
}

export async function GET(request: Request) {
  try {
    const user = await requireOperationalUser()
    const url = new URL(request.url)
    const couponCode = url.searchParams.get('couponCode')
    if (couponCode) {
      const rate = consumeRateLimit(`coupon:${user.userId}`, 60, 60_000)
      if (!rate.allowed) return apiError('RATE_LIMITED', 'Terlalu banyak validasi promo, coba lagi nanti', 429, { retryAfter: rate.retryAfter })
      const [promotion] = await db.select().from(promotions).where(eq(promotions.couponCode, couponCode)).limit(1)
      if (!promotion) return NextResponse.json({ success: true, data: { valid: false, reason: 'Kode promo tidak ditemukan' } })
      return NextResponse.json({ success: true, data: { valid: !eligibility(promotion), reason: eligibility(promotion), promotion: { id: promotion.id, name: promotion.name, type: promotion.type, discountValue: promotion.discountValue, quota: promotion.quota, redemptionCount: promotion.redemptionCount } } })
    }
    const promoId = url.searchParams.get('promo_id')
    const customerContact = url.searchParams.get('pelanggan_kontak')
    const dateFrom = url.searchParams.get('date_from')
    const dateTo = url.searchParams.get('date_to')
    const page = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '20', 10) || 20))
    const filters = [
      user.role === 'admin' ? undefined : eq(redemptions.redeemedBy, user.userId),
      promoId && Number.isInteger(Number(promoId)) ? eq(redemptions.promoId, Number(promoId)) : undefined,
      customerContact ? eq(redemptions.customerContact, customerContact) : undefined,
      dateFrom && !Number.isNaN(new Date(dateFrom).getTime()) ? gte(redemptions.redeemedAt, new Date(dateFrom)) : undefined,
      dateTo && !Number.isNaN(new Date(dateTo).getTime()) ? lte(redemptions.redeemedAt, new Date(dateTo)) : undefined,
    ].filter(Boolean)
    const where = filters.length ? and(...filters) : undefined
    const [data, [{ total }]] = await Promise.all([
      db.select().from(redemptions).where(where).orderBy(desc(redemptions.redeemedAt)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(redemptions).where(where),
    ])
    const pagination = { total: Number(total), page, limit, totalPages: Math.ceil(Number(total) / limit) }
    return NextResponse.json({ success: true, data, redemptions: data, pagination })
  } catch (error) {
    return failure(error)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireOperationalUser()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
    const rate = consumeRateLimit(`redemption:${ip}`, 10, 60_000)
    if (!rate.allowed) return apiError('RATE_LIMITED', 'Terlalu banyak redemption, coba lagi nanti', 429, { retryAfter: rate.retryAfter })
    const parsed = redemptionInputSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Data redemption tidak valid', details: parsed.error.flatten() } }, { status: 422 })
    const result = await db.transaction(async (tx) => {
      const [promotion] = await tx.select().from(promotions).where(eq(promotions.couponCode, parsed.data.couponCode)).for('update')
      if (!promotion) throw new Response(null, { status: 400 })
      const reason = eligibility(promotion, parsed.data.transactionTotal)
      if (reason) throw new Response(null, { status: 400 })
      const discountApplied = calculateDiscount(promotion, parsed.data.transactionTotal)
      const [redemption] = await tx.insert(redemptions).values({ promoId: promotion.id, customerName: parsed.data.customerName, customerContact: parsed.data.customerContact, transactionTotal: parsed.data.transactionTotal.toString(), discountApplied: discountApplied.toString(), redeemedBy: user.userId }).returning()
      const [updatedPromotion] = await tx.update(promotions).set({ redemptionCount: sql`${promotions.redemptionCount} + 1`, updatedAt: new Date() }).where(and(eq(promotions.id, promotion.id), promotion.quota === null ? undefined : sql`${promotions.redemptionCount} < ${promotion.quota}`)).returning()
      if (!updatedPromotion) throw new Response(null, { status: 409 })
      return { redemption, promotion: updatedPromotion }
    })
    await recordAudit({ userId: user.userId, actionType: 'redemption', entityType: 'redemption', entityId: result.redemption.id, after: result.redemption })
    await notifyAdmins({ type: 'redemption', title: 'Redemption baru', message: `${result.redemption.customerName} menggunakan promo ${result.promotion.name}.`, href: '/admin/redemptions' })
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    return failure(error)
  }
}
