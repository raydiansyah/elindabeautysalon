/**
 * Module: Promotion scheduler endpoint
 * Purpose: Run scheduled activation and expiry transitions from Vercel Cron.
 * Used by: Vercel Cron configuration at /api/cron/promotions.
 * Dependencies: CRON_SECRET and promotion scheduling service.
 * Public functions: GET().
 * Side effects: Updates promotion statuses in Neon PostgreSQL.
 */
import { NextResponse } from 'next/server'
import { syncPromotionStatuses } from '@/lib/promotions/scheduling'

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid cron secret' } }, { status: 401 })
  const result = await syncPromotionStatuses()
  return NextResponse.json({ success: true, data: result })
}
