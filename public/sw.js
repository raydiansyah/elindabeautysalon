/*
 * Module: Beauty Salon Elin service worker
 * Purpose: Cache static assets and immutable media while keeping pages and APIs fresh.
 * Used by: Browser PWA runtime through components/PWARegister.tsx.
 * Dependencies: Service Worker Cache API and Fetch API.
 * Public functions: install, activate, fetch event handlers.
 * Side effects: Reads network responses and writes same-origin assets to a versioned cache.
 */
const CACHE_NAME = 'beauty-salon-elin-v1'
const OFFLINE_RESPONSE = '<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Beauty Salon Elin</title><body style="font-family:system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:2rem"><h1>Beauty Salon Elin</h1><p>Koneksi sedang tidak tersedia. Silakan coba lagi.</p></body></html>'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() => caches.match(request).then((cached) => cached ?? new Response(OFFLINE_RESPONSE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))),
    )
    return
  }

  if (request.destination === 'image' || url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/api/media/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request).then((response) => {
        if (response.ok) void caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
        return response
      })),
    )
  }
})
