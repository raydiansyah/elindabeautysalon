/**
 * Module: Social media embeds
 * Purpose: Display official social content with a useful profile fallback when embeds are unavailable.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, public salon settings, Instagram/TikTok embed scripts.
 * Public functions: SocialFeed().
 * Side effects: Loads third-party embed scripts and remote social content in the browser when configured.
 */
'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Camera, ExternalLink, Music } from 'lucide-react'
import { useSalonSettings } from './SalonSettingsProvider'

function getInstagramPostType(url: string) {
  return url.match(/instagram\.com\/(p|tv)\/[^/?#]+/i)?.[1] ?? null
}

function loadInstagramEmbedScript(onLoad: () => void) {
  const existing = document.getElementById('instagram-embed-script')
  if (existing) {
    onLoad()
    return
  }
  const script = document.createElement('script')
  script.id = 'instagram-embed-script'
  script.async = true
  script.src = 'https://www.instagram.com/embed.js'
  script.addEventListener('load', onLoad, { once: true })
  document.body.appendChild(script)
}

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    loadInstagramEmbedScript(() => {
      const instagram = window as Window & { instgrm?: { Embeds?: { process: () => void } } }
      instagram.instgrm?.Embeds?.process()
    })
  }, [url])

  return <blockquote className="instagram-media min-h-[22rem] w-full overflow-hidden rounded-xl border border-border bg-background" data-instgrm-permalink={url} data-instgrm-version="14"><a href={url} target="_blank" rel="noopener noreferrer" className="flex min-h-[22rem] items-center justify-center p-6 text-center text-text-muted hover:text-primary">Buka post Instagram</a></blockquote>
}

function InstagramProfileFallback({ url }: { url: string }) {
  const handle = url.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '')

  return (
    <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-xl border border-border bg-background px-6 py-10 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-lg shadow-pink-600/20">
        <Camera className="h-8 w-8" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Instagram Beauty Salon Elin</p>
      <h3 className="mt-3 font-display text-2xl">Karya terbaru ada di sini.</h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">Lihat hasil styling, suasana salon, dan inspirasi kecantikan terbaru dari akun resmi kami.</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">Lihat @{handle}</a>
    </div>
  )
}

function getTikTokVideoId(url: string) {
  return url.match(/\/(?:video|photo)\/(\d+)/i)?.[1] ?? null
}

function getTikTokUsername(url: string) {
  try {
    const decoded = decodeURIComponent(url)
    return decoded.match(/tiktok\.com\/@([^/?#]+)/i)?.[1] ?? null
  } catch {
    return url.match(/tiktok\.com\/@([^/?#]+)/i)?.[1] ?? null
  }
}

function TikTokEmbed({ profileUrl, videoUrl }: { profileUrl: string; videoUrl: string }) {
  const videoId = getTikTokVideoId(videoUrl)
  const username = getTikTokUsername(profileUrl)

  if (videoId) {
    return <iframe src={`https://www.tiktok.com/player/v1/${videoId}?description=1&music_info=1`} className="aspect-[9/14] max-h-[34rem] w-full rounded-xl border-0 bg-black" allow="fullscreen" title="TikTok video" />
  }

  if (username) {
    return (
      <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[28rem] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"><Music className="mb-4 h-10 w-10 text-primary" /><span className="font-semibold">@{username}</span><span className="mt-2 text-sm text-text-muted">Buka profil TikTok untuk melihat video terbaru.</span></a>
    )
  }

  return <div className="flex min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">Tambahkan URL profil atau video TikTok di Pengaturan.</div>
}

export default function SocialFeed() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { instagramUrl, instagramPostUrl, tiktokUrl, tiktokVideoUrl } = useSalonSettings()

  return (
    <section className="bg-surface/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">Kehidupan salon</p>
          <h2 className="font-display text-4xl font-bold md:text-5xl">Ikuti cerita terbaru kami.</h2>
          <p className="mt-4 text-lg text-text-light">Lihat karya, suasana, dan tips kecantikan langsung dari kanal resmi Beauty Salon Elin.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.article initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="min-w-0 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-600"><Camera className="h-5 w-5 text-white" /></div>
                <div className="min-w-0"><h3 className="font-semibold">Instagram</h3><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-sm text-text-muted hover:text-primary">{instagramUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a></div>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-text-muted" />
            </div>
            {getInstagramPostType(instagramPostUrl) ? <InstagramEmbed url={instagramPostUrl} /> : <InstagramProfileFallback url={instagramUrl} />}
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block w-full rounded-full bg-pink-600 py-3 text-center font-semibold text-white transition-colors hover:bg-pink-500">Buka Instagram</a>
          </motion.article>

          <motion.article initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.25 }} className="min-w-0 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black"><Music className="h-5 w-5 text-white" /></div>
                <div className="min-w-0"><h3 className="font-semibold">TikTok</h3><a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-sm text-text-muted hover:text-primary">{tiktokUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a></div>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-text-muted" />
            </div>
            <TikTokEmbed profileUrl={tiktokUrl} videoUrl={tiktokVideoUrl} />
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block w-full rounded-full bg-black py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-800">Buka TikTok</a>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
