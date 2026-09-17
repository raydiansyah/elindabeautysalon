/**
 * Module: Staff redemption screen
 * Purpose: Process promo redemption in a clear, 3-step cashier workflow with live calculation.
 * Used by: Authenticated staff/admin route at /admin/redemptions.
 * Dependencies: Redemption API routes, React state, AdminLayout, Lucide icons.
 * Public functions: AdminRedemptions().
 * Side effects: Performs authenticated validation, redemption, and history fetches.
 */
'use client'

import { useEffect, useState } from 'react'
import {
  Ticket,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Search,
  User,
  Phone,
  Receipt,
  ArrowRight,
  Clock,
  Sparkles,
  History as HistoryIcon,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import AdminNotice from '@/components/admin/AdminNotice'

type History = {
  id: number
  customerName: string
  customerContact: string
  transactionTotal: string
  discountApplied: string
  redeemedAt: string
}

type PromoValidation = {
  valid: boolean
  reason?: string
  promotion?: {
    id: number
    name: string
    type: 'percentage' | 'fixed_amount'
    discountValue: string
    maxDiscount?: string | null
    minimumSpend?: string | null
  }
}

export default function AdminRedemptions() {
  const [form, setForm] = useState({
    couponCode: '',
    customerName: '',
    customerContact: '',
    transactionTotal: '',
  })
  const [validation, setValidation] = useState<PromoValidation | null>(null)
  const [validating, setValidating] = useState(false)
  const [history, setHistory] = useState<History[]>([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/redemptions', { cache: 'no-store' })
      const payload = await response.json()
      setHistory(payload.data || [])
    } catch {
      // Keep existing history
    }
  }

  useEffect(() => {
    void loadHistory()
  }, [])

  const validateCode = async () => {
    if (!form.couponCode.trim()) return
    setValidating(true)
    setMessage('')
    try {
      const response = await fetch(`/api/redemptions?couponCode=${encodeURIComponent(form.couponCode.trim())}`)
      const payload = await response.json()
      setValidation(payload.data)
      if (!payload.data?.valid && payload.data?.reason) {
        setMessage(payload.data.reason)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal memvalidasi kupon')
    } finally {
      setValidating(false)
    }
  }

  const redeem = async () => {
    if (!validation?.valid) return
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/redemptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await response.json()
      if (!response.ok) {
        setMessage(payload.error?.message || 'Redemption gagal diproses')
        return
      }
      setMessage('✅ Kupon berhasil digunakan dan dicatat dalam riwayat transaksi!')
      setForm({ couponCode: '', customerName: '', customerContact: '', transactionTotal: '' })
      setValidation(null)
      await loadHistory()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan sistem saat redemption')
    } finally {
      setBusy(false)
    }
  }

  // Calculate live preview of discount
  const totalNum = Number(form.transactionTotal) || 0
  let discountNum = 0
  if (validation?.valid && validation.promotion && totalNum > 0) {
    const promo = validation.promotion
    const promoVal = Number(promo.discountValue) || 0
    if (promo.type === 'percentage') {
      discountNum = (totalNum * promoVal) / 100
      if (promo.maxDiscount && Number(promo.maxDiscount) > 0) {
        discountNum = Math.min(discountNum, Number(promo.maxDiscount))
      }
    } else {
      discountNum = Math.min(totalNum, promoVal)
    }
  }
  const finalTotal = Math.max(0, totalNum - discountNum)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader
          title="Redemption Promo & Kupon"
          breadcrumb={[{ label: 'Kasir & Promo' }]}
        />

        <AdminNotice message={message} />

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column: 3-Step Redemption Flow */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-md shadow-xl space-y-6">
              {/* STEP 1: VALIDASI KODE VOUCHER */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-gold text-xs font-bold text-elin-ink shadow">
                    1
                  </span>
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                    Validasi Kode Kupon / Voucher
                  </h3>
                </div>

                <div className="flex gap-2.5">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      value={form.couponCode}
                      onChange={(e) => {
                        setForm({ ...form, couponCode: e.target.value.toUpperCase() })
                        if (validation) setValidation(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          void validateCode()
                        }
                      }}
                      placeholder="Masukkan kode kupon (contoh: GLOW50K)"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm font-mono uppercase tracking-wider text-white outline-none focus:border-accent-gold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={validateCode}
                    disabled={validating || !form.couponCode.trim()}
                    className="flex items-center gap-2 rounded-xl bg-accent-gold px-5 py-3 text-xs font-bold text-elin-ink shadow-md shadow-accent-gold/20 hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    <Search className="h-4 w-4" />
                    <span>{validating ? 'Mengecek...' : 'Cek Kupon'}</span>
                  </button>
                </div>

                {/* Validation Feedback Card */}
                {validation && (
                  <div
                    className={`rounded-xl p-4 border transition-all ${
                      validation.valid
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {validation.valid ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-sm">
                          {validation.valid ? `Kupon Valid: ${validation.promotion?.name}` : 'Kupon Tidak Dapat Digunakan'}
                        </p>
                        {validation.reason && (
                          <p className="text-xs mt-1 text-text-muted opacity-90">{validation.reason}</p>
                        )}
                        {validation.valid && validation.promotion && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300">
                              Diskon: {validation.promotion.type === 'percentage' ? `${validation.promotion.discountValue}%` : `Rp${Number(validation.promotion.discountValue).toLocaleString('id-ID')}`}
                            </span>
                            {validation.promotion.minimumSpend && Number(validation.promotion.minimumSpend) > 0 && (
                              <span className="rounded bg-white/10 px-2 py-0.5 text-text-light">
                                Min. Belanja: Rp{Number(validation.promotion.minimumSpend).toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10" />

              {/* STEP 2: DATA PELANGGAN & TRANSAKSI */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-gold text-xs font-bold text-elin-ink shadow">
                    2
                  </span>
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                    Data Pelanggan & Nominal Kasir
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-text-light mb-1">
                      Nama Pelanggan
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="text"
                        value={form.customerName}
                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                        placeholder="Nama tamu salon"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-accent-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-light mb-1">
                      Nomor WhatsApp / Telepon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="tel"
                        value={form.customerContact}
                        onChange={(e) => setForm({ ...form, customerContact: e.target.value })}
                        placeholder="Contoh: 08123456789"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-accent-gold"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-text-light mb-1">
                      Total Tagihan Sebelum Diskon (Rp)
                    </label>
                    <div className="relative">
                      <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="number"
                        min="1"
                        value={form.transactionTotal}
                        onChange={(e) => setForm({ ...form, transactionTotal: e.target.value })}
                        placeholder="Contoh: 250000"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-accent-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10" />

              {/* STEP 3: KONFIRMASI REDEMPTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-gold text-xs font-bold text-elin-ink shadow">
                    3
                  </span>
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                    Ringkasan & Konfirmasi Kasir
                  </h3>
                </div>

                <div className="rounded-xl border border-white/10 bg-background/60 p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>Total Tagihan Awal</span>
                    <span className="font-medium text-white">Rp{totalNum.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Potongan Diskon Kupon</span>
                    <span className="font-semibold">- Rp{discountNum.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-base font-bold text-white">
                    <span>Total Bayar Tamu</span>
                    <span className="text-accent-gold font-display text-lg">
                      Rp{finalTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={busy || !validation?.valid || !form.customerName.trim() || totalNum <= 0}
                  onClick={redeem}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-gold py-3.5 text-sm font-bold text-elin-ink shadow-lg shadow-accent-gold/25 hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{busy ? 'Memproses Transaksi...' : 'Konfirmasi Redemption Kupon'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Tips & Fast Guide */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm space-y-4">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <QrCode className="h-5 w-5 text-accent-gold" />
                <span>Petunjuk Operasional Kasir</span>
              </h3>
              <ul className="space-y-3 text-xs text-text-muted leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-accent-gold font-bold">1.</span>
                  <span>Minta tamu menunjukkan kode voucher atau screenshot promo dari website / WhatsApp.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-gold font-bold">2.</span>
                  <span>Ketik kode voucher di kolom input lalu klik <strong>Cek Kupon</strong> untuk memastikan masa berlaku dan kuota.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-gold font-bold">3.</span>
                  <span>Masukkan nominal total belanja dan data tamu, lalu klik <strong>Konfirmasi Redemption</strong> untuk mencatat pengurangan kuota.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Riwayat Redemption Table */}
        <div className="rounded-2xl border border-border bg-surface/60 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-border bg-surface/90 px-6 py-4">
            <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
              <HistoryIcon className="h-4 w-4 text-accent-gold" />
              <span>Histori Transaksi Redemption</span>
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-light">
              Total: {history.length} Transaksi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-background/70 text-xs font-semibold uppercase tracking-wider text-text-light">
                <tr>
                  <th className="p-4">Pelanggan & Kontak</th>
                  <th className="p-4">Total Belanja</th>
                  <th className="p-4">Diskon Diberikan</th>
                  <th className="p-4">Waktu Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.length > 0 ? (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-light/40 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-white">{item.customerName}</div>
                        <div className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{item.customerContact || 'Tanpa no. telepon'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-white">
                        Rp{Number(item.transactionTotal).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 font-semibold text-emerald-400">
                        - Rp{Number(item.discountApplied).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-xs text-text-muted flex items-center gap-1.5 pt-5">
                        <Clock className="h-3.5 w-3.5 text-text-muted" />
                        <span>
                          {new Date(item.redeemedAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-text-muted">
                      <Ticket className="mx-auto mb-2 h-8 w-8 text-accent-gold/40" />
                      <p>Belum ada riwayat redemption kupon yang tercatat.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

