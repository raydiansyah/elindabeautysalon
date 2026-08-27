/**
 * Module: About Elynd
 * Purpose: Explain the salon point of view and service experience from editable public settings.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, public settings API, salon settings context, remote salon image.
 * Public functions: About()
 * Side effects: Loads a remote image; no data writes.
 */
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Award, Users, Star, Trophy } from 'lucide-react'
import { useSalonSettings } from './SalonSettingsProvider'

const statIcons = [Award, Users, Star, Trophy]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop')
  const { salonName, aboutTitle, aboutHighlight, aboutDescription, aboutStat1Value, aboutStat1Label, aboutStat2Value, aboutStat2Label, aboutStat3Value, aboutStat3Label, aboutStat4Value, aboutStat4Label } = useSalonSettings()
  const stats = [
    { icon: statIcons[0], value: aboutStat1Value, label: aboutStat1Label },
    { icon: statIcons[1], value: aboutStat2Value, label: aboutStat2Label },
    { icon: statIcons[2], value: aboutStat3Value, label: aboutStat3Label },
    { icon: statIcons[3], value: aboutStat4Value, label: aboutStat4Label },
  ]

  useEffect(() => {
    fetch('/api/settings?public=true', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => { if (payload.data?.aboutImageUrl) setImageUrl(payload.data.aboutImageUrl) })
      .catch(() => undefined)
  }, [])

  return (
    <section id="tentang" className="py-20 md:py-32 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden rounded-2xl bg-surface-light">
              <img
                src={imageUrl}
                alt={`${salonName} interior`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-2xl bg-primary/25" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              {aboutTitle}{' '}
              <span className="text-primary">{aboutHighlight}</span>
            </h2>
            <p className="text-text-light text-lg leading-relaxed mb-8">
              {aboutDescription}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-surface/50 backdrop-blur-sm p-6 rounded-xl border border-border"
                >
                  <stat.icon className="w-8 h-8 text-primary mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
