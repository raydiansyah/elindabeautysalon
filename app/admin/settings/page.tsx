/**
 * Module: Admin settings page
 * Purpose: Manage salon identity, contact details, branding, theme, and SEO metadata.
 * Used by: /admin/settings route through AdminLayout.
 * Dependencies: React state, AdminLayout, settings API, R2 presigned upload API.
 * Public functions: AdminSettings().
 * Side effects: Reads and saves settings through HTTP requests.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import AdminNotice from '@/components/admin/AdminNotice'

type Settings = {
  salonName: string
  address: string
  whatsapp: string
  openingHours: string
  logoUrl: string
  heroImageUrl: string
  aboutImageUrl: string
  theme: string
  seoTitle: string
  seoDescription: string
}

const initialSettings: Settings = {
  salonName: '', address: '', whatsapp: '', openingHours: '09:00-21:00', logoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&q=85&fit=crop',
  aboutImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop',
  theme: 'cream', seoTitle: '', seoDescription: '',
}

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>(initialSettings)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'logoUrl' | 'heroImageUrl' | 'aboutImageUrl' | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((response) => response.json())
      .then((payload) => {
        const incoming = payload.data ?? {}
        setForm({
          ...initialSettings,
          ...incoming,
          salonName: typeof incoming.salonName === 'string' ? incoming.salonName : initialSettings.salonName,
          whatsapp: typeof incoming.whatsapp === 'string' ? incoming.whatsapp : initialSettings.whatsapp,
          openingHours: typeof incoming.openingHours === 'string' ? incoming.openingHours : initialSettings.openingHours,
          logoUrl: typeof incoming.logoUrl === 'string' ? incoming.logoUrl : initialSettings.logoUrl,
          heroImageUrl: typeof incoming.heroImageUrl === 'string' ? incoming.heroImageUrl : initialSettings.heroImageUrl,
          aboutImageUrl: typeof incoming.aboutImageUrl === 'string' ? incoming.aboutImageUrl : initialSettings.aboutImageUrl,
          theme: typeof incoming.theme === 'string' ? incoming.theme : initialSettings.theme,
          seoTitle: typeof incoming.seoTitle === 'string' ? incoming.seoTitle : initialSettings.seoTitle,
          seoDescription: typeof incoming.seoDescription === 'string' ? incoming.seoDescription : initialSettings.seoDescription,
          address: typeof incoming.address === 'string' ? incoming.address : initialSettings.address,
        })
      })
      .catch(() => setMessage('Gagal memuat pengaturan'))
  }, [])

  function updateField(field: keyof Settings, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function uploadImage(field: 'logoUrl' | 'heroImageUrl' | 'aboutImageUrl', file: File) {
    setUploading(field)
    setMessage('')
    try {
      const purpose = field === 'heroImageUrl' ? 'hero' : field === 'aboutImageUrl' ? 'about' : 'logo'
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('purpose', purpose)
      const uploadResponse = await fetch('/api/uploads', { method: 'POST', body: uploadForm })
      const uploadPayload = await uploadResponse.json()
      if (!uploadResponse.ok) throw new Error(uploadPayload.error?.message ?? 'Gagal mengunggah gambar ke R2')
      updateField(field, uploadPayload.data.publicUrl)
      setMessage('Gambar berhasil diunggah. Klik simpan untuk menerapkannya.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengunggah gambar')
    } finally { setUploading(null) }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const settingsPayload = Object.fromEntries((['salonName', 'address', 'whatsapp', 'openingHours', 'logoUrl', 'heroImageUrl', 'aboutImageUrl', 'theme', 'seoTitle', 'seoDescription'] as const).map((field) => [field, typeof form[field] === 'string' ? form[field].trim() : '']))
      const response = await fetch('/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsPayload),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error?.message ?? 'Pengaturan gagal disimpan')
      setMessage('Pengaturan berhasil disimpan')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Pengaturan gagal disimpan') } finally { setSaving(false) }
  }

  return (
    <AdminLayout>
      <div className="min-w-0 space-y-6">
        <PageHeader title="Pengaturan" breadcrumb={[]} />
        <AdminNotice message={message} />
        <form onSubmit={handleSubmit} className="w-full max-w-3xl min-w-0 space-y-6 overflow-hidden rounded-xl border border-border bg-surface/50 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {([['salonName', 'Nama salon'], ['whatsapp', 'WhatsApp'], ['logoUrl', 'URL logo'], ['heroImageUrl', 'Gambar hero'], ['aboutImageUrl', 'Gambar tentang'], ['theme', 'Tema']] as const).map(([field, label]) => (
              <label key={field} className="min-w-0 space-y-2 text-sm font-medium">{label}
                {field === 'logoUrl' || field === 'heroImageUrl' || field === 'aboutImageUrl' ? <><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(field, file) }} className="block min-h-11 w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-background px-2 py-2 text-ellipsis whitespace-nowrap text-sm sm:px-3" /><span className="block max-w-full truncate text-xs text-text-muted">{uploading === field ? 'Mengunggah ke R2...' : form[field] || 'Belum ada gambar'}</span></> : <input value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-border bg-background px-3 py-2" />}
              </label>
            ))}
          </div>
          {([['address', 'Alamat'], ['openingHours', 'Jam buka'], ['seoTitle', 'SEO title'], ['seoDescription', 'SEO description']] as const).map(([field, label]) => (
            <label key={field} className="block min-w-0 space-y-2 text-sm font-medium">{label}
              <textarea value={form[field]} onChange={(event) => updateField(field, event.target.value)} placeholder={field === 'openingHours' ? '09:00-21:00' : undefined} rows={field === 'seoDescription' ? 3 : 2} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-border bg-background px-3 py-2" />
              {field === 'openingHours' && <span className="block text-xs font-normal text-text-muted">Format: HH:mm-HH:mm, contoh 09:00-21:00</span>}
            </label>
          ))}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan pengaturan'}</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
