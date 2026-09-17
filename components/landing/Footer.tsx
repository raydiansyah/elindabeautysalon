/**
 * Module: Landing Footer
 * Purpose: Close the public salon experience with editorial brand identity, quick links, contacts, and scroll-to-top action.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, WhatsApp number, public salon settings context.
 * Public functions: Footer()
 * Side effects: Scrolls window to top smoothly.
 */
'use client'

import { motion } from 'framer-motion'
import { Camera, Music, MessageCircle, ChevronUp, MapPin, Phone, Clock } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

export default function Footer() {
  const { salonName, logoUrl, instagramUrl, tiktokUrl } = useSalonSettings()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-[#110b15] border-t border-white/10 pt-20 pb-12 overflow-hidden text-text-light">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-gold/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-gold/50 bg-[#f8f1e7] p-1 shadow-[0_4px_18px_rgba(0,0,0,0.3)]">
                <img
                  src={logoUrl || '/brand/logo.webp'}
                  alt={`${salonName} logo`}
                  className="h-full w-full object-contain"
                />
              </span>
              <div>
                <span className="font-display text-xl font-bold text-white block">
                  {salonName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-medium">
                  Haute Beauty & Spa
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light">
              Destinasi perawatan personal di mana ketenangan, kebersihan higienis, dan keahlian artistik berpadu untuk memancarkan pesona terbaik Anda.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={instagramUrl || 'https://instagram.com/elyndbeauty'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-surface/60 text-text-light hover:border-accent-gold hover:text-accent-gold hover:bg-surface-light transition-all"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href={tiktokUrl || 'https://tiktok.com/@elyndbeauty'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-surface/60 text-text-light hover:border-accent-gold hover:text-accent-gold hover:bg-surface-light transition-all"
                aria-label="TikTok"
              >
                <Music className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-surface/60 text-text-light hover:border-accent-gold hover:text-accent-gold hover:bg-surface-light transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-4">
              Jelajahi Salon
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#beranda" className="hover:text-accent-gold transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-accent-gold transition-colors">
                  Katalog Layanan
                </a>
              </li>
              <li>
                <a href="#transformasi" className="hover:text-accent-gold transition-colors">
                  Before & After Slider
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-accent-gold transition-colors">
                  Galeri Lookbook
                </a>
              </li>
              <li>
                <a href="#promosi" className="hover:text-accent-gold transition-colors">
                  Promo & Voucher
                </a>
              </li>
              <li>
                <a href="#kursus" className="hover:text-accent-gold transition-colors">
                  Akademi & Kursus
                </a>
              </li>
            </ul>
          </div>

          {/* Treatments Highlights */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-4">
              Perawatan Utama
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-text-muted">
              <li>Balayage & Hair Coloring</li>
              <li>Glossing Keratin Treatment</li>
              <li>Oxygen Infusion Glow Facial</li>
              <li>Aromatherapy Body Massage</li>
              <li>Russian Gel Spa Manicure</li>
              <li>Bridal & Event Makeup</li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-4">
              Hubungi Resepsionis
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent-gold shrink-0 mt-0.5" />
                <span className="text-text-muted">
                  Jl. Senopati Raya No. 45, Jakarta Selatan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent-gold shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-gold transition-colors"
                >
                  +62 {WHATSAPP_NUMBER.replace(/^62/, '')}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-accent-gold shrink-0" />
                <span className="text-text-muted">
                  Setiap Hari: 09:00 - 21:00 WIB
                </span>
              </li>
              <li className="pt-2">
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center rounded-xl bg-accent-gold/15 border border-accent-gold/40 px-4 py-2 text-xs font-semibold text-accent-gold hover:bg-accent-gold hover:text-elin-ink transition-colors"
                >
                  Reservasi Jadwal Sekarang
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {salonName}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-text-muted">
            <span>Higienis & Tersertifikasi</span>
            <span>•</span>
            <span>Bebas Hewan Uji Coba</span>
            <span>•</span>
            <span>Produk Resmi</span>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <motion.button
        type="button"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Kembali ke atas"
        className="fixed bottom-6 right-24 z-40 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-surface/90 text-white shadow-xl backdrop-blur-md hover:bg-accent-gold hover:text-elin-ink transition-colors"
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>
    </footer>
  )
}
