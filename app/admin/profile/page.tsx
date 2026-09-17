/**
 * Module: Admin profile page
 * Purpose: Let the signed-in operator update their name and password while viewing role status.
 * Used by: Authenticated admin route at /admin/profile and avatar dropdown.
 * Dependencies: Clerk useUser hook, AdminLayout, PageHeader, Lucide icons.
 * Public functions: AdminProfile().
 * Side effects: Updates the current Clerk user profile and password through Clerk Frontend API.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import {
  KeyRound,
  UserRound,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'

/* ─────────────────── helpers ── */
function Notice({
  message,
  type,
  onDismiss,
}: {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        type === 'success'
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          : 'border-red-500/20 bg-red-500/10 text-red-400'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto shrink-0 opacity-60 hover:opacity-100"
        aria-label="Tutup notifikasi"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-white/30">{hint}</p>}
    </div>
  )
}

function TextInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  minLength,
  autoComplete,
  suffix,
}: {
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  minLength?: number
  autoComplete?: string
  suffix?: React.ReactNode
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 text-sm text-white placeholder:text-white/20 transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20 pr-10"
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">{suffix}</div>
      )}
    </div>
  )
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={8}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 pr-10 text-sm text-white placeholder:text-white/20 transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-white/30 hover:text-white/60"
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

/* ─────────────────── role badge ── */
const ROLE_COLORS: Record<string, string> = {
  admin: 'border-[#d9b978]/30 bg-[#d9b978]/10 text-[#d9b978]',
  superadmin: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  member: 'border-white/10 bg-white/5 text-white/50',
}

