/**
 * Module: Landing Hero Section
 * Purpose: Deliver an editorial, luxury first impression with dynamic status, trust ribbon, and smooth entrance.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, salon settings context, WhatsApp number, SalonStatusBadge.
 * Public functions: Hero()
 * Side effects: Fetches public hero image if configured.
 */
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, ShieldCheck, HeartHandshake, Award } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'
import SalonStatusBadge from './SalonStatusBadge'

export default function Hero() {
  const { salonName } = useSalonSettings()
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2400&q=85&fit=crop'
  )

  useEffect(() => {
    fetch('/api/settings?public=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.data?.heroImageUrl) {
          setHeroImage(payload.data.heroImageUrl)
        }
      })
      .catch(() => undefined)
  }, [])

  return (
    <section
      id="beranda"
      className="relative isolate min-h-[92vh] overflow-hidden bg-elin-ink pt-28 pb-16 flex flex-col justify-between"
    >
      {/* Editorial Visual Background with Subtle Ambient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.45] contrast-110 saturate-[1.1] transition-all duration-1000"
        style={{ backgroundImage: `url('${heroImage}')` }}
        aria-hidden="true"
      />
      {/* Luxury Vignette & Grain Tint */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-elin-ink via-elin-ink/60 to-elin-ink/80"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,185,120,0.12),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 my-auto">
        <div className="max-w-4xl">
          {/* Status & Category Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <SalonStatusBadge />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
              <Sparkles className="h-3 w-3" />
              {salonName} Exclusive
            </span>
          </motion.div>

          {/* Headline - Editorial Serif & Sans Mix */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-[-0.03em] text-white"
          >
            Ruang teduh untuk merawat diri &{' '}
            <span className="font-serif italic font-normal text-accent-gold underline decoration-accent-gold/30 underline-offset-8">
              memancarkan pesonamu.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-text-light/90 font-light"
          >
            Sentuhan presisi dari stylist bersertifikat, privasi yang tenang, dan konsultasi jujur yang disesuaikan dengan karakter serta kebutuhan mahkota dan kulit Anda.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <a
              href="#booking"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-accent-gold px-7 py-3 text-sm font-semibold text-elin-ink shadow-lg shadow-accent-gold/25 transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
            >
              <span>Pilih Jadwal Reservasi</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#layanan"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-surface/40 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-accent-gold hover:bg-surface/80"
            >
              Jelajahi Menu Perawatan
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Halo ${salonName}, saya ingin konsultasi perawatan.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-xs font-semibold text-text-muted hover:text-white transition-colors py-2 sm:pl-3"
            >
              Konsultasi WhatsApp →
            </a>
          </motion.div>
        </div>
      </div>

      {/* Trust Ribbon Strip at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="relative z-10 border-t border-white/10 bg-elin-ink/75 backdrop-blur-md mt-12 py-5"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-accent-gold shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">10+ Tahun</p>
                <p className="text-xs text-text-muted">Pengalaman & Kepercayaan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <HeartHandshake className="h-5 w-5 text-accent-gold shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">5,000+ Klien</p>
                <p className="text-xs text-text-muted">Puas & Setia Berkunjung</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-accent-gold shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Produk Resmi</p>
                <p className="text-xs text-text-muted">Higienis & Tersertifikasi BPOM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent-gold shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Bespoke Treatment</p>
                <p className="text-xs text-text-muted">Konsultasi Pribadi Gratis</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
