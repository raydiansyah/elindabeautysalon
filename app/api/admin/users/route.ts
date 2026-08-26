/**
 * Module: Clerk staff management API
 * Purpose: List staff, edit account data, reset passwords, and report handled visits.
 * Used by: Admin users page at /admin/users.
 * Dependencies: Clerk Backend API, Clerk authorization, Next.js route handlers.
 * Public functions: GET(), POST(), PATCH(), DELETE().
 * Side effects: Reads aggregated redemptions; creates invitations; updates or deletes Clerk users, metadata, email, phone, and password.
 */
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { and, count, gte, lt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { redemptions } from '@/lib/db/schema'
import { applicationRoles, requireAdminUser } from '@/lib/authz'
import { apiError } from '@/lib/api-response'

const roleValues = applicationRoles

export async function GET(request: Request) {
  try {
    await requireAdminUser()
    const client = await clerkClient()
    const url = new URL(request.url)
    const roleFilter = roleValues.includes(url.searchParams.get('role') as typeof roleValues[number]) ? url.searchParams.get('role') : 'all'
    const year = Number(url.searchParams.get('year')) || new Date().getFullYear()
    const month = Number(url.searchParams.get('month'))
    const search = url.searchParams.get('search')?.trim().toLowerCase() ?? ''
    const rangeStart = Number.isInteger(month) && month >= 1 && month <= 12 ? new Date(year, month - 1, 1) : new Date(year, 0, 1)
    const rangeEnd = Number.isInteger(month) && month >= 1 && month <= 12 ? new Date(year, month, 1) : new Date(year + 1, 0, 1)
    const [response, visitRows] = await Promise.all([
      client.users.getUserList({ limit: 100, orderBy: '-created_at' }),
      db.select({ contact: redemptions.customerContact, month: sql<string>`extract(month from ${redemptions.redeemedAt})`, visits: count() }).from(redemptions).where(and(gte(redemptions.redeemedAt, rangeStart), lt(redemptions.redeemedAt, rangeEnd))).groupBy(redemptions.customerContact, sql`extract(month from ${redemptions.redeemedAt})`),
    ])
    const normalizeContact = (value: string) => value.toLowerCase().replace(/[^a-z0-9+]/g, '')
    const memberContacts = new Set(response.data.filter((user) => (roleValues.includes(user.publicMetadata.role as typeof roleValues[number]) ? user.publicMetadata.role : 'member') === 'member').flatMap((user) => [user.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress, user.phoneNumbers.find((item) => item.id === user.primaryPhoneNumberId)?.phoneNumber].filter((value): value is string => Boolean(value)).map(normalizeContact)))
    const operationalMonthly = Array(12).fill(0) as number[]
    const visitMap = new Map<string, number[]>()
    for (const row of visitRows) {
      const month = Number(row.month)
      const visits = Number(row.visits)
      const contact = normalizeContact(row.contact)
      if (memberContacts.has(contact)) operationalMonthly[month - 1] += visits
      const current = visitMap.get(contact) ?? Array(12).fill(0)
      current[month - 1] += visits
      visitMap.set(contact, current)
    }
    const data = response.data.filter((user) => {
      const role = roleValues.includes(user.publicMetadata.role as typeof roleValues[number]) ? user.publicMetadata.role : 'member'
      const email = user.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress ?? ''
      const phone = user.phoneNumbers.find((item) => item.id === user.primaryPhoneNumberId)?.phoneNumber ?? ''
      const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Tanpa nama'
      return (roleFilter === 'all' || role === roleFilter) && (!search || [name, email, phone].some((value) => value.toLowerCase().includes(search)))
    }).map((user) => {
      const role = roleValues.includes(user.publicMetadata.role as typeof roleValues[number]) ? user.publicMetadata.role : 'member'
      const email = user.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress ?? ''
      const phone = user.phoneNumbers.find((item) => item.id === user.primaryPhoneNumberId)?.phoneNumber ?? ''
      const memberVisits = role === 'member' ? [email, phone].map(normalizeContact).map((contact) => visitMap.get(contact)).find(Boolean) ?? Array(12).fill(0) : Array(12).fill(0)
      return {
        id: user.id,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Tanpa nama',
        email: email || 'Tanpa email',
        phone,
        role,
        createdAt: user.createdAt,
        visitsMonthly: memberVisits,
        visitsAnnual: memberVisits.reduce((total, value) => total + value, 0),
      }
    })
    return NextResponse.json({ success: true, data, year, month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : null, operationalVisitsMonthly: operationalMonthly, operationalVisitsAnnual: operationalMonthly.reduce((total, value) => total + value, 0) })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Admin users GET error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal memuat data staff', 500)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser()
    const body = await request.json() as { emailAddress?: string; role?: string }
    const emailAddress = body.emailAddress?.trim().toLowerCase()
    const role = body.role ?? 'karyawan'
    if (!emailAddress || !emailAddress.includes('@') || !roleValues.includes(role as typeof roleValues[number])) return apiError('VALIDATION_ERROR', 'Email dan role tidak valid', 422)
    const client = await clerkClient()
    const existing = await client.users.getUserList({ emailAddress: [emailAddress], limit: 1 })
    if (existing.data.length > 0) return apiError('CONFLICT', 'Email sudah terdaftar sebagai user. Gunakan edit data untuk memperbarui akun.', 409)
    const invitation = await client.invitations.createInvitation({ emailAddress, redirectUrl: '/admin/login', publicMetadata: { role } })
    return NextResponse.json({ success: true, data: { id: invitation.id, emailAddress, role } }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Admin users POST error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal mengirim undangan', 500)
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await requireAdminUser()
    const body = await request.json() as { userId?: string }
    if (!body.userId) return apiError('VALIDATION_ERROR', 'User ID wajib diisi', 422)
    if (body.userId === currentUser.userId) return apiError('VALIDATION_ERROR', 'Akun yang sedang digunakan tidak dapat dihapus', 422)
    const client = await clerkClient()
    await client.users.deleteUser(body.userId)
    return NextResponse.json({ success: true, data: { id: body.userId } })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Admin users DELETE error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal menghapus user', 500)
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminUser()
    const body = await request.json() as { userId?: string; action?: 'update' | 'resetPassword'; name?: string; email?: string; phone?: string; role?: string; newPassword?: string }
    if (!body.userId) return apiError('VALIDATION_ERROR', 'User ID wajib diisi', 422)
    const client = await clerkClient()
    if (body.action === 'resetPassword') {
      if (!body.newPassword || body.newPassword.length < 8) return apiError('VALIDATION_ERROR', 'Password baru minimal 8 karakter', 422)
      const user = await client.users.updateUser(body.userId, { password: body.newPassword, signOutOfOtherSessions: true })
      return NextResponse.json({ success: true, data: { id: user.id, action: 'password_reset' } })
    }
    if (body.role && !roleValues.includes(body.role as typeof roleValues[number])) return apiError('VALIDATION_ERROR', 'Role tidak valid', 422)
    const current = await client.users.getUser(body.userId)
    const name = body.name?.trim()
    const nameParts = name ? name.split(/\s+/) : []
    const user = name ? await client.users.updateUser(body.userId, { firstName: nameParts[0], lastName: nameParts.slice(1).join(' ') || undefined }) : current
    if (body.role) await client.users.updateUserMetadata(body.userId, { publicMetadata: { role: body.role } })
    if (body.email?.trim() && body.email.trim().toLowerCase() !== current.emailAddresses.find((email) => email.id === current.primaryEmailAddressId)?.emailAddress?.toLowerCase()) await client.emailAddresses.createEmailAddress({ userId: body.userId, emailAddress: body.email.trim().toLowerCase(), verified: true, primary: true })
    if (body.phone?.trim()) {
      const phone = body.phone.trim()
      if (!/^\+[1-9]\d{7,14}$/.test(phone)) return apiError('VALIDATION_ERROR', 'Nomor telepon harus format internasional, contoh +628123456789', 422)
      const currentPhone = current.phoneNumbers.find((item) => item.id === current.primaryPhoneNumberId)
      if (currentPhone) await client.phoneNumbers.deletePhoneNumber(currentPhone.id)
      await client.phoneNumbers.createPhoneNumber({ userId: body.userId, phoneNumber: phone, verified: true, primary: true })
    }
    return NextResponse.json({ success: true, data: { id: user.id, name: name ?? undefined, email: body.email, phone: body.phone, role: body.role } })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Admin users PATCH error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal memperbarui data staff', 500)
  }
}
