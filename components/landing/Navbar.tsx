/**
 * Module: Landing Navigation
 * Purpose: Provide responsive, floating glass navigation with live status indicator and quick booking CTA.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, WhatsApp number, public salon settings context, SalonStatusBadge.
 * Public functions: Navbar()
 * Side effects: Listens to window scroll position and manages mobile menu drawer.
 */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'
import SalonStatusBadge from './SalonStatusBadge'

const NAV_ITEMS = [
  { label: 'Layanan', href: '#layanan' },
  { label: 'Transformasi', href: '#transformasi' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Kursus', href: '#kursus' },
  { label: 'Lokasi & Jam', href: '#lokasi' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { salonName, logoUrl } = useSalonSettings()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#140e19]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a
            href="#beranda"
            aria-label={`${salonName}, kembali ke beranda`}
            className="flex min-w-0 items-center gap-3 group"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-gold/50 bg-[#f8f1e7] p-1 shadow-[0_4px_18px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105 sm:h-12 sm:w-12 sm:p-1.5">
              <img
                src={logoUrl || '/brand/logo.webp'}
                alt={`${salonName} logo`}
                className="h-full w-full object-contain"
              />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-white transition-colors group-hover:text-accent-gold sm:text-xl">
                {salonName}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-accent-gold font-medium">
                Haute Beauty & Spa
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links & Status */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navigasi Utama">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text-light/80 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action & Status Badge */}
          <div className="hidden md:flex items-center gap-4">
            <SalonStatusBadge className="hidden xl:inline-flex" />
            <a
              href="#booking"
              className="rounded-full border border-accent-gold/50 bg-accent-gold/10 px-4 py-2 text-xs font-semibold text-accent-gold transition-all duration-200 hover:bg-accent-gold hover:text-elin-ink"
            >
              Reservasi Online
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent-gold px-4 py-2 text-xs font-semibold text-elin-ink shadow-md shadow-accent-gold/20 transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-surface/80 text-white backdrop-blur-md"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b border-white/10 bg-[#160f1b]/95 backdrop-blur-2xl px-6 py-6"
          >
            <div className="mb-4">
              <SalonStatusBadge />
            </div>
            <div className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-base font-medium text-text-light hover:text-accent-gold transition-colors border-b border-white/5"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="#booking"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent-gold py-3 text-center text-sm font-semibold text-accent-gold"
              >
                <span>Pilih Jadwal Booking</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-gold py-3 text-center text-sm font-semibold text-elin-ink"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
