/**
 * Module: Interactive Salon Booking Concierge
 * Purpose: Collect treatment/course reservation with time slot selection, Turnstile protection, and instant WhatsApp fallback.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: React, Framer Motion, Lucide icons, salon constants, WhatsApp number, booking validation.
 * Public functions: BookingForm().
 * Side effects: Submits to /api/bookings and generates direct WhatsApp reservation URLs.
 */
'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  User,
  Phone,
} from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { buildBookingWhatsAppUrl } from '@/lib/bookings/validation'
import { useSalonSettings } from './SalonSettingsProvider'

type FormState = {
  name: string
  phone: string
  type: 'treatment' | 'course'
  item: string
  date: string
  time: string
  notes: string
}

const TIME_SLOTS = [
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
  '19:00',
]

export default function BookingForm({
  initialTreatment = '',
  initialVoucher = '',
}: {
  initialTreatment?: string
  initialVoucher?: string
}) {
  const { salonName } = useSalonSettings()
  const widgetRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    type: 'treatment',
    item: initialTreatment || '',
    date: '',
    time: '13:00',
    notes: initialVoucher ? `Menggunakan kode promo: ${initialVoucher}` : '',
  })

  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Update item if initialTreatment changes externally
  useEffect(() => {
    if (initialTreatment) {
      setForm((prev) => ({ ...prev, item: initialTreatment }))
    }
  }, [initialTreatment])

  useEffect(() => {
    if (initialVoucher) {
      setForm((prev) => ({
        ...prev,
        notes: prev.notes
          ? `${prev.notes} (Kode promo: ${initialVoucher})`
          : `Menggunakan kode promo: ${initialVoucher}`,
      }))
    }
  }, [initialVoucher])

  useEffect(() => {
    if (!siteKey || !widgetRef.current) return
    const renderTurnstile = () => {
      const turnstile = (window as Window & { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => void } }).turnstile
      if (turnstile && widgetRef.current) {
        turnstile.render(widgetRef.current, {
          sitekey: siteKey,
          callback: setToken,
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        })
      }
    }

    if ((window as Window & { turnstile?: unknown }).turnstile) {
      renderTurnstile()
    } else {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.addEventListener('load', renderTurnstile, { once: true })
      document.head.appendChild(script)
    }
  }, [siteKey])

  const openWhatsAppFallback = () => {
    const url = buildBookingWhatsAppUrl(WHATSAPP_NUMBER, form)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (!siteKey || !token) {
      openWhatsAppFallback()
      setMessage('Reservasi dialihkan ke WhatsApp concierge agar langsung diproses.')
      return
    }

    setBusy(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken: token }),
      })
      const payload = await res.json()
      if (!res.ok) {
        if (payload.error?.fallbackUrl) {
          window.open(payload.error.fallbackUrl, '_blank', 'noopener,noreferrer')
        }
        throw new Error(payload.error?.message || 'Reservasi dialihkan ke WhatsApp')
      }
      setSuccess(true)
      setMessage(payload.message || 'Permintaan booking berhasil terkirim! Tim kami akan segera mengonfirmasi.')
      setForm({
        name: '',
        phone: '',
        type: 'treatment',
        item: '',
        date: '',
        time: '13:00',
        notes: '',
      })
      setToken('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Reservasi dialihkan ke WhatsApp')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="booking" className="py-24 md:py-36 relative overflow-hidden bg-surface/30 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left Context & Trust Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Reservasi Kunjungan</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Luangkan waktu untuk{' '}
              <span className="font-serif italic font-normal text-accent-gold">
                merawat dirimu.
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-text-light/90 font-light max-w-md">
              Pilih perawatan dan jadwal favoritmu di {salonName}. Tim concierge kami akan memastikan ruang treatment telah disterilisasi dan siap menyambut kehadiranmu.
            </p>

            {/* Quick Guarantees */}
            <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm text-text-light">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Bebas Konsultasi Awal</p>
                  <p className="text-xs text-text-muted mt-0.5">Analisa rambut & kulit gratis sebelum tindakan dimulai.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Konfirmasi Langsung</p>
                  <p className="text-xs text-text-muted mt-0.5">Jadwal dikonfirmasi tim resepsionis via WhatsApp resmi.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-xs font-semibold text-accent-gold hover:text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Lebih suka chat santai? Hubungi langsung via WhatsApp →</span>
              </a>
            </div>
          </motion.div>

          {/* Right Form Card */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl border border-white/15 bg-gradient-to-b from-surface/90 to-surface/60 p-6 sm:p-9 backdrop-blur-xl shadow-2xl shadow-black/40 space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-text-light mb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-accent-gold" />
                  <span>Nama Lengkap</span>
                </label>
                <input
                  required
                  minLength={2}
                  placeholder="Contoh: Amanda Sari"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-elin-ink/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent-gold transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-text-light mb-1.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-accent-gold" />
                  <span>Nomor WhatsApp</span>
                </label>
                <input
                  required
                  minLength={8}
                  placeholder="081234567890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-elin-ink/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent-gold transition-colors"
                />
              </div>

              {/* Category Type */}
              <div>
                <label className="block text-xs font-medium text-text-light mb-1.5">
                  Tipe Reservasi
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as FormState['type'], item: '' })
                  }
                  className="w-full rounded-xl border border-white/15 bg-elin-ink/60 px-4 py-3 text-sm text-white outline-none focus:border-accent-gold transition-colors"
                >
                  <option value="treatment" className="bg-elin-ink text-white">Treatment Salon</option>
                  <option value="course" className="bg-elin-ink text-white">Kursus & Masterclass</option>
                </select>
              </div>

              {/* Treatment / Course Name */}
              <div>
                <label className="block text-xs font-medium text-text-light mb-1.5">
                  {form.type === 'course' ? 'Pilihan Kursus' : 'Nama Treatment'}
                </label>
                <input
                  required
                  placeholder={
                    form.type === 'course' ? 'Contoh: Masterclass Hair Coloring' : 'Contoh: Balayage & Cut'
                  }
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-elin-ink/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent-gold transition-colors"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-text-light mb-1.5 flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-accent-gold" />
                  <span>Tanggal Kedatangan</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-elin-ink/60 px-4 py-3 text-sm text-white outline-none focus:border-accent-gold transition-colors"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-medium text-text-light mb-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent-gold" />
                  <span>Pilihan Jam</span>
                </label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-elin-ink/60 px-4 py-3 text-sm text-white outline-none focus:border-accent-gold transition-colors"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-elin-ink text-white">
                      {slot} WIB
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-text-light mb-1.5">
                  Catatan Khusus / Kode Promo (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Rambut diwarnai hitam 6 bulan lalu, atau kode voucher ELINNEW20"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-elin-ink/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent-gold transition-colors resize-none"
                />
              </div>
            </div>

            {/* Turnstile / Security Notice */}
            <div className="pt-1">
              {siteKey ? (
                <div ref={widgetRef} />
              ) : (
                <p className="text-xs text-text-muted">
                  🔒 Privasi Anda terjaga. Data reservasi hanya digunakan untuk konfirmasi jadwal salon.
                </p>
              )}
            </div>

            {/* Status Feedback */}
            {message && (
              <div
                className={`flex items-center gap-2 rounded-xl p-3.5 text-xs ${
                  success
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border border-accent-gold/30 bg-accent-gold/10 text-accent-gold'
                }`}
              >
                {success && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                <span>{message}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={busy}
              className="w-full flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-gold px-6 py-3.5 text-sm font-semibold text-elin-ink shadow-lg shadow-accent-gold/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
            >
              {busy ? (
                <span>Memproses reservasi...</span>
              ) : siteKey && token ? (
                <>
                  <Send className="h-4 w-4" />
                  <span>Kirim Jadwal Booking</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  <span>Lanjutkan Konfirmasi ke WhatsApp</span>
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
