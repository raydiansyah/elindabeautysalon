/**
 * Module: Public Landing Page
 * Purpose: Render the public salon landing page and its section composition.
 * Used by: Next.js App Router for GET /
 * Dependencies: Landing section components.
 * Public functions: Home()
 * Side effects: None; renders a static public page.
 */
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Promotions from '@/components/landing/Promotions'
import About from '@/components/landing/About'
import Services from '@/components/landing/Services'
import Courses from '@/components/landing/Courses'
import Gallery from '@/components/landing/Gallery'
import SocialFeed from '@/components/landing/SocialFeed'
import Location from '@/components/landing/Location'
import Footer from '@/components/landing/Footer'
import WhatsAppButton from '@/components/landing/WhatsAppButton'
import { SalonSettingsProvider } from '@/components/landing/SalonSettingsProvider'

export default function Home() {
  return (
    <SalonSettingsProvider>
      <Navbar />
      <main className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <Promotions />
        <About />
        <Services />
        <Courses />
        <Gallery />
        <SocialFeed />
        <Location />
      </main>
      <Footer />
      <WhatsAppButton />
    </SalonSettingsProvider>
  )
}
