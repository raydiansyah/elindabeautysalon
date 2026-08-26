/**
 * Module: Landing Footer
 * Purpose: Close the public salon experience with navigation, social links, and contact details.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, public salon settings context.
 * Public functions: Footer()
 * Side effects: Reads the current year and scrolls the browser to the page top.
 */
'use client'

import { motion } from 'framer-motion'
import { Sparkles, Camera, Music, MessageCircle, ChevronUp } from 'lucide-react'
import { useSalonSettings } from './SalonSettingsProvider'

export default function Footer() {
  const { salonName } = useSalonSettings()
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-secondary border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="max-w-[16rem] truncate font-display text-2xl font-bold leading-none text-foreground">{salonName}</span>
            </div>
            <p className="text-text-light mb-6">
              Beauty salon profesional dengan layanan terbaik untuk kecantikan dan wellness Anda.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/elyndbeauty"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface/50 rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="Instagram"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com/@elyndbeauty"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface/50 rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="TikTok"
              >
                <Music className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface/50 rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Link Cepat</h3>
            <ul className="space-y-3">
              <li>
                <a href="#beranda" className="text-text-light hover:text-primary transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#tentang" className="text-text-light hover:text-primary transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#layanan" className="text-text-light hover:text-primary transition-colors">
                  Layanan
                </a>
              </li>
              <li>
                <a href="#kursus" className="text-text-light hover:text-primary transition-colors">
                  Kursus
                </a>
              </li>
              <li>
                <a href="#lokasi" className="text-text-light hover:text-primary transition-colors">
                  Lokasi
                </a>
              </li>
              <li>
                <a href="#kontak" className="text-text-light hover:text-primary transition-colors">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-3 text-text-light">
              <li>Jl. Contoh No. 123</li>
              <li>Jakarta Selatan, Indonesia</li>
              <li>
                <a href="tel:+622112345678" className="hover:text-primary transition-colors">
                  +62 21 1234 5678
                </a>
              </li>
              <li>
                <a href="mailto:info@elynd-beauty.com" className="hover:text-primary transition-colors">
                  info@elynd-beauty.com
                </a>
              </li>
              <li>Senin - Minggu: 08:00 - 22:00</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-text-muted">
            © {new Date().getFullYear()} {salonName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-24 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-light transition-colors z-40"
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </footer>
  )
}
