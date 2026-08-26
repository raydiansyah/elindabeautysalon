/**
 * Module: Admin application shell
 * Purpose: Render authenticated admin navigation and shared page chrome.
 * Used by: Admin dashboard and management pages.
 * Dependencies: Next navigation, Clerk UserButton, framer-motion, lucide-react.
 * Public functions: AdminLayout().
 * Side effects: Reads client route state and Clerk session; navigation changes URL.
 */
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Scissors,
  DollarSign,
  Image,
  FileText,
  Settings,
  Sparkles,
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import AdminHeader from './AdminHeader'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Layanan', href: '/admin/services', icon: Scissors },
  { name: 'Promosi', href: '/admin/promotions', icon: Sparkles },
  { name: 'Redemption', href: '/admin/redemptions', icon: Sparkles },
  { name: 'Harga', href: '/admin/pricing', icon: DollarSign },
  { name: 'Galeri', href: '/admin/gallery', icon: Image },
  { name: 'Konten', href: '/admin/content', icon: FileText },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
  { name: 'Staff & Akses', href: '/admin/users', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // Get current page title and breadcrumb
  const getCurrentBreadcrumb = () => {
    const currentPath = pathname?.replace('/admin', '') || ''
    const parts = currentPath.split('/').filter(Boolean)
    const currentPage = parts[parts.length - 1] || 'dashboard'

    return {
      title: currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
      breadcrumb: [{ label: currentPage.charAt(0).toUpperCase() + currentPage.slice(1) }]
    }
  }

  const { title, breadcrumb } = getCurrentBreadcrumb()

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AdminHeader
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        title={title}
        breadcrumb={breadcrumb}
        onCollapseToggle={toggleSidebarCollapse}
        isCollapsed={sidebarCollapsed}
      />

      <div className="flex pt-16">
        {/* Sidebar Overlay (mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 bottom-0 z-50 bg-surface/95 backdrop-blur-xl border-r border-border transition-all duration-300 overflow-y-auto overflow-x-hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-64 w-64'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`border-b border-border transition-all duration-300 ${sidebarCollapsed ? 'lg:px-4 py-4' : 'p-6'}`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
                {!sidebarCollapsed && (
                  <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent whitespace-nowrap">
                    Elynd
                  </h1>
                )}
              </div>
              {!sidebarCollapsed && (
                <p className="text-sm text-text-muted mt-2 whitespace-nowrap">CMS Panel</p>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${
                      sidebarCollapsed ? 'lg:justify-center lg:px-4' : 'px-4'
                    } py-3 ${
                      isActive
                        ? 'bg-primary/20 text-primary border-l-4 border-primary'
                        : 'text-text-light hover:bg-surface hover:text-foreground'
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="font-medium whitespace-nowrap">{item.name}</span>
                    )}
                    {sidebarCollapsed && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Clerk account controls */}
            <div className={`border-t border-border transition-all duration-300 ${sidebarCollapsed ? 'lg:p-4' : 'p-4'}`}>
              <UserButton />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
