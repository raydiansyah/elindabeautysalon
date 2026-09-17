/**
 * Module: Beauty Salon Elin landing composition
 * Purpose: Compose the public AIDA narrative with accessible, data-honest sections.
 * Used by: app/page.tsx.
 * Dependencies: Landing settings provider, Elin section components.
 * Public functions: ElinLanding().
 * Side effects: Child sections perform browser fetches and scroll animations.
 */
'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { SalonSettingsProvider, useSalonSettings } from './SalonSettingsProvider'
import ElinHero from './ElinHero'
import ElinServices from './ElinServices'
import ElinGallery from './ElinGallery'
import ElinBooking from './ElinBooking'
import ElinLocation from './ElinLocation'

function Navigation() {
  const [open, setOpen] = useState(false)
  const links = [['Layanan', '#layanan'], ['Galeri', '#galeri'], ['Paket', '#booking'], ['Lokasi', '#lokasi']]
  return <header className="absolute inset-x-0 top-0 z-40"><nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 sm:px-10 lg:px-16"><a href="#beranda" className="font-display text-2xl font-semibold text-elin-ivory focus-visible:outline-2 focus-visible:outline-elin-ivory">Beauty Salon <span className="text-elin-gold">Elin</span></a><div className="hidden items-center gap-8 md:flex">{links.map(([label, href]) => <a key={href} href={href} className="text-sm font-medium text-elin-ivory/75 transition-colors hover:text-elin-ivory focus-visible:outline-2 focus-visible:outline-elin-ivory">{label}</a>)}<a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="bg-elin-gold px-4 py-2 text-sm font-semibold text-elin-ink">Booking</a></div><button type="button" onClick={() => setOpen(!open)} className="flex h-11 w-11 items-center justify-center border border-elin-ivory/40 text-elin-ivory md:hidden" aria-expanded={open} aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X /> : <Menu />}</button></nav>{open && <div className="border-t border-elin-ivory/20 bg-elin-ink px-6 py-5 md:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-elin-ivory/15 py-4 text-elin-ivory">{label}</a>)}</div>}</header>
}

function TrustNote() {
  const { salonName } = useSalonSettings()
  return <section id="tentang" className="bg-elin-ink px-6 py-28 text-elin-ivory sm:px-10 md:py-40 lg:px-16"><div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.5fr_1.5fr]"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-elin-gold">Tentang {salonName}</p><div><p className="max-w-5xl font-display text-4xl leading-[1.05] tracking-[-0.05em] md:text-6xl">Kami percaya perawatan terbaik dimulai dari rasa nyaman, konsultasi yang jujur, dan detail yang dikerjakan dengan teliti.</p><div className="mt-8 h-px w-full bg-elin-ivory/20" /><p className="mt-6 max-w-xl text-base leading-7 text-elin-ivory/65">Tim kami membantu Anda memilih perawatan yang sesuai, lalu memberi ruang agar hasilnya terasa tetap seperti Anda.</p></div></div></section>
}

export default function ElinLanding() { return <SalonSettingsProvider><Navigation /><main className="w-full max-w-full overflow-x-hidden"><ElinHero /><TrustNote /><ElinServices /><ElinGallery /><ElinBooking /><ElinLocation /><FinalCta /></main><FloatingBooking /></SalonSettingsProvider> }

function FinalCta() { return <section className="bg-elin-gold px-6 py-24 text-elin-ink sm:px-10 md:py-36 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between"><h2 className="max-w-4xl font-display text-5xl leading-none tracking-[-0.06em] md:text-8xl">Waktunya merasa lebih elin.</h2><a href="#booking" className="inline-flex min-h-12 shrink-0 items-center justify-center border border-elin-ink px-6 font-semibold transition-colors hover:bg-elin-ink hover:text-elin-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-elin-ink">Pilih waktu booking</a></div></section> }

function FloatingBooking() { return <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="Booking melalui WhatsApp" className="fixed bottom-5 right-5 z-50 flex min-h-12 items-center justify-center bg-elin-gold px-4 font-semibold text-elin-ink shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-elin-ivory md:bottom-7 md:right-7">Booking via WhatsApp</a> }
