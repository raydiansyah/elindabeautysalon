/**
 * Module: Admin promotion management
 * Purpose: Provide a self-service CRUD screen for all PRD promotion types.
 * Used by: Authenticated admin route at /admin/promotions.
 * Dependencies: Promotion API routes, React state, AdminLayout.
 * Public functions: AdminPromotions().
 * Side effects: Performs authenticated browser fetches that create, update, and delete promotions.
 */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'

type Promotion = {
  id: number
  name: string
  description: string
  couponCode: string | null
  type: string
  discountValue: string
  startsAt: string
  endsAt: string
  quota: number | null
  status: string
}

const emptyForm = {
  name: '', description: '', couponCode: '', type: 'percentage', discountValue: '10',
  minTransaction: '', maxDiscount: '', startsAt: '', endsAt: '', quota: '', status: 'draft', bannerUrl: '',
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const loadPromotions = async () => {
    const response = await fetch('/api/promotions', { cache: 'no-store' })
    const payload = await response.json()
    if (!response.ok) throw new Error(payload.error?.message || 'Gagal memuat promo')
    setPromotions(payload.data)
  }

  useEffect(() => { loadPromotions().catch((cause: Error) => setError(cause.message)) }, [])

  const updateField = (field: keyof typeof emptyForm, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true); setError('')
    try {
      let bannerUrl = form.bannerUrl || null
      if (bannerFile) {
        const presignResponse = await fetch('/api/uploads/presign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contentType: bannerFile.type, size: bannerFile.size }) })
        const presignPayload = await presignResponse.json()
        if (!presignResponse.ok) throw new Error(presignPayload.error?.message || 'Gagal menyiapkan upload banner')
        const uploadResponse = await fetch(presignPayload.data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': bannerFile.type }, body: bannerFile })
        if (!uploadResponse.ok) throw new Error('Gagal mengunggah banner ke Cloudflare R2')
        bannerUrl = presignPayload.data.publicUrl
      }
      const response = await fetch(editingId ? `/api/promotions/${editingId}` : '/api/promotions', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, couponCode: form.couponCode || null, minTransaction: form.minTransaction || null, maxDiscount: form.maxDiscount || null, quota: form.quota || null, bannerUrl }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error?.message || 'Gagal menyimpan promo')
      setForm(emptyForm); setBannerFile(null); setEditingId(null); await loadPromotions()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menyimpan promo')
    } finally { setSaving(false) }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Hapus promo ini?')) return
    const response = await fetch(`/api/promotions/${id}`, { method: 'DELETE' })
    if (!response.ok) { setError('Promo tidak dapat dihapus'); return }
    await loadPromotions()
  }

  const edit = (promotion: Promotion) => {
    setEditingId(promotion.id)
    setForm({ ...emptyForm, name: promotion.name, description: promotion.description, couponCode: promotion.couponCode || '', type: promotion.type, discountValue: String(promotion.discountValue), startsAt: promotion.startsAt.slice(0, 16), endsAt: promotion.endsAt.slice(0, 16), quota: promotion.quota ? String(promotion.quota) : '', status: promotion.status })
  }

  return <AdminLayout>
    <div className="space-y-6">
      <PageHeader title="Promosi" breadcrumb={[]} />
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-400">{error}</p>}
      <form onSubmit={submit} className="grid gap-4 rounded-xl border border-border bg-surface/50 p-6 md:grid-cols-2">
        <input required placeholder="Nama promo" value={form.name} onChange={(event) => updateField('name', event.target.value)} className="rounded-lg border border-border bg-background p-3" />
        <select value={form.type} onChange={(event) => updateField('type', event.target.value)} className="rounded-lg border border-border bg-background p-3">
          <option value="percentage">Percentage</option><option value="fixed">Fixed amount</option><option value="buy_x_get_y">Buy X Get Y</option><option value="free_service">Free service</option><option value="bundle">Bundle package</option>
        </select>
        <textarea required placeholder="Deskripsi" value={form.description} onChange={(event) => updateField('description', event.target.value)} className="rounded-lg border border-border bg-background p-3 md:col-span-2" />
        <input placeholder="Kode kupon" value={form.couponCode} onChange={(event) => updateField('couponCode', event.target.value)} className="rounded-lg border border-border bg-background p-3" />
        <input required type="number" min="0" step="0.01" placeholder="Nilai diskon" value={form.discountValue} onChange={(event) => updateField('discountValue', event.target.value)} className="rounded-lg border border-border bg-background p-3" />
        <input type="number" min="0" step="0.01" placeholder="Minimum transaksi" value={form.minTransaction} onChange={(event) => updateField('minTransaction', event.target.value)} className="rounded-lg border border-border bg-background p-3" />
        <input type="number" min="0" step="0.01" placeholder="Maksimum diskon" value={form.maxDiscount} onChange={(event) => updateField('maxDiscount', event.target.value)} className="rounded-lg border border-border bg-background p-3" />
        <input type="number" min="1" placeholder="Kuota (opsional)" value={form.quota} onChange={(event) => updateField('quota', event.target.value)} className="rounded-lg border border-border bg-background p-3" />
        <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className="rounded-lg border border-border bg-background p-3"><option value="draft">Draft</option><option value="active">Active</option><option value="scheduled">Scheduled</option><option value="paused">Paused</option></select>
        <label className="text-sm text-text-muted">Mulai<input required type="datetime-local" value={form.startsAt} onChange={(event) => updateField('startsAt', event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-foreground" /></label>
        <label className="text-sm text-text-muted">Berakhir<input required type="datetime-local" value={form.endsAt} onChange={(event) => updateField('endsAt', event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-foreground" /></label>
        <div className="space-y-2 md:col-span-2"><label className="block text-sm text-text-muted">Upload banner ke Cloudflare R2 (JPEG/PNG/WebP, maksimal 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)} className="mt-1 w-full rounded-lg border border-border bg-background p-3" /></label><input type="url" placeholder="Atau URL banner eksternal (opsional)" value={form.bannerUrl} onChange={(event) => updateField('bannerUrl', event.target.value)} className="w-full rounded-lg border border-border bg-background p-3" /></div>
        <div className="flex gap-3 md:col-span-2"><button disabled={saving} className="rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Menyimpan…' : editingId ? 'Simpan perubahan' : 'Tambah promo'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }} className="rounded-lg border border-border px-5 py-3">Batal</button>}</div>
      </form>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface/50"><table className="w-full text-left"><thead><tr className="border-b border-border text-sm text-text-muted"><th className="p-4">Promo</th><th className="p-4">Tipe</th><th className="p-4">Periode</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead><tbody>{promotions.map((promotion) => <tr key={promotion.id} className="border-b border-border"><td className="p-4"><strong>{promotion.name}</strong><div className="text-sm text-text-muted">{promotion.couponCode || 'Tanpa kode'}</div></td><td className="p-4">{promotion.type}</td><td className="p-4 text-sm">{new Date(promotion.startsAt).toLocaleDateString('id-ID')} – {new Date(promotion.endsAt).toLocaleDateString('id-ID')}</td><td className="p-4">{promotion.status}</td><td className="p-4"><button onClick={() => edit(promotion)} className="mr-3 text-primary">Edit</button><button onClick={() => remove(promotion.id)} className="text-red-400">Hapus</button></td></tr>)}</tbody></table></div>
    </div>
  </AdminLayout>
}
