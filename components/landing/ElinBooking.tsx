/**
 * Module: Elin package and booking panel
 * Purpose: Explain package scope and offer a low-friction WhatsApp reservation.
 * Used by: ElinLanding on the public home route.
 * Dependencies: Salon settings context, WhatsApp number, package content.
 * Public functions: ElinBooking().
 * Side effects: Opens a WhatsApp conversation with a prefilled booking message.
 */
'use client'

import { ArrowUpRight } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'
import { elinPackages } from './elin-data'

export default function ElinBooking() {
  const { salonName } = useSalonSettings()
  return <section id="booking" className="bg-elin-ink py-28 text-elin-ivory md:py-44"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16"><div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-elin-gold">Paket perawatan</p><h2 className="mt-5 max-w-xl font-display text-5xl leading-[0.98] tracking-[-0.05em] md:text-7xl">Pilih mood, kami bantu merangkainya.</h2><p className="mt-7 max-w-md text-base leading-7 text-elin-ivory/70">Harga treatment menyesuaikan kebutuhan dan konsultasi di salon. Hubungi kami untuk mendapatkan detail yang tepat.</p><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Halo ${salonName}, saya ingin konsultasi paket perawatan.`)}`} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex min-h-12 items-center gap-3 bg-elin-gold px-6 font-semibold text-elin-ink transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-elin-ivory">Konsultasi paket <ArrowUpRight className="h-5 w-5" /></a></div><div className="border-t border-elin-ivory/25">{elinPackages.map((item) => <article key={item.name} className="grid gap-4 border-b border-elin-ivory/25 py-7 md:grid-cols-[0.75fr_1fr_0.8fr] md:items-start"><h3 className="text-xl font-semibold">{item.name}</h3><p className="text-elin-ivory/75">{item.detail}</p><p className="text-sm leading-6 text-elin-ivory/55">{item.note}</p></article>)}</div></div></div></section>
}
