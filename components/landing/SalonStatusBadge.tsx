/**
 * Module: Real-time Salon Status Badge
 * Purpose: Display live operational status (Open/Closed) based on client local time and salon hours without SSR hydration mismatch.
 * Used by: Hero section, Navbar, Location.
 * Dependencies: React useSyncExternalStore, Lucide icons, OPENING_HOURS from lib/constants.
 * Public functions: SalonStatusBadge().
 * Side effects: Listens to a periodic clock timer for live status updates.
 */
'use client'

import { useSyncExternalStore } from 'react'
import { Clock } from 'lucide-react'
import { OPENING_HOURS } from '@/lib/constants'

type Status = {
  isOpen: boolean
  label: string
  detail: string
}

const SSR_DEFAULT_STATUS: Status = {
  isOpen: true,
  label: 'Buka Hari Ini',
  detail: '09:00 - 21:00',
}

function computeLiveStatus(): Status {
  const now = new Date()
  const dayIndex = now.getDay()
  const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const todayName = daysMap[dayIndex]
  const schedule = OPENING_HOURS.find((item) => item.day === todayName) || OPENING_HOURS[0]

  const parts = schedule.hours.split('-').map((s) => s.trim())
  if (parts.length === 2) {
    const [openStr, closeStr] = parts
    const [openH, openM] = openStr.split(':').map(Number)
    const [closeH, closeM] = closeStr.split(':').map(Number)

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const openMinutes = openH * 60 + (openM || 0)
    const closeMinutes = closeH * 60 + (closeM || 0)

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      const hoursLeft = Math.floor((closeMinutes - currentMinutes) / 60)
      const closingSoon = hoursLeft <= 1
      return {
        isOpen: true,
        label: closingSoon ? 'Segera Tutup' : 'Buka Sekarang',
        detail: `Tutup pukul ${closeStr}`,
      }
    } else {
      return {
        isOpen: false,
        label: 'Tutup Sekarang',
        detail: `Buka kembali ${openStr}`,
      }
    }
  }

  return {
    isOpen: true,
    label: 'Buka Hari Ini',
    detail: schedule.hours,
  }
}

function subscribeToClock(callback: () => void) {
  const interval = setInterval(callback, 60000)
  return () => clearInterval(interval)
}

function getClientSnapshot(): string {
  return JSON.stringify(computeLiveStatus())
}

function getServerSnapshot(): string {
  return JSON.stringify(SSR_DEFAULT_STATUS)
}

export default function SalonStatusBadge({ className = '' }: { className?: string }) {
  const statusJson = useSyncExternalStore(subscribeToClock, getClientSnapshot, getServerSnapshot)
  const status: Status = JSON.parse(statusJson)

  return (
    <div
      suppressHydrationWarning
      className={`inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-surface/70 px-3.5 py-1.5 text-xs backdrop-blur-md transition-all ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            status.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
        />
      </span>
      <span suppressHydrationWarning className="font-medium text-foreground">
        {status.label}
      </span>
      <span className="text-white/40">•</span>
      <span suppressHydrationWarning className="flex items-center gap-1 text-text-muted">
        <Clock className="h-3 w-3 text-accent-gold" />
        {status.detail}
      </span>
    </div>
  )
}
