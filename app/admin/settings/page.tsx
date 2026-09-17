/**
 * Module: Admin settings page
 * Purpose: Manage salon identity, contact details, social embeds, branding, theme, and SEO metadata.
 * Used by: /admin/settings route through AdminLayout.
 * Dependencies: React state, AdminLayout, settings API, R2 presigned upload API.
 * Public functions: AdminSettings().
 * Side effects: Reads and saves settings through HTTP requests.
 */
'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  Store,
  Image as ImageIcon,
  BookOpen,
  Share2,
  Search,
  Upload,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'

/* ─────────────────────────────────────────── types ── */
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
  salonName: '',
  address: '',
  whatsapp: '',
  openingHours: '09:00-21:00',
  logoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&q=85&fit=crop',
  aboutImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop',
  aboutTitle: 'Tentang',
  aboutHighlight: 'Beauty Salon Elin',
  aboutDescription:
    'Salon kecantikan profesional dengan pengalaman dan tim stylist terlatih untuk membuat Anda tampil cantik dan percaya diri.',
  aboutStat1Value: '10+',
  aboutStat1Label: 'Tahun Pengalaman',
  aboutStat2Value: '5000+',
  aboutStat2Label: 'Klien Puas',
  aboutStat3Value: '15+',
  aboutStat3Label: 'Stylist Ahli',
  aboutStat4Value: '20+',
  aboutStat4Label: 'Penghargaan',
  instagramUrl: 'https://instagram.com/elyndbeauty',
  instagramPostUrl: '',
  tiktokUrl: 'https://tiktok.com/@elyndbeauty',
  tiktokVideoUrl: '',
  theme: 'cream',
  seoTitle: '',
  seoDescription: '',
}

type TabId = 'identity' | 'branding' | 'about' | 'social' | 'seo'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'identity', label: 'Identitas', icon: <Store className="h-4 w-4" /> },
  { id: 'branding', label: 'Branding', icon: <ImageIcon className="h-4 w-4" /> },
  { id: 'about', label: 'Konten', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'social', label: 'Sosial', icon: <Share2 className="h-4 w-4" /> },
  { id: 'seo', label: 'SEO', icon: <Search className="h-4 w-4" /> },
]

/* ─────────────────────────────── sub-components ── */

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#d9b978]/10 bg-[#120d09]/80 p-5 sm:p-6">
      <div className="mb-5 border-b border-[#d9b978]/10 pb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-white/40">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">{label}</label>
      {children}
      {hint && <p className="text-xs text-white/30">{hint}</p>}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 text-sm text-white placeholder:text-white/20 transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20"
    />
  )
}

function TextareaInput({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 py-2.5 text-sm text-white placeholder:text-white/20 transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20 resize-none"
    />
  )
}

