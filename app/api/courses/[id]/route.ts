/**
 * Module: Course item API
 * Purpose: Update or remove one beauty course record.
 * Used by: Authenticated admin course screen.
 * Dependencies: Drizzle courses schema, Clerk authorization, API response helper, audit log.
 * Public functions: PUT(), DELETE().
 * Side effects: Writes or deletes one course and records the change in the audit log.
 */
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { requireAdminUser } from '@/lib/authz'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'

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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdminUser()
    const { id } = await params
    const courseId = Number(id)
    const [before] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1)
    if (!before) return apiError('NOT_FOUND', 'Kursus tidak ditemukan', 404)
    const parsed = parseCourseInput(await request.json())
    if (parsed.error || !parsed.value) return apiError('VALIDATION_ERROR', parsed.error ?? 'Data kursus tidak valid', 422)
    const [updated] = await db.update(courses).set({ ...parsed.value, updatedAt: new Date() }).where(eq(courses.id, courseId)).returning()
    await recordAudit({ userId: user.userId, actionType: 'update', entityType: 'course', entityId: id, before, after: updated })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal memperbarui kursus', 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdminUser()
    const { id } = await params
    const courseId = Number(id)
    const [before] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1)
    if (!before) return apiError('NOT_FOUND', 'Kursus tidak ditemukan', 404)
    await db.delete(courses).where(eq(courses.id, courseId))
    await recordAudit({ userId: user.userId, actionType: 'delete', entityType: 'course', entityId: id, before })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return apiError('INTERNAL_ERROR', 'Gagal menghapus kursus', 500)
  }
}
