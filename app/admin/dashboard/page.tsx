/**
 * Module: Admin promotion dashboard
 * Purpose: Display live promotion and redemption performance metrics.
 * Used by: Authenticated admin route at /admin/dashboard.
 * Dependencies: Dashboard stats API, AdminLayout, StatCard, lucide-react.
 * Public functions: AdminDashboard().
 * Side effects: Reads live stats from the authenticated dashboard API.
 */
'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import StatCard from '@/components/admin/StatCard'
import { TicketPercent, Eye, Percent, TrendingDown, Scissors, Image as GalleryIcon, TrendingUp, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

type Stats = { totalPromoAktif: number; totalView: number; totalRedemption: number; conversionRate: number; totalDiskonGiven: number }
const emptyStats: Stats = { totalPromoAktif: 0, totalView: 0, totalRedemption: 0, conversionRate: 0, totalDiskonGiven: 0 }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(emptyStats)
  useEffect(() => {
    let active = true
    const loadStats = () => fetch('/api/dashboard/stats', { cache: 'no-store' }).then((response) => response.json()).then((payload) => {
      if (active) setStats(payload.data || emptyStats)
    }).catch(() => undefined)
    void loadStats()
    const interval = window.setInterval(loadStats, 30_000)
    return () => { active = false; window.clearInterval(interval) }
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          breadcrumb={[]}
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<TicketPercent className="w-6 h-6 text-white" />}
            label="Promo Aktif"
            value={stats.totalPromoAktif}
            color="from-primary to-primary-light"
          />
          <StatCard
            icon={<Eye className="w-6 h-6 text-white" />}
            label="Total View Promo"
            value={stats.totalView}
            color="from-accent-gold to-orange-500"
          />
          <StatCard
            icon={<Percent className="w-6 h-6 text-white" />}
            label="Conversion Rate"
            value={`${stats.conversionRate}%`}
            color="from-accent-rose to-pink-500"
          />
          <StatCard
            icon={<TrendingDown className="w-6 h-6 text-white" />}
            label="Total Redemption"
            value={stats.totalRedemption}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/services"
              className="group p-6 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all duration-200 border border-transparent hover:border-primary/30"
            >
              <Scissors className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-semibold mb-1">Kelola Layanan</div>
              <div className="text-sm text-text-muted">Tambah, edit, atau hapus layanan</div>
            </a>
            <a
              href="/admin/gallery"
              className="group p-6 bg-accent-rose/10 rounded-xl hover:bg-accent-rose/20 transition-all duration-200 border border-transparent hover:border-accent-rose/30"
            >
              <GalleryIcon className="w-8 h-8 text-accent-rose mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-semibold mb-1">Kelola Galeri</div>
              <div className="text-sm text-text-muted">Upload atau hapus gambar</div>
            </a>
            <a
              href="/admin/courses"
              className="group p-6 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all duration-200 border border-transparent hover:border-primary/30"
            >
              <BookOpen className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-semibold mb-1">Kelola Kursus</div>
              <div className="text-sm text-text-muted">Atur program belajar dan jadwal</div>
            </a>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
          <div className="text-center py-12 text-text-muted">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada aktivitas</p>
            <p className="text-sm mt-2">Aktivitas akan muncul setelah Anda mulai mengelola konten</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
