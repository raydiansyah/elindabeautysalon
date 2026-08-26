/**
 * Module: Public promotions section
 * Purpose: Display active salon promotions with type filters, countdowns, details, and sharing.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: React, lucide-react, public promotions API.
 * Public functions: Promotions().
 * Side effects: Performs a read-only browser fetch and opens WhatsApp share links.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock3, Share2, X } from 'lucide-react'

type Promotion = { id: number; name: string; description: string; couponCode: string | null; type: string; discountValue: string; startsAt: string; endsAt: string; quota: number | null; redemptionCount: number; bannerUrl: string | null }

const labels: Record<string, string> = { percentage: 'Persentase', fixed: 'Potongan harga', buy_x_get_y: 'Buy X Get Y', free_service: 'Gratis layanan', bundle: 'Bundle' }

function Countdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState('')
  useEffect(() => {
    const update = () => {
      const ms = Math.max(0, new Date(endsAt).getTime() - Date.now())
      const days = Math.floor(ms / 86400000); const hours = Math.floor(ms / 3600000) % 24; const minutes = Math.floor(ms / 60000) % 60
      setRemaining(ms ? `${days}h ${hours}j ${minutes}m` : 'Berakhir')
    }
    update(); const timer = window.setInterval(update, 60000); return () => window.clearInterval(timer)
  }, [endsAt])
  return <span className="inline-flex items-center gap-1 text-sm text-accent-gold"><Clock3 className="h-4 w-4" /> {remaining}</span>
}

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Promotion | null>(null)
  useEffect(() => { fetch('/api/promotions/public').then((response) => response.json()).then((payload) => setPromotions(payload.data || [])).catch(() => setPromotions([])) }, [])
  const visible = useMemo(() => filter === 'all' ? promotions : promotions.filter((promotion) => promotion.type === filter), [filter, promotions])
  const share = (promotion: Promotion) => { const text = `${promotion.name} — ${promotion.description}${promotion.couponCode ? ` Kode: ${promotion.couponCode}` : ''}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer') }

  return <section id="promosi" className="bg-surface/30 py-20 md:py-32"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-10 text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Penawaran spesial</p><h2 className="font-display text-4xl font-bold md:text-5xl">Promo <span className="text-primary">Elynd</span></h2><p className="mx-auto mt-4 max-w-2xl text-lg text-text-light">Nikmati perawatan favorit dengan penawaran terbaik kami.</p></div><div className="mb-8 flex flex-wrap justify-center gap-2"><button onClick={() => setFilter('all')} className={`rounded-full px-4 py-2 text-sm ${filter === 'all' ? 'bg-primary text-white' : 'border border-border text-text-light'}`}>Semua</button>{Object.entries(labels).map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm ${filter === value ? 'bg-primary text-white' : 'border border-border text-text-light'}`}>{label}</button>)}</div>{visible.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visible.map((promotion) => <article key={promotion.id} className="overflow-hidden rounded-2xl border border-border bg-surface/70"><div className="h-40 bg-primary/15">{promotion.bannerUrl && <img src={promotion.bannerUrl} alt={promotion.name} loading="lazy" className="h-full w-full object-cover" />}</div><div className="space-y-4 p-6"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-light">{labels[promotion.type] || promotion.type}</span><Countdown endsAt={promotion.endsAt} /></div><h3 className="text-xl font-semibold">{promotion.name}</h3><p className="line-clamp-3 text-text-light">{promotion.description}</p><div className="flex gap-2"><button onClick={() => setSelected(promotion)} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Lihat detail</button><button aria-label={`Bagikan ${promotion.name}`} onClick={() => share(promotion)} className="rounded-lg border border-border px-3 text-primary"><Share2 className="h-4 w-4" /></button></div></div></article>)}</div> : <p className="rounded-xl border border-dashed border-border p-10 text-center text-text-muted">Belum ada promo aktif saat ini.</p>}</div>{selected && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}><div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-start justify-between gap-4"><div><span className="text-sm text-primary-light">{labels[selected.type] || selected.type}</span><h3 className="mt-1 text-2xl font-bold">{selected.name}</h3></div><button aria-label="Tutup detail promo" onClick={() => setSelected(null)}><X className="h-5 w-5" /></button></div><p className="text-text-light">{selected.description}</p>{selected.couponCode && <p className="mt-5 rounded-lg bg-primary/10 p-3 text-sm">Gunakan kode: <strong>{selected.couponCode}</strong></p>}<button onClick={() => share(selected)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white"><Share2 className="h-4 w-4" /> Bagikan ke WhatsApp</button></div></div>}</section>
}
