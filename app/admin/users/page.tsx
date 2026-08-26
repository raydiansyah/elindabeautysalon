/**
 * Module: Admin users page
 * Purpose: Invite salon staff and manage admin/staff application roles.
 * Used by: Authenticated admins at /admin/users.
 * Dependencies: React state, AdminLayout, Clerk staff management API.
 * Public functions: AdminUsers().
 * Side effects: Sends invitations and updates Clerk user metadata through HTTP.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'

type Staff = { id: string; name: string; email: string; role: string; createdAt: number }

export default function AdminUsers() {
  const [users, setUsers] = useState<Staff[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('karyawan')
  const [message, setMessage] = useState('')

  const loadUsers = () => fetch('/api/admin/users', { cache: 'no-store' }).then((response) => response.json()).then((payload) => setUsers(payload.data ?? [])).catch(() => setMessage('Gagal memuat staff'))
  useEffect(() => { void loadUsers() }, [])

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const response = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emailAddress: email, role }) })
    const payload = await response.json()
    setMessage(response.ok ? `Undangan dikirim ke ${email}` : payload.error ?? 'Undangan gagal dikirim')
    if (response.ok) setEmail('')
  }

  async function changeRole(userId: string, nextRole: string) {
    const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role: nextRole }) })
    if (response.ok) await loadUsers()
    else setMessage('Role gagal diperbarui')
  }

  return <AdminLayout><div className="space-y-6"><PageHeader title="Staff & Akses" breadcrumb={[]} /><form onSubmit={invite} className="flex max-w-3xl flex-col gap-3 rounded-xl border border-border bg-surface/50 p-6 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-medium">Email pengguna<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="pengguna@salon.com" /></label><label className="text-sm font-medium">Role<select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 rounded-lg border border-border bg-background px-3 py-2"><option value="admin">Admin</option><option value="karyawan">Karyawan</option><option value="member">Member</option></select></label><button className="rounded-lg bg-primary px-4 py-2 font-semibold text-white">Kirim undangan</button></form>{message && <p className="text-sm text-text-muted">{message}</p>}<div className="overflow-x-auto rounded-xl border border-border bg-surface/50"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border text-text-muted"><th className="p-4">Nama</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Aksi</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-border"><td className="p-4">{user.name}</td><td className="p-4">{user.email}</td><td className="p-4 capitalize">{user.role}</td><td className="p-4"><select value={user.role} onChange={(event) => void changeRole(user.id, event.target.value)} className="rounded border border-border bg-background px-2 py-1"><option value="admin">Admin</option><option value="karyawan">Karyawan</option><option value="member">Member</option></select></td></tr>)}</tbody></table></div></div></AdminLayout>
}
