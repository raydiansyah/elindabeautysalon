/**
 * Module: Public salon settings provider
 * Purpose: Load editable salon identity, About content, and social links once and expose them to landing sections.
 * Used by: Public landing page and its branding components.
 * Dependencies: React context and GET /api/settings?public=true.
 * Public functions: SalonSettingsProvider(), useSalonSettings().
 * Side effects: Performs one read-only browser fetch for public salon settings.
 */
'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type SalonSettings = {
  salonName: string
  logoUrl: string
  mapsEmbedUrl: string
  aboutTitle: string
  aboutHighlight: string
  aboutDescription: string
  aboutStat1Value: string
  aboutStat1Label: string
  aboutStat2Value: string
  aboutStat2Label: string
  aboutStat3Value: string
  aboutStat3Label: string
  aboutStat4Value: string
  aboutStat4Label: string
  instagramUrl: string
  instagramPostUrl: string
  tiktokUrl: string
  tiktokVideoUrl: string
}

const defaultSettings: SalonSettings = {
  salonName: 'Beauty Salon',
  logoUrl: '/brand/logo.webp',
  mapsEmbedUrl: '',
  aboutTitle: 'Tentang',
  aboutHighlight: 'Beauty Salon Elin',
  aboutDescription: 'Salon kecantikan profesional dengan pengalaman dan tim stylist terlatih untuk membuat Anda tampil cantik dan percaya diri.',
  aboutStat1Value: '10+', aboutStat1Label: 'Tahun Pengalaman',
  aboutStat2Value: '5000+', aboutStat2Label: 'Klien Puas',
  aboutStat3Value: '15+', aboutStat3Label: 'Stylist Ahli',
  aboutStat4Value: '20+', aboutStat4Label: 'Penghargaan',
  instagramUrl: 'https://instagram.com/elyndbeauty',
  instagramPostUrl: '',
  tiktokUrl: 'https://tiktok.com/@elyndbeauty',
  tiktokVideoUrl: '',
}
const SalonSettingsContext = createContext<SalonSettings>(defaultSettings)

export function SalonSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    fetch('/api/settings?public=true', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const incoming = payload?.data ?? {}
        setSettings({
          salonName: typeof incoming.salonName === 'string' && incoming.salonName.trim() ? incoming.salonName.trim() : defaultSettings.salonName,
          logoUrl: typeof incoming.logoUrl === 'string' && incoming.logoUrl.trim() ? incoming.logoUrl : defaultSettings.logoUrl,
          mapsEmbedUrl: typeof incoming.mapsEmbedUrl === 'string' ? incoming.mapsEmbedUrl : defaultSettings.mapsEmbedUrl,
          aboutTitle: typeof incoming.aboutTitle === 'string' ? incoming.aboutTitle : defaultSettings.aboutTitle,
          aboutHighlight: typeof incoming.aboutHighlight === 'string' ? incoming.aboutHighlight : defaultSettings.aboutHighlight,
          aboutDescription: typeof incoming.aboutDescription === 'string' ? incoming.aboutDescription : defaultSettings.aboutDescription,
          aboutStat1Value: typeof incoming.aboutStat1Value === 'string' ? incoming.aboutStat1Value : defaultSettings.aboutStat1Value,
          aboutStat1Label: typeof incoming.aboutStat1Label === 'string' ? incoming.aboutStat1Label : defaultSettings.aboutStat1Label,
          aboutStat2Value: typeof incoming.aboutStat2Value === 'string' ? incoming.aboutStat2Value : defaultSettings.aboutStat2Value,
          aboutStat2Label: typeof incoming.aboutStat2Label === 'string' ? incoming.aboutStat2Label : defaultSettings.aboutStat2Label,
          aboutStat3Value: typeof incoming.aboutStat3Value === 'string' ? incoming.aboutStat3Value : defaultSettings.aboutStat3Value,
          aboutStat3Label: typeof incoming.aboutStat3Label === 'string' ? incoming.aboutStat3Label : defaultSettings.aboutStat3Label,
          aboutStat4Value: typeof incoming.aboutStat4Value === 'string' ? incoming.aboutStat4Value : defaultSettings.aboutStat4Value,
          aboutStat4Label: typeof incoming.aboutStat4Label === 'string' ? incoming.aboutStat4Label : defaultSettings.aboutStat4Label,
          instagramUrl: typeof incoming.instagramUrl === 'string' ? incoming.instagramUrl : defaultSettings.instagramUrl,
          instagramPostUrl: typeof incoming.instagramPostUrl === 'string' ? incoming.instagramPostUrl : defaultSettings.instagramPostUrl,
          tiktokUrl: typeof incoming.tiktokUrl === 'string' ? incoming.tiktokUrl : defaultSettings.tiktokUrl,
          tiktokVideoUrl: typeof incoming.tiktokVideoUrl === 'string' ? incoming.tiktokVideoUrl : defaultSettings.tiktokVideoUrl,
        })
      })
      .catch(() => undefined)
  }, [])

  const value = useMemo(() => settings, [settings])
  return <SalonSettingsContext.Provider value={value}>{children}</SalonSettingsContext.Provider>
}

export function useSalonSettings() {
  return useContext(SalonSettingsContext)
}
