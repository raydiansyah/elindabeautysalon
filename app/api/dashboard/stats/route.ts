/**
 * Module: Dashboard promotion statistics API
 * Purpose: Aggregate current promotion views, redemptions, conversion, and discount impact.
 * Used by: Admin dashboard metrics cards and monitoring widgets.
 * Dependencies: Clerk authz, Drizzle Neon client, promotions/redemptions schema.
 * Public functions: GET().
 * Side effects: Reads aggregate data from Neon; no writes.
 */
import { count, desc, eq, gte, sql, sum } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { promotions, redemptions } from '@/lib/db/schema'
import { requireOperationalUser } from '@/lib/authz'

export async function GET() {
  try {
    await requireOperationalUser()
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const [[promotionStats], [redemptionStats], redemptionByPromo, discountByMonth] = await Promise.all([
      db.select({ active: count(), views: sum(promotions.viewCount), redemptions: sum(promotions.redemptionCount) }).from(promotions).where(eq(promotions.status, 'active')),
      db.select({ count: count(), discountGiven: sum(redemptions.discountApplied) }).from(redemptions).where(gte(redemptions.redeemedAt, monthStart)),
      db.select({ promoId: redemptions.promoId, count: count(), discountGiven: sum(redemptions.discountApplied) }).from(redemptions).groupBy(redemptions.promoId).orderBy(desc(count())),
      db.select({ month: sql<string>`to_char(date_trunc('month', ${redemptions.redeemedAt}), 'YYYY-MM')`, discountGiven: sum(redemptions.discountApplied) }).from(redemptions).groupBy(sql`date_trunc('month', ${redemptions.redeemedAt})`).orderBy(sql`date_trunc('month', ${redemptions.redeemedAt})`),
    ])
    const views = Number(promotionStats?.views || 0)
    const redemptionCount = Number(promotionStats?.redemptions || 0)
    const data = {
      totalPromoAktif: Number(promotionStats?.active || 0),
      totalView: views,
      totalRedemption: redemptionCount,
      totalRedemptionBulanIni: Number(redemptionStats?.count || 0),
      conversionRate: views ? Number(((redemptionCount / views) * 100).toFixed(2)) : 0,
      totalDiskonGiven: Number(redemptionStats?.discountGiven || 0),
      redemptionsPerPromo: redemptionByPromo,
      diskonPerBulan: discountByMonth,
    }
    return NextResponse.json({ success: true, data, ...data })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Statistik tidak tersedia' } }, { status: 500 })
  }
}
