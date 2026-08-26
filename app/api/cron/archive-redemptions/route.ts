/**
 * Module: Redemption archive scheduler
 * Purpose: Copy redemption records older than 24 months into an archive table without deleting source data.
 * Used by: Vercel Cron on the Hobby/free plan through /api/cron/archive-redemptions.
 * Dependencies: CRON_SECRET, Drizzle Neon client, redemptions and redemptionArchive tables.
 * Public functions: GET().
 * Side effects: Inserts deduplicated historical rows into Neon; never deletes source rows.
 */
import { lt } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redemptionArchive, redemptions } from '@/lib/db/schema'

const RETENTION_MONTHS = 24
const BATCH_SIZE = 500

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid cron secret' } }, { status: 401 })
  }

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS)
  const candidates = await db.select().from(redemptions).where(lt(redemptions.redeemedAt, cutoff)).limit(BATCH_SIZE)

  if (candidates.length === 0) {
    return NextResponse.json({ success: true, data: { archived: 0, cutoff: cutoff.toISOString() } })
  }

  const inserted = await db.insert(redemptionArchive).values(candidates.map((row) => ({
    originalId: row.id,
    promoId: row.promoId,
    customerName: row.customerName,
    customerContact: row.customerContact,
    transactionTotal: row.transactionTotal,
    discountApplied: row.discountApplied,
    redeemedBy: row.redeemedBy,
    redeemedAt: row.redeemedAt,
    createdAt: row.createdAt,
  }))).onConflictDoNothing({ target: redemptionArchive.originalId }).returning({ id: redemptionArchive.id })

  return NextResponse.json({ success: true, data: { archived: inserted.length, scanned: candidates.length, cutoff: cutoff.toISOString() } })
}
