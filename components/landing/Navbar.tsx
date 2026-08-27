/**
 * Module: Landing Navigation
 * Purpose: Provide responsive navigation and booking CTA for the public salon page.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, NAVIGATION_LINKS, public salon settings context.
 * Public functions: Navbar()
 * Side effects: Reads window scroll position and controls mobile menu state.
 */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAVIGATION_LINKS } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { salonName, logoUrl } = useSalonSettings()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-lg shadow-primary/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#beranda"
            aria-label={`${salonName}, kembali ke beranda`}
            className="flex min-w-0 items-center gap-2"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f7efe4]/70 bg-[#f7efe4] p-1 shadow-[0_4px_18px_rgba(0,0,0,0.24)] sm:h-12 sm:w-12 sm:p-1.5"><img src={logoUrl} alt="" aria-hidden="true" className="h-full w-full object-contain" /></span>
            <span className="max-w-[12rem] truncate font-display text-xl font-bold leading-none text-foreground sm:max-w-[16rem] sm:text-2xl">{salonName}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-light hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#kontak"
              className="rounded-full bg-primary px-6 py-2.5 font-medium text-white transition-all duration-200 hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30"
            >
              Booking Sekarang
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {NAVIGATION_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-text-light hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#kontak"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-full bg-primary px-6 py-3 text-center font-medium text-white"
              >
                Booking Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
