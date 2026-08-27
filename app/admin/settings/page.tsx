/**
 * Module: Admin settings page
 * Purpose: Manage salon identity, contact details, social embeds, branding, theme, and SEO metadata.
 * Used by: /admin/settings route through AdminLayout.
 * Dependencies: React state, AdminLayout, settings API, R2 presigned upload API.
 * Public functions: AdminSettings().
 * Side effects: Reads and saves settings through HTTP requests.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Eye, X } from 'lucide-react'
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
  aboutTitle: string
  aboutHighlight: string
  aboutDescription: string
  aboutStat1Value: string
  aboutStat1Label: string
  aboutStat2Value: string
  aboutStat2Label: string
  aboutStat3Value: string
  aboutStat3Label: string
  aboutStat4Value: string
  aboutStat4Label: string
  instagramUrl: string
  instagramPostUrl: string
  tiktokUrl: string
  tiktokVideoUrl: string
  theme: string
  seoTitle: string
  seoDescription: string
}

const initialSettings: Settings = {
  salonName: '', address: '', whatsapp: '', openingHours: '09:00-21:00', logoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&q=85&fit=crop',
  aboutImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop',
  aboutTitle: 'Tentang', aboutHighlight: 'Beauty Salon Elin',
  aboutDescription: 'Salon kecantikan profesional dengan pengalaman dan tim stylist terlatih untuk membuat Anda tampil cantik dan percaya diri.',
  aboutStat1Value: '10+', aboutStat1Label: 'Tahun Pengalaman', aboutStat2Value: '5000+', aboutStat2Label: 'Klien Puas',
  aboutStat3Value: '15+', aboutStat3Label: 'Stylist Ahli', aboutStat4Value: '20+', aboutStat4Label: 'Penghargaan',
  instagramUrl: 'https://instagram.com/elyndbeauty', instagramPostUrl: '',
  tiktokUrl: 'https://tiktok.com/@elyndbeauty', tiktokVideoUrl: '',
  theme: 'cream', seoTitle: '', seoDescription: '',
}

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>(initialSettings)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<{ url: string; label: string } | null>(null)
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
          aboutTitle: typeof incoming.aboutTitle === 'string' ? incoming.aboutTitle : initialSettings.aboutTitle,
          aboutHighlight: typeof incoming.aboutHighlight === 'string' ? incoming.aboutHighlight : initialSettings.aboutHighlight,
          aboutDescription: typeof incoming.aboutDescription === 'string' ? incoming.aboutDescription : initialSettings.aboutDescription,
          aboutStat1Value: typeof incoming.aboutStat1Value === 'string' ? incoming.aboutStat1Value : initialSettings.aboutStat1Value,
          aboutStat1Label: typeof incoming.aboutStat1Label === 'string' ? incoming.aboutStat1Label : initialSettings.aboutStat1Label,
          aboutStat2Value: typeof incoming.aboutStat2Value === 'string' ? incoming.aboutStat2Value : initialSettings.aboutStat2Value,
          aboutStat2Label: typeof incoming.aboutStat2Label === 'string' ? incoming.aboutStat2Label : initialSettings.aboutStat2Label,
          aboutStat3Value: typeof incoming.aboutStat3Value === 'string' ? incoming.aboutStat3Value : initialSettings.aboutStat3Value,
          aboutStat3Label: typeof incoming.aboutStat3Label === 'string' ? incoming.aboutStat3Label : initialSettings.aboutStat3Label,
          aboutStat4Value: typeof incoming.aboutStat4Value === 'string' ? incoming.aboutStat4Value : initialSettings.aboutStat4Value,
          aboutStat4Label: typeof incoming.aboutStat4Label === 'string' ? incoming.aboutStat4Label : initialSettings.aboutStat4Label,
          instagramUrl: typeof incoming.instagramUrl === 'string' ? incoming.instagramUrl : initialSettings.instagramUrl,
          instagramPostUrl: typeof incoming.instagramPostUrl === 'string' ? incoming.instagramPostUrl : initialSettings.instagramPostUrl,
          tiktokUrl: typeof incoming.tiktokUrl === 'string' ? incoming.tiktokUrl : initialSettings.tiktokUrl,
          tiktokVideoUrl: typeof incoming.tiktokVideoUrl === 'string' ? incoming.tiktokVideoUrl : initialSettings.tiktokVideoUrl,
          theme: typeof incoming.theme === 'string' ? incoming.theme : initialSettings.theme,
          seoTitle: typeof incoming.seoTitle === 'string' ? incoming.seoTitle : initialSettings.seoTitle,
          seoDescription: typeof incoming.seoDescription === 'string' ? incoming.seoDescription : initialSettings.seoDescription,
          address: typeof incoming.address === 'string' ? incoming.address : initialSettings.address,
        })
      })
      .catch(() => setMessage('Gagal memuat pengaturan'))
  }, [])

  useEffect(() => {
    if (!preview) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setPreview(null) }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [preview])

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
      const settingsPayload = Object.fromEntries((['salonName', 'address', 'whatsapp', 'openingHours', 'logoUrl', 'heroImageUrl', 'aboutImageUrl', 'aboutTitle', 'aboutHighlight', 'aboutDescription', 'aboutStat1Value', 'aboutStat1Label', 'aboutStat2Value', 'aboutStat2Label', 'aboutStat3Value', 'aboutStat3Label', 'aboutStat4Value', 'aboutStat4Label', 'instagramUrl', 'instagramPostUrl', 'tiktokUrl', 'tiktokVideoUrl', 'theme', 'seoTitle', 'seoDescription'] as const).map((field) => [field, typeof form[field] === 'string' ? form[field].trim() : '']))
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
            {([['salonName', 'Nama salon'], ['whatsapp', 'WhatsApp'], ['logoUrl', 'URL logo'], ['heroImageUrl', 'Gambar hero'], ['aboutImageUrl', 'Gambar tentang'], ['instagramUrl', 'Profil Instagram'], ['instagramPostUrl', 'Post/Reel Instagram'], ['tiktokUrl', 'Profil TikTok'], ['tiktokVideoUrl', 'Video TikTok'], ['theme', 'Tema']] as const).map(([field, label]) => (
              <label key={field} className="min-w-0 space-y-2 text-sm font-medium">{label}
                {field === 'logoUrl' || field === 'heroImageUrl' || field === 'aboutImageUrl' ? <><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(field, file) }} className="block min-h-11 w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-background px-2 py-2 text-ellipsis whitespace-nowrap text-sm sm:px-3" /><div className="flex min-w-0 items-center justify-between gap-3"><span className="min-w-0 truncate text-xs font-normal text-text-muted">{uploading === field ? 'Mengunggah ke R2...' : form[field] || 'Belum ada gambar'}</span>{form[field] && <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setPreview({ url: form[field], label }) }} className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md border border-border px-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10" aria-label={`Lihat ${label}`}><Eye className="h-3.5 w-3.5" />Lihat</button>}</div></> : <input value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-border bg-background px-3 py-2" />}
              </label>
            ))}
          </div>
          <fieldset className="space-y-4 rounded-lg border border-border p-4 sm:p-5"><legend className="px-1 text-sm font-semibold">Konten About</legend><div className="grid gap-4 sm:grid-cols-2">{([['aboutTitle', 'Judul About'], ['aboutHighlight', 'Highlight judul'], ['aboutStat1Value', 'Statistik 1 nilai'], ['aboutStat1Label', 'Statistik 1 label'], ['aboutStat2Value', 'Statistik 2 nilai'], ['aboutStat2Label', 'Statistik 2 label'], ['aboutStat3Value', 'Statistik 3 nilai'], ['aboutStat3Label', 'Statistik 3 label'], ['aboutStat4Value', 'Statistik 4 nilai'], ['aboutStat4Label', 'Statistik 4 label']] as const).map(([field, label]) => <label key={field} className="min-w-0 space-y-2 text-sm font-medium">{label}<input value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="min-h-11 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2" /></label>)}</div><label className="block space-y-2 text-sm font-medium">Deskripsi About<textarea value={form.aboutDescription} onChange={(event) => updateField('aboutDescription', event.target.value)} rows={4} className="min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2" /></label></fieldset>
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
        {preview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreview(null) }}><div role="dialog" aria-modal="true" aria-label={`Preview ${preview.label}`} className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"><div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-5"><h2 className="truncate font-semibold">Preview {preview.label}</h2><button type="button" onClick={() => setPreview(null)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-background hover:text-foreground" aria-label="Tutup preview"><X className="h-5 w-5" /></button></div><div className="flex min-h-0 flex-1 items-center justify-center bg-background p-3 sm:p-6"><img src={preview.url} alt={`Preview ${preview.label}`} className="max-h-[calc(90vh-7rem)] w-auto max-w-full rounded-lg object-contain" /></div></div></div>}
      </div>
    </AdminLayout>
  )
}
