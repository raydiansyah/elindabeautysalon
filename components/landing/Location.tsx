/**
 * Module: Salon Location Section
 * Purpose: Render the salon map embed, contact details, and opening hours.
 * Used by: Public landing page at / via app/page.tsx.
 * Dependencies: Framer Motion, Lucide icons, OPENING_HOURS constants, public salon settings.
 * Public functions: Location()
 * Side effects: Loads Google Maps in a lazy iframe; no application data writes.
 */
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react'
import { OPENING_HOURS } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

export default function Location() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const { mapsEmbedUrl } = useSalonSettings()

  return (
    <section id="lokasi" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Lokasi &{' '}
            <span className="text-primary">Jam Buka</span>
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Kunjungi salon kami atau hubungi untuk reservasi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-border"
          >
            {mapsEmbedUrl && mapsEmbedUrl !== 'https://www.google.com/maps/embed?pb=your-maps-embed-url' ? (
              <iframe
                src={mapsEmbedUrl}
                title="Lokasi Beauty Salon ELIN di Google Maps"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="bg-surface/50 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-text-muted">Google Maps akan ditampilkan di sini</p>
                  <p className="text-sm text-text-muted mt-2">
                    Setup NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL di .env.local
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Location Info & Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Address & Contact */}
            <div className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Alamat</h3>
                  <p className="text-text-light">
                    Jl. Contoh No. 123, Jakarta Selatan, Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Telepon</h3>
                  <a href="tel:+622112345678" className="text-text-light hover:text-primary transition-colors">
                    +62 21 1234 5678
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:info@elynd-beauty.com" className="text-text-light hover:text-primary transition-colors">
                    info@elynd-beauty.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MessageCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-light hover:text-primary transition-colors"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Jam Buka</h3>
              </div>

              <div className="space-y-3">
                {OPENING_HOURS.map((item) => (
                  <div key={item.day} className="flex justify-between items-center">
                    <span className="text-text-light">{item.day}</span>
                    <span className="text-foreground font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
