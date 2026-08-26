'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
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

const services = [
  {
    name: 'Potong & Styling Rambut',
    description: 'Potong rambut profesional dengan styling modern sesuai tren terkini',
    icon: 'scissors',
    startingPrice: 150000,
  },
  {
    name: 'Pewarnaan & Highlight',
    description: 'Pewarnaan rambut premium dengan produk berkualitas tinggi',
    icon: 'palette',
    startingPrice: 300000,
  },
  {
    name: 'Hair Treatment & Spa',
    description: 'Perawatan rambut intensif untuk rambut sehat dan berkilau',
    icon: 'sparkles',
    startingPrice: 250000,
  },
  {
    name: 'Facial Treatment & Skincare',
    description: 'Perawatan wajah mendalam untuk kulit bersih dan glowing',
    icon: 'face-smile',
    startingPrice: 200000,
  },
  {
    name: 'Nail Art & Manicure',
    description: 'Desain kuku artistik dengan cat premium tahan lama',
    icon: 'hand',
    startingPrice: 150000,
  },
  {
    name: 'Spa & Body Massage',
    description: 'Pijat relaksasi dan perawatan tubuh menyeluruh',
    icon: 'flower-2',
    startingPrice: 350000,
  },
  {
    name: 'Makeup Pesta & Bridal',
    description: 'Makeup profesional untuk acara spesial dan pernikahan',
    icon: 'crown',
    startingPrice: 500000,
  },
  {
    name: 'Treatment Alis & Bulu Mata',
    description: 'Pembentukan dan pewarnaan alis serta extension bulu mata',
    icon: 'eye',
    startingPrice: 180000,
  },
]

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

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
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Layanan
            </span>
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan kecantikan profesional untuk kebutuhan Anda
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary-light/30 transition-all">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-text-muted text-sm mb-4">{service.description}</p>
                <div className="text-primary font-semibold">
                  Mulai {formatRupiah(service.startingPrice)}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
