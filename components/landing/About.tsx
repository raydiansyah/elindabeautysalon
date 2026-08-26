'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, Users, Star, Trophy } from 'lucide-react'

const stats = [
  { icon: Award, value: '10+', label: 'Tahun Pengalaman' },
  { icon: Users, value: '5000+', label: 'Klien Puas' },
  { icon: Star, value: '15+', label: 'Stylist Ahli' },
  { icon: Trophy, value: '20+', label: 'Penghargaan' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

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
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary-light/20">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop"
                alt="Elynd Beauty Salon Interior"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-primary to-primary-light rounded-2xl -z-10" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Tentang{' '}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Elynd
              </span>
            </h2>
            <p className="text-text-light text-lg leading-relaxed mb-8">
              Elynd Beauty Salon adalah salon kecantikan profesional dengan pengalaman lebih dari 10 tahun. 
              Kami berkomitmen memberikan layanan terbaik dengan produk berkualitas tinggi dan tim stylist 
              yang terlatih untuk membuat Anda tampil cantik dan percaya diri.
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
