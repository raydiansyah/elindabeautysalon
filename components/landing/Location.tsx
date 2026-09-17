/**
 * Module: Salon Location & Contact Section
 * Purpose: Render responsive Google Maps embed, interactive directions button, today-highlighted hours, and contact channels.
 * Used by: Public landing page at / via app/page.tsx.
 * Dependencies: React useSyncExternalStore, Framer Motion, Lucide icons, OPENING_HOURS constants, public salon settings.
 * Public functions: Location()
 * Side effects: Loads Google Maps in lazy iframe.
 */
'use client'

import { useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Mail, MessageCircle, Navigation } from 'lucide-react'
import { OPENING_HOURS, WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'
import SalonStatusBadge from './SalonStatusBadge'

function subscribeToDay(callback: () => void) {
  const interval = setInterval(callback, 60000)
  return () => clearInterval(interval)
}

function getTodayClientName(): string {
  const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return daysMap[new Date().getDay()]
}

function getTodayServerName(): string {
  return ''
}

export default function Location() {
  const { salonName, mapsEmbedUrl } = useSalonSettings()
  const todayName = useSyncExternalStore(subscribeToDay, getTodayClientName, getTodayServerName)

  const defaultMapsUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.28299839958!2d106.759478!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e49fe3ddb3%3A0x72a5a54659b867c4!2sJakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'

  const activeEmbedUrl =
    mapsEmbedUrl && mapsEmbedUrl !== 'https://www.google.com/maps/embed?pb=your-maps-embed-url'
      ? mapsEmbedUrl
      : defaultMapsUrl

  return (
    <section id="lokasi" className="py-24 md:py-36 relative overflow-hidden bg-elin-ink/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            <MapPin className="h-3.5 w-3.5" />
            <span>Kunjungan & Lokasi</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Temukan kenyamanan kami di{' '}
            <span className="font-serif italic font-normal text-accent-gold">
              pusat kota.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-light/80 max-w-2xl mx-auto font-light leading-relaxed">
            Akses strategis dengan fasilitas parkir nyaman dan ruang perawatan yang tenang.
          </p>
        </motion.div>

        {/* 2-Column Map & Details Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Google Maps Frame */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-surface/40 shadow-2xl backdrop-blur-md"
          >
            <div className="relative min-h-[380px] sm:min-h-[460px] w-full flex-1">
              <iframe
                src={activeEmbedUrl}
                title={`Peta Lokasi ${salonName}`}
                width="100%"
                height="100%"
                className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-110"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-surface border-t border-white/10">
              <div className="flex items-center gap-2.5 text-xs text-text-light">
                <MapPin className="h-4 w-4 text-accent-gold" />
                <span>Navigasi instan via smartphone</span>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-gold px-4 py-2 text-xs font-semibold text-elin-ink transition-transform hover:scale-105 shadow-md shadow-accent-gold/20"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Buka di Google Maps</span>
              </a>
            </div>
          </motion.div>

          {/* Right: Operational Hours & Direct Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            {/* Hours Card with Today Highlight */}
            <div className="rounded-3xl border border-white/15 bg-surface/70 p-6 sm:p-7 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5 text-base font-semibold text-white">
                  <Clock className="h-5 w-5 text-accent-gold" />
                  <span>Jadwal Operasional</span>
                </div>
                <SalonStatusBadge />
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                {OPENING_HOURS.map((item) => {
                  const isToday = item.day === todayName
                  return (
                    <div
                      key={item.day}
                      suppressHydrationWarning
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        isToday
                          ? 'bg-accent-gold/15 border border-accent-gold/30 text-accent-gold font-semibold'
                          : 'text-text-light/80 hover:bg-white/5'
                      }`}
                    >
                      <span suppressHydrationWarning className="flex items-center gap-2">
                        {isToday && <span className="h-1.5 w-1.5 rounded-full bg-accent-gold animate-pulse" />}
                        <span>{item.day}</span>
                        {isToday && <span className="text-[10px] uppercase font-bold text-accent-gold">(Hari Ini)</span>}
                      </span>
                      <span suppressHydrationWarning className={isToday ? 'text-white' : 'text-text-muted'}>
                        {item.hours}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contact Channels Card */}
            <div className="rounded-3xl border border-white/15 bg-surface/70 p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Pusat Kontak & Bantuan
              </h3>

              <div className="flex items-start gap-3.5 text-xs sm:text-sm text-text-light">
                <MapPin className="h-4 w-4 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Alamat Salon</p>
                  <p className="text-text-muted mt-0.5 leading-relaxed">
                    Jl. Senopati Raya No. 45, Kebayoran Baru, Jakarta Selatan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs sm:text-sm text-text-light">
                <MessageCircle className="h-4 w-4 text-accent-gold shrink-0" />
                <div>
                  <p className="font-semibold text-white">WhatsApp Concierge</p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-gold hover:underline"
                  >
                    +62 {WHATSAPP_NUMBER.replace(/^62/, '')}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs sm:text-sm text-text-light">
                <Mail className="h-4 w-4 text-accent-gold shrink-0" />
                <div>
                  <p className="font-semibold text-white">Email Resmi</p>
                  <a href="mailto:hello@elyndbeauty.com" className="text-text-muted hover:text-white">
                    hello@elyndbeauty.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
