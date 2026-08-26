'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { X } from 'lucide-react'

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=800&fit=crop',
    title: 'Modern Bob Cut',
    category: 'hair',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop',
    title: 'Glowing Facial Treatment',
    category: 'facial',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop',
    title: 'Elegant Nail Design',
    category: 'nail',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=800&fit=crop',
    title: 'Bridal Makeup Look',
    category: 'makeup',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop',
    title: 'Relaxing Spa Treatment',
    category: 'spa',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=800&fit=crop',
    title: 'Balayage Hair Color',
    category: 'hair',
  },
]

export default function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

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
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Portfolio
            </span>
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
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
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
            src={galleryImages.find((img) => img.id === selectedImage)?.src}
            alt={galleryImages.find((img) => img.id === selectedImage)?.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </motion.div>
      )}
    </section>
  )
}
