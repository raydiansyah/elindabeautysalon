/**
 * Module: Public Beauty Courses Section
 * Purpose: Present professional salon education and masterclass programs.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: React, Framer Motion, Lucide icons, WhatsApp number, public courses API, salon settings context.
 * Public functions: Courses().
 * Side effects: Performs read-only fetch to /api/courses?public=true.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, BookOpen, CalendarDays, Clock3, UserRound } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

type Course = {
  id: number | string
  title: string
  description: string
  instructor: string
  level: string
  duration: string
  schedule: string
  imageUrl: string | null
  enrollmentUrl: string | null
}

const FALLBACK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Masterclass Hair Coloring & Balayage',
    description: 'Pelajari teknik pemetaan warna dimensi, formulasi bleaching aman, dan toning kilau dengan standar salon modern.',
    instructor: 'Senior Colorist Elin',
    level: 'Intermediate',
    duration: '3 Hari Intensif',
    schedule: 'Sabtu & Minggu',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&fit=crop',
    enrollmentUrl: null,
  },
  {
    id: 2,
    title: 'Precision Layer Cutting & Blow Dry',
    description: 'Kuasai sudut gunting presisi, teknik thinning tanpa merusak volume rambut, dan finishing blowout tahan lama.',
    instructor: 'Creative Hair Director',
    level: 'Beginner - Intermediate',
    duration: '2 Hari Praktik',
    schedule: 'Batch Tiap Bulan',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&fit=crop',
    enrollmentUrl: null,
  },
  {
    id: 3,
    title: 'Professional Soft Glam & Bridal Makeup',
    description: 'Teknik complexion flawless anti-crack, koreksi bentuk wajah, dan pemasangan bulu mata natural untuk momen spesial.',
    instructor: 'Professional MUA',
    level: 'Semua Tingkat',
    duration: '4 Sesi Praktek',
    schedule: 'Jadwal Fleksibel',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80&fit=crop',
    enrollmentUrl: null,
  },
]

export default function Courses() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [courses, setCourses] = useState<Course[]>(FALLBACK_COURSES)
  const { salonName } = useSalonSettings()

  useEffect(() => {
    fetch('/api/courses?public=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => {
        if (Array.isArray(payload?.data) && payload.data.length > 0) {
          setCourses(payload.data)
        }
      })
      .catch(() => undefined)
  }, [])

  return (
    <section id="kursus" className="py-24 md:py-36 relative overflow-hidden bg-surface/20 border-y border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Akademi & Pelatihan Salon</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Kembangkan keahlian bersama{' '}
            <span className="font-serif italic font-normal text-accent-gold">
              {salonName} Academy.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-light/80 max-w-2xl mx-auto font-light leading-relaxed">
            Program bimbingan intensif 1-on-1 bersama praktisi kecantikan berpengalaman untuk membekalimu siap berkarir profesional.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-surface/70 backdrop-blur-xl transition-all duration-300 hover:border-accent-gold/50 hover:shadow-2xl hover:shadow-accent-gold/10"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-light">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-accent-gold/40">
                      <BookOpen className="h-16 w-16" />
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-elin-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-gold backdrop-blur-md border border-white/10">
                    {course.level}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-accent-gold transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-text-light/80 leading-relaxed font-light">
                    {course.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5 border-y border-white/10 py-3.5 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-accent-gold" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-accent-gold" />
                      <span>{course.schedule}</span>
                    </span>
                    <span className="col-span-2 flex items-center gap-1.5 pt-1 text-text-light">
                      <UserRound className="h-3.5 w-3.5 text-accent-gold" />
                      <span>Mentor: {course.instructor}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={
                    course.enrollmentUrl ||
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Halo ${salonName}, saya ingin konsultasi pendaftaran kelas ${course.title}.`
                    )}`
                  }
                  target={course.enrollmentUrl ? undefined : '_blank'}
                  rel={course.enrollmentUrl ? undefined : 'noopener noreferrer'}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-accent-gold/40 bg-accent-gold/10 hover:bg-accent-gold hover:text-elin-ink text-accent-gold py-2.5 text-xs font-semibold transition-colors"
                >
                  <span>Daftar / Tanya Silabus</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
