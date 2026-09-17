/**
 * Module: Interactive Treatment Explorer
 * Purpose: Provide categorized salon treatment discovery with filter tabs and quick-booking dispatch.
 * Used by: Services section on public landing page.
 * Dependencies: React, Framer Motion, Lucide icons, public services API.
 * Public functions: TreatmentExplorer().
 * Side effects: Fetches public services list from /api/services?public=true.
 */
'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scissors,
  Sparkles,
  Smile,
  Hand,
  Flower2,
  Brush,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'

export type Treatment = {
  id: number | string
  name: string
  category: string
  duration: string
  description: string
  highlights?: string[]
  icon: string
  popular?: boolean
}

const FALLBACK_TREATMENTS: Treatment[] = [
  {
    id: 'hair-1',
    name: 'Signature Cut & Botanical Blowout',
    category: 'Hair',
    duration: '60 - 75 mnt',
    description: 'Analisa bentuk wajah, potong presisi bertingkat, dan blow styling dengan serum nutrisi alami.',
    highlights: ['Konsultasi bentuk wajah', 'Cuci rambut & pijat relaksasi', 'Heat protection serum'],
    icon: 'scissors',
    popular: true,
  },
  {
    id: 'hair-2',
    name: 'Balayage & Dimensional Color Melting',
    category: 'Hair',
    duration: '180 - 240 mnt',
    description: 'Pewarnaan bergradasi natural dengan teknologi plex untuk menjaga keutuhan batang rambut.',
    highlights: ['Custom color mapping', 'Bond repair protection', 'Color sealing treatment'],
    icon: 'scissors',
    popular: true,
  },
  {
    id: 'hair-3',
    name: 'Glossing Keratin Treatment',
    category: 'Hair',
    duration: '90 - 120 mnt',
    description: 'Formula keratin mendalam yang meluruskan rambut kusut tanpa membuatnya lepek atau kaku.',
    highlights: ['Anti-frizz hingga 3 bulan', 'Bebas formaldehyde tajam', 'Kilau instan'],
    icon: 'scissors',
  },
  {
    id: 'skin-1',
    name: 'Oxygen Infusion Glow Facial',
    category: 'Facial',
    duration: '60 mnt',
    description: 'Pembersihan komedo higienis, hidrasi serum asam hialuronat, dan infus oksigen murni untuk kesegaran instan.',
    highlights: ['Ekstraksi minim rasa sakit', 'Masker peel-off pendingin', 'Lymphatic face massage'],
    icon: 'face-smile',
    popular: true,
  },
  {
    id: 'skin-2',
    name: 'Deep Pore Clarifying Therapy',
    category: 'Facial',
    duration: '75 mnt',
    description: 'Perawatan khusus kulit berjerawat dan pori tersumbat menggunakan eksfoliasi enzim yang aman dan menenangkan.',
    highlights: ['Double cleansing botani', 'High frequency antibacterial', 'Calming cica mask'],
    icon: 'face-smile',
  },
  {
    id: 'spa-1',
    name: 'Aromatherapy Balinese Body Massage',
    category: 'Spa',
    duration: '90 mnt',
    description: 'Pijatan ritmis bertekanan pas dengan minyak esensial hangat untuk meredakan ketegangan otot dan stres.',
    highlights: ['Minyak organik esensial', 'Totok punggung & pundak', 'Teh herbal rempah penutup'],
    icon: 'flower-2',
    popular: true,
  },
  {
    id: 'spa-2',
    name: 'Sensory Body Scrub & Milk Bath',
    category: 'Spa',
    duration: '90 mnt',
    description: 'Lulur butiran lembut pengangkat sel kulit mati dilanjutkan berendam air susu hangat yang melembutkan kulit.',
    highlights: ['Scrub alami melati/kopi', 'Moisturizing milk soak', 'Skin barrier body lotion'],
    icon: 'flower-2',
  },
  {
    id: 'nail-1',
    name: 'Spa Manicure & Russian Gel Polish',
    category: 'Nails',
    duration: '60 mnt',
    description: 'Pembersihan kutikula rapi tanpa luka, scrub tangan, dan aplikasi gel polish tahan lama anti-mengelupas.',
    highlights: ['Pembersihan kutikula detail', 'Kuteks gel non-toxic', 'Hand massage relaksasi'],
    icon: 'hand',
  },
  {
    id: 'nail-2',
    name: 'Express Pedicure & Foot Reflexology',
    category: 'Nails',
    duration: '60 mnt',
    description: 'Perawatan tumit halus, perapihan kuku kaki, dan pijat titik refleksi telapak kaki untuk melancarkan sirkulasi.',
    highlights: ['Foot soak aromaterapi', 'Perawatan tumit pecah', 'Foot massage refleksi'],
    icon: 'hand',
  },
  {
    id: 'makeup-1',
    name: 'Flawless Soft Glam Makeup',
    category: 'Makeup',
    duration: '60 - 90 mnt',
    description: 'Riasan wajah tahan seharian dengan teknik complexion ringan, bulu mata natural, dan finishing glowing mewah.',
    highlights: ['Skin prep optimal', 'Complexion tahan geser', 'Touch-up mini kit'],
    icon: 'brush',
    popular: true,
  },
]

