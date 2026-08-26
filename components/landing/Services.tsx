/**
 * Module: Salon Services
 * Purpose: Present the salon treatment menu without publishing fixed prices.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons.
 * Public functions: Services()
 * Side effects: None; renders service information.
 */
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  Scissors,
  Palette,
  Sparkles,
  Smile,
  Hand,
  Flower2,
  Crown,
  Eye,
} from 'lucide-react'

const iconMap = {
  scissors: Scissors,
  palette: Palette,
  sparkles: Sparkles,
  'face-smile': Smile,
  hand: Hand,
  'flower-2': Flower2,
  crown: Crown,
  eye: Eye,
}

type Service = { id: number; name: string; description: string; icon: keyof typeof iconMap }

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetch('/api/services?public=true', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => setServices(Array.isArray(payload) ? payload : payload.data ?? []))
      .catch(() => setServices([]))
  }, [])

  return (
    <section id="layanan" className="py-20 md:py-32">
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
            Jenis{' '}
            <span className="text-primary">Layanan</span>
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan kecantikan profesional untuk kebutuhan Anda
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid min-h-32 grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {!services.length && <p className="col-span-full text-center text-text-muted">Layanan sedang diperbarui.</p>}
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 transition-colors group-hover:bg-primary/25">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-text-muted text-sm mb-4">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
