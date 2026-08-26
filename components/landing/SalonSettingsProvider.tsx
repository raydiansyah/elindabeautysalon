/**
 * Module: Public salon settings provider
 * Purpose: Load the editable salon name once and expose it to landing sections.
 * Used by: Public landing page and its branding components.
 * Dependencies: React context and GET /api/settings?public=true.
 * Public functions: SalonSettingsProvider(), useSalonSettings().
 * Side effects: Performs one read-only browser fetch for public salon settings.
 */
'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type SalonSettings = { salonName: string }

const defaultSettings: SalonSettings = { salonName: 'Beauty Salon' }
const SalonSettingsContext = createContext<SalonSettings>(defaultSettings)

export function SalonSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    fetch('/api/settings?public=true', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const salonName = payload?.data?.salonName
        if (typeof salonName === 'string' && salonName.trim()) setSettings({ salonName: salonName.trim() })
      })
      .catch(() => undefined)
  }, [])

  const value = useMemo(() => settings, [settings])
  return <SalonSettingsContext.Provider value={value}>{children}</SalonSettingsContext.Provider>
}

export function useSalonSettings() {
  return useContext(SalonSettingsContext)
}
