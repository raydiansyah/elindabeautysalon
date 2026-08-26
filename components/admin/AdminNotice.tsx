/**
 * Module: Admin feedback notice
 * Purpose: Render consistent success, danger, warning, and informational feedback.
 * Used by: Admin settings, content, user, profile, promotion, and redemption pages.
 * Dependencies: React JSX only.
 * Public functions: AdminNotice().
 * Side effects: None; announces feedback to assistive technology.
 */
type NoticeTone = 'success' | 'danger' | 'warning' | 'info'

function inferTone(message: string): NoticeTone {
  if (/gagal|tidak dapat|tidak valid|tidak sama|error|belum/i.test(message)) return 'danger'
  if (/perhatian|coba lagi|menunggu|maksimal|minimal/i.test(message)) return 'warning'
  if (/berhasil|dikirim|disimpan|diperbarui|diunggah|direset/i.test(message)) return 'success'
  return 'info'
}

export default function AdminNotice({ message, tone }: { message?: string; tone?: NoticeTone }) {
  if (!message) return null
  const resolvedTone = tone ?? inferTone(message)
  const styles = {
    success: 'border-green-500/30 bg-green-500/10 text-green-400',
    danger: 'border-red-500/30 bg-red-500/10 text-red-400',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    info: 'border-primary/30 bg-primary/10 text-text-light',
  }
  return <p role={resolvedTone === 'danger' ? 'alert' : 'status'} aria-live="polite" className={`rounded-lg border px-4 py-3 text-sm ${styles[resolvedTone]}`}>{message}</p>
}
