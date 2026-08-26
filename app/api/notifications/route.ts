/**
 * Module: In-app notifications API
 * Purpose: List current-user alerts and mark them as read.
 * Used by: AdminHeader notification badge and dashboard notification panel.
 * Dependencies: Drizzle notifications table and Clerk authorization.
 * Public functions: GET(), PATCH().
 * Side effects: Reads notifications and updates read timestamps in PostgreSQL.
 */
import { and, desc, eq, isNull } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { requireAuthenticatedUser } from '@/lib/authz'

export async function GET() {
  const user = await requireAuthenticatedUser()
  const data = await db.select().from(notifications).where(eq(notifications.userId, user.userId)).orderBy(desc(notifications.createdAt)).limit(30)
  return NextResponse.json({ success: true, data, unreadCount: data.filter((notification) => notification.readAt === null).length })
}

export async function PATCH(request: Request) {
  const user = await requireAuthenticatedUser()
  const body = await request.json() as { id?: number }
  const where = body.id ? and(eq(notifications.id, body.id), eq(notifications.userId, user.userId)) : and(eq(notifications.userId, user.userId), isNull(notifications.readAt))
  await db.update(notifications).set({ readAt: new Date() }).where(where)
  return NextResponse.json({ success: true })
}
