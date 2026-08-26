/**
 * Module: Promotion pause API
 * Purpose: Pause an active promotion through an admin-only endpoint.
 * Used by: Admin promotion management UI.
 * Dependencies: Clerk authorization, Drizzle Neon client, promotions schema.
 * Public functions: POST().
 * Side effects: Changes one active promotion status to paused in PostgreSQL.
 */
import { and, eq } from 'drizzle-orm'
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
  const [before] = await db.select().from(promotions).where(eq(promotions.id, id)).limit(1)
  const [updated] = await db.update(promotions).set({ status: 'paused', updatedAt: new Date() }).where(and(eq(promotions.id, id), eq(promotions.status, 'active'))).returning()
  if (!updated) return NextResponse.json({ success: false, error: { code: 'INVALID_STATUS', message: 'Hanya promo active yang dapat dijeda' } }, { status: 400 })
  await recordAudit({ userId: user.userId, actionType: 'pause', entityType: 'promotion', entityId: id, before, after: updated })
  return NextResponse.json({ success: true, data: { promotion: updated } })
}
