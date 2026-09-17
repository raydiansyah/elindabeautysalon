/**
 * Module: Elin landing hero
 * Purpose: Introduce the salon and create two clear booking paths.
 * Used by: ElinLanding on the public home route.
 * Dependencies: GSAP, salon settings context, Elin content constants.
 * Public functions: ElinHero().
 * Side effects: Attaches a scrubbed hero reveal to the browser scroll timeline.
 */
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'
import { HERO_IMAGE } from './elin-data'

export default function ElinHero() {
  const ref = useRef<HTMLElement>(null)
  const { salonName } = useSalonSettings()

  useGSAP(() => {
    const visual = ref.current?.querySelector('[data-elin-hero-visual]')
    if (!visual) return
    gsap.fromTo(visual, { scale: 1.12, opacity: 0.2 }, {
      scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, { scope: ref })

  return (
    <section ref={ref} id="beranda" className="relative isolate min-h-[780px] overflow-hidden bg-elin-ink">
      <div data-elin-hero-visual className="absolute inset-0 bg-cover bg-center grayscale-[18%] contrast-110" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-elin-ink/70" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[780px] max-w-[1440px] items-end px-6 pb-16 pt-32 sm:px-10 lg:px-16 lg:pb-24">
        <div className="max-w-6xl">
          <p className="mb-6 font-semibold text-sm uppercase tracking-[0.22em] text-elin-gold">{salonName}</p>
          <h1 className="max-w-6xl font-display text-[clamp(3.25rem,6.4vw,6.8rem)] leading-[0.94] tracking-[-0.06em] text-elin-ivory">
            Ruang untuk merasa <span className="font-serif italic text-elin-gold">lebih</span> menjadi diri sendiri.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-elin-ivory/80 md:text-lg">Perawatan rambut, kulit, dan tubuh dalam suasana yang tenang, personal, dan dibuat untuk ritme Anda.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Halo, saya ingin booking di ${salonName}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 bg-elin-gold px-6 font-semibold text-elin-ink transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-elin-ivory">Booking sekarang <ArrowUpRight className="h-5 w-5" /></a>
            <a href="#layanan" className="inline-flex min-h-12 items-center justify-center border border-elin-ivory/60 px-6 font-semibold text-elin-ivory transition-colors hover:bg-elin-ivory hover:text-elin-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-elin-ivory">Lihat layanan</a>
          </div>
        </div>
      </div>
    </section>
  )
}
