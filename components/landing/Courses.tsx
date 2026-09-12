/**
 * Module: Public beauty courses section
 * Purpose: Present active education programs managed from the admin area.
 * Used by: Public landing page route (app/page.tsx).
 * Dependencies: React, Framer Motion, Lucide icons, WhatsApp number, public courses API, salon settings context.
 * Public functions: Courses().
 * Side effects: Performs a read-only browser fetch and loads optional course images.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, BookOpen, CalendarDays, Clock3, UserRound } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { useSalonSettings } from './SalonSettingsProvider'

type Course = { id: number; title: string; description: string; instructor: string; level: string; duration: string; schedule: string; imageUrl: string | null; enrollmentUrl: string | null }

export default function Courses() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [courses, setCourses] = useState<Course[]>([])
  const { salonName } = useSalonSettings()

  useEffect(() => {
    fetch('/api/courses?public=true', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => setCourses(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setCourses([]))
  }, [])

  return (
    <section id="kursus" className="border-y border-border bg-surface/30 py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-14 max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary"><BookOpen className="h-4 w-4" />Belajar bersama {salonName}</div>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">Bawa keahlian salon ke <span className="text-primary">tanganmu.</span></h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-light">Kelas intensif untuk kamu yang ingin memahami teknik kecantikan dengan standar kerja profesional.</p>
        </motion.div>

        {courses.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => <motion.article key={course.id} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08 }} className="group overflow-hidden rounded-2xl border border-border bg-background transition-transform duration-500 hover:-translate-y-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-primary/10">{course.imageUrl ? <img src={course.imageUrl} alt={course.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-end p-6"><BookOpen className="h-14 w-14 text-primary/50" /></div>}<span className="absolute left-4 top-4 bg-background/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{course.level}</span></div>
            <div className="space-y-5 p-6"><h3 className="font-display text-2xl leading-tight">{course.title}</h3><p className="text-sm leading-relaxed text-text-muted">{course.description}</p><div className="grid grid-cols-2 gap-3 border-y border-border py-4 text-xs text-text-light"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" />{course.duration}</span><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{course.schedule}</span><span className="col-span-2 flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" />{course.instructor}</span></div><a href={course.enrollmentUrl || `https://wa.me/${WHATSAPP_NUMBER}`} target={course.enrollmentUrl ? undefined : '_blank'} rel={course.enrollmentUrl ? undefined : 'noopener noreferrer'} className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-light">Tanya tentang kelas <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></div>
          </motion.article>)}
        </div> : <div className="border border-dashed border-border p-10 text-center text-text-muted">Kelas baru segera dibuka. Hubungi kami untuk daftar minat.</div>}
      </div>
    </section>
  )
}
