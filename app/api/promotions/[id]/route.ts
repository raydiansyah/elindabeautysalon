/**
 * Module: Promotion item API
 * Purpose: Read one promotion with redemption history, or update/delete it with admin authorization.
 * Used by: Admin promotion management UI.
 * Dependencies: Clerk authz, Drizzle Neon client, promotions/redemptions schema, Zod validation.
 * Public functions: GET(), PUT(), DELETE().
 * Side effects: PUT updates and DELETE removes one promotion in Neon PostgreSQL.
 */
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { promotions, redemptions } from '@/lib/db/schema'
import { requireAdminUser, requireOperationalUser } from '@/lib/authz'
import { promotionPatchSchema } from '@/lib/promotions/validation'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'

type RouteContext = { params: Promise<{ id: string }> }

function errorResponse(error: unknown) {
  if (error instanceof Response) return apiError(error.status === 404 ? 'NOT_FOUND' : 'BAD_REQUEST', error.status === 404 ? 'Promo tidak ditemukan' : 'ID promo tidak valid', error.status)
  console.error('Promotion item API error:', error)
  return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan server' } }, { status: 500 })
}

async function getId(context: RouteContext) {
  const id = Number((await context.params).id)
  if (!Number.isInteger(id) || id < 1) throw new Response('Invalid promotion id', { status: 400 })
  return id
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireOperationalUser()
    const id = await getId(context)
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id)).limit(1)
    if (!promotion) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Promo tidak ditemukan' } }, { status: 404 })
    const history = await db.select().from(redemptions).where(eq(redemptions.promoId, id)).orderBy(redemptions.redeemedAt)
    return NextResponse.json({ success: true, data: { promotion, redemptions: history } })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireAdminUser()
    const id = await getId(context)
    const parsed = promotionPatchSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Data promo tidak valid', details: parsed.error.flatten() } }, { status: 422 })
    const [existing] = await db.select().from(promotions).where(eq(promotions.id, id)).limit(1)
    if (!existing) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Promo tidak ditemukan' } }, { status: 404 })
    const now = new Date()
    const protectedAfterRedemption = ['couponCode', 'type', 'discountValue', 'minTransaction', 'maxDiscount', 'startsAt', 'endsAt', 'quota'] as const
    if ((existing.status === 'expired' || existing.endsAt <= now) && Object.keys(parsed.data).some((field) => field !== 'status' && field !== 'name' && field !== 'description' && field !== 'bannerUrl')) {
      return NextResponse.json({ success: false, error: { code: 'PROMOTION_EXPIRED', message: 'Promo yang sudah berakhir hanya dapat memperbarui nama, deskripsi, banner, atau status' } }, { status: 409 })
    }
    if (existing.redemptionCount > 0 && protectedAfterRedemption.some((field) => field in parsed.data)) {
      return NextResponse.json({ success: false, error: { code: 'PROMOTION_HAS_REDEMPTIONS', message: 'Field inti promo tidak dapat diubah setelah digunakan' } }, { status: 409 })
    }
    const values = {
      ...parsed.data,
      discountValue: parsed.data.discountValue?.toString(),
      minTransaction: parsed.data.minTransaction === undefined ? undefined : parsed.data.minTransaction?.toString() ?? null,
      maxDiscount: parsed.data.maxDiscount === undefined ? undefined : parsed.data.maxDiscount?.toString() ?? null,
      updatedAt: new Date(),
    }
    const [promotion] = await db.update(promotions).set(values).where(eq(promotions.id, id)).returning()
    await recordAudit({ userId: user.userId, actionType: 'update', entityType: 'promotion', entityId: id, before: existing, after: promotion })
    return NextResponse.json({ success: true, data: promotion })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireAdminUser()
    const id = await getId(context)
    const [existing] = await db.select({ status: promotions.status }).from(promotions).where(eq(promotions.id, id)).limit(1)
    if (!existing) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Promo tidak ditemukan' } }, { status: 404 })
    if (existing.status === 'active') return NextResponse.json({ success: false, error: { code: 'PROMOTION_ACTIVE', message: 'Promo aktif tidak dapat dihapus' } }, { status: 400 })
    const [history] = await db.select({ id: redemptions.id }).from(redemptions).where(eq(redemptions.promoId, id)).limit(1)
    if (history) return NextResponse.json({ success: false, error: { code: 'PROMOTION_HAS_REDEMPTIONS', message: 'Promo dengan histori redemption tidak dapat dihapus' } }, { status: 400 })
    const [promotion] = await db.delete(promotions).where(eq(promotions.id, id)).returning()
    await recordAudit({ userId: user.userId, actionType: 'delete', entityType: 'promotion', entityId: id, before: promotion })
    if (!promotion) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Promo tidak ditemukan' } }, { status: 404 })
    return new Response(null, { status: 204 })
  } catch (error) {
    return errorResponse(error)
  }
}
