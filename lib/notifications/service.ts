/**
 * Module: Notification service
 * Purpose: Persist admin in-app alerts and send optional promotion email alerts.
 * Used by: Promotion, redemption, and scheduling route handlers.
 * Dependencies: Clerk Backend API, Drizzle notifications schema, and Resend SDK.
 * Public functions: notifyAdmins(), sendPromotionEmail().
 * Side effects: Reads Clerk admin users, writes notifications to PostgreSQL, and may call Resend over HTTPS.
 */
import { clerkClient } from '@clerk/nextjs/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'

async function adminIds() {
  const configuredIds = (process.env.ADMIN_NOTIFICATION_USER_IDS ?? '').split(',').map((id) => id.trim()).filter((id) => id.startsWith('user_'))
  try {
    const response = await (await clerkClient()).users.getUserList({ limit: 100 })
    const clerkAdminIds = response.data.filter((user) => user.publicMetadata.role === 'admin').map((user) => user.id)
    return [...new Set([...configuredIds, ...clerkAdminIds])]
  } catch (error) {
    console.error('Unable to resolve Clerk admin notification recipients:', error)
    return configuredIds
  }
}

export async function notifyAdmins(input: { type: string; title: string; message: string; href?: string }) {
  const ids = await adminIds()
  if (!ids.length) return
  await db.insert(notifications).values(ids.map((userId) => ({ ...input, userId })))
}

export async function sendPromotionEmail(input: { subject: string; html: string }) {
  const recipients = (process.env.PROMOTION_NOTIFICATION_RECIPIENTS ?? '').split(',').map((email) => email.trim()).filter(Boolean)
  if (process.env.EMAIL_PROVIDER !== 'resend' || !process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !recipients.length) return { sent: false, reason: 'email_not_configured' }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({ from: process.env.EMAIL_FROM, to: recipients, subject: input.subject, html: input.html, replyTo: process.env.EMAIL_REPLY_TO || undefined })
  if (error) throw new Error(error.message)
  return { sent: true }
}
