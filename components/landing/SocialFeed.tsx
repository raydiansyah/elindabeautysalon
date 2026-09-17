/**
 * Module: Salon Social Media Feed (Instagram & TikTok)
 * Purpose: Showcase official Instagram and TikTok presence with interactive lookbook previews and direct channel links.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: Framer Motion, Lucide icons, public salon settings context.
 * Public functions: SocialFeed()
 * Side effects: None.
 */
'use client'

import { motion } from 'framer-motion'
import { Camera, Music, ExternalLink, Heart, Sparkles, MessageCircle, Play } from 'lucide-react'
import { useSalonSettings } from './SalonSettingsProvider'

const INSTAGRAM_PREVIEWS = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80&fit=crop',
    likes: '482',
    comments: '28',
    caption: 'Suasana tenang untuk melepaskan penat sejenak. Book slot perawatan akhir pekanmu sekarang ✨',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&fit=crop',
    likes: '614',
    comments: '45',
    caption: 'Ash Blonde Balayage hasil tangan Creative Director kami. Kilau lembut tanpa merusak kutikula rambut 💆‍♀️',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&fit=crop',
    likes: '530',
    comments: '39',
    caption: 'Glowing skin is always in! Rahasia wajah segar terhidrasi ada pada Oxygen Infusion Facial kami 🌿',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&fit=crop',
    likes: '395',
    comments: '19',
    caption: 'Minimalist French Nail Art with gold leaf accents. Rapi dan elegan untuk melengkapi harimu 💅',
  },
]

const TIKTOK_HIGHLIGHTS = [
  {
    id: 1,
    title: 'Transformasi Rambut Megar jadi Silk Keratin!',
    views: '124.5K',
    duration: '0:45',
  },
  {
    id: 2,
    title: 'A Day in My Life: Perawatan Facial & Pijat Relaksasi',
    views: '89.2K',
    duration: '0:32',
  },
  {
    id: 3,
    title: 'Tips Memilih Warna Rambut Sesuai Skin Undertone',
    views: '240.1K',
    duration: '0:58',
  },
]

export default function SocialFeed() {
  const { salonName, instagramUrl, tiktokUrl } = useSalonSettings()

  const igHandle = instagramUrl
    ? instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '')
    : 'elyndbeauty'

  const tiktokHandle = tiktokUrl
    ? tiktokUrl.replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '').replace(/\/$/, '')
    : 'elyndbeauty'

  return (
    <section className="py-24 md:py-36 relative overflow-hidden bg-surface/10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Komunitas & Inspirasi</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Ikuti perjalanan kecantikan di{' '}
            <span className="font-serif italic font-normal text-accent-gold">
              media sosial.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-light/80 max-w-2xl mx-auto font-light leading-relaxed">
            Dapatkan tips harian, video proses perawatan di balik layar, dan tren styling terbaru dari akun Instagram & TikTok resmi {salonName}.
          </p>
        </motion.div>

        {/* 2-Column Social Showcase */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Instagram Column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/15 bg-surface/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Profile Header */}
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/20">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                      <span>Instagram</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-sans font-semibold">
                        Resmi
                      </span>
                    </h3>
                    <p className="text-xs text-text-muted">@{igHandle}</p>
                  </div>
                </div>

                <a
                  href={instagramUrl || 'https://instagram.com/elyndbeauty'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-gold hover:text-white transition-colors"
                >
                  <span>Kunjungi Profil</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Grid of Instagram Visual Posts */}
              <div className="grid grid-cols-2 gap-3.5 my-6">
                {INSTAGRAM_PREVIEWS.map((post) => (
                  <a
                    key={post.id}
                    href={instagramUrl || 'https://instagram.com/elyndbeauty'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-surface block"
                  >
                    <img
                      src={post.img}
                      alt={post.caption}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                      <p className="text-[11px] text-white line-clamp-3 leading-snug">
                        {post.caption}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-white/90">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-white" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <a
              href={instagramUrl || 'https://instagram.com/elyndbeauty'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-500/15 to-purple-600/15 hover:from-rose-500/25 hover:to-purple-600/25 py-3 text-xs font-semibold text-rose-200 transition-all"
            >
              <Camera className="h-4 w-4" />
              <span>Follow @{igHandle} di Instagram</span>
            </a>
          </motion.div>

          {/* TikTok Column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl border border-white/15 bg-surface/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Profile Header */}
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg border border-white/20">
                    <Music className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                      <span>TikTok</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-sans font-semibold">
                        Video Tren
                      </span>
                    </h3>
                    <p className="text-xs text-text-muted">@{tiktokHandle}</p>
                  </div>
                </div>

                <a
                  href={tiktokUrl || 'https://tiktok.com/@elyndbeauty'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-gold hover:text-white transition-colors"
                >
                  <span>Kunjungi Profil</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* TikTok Video Highlights List */}
              <div className="space-y-3.5 my-6">
                {TIKTOK_HIGHLIGHTS.map((item) => (
                  <a
                    key={item.id}
                    href={tiktokUrl || 'https://tiktok.com/@elyndbeauty'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-elin-ink/60 p-4 transition-all duration-300 hover:border-accent-gold/40 hover:bg-surface-light"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold group-hover:bg-accent-gold group-hover:text-elin-ink transition-colors">
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-accent-gold transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {item.views} views • {item.duration}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-accent-gold shrink-0">
                      Tonton →
                    </span>
                  </a>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-surface-light/50 p-4 text-center">
                <p className="text-xs text-text-light font-light leading-relaxed">
                  🎬 Tonton transformasi rambut, tutorial styling, dan testimoni jujur klien setiap minggunya di TikTok.
                </p>
              </div>
            </div>

            <a
              href={tiktokUrl || 'https://tiktok.com/@elyndbeauty'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black hover:bg-zinc-900 py-3 text-xs font-semibold text-white transition-all shadow-md"
            >
              <Music className="h-4 w-4 text-cyan-400" />
              <span>Buka @{tiktokHandle} di TikTok</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
