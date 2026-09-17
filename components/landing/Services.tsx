/**
 * Module: Salon Services Section
 * Purpose: Present categorized treatment menu with interactive filtering and direct booking link.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: TreatmentExplorer, Framer Motion, salon settings context.
 * Public functions: Services()
 * Side effects: None.
 */
'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import TreatmentExplorer from './TreatmentExplorer'

export default function Services({
  onSelectTreatment,
}: {
  onSelectTreatment?: (treatmentName: string) => void
}) {
  return (
    <section id="layanan" className="relative isolate py-24 md:py-36 overflow-hidden">
      {/* Subtle Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-accent-gold/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Katalog Perawatan Eksklusif</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Perawatan yang dirancang untuk{' '}
            <span className="font-serif italic font-normal text-accent-gold">
              kebutuhanmu.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-light/80 max-w-2xl mx-auto font-light leading-relaxed">
            Pilih kategori di bawah untuk melihat pilihan perawatan rambut, peremajaan kulit, spa tubuh, hingga riasan profesional.
          </p>
        </motion.div>

        {/* Interactive Treatment Explorer */}
        <TreatmentExplorer onSelectTreatment={onSelectTreatment} />
      </div>
    </section>
  )
}
