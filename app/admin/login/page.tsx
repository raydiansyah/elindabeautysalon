/**
 * Module: Clerk admin sign-in page
 * Purpose: Render Clerk email/password and reset-password authentication.
 * Used by: Clerk middleware redirect for unauthenticated admin users.
 * Dependencies: @clerk/nextjs SignIn and global theme CSS.
 * Public functions: AdminLogin().
 * Side effects: Clerk manages authentication cookies and redirects.
 */
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function AdminLogin() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0a08] px-4 py-10 text-foreground sm:px-6">
      {/* Ambient gold glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#d9b978]/8 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[#d9b978]/6 blur-[140px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#d9b978]/4 blur-[100px]" aria-hidden="true" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#d9b978]/15 bg-[#120d09]/95 shadow-2xl shadow-black/60 lg:grid-cols-[0.85fr_1.15fr]">

        {/* ── Left panel ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[#d9b978]/10 bg-[#0d0a08]/80 p-10 lg:flex">
          {/* Subtle vertical gold line decoration */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#d9b978]/20 to-transparent" aria-hidden="true" />
          {/* Corner gold accent */}
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#d9b978]/5 blur-3xl" aria-hidden="true" />

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3" aria-label="Beauty Salon Elin, kembali ke beranda">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d9b978]/30 bg-[#f7efe4] p-1.5 shadow-[0_4px_18px_rgba(217,185,120,0.15)] transition-shadow group-hover:shadow-[0_4px_24px_rgba(217,185,120,0.3)]">
              <img src="/brand/logo.webp" alt="Beauty Salon Elin" className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#d9b978]/60">Beauty Salon</span>
              <span className="mt-1 font-display text-2xl font-bold text-white">Elin</span>
            </span>
          </Link>

          {/* Hero copy */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-px w-6 bg-[#d9b978]/50" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d9b978]">Ruang Kerja Admin</p>
            </div>
            <h1 className="max-w-sm font-display text-[2.2rem] leading-tight text-white">
              Kelola pengalaman terbaik untuk setiap tamu.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/40">
              Masuk untuk mengelola layanan, promosi, galeri, dan operasional salon.
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-3">
              {['Manajemen layanan & harga', 'Galeri & konten promosi', 'Data tamu & program loyalitas'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/50">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d9b978]/30 bg-[#d9b978]/10">
                    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-[#d9b978]" aria-hidden="true">
                      <path d="M10.28 2.28 3.989 8.575 1.695 6.28A1 1 0 0 0 .28 7.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28 2.28z" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/20">© Beauty Salon Elin · Admin Portal</p>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="flex flex-col items-center justify-center px-5 py-12 sm:px-10 lg:py-16">
          {/* Mobile logo */}
          <div className="mb-8 w-full max-w-md lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Beauty Salon Elin, kembali ke beranda">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d9b978]/30 bg-[#f7efe4] p-1.5 shadow-[0_4px_18px_rgba(0,0,0,0.24)]">
                <img src="/brand/logo.webp" alt="Beauty Salon Elin" className="h-full w-full object-contain" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#d9b978]/60">Beauty Salon</span>
                <span className="mt-1 font-display text-xl font-bold text-white">Elin</span>
              </span>
            </Link>
          </div>

          {/* Heading above Clerk */}
          <div className="mb-6 w-full max-w-md">
            <h2 className="font-display text-2xl font-bold text-white">Selamat datang kembali</h2>
            <p className="mt-1 text-sm text-white/40">Masuk ke portal manajemen salon</p>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-[#d9b978]/30 via-[#d9b978]/10 to-transparent" />
          </div>

          <SignIn
            routing="hash"
            forceRedirectUrl="/admin/dashboard"
            fallbackRedirectUrl="/admin/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#d9b978',
                colorPrimaryForeground: '#0d0a08',
                colorBackground: '#120d09',
                colorForeground: '#ffffff',
                colorMutedForeground: '#a89070',
                colorInput: '#1a1208',
                colorInputForeground: '#ffffff',
                colorBorder: '#2e2416',
                borderRadius: '0.75rem',
                fontFamily: 'Outfit, ui-sans-serif, system-ui, sans-serif',
              },
              elements: {
                rootBox: 'w-full',
                card: 'w-full max-w-md border-0 bg-transparent p-0 shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                header: 'hidden',
                socialButtons: 'hidden',
                dividerRow: 'hidden',
                footerAction: 'hidden',
                formFieldLabel: 'text-white/60 text-xs font-medium uppercase tracking-wider mb-1',
                formFieldInput:
                  'border border-[#2e2416] bg-[#1a1208] text-white placeholder:text-white/20 shadow-none focus:border-[#d9b978]/50 focus:ring-1 focus:ring-[#d9b978]/30 transition-all rounded-xl',
                formButtonPrimary:
                  'mt-2 rounded-xl bg-[#d9b978] text-[#0d0a08] font-semibold shadow-[0_0_24px_rgba(217,185,120,0.25)] hover:bg-[#c9a968] hover:shadow-[0_0_32px_rgba(217,185,120,0.35)] transition-all',
                footerActionLink: 'text-[#d9b978] hover:text-[#c9a968]',
                identityPreviewText: 'text-white/60',
                identityPreviewEditButton: 'text-[#d9b978]',
                formFieldErrorText: 'text-red-400',
                alertText: 'text-red-400',
                formResendCodeLink: 'text-[#d9b978]',
              },
            }}
          />
        </div>
      </div>
    </main>
  )
}
