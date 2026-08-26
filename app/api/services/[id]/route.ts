/**
 * Module: Service item API
 * Purpose: Validate and update/delete a single service catalog record.
 * Used by: Admin service management.
 * Dependencies: Drizzle services schema, service validation, API response helper.
 * Public functions: PUT(), DELETE().
 * Side effects: PUT updates or DELETE removes one service in PostgreSQL.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { validateServicePatch } from '@/lib/services/validation'
import { apiError } from '@/lib/api-response'
import { recordAudit } from '@/lib/audit'
import { requireAdminUser } from '@/lib/authz'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdminUser()
    const { id } = await params
    const parsed = validateServicePatch(await request.json())
    if (parsed.error || !parsed.value) return apiError('VALIDATION_ERROR', parsed.error ?? 'Data layanan tidak valid', 422)
    
    const serviceId = Number(id)
    const [before] = await db.select().from(services).where(eq(services.id, serviceId)).limit(1)
    if (!before) return apiError('NOT_FOUND', 'Layanan tidak ditemukan', 404)
    const [updatedService] = await db
      .update(services)
      .set({ ...parsed.value, updatedAt: new Date() })
      .where(eq(services.id, serviceId))
      .returning()
    
    if (!updatedService) {
      return apiError('NOT_FOUND', 'Layanan tidak ditemukan', 404)
    }
    await recordAudit({ userId: user.userId, actionType: 'update', entityType: 'service', entityId: id, before, after: updatedService })
    
    return NextResponse.json(updatedService)
  } catch (error) {
    console.error('Error updating service:', error)
    return apiError('INTERNAL_ERROR', 'Gagal memperbarui layanan', 500)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdminUser()
    const { id } = await params
    const serviceId = Number(id)
    const [before] = await db.select().from(services).where(eq(services.id, serviceId)).limit(1)
    if (!before) return apiError('NOT_FOUND', 'Layanan tidak ditemukan', 404)
    await db.delete(services).where(eq(services.id, serviceId))
    await recordAudit({ userId: user.userId, actionType: 'delete', entityType: 'service', entityId: id, before })
    
    return NextResponse.json({ message: 'Service deleted' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return apiError('INTERNAL_ERROR', 'Gagal menghapus layanan', 500)
  }
}
