/**
 * Module: Services collection API
 * Purpose: Read the public service catalog and validate service creation payloads.
 * Used by: Public service section and admin service management.
 * Dependencies: Drizzle services schema, service validation, API response helper.
 * Public functions: GET(), POST().
 * Side effects: POST inserts one validated service into PostgreSQL.
 */
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { validateServiceInput } from '@/lib/services/validation'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'
import { requireAdminUser } from '@/lib/authz'

export async function GET(request: Request) {
  try {
    const isPublic = new URL(request.url).searchParams.get('public') === 'true'
    const data = await db.select().from(services).where(isPublic ? eq(services.isActive, true) : undefined).orderBy(services.order)
    return NextResponse.json(data, { headers: isPublic ? { 'Cache-Control': 'no-store' } : undefined })
  } catch (error) {
    console.error('Error fetching services:', error)
    return apiError('INTERNAL_ERROR', 'Gagal memuat layanan', 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdminUser()
    const parsed = validateServiceInput(await request.json())
    if (parsed.error || !parsed.value) return apiError('VALIDATION_ERROR', parsed.error ?? 'Data layanan tidak valid', 422)
    const [newService] = await db
      .insert(services)
      .values(parsed.value as typeof services.$inferInsert)
      .returning()
    await recordAudit({ userId: user.userId, actionType: 'create', entityType: 'service', entityId: newService.id, after: newService })
    
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return apiError('INTERNAL_ERROR', 'Gagal membuat layanan', 500)
  }
}
