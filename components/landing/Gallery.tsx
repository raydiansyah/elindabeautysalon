/**
 * Module: Salon Gallery & Transformation Showcase
 * Purpose: Provide tactile Before & After slider comparison and filterable portfolio lookbook.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, BeforeAfterSlider, public gallery API.
 * Public functions: Gallery()
 * Side effects: Fetches public gallery images from /api/gallery?public=true.
 */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { X, Sparkles, Eye, Camera } from 'lucide-react'
import BeforeAfterSlider from './BeforeAfterSlider'

type GalleryImage = {
  id: number | string
  imageUrl: string
  title: string
  category: string
}

const FALLBACK_GALLERY: GalleryImage[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80&fit=crop',
    title: 'Modern Salon Ambience',
    category: 'Suasana',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80&fit=crop',
    title: 'Ash Blonde Balayage & Wave',
    category: 'Rambut',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&fit=crop',
    title: 'Radiant Glow Facial Treatment',
    category: 'Skincare',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80&fit=crop',
    title: 'Artisan Gel Nail Art',
    category: 'Nails',
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80&fit=crop',
    title: 'Soft Layer Cut & Blow Finish',
    category: 'Rambut',
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80&fit=crop',
    title: 'Flawless Editorial Makeup',
    category: 'Makeup',
  },
]

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(FALLBACK_GALLERY)
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [activeLightbox, setActiveLightbox] = useState<GalleryImage | null>(null)

  useEffect(() => {
    fetch('/api/gallery?public=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => {
        const data = Array.isArray(payload) ? payload : payload?.data
        if (Array.isArray(data) && data.length > 0) {
          const mapped: GalleryImage[] = data.map((item, idx) => ({
            id: item.id || idx,
            imageUrl: item.imageUrl,
            title: item.title,
            category: item.category || 'Portfolio',
          }))
          setGalleryImages(mapped)
        }
      })
      .catch(() => undefined)
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    set.add('Semua')
    galleryImages.forEach((img) => {
      if (img.category) set.add(img.category)
    })
    return Array.from(set)
  }, [galleryImages])

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'Semua') return galleryImages
    return galleryImages.filter(
      (img) => img.category.toLowerCase() === selectedCategory.toLowerCase()
    )
  }, [selectedCategory, galleryImages])

  return (
    <section id="galeri" className="py-24 md:py-36 bg-surface/20 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Transformation Section */}
        <div id="transformasi" className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bukti Nyata Kualitas</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Transformasi sebelum &{' '}
              <span className="font-serif italic font-normal text-accent-gold">
                sesudah perawatan.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-light/80 max-w-2xl mx-auto font-light leading-relaxed">
              Tarik tuas slider di bawah ini untuk melihat langsung perubahan tekstur, kilau, dan kesehatan rambut serta kulit para klien kami.
            </p>
          </motion.div>

          <BeforeAfterSlider />
        </div>

        {/* Portfolio Lookbook Section */}
        <div className="pt-16 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold mb-2">
                <Camera className="h-4 w-4" />
                <span>Katalog Inspirasi</span>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Galeri & Suasana Salon
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-accent-gold text-elin-ink font-semibold shadow-sm'
                      : 'border border-white/15 bg-surface/50 text-text-light hover:border-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Lookbook Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={img.id}
                  onClick={() => setActiveLightbox(img)}
                  className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl border border-white/10 bg-surface cursor-pointer"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-elin-ink/90 via-elin-ink/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-gold">
                      {img.category}
                    </span>
                    <h4 className="font-display text-lg font-bold text-white mt-1">
                      {img.title}
                    </h4>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-text-light">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Klik untuk memperbesar</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              aria-label="Tutup preview galeri"
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/15 bg-surface shadow-2xl"
            >
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
              <div className="p-5 bg-surface-light flex items-center justify-between border-t border-white/10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-gold">
                    {activeLightbox.category}
                  </span>
                  <h4 className="font-display text-xl font-bold text-white mt-0.5">
                    {activeLightbox.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLightbox(null)}
                  className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
