/**
 * Module: Admin promotion management
 * Purpose: Provide a self-service CRUD screen for all PRD promotion types.
 * Used by: Authenticated admin route at /admin/promotions.
 * Dependencies: Promotion API routes, React state, AdminLayout.
 * Public functions: AdminPromotions().
 * Side effects: Performs authenticated browser fetches that create, update, and delete promotions.
 */
'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Ticket,
  Calendar,
  BarChart3,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Upload,
  Clock,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'

/* ─────────────────────────────────── types ── */
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
  bannerUrl?: string | null
}

const emptyForm = {
  name: '',
  description: '',
  couponCode: '',
  type: 'percentage',
  discountValue: '10',
  minTransaction: '',
  maxDiscount: '',
  startsAt: '',
  endsAt: '',
  quota: '',
  status: 'draft',
  bannerUrl: '',
}

/* ─────────────────────────────── helpers ── */
const TYPE_LABELS: Record<string, string> = {
  percentage: 'Persentase (%)',
  fixed: 'Nominal Tetap (Rp)',
  buy_x_get_y: 'Buy X Get Y',
  free_service: 'Free Service',
  bundle: 'Bundle Package',
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  active: { label: 'Aktif', cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  scheduled: { label: 'Terjadwal', cls: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
  paused: { label: 'Dijeda', cls: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
  draft: { label: 'Draft', cls: 'border-white/10 bg-white/5 text-white/40' },
  ended: { label: 'Berakhir', cls: 'border-red-500/20 bg-red-500/10 text-red-400' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  )
}

function Notice({
  message,
  type,
  onDismiss,
}: {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        type === 'success'
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          : 'border-red-500/20 bg-red-500/10 text-red-400'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto shrink-0 opacity-60 hover:opacity-100"
        aria-label="Tutup notifikasi"
      >
        <X className="h-4 w-4" />
      </button>
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

const inputCls =
  'h-10 w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 text-sm text-white placeholder:text-white/20 transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20'

const selectCls =
  'h-10 w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 text-sm text-white transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20'

/* ─────────────────────────────── page ── */
export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const loadPromotions = async () => {
    const res = await fetch('/api/promotions', { cache: 'no-store' })
    const payload = await res.json()
    if (!res.ok) throw new Error(payload.error?.message || 'Gagal memuat promo')
    setPromotions(payload.data)
  }

  useEffect(() => {
    loadPromotions()
      .catch((e: Error) => setNotice({ text: e.message, type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((c) => ({ ...c, [field]: value }))
  }

  function handleBannerChange(file: File) {
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setBannerFile(null)
    setBannerPreview(null)
    setShowForm(true)
  }

  function editPromotion(p: Promotion) {
    setEditingId(p.id)
    setForm({
      ...emptyForm,
      name: p.name,
      description: p.description,
      couponCode: p.couponCode || '',
      type: p.type,
      discountValue: String(p.discountValue),
      startsAt: p.startsAt.slice(0, 16),
      endsAt: p.endsAt.slice(0, 16),
      quota: p.quota ? String(p.quota) : '',
      status: p.status,
      bannerUrl: p.bannerUrl || '',
    })
    setBannerFile(null)
    setBannerPreview(p.bannerUrl ?? null)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setBannerFile(null)
    setBannerPreview(null)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)
    try {
      let bannerUrl = form.bannerUrl || null
      if (bannerFile) {
        const fd = new FormData()
        fd.append('file', bannerFile)
        fd.append('purpose', 'promotions')
        const uploadRes = await fetch('/api/uploads', { method: 'POST', body: fd })
        const uploadPayload = await uploadRes.json()
        if (!uploadRes.ok)
          throw new Error(uploadPayload.error?.message || 'Gagal mengunggah banner ke Cloudflare R2')
        bannerUrl = uploadPayload.data.publicUrl
      }
      const res = await fetch(editingId ? `/api/promotions/${editingId}` : '/api/promotions', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          couponCode: form.couponCode || null,
          minTransaction: form.minTransaction || null,
          maxDiscount: form.maxDiscount || null,
          quota: form.quota || null,
          bannerUrl,
        }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error?.message || 'Gagal menyimpan promo')
      setNotice({ text: editingId ? 'Promo berhasil diperbarui' : 'Promo berhasil ditambahkan', type: 'success' })
      cancelForm()
      await loadPromotions()
    } catch (e) {
      setNotice({ text: e instanceof Error ? e.message : 'Gagal menyimpan promo', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (deleteId === null) return
    const res = await fetch(`/api/promotions/${deleteId}`, { method: 'DELETE' })
    if (!res.ok) {
      setNotice({ text: 'Promo tidak dapat dihapus', type: 'error' })
    } else {
      setNotice({ text: 'Promo berhasil dihapus', type: 'success' })
      await loadPromotions()
    }
    setDeleteId(null)
  }

  /* ── summary stats ── */
  const active = promotions.filter((p) => p.status === 'active').length
  const scheduled = promotions.filter((p) => p.status === 'scheduled').length
  const draft = promotions.filter((p) => p.status === 'draft').length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Promosi" breadcrumb={[]} />

        {notice && <Notice message={notice.text} type={notice.type} onDismiss={() => setNotice(null)} />}

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Promo', value: promotions.length, icon: <Tag className="h-4 w-4" />, cls: 'text-[#d9b978]' },
            { label: 'Aktif', value: active, icon: <CheckCircle className="h-4 w-4" />, cls: 'text-emerald-400' },
            { label: 'Terjadwal', value: scheduled, icon: <Calendar className="h-4 w-4" />, cls: 'text-blue-400' },
            { label: 'Draft', value: draft, icon: <Clock className="h-4 w-4" />, cls: 'text-white/40' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 rounded-2xl border border-[#d9b978]/10 bg-[#120d09]/80 p-4"
            >
              <div className={`${s.cls}`}>{s.icon}</div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60">
            Daftar Promosi ({promotions.length})
          </h2>
          {!showForm && (
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-xl bg-[#d9b978] px-4 py-2 text-sm font-semibold text-[#0d0a08] shadow-[0_0_16px_rgba(217,185,120,0.2)] transition-all hover:bg-[#c9a968] hover:shadow-[0_0_24px_rgba(217,185,120,0.3)]"
            >
              <Plus className="h-4 w-4" />
              Tambah Promo
            </button>
          )}
        </div>

        {/* ── Form ── */}
        {showForm && (
          <div className="rounded-2xl border border-[#d9b978]/15 bg-[#120d09]/90 p-5 sm:p-6">
            {/* Form header */}
            <div className="mb-5 flex items-center justify-between border-b border-[#d9b978]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9b978]/20 bg-[#d9b978]/10">
                  <Tag className="h-4 w-4 text-[#d9b978]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {editingId ? 'Edit Promo' : 'Promo Baru'}
                  </h3>
                  <p className="text-xs text-white/40">
                    {editingId ? `ID #${editingId}` : 'Isi detail promosi di bawah'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={cancelForm}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {/* Row 1 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama Promo">
                  <input
                    required
                    className={inputCls}
                    placeholder="Flash Sale Akhir Bulan"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </Field>
                <Field label="Tipe Diskon">
                  <select
                    className={selectCls}
                    value={form.type}
                    onChange={(e) => updateField('type', e.target.value)}
                  >
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Row 2 */}
              <Field label="Deskripsi">
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-xl border border-[#2e2416] bg-[#1a1208] px-3 py-2.5 text-sm text-white placeholder:text-white/20 transition-all focus:border-[#d9b978]/40 focus:outline-none focus:ring-1 focus:ring-[#d9b978]/20 resize-none"
                  placeholder="Deskripsi singkat promo…"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </Field>

              {/* Row 3 */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Kode Kupon" hint="Kosongkan jika tanpa kode">
                  <input
                    className={inputCls}
                    placeholder="ELIN20"
                    value={form.couponCode}
                    onChange={(e) => updateField('couponCode', e.target.value.toUpperCase())}
                  />
                </Field>
                <Field label={form.type === 'percentage' ? 'Nilai (%)' : 'Nilai (Rp)'}>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputCls}
                    placeholder="10"
                    value={form.discountValue}
                    onChange={(e) => updateField('discountValue', e.target.value)}
                  />
                </Field>
                <Field label="Min. Transaksi" hint="Opsional">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className={inputCls}
                    placeholder="50000"
                    value={form.minTransaction}
                    onChange={(e) => updateField('minTransaction', e.target.value)}
                  />
                </Field>
                <Field label="Maks. Diskon" hint="Opsional">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className={inputCls}
                    placeholder="100000"
                    value={form.maxDiscount}
                    onChange={(e) => updateField('maxDiscount', e.target.value)}
                  />
                </Field>
              </div>

              {/* Row 4 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Kuota" hint="Opsional — kosongkan jika tidak terbatas">
                  <input
                    type="number"
                    min="1"
                    className={inputCls}
                    placeholder="100"
                    value={form.quota}
                    onChange={(e) => updateField('quota', e.target.value)}
                  />
                </Field>
                <Field label="Mulai">
                  <input
                    required
                    type="datetime-local"
                    className={inputCls}
                    value={form.startsAt}
                    onChange={(e) => updateField('startsAt', e.target.value)}
                  />
                </Field>
                <Field label="Berakhir">
                  <input
                    required
                    type="datetime-local"
                    className={inputCls}
                    value={form.endsAt}
                    onChange={(e) => updateField('endsAt', e.target.value)}
                  />
                </Field>
              </div>

              {/* Row 5: Status + Banner */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Status">
                  <select
                    className={selectCls}
                    value={form.status}
                    onChange={(e) => updateField('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Aktif</option>
                    <option value="scheduled">Terjadwal</option>
                    <option value="paused">Dijeda</option>
                  </select>
                </Field>

                <Field label="Banner Promo" hint="JPEG/PNG/WebP, maks 5 MB">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="h-10 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2e2416] bg-[#1a1208]">
                      {bannerPreview ? (
                        <img src={bannerPreview} alt="Banner preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-white/20" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9b978]/20 bg-[#d9b978]/10 px-3 py-2 text-xs font-semibold text-[#d9b978] transition hover:bg-[#d9b978]/20"
                    >
                      <Upload className="h-3 w-3" />
                      Pilih file
                    </button>
                    {bannerFile && (
                      <span className="truncate text-xs text-white/30">{bannerFile.name}</span>
                    )}
                  </div>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleBannerChange(f)
                      e.target.value = ''
                    }}
                  />
                </Field>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 border-t border-[#d9b978]/10 pt-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d9b978] px-6 py-2.5 text-sm font-semibold text-[#0d0a08] shadow-[0_0_16px_rgba(217,185,120,0.2)] transition-all hover:bg-[#c9a968] hover:shadow-[0_0_24px_rgba(217,185,120,0.3)] disabled:opacity-50"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…</>
                  ) : editingId ? (
                    'Simpan Perubahan'
                  ) : (
                    'Tambah Promo'
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-white/50 transition hover:bg-white/5 hover:text-white"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-2xl border border-[#d9b978]/10 bg-[#120d09]/80">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-white/40">
              <Loader2 className="h-5 w-5 animate-spin text-[#d9b978]" />
              Memuat data promo…
            </div>
          ) : promotions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d9b978]/10 bg-[#d9b978]/5">
                <Tag className="h-6 w-6 text-[#d9b978]/40" />
              </div>
              <p className="text-sm text-white/40">Belum ada promo. Klik &quot;Tambah Promo&quot; untuk memulai.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#d9b978]/10">
                    {['Promo', 'Tipe', 'Diskon', 'Periode', 'Status', 'Aksi'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`border-b border-[#d9b978]/5 transition-colors hover:bg-[#d9b978]/3 ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{p.name}</p>
                        {p.couponCode ? (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-md border border-[#d9b978]/20 bg-[#d9b978]/10 px-1.5 py-0.5 text-xs font-mono text-[#d9b978]">
                            <Ticket className="h-2.5 w-2.5" />
                            {p.couponCode}
                          </span>
                        ) : (
                          <span className="text-xs text-white/25">Tanpa kode</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-white/60">{TYPE_LABELS[p.type] ?? p.type}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-[#d9b978]">
                          {p.type === 'percentage' ? `${p.discountValue}%` : `Rp ${Number(p.discountValue).toLocaleString('id-ID')}`}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-0.5 text-xs text-white/40">
                          <span>{new Date(p.startsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="text-white/20">s/d</span>
                          <span>{new Date(p.endsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => editPromotion(p)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9b978]/20 bg-[#d9b978]/10 text-[#d9b978] transition hover:bg-[#d9b978]/20"
                            aria-label="Edit promo"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                            aria-label="Hapus promo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteId(null) }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#120d09] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-white">Hapus Promo?</h3>
            <p className="text-sm text-white/40">
              Promo ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-white/10 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/5"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
