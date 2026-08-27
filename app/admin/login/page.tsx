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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#120c10] px-4 py-10 text-foreground sm:px-6">
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-28 bottom-1/4 h-80 w-80 rounded-full bg-accent-rose/10 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden border border-white/10 bg-background/90 shadow-2xl shadow-black/30 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="hidden flex-col justify-between border-r border-white/10 bg-surface/70 p-10 lg:flex">
          <Link href="/" className="flex items-center gap-3" aria-label="Beauty Salon Elin, kembali ke beranda">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#f7efe4]/70 bg-[#f7efe4] p-1.5 shadow-[0_4px_18px_rgba(0,0,0,0.24)]"><img src="/brand/logo.webp" alt="Beauty Salon Elin" className="h-full w-full object-contain" /></span>
            <span className="flex flex-col leading-none">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-text-muted">Beauty Salon</span>
              <span className="mt-1 font-display text-2xl font-bold text-foreground">Elin</span>
            </span>
          </Link>
          <div>
            <p className="mb-4 max-w-xs text-sm uppercase tracking-[0.2em] text-accent-rose">Ruang kerja Elin</p>
            <h1 className="max-w-sm font-display text-4xl leading-tight text-white">Kelola pengalaman terbaik untuk setiap tamu.</h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-muted">Masuk untuk mengelola layanan, promosi, galeri, dan operasional salon.</p>
          </div>
          <p className="text-xs text-text-muted">Beauty Salon Elin · Admin access</p>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-10 sm:px-10 lg:py-14">
          <div className="mb-8 w-full max-w-md lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Beauty Salon Elin, kembali ke beranda">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#f7efe4]/70 bg-[#f7efe4] p-1.5 shadow-[0_4px_18px_rgba(0,0,0,0.24)]"><img src="/brand/logo.webp" alt="Beauty Salon Elin" className="h-full w-full object-contain" /></span>
              <span className="flex flex-col leading-none">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-text-muted">Beauty Salon</span>
                <span className="mt-1 font-display text-xl font-bold text-foreground">Elin</span>
              </span>
            </Link>
          </div>
          <SignIn
            routing="hash"
            forceRedirectUrl="/admin/dashboard"
            fallbackRedirectUrl="/admin/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#fb7185',
                colorPrimaryForeground: '#120c10',
                colorBackground: '#1e1b2e',
                colorForeground: '#ffffff',
                colorMutedForeground: '#d4d4d8',
                colorInput: '#0a0a0a',
                colorInputForeground: '#ffffff',
                colorBorder: '#3f3c5a',
                borderRadius: '0.7rem',
                fontFamily: 'Outfit, ui-sans-serif, system-ui, sans-serif',
              },
              elements: {
                rootBox: 'w-full',
                card: 'w-full max-w-md border-0 bg-transparent p-0 shadow-none',
                headerTitle: 'font-display text-3xl font-bold tracking-tight',
                headerSubtitle: 'text-text-light',
                socialButtons: 'hidden',
                footerAction: 'hidden',
                formFieldLabel: 'text-text-light',
                formFieldInput: 'border-border bg-background text-foreground shadow-none focus:border-accent-rose focus:ring-accent-rose',
                socialButtonsBlockButton: 'border-border bg-surface-light text-white shadow-none hover:bg-[#3b3650]',
                socialButtonsBlockButtonText: '!text-white',
                formButtonPrimary: 'bg-accent-rose text-[#120c10] shadow-none hover:bg-[#fda4af]',
                footerActionLink: 'text-accent-rose hover:text-[#fda4af]',
                identityPreviewText: 'text-text-light',
                formFieldErrorText: 'text-red-300',
              },
            }}
          />
        </div>
      </div>
    </main>
  )
}
