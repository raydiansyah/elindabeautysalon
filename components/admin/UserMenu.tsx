/**
 * Module: Admin user menu
 * Purpose: Show operator identity, profile/settings links, and Clerk-backed sign-out action.
 * Used by: Admin header components.
 * Dependencies: @clerk/nextjs useClerk/useUser, Next Link, framer-motion, lucide-react.
 * Public functions: UserMenu().
 * Side effects: Calls Clerk signOut and navigates to admin login.
 */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Settings, UserRound, ChevronDown } from 'lucide-react'
import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'

interface UserMenuProps {
  name: string
  email: string
}

export default function UserMenu({ name, email }: UserMenuProps) {
  const { signOut } = useClerk()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const displayName = user?.fullName || user?.firstName || name
  const displayEmail = user?.primaryEmailAddress?.emailAddress || email
  const initials = displayName.slice(0, 1).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-11 items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-surface/50 sm:gap-3 sm:p-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">{displayName}</div>
          <div className="text-xs text-text-muted">{displayEmail}</div>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-[min(16rem,calc(100vw-1.5rem))] rounded-xl border border-border bg-surface/95 shadow-xl backdrop-blur-xl"
          >
            <div className="p-4 border-b border-border">
              <div className="text-sm font-medium text-foreground mb-1">{displayName}</div>
              <div className="text-xs text-text-muted">{displayEmail}</div>
            </div>

            <div className="p-2">
              <Link
                href="/admin/profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-light hover:bg-surface/50 hover:text-foreground rounded-lg transition-colors"
              >
                <UserRound className="w-4 h-4" />
                Profil saya
              </Link>

              <Link href="/admin/settings" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-light hover:bg-surface/50 hover:text-foreground rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                Pengaturan salon
              </Link>

              <button
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                onClick={() => signOut({ redirectUrl: '/admin/login' })}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
