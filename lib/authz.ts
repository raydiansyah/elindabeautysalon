/**
 * Module: Clerk authorization helpers
 * Purpose: Authenticate API requests and enforce admin/karyawan/member role access.
 * Used by: Promotion and future redemption API route handlers.
 * Dependencies: @clerk/nextjs/server, Clerk session claims, and Clerk Backend API.
 * Public functions: requireAuthenticatedUser(), requireOperationalUser(), requireAdminUser().
 * Side effects: Reads the current Clerk session; no database writes.
 */
import { auth, clerkClient } from '@clerk/nextjs/server'

export const applicationRoles = ['admin', 'karyawan', 'member'] as const
export type ApplicationRole = typeof applicationRoles[number]

type SessionClaims = {
  metadata?: { role?: string }
  public_metadata?: { role?: string }
  publicMetadata?: { role?: string }
}

function normalizeRole(role: unknown): ApplicationRole | undefined {
  if (role === 'admin' || role === 'karyawan' || role === 'member') return role
  if (role === 'staff') return 'karyawan'
  return undefined
}

function getRoleFromClaims(sessionClaims: unknown): ApplicationRole | undefined {
  const claims = sessionClaims as SessionClaims | undefined
  return normalizeRole(claims?.metadata?.role) ?? normalizeRole(claims?.public_metadata?.role) ?? normalizeRole(claims?.publicMetadata?.role)
}

export async function requireAuthenticatedUser() {
  const session = await auth()
  if (!session.userId) {
    throw new Response('Unauthorized', { status: 401 })
  }
  const claimRole = getRoleFromClaims(session.sessionClaims)
  // Keep the fast path for admin claims. Recheck every other claim because
  // Clerk session tokens may predate a Dashboard role change (for example,
  // karyawan promoted to admin).
  if (claimRole === 'admin') return { userId: session.userId, role: claimRole }

  // Clerk custom metadata is not included in the default session token unless a
  // custom session-token claim has been configured. Read it server-side as the
  // authoritative fallback so Dashboard users do not get misclassified as members.
  const client = await clerkClient()
  const user = await client.users.getUser(session.userId)
  return { userId: session.userId, role: normalizeRole(user.publicMetadata.role) ?? claimRole ?? 'member' }
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
