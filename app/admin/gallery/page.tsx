/**
 * Module: Admin gallery management
 * Purpose: Create, edit, preview, reorder, and remove portfolio records used by the public gallery.
 * Used by: Authenticated admin route at /admin/gallery.
 * Dependencies: React, AdminLayout, PageHeader, gallery API, R2 presigned upload API, Lucide icons.
 * Public functions: AdminGallery().
 * Side effects: Performs authenticated browser fetches that write gallery records to PostgreSQL.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Edit, Image, Plus, Save, Trash2, X } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import AdminNotice from '@/components/admin/AdminNotice'

type GalleryImage = { id: number; imageUrl: string; title: string; category: string; order: number; beforeAfter: boolean }
type GalleryForm = Omit<GalleryImage, 'id'>

const emptyForm: GalleryForm = { imageUrl: '', title: '', category: 'hair', order: 1, beforeAfter: false }

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [form, setForm] = useState<GalleryForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
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
    } finally { setLoading(false) }
  }

  useEffect(() => { loadGallery() }, [])

  function startCreate() {
    setEditingId(0)
    setForm({ ...emptyForm, order: items.length + 1 })
    setMessage('')
  }

  function startEdit(item: GalleryImage) {
    setEditingId(item.id)
    setForm({ imageUrl: item.imageUrl, title: item.title, category: item.category, order: item.order, beforeAfter: item.beforeAfter })
    setMessage('')
  }

  async function uploadImage(file: File) {
    setUploading(true)
    setMessage('')
    try {
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('purpose', 'gallery')
      const uploadResponse = await fetch('/api/uploads', { method: 'POST', body: uploadForm })
      const uploadPayload = await uploadResponse.json()
      if (!uploadResponse.ok) throw new Error(uploadPayload.error?.message ?? 'Gagal mengunggah gambar ke R2')
      setForm((current) => ({ ...current, imageUrl: uploadPayload.data.publicUrl }))
      setMessage('Gambar berhasil diunggah. Klik simpan untuk menerapkannya.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal mengunggah gambar') } finally { setUploading(false) }
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
      setMessage('Galeri berhasil disimpan')
      await loadGallery()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal menyimpan galeri') } finally { setSaving(false) }
  }

  async function remove(id: number) {
    if (!window.confirm('Hapus item galeri ini?')) return
    const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    if (response.ok) { setMessage('Galeri berhasil dihapus'); await loadGallery() }
    else setMessage('Gagal menghapus galeri')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Kelola Galeri" breadcrumb={[]} action={<button onClick={startCreate} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-light"><Plus className="h-5 w-5" />Tambah galeri</button>} />
        <AdminNotice message={message} />
        {editingId !== null && <form onSubmit={save} className="grid gap-4 rounded-xl border border-border bg-surface/50 p-4 sm:p-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-text-light">Gambar portfolio<input required={editingId === 0} type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file) }} className="w-full rounded-lg border border-border bg-background p-3" /><span className="block truncate text-xs text-text-muted">{uploading ? 'Mengunggah ke R2...' : form.imageUrl || 'Pilih gambar baru'}</span></label>
          <input required placeholder="Judul karya" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-lg border border-border bg-background p-3" />
          <input required placeholder="Kategori, contoh: hair" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-lg border border-border bg-background p-3" />
          <input required min="0" type="number" placeholder="Urutan" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} className="rounded-lg border border-border bg-background p-3" />
          <label className="flex items-center gap-3 text-sm text-text-light"><input type="checkbox" checked={form.beforeAfter} onChange={(event) => setForm({ ...form, beforeAfter: event.target.checked })} /> Tandai sebagai before/after</label>
          <div className="flex flex-col justify-end gap-2 sm:flex-row md:col-span-2"><button type="button" onClick={() => setEditingId(null)} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2"><X className="h-4 w-4" />Batal</button><button disabled={saving} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Menyimpan...' : 'Simpan'}</button></div>
        </form>}
        {loading ? <p className="py-12 text-center text-text-muted">Memuat galeri...</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border border-border bg-surface/50"><div className="aspect-[4/3] bg-background"><img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /></div><div className="space-y-3 p-4"><div><h2 className="font-semibold">{item.title}</h2><p className="text-sm text-text-muted">{item.category} · Urutan {item.order}</p></div><div className="flex justify-end gap-2"><button onClick={() => startEdit(item)} className="min-h-11 min-w-11 rounded-lg p-3 text-primary hover:bg-primary/10" aria-label={`Edit ${item.title}`}><Edit className="h-4 w-4" /></button><button onClick={() => remove(item.id)} className="min-h-11 min-w-11 rounded-lg p-3 text-red-400 hover:bg-red-500/10" aria-label={`Hapus ${item.title}`}><Trash2 className="h-4 w-4" /></button></div></div></article>)}</div>}
        {!loading && !items.length && <div className="rounded-xl border border-dashed border-border p-12 text-center text-text-muted"><Image className="mx-auto mb-3 h-10 w-10" />Belum ada item galeri.</div>}
      </div>
    </AdminLayout>
  )
}
