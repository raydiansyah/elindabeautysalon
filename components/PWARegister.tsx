/**
 * Module: PWA service worker registration
 * Purpose: Register and update the public service worker in supported browsers.
 * Used by: Root application layout.
 * Dependencies: Browser Service Worker API.
 * Public functions: PWARegister().
 * Side effects: Installs or updates /sw.js in the current browser origin.
 */
'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => undefined)
  }, [])

  return null
}
