/**
 * Module: Public Landing Page
 * Purpose: Render the modern, interactive, and luxury salon landing page.
 * Used by: Next.js App Router for GET /
 * Dependencies: Landing section components and SalonSettingsProvider.
 * Public functions: Home()
 * Side effects: None; client state coordinates quick booking selections.
 */
'use client'

import { useState } from 'react'
import { SalonSettingsProvider } from '@/components/landing/SalonSettingsProvider'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Promotions from '@/components/landing/Promotions'
import Services from '@/components/landing/Services'
import Gallery from '@/components/landing/Gallery'
import BookingForm from '@/components/landing/BookingForm'
import Courses from '@/components/landing/Courses'
import SocialFeed from '@/components/landing/SocialFeed'
import Location from '@/components/landing/Location'
import Footer from '@/components/landing/Footer'
import WhatsAppButton from '@/components/landing/WhatsAppButton'

export default function Home() {
  const [selectedTreatment, setSelectedTreatment] = useState<string>('')
  const [selectedVoucher, setSelectedVoucher] = useState<string>('')

  const handleSelectTreatment = (treatmentName: string) => {
    setSelectedTreatment(treatmentName)
  }

  const handleSelectPromotion = (voucherCode: string) => {
    setSelectedVoucher(voucherCode)
  }

  return (
    <SalonSettingsProvider>
      <Navbar />
      <main className="w-full max-w-full overflow-x-hidden bg-elin-ink text-foreground">
        <Hero />
        <Services onSelectTreatment={handleSelectTreatment} />
        <Gallery />
        <Promotions onSelectPromotion={handleSelectPromotion} />
        <BookingForm
          initialTreatment={selectedTreatment}
          initialVoucher={selectedVoucher}
        />
        <Courses />
        <SocialFeed />
        <Location />
      </main>
      <Footer />
      <WhatsAppButton />
    </SalonSettingsProvider>
  )
}
