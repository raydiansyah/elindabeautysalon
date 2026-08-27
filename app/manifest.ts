/**
 * Module: Beauty Salon Elin web app manifest
 * Purpose: Describe the installable PWA identity, colors, entry point, and icons.
 * Used by: Browser install prompts and installed app shells.
 * Dependencies: Next.js MetadataRoute and static brand icons.
 * Public functions: manifest().
 * Side effects: Emits the generated /manifest.webmanifest response.
 */
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beauty Salon Elin',
    short_name: 'Salon Elin',
    description: 'Layanan kecantikan, kursus, promosi, dan reservasi Beauty Salon Elin.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
