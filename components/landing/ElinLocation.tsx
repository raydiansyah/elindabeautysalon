/**
 * Module: Elin location and trust details
 * Purpose: Make arrival, opening hours, and contact actions easy to scan.
 * Used by: ElinLanding on the public home route.
 * Dependencies: Salon settings context, opening-hour constants, WhatsApp number.
 * Public functions: ElinLocation().
 * Side effects: Opens external map or WhatsApp destinations.
 */
'use client'

import { Clock3, MapPin, MessageCircle } from 'lucide-react'
import { OPENING_HOURS, WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

export default function ElinLocation() {
  const { mapsEmbedUrl } = useSalonSettings()
  return <section id="lokasi" className="bg-elin-lilac py-24 text-elin-ink md:py-36"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16"><div className="min-h-[320px] overflow-hidden bg-elin-ink">{mapsEmbedUrl ? <iframe src={mapsEmbedUrl} title="Peta lokasi Beauty Salon Elin" className="h-full min-h-[320px] w-full border-0" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /> : <div className="flex h-full min-h-[320px] items-center justify-center p-8 text-center text-elin-ivory/70"><div><MapPin className="mx-auto mb-4 h-10 w-10 text-elin-gold" /><p>Peta lokasi akan tampil setelah alamat salon diatur.</p><p className="mt-2 text-sm text-elin-ivory/50">Untuk saat ini, booking langsung via WhatsApp.</p></div></div>}</div><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-elin-violet">Datang dan jeda</p><h2 className="mt-5 font-display text-5xl leading-none tracking-[-0.05em] md:text-6xl">Temui kami di waktu yang pas.</h2><div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-1"><div><div className="flex items-center gap-3 font-semibold"><MapPin className="h-5 w-5 text-elin-violet" />Alamat</div><p className="mt-3 max-w-sm text-elin-ink/70">Alamat salon akan ditampilkan setelah pengaturan lokasi publik diisi.</p></div><div><div className="flex items-center gap-3 font-semibold"><Clock3 className="h-5 w-5 text-elin-violet" />Jam operasional</div><div className="mt-3 space-y-2 text-sm text-elin-ink/70">{OPENING_HOURS.map((item) => <div key={item.day} className="flex justify-between border-b border-elin-ink/15 pb-2"><span>{item.day}</span><span>{item.hours}</span></div>)}</div></div></div><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex min-h-12 items-center gap-3 border border-elin-ink px-5 font-semibold transition-colors hover:bg-elin-ink hover:text-elin-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-elin-ink"><MessageCircle className="h-5 w-5" />Tanya ketersediaan jadwal</a></div></div></section>
}
