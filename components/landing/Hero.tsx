/**
 * Module: Landing Hero
 * Purpose: Render an editorial salon introduction with a pointer-reactive visual field.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: GSAP, ScrollTrigger, @gsap/react, lucide-react, public settings API, salon settings context, Tailwind CSS, React pointer state.
 * Public functions: Hero()
 * Side effects: Attaches pointer and scroll animation listeners; no data writes.
 */
'use client'

import { PointerEvent, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import { useSalonSettings } from './SalonSettingsProvider'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { salonName } = useSalonSettings()
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&q=85&fit=crop')
  const [colorReveal, setColorReveal] = useState({ x: 50, y: 50, active: false })

  function handleHeroPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    setColorReveal({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      active: true,
    })
  }

  function handleHeroPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    setColorReveal((current) => ({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      active: !current.active,
    }))
  }

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

    const moveVisual = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      gsap.to(visual, { x: x * 18, y: y * 12, duration: 0.8, ease: 'power3.out', overwrite: true })
      gsap.to(orbit, { x: x * -28, y: y * -18, duration: 1.1, ease: 'power3.out', overwrite: true })
    }

    window.addEventListener('pointermove', moveVisual, { passive: true })
    gsap.fromTo(visual, { scale: 0.88, opacity: 0.35 }, {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    })

    return () => window.removeEventListener('pointermove', moveVisual)
  }, { scope: heroRef })

  return (
    <section ref={heroRef} id="beranda" className="relative isolate min-h-screen overflow-hidden bg-background" onPointerMove={handleHeroPointerMove} onPointerDown={handleHeroPointerDown} onPointerLeave={() => setColorReveal((current) => ({ ...current, active: false }))}>
      <div className="absolute inset-0 bg-[#171014]" />
      <div
        data-hero-visual
        className="absolute inset-[-4%] bg-cover bg-center opacity-90 grayscale contrast-125"
        style={{ backgroundImage: `url('${imageUrl}')` }}
        aria-hidden="true"
      />
      <div
        data-hero-color
        className="color-reveal-layer pointer-events-none absolute inset-[-4%] bg-cover bg-center opacity-90 contrast-125 transition-[clip-path] duration-500 ease-out motion-reduce:transition-none"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          clipPath: `circle(${colorReveal.active ? '28%' : '0%'} at ${colorReveal.x}% ${colorReveal.y}%)`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#120c10]/72" />
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
            href="#kontak"
            className="inline-flex items-center justify-center border border-white/45 px-7 py-4 font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            Hubungi Kami
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
