'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'

const pricingTiers = [
  {
    name: 'Basic',
    price: 150000,
    features: [
      'Potong rambut standar',
      'Cuci & blow dry',
      'Konsultasi gaya rambut',
      'Minuman gratis',
    ],
    isPopular: false,
  },
  {
    name: 'Premium',
    price: 350000,
    features: [
      'Semua fitur Basic',
      'Hair treatment premium',
      'Produk berkualitas tinggi',
      'Head massage 15 menit',
      'Diskon 10% kunjungan berikutnya',
    ],
    isPopular: true,
  },
  {
    name: 'VIP',
    price: 750000,
    features: [
      'Semua fitur Premium',
      'Private room',
      'Senior stylist',
      'Full spa treatment',
      'Complimentary snacks',
      'Priority booking',
      'Diskon 20% semua layanan',
    ],
    isPopular: false,
  },
]

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="harga" className="py-20 md:py-32 bg-surface/30">
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
            Harga{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Layanan
            </span>
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan dan budget Anda
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative rounded-2xl p-8 ${
                tier.isPopular
                  ? 'bg-gradient-to-br from-primary to-primary-light shadow-xl shadow-primary/30 scale-105'
                  : 'bg-surface/50 backdrop-blur-sm border border-border'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-gold text-secondary text-sm font-semibold rounded-full">
                  Populer
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className={`text-4xl font-bold mb-2 ${tier.isPopular ? 'text-white' : 'text-foreground'}`}>
                  {formatRupiah(tier.price)}
                </div>
                <p className={`text-sm ${tier.isPopular ? 'text-white/80' : 'text-text-muted'}`}>
                  per sesi
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tier.isPopular ? 'text-white' : 'text-primary'}`} />
                    <span className={tier.isPopular ? 'text-white/90' : 'text-text-light'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                  tier.isPopular
                    ? 'bg-white text-primary hover:bg-white/90'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                Pilih Paket
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
