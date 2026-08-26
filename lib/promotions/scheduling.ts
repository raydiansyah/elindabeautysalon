/**
 * Module: Promotion scheduling service
 * Purpose: Apply deterministic scheduled and expired promotion state transitions.
 * Used by: Cron route and future admin maintenance jobs.
 * Dependencies: Drizzle Neon client and promotions schema.
 * Public functions: syncPromotionStatuses().
 * Side effects: Updates promotion status rows in Neon PostgreSQL.
 */
import { and, eq, lte, lt } from 'drizzle-orm'
import { db } from '@/lib/db'
import { promotions } from '@/lib/db/schema'

export async function syncPromotionStatuses(now = new Date()) {
  const [activated, expired] = await Promise.all([
    db.update(promotions).set({ status: 'active', updatedAt: now }).where(and(eq(promotions.status, 'scheduled'), lte(promotions.startsAt, now))).returning({ id: promotions.id }),
    db.update(promotions).set({ status: 'expired', updatedAt: now }).where(and(eq(promotions.status, 'active'), lt(promotions.endsAt, now))).returning({ id: promotions.id }),
  ])
  return { activated: activated.length, expired: expired.length }
}
