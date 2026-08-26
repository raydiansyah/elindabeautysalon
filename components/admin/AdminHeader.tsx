/**
 * Module: Admin header
 * Purpose: Render admin navigation controls, Clerk account access, and unread alerts.
 * Used by: AdminLayout on authenticated admin pages.
 * Dependencies: Next client runtime, notification API, UserMenu, lucide-react.
 * Public functions: AdminHeader().
 * Side effects: Polls unread notifications and marks them read when opened.
 */
'use client'

import { Menu, Bell, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import UserMenu from './UserMenu'

interface AdminHeaderProps {
  onMenuToggle: () => void
  onCollapseToggle: () => void
  isCollapsed: boolean
  title: string
  breadcrumb: { label: string; href?: string }[]
}

export default function AdminHeader({ onMenuToggle, onCollapseToggle, isCollapsed, title, breadcrumb }: AdminHeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  useEffect(() => {
    const load = () => fetch('/api/notifications', { cache: 'no-store' }).then((response) => response.json()).then((payload) => setUnreadCount(payload.unreadCount ?? 0)).catch(() => undefined)
    void load()
    const interval = window.setInterval(load, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  const markNotificationsRead = () => {
    if (!unreadCount) return
    void fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then(() => setUnreadCount(0))
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface/95 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 mr-4 text-text-light hover:text-foreground hover:bg-surface/50 rounded-lg transition-colors"
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
      <div className="flex-1 min-w-0">
        <nav className="flex items-center gap-2 text-sm text-text-muted" aria-label="Breadcrumb">
          <a href="/admin/dashboard" className="hover:text-primary transition-colors">
            Admin
          </a>
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className="text-border">/</span>
              {item.href ? (
                <a href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search (hidden on mobile) */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
          />
        </div>

        {/* Notifications */}
        <button onClick={markNotificationsRead} className="relative p-2 text-text-light hover:text-foreground hover:bg-surface/50 rounded-lg transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>

        {/* User Menu */}
        <UserMenu name="Admin" email="admin@elynd.com" />
      </div>
    </header>
  )
}
