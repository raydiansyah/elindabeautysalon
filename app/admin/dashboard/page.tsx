/**
 * Module: Admin promotion dashboard
 * Purpose: Display live promotion and redemption performance metrics with quick operational shortcuts.
 * Used by: Authenticated admin route at /admin/dashboard.
 * Dependencies: Dashboard stats API, AdminLayout, StatCard, lucide-react.
 * Public functions: AdminDashboard().
 * Side effects: Reads live stats from the authenticated dashboard API.
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TicketPercent,
  Eye,
  Percent,
  TrendingDown,
  Scissors,
  Image as GalleryIcon,
  BookOpen,
  QrCode,
  Settings,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import StatCard from '@/components/admin/StatCard'

type Stats = { totalPromoAktif: number; totalView: number; totalRedemption: number; conversionRate: number; totalDiskonGiven: number }
const emptyStats: Stats = { totalPromoAktif: 0, totalView: 0, totalRedemption: 0, conversionRate: 0, totalDiskonGiven: 0 }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(emptyStats)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', { cache: 'no-store' })
      const payload = await response.json()
      if (payload.data) {
        setStats(payload.data)
        setLastUpdated(new Date())
      }
    } catch {
      // Keep existing stats on temporary network lapse
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadStats()
    const interval = window.setInterval(loadStats, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Ikhtisar Salon</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Pantau performa promosi, redemption kupon, dan kelola konten salon secara realtime.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true)
              void loadStats()
            }}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-surface/80 px-4 py-2 text-xs font-semibold text-text-light hover:text-white hover:bg-surface-light transition-all shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-accent-gold' : ''}`} />
            <span>Segarkan ({lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})</span>
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<TicketPercent className="h-6 w-6 text-accent-gold" />}
            label="Promo Aktif"
            value={stats.totalPromoAktif}
            color="from-accent-gold/25 to-accent-gold/5"
          />
          <StatCard
            icon={<Eye className="h-6 w-6 text-amber-400" />}
            label="Total Dilihat"
            value={stats.totalView.toLocaleString('id-ID')}
            color="from-amber-500/25 to-amber-500/5"
          />
          <StatCard
            icon={<Percent className="h-6 w-6 text-accent-rose" />}
            label="Tingkat Konversi"
            value={`${stats.conversionRate}%`}
            color="from-accent-rose/25 to-accent-rose/5"
          />
          <StatCard
            icon={<TrendingDown className="h-6 w-6 text-emerald-400" />}
            label="Total Redemption"
            value={stats.totalRedemption}
            color="from-emerald-500/25 to-emerald-500/5"
          />
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-md shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-gold" />
                <span>Pusat Kendali Cepat</span>
              </h2>
              <p className="text-xs text-text-muted mt-0.5">Akses modul utama salon untuk update data dan melayani pelanggan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Layanan */}
            <Link
              href="/admin/services"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-background/50 p-5 transition-all duration-200 hover:border-accent-gold/50 hover:bg-surface hover:shadow-lg"
            >
              <div>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold border border-accent-gold/20 group-hover:scale-110 transition-transform">
                  <Scissors className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                  <span>Daftar Layanan</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent-gold" />
                </h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">Perbarui tarif harga awal, kategori servis & status tayang.</p>
              </div>
            </Link>

            {/* Galeri & Before-After */}
            <Link
              href="/admin/gallery"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-background/50 p-5 transition-all duration-200 hover:border-accent-rose/50 hover:bg-surface hover:shadow-lg"
            >
              <div>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-rose/15 text-accent-rose border border-accent-rose/20 group-hover:scale-110 transition-transform">
                  <GalleryIcon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                  <span>Galeri & Before/After</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent-rose" />
                </h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">Upload foto portofolio & slider perbandingan transformasi.</p>
              </div>
            </Link>

            {/* Kursus & Academy */}
            <Link
              href="/admin/courses"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-background/50 p-5 transition-all duration-200 hover:border-amber-400/50 hover:bg-surface hover:shadow-lg"
            >
              <div>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/20 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                  <span>Kursus Salon</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-400" />
                </h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">Atur kelas kecantikan, jadwal materi, instruktur & link pendaftaran.</p>
              </div>
            </Link>

            {/* Redemption Kupon */}
            <Link
              href="/admin/redemptions"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-background/50 p-5 transition-all duration-200 hover:border-emerald-400/50 hover:bg-surface hover:shadow-lg"
            >
              <div>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400 border border-emerald-400/20 group-hover:scale-110 transition-transform">
                  <QrCode className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                  <span>Redemption Promo</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                </h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">Validasi kode voucher kasir & catat diskon transaksi kasir.</p>
              </div>
            </Link>

            {/* Pengaturan */}
            <Link
              href="/admin/settings"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-background/50 p-5 transition-all duration-200 hover:border-sky-400/50 hover:bg-surface hover:shadow-lg"
            >
              <div>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/15 text-sky-400 border border-sky-400/20 group-hover:scale-110 transition-transform">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                  <span>Pengaturan Web</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sky-400" />
                </h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">Ubah kontak WhatsApp, logo, media sosial & jam operasional.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System & Salon Operational Status */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Card 1: Operational Summary */}
          <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm space-y-4">
            <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-gold" />
              <span>Status Operasional Salon</span>
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-white/5">
                <span className="text-text-muted">Jam Layanan Tamu</span>
                <span className="font-medium text-white">10.00 – 19.00 WIB (Buka Setiap Hari)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-white/5">
                <span className="text-text-muted">Jalur Reservasi</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  WhatsApp Direct Sync Aktif
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-white/5">
                <span className="text-text-muted">Total Diskon Diberikan</span>
                <span className="font-bold text-accent-gold">
                  Rp{stats.totalDiskonGiven.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Identity */}
          <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm space-y-4">
            <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-rose" />
              <span>Keamanan & Integrasi Cloud</span>
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-white/5">
                <span className="text-text-muted">Penyimpanan Media & Banner</span>
                <span className="font-medium text-white">Cloudflare R2 Storage</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-white/5">
                <span className="text-text-muted">Database Engine</span>
                <span className="font-medium text-white">Neon Serverless PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-white/5">
                <span className="text-text-muted">Autentikasi Staf</span>
                <span className="font-medium text-white">Clerk Identity (Role Protected)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

