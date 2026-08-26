/**
 * Module: Promotion activation API
 * Purpose: Activate a draft or scheduled promotion when its start time has arrived.
 * Used by: Admin promotion management UI and scheduled operations.
 * Dependencies: Clerk authorization, Drizzle Neon client, promotions schema.
 * Public functions: POST().
 * Side effects: Changes one promotion status to active in PostgreSQL.
 */
import { and, eq, lte, or } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { promotions } from '@/lib/db/schema'
import { requireAdminUser } from '@/lib/authz'
import { recordAudit } from '@/lib/audit'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_request: Request, context: RouteContext) {
  const user = await requireAdminUser()
  const id = Number((await context.params).id)
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: { code: 'INVALID_ID', message: 'ID promo tidak valid' } }, { status: 400 })

  const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id)).limit(1)
  if (!promotion) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Promo tidak ditemukan' } }, { status: 404 })
  if (promotion.status !== 'draft' && promotion.status !== 'scheduled') return NextResponse.json({ success: false, error: { code: 'INVALID_STATUS', message: 'Hanya promo draft atau scheduled yang dapat diaktifkan' } }, { status: 400 })
  if (promotion.startsAt > new Date()) return NextResponse.json({ success: false, error: { code: 'START_DATE_NOT_REACHED', message: 'Tanggal mulai promo belum tercapai' } }, { status: 400 })

  const [updated] = await db.update(promotions).set({ status: 'active', updatedAt: new Date() }).where(and(eq(promotions.id, id), or(eq(promotions.status, 'draft'), eq(promotions.status, 'scheduled')), lte(promotions.startsAt, new Date()))).returning()
  if (!updated) return NextResponse.json({ success: false, error: { code: 'ACTIVATION_CONFLICT', message: 'Promo berubah saat proses aktivasi' } }, { status: 409 })
  await recordAudit({ userId: user.userId, actionType: 'activate', entityType: 'promotion', entityId: id, before: promotion, after: updated })
  return NextResponse.json({ success: true, data: { promotion: updated } })
}
