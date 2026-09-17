/**
 * Module: Admin course management
 * Purpose: Create, edit, preview, activate, reorder, and remove academy courses.
 * Used by: Authenticated admin route at /admin/courses.
 * Dependencies: React, AdminLayout, PageHeader, courses API, R2 presigned upload API, Lucide icons.
 * Public functions: AdminCourses().
 * Side effects: Performs authenticated browser fetches that write course records to PostgreSQL.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { BookOpen, Edit, Plus, Save, Trash2, X } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import AdminNotice from '@/components/admin/AdminNotice'

type Course = { id: number; title: string; description: string; instructor: string; level: string; duration: string; schedule: string; imageUrl: string | null; enrollmentUrl: string | null; order: number; isActive: boolean }
type CourseForm = Omit<Course, 'id'>
const emptyForm: CourseForm = { title: '', description: '', instructor: '', level: 'Pemula', duration: '', schedule: 'Sabtu · 09.00–12.00', imageUrl: '', enrollmentUrl: '', order: 1, isActive: true }

export default function AdminCourses() {
  const [items, setItems] = useState<Course[]>([])
  const [form, setForm] = useState<CourseForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  async function loadCourses() {
    setLoading(true)
    try {
      const response = await fetch('/api/courses', { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error?.message ?? 'Gagal memuat kursus')
      setItems(payload.data ?? [])
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal memuat kursus')
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadCourses() }, [])

  function startCreate() {
    setEditingId(0)
    setForm({ ...emptyForm, order: items.length + 1 })
    setMessage('')
  }

  function startEdit(item: Course) {
    setEditingId(item.id)
    setForm({ title: item.title, description: item.description, instructor: item.instructor, level: item.level, duration: item.duration, schedule: item.schedule, imageUrl: item.imageUrl ?? '', enrollmentUrl: item.enrollmentUrl ?? '', order: item.order, isActive: item.isActive })
    setMessage('')
  }

  async function uploadImage(file: File) {
    setUploading(true)
    setMessage('')
    try {
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('purpose', 'course')
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
      const response = await fetch(editingId ? `/api/courses/${editingId}` : '/api/courses', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error?.message ?? 'Gagal menyimpan kursus')
      setEditingId(null)
      setForm(emptyForm)
      setMessage('Kursus berhasil disimpan')
      await loadCourses()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal menyimpan kursus') } finally { setSaving(false) }
  }

  async function remove(id: number) {
    if (!window.confirm('Hapus kursus ini?')) return
    const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
    if (response.ok) { setMessage('Kursus berhasil dihapus'); await loadCourses() }
    else setMessage('Gagal menghapus kursus')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Kelola Kursus" breadcrumb={[]} action={<button onClick={startCreate} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-gold px-4 py-2 text-xs sm:text-sm font-semibold text-elin-ink shadow-md shadow-accent-gold/20 hover:brightness-110"><Plus className="h-4 w-4" />Tambah Kursus</button>} />
        <AdminNotice message={message} />
        {editingId !== null && <form onSubmit={save} className="grid gap-4 rounded-2xl border border-accent-gold/40 bg-surface/80 p-4 sm:p-6 md:grid-cols-2 shadow-2xl backdrop-blur-xl">
          <input required placeholder="Judul kursus" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold" />
          <input required placeholder="Instruktur" value={form.instructor} onChange={(event) => setForm({ ...form, instructor: event.target.value })} className="rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold" />
          <textarea required placeholder="Deskripsi kursus" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold md:col-span-2" />
          <input required placeholder="Level, contoh: Pemula" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} className="rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold" />
          <input required placeholder="Durasi, contoh: 2 hari" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} className="rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold" />
          <label className="space-y-2 text-sm text-text-light"><span>Jadwal kelas</span><input required placeholder="Contoh: Sabtu · 09.00–12.00" value={form.schedule} onChange={(event) => setForm({ ...form, schedule: event.target.value })} className="w-full rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold" /><span className="block text-xs text-text-muted">Format bebas, misalnya hari dan jam kelas.</span></label>
          <input required min="0" type="number" placeholder="Urutan" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} className="rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold" />
          <label className="space-y-2 text-sm text-text-light">Gambar kursus (opsional)<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file) }} className="w-full rounded-xl border border-border bg-background p-3 text-xs text-text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" /><span className="block truncate text-xs text-text-muted">{uploading ? 'Mengunggah ke R2...' : form.imageUrl || 'Pilih gambar baru'}</span></label>
          <input type="url" placeholder="URL pendaftaran (opsional)" value={form.enrollmentUrl ?? ''} onChange={(event) => setForm({ ...form, enrollmentUrl: event.target.value })} className="rounded-xl border border-border bg-background p-3 text-sm text-white outline-none focus:border-accent-gold" />
          <label className="flex items-center gap-3 text-sm text-text-light"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Tampilkan di halaman publik</label>
          <div className="flex flex-col justify-end gap-2 sm:flex-row md:col-span-2"><button type="button" onClick={() => setEditingId(null)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text-light hover:text-white hover:bg-surface-light"><X className="h-4 w-4" />Batal</button><button disabled={saving} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-gold px-6 py-2 text-xs font-bold text-elin-ink shadow-md shadow-accent-gold/20 hover:brightness-110 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Menyimpan...' : 'Simpan'}</button></div>
        </form>}
        {loading ? <p className="py-12 text-center text-text-muted">Memuat kursus...</p> : <div className="grid gap-6 md:grid-cols-2">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-surface/60 transition-all hover:border-accent-gold/40">{item.imageUrl ? <div className="aspect-[16/8] bg-background"><img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /></div> : <div className="flex aspect-[16/8] items-center justify-center bg-background text-accent-gold"><BookOpen className="h-12 w-12 opacity-50" /></div>}<div className="space-y-3 p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-white">{item.title}</h2><p className="text-sm text-text-muted">{item.level} · {item.duration} · Urutan {item.order}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>{item.isActive ? 'Aktif' : 'Draft'}</span></div><p className="line-clamp-2 text-sm text-text-muted">{item.description}</p><p className="text-sm text-text-light">{item.instructor} · {item.schedule}</p><div className="flex justify-end gap-2"><button onClick={() => startEdit(item)} className="rounded-lg p-2 text-accent-gold hover:bg-accent-gold/10" aria-label={`Edit ${item.title}`}><Edit className="h-4 w-4" /></button><button onClick={() => remove(item.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10" aria-label={`Hapus ${item.title}`}><Trash2 className="h-4 w-4" /></button></div></div></article>)}</div>}
        {!loading && !items.length && <div className="rounded-2xl border border-dashed border-border p-12 text-center text-text-muted"><BookOpen className="mx-auto mb-3 h-10 w-10 text-accent-gold/50" />Belum ada kursus.</div>}
      </div>
    </AdminLayout>
  )
}
