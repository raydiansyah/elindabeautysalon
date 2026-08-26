/**
 * Module: Course collection API
 * Purpose: Serve active beauty courses publicly and manage course records for admins.
 * Used by: Public Courses section and authenticated admin course screen.
 * Dependencies: Drizzle courses schema, Clerk authorization, API response helper, audit log, R2 media URL normalizer.
 * Public functions: GET(), POST().
 * Side effects: GET reads courses; POST inserts one course and records an audit event.
 */
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { requireAdminUser, requireOperationalUser } from '@/lib/authz'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'
import { normalizeR2MediaUrl } from '@/lib/r2'

function parseCourseInput(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Data kursus tidak valid' }
  const value = input as Record<string, unknown>
  const text = (key: string) => typeof value[key] === 'string' ? value[key].trim() : ''
  const order = Number(value.order)
  const result = {
    title: text('title'), description: text('description'), instructor: text('instructor'),
    level: text('level'), duration: text('duration'), schedule: text('schedule'),
    imageUrl: text('imageUrl') || null, enrollmentUrl: text('enrollmentUrl') || null,
    order, isActive: Boolean(value.isActive),
  }
  if (!result.title || !result.description || !result.instructor || !result.level || !result.duration || !result.schedule || !Number.isInteger(order) || order < 0) return { error: 'Judul, deskripsi, instruktur, level, durasi, jadwal, dan urutan wajib diisi' }
  return { value: result }
}

export async function GET(request: Request) {
  try {
    const isPublic = new URL(request.url).searchParams.get('public') === 'true'
    if (!isPublic) await requireOperationalUser()
    const data = isPublic
      ? await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(asc(courses.order), asc(courses.id))
      : await db.select().from(courses).orderBy(asc(courses.order), asc(courses.id))
    return NextResponse.json({ success: true, data: data.map((item) => ({ ...item, imageUrl: normalizeR2MediaUrl(item.imageUrl) })) }, { headers: isPublic ? { 'Cache-Control': 'no-store' } : undefined })
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal memuat kursus', 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdminUser()
    const parsed = parseCourseInput(await request.json())
    if (parsed.error || !parsed.value) return apiError('VALIDATION_ERROR', parsed.error ?? 'Data kursus tidak valid', 422)
    const [created] = await db.insert(courses).values(parsed.value).returning()
    await recordAudit({ userId: user.userId, actionType: 'create', entityType: 'course', entityId: String(created.id), after: created })
    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal menambahkan kursus', 500)
  }
}
