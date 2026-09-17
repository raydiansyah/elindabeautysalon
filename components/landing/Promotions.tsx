/**
 * Module: Public Promotions Section
 * Purpose: Display active salon promotions with countdown, voucher code copy, and WhatsApp sharing.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: React, Framer Motion, Lucide icons, public promotions API, WhatsApp number.
 * Public functions: Promotions()
 * Side effects: Fetches promotions from /api/promotions/public and copies text to clipboard.
 */
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Clock3, Share2, Copy, Check, Sparkles, ArrowRight } from 'lucide-react'

type Promotion = {
  id: number | string
  name: string
  description: string
  couponCode: string | null
  type: string
  discountValue: string
  startsAt: string
  endsAt: string
  quota: number | null
  redemptionCount: number
  bannerUrl: string | null
}

const TYPE_LABELS: Record<string, string> = {
  percentage: 'Diskon Persen',
  fixed: 'Potongan Langsung',
  buy_x_get_y: 'Spesial Treatment',
  free_service: 'Bonus Layanan',
  bundle: 'Paket Spesial',
}

const FALLBACK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    name: 'First-Timer Hair & Scalp Reset',
    description: 'Dapatkan potongan 20% untuk kunjungan pertamamu termasuk analisa kondisi kulit kepala gratis dan blow styling.',
    couponCode: 'ELINNEW20',
    type: 'percentage',
    discountValue: '20%',
    startsAt: '2026-09-01T00:00:00.000Z',
    endsAt: '2026-12-31T23:59:59.000Z',
    quota: 50,
    redemptionCount: 14,
    bannerUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&fit=crop',
  },
  {
    id: 'promo-2',
    name: 'Glow Facial & Eye Treatment Duo',
    description: 'Manjakan diri dengan paket pembersihan wajah instan bercahaya plus bonus pijat relaksasi area mata.',
    couponCode: 'GLOWDUO',
    type: 'bundle',
    discountValue: 'Bonus Eye Spa',
    startsAt: '2026-09-01T00:00:00.000Z',
    endsAt: '2026-12-31T23:59:59.000Z',
    quota: 30,
    redemptionCount: 22,
    bannerUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&fit=crop',
  },
]

function Countdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState('Promo Aktif')

  useEffect(() => {
    const update = () => {
      const ms = Math.max(0, new Date(endsAt).getTime() - Date.now())
      if (ms <= 0) {
        setRemaining('Segera Berakhir')
        return
      }
      const days = Math.floor(ms / 86400000)
      const hours = Math.floor((ms % 86400000) / 3600000)
      const minutes = Math.floor((ms % 3600000) / 60000)
      setRemaining(days > 0 ? `${days}h ${hours}j lagi` : `${hours}j ${minutes}m lagi`)
    }
    update()
    const timer = setInterval(update, 60000)
    return () => clearInterval(timer)
  }, [endsAt])

  return (
    <span
      suppressHydrationWarning
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-gold bg-accent-gold/10 px-2.5 py-1 rounded-full border border-accent-gold/25"
    >
      <Clock3 className="h-3 w-3" />
      <span suppressHydrationWarning>{remaining}</span>
    </span>
  )
}

export default function Promotions({
  onSelectPromotion,
}: {
  onSelectPromotion?: (code: string) => void
}) {
  const [promotions, setPromotions] = useState<Promotion[]>(FALLBACK_PROMOTIONS)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/promotions/public', { cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => {
        if (Array.isArray(payload?.data) && payload.data.length > 0) {
          setPromotions(payload.data)
        }
      })
      .catch(() => undefined)
  }, [])

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 3000)
    if (onSelectPromotion) {
      onSelectPromotion(code)
    }
  }

  const sharePromo = (promo: Promotion) => {
    const text = `Penawaran Spesial di Salon: ${promo.name} - ${promo.description} ${
      promo.couponCode ? `(Gunakan Kode: ${promo.couponCode})` : ''
    }`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="promosi" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Penawaran Terbatas</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Promo Eksklusif &{' '}
            <span className="font-serif italic font-normal text-accent-gold">
              Keuntungan Member.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-light/80 max-w-2xl mx-auto font-light leading-relaxed">
            Gunakan kode voucher saat booking online atau tunjukkan kepada resepsionis salon untuk mendapatkan benefit istimewa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {promotions.map((promo) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-surface/80 to-surface/40 p-7 backdrop-blur-xl transition-all duration-300 hover:border-accent-gold/50 hover:shadow-2xl hover:shadow-accent-gold/10"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-gold">
                    <Tag className="h-3.5 w-3.5" />
                    {TYPE_LABELS[promo.type] || promo.type}
                  </span>
                  <Countdown endsAt={promo.endsAt} />
                </div>

                <h3 className="font-display text-2xl font-bold text-white group-hover:text-accent-gold transition-colors">
                  {promo.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-light/90 font-light">
                  {promo.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                {promo.couponCode && (
                  <div className="flex items-center justify-between rounded-xl border border-dashed border-accent-gold/40 bg-accent-gold/5 p-3 sm:p-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-text-muted">
                        Kode Voucher
                      </span>
                      <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-accent-gold">
                        {promo.couponCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyCode(promo.couponCode!)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gold px-3.5 py-1.5 text-xs font-bold text-elin-ink transition-transform hover:scale-105 active:scale-95"
                    >
                      {copiedCode === promo.couponCode ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <a
                    href="#booking"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-accent-gold hover:text-elin-ink text-white py-2.5 text-xs font-semibold transition-colors"
                  >
                    <span>Klaim saat Booking</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => sharePromo(promo)}
                    aria-label={`Bagikan promo ${promo.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-surface/50 text-text-light hover:text-white hover:border-white/40 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
