/**
 * Module: Clerk admin sign-in page
 * Purpose: Render Clerk email/password and reset-password authentication.
 * Used by: Clerk middleware redirect for unauthenticated admin users.
 * Dependencies: @clerk/nextjs SignIn and global theme CSS.
 * Public functions: AdminLogin().
 * Side effects: Clerk manages authentication cookies and redirects.
 */
import { SignIn } from '@clerk/nextjs'

export default function AdminLogin() {
  return <main className="min-h-screen bg-gradient-to-br from-secondary via-background to-surface flex items-center justify-center px-4 py-10"><SignIn routing="hash" fallbackRedirectUrl="/admin/dashboard" /></main>
}
