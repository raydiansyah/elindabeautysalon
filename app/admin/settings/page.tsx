/**
 * Module: Admin settings page
 * Purpose: Manage salon identity, contact details, branding, theme, and SEO metadata.
 * Used by: /admin/settings route through AdminLayout.
 * Dependencies: React state, AdminLayout, settings API.
 * Public functions: AdminSettings().
 * Side effects: Reads and saves settings through HTTP requests.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'

type Settings = {
  salonName: string
  address: string
  whatsapp: string
  openingHours: string
  logoUrl: string
  theme: string
  seoTitle: string
  seoDescription: string
}

const initialSettings: Settings = {
  salonName: '', address: '', whatsapp: '', openingHours: '', logoUrl: '',
  theme: 'cream', seoTitle: '', seoDescription: '',
}

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>(initialSettings)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((response) => response.json())
      .then((payload) => setForm({ ...initialSettings, ...(payload.data ?? {}) }))
      .catch(() => setMessage('Gagal memuat pengaturan'))
  }, [])

  function updateField(field: keyof Settings, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('save failed')
      setMessage('Pengaturan berhasil disimpan')
    } catch { setMessage('Pengaturan gagal disimpan') } finally { setSaving(false) }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Pengaturan" breadcrumb={[]} />
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 rounded-xl border border-border bg-surface/50 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {([['salonName', 'Nama salon'], ['whatsapp', 'WhatsApp'], ['logoUrl', 'URL logo'], ['theme', 'Tema']] as const).map(([field, label]) => (
              <label key={field} className="space-y-2 text-sm font-medium">{label}
                <input value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
              </label>
            ))}
          </div>
          {([['address', 'Alamat'], ['openingHours', 'Jam buka'], ['seoTitle', 'SEO title'], ['seoDescription', 'SEO description']] as const).map(([field, label]) => (
            <label key={field} className="block space-y-2 text-sm font-medium">{label}
              <textarea value={form[field]} onChange={(event) => updateField(field, event.target.value)} rows={field === 'seoDescription' ? 3 : 2} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </label>
          ))}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan pengaturan'}</button>
            {message && <p className="text-sm text-text-muted">{message}</p>}
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
