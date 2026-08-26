/**
 * Module: Public promotions API
 * Purpose: Return active promotions currently inside their publication window with optional type filtering.
 * Used by: Public landing promotions section.
 * Dependencies: Drizzle Neon client and promotions schema.
 * Public functions: GET().
 * Side effects: Reads public promotion fields from Neon; no authentication or writes.
 */
import { and, eq, gte, lte } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { promotions } from '@/lib/db/schema'

export async function GET(request: Request) {
  const now = new Date()
  const type = new URL(request.url).searchParams.get('type')
  const data = await db.select().from(promotions).where(and(eq(promotions.status, 'active'), lte(promotions.startsAt, now), gte(promotions.endsAt, now), type ? eq(promotions.type, type) : undefined))
  return NextResponse.json({ success: true, data }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
}
