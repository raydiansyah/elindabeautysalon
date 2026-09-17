/**
 * Module: Landing Floating WhatsApp CTA
 * Purpose: Provide an accessible, luxurious floating concierge button with live pulse.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, WhatsApp number, public salon settings context.
 * Public functions: WhatsAppButton().
 * Side effects: Opens an external WhatsApp conversation when clicked.
 */
'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

export default function WhatsAppButton() {
  const { salonName } = useSalonSettings()
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Halo ${salonName}, saya ingin konsultasi dan membuat reservasi.`
  )}`

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-emerald-400/40 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white shadow-2xl shadow-emerald-900/50 backdrop-blur-md transition-all duration-300 hover:brightness-110"
      aria-label="Chat WhatsApp Concierge"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
      <MessageCircle className="h-5 w-5" />
      <span className="text-xs font-bold tracking-wide hidden sm:inline">
        Chat Resepsionis
      </span>
    </motion.a>
  )
}
