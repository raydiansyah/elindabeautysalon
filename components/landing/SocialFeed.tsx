'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Camera, Music } from 'lucide-react'

export default function SocialFeed() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const instagramWidgetId = process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ID
  const tiktokWidgetId = process.env.NEXT_PUBLIC_TIKTOK_WIDGET_ID

  return (
    <section className="py-20 md:py-32 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Ikuti Kami di{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Social Media
            </span>
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Lihat update terbaru dari kami di Instagram dan TikTok
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Instagram Feed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-border p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Instagram</h3>
                <a
                  href="https://instagram.com/elyndbeauty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  @elyndbeauty
                </a>
              </div>
            </div>

            {instagramWidgetId ? (
              <div
                className="elfsight-app-instagram"
                data-elfsight-app-lazy
                dangerouslySetInnerHTML={{
                  __html: `<div class="elfsight-app-${instagramWidgetId}"></div>`,
                }}
              />
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/seed/ig${i}/300/300`}
                      alt={`Instagram post ${i}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            <a
              href="https://instagram.com/elyndbeauty"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block w-full text-center py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
            >
              Follow di Instagram
            </a>
          </motion.div>

          {/* TikTok Feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-border p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">TikTok</h3>
                <a
                  href="https://tiktok.com/@elyndbeauty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  @elyndbeauty
                </a>
              </div>
            </div>

            {tiktokWidgetId ? (
              <div
                className="elfsight-app-tiktok"
                dangerouslySetInnerHTML={{
                  __html: `<div class="elfsight-app-${tiktokWidgetId}"></div>`,
                }}
              />
            ) : (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/seed/tt${i}/600/340`}
                      alt={`TikTok video ${i}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            <a
              href="https://tiktok.com/@elyndbeauty"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block w-full text-center py-3 bg-black text-white font-semibold rounded-full hover:shadow-lg hover:shadow-black/30 transition-all duration-300"
            >
              Follow di TikTok
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
