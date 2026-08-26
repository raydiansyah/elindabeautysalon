/**
 * Module: Clerk staff management API
 * Purpose: List staff and let admins invite users or change their application role.
 * Used by: Admin users page at /admin/users.
 * Dependencies: Clerk Backend API, Clerk authorization, Next.js route handlers.
 * Public functions: GET(), POST(), PATCH().
 * Side effects: Creates Clerk invitations and updates Clerk public metadata.
 */
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { applicationRoles, requireAdminUser } from '@/lib/authz'
import { apiError } from '@/lib/api-response'

const roleValues = applicationRoles

export async function GET() {
  await requireAdminUser()
  const client = await clerkClient()
  const response = await client.users.getUserList({ limit: 100, orderBy: '-created_at' })
  const data = response.data.map((user) => ({
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Tanpa nama',
    email: user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ?? 'Tanpa email',
    role: roleValues.includes(user.publicMetadata.role as typeof roleValues[number]) ? user.publicMetadata.role : 'member',
    createdAt: user.createdAt,
  }))
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  await requireAdminUser()
  const body = await request.json() as { emailAddress?: string; role?: string }
  const emailAddress = body.emailAddress?.trim().toLowerCase()
  const role = body.role ?? 'karyawan'
  if (!emailAddress || !emailAddress.includes('@') || !roleValues.includes(role as typeof roleValues[number])) {
    return apiError('VALIDATION_ERROR', 'Email dan role tidak valid', 422)
  }
  const client = await clerkClient()
  const invitation = await client.invitations.createInvitation({
    emailAddress,
    redirectUrl: '/admin/login',
    publicMetadata: { role },
  })
  return NextResponse.json({ success: true, data: { id: invitation.id, emailAddress, role } }, { status: 201 })
}

export async function PATCH(request: Request) {
  await requireAdminUser()
  const body = await request.json() as { userId?: string; role?: string }
  if (!body.userId || !roleValues.includes(body.role as typeof roleValues[number])) {
    return apiError('VALIDATION_ERROR', 'User ID dan role wajib diisi', 422)
  }
  const client = await clerkClient()
  const user = await client.users.updateUserMetadata(body.userId, { publicMetadata: { role: body.role } })
  return NextResponse.json({ success: true, data: { id: user.id, role: user.publicMetadata.role } })
}
