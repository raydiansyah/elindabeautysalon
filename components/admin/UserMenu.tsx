/**
 * Module: Admin user menu
 * Purpose: Show operator identity and Clerk-backed sign-out action.
 * Used by: Admin header components.
 * Dependencies: @clerk/nextjs useClerk, framer-motion, lucide-react.
 * Public functions: UserMenu().
 * Side effects: Calls Clerk signOut and navigates to admin login.
 */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Settings, ChevronDown } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'

interface UserMenuProps {
  name: string
  email: string
}

export default function UserMenu({ name, email }: UserMenuProps) {
  const { signOut } = useClerk()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface/50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">{name}</div>
          <div className="text-xs text-text-muted">{email}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-surface/95 backdrop-blur-xl border border-border rounded-xl shadow-xl z-50"
          >
            <div className="p-4 border-b border-border">
              <div className="text-sm font-medium text-foreground mb-1">{name}</div>
              <div className="text-xs text-text-muted">{email}</div>
            </div>

            <div className="p-2">
              <button
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-light hover:bg-surface/50 hover:text-foreground rounded-lg transition-colors"
                onClick={() => {
                  /* Navigate to settings */
                }}
              >
                <Settings className="w-4 h-4" />
                Pengaturan
              </button>

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
