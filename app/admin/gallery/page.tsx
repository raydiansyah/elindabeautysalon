/**
 * Module: Admin Gallery & Before/After Management
 * Purpose: Manage portfolio gallery and interactive Before & After transformation showcases.
 * Used by: Authenticated admin route at /admin/gallery.
 * Dependencies: React, AdminLayout, PageHeader, AdminNotice, gallery API, R2 upload API, Lucide icons.
 * Public functions: AdminGallery().
 * Side effects: Performs authenticated browser fetches to create/update/delete gallery records.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Edit, Image as ImageIcon, Plus, Save, Trash2, X, Sparkles, ArrowRight, Upload } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import AdminNotice from '@/components/admin/AdminNotice'

export type GalleryItem = {
  id: number
  imageUrl: string
  title: string
  category: string
  order: number
  beforeAfter: boolean
  beforeImageUrl?: string | null
  description?: string | null
}

type GalleryForm = {
  imageUrl: string
  title: string
  category: string
  order: number
  beforeAfter: boolean
  beforeImageUrl: string
  description: string
}

const emptyForm: GalleryForm = {
  imageUrl: '',
  title: '',
  category: 'Hair',
  order: 1,
  beforeAfter: false,
  beforeImageUrl: '',
  description: '',
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'before_after'>('before_after')
  const [form, setForm] = useState<GalleryForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingTarget, setUploadingTarget] = useState<'after' | 'before' | null>(null)
  const [message, setMessage] = useState('')

  async function loadGallery() {
    setLoading(true)
    try {
      const response = await fetch('/api/gallery', { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error?.message ?? 'Gagal memuat galeri')
      setItems(payload.data ?? [])
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal memuat galeri')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [])

  function startCreate(isBeforeAfter: boolean) {
    setEditingId(0)
    setForm({
      ...emptyForm,
      beforeAfter: isBeforeAfter,
      category: isBeforeAfter ? 'Hair Coloring' : 'Hair',
      order: items.length + 1,
    })
    setMessage('')
  }

  function startEdit(item: GalleryItem) {
    setEditingId(item.id)
    setForm({
      imageUrl: item.imageUrl,
      title: item.title,
      category: item.category,
      order: item.order,
      beforeAfter: item.beforeAfter,
      beforeImageUrl: item.beforeImageUrl || '',
      description: item.description || '',
    })
    setMessage('')
  }

  async function uploadImage(file: File, target: 'after' | 'before') {
    setUploadingTarget(target)
    setMessage('')
    try {
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('purpose', 'gallery')
      const uploadResponse = await fetch('/api/uploads', { method: 'POST', body: uploadForm })
      const uploadPayload = await uploadResponse.json()
      if (!uploadResponse.ok) throw new Error(uploadPayload.error?.message ?? 'Gagal mengunggah gambar')
      
      const publicUrl = uploadPayload.data.publicUrl
      if (target === 'before') {
        setForm((current) => ({ ...current, beforeImageUrl: publicUrl }))
      } else {
        setForm((current) => ({ ...current, imageUrl: publicUrl }))
      }
      setMessage(`Foto ${target === 'before' ? 'Sebelum' : 'Sesudah'} berhasil diunggah.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengunggah gambar')
    } finally {
      setUploadingTarget(null)
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(editingId ? `/api/gallery/${editingId}` : '/api/gallery', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error?.message ?? 'Gagal menyimpan galeri')
      setEditingId(null)
      setForm(emptyForm)
      setMessage('Data galeri & transformasi berhasil disimpan!')
      await loadGallery()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menyimpan galeri')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) return
    const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    if (response.ok) {
      setMessage('Item berhasil dihapus')
      await loadGallery()
    } else {
      setMessage('Gagal menghapus item')
    }
  }

  const beforeAfterItems = items.filter((item) => item.beforeAfter)
  const regularItems = items.filter((item) => !item.beforeAfter)
  const visibleItems = activeTab === 'before_after' ? beforeAfterItems : regularItems

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Kelola Galeri & Before-After"
          breadcrumb={[{ label: 'Galeri & Portofolio' }]}
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('before_after')
                  startCreate(true)
                }}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-gold px-4 py-2 text-xs sm:text-sm font-semibold text-elin-ink shadow-md shadow-accent-gold/20 hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" />
                <span>+ Tambah Before & After</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all')
                  startCreate(false)
                }}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-surface px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-surface-light"
              >
                <Plus className="h-4 w-4" />
                <span>+ Tambah Foto Biasa</span>
              </button>
            </div>
          }
        />

        <AdminNotice message={message} />

        {/* Tab Switcher */}
        <div className="flex border-b border-border gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('before_after')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'before_after'
                ? 'border-accent-gold text-accent-gold'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Transformasi Before & After ({beforeAfterItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-accent-gold text-accent-gold'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Galeri & Portofolio Biasa ({regularItems.length})</span>
          </button>
        </div>

        {/* Form Modal / Inline Editor */}
        {editingId !== null && (
          <form
            onSubmit={save}
            className="rounded-2xl border border-accent-gold/40 bg-surface/80 p-6 shadow-2xl backdrop-blur-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                {form.beforeAfter ? <Sparkles className="h-5 w-5 text-accent-gold" /> : <ImageIcon className="h-5 w-5 text-accent-gold" />}
                <span>
                  {editingId === 0
                    ? form.beforeAfter
                      ? 'Tambah Transformasi Before & After Baru'
                      : 'Tambah Foto Galeri Baru'
                    : 'Edit Item Galeri'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-text-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* If Before & After is active, show dual photo upload */}
            {form.beforeAfter ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {/* BEFORE Image Upload */}
                <div className="space-y-2 rounded-xl border border-dashed border-white/20 bg-background/50 p-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-light flex items-center justify-between">
                    <span>1. Foto Kondisi SEBELUM (Before)</span>
                    <span className="text-accent-gold text-[11px]">*Wajib</span>
                  </label>
                  <input
                    required={editingId === 0 && !form.beforeImageUrl}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingTarget !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void uploadImage(file, 'before')
                    }}
                    className="w-full text-xs text-text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                  />
                  {form.beforeImageUrl ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 mt-2">
                      <img src={form.beforeImageUrl} alt="Preview Before" className="h-full w-full object-cover" />
                      <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
                        SEBELUM
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-text-muted pt-2 flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      <span>{uploadingTarget === 'before' ? 'Mengunggah ke R2...' : 'Pilih file foto kondisi sebelum perawatan'}</span>
                    </p>
                  )}
                </div>

                {/* AFTER Image Upload */}
                <div className="space-y-2 rounded-xl border border-dashed border-accent-gold/40 bg-background/50 p-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-accent-gold flex items-center justify-between">
                    <span>2. Foto Hasil SESUDAH (After)</span>
                    <span className="text-accent-gold text-[11px]">*Wajib</span>
                  </label>
                  <input
                    required={editingId === 0 && !form.imageUrl}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingTarget !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void uploadImage(file, 'after')
                    }}
                    className="w-full text-xs text-text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent-gold file:text-elin-ink hover:file:brightness-110 cursor-pointer"
                  />
                  {form.imageUrl ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-accent-gold/30 mt-2">
                      <img src={form.imageUrl} alt="Preview After" className="h-full w-full object-cover" />
                      <span className="absolute right-2 top-2 rounded bg-accent-gold px-2 py-0.5 text-[10px] font-bold text-elin-ink">
                        SESUDAH
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-text-muted pt-2 flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      <span>{uploadingTarget === 'after' ? 'Mengunggah ke R2...' : 'Pilih file foto hasil sesudah perawatan'}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Single Image Upload for Regular Gallery */
              <div className="space-y-2 rounded-xl border border-dashed border-white/20 bg-background/50 p-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-light">
                  File Foto Portofolio
                </label>
                <input
                  required={editingId === 0 && !form.imageUrl}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploadingTarget !== null}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void uploadImage(file, 'after')
                  }}
                  className="w-full text-xs text-text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                />
                {form.imageUrl && (
                  <div className="relative aspect-[16/9] max-w-sm overflow-hidden rounded-lg border border-white/10 mt-2">
                    <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* Metadata Fields */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-text-light mb-1">
                  Judul {form.beforeAfter ? 'Transformasi' : 'Karya'}
                </label>
                <input
                  required
                  placeholder={form.beforeAfter ? 'Contoh: Ash Blonde Balayage & Gloss Reset' : 'Contoh: Modern Bob Styling'}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-light mb-1">
                  Kategori
                </label>
                <input
                  required
                  placeholder="Contoh: Hair Coloring, Skincare, Nails"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold"
                />
              </div>

              {form.beforeAfter && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-text-light mb-1">
                    Deskripsi Perubahan (Muncul di slider landing page)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Transformasi dari warna pudar menjadi balayage dimensi halus dengan kilau berkilau."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold resize-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-text-light mb-1">
                  Urutan Tampilan
                </label>
                <input
                  required
                  min="0"
                  type="number"
                  placeholder="1"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-text-light hover:text-white hover:bg-surface-light"
              >
                <X className="h-4 w-4" />
                <span>Batal</span>
              </button>
              <button
                type="submit"
                disabled={saving || uploadingTarget !== null}
                className="flex items-center gap-2 rounded-xl bg-accent-gold px-6 py-2.5 text-xs font-bold text-elin-ink shadow-md shadow-accent-gold/20 hover:brightness-110 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Data'}</span>
              </button>
            </div>
          </form>
        )}

        {/* List of Items */}
        {loading ? (
          <p className="py-16 text-center text-text-muted">Memuat data galeri...</p>
        ) : visibleItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface/60 transition-all hover:border-accent-gold/40"
              >
                {item.beforeAfter && item.beforeImageUrl ? (
                  /* Dual Thumbnail for Before & After */
                  <div className="grid grid-cols-2 gap-0.5 bg-elin-ink p-1">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-l-lg bg-surface">
                      <img
                        src={item.beforeImageUrl}
                        alt="Before"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        SEBELUM
                      </span>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-r-lg bg-surface">
                      <img
                        src={item.imageUrl}
                        alt="After"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-accent-gold px-1.5 py-0.5 text-[9px] font-bold text-elin-ink">
                        SESUDAH
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Single Thumbnail for Regular Gallery */
                  <div className="aspect-[4/3] overflow-hidden bg-background">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-accent-gold/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent-gold">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-text-muted">Urutan: #{item.order}</span>
                  </div>

                  <h4 className="font-display text-base font-bold text-white">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-text-light/80 line-clamp-2 leading-relaxed font-light">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-accent-gold hover:bg-accent-gold hover:text-elin-ink transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-text-muted space-y-3">
            <Sparkles className="mx-auto h-10 w-10 text-accent-gold/40" />
            <p className="text-base font-semibold text-white">
              Belum ada item {activeTab === 'before_after' ? 'Before & After' : 'Galeri'}.
            </p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Klik tombol &quot;+ Tambah Before & After&quot; di atas untuk mengunggah foto kondisi sebelum & sesudah perawatan.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
