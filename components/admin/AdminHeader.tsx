/**
 * Module: Admin header
 * Purpose: Render admin navigation controls, Clerk account access, and unread alerts.
 * Used by: AdminLayout on authenticated admin pages.
 * Dependencies: Next client runtime, notification API, UserMenu, lucide-react.
 * Public functions: AdminHeader().
 * Side effects: Polls unread notifications and marks them read when opened.
 */
'use client'

import { Menu, Bell, Search, PanelLeftClose, PanelLeftOpen, ArrowRight, CheckCheck } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu'

interface AdminHeaderProps {
  onMenuToggle: () => void
  onCollapseToggle: () => void
  isCollapsed: boolean
  title: string
  breadcrumb: { label: string; href?: string }[]
}

type NotificationItem = { id: number; title: string; message: string; href?: string | null; readAt?: string | null; createdAt: string }

export default function AdminHeader({ onMenuToggle, onCollapseToggle, isCollapsed, title, breadcrumb }: AdminHeaderProps) {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  useEffect(() => {
    const load = () => fetch('/api/notifications', { cache: 'no-store' }).then((response) => response.json()).then((payload) => { setNotifications(payload.data ?? []); setUnreadCount(payload.unreadCount ?? 0) }).catch(() => undefined)
    void load()
    const interval = window.setInterval(load, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  const markNotificationsRead = () => {
    if (!unreadCount) return
    void fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then(() => { setUnreadCount(0); setNotifications((items) => items.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() }))) })
  }

  const openNotification = (item: NotificationItem) => {
    setNotificationsOpen(false)
    if (!item.readAt) {
      void fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }) })
      setUnreadCount((count) => Math.max(0, count - 1))
      setNotifications((items) => items.map((current) => current.id === item.id ? { ...current, readAt: new Date().toISOString() } : current))
    }
    if (item.href) router.push(item.href)
  }

  const searchItems = [
    { label: 'Dashboard', description: 'Ringkasan salon', href: '/admin/dashboard', keywords: 'home ringkasan statistik' },
    { label: 'Layanan', description: 'Kelola jenis layanan', href: '/admin/services', keywords: 'service treatment harga' },
    { label: 'Kursus', description: 'Kelola kursus kecantikan', href: '/admin/courses', keywords: 'course belajar pelatihan' },
    { label: 'Promosi', description: 'Kelola promo dan voucher', href: '/admin/promotions', keywords: 'promo diskon voucher' },
    { label: 'Redemption', description: 'Validasi penggunaan promo', href: '/admin/redemptions', keywords: 'redeem kode kupon transaksi' },
    { label: 'Galeri', description: 'Kelola portfolio salon', href: '/admin/gallery', keywords: 'gallery portfolio gambar foto' },
    { label: 'Pengaturan', description: 'Atur profil salon dan landing page', href: '/admin/settings', keywords: 'setting branding hero logo alamat' },
    { label: 'Staff & Akses', description: 'Cari dan kelola user', href: '/admin/users', keywords: 'staff user member admin karyawan' },
  ]
  const results = searchItems.filter((item) => `${item.label} ${item.description} ${item.keywords}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5)
  const goToResult = (href: string) => { setQuery(''); setSearchOpen(false); router.push(href) }
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (results[0]) goToResult(results[0].href)
    else if (query.trim()) goToResult(`/admin/users?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-border bg-surface/95 px-3 backdrop-blur-xl sm:px-4 lg:px-6">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuToggle}
        className="mr-1 min-h-11 min-w-11 rounded-lg p-2 text-text-light transition-colors hover:bg-surface/50 hover:text-foreground sm:mr-2 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Collapse Toggle */}
      <button
        onClick={onCollapseToggle}
        className="hidden lg:flex p-2 mr-4 text-text-light hover:text-foreground hover:bg-surface/50 rounded-lg transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="w-5 h-5" />
        ) : (
          <PanelLeftClose className="w-5 h-5" />
        )}
      </button>

      {/* Breadcrumbs */}
      <div className="min-w-0 flex-1">
        <nav className="flex min-w-0 items-center gap-2 truncate text-sm text-text-muted" aria-label="Breadcrumb">
          <a href="/admin/dashboard" className="hover:text-primary transition-colors">
            Admin
          </a>
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex min-w-0 items-center gap-2">
              <span className="text-border">/</span>
              {item.href ? (
                <a href={item.href} className="truncate transition-colors hover:text-primary">
                  {item.label}
                </a>
              ) : (
                <span className="truncate font-medium text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <div className="relative">
          <form onSubmit={submitSearch} role="search">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true) }} onFocus={() => setSearchOpen(true)} onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)} placeholder="Cari menu..." aria-label="Pencarian admin" className="h-11 w-11 rounded-lg border border-border bg-background pl-9 pr-0 text-sm text-foreground outline-none transition-[width] placeholder:text-transparent max-sm:focus:w-32 focus:border-primary focus:ring-2 focus:ring-primary/30 sm:w-44 sm:pr-3 sm:placeholder:text-text-muted md:w-64" />
          </form>
          {searchOpen && query.trim() && <div className="absolute right-0 top-12 z-50 w-[min(19rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
            {results.length ? results.map((result) => <button key={result.href} type="button" onMouseDown={() => goToResult(result.href)} className="flex min-h-14 w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left hover:bg-background"><span className="min-w-0"><span className="block truncate text-sm font-medium text-foreground">{result.label}</span><span className="block truncate text-xs text-text-muted">{result.description}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-primary" /></button>) : <button type="button" onMouseDown={() => goToResult(`/admin/users?search=${encodeURIComponent(query.trim())}`)} className="w-full px-4 py-3 text-left text-sm text-text-muted hover:bg-background">Cari “{query}” di Staff & Akses</button>}
          </div>}
        </div>

        {/* Notifications */}
        <div className="relative">
        <button onClick={() => setNotificationsOpen((open) => !open)} className="relative min-h-11 min-w-11 rounded-lg p-2 text-text-light transition-colors hover:bg-surface/50 hover:text-foreground" aria-label="Notifications" aria-expanded={notificationsOpen} aria-haspopup="true">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>
        {notificationsOpen && <div className="fixed inset-x-3 top-[4.25rem] z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[min(22rem,calc(100vw-1.5rem))]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><p className="text-sm font-semibold text-foreground">Notifikasi</p><p className="text-xs text-text-muted">{unreadCount ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}</p></div>{unreadCount > 0 && <button onClick={markNotificationsRead} className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-xs text-primary hover:bg-background"><CheckCheck className="h-4 w-4" />Tandai dibaca</button>}</div>
          <div className="max-h-[min(24rem,calc(100vh-8rem))] overflow-y-auto">{notifications.length ? notifications.map((item) => <button key={item.id} onClick={() => openNotification(item)} className={`flex min-h-16 w-full gap-3 border-b border-border px-4 py-3 text-left hover:bg-background ${item.readAt ? '' : 'bg-primary/5'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.readAt ? 'bg-border' : 'bg-primary'}`} /><span className="min-w-0"><span className="block text-sm font-medium text-foreground">{item.title}</span><span className="mt-0.5 block text-xs leading-relaxed text-text-muted">{item.message}</span><span className="mt-1 block text-[11px] text-text-muted">{new Date(item.createdAt).toLocaleString('id-ID')}</span></span></button>) : <p className="px-4 py-8 text-center text-sm text-text-muted">Belum ada notifikasi.</p>}</div>
        </div>}
        </div>

        {/* User Menu */}
        <UserMenu name="Admin" email="admin@elynd.com" />
      </div>
    </header>
  )
}
