/**
 * Module: Staff redemption screen
 * Purpose: Process promo redemption in a maximum three-step staff workflow.
 * Used by: Authenticated staff/admin route at /admin/redemptions.
 * Dependencies: Redemption API routes, React state, AdminLayout.
 * Public functions: AdminRedemptions().
 * Side effects: Performs authenticated validation, redemption, and history fetches.
 */
'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'

type History = { id: number; customerName: string; customerContact: string; transactionTotal: string; discountApplied: string; redeemedAt: string }

export default function AdminRedemptions() {
  const [form, setForm] = useState({ couponCode: '', customerName: '', customerContact: '', transactionTotal: '' })
  const [validation, setValidation] = useState<{ valid: boolean; reason?: string; promotion?: { name: string; discountValue: string } } | null>(null)
  const [history, setHistory] = useState<History[]>([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const loadHistory = () => fetch('/api/redemptions').then((response) => response.json()).then((payload) => setHistory(payload.data || [])).catch(() => undefined)
  useEffect(() => { loadHistory() }, [])
  const validate = async () => { if (!form.couponCode) return; const payload = await fetch(`/api/redemptions?couponCode=${encodeURIComponent(form.couponCode)}`).then((response) => response.json()); setValidation(payload.data); setMessage(payload.data?.reason || '') }
  const redeem = async () => { setBusy(true); setMessage(''); const response = await fetch('/api/redemptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); const payload = await response.json(); setBusy(false); if (!response.ok) { setMessage(payload.error?.message || 'Redemption gagal'); return } setMessage('Redemption berhasil disimpan'); setForm({ couponCode: '', customerName: '', customerContact: '', transactionTotal: '' }); setValidation(null); await loadHistory() }

  return <AdminLayout><div className="space-y-6"><PageHeader title="Redemption Promo" breadcrumb={[]} /><div className="max-w-2xl space-y-4 rounded-xl border border-border bg-surface/50 p-6"><div className="flex items-center gap-3 text-sm text-text-muted"><span className="rounded-full bg-primary px-3 py-1 text-white">1</span> Validasi kode promo</div><div className="flex gap-3"><input value={form.couponCode} onChange={(event) => setForm({ ...form, couponCode: event.target.value })} onBlur={validate} placeholder="Kode kupon" className="flex-1 rounded-lg border border-border bg-background p-3" /><button onClick={validate} className="rounded-lg border border-primary px-4 text-primary">Validasi</button></div>{validation && <p className={validation.valid ? 'text-green-400' : 'text-red-400'}>{validation.valid ? `Valid: ${validation.promotion?.name}` : validation.reason}</p>}<div className="flex items-center gap-3 text-sm text-text-muted"><span className="rounded-full bg-primary px-3 py-1 text-white">2</span> Data pelanggan dan transaksi</div><div className="grid gap-3 sm:grid-cols-2"><input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Nama pelanggan" className="rounded-lg border border-border bg-background p-3" /><input value={form.customerContact} onChange={(event) => setForm({ ...form, customerContact: event.target.value })} placeholder="Nomor telepon" className="rounded-lg border border-border bg-background p-3" /><input type="number" min="1" value={form.transactionTotal} onChange={(event) => setForm({ ...form, transactionTotal: event.target.value })} placeholder="Total transaksi" className="rounded-lg border border-border bg-background p-3" /></div><div className="flex items-center gap-3 text-sm text-text-muted"><span className="rounded-full bg-primary px-3 py-1 text-white">3</span> Konfirmasi</div><button disabled={busy || !validation?.valid} onClick={redeem} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Memproses…' : 'Konfirmasi Redemption'}</button>{message && <p className="rounded-lg bg-background p-3 text-sm">{message}</p>}</div><div className="overflow-x-auto rounded-xl border border-border bg-surface/50"><h2 className="border-b border-border p-4 font-semibold">Histori redemption</h2><table className="w-full text-left text-sm"><thead><tr className="border-b border-border text-text-muted"><th className="p-3">Pelanggan</th><th className="p-3">Transaksi</th><th className="p-3">Diskon</th><th className="p-3">Waktu</th></tr></thead><tbody>{history.map((item) => <tr key={item.id} className="border-b border-border"><td className="p-3">{item.customerName}<div className="text-xs text-text-muted">{item.customerContact}</div></td><td className="p-3">Rp{Number(item.transactionTotal).toLocaleString('id-ID')}</td><td className="p-3">Rp{Number(item.discountApplied).toLocaleString('id-ID')}</td><td className="p-3">{new Date(item.redeemedAt).toLocaleString('id-ID')}</td></tr>)}</tbody></table></div></div></AdminLayout>
}
