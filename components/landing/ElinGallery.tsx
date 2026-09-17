/**
 * Module: Elin visual gallery
 * Purpose: Turn salon imagery into a pinned, horizontal scroll chapter.
 * Used by: ElinLanding on the public home route.
 * Dependencies: GSAP ScrollTrigger, Elin content constants.
 * Public functions: ElinGallery().
 * Side effects: Reads public gallery records and attaches a scroll pin when records exist.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_IMAGE } from './elin-data'

gsap.registerPlugin(ScrollTrigger)
type GalleryItem = { id: number; imageUrl: string; title: string; category: string }

export default function ElinGallery() {
  const ref = useRef<HTMLElement>(null)
  const [items, setItems] = useState<GalleryItem[]>([])
  useEffect(() => { fetch('/api/gallery?public=true', { cache: 'no-store' }).then((res) => res.json()).then((payload) => setItems(Array.isArray(payload?.data) ? payload.data : [])).catch(() => setItems([])) }, [])
  const gallery = items.length ? items : [{ id: 0, imageUrl: HERO_IMAGE, title: 'Ruang Beauty Salon Elin', category: 'Visual salon' }]
  useGSAP(() => {
    const track = ref.current?.querySelector('[data-gallery-track]')
    if (!track) return
    const horizontal = gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 48), ease: 'none', scrollTrigger: { trigger: ref.current, pin: true, scrub: 1, end: () => `+=${track.scrollWidth}` } })
    gsap.utils.toArray<HTMLElement>('[data-gallery-card]').forEach((card) => gsap.fromTo(card, { scale: 0.8, opacity: 0.2 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left 90%', end: 'right 30%', scrub: true } }))
  }, { scope: ref })
  return <section ref={ref} id="galeri" className="overflow-hidden bg-elin-violet py-24 text-elin-ivory md:py-32"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16"><div className="mb-12 max-w-xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-elin-gold">Lihat suasananya</p><h2 className="mt-5 font-display text-5xl leading-none tracking-[-0.05em] md:text-7xl">Detail yang terasa saat kamu hadir.</h2></div><div data-gallery-track className="flex w-max gap-5 pr-12">{gallery.map((item) => <figure data-gallery-card key={item.id} className="w-[min(78vw,520px)] shrink-0"><div className="aspect-[4/5] overflow-hidden bg-elin-ink"><img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover grayscale-[12%] transition-transform duration-700 hover:scale-105" /></div><figcaption className="mt-4 flex justify-between gap-4 text-sm"><span>{item.title}</span><span className="text-elin-ivory/60">{item.category}</span></figcaption></figure>)}</div></div></section>
}
