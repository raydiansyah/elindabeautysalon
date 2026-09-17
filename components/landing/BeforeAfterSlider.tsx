/**
 * Module: Interactive Before & After Transformation Slider
 * Purpose: Provide a tactile, interactive drag comparison for salon transformations with dynamic API data.
 * Used by: Gallery section or Dedicated Showcase on landing page.
 * Dependencies: React, Lucide icons, gallery API.
 * Public functions: BeforeAfterSlider().
 * Side effects: Fetches public gallery transformations from /api/gallery?public=true.
 */
'use client'

import { useState, useRef, useCallback, useEffect, useId } from 'react'
import { Sparkles, MoveHorizontal } from 'lucide-react'

export interface TransformationItem {
  id: string
  title: string
  category: string
  description: string
  beforeImage: string
  afterImage: string
}

const DEFAULT_TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'balayage',
    title: 'Ash Blonde Balayage & Gloss Reset',
    category: 'Hair Coloring',
    description: 'Transformasi dari warna pudar menjadi dimensi balayage halus dengan pantulan kilau sehat.',
    beforeImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80&fit=crop',
  },
  {
    id: 'smoothing',
    title: 'Silky Keratin Infusion & Layer Cut',
    category: 'Hair Care & Cut',
    description: 'Menjinakkan rambut megar dan rapuh menjadi lembut, berkilau, dan mudah ditata setiap hari.',
    beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1200&q=80&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80&fit=crop',
  },
  {
    id: 'facial',
    title: 'Deep Hydrating Glow Skin Therapy',
    category: 'Facial & Skincare',
    description: 'Pori-pori bersih mendalam, hidrasi instan, dan skin barrier yang kembali kenyal bercahaya.',
    beforeImage: 'https://images.unsplash.com/photo-1512290900672-1f4a9b6c005b?w=1200&q=80&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80&fit=crop',
  },
]

export default function BeforeAfterSlider() {
  const [transformations, setTransformations] = useState<TransformationItem[]>(DEFAULT_TRANSFORMATIONS)
  const [activeItem, setActiveItem] = useState<TransformationItem>(DEFAULT_TRANSFORMATIONS[0])
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderInputId = useId()

  useEffect(() => {
    fetch('/api/gallery?public=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => {
        const data = Array.isArray(payload?.data) ? payload.data : []
        const dynamicItems: TransformationItem[] = data
          .filter(
            (item: Record<string, unknown>) =>
              item.beforeAfter && item.beforeImageUrl && item.imageUrl
          )
          .map((item: Record<string, unknown>) => ({
            id: String(item.id),
            title: String(item.title),
            category: String(item.category || 'Transformasi'),
            description: String(
              item.description || 'Hasil perawatan dan styling profesional dari tim Beauty Salon Elin.'
            ),
            beforeImage: String(item.beforeImageUrl),
            afterImage: String(item.imageUrl),
          }))

        if (dynamicItems.length > 0) {
          setTransformations(dynamicItems)
          setActiveItem(dynamicItems[0])
        }
      })
      .catch(() => undefined)
  }, [])

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percent)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    handleMove(e.clientX)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignore if pointer capture was already released
    }
  }

  const handleSelectTransformation = (item: TransformationItem) => {
    setActiveItem(item)
    setSliderPosition(50)
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Transformation Selector Pills */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {transformations.map((item) => {
          const isSelected = activeItem.id === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTransformation(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 sm:text-sm ${
                isSelected
                  ? 'bg-accent-gold text-elin-ink shadow-md shadow-accent-gold/20'
                  : 'border border-white/15 bg-surface/50 text-text-light hover:border-accent-gold/40 hover:text-white'
              }`}
            >
              {item.category}
            </button>
          )
        })}
      </div>

      {/* Main Interactive Comparison Stage */}
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="group relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/15 bg-surface shadow-2xl transition-all sm:aspect-[16/10]"
          role="region"
          aria-label="Interactive before and after transformation comparison"
        >
          {/* AFTER Image (Background) */}
          <img
            src={activeItem.afterImage}
            alt={`${activeItem.title} - Hasil Sesudah`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute right-4 top-4 rounded-full bg-elin-ink/80 px-3 py-1 text-xs font-semibold tracking-wider text-accent-gold backdrop-blur-md">
            SESUDAH
          </div>

          {/* BEFORE Image (Clipped Layer) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <img
              src={activeItem.beforeImage}
              alt={`${activeItem.title} - Kondisi Sebelum`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute left-4 top-4 rounded-full bg-elin-ink/80 px-3 py-1 text-xs font-semibold tracking-wider text-text-light backdrop-blur-md">
              SEBELUM
            </div>
          </div>

          {/* Divider Line & Handle */}
          <div
            className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-accent-gold shadow-[0_0_10px_rgba(217,185,120,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-elin-ink bg-accent-gold text-elin-ink shadow-lg transition-transform group-hover:scale-110">
              <MoveHorizontal className="h-5 w-5" />
            </div>
          </div>

          {/* Touch Hint on Mobile */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-elin-ink/75 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md sm:hidden">
            Geser untuk membandingkan
          </div>
        </div>

        {/* Story Card */}
        <div className="flex flex-col justify-center space-y-5 lg:pl-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            <Sparkles className="h-4 w-4" />
            <span>Hasil Nyata Salon</span>
          </div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {activeItem.title}
          </h3>
          <p className="text-base leading-relaxed text-text-light">
            {activeItem.description}
          </p>

          <div className="rounded-xl border border-white/10 bg-surface/60 p-4 backdrop-blur-sm">
            <p className="text-xs text-text-muted">
              💡 <strong className="text-foreground">Sentuhan Personal:</strong> Setiap klien mendapatkan sesi analisa rambut & kulit gratis sebelum tindakan dimulai untuk memastikan formula dan teknik yang tepat.
            </p>
          </div>

          {/* Range Slider Controller for Accessibility */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Tampilan Sebelum</span>
              <span>Tampilan Sesudah</span>
            </div>
            <label htmlFor={sliderInputId} className="sr-only">
              Kontrol posisi perbandingan sebelum dan sesudah
            </label>
            <input
              id={sliderInputId}
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Posisi slider perbandingan"
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-accent-gold"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
