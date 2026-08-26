/**
 * Module: Salon Gallery
 * Purpose: Show selected salon work with an animated lightbox viewer.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, ColorRevealImage, remote portfolio images.
 * Public functions: Gallery()
 * Side effects: Loads remote images and controls local lightbox state.
 */
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import ColorRevealImage from './ColorRevealImage'

type GalleryImage = { id: number; imageUrl: string; title: string; category: string; beforeAfter: boolean }

export default function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/gallery?public=true', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => setGalleryImages(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setGalleryImages([]))
  }, [])

  return (
    <section className="py-20 md:py-32">
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
            Galeri{' '}
            <span className="text-primary">Portfolio</span>
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Lihat hasil kerja tim profesional kami
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedImage(image.id)}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
            >
              <ColorRevealImage src={image.imageUrl} alt={image.title} />
              <div className="absolute inset-0 flex items-end bg-black/70 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div>
                  <h3 className="text-white text-xl font-semibold">{image.title}</h3>
                  <p className="text-white/70 capitalize">{image.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={galleryImages.find((img) => img.id === selectedImage)?.imageUrl}
            alt={galleryImages.find((img) => img.id === selectedImage)?.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </motion.div>
      )}
    </section>
  )
}