function ImageUploader({
  label,
  currentUrl,
  uploading,
  onFile,
  onPreview,
}: {
  label: string
  currentUrl: string
  uploading: boolean
  onFile: (file: File) => void
  onPreview: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      {/* Thumbnail + actions */}
      <div className="flex items-start gap-3">
        <div
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2e2416] bg-[#1a1208]"
          style={{ minWidth: '4rem' }}
        >
          {currentUrl ? (
            <img src={currentUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-white/20" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="h-4 w-4 animate-spin text-[#d9b978]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-xs text-white/30">
            {uploading ? 'Mengunggah…' : currentUrl || 'Belum ada gambar'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9b978]/20 bg-[#d9b978]/10 px-3 py-1.5 text-xs font-semibold text-[#d9b978] transition-all hover:bg-[#d9b978]/20 disabled:opacity-40"
            >
              <Upload className="h-3 w-3" />
              {uploading ? 'Mengunggah…' : 'Unggah gambar'}
            </button>
            {currentUrl && (
              <button
                type="button"
                onClick={onPreview}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition-all hover:bg-white/10"
              >
                <Eye className="h-3 w-3" />
                Lihat
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ─────────────────────────────── main page ── */

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>(initialSettings)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<{ url: string; label: string } | null>(null)
  const [uploading, setUploading] = useState<'logoUrl' | 'heroImageUrl' | 'aboutImageUrl' | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('identity')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((payload) => {
        const inc = payload.data ?? {}
        setForm((prev) =>
          Object.fromEntries(
            Object.keys(prev).map((k) => [k, typeof inc[k] === 'string' ? inc[k] : prev[k as keyof Settings]])
          ) as Settings
        )
      })
      .catch(() => setMessage({ text: 'Gagal memuat pengaturan', type: 'error' }))
  }, [])

  useEffect(() => {
    if (!preview) return
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreview(null) }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [preview])

  function updateField(field: keyof Settings, value: string) {
    setForm((c) => ({ ...c, [field]: value }))
  }

  async function uploadImage(field: 'logoUrl' | 'heroImageUrl' | 'aboutImageUrl', file: File) {
    setUploading(field)
    setMessage(null)
    try {
      const purpose = field === 'heroImageUrl' ? 'hero' : field === 'aboutImageUrl' ? 'about' : 'logo'
      const fd = new FormData()
      fd.append('file', file)
      fd.append('purpose', purpose)
      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error?.message ?? 'Gagal mengunggah gambar ke R2')
      updateField(field, payload.data.publicUrl)
      setMessage({ text: 'Gambar berhasil diunggah. Klik simpan untuk menerapkan.', type: 'success' })
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Gagal mengunggah gambar', type: 'error' })
    } finally {
      setUploading(null)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const fields = [
        'salonName', 'address', 'whatsapp', 'openingHours',
        'logoUrl', 'heroImageUrl', 'aboutImageUrl',
        'aboutTitle', 'aboutHighlight', 'aboutDescription',
        'aboutStat1Value', 'aboutStat1Label', 'aboutStat2Value', 'aboutStat2Label',
        'aboutStat3Value', 'aboutStat3Label', 'aboutStat4Value', 'aboutStat4Label',
        'instagramUrl', 'instagramPostUrl', 'tiktokUrl', 'tiktokVideoUrl',
        'theme', 'seoTitle', 'seoDescription',
      ] as const
      const body = Object.fromEntries(fields.map((f) => [f, (form[f] ?? '').trim()]))
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error?.message ?? 'Pengaturan gagal disimpan')
      setMessage({ text: 'Pengaturan berhasil disimpan', type: 'success' })
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Pengaturan gagal disimpan', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  /* ── stats pairs ── */
  const statPairs = [
    { valKey: 'aboutStat1Value', lblKey: 'aboutStat1Label', n: 1 },
    { valKey: 'aboutStat2Value', lblKey: 'aboutStat2Label', n: 2 },
    { valKey: 'aboutStat3Value', lblKey: 'aboutStat3Label', n: 3 },
    { valKey: 'aboutStat4Value', lblKey: 'aboutStat4Label', n: 4 },
  ] as const

  return (
    <AdminLayout>
      <div className="min-w-0 space-y-6">
        <PageHeader title="Pengaturan" breadcrumb={[]} />

        {/* ── Notice ── */}
        {message && (
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/20 bg-red-500/10 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="ml-auto shrink-0 opacity-60 hover:opacity-100"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Tabs ── */}
          <div className="flex flex-wrap gap-1 rounded-xl border border-[#d9b978]/10 bg-[#120d09]/60 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#d9b978] text-[#0d0a08] shadow-[0_0_12px_rgba(217,185,120,0.2)]'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ════════════ TAB: IDENTITY ════════════ */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <SectionCard title="Informasi Dasar" description="Nama, kontak, dan jam operasional salon">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nama Salon">
                    <TextInput value={form.salonName} onChange={(v) => updateField('salonName', v)} placeholder="Beauty Salon Elin" />
                  </Field>
                  <Field label="Nomor WhatsApp" hint="Format: 628xxxxx (tanpa + atau spasi)">
                    <TextInput value={form.whatsapp} onChange={(v) => updateField('whatsapp', v)} placeholder="6281234567890" />
                  </Field>
                  <Field label="Jam Buka" hint="Format: HH:mm-HH:mm · Contoh: 09:00-21:00">
                    <TextInput value={form.openingHours} onChange={(v) => updateField('openingHours', v)} placeholder="09:00-21:00" />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Alamat Lengkap">
                    <TextareaInput value={form.address} onChange={(v) => updateField('address', v)} rows={3} placeholder="Jl. Contoh No. 1, Kota, Provinsi" />
                  </Field>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════════════ TAB: BRANDING ════════════ */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <SectionCard title="Logo & Gambar Utama" description="Aset visual yang tampil di seluruh halaman landing">
                <div className="space-y-6">
                  <Field label="Logo Salon">
                    <ImageUploader
                      label="Logo"
                      currentUrl={form.logoUrl}
                      uploading={uploading === 'logoUrl'}
                      onFile={(file) => void uploadImage('logoUrl', file)}
                      onPreview={() => setPreview({ url: form.logoUrl, label: 'Logo Salon' })}
                    />
                  </Field>

                  <div className="h-px bg-[#d9b978]/5" />

                  <Field label="Gambar Hero (Banner Utama)" hint="Gambar lebar yang tampil di bagian atas landing page">
                    <ImageUploader
                      label="Hero"
                      currentUrl={form.heroImageUrl}
                      uploading={uploading === 'heroImageUrl'}
                      onFile={(file) => void uploadImage('heroImageUrl', file)}
                      onPreview={() => setPreview({ url: form.heroImageUrl, label: 'Gambar Hero' })}
                    />
                  </Field>

                  <div className="h-px bg-[#d9b978]/5" />

                  <Field label="Gambar Tentang Kami" hint="Gambar kotak yang tampil di bagian About">
                    <ImageUploader
                      label="About"
                      currentUrl={form.aboutImageUrl}
                      uploading={uploading === 'aboutImageUrl'}
                      onFile={(file) => void uploadImage('aboutImageUrl', file)}
                      onPreview={() => setPreview({ url: form.aboutImageUrl, label: 'Gambar About' })}
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Tema Warna" description="Skema warna landing page">
                <Field label="Tema">
                  <select
                    value={form.theme}
                    onChange={(e) => updateField('theme', e.target.value)}
                    className="h-10 w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 text-sm text-white transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20"
                  >
                    <option value="cream">Cream (Default)</option>
                    <option value="dark">Dark</option>
                    <option value="rose">Rose</option>
                  </select>
                </Field>
              </SectionCard>
            </div>
          )}

          {/* ════════════ TAB: ABOUT ════════════ */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <SectionCard title="Teks Tentang Kami" description="Teks yang tampil di bagian About pada landing">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Judul">
                    <TextInput value={form.aboutTitle} onChange={(v) => updateField('aboutTitle', v)} placeholder="Tentang" />
                  </Field>
                  <Field label="Highlight Judul" hint="Teks yang ditampilkan dengan warna aksen">
                    <TextInput value={form.aboutHighlight} onChange={(v) => updateField('aboutHighlight', v)} placeholder="Beauty Salon Elin" />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Deskripsi">
                    <TextareaInput
                      value={form.aboutDescription}
                      onChange={(v) => updateField('aboutDescription', v)}
                      rows={4}
                      placeholder="Ceritakan tentang salon Anda…"
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Statistik Pencapaian" description="Angka-angka yang tampil di bagian About">
                <div className="grid gap-4 sm:grid-cols-2">
                  {statPairs.map(({ valKey, lblKey, n }) => (
                    <div key={n} className="rounded-xl border border-[#2e2416] bg-[#1a1208]/50 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#d9b978]/60">Statistik {n}</p>
                      <Field label="Nilai">
                        <TextInput
                          value={form[valKey]}
                          onChange={(v) => updateField(valKey, v)}
                          placeholder="10+"
                        />
                      </Field>
                      <Field label="Label">
                        <TextInput
                          value={form[lblKey]}
                          onChange={(v) => updateField(lblKey, v)}
                          placeholder="Tahun Pengalaman"
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════════════ TAB: SOCIAL ════════════ */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <SectionCard
                title="Instagram"
                description="URL profil dan embed post/reel untuk landing page"
              >
                <div className="space-y-4">
                  <Field label="URL Profil Instagram">
                    <TextInput
                      value={form.instagramUrl}
                      onChange={(v) => updateField('instagramUrl', v)}
                      placeholder="https://instagram.com/elyndbeauty"
                    />
                  </Field>
                  <Field label="URL Post / Reel (Embed)" hint="URL lengkap post atau reel yang akan di-embed di landing">
                    <TextInput
                      value={form.instagramPostUrl}
                      onChange={(v) => updateField('instagramPostUrl', v)}
                      placeholder="https://www.instagram.com/p/xxxxx/"
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard
                title="TikTok"
                description="URL profil dan embed video untuk landing page"
              >
                <div className="space-y-4">
                  <Field label="URL Profil TikTok">
                    <TextInput
                      value={form.tiktokUrl}
                      onChange={(v) => updateField('tiktokUrl', v)}
                      placeholder="https://tiktok.com/@elyndbeauty"
                    />
                  </Field>
                  <Field label="URL Video (Embed)" hint="URL lengkap video TikTok yang akan di-embed di landing">
                    <TextInput
                      value={form.tiktokVideoUrl}
                      onChange={(v) => updateField('tiktokVideoUrl', v)}
                      placeholder="https://www.tiktok.com/@user/video/xxxxx"
                    />
                  </Field>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════════════ TAB: SEO ════════════ */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <SectionCard title="Metadata SEO" description="Judul dan deskripsi yang muncul di hasil pencarian Google">
                <div className="space-y-4">
                  <Field label="SEO Title" hint="Maksimal 60 karakter yang ideal">
                    <TextInput
                      value={form.seoTitle}
                      onChange={(v) => updateField('seoTitle', v)}
                      placeholder="Beauty Salon Elin – Cantik & Percaya Diri"
                    />
                    <p className="mt-1 text-right text-xs text-white/30">{form.seoTitle.length} / 60</p>
                  </Field>
                  <Field label="SEO Description" hint="Maksimal 160 karakter yang ideal">
                    <TextareaInput
                      value={form.seoDescription}
                      onChange={(v) => updateField('seoDescription', v)}
                      rows={4}
                      placeholder="Salon kecantikan profesional di…"
                    />
                    <p className="mt-1 text-right text-xs text-white/30">{form.seoDescription.length} / 160</p>
                  </Field>
                </div>

                {/* SERP Preview */}
                {(form.seoTitle || form.seoDescription) && (
                  <div className="mt-5 rounded-xl border border-[#2e2416] bg-[#0d0a08] p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">Preview Google</p>
                    <p className="text-sm font-medium text-[#4a90d9]">{form.seoTitle || 'Judul halaman'}</p>
                    <p className="mt-0.5 text-xs text-[#3c8c3c]">https://yourdomain.com</p>
                    <p className="mt-1 text-xs text-white/50 leading-relaxed">{form.seoDescription || 'Deskripsi halaman…'}</p>
                  </div>
                )}
              </SectionCard>
            </div>
          )}

          {/* ── Save button ── */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving || uploading !== null}
              className="inline-flex items-center gap-2 rounded-xl bg-[#d9b978] px-6 py-2.5 text-sm font-semibold text-[#0d0a08] shadow-[0_0_20px_rgba(217,185,120,0.2)] transition-all hover:bg-[#c9a968] hover:shadow-[0_0_28px_rgba(217,185,120,0.3)] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Pengaturan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Image preview modal ── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setPreview(null) }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Preview ${preview.label}`}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#d9b978]/15 bg-[#120d09] shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#d9b978]/10 px-5 py-4">
              <h2 className="truncate text-sm font-semibold text-white">Preview — {preview.label}</h2>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Tutup preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center bg-[#0d0a08] p-4 sm:p-8">
              <img
                src={preview.url}
                alt={`Preview ${preview.label}`}
                className="max-h-[calc(90vh-5rem)] w-auto max-w-full rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