/* ─────────────────── page ── */
export default function AdminProfile() {
  const { isLoaded, user } = useUser()
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [savingName, setSavingName] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (user) setName(user.fullName || user.firstName || '')
  }, [user])

  async function updateName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !name.trim()) return
    setSavingName(true)
    setMessage(null)
    try {
      const parts = name.trim().split(/\s+/)
      await user.update({ firstName: parts[0], lastName: parts.slice(1).join(' ') || undefined })
      setMessage({ text: 'Nama berhasil diperbarui', type: 'success' })
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Nama gagal diperbarui', type: 'error' })
    } finally {
      setSavingName(false)
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    if (newPassword.length < 8) return setMessage({ text: 'Password baru minimal 8 karakter', type: 'error' })
    if (newPassword !== confirmPassword) return setMessage({ text: 'Konfirmasi password tidak sama', type: 'error' })
    setSavingPassword(true)
    setMessage(null)
    try {
      await user.updatePassword({
        currentPassword: currentPassword || undefined,
        newPassword,
        signOutOfOtherSessions: true,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage({ text: 'Password berhasil diperbarui. Sesi lain telah dikeluarkan.', type: 'success' })
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Password gagal diperbarui', type: 'error' })
    } finally {
      setSavingPassword(false)
    }
  }

  const role = String(user?.publicMetadata?.role || 'member')
  const email = user?.primaryEmailAddress?.emailAddress || '—'
  const initials = (user?.fullName || user?.firstName || 'A')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Profil Saya" breadcrumb={[]} />

        {message && (
          <Notice message={message.text} type={message.type} onDismiss={() => setMessage(null)} />
        )}

        {!isLoaded ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#d9b978]/10 bg-[#120d09]/80 p-6 text-sm text-white/40">
            <Loader2 className="h-4 w-4 animate-spin text-[#d9b978]" />
            Memuat profil…
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">

            {/* ── Identity card ── */}
            <div className="flex flex-col gap-5">
              {/* Avatar hero */}
              <div className="rounded-2xl border border-[#d9b978]/10 bg-[#120d09]/80 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#d9b978]/20 bg-gradient-to-br from-[#d9b978]/20 to-[#d9b978]/5 text-xl font-bold text-[#d9b978]">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullName || 'Avatar'}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-white">
                      {user?.fullName || user?.firstName || 'Admin'}
                    </p>
                    <p className="truncate text-sm text-white/40">{email}</p>
                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_COLORS[role] ?? ROLE_COLORS.member}`}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {role}
                    </span>
                  </div>
                </div>

                {/* Info baris */}
                <div className="mt-5 grid grid-cols-2 divide-x divide-[#d9b978]/10 rounded-xl border border-[#d9b978]/10 bg-[#0d0a08]/60">
                  <div className="flex flex-col gap-0.5 p-4">
                    <span className="text-xs text-white/30">Email</span>
                    <span className="truncate text-xs font-medium text-white/70">{email}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-4">
                    <span className="text-xs text-white/30">Role</span>
                    <span className="text-xs font-medium capitalize text-white/70">{role}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-white/25">
                  Role dikelola oleh admin melalui menu Staff &amp; Akses agar tidak dapat dinaikkan sendiri oleh pengguna.
                </p>
              </div>

              {/* Update nama */}
              <div className="rounded-2xl border border-[#d9b978]/10 bg-[#120d09]/80 p-6">
                <div className="mb-5 flex items-center gap-3 border-b border-[#d9b978]/10 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9b978]/20 bg-[#d9b978]/10">
                    <UserRound className="h-4 w-4 text-[#d9b978]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Nama Tampilan</h2>
                    <p className="text-xs text-white/40">Nama yang terlihat di panel admin</p>
                  </div>
                </div>

                <form onSubmit={updateName} className="space-y-4">
                  <Field label="Nama Lengkap">
                    <TextInput
                      value={name}
                      onChange={setName}
                      placeholder="Nama Anda"
                      required
                    />
                  </Field>
                  <button
                    type="submit"
                    disabled={savingName}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d9b978] px-5 py-2 text-sm font-semibold text-[#0d0a08] shadow-[0_0_16px_rgba(217,185,120,0.2)] transition-all hover:bg-[#c9a968] hover:shadow-[0_0_24px_rgba(217,185,120,0.3)] disabled:opacity-50"
                  >
                    {savingName ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…</>
                    ) : (
                      'Simpan nama'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Security card ── */}
            <div className="rounded-2xl border border-[#d9b978]/10 bg-[#120d09]/80 p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[#d9b978]/10 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9b978]/20 bg-[#d9b978]/10">
                  <KeyRound className="h-4 w-4 text-[#d9b978]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Keamanan Akun</h2>
                  <p className="text-xs text-white/40">Perbarui password login internal</p>
                </div>
              </div>

              <form onSubmit={updatePassword} className="space-y-4">
                <Field label="Password Saat Ini">
                  <PasswordInput
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="Password lama Anda"
                    autoComplete="current-password"
                  />
                </Field>
                <Field label="Password Baru" hint="Minimal 8 karakter">
                  <PasswordInput
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Password baru"
                    required
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Konfirmasi Password Baru">
                  <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Ulangi password baru"
                    required
                    autoComplete="new-password"
                  />
                </Field>

                {/* Password strength bar */}
                {newPassword.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = Math.min(4, Math.floor(newPassword.length / 3))
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              level <= strength
                                ? strength <= 1
                                  ? 'bg-red-500'
                                  : strength <= 2
                                  ? 'bg-amber-500'
                                  : strength <= 3
                                  ? 'bg-[#d9b978]'
                                  : 'bg-emerald-500'
                                : 'bg-white/10'
                            }`}
                          />
                        )
                      })}
                    </div>
                    <p className="text-xs text-white/30">
                      {newPassword.length < 6
                        ? 'Terlalu pendek'
                        : newPassword.length < 9
                        ? 'Lemah'
                        : newPassword.length < 12
                        ? 'Cukup kuat'
                        : 'Sangat kuat'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d9b978] px-5 py-2 text-sm font-semibold text-[#0d0a08] shadow-[0_0_16px_rgba(217,185,120,0.2)] transition-all hover:bg-[#c9a968] hover:shadow-[0_0_24px_rgba(217,185,120,0.3)] disabled:opacity-50"
                >
                  {savingPassword ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Memperbarui…</>
                  ) : (
                    'Perbarui password'
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 text-xs text-amber-400/70">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Mengganti password akan otomatis mengeluarkan semua sesi aktif lainnya.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
