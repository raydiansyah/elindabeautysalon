/**
 * Module: Application error boundary
 * Purpose: Render a safe generic error page without exposing server details.
 * Used by: Next.js App Router when a page or server component throws.
 * Dependencies: React error boundary props and global styles.
 * Public functions: ErrorPage().
 * Side effects: Allows a user-initiated retry through reset().
 */
'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground"><h1 className="text-2xl font-semibold">Terjadi kesalahan</h1><p className="text-text-muted">Halaman tidak dapat dimuat. Silakan coba lagi.</p><button type="button" onClick={() => reset()} className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Coba lagi</button></main>
}
