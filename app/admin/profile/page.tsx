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
import { KeyRound, UserRound } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import AdminNotice from '@/components/admin/AdminNotice'

export default function AdminProfile() {
  const { isLoaded, user } = useUser()
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (user) setName(user.fullName || user.firstName || '')
  }, [user])

  async function updateName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !name.trim()) return
    setSavingName(true)
    setMessage('')
    try {
      const parts = name.trim().split(/\s+/)
      await user.update({ firstName: parts[0], lastName: parts.slice(1).join(' ') || undefined })
      setMessage('Nama berhasil diperbarui')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Nama gagal diperbarui')
    } finally { setSavingName(false) }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    if (newPassword.length < 8) return setMessage('Password baru minimal 8 karakter')
    if (newPassword !== confirmPassword) return setMessage('Konfirmasi password tidak sama')
    setSavingPassword(true)
    setMessage('')
    try {
      await user.updatePassword({ currentPassword: currentPassword || undefined, newPassword, signOutOfOtherSessions: true })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage('Password berhasil diperbarui. Sesi lain telah dikeluarkan.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Password gagal diperbarui')
    } finally { setSavingPassword(false) }
  }

  const role = String(user?.publicMetadata?.role || 'member')
  const email = user?.primaryEmailAddress?.emailAddress || '—'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Profil Saya" breadcrumb={[]} />
        <div className="max-w-5xl"><AdminNotice message={message} /></div>
        {!isLoaded ? <p className="text-text-muted">Memuat profil...</p> : <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-surface/50 p-6">
            <div className="mb-6 flex items-center gap-3"><UserRound className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">Identitas akun</h2><p className="text-sm text-text-muted">Informasi dari Clerk</p></div></div>
            <div className="space-y-4 text-sm"><div><span className="text-text-muted">Email</span><p className="mt-1 font-medium">{email}</p></div><div><span className="text-text-muted">Status role</span><p className="mt-1 inline-flex rounded-full bg-primary/10 px-3 py-1 font-medium capitalize text-primary">{role}</p></div><p className="text-xs leading-relaxed text-text-muted">Role dikelola oleh admin melalui menu Staff & Akses agar tidak dapat dinaikkan sendiri oleh pengguna.</p></div>
            <form onSubmit={updateName} className="mt-8 space-y-3 border-t border-border pt-6"><label className="block text-sm font-medium">Nama tampilan<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" /></label><button disabled={savingName} className="rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50">{savingName ? 'Menyimpan...' : 'Simpan nama'}</button></form>
          </section>
          <section className="rounded-xl border border-border bg-surface/50 p-6"><div className="mb-6 flex items-center gap-3"><KeyRound className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">Keamanan akun</h2><p className="text-sm text-text-muted">Perbarui password login internal</p></div></div><form onSubmit={updatePassword} className="space-y-4"><label className="block text-sm font-medium">Password saat ini<input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" /></label><label className="block text-sm font-medium">Password baru<input required minLength={8} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" /></label><label className="block text-sm font-medium">Konfirmasi password<input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" /></label><button disabled={savingPassword} className="rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50">{savingPassword ? 'Memperbarui...' : 'Perbarui password'}</button></form></section>
        </div>}
      </div>
    </AdminLayout>
  )
}
