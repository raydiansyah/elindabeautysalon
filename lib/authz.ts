/**
 * Module: Clerk authorization helpers
 * Purpose: Authenticate API requests and enforce admin/karyawan/member role access.
 * Used by: Promotion and future redemption API route handlers.
 * Dependencies: @clerk/nextjs/server and Clerk session claims.
 * Public functions: requireAuthenticatedUser(), requireOperationalUser(), requireAdminUser().
 * Side effects: Reads the current Clerk session; no database writes.
 */
import { auth } from '@clerk/nextjs/server'

export const applicationRoles = ['admin', 'karyawan', 'member'] as const
export type ApplicationRole = typeof applicationRoles[number]

type SessionClaims = {
  metadata?: { role?: string }
}

function getRole(sessionClaims: unknown): ApplicationRole {
  const claims = sessionClaims as SessionClaims | undefined
  const role = claims?.metadata?.role
  if (role === 'admin' || role === 'karyawan' || role === 'member') return role
  if (role === 'staff') return 'karyawan'
  return 'member'
}

export async function requireAuthenticatedUser() {
  const session = await auth()
  if (!session.userId) {
    throw new Response('Unauthorized', { status: 401 })
  }
  return { userId: session.userId, role: getRole(session.sessionClaims) }
}

export async function requireAdminUser() {
  const user = await requireAuthenticatedUser()
  if (user.role !== 'admin') {
    throw new Response('Forbidden', { status: 403 })
  }
  return user
}

export async function requireOperationalUser() {
  const user = await requireAuthenticatedUser()
  if (user.role !== 'admin' && user.role !== 'karyawan') {
    throw new Response('Forbidden', { status: 403 })
  }
  return user
}
