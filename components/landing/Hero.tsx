/**
 * Module: Landing Hero
 * Purpose: Render an editorial salon introduction with an always-visible brand image.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: GSAP, ScrollTrigger, @gsap/react, lucide-react, public settings API, salon settings context, Tailwind CSS.
 * Public functions: Hero()
 * Side effects: Loads the configured image and attaches scroll animation listeners; no data writes.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { salonName } = useSalonSettings()
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&q=85&fit=crop')

  useEffect(() => {
    fetch('/api/settings?public=true', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => { if (payload.data?.heroImageUrl) setImageUrl(payload.data.heroImageUrl) })
      .catch(() => undefined)
  }, [])

  useGSAP(() => {
    const hero = heroRef.current
    if (!hero) return

    const visual = hero.querySelector('[data-hero-visual]')
    const orbit = hero.querySelector('[data-hero-orbit]')

    gsap.to(orbit, { rotation: 360, duration: 32, ease: 'none', repeat: -1 })
    gsap.fromTo(visual, { scale: 0.88, opacity: 0.35 }, {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    })

  }, { scope: heroRef })

  return (
    <section ref={heroRef} id="beranda" className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[#171014]" />
      <div
        data-hero-visual
        className="absolute inset-[-4%] bg-cover bg-center opacity-95 saturate-125 contrast-110"
        style={{ backgroundImage: `url('${imageUrl}')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#120c10]/60" />
      <div className="absolute right-[18%] top-[22%] h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div data-hero-orbit className="absolute right-[8%] top-[20%] h-72 w-72 rounded-full border border-white/20 md:h-[34rem] md:w-[34rem]" aria-hidden="true" />
      <div className="absolute bottom-[16%] left-[8%] h-px w-40 bg-white/50 md:w-72" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-end px-5 pb-28 pt-36 sm:px-8 lg:px-12">
        <div className="max-w-6xl">
          <div className="mb-7 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.28em] text-white/70">
            <Sparkles className="h-4 w-4 text-accent-rose" />
            {salonName}
          </div>
          <h1 className="max-w-6xl font-display text-[clamp(3rem,7vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.06em] text-white">
            Ruang untuk merasa <span className="text-accent-rose">lebih</span> diri sendiri.
          </h1>

        <p
          className="mb-10 mt-8 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl"
        >
          Tampil cantik dan percaya diri bersama tim stylist profesional kami
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#layanan"
            className="group inline-flex items-center justify-center gap-3 bg-white px-7 py-4 font-semibold text-[#171014] transition-transform duration-300 hover:-translate-y-1"
          >
            Jelajahi layanan <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-white/45 px-7 py-4 font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            Chat WhatsApp
          </a>
        </div>
      </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-5 sm:left-8 lg:left-12">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <span className="text-sm">Scroll untuk melihat</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  )
}
