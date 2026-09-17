/**
 * Module: Elin service accordion
 * Purpose: Explain treatment categories with touch-friendly expansion.
 * Used by: ElinLanding on the public home route.
 * Dependencies: React state, relevant service icons, Elin content constants.
 * Public functions: ElinServices().
 * Side effects: None; only manages local selected-service state.
 */
'use client'

import { useState } from 'react'
import { Brush, Droplets, Flower2, Hand, Scissors } from 'lucide-react'
import { elinServices } from './elin-data'

const icons = { scissors: Scissors, droplets: Droplets, hand: Hand, flower: Flower2, brush: Brush }

export default function ElinServices() {
  const [active, setActive] = useState(0)
  return (
    <section id="layanan" className="bg-elin-ivory py-28 text-elin-ink md:py-44">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-elin-violet">Layanan yang dibuat personal</p>
          <h2 className="max-w-4xl font-display text-4xl leading-[1.02] tracking-[-0.05em] md:text-6xl">Mulai dari kebutuhanmu, bukan dari menu yang kaku.</h2>
        </div>
        <div className="flex flex-col border-y border-elin-ink/20 md:flex-row md:items-stretch">
          {elinServices.map((service, index) => {
            const Icon = icons[service.icon]
            const isActive = active === index
            return <button key={service.name} type="button" onClick={() => setActive(index)} aria-expanded={isActive} className={`group flex min-h-24 flex-1 flex-col justify-between border-b border-elin-ink/20 p-5 text-left transition-[flex-grow,background-color] last:border-b-0 md:min-h-[380px] md:border-b-0 md:border-r md:last:border-r-0 ${isActive ? 'bg-elin-violet text-elin-ivory md:flex-[2.2]' : 'hover:bg-elin-lilac/40'}`}>
              <span className="flex items-center justify-between"><Icon className="h-5 w-5" aria-hidden="true" /><span className="font-serif text-2xl">0{index + 1}</span></span>
              <span><span className="mt-12 block max-w-[13rem] text-xl font-semibold leading-tight">{service.name}</span>{isActive && <span className="mt-4 block max-w-sm text-sm leading-6 text-elin-ivory/75">{service.detail}</span>}</span>
            </button>
          })}
        </div>
      </div>
    </section>
  )
}
