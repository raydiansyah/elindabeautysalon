/**
 * Module: Landing Hero
 * Purpose: Render the above-the-fold salon value proposition and primary CTAs.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: lucide-react ArrowDown icon and Tailwind CSS utilities.
 * Public functions: Hero()
 * Side effects: None; renders static markup and anchor links.
 */
import { ArrowDown } from 'lucide-react'

export default function Hero() {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-surface" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent-gold bg-clip-text text-transparent">
              Kecantikan &
            </span>
            <br />
            <span className="text-foreground">Wellness Terbaik</span>
          </h1>
        </div>

        <p
          className="text-xl md:text-2xl text-text-light mb-12 max-w-3xl mx-auto"
        >
          Tampil cantik dan percaya diri bersama tim stylist profesional kami
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#layanan"
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-full hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
          >
            Lihat Layanan
          </a>
          <a
            href="#kontak"
            className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary/10 transition-all duration-300"
          >
            Hubungi Kami
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <span className="text-sm">Scroll untuk melihat</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  )
}
