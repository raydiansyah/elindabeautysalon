/**
 * Module: Clerk user webhook
 * Purpose: Verify Clerk events and synchronize user identity and role to Neon.
 * Used by: Clerk Dashboard webhook endpoint for user.created, user.updated, user.deleted.
 * Dependencies: @clerk/nextjs/webhooks, Drizzle users schema, Neon PostgreSQL.
 * Public functions: POST().
 * Side effects: Upserts or deactivates a local user record after verified Clerk events.
 */
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { eq, or } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { apiError } from '@/lib/api-response'

type ClerkUserEvent = {
  id: string
  first_name: string | null
  last_name: string | null
  primary_email_address_id: string | null
  email_addresses: Array<{ id: string; email_address: string }>
  public_metadata?: { role?: string }
}

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request)
    const data = event.data as ClerkUserEvent
    if (!data.id) return apiError('INVALID_PAYLOAD', 'Invalid Clerk event', 400)

    if (event.type === 'user.deleted') {
      await db.update(users).set({ role: 'suspended', updatedAt: new Date() }).where(eq(users.clerkUserId, data.id))
      return NextResponse.json({ success: true, data: { userId: data.id, action: 'deactivated' } })
    }

    const primaryEmail = data.email_addresses.find((email) => email.id === data.primary_email_address_id)?.email_address
    if (!primaryEmail) return apiError('INVALID_PAYLOAD', 'Clerk user has no primary email', 422)
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || primaryEmail
    const role = data.public_metadata?.role === 'admin' || data.public_metadata?.role === 'karyawan' || data.public_metadata?.role === 'member' ? data.public_metadata.role : 'member'
    const [existing] = await db.select({ id: users.id }).from(users).where(or(eq(users.clerkUserId, data.id), eq(users.email, primaryEmail))).limit(1)
    const [user] = existing
      ? await db.update(users).set({ clerkUserId: data.id, name, email: primaryEmail, role, updatedAt: new Date() }).where(eq(users.id, existing.id)).returning({ id: users.id, clerkUserId: users.clerkUserId, role: users.role })
      : await db.insert(users).values({ clerkUserId: data.id, name, email: primaryEmail, role }).returning({ id: users.id, clerkUserId: users.clerkUserId, role: users.role })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('Clerk webhook verification failed:', error)
    return apiError('INVALID_SIGNATURE', 'Invalid webhook signature', 400)
  }
}