const CATEGORIES = [
  { id: 'all', label: 'Semua Layanan' },
  { id: 'Hair', label: 'Rambut & Warna' },
  { id: 'Facial', label: 'Wajah & Skincare' },
  { id: 'Spa', label: 'Spa & Relaksasi' },
  { id: 'Nails', label: 'Kuku & Mani-Pedi' },
  { id: 'Makeup', label: 'Makeup & Riasan' },
]

export default function TreatmentExplorer({
  onSelectTreatment,
}: {
  onSelectTreatment?: (treatmentName: string) => void
}) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [treatments, setTreatments] = useState<Treatment[]>(FALLBACK_TREATMENTS)

  useEffect(() => {
    fetch('/api/services?public=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => {
        const data = Array.isArray(payload) ? payload : payload.data
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with rich interactive structure
          const mapped: Treatment[] = data.map((item, index) => ({
            id: item.id || index,
            name: item.name,
            category: item.category || (index % 2 === 0 ? 'Hair' : 'Facial'),
            duration: item.duration || '60 mnt',
            description: item.description,
            icon: item.icon || 'scissors',
            highlights: ['Konsultasi personal', 'Stylist berpengalaman', 'Produk salon premium'],
            popular: index === 0 || index === 2,
          }))
          setTreatments(mapped)
        }
      })
      .catch(() => undefined)
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return treatments
    return treatments.filter((t) => t.category.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory, treatments])

  const handleBook = (treatmentName: string) => {
    if (onSelectTreatment) {
      onSelectTreatment(treatmentName)
    }
    // Smooth scroll to booking section
    const bookingEl = document.getElementById('booking')
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Category Tabs */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`relative rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-300 sm:text-sm ${
                isActive ? 'text-elin-ink' : 'text-text-light hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTreatmentCategory"
                  className="absolute inset-0 rounded-full bg-accent-gold shadow-md shadow-accent-gold/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Treatments Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-surface/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/40 hover:shadow-xl hover:shadow-accent-gold/5"
            >
              {item.popular && (
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-accent-gold/15 px-3 py-1 text-[11px] font-semibold text-accent-gold border border-accent-gold/30">
                  <Sparkles className="h-3 w-3" />
                  <span>Favorit Tamu</span>
                </div>
              )}

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-light text-accent-gold border border-white/10 group-hover:bg-accent-gold group-hover:text-elin-ink transition-colors duration-300">
                    {item.icon === 'scissors' ? (
                      <Scissors className="h-5 w-5" />
                    ) : item.icon === 'flower-2' ? (
                      <Flower2 className="h-5 w-5" />
                    ) : item.icon === 'hand' ? (
                      <Hand className="h-5 w-5" />
                    ) : item.icon === 'brush' ? (
                      <Brush className="h-5 w-5" />
                    ) : (
                      <Smile className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5 text-accent-gold" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-white transition-colors group-hover:text-accent-gold">
                  {item.name}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
                  {item.description}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-xs text-text-light">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-gold/80" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => handleBook(item.name)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-accent-gold hover:text-white transition-colors"
                >
                  <span>Reservasi Sekarang</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Halo, saya ingin bertanya dan konsultasi mengenai perawatan ${item.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-muted hover:text-white transition-colors"
                >
                  Konsultasi WA
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
