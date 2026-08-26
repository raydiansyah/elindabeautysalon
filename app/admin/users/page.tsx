/**
 * Module: Admin staff and member operations
 * Purpose: Manage Clerk accounts and monitor member visits with operational filters.
 * Used by: Authenticated admin route at /admin/users.
 * Dependencies: React, Clerk staff API, AdminLayout, PageHeader.
 * Public functions: AdminUsers().
 * Side effects: Sends invitations, updates Clerk accounts/passwords, and reads visit aggregates.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { KeyRound, Pencil, Save, Trash2, UserPlus, X } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import AdminNotice from '@/components/admin/AdminNotice'

type Staff = { id: string; name: string; email: string; phone: string; role: string; createdAt: number; visitsMonthly: number[]; visitsAnnual: number }
type EditForm = { name: string; email: string; phone: string; role: string }
const emptyEdit: EditForm = { name: '', email: '', phone: '', role: 'karyawan' }
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export default function AdminUsers() {
  const [users, setUsers] = useState<Staff[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('karyawan')
  const [roleFilter, setRoleFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [year, setYear] = useState(new Date().getFullYear())
  const [search, setSearch] = useState('')
  const [operationalAnnual, setOperationalAnnual] = useState(0)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(emptyEdit)
  const [resetting, setResetting] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const initialSearch = new URLSearchParams(window.location.search).get('search')?.trim()
    if (initialSearch) setSearch(initialSearch)
  }, [])

  async function loadUsers() {
    const params = new URLSearchParams({ year: String(year) })
    if (roleFilter !== 'all') params.set('role', roleFilter)
    if (monthFilter !== 'all') params.set('month', monthFilter)
    if (search.trim()) params.set('search', search.trim())
    try {
      const response = await fetch(`/api/admin/users?${params}`, { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error?.message ?? 'Gagal memuat data')
      setUsers(payload.data ?? [])
      setOperationalAnnual(payload.operationalVisitsAnnual ?? 0)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal memuat data') }
  }

  useEffect(() => { void loadUsers() }, [year, roleFilter, monthFilter, search])

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage('')
    const response = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emailAddress: email, role }) })
    const payload = await response.json()
    setMessage(response.ok ? `Undangan dikirim ke ${email}` : payload.error?.message ?? 'Undangan gagal dikirim')
    if (response.ok) { setEmail(''); await loadUsers() }
  }

  function startEdit(user: Staff) { setEditing(user.id); setEditForm({ name: user.name === 'Tanpa nama' ? '' : user.name, email: user.email === 'Tanpa email' ? '' : user.email, phone: user.phone, role: user.role }); setResetting(null); setMessage('') }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editing) return
    setSaving(true); setMessage('')
    const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: editing, action: 'update', ...editForm }) })
    const payload = await response.json()
    setMessage(response.ok ? 'Data berhasil diperbarui' : payload.error?.message ?? 'Data gagal diperbarui')
    if (response.ok) { setEditing(null); await loadUsers() }
    setSaving(false)
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!resetting) return
    setSaving(true); setMessage('')
    const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: resetting, action: 'resetPassword', newPassword }) })
    const payload = await response.json()
    setMessage(response.ok ? 'Password berhasil direset dan sesi lain dikeluarkan' : payload.error?.message ?? 'Password gagal direset')
    if (response.ok) { setResetting(null); setNewPassword('') }
    setSaving(false)
  }

  async function removeUser(user: Staff) {
    if (!window.confirm(`Hapus user ${user.name} secara permanen? Akun Clerk dan akses loginnya akan dihapus.`)) return
    setMessage('')
    const response = await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
    const payload = await response.json()
    setMessage(response.ok ? `User ${user.name} berhasil dihapus` : payload.error?.message ?? 'User gagal dihapus')
    if (response.ok) await loadUsers()
  }

  return <AdminLayout><div className="space-y-6"><PageHeader title="Staff & Akses" breadcrumb={[]} /><form onSubmit={invite} className="flex max-w-5xl flex-col gap-3 rounded-xl border border-border bg-surface/50 p-6 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-medium">Email pengguna<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="pengguna@salon.com" /></label><label className="text-sm font-medium">Role<select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2"><option value="admin">Admin</option><option value="karyawan">Karyawan</option><option value="member">Member</option></select><span className="mt-1 block text-xs text-text-muted">Satu user hanya memiliki satu role aktif.</span></label><button className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white"><UserPlus className="h-4 w-4" />Kirim undangan</button></form><section className="rounded-xl border border-border bg-surface/50 p-5"><div className="flex items-end justify-between gap-4"><div><p className="text-sm text-text-muted">Kunjungan member</p><p className="mt-1 text-xs text-text-muted">{monthFilter === 'all' ? `Total tahun ${year}` : `Total ${monthLabels[Number(monthFilter) - 1]} ${year}`}</p></div><p className="text-3xl font-semibold tabular-nums text-primary">{operationalAnnual}</p></div></section><section className="flex flex-col gap-3 rounded-xl border border-border bg-surface/50 p-4 md:flex-row"><label className="flex-1 text-sm font-medium">Cari user<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nama, email, atau telepon" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" /></label><label className="text-sm font-medium">Role<select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"><option value="all">Semua role</option><option value="member">Member saja</option><option value="karyawan">Karyawan saja</option><option value="admin">Admin saja</option></select></label><label className="text-sm font-medium">Bulan<select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"><option value="all">Semua bulan</option>{monthLabels.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}</select></label><label className="text-sm font-medium">Tahun<select value={year} onChange={(event) => setYear(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2">{[year - 1, year, year + 1].map((value) => <option key={value} value={value}>{value}</option>)}</select></label></section>{message && <p role="status" aria-live="polite" className="rounded-lg border border-border bg-surface/50 px-4 py-3 text-sm text-text-light">{message}</p>}<div className="overflow-x-auto rounded-xl border border-border bg-surface/50"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b border-border text-text-muted"><th className="p-4">Nama</th><th className="p-4">Email</th><th className="p-4">No. telepon</th><th className="p-4">Role</th><th className="p-4">Kunjungan member {year}</th><th className="p-4">Aksi</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-border align-top"><td className="p-4 font-medium">{user.name}</td><td className="p-4">{user.email}</td><td className="p-4">{user.phone || '—'}</td><td className="p-4 capitalize">{user.role}</td><td className="p-4">{user.role === 'member' ? <div><div className="font-semibold text-primary">{monthFilter === 'all' ? `${user.visitsAnnual} total tahun ${year}` : `${user.visitsMonthly[Number(monthFilter) - 1] ?? 0} kunjungan ${monthLabels[Number(monthFilter) - 1]} ${year}`}</div><p className="mt-1 text-xs text-text-muted">{monthFilter === 'all' ? 'Gunakan filter bulan untuk melihat rincian periode.' : `${user.visitsAnnual} total tahun ${year}`}</p></div> : <span className="text-text-muted">Operasional staff</span>}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => startEdit(user)} className="min-h-11 min-w-11 rounded-lg p-3 text-primary hover:bg-primary/10" aria-label={`Edit ${user.name}`}><Pencil className="h-4 w-4" /></button><button onClick={() => { setResetting(user.id); setEditing(null); setNewPassword(''); setMessage('') }} className="min-h-11 min-w-11 rounded-lg p-3 text-accent-rose hover:bg-accent-rose/10" aria-label={`Reset password ${user.name}`}><KeyRound className="h-4 w-4" /></button><button onClick={() => void removeUser(user)} className="min-h-11 min-w-11 rounded-lg p-3 text-red-500 hover:bg-red-500/10" aria-label={`Hapus ${user.name}`}><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>{editing && <form onSubmit={saveEdit} className="grid max-w-5xl gap-4 rounded-xl border border-primary/30 bg-surface/50 p-6 md:grid-cols-2"><h2 className="font-semibold md:col-span-2">Edit data akun</h2><input required placeholder="Nama" value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} className="rounded-lg border border-border bg-background p-3" /><input required type="email" placeholder="Email" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} className="rounded-lg border border-border bg-background p-3" /><input placeholder="No. telepon, format +628..." value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} className="rounded-lg border border-border bg-background p-3" /><select value={editForm.role} onChange={(event) => setEditForm({ ...editForm, role: event.target.value })} className="rounded-lg border border-border bg-background p-3"><option value="admin">Admin</option><option value="karyawan">Karyawan</option><option value="member">Member</option></select><p className="text-xs text-text-muted md:col-span-2">Role bersifat tunggal: menyimpan role baru akan menggantikan role sebelumnya.</p><div className="flex justify-end gap-2 md:col-span-2"><button type="button" onClick={() => setEditing(null)} className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2"><X className="h-4 w-4" />Batal</button><button disabled={saving} className="flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white"><Save className="h-4 w-4" />{saving ? 'Menyimpan...' : 'Simpan data'}</button></div></form>}{resetting && <form onSubmit={resetPassword} className="grid max-w-5xl gap-4 rounded-xl border border-accent-rose/30 bg-surface/50 p-6 sm:grid-cols-[1fr_auto]"><label className="text-sm font-medium">Password baru<input required minLength={8} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background p-3" placeholder="Minimal 8 karakter" /></label><div className="flex items-end gap-2"><button type="button" onClick={() => setResetting(null)} className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2"><X className="h-4 w-4" />Batal</button><button disabled={saving} className="flex min-h-11 items-center gap-2 rounded-lg bg-accent-rose px-4 py-2 font-semibold text-white"><KeyRound className="h-4 w-4" />Reset password</button></div></form>}</div></AdminLayout>
}
