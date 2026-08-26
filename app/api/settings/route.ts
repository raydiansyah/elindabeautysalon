/**
 * Module: Salon settings API
 * Purpose: Read and update salon profile, branding, theme, and SEO settings.
 * Used by: AdminSettings page and public site configuration consumers.
 * Dependencies: Drizzle database, Clerk authorization, Next.js route handlers, R2 media URL normalizer.
 * Public functions: GET(), PUT().
 * Side effects: Reads and upserts one JSONB settings record in PostgreSQL.
 */
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { requireAdminUser, requireOperationalUser } from '@/lib/authz'
import { validateSettingsInput } from '@/lib/settings/validation'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'
import { normalizeR2MediaUrl } from '@/lib/r2'

const SETTINGS_KEY = 'salon'

export async function GET(request: Request) {
  try {
    const isPublic = new URL(request.url).searchParams.get('public') === 'true'
    if (!isPublic) await requireOperationalUser()
    const [record] = await db.select().from(settings).where(eq(settings.key, SETTINGS_KEY)).limit(1)
    const value = { ...(record?.value ?? {}) }
    for (const field of ['logoUrl', 'heroImageUrl', 'aboutImageUrl']) {
      if (typeof value[field] === 'string') value[field] = normalizeR2MediaUrl(value[field])
    }
    return NextResponse.json({ success: true, data: value }, { headers: isPublic ? { 'Cache-Control': 'no-store' } : undefined })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Settings GET error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal memuat pengaturan', 500)
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAdminUser()
    const parsed = validateSettingsInput(await request.json())
    if (parsed.error || !parsed.value || Object.keys(parsed.value).length === 0) return apiError('VALIDATION_ERROR', parsed.error ?? 'Settings tidak boleh kosong', 422)
    const [current] = await db.select({ value: settings.value }).from(settings).where(eq(settings.key, SETTINGS_KEY)).limit(1)
    const value = { ...(current?.value ?? {}), ...parsed.value }

    const [record] = await db.insert(settings).values({
      key: SETTINGS_KEY,
      value,
      updatedBy: user.userId,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedBy: user.userId, updatedAt: new Date() },
    }).returning()
    await recordAudit({ userId: user.userId, actionType: 'update', entityType: 'settings', entityId: SETTINGS_KEY, before: current?.value, after: record.value })

    return NextResponse.json({ success: true, data: record.value })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Settings PUT error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal menyimpan pengaturan', 500)
  }
}
