/**
 * Module: Public booking API
 * Purpose: Verify Turnstile and deliver treatment/course booking requests to salon email.
 * Used by: Public BookingForm component.
 * Dependencies: Neon-independent booking validation, Resend, Turnstile verification, WhatsApp fallback.
 * Public functions: POST().
 * Side effects: Calls Cloudflare Turnstile and Resend over HTTPS; does not write to the database.
 */
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { buildBookingWhatsAppUrl, validateBookingInput } from '@/lib/bookings/validation'

async function verifyTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
  return response.ok && Boolean((await response.json()).success)
}

export async function POST(request: Request) {
  const parsed = validateBookingInput(await request.json())
  if (parsed.error || !parsed.value) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error } }, { status: 422 })
  const fallbackUrl = buildBookingWhatsAppUrl(WHATSAPP_NUMBER, parsed.value)
  if (!process.env.TURNSTILE_SECRET_KEY) return NextResponse.json({ success: false, error: { code: 'FALLBACK_WHATSAPP', message: 'Turnstile belum dikonfigurasi', fallbackUrl } }, { status: 503 })
  try {
    const verified = await verifyTurnstile(parsed.value.turnstileToken, request.headers.get('x-forwarded-for')?.split(',')[0]?.trim())
    if (!verified) return NextResponse.json({ success: false, error: { code: 'CAPTCHA_FAILED', message: 'Verifikasi keamanan gagal', fallbackUrl } }, { status: 403 })
    const recipients = (process.env.BOOKING_NOTIFICATION_RECIPIENTS ?? '').split(',').map((item) => item.trim()).filter(Boolean)
    if (process.env.EMAIL_PROVIDER !== 'resend' || !process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !recipients.length) return NextResponse.json({ success: false, error: { code: 'FALLBACK_WHATSAPP', message: 'Booking email belum dikonfigurasi', fallbackUrl } }, { status: 503 })
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.EMAIL_FROM, to: recipients, replyTo: process.env.EMAIL_REPLY_TO || undefined, subject: `Booking ${parsed.value.type}: ${parsed.value.item}`, text: [`Nama: ${parsed.value.name}`, `WhatsApp: ${parsed.value.phone}`, `Jenis: ${parsed.value.type}`, `Pilihan: ${parsed.value.item}`, `Tanggal: ${parsed.value.date || '-'}`, `Waktu: ${parsed.value.time || '-'}`, `Catatan: ${parsed.value.notes || '-'}`].join('\n') })
    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true, message: 'Booking berhasil dikirim. Tim kami akan menghubungi Anda.' })
  } catch (error) {
    console.error('Booking delivery error:', error)
    return NextResponse.json({ success: false, error: { code: 'FALLBACK_WHATSAPP', message: 'Booking dialihkan ke WhatsApp', fallbackUrl } }, { status: 502 })
  }
}
