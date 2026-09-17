/**
 * Module: Public booking validation
 * Purpose: Normalize and validate treatment/course booking requests before external delivery.
 * Used by: POST /api/bookings and booking form fallback preparation.
 * Dependencies: None; pure TypeScript validation.
 * Public functions: validateBookingInput(), buildBookingWhatsAppUrl().
 * Side effects: None.
 */
export type BookingInput = {
  name: string
  phone: string
  type: 'treatment' | 'course'
  item: string
  date: string
  time: string
  notes: string
  turnstileToken: string
}

export function validateBookingInput(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Format booking tidak valid' }
  const raw = input as Record<string, unknown>
  const text = (key: string, max: number) => typeof raw[key] === 'string' ? raw[key].trim().slice(0, max) : ''
  const type = raw.type === 'course' ? 'course' : raw.type === 'treatment' ? 'treatment' : ''
  const value = { name: text('name', 120), phone: text('phone', 30), type, item: text('item', 160), date: text('date', 20), time: text('time', 20), notes: text('notes', 500), turnstileToken: text('turnstileToken', 2048) }
  if (value.name.length < 2 || value.phone.length < 8 || !value.type || !value.item) return { error: 'Nama, nomor WhatsApp, jenis, dan pilihan booking wajib diisi' }
  return { value: value as BookingInput }
}

export function buildBookingWhatsAppUrl(number: string, input: Pick<BookingInput, 'name' | 'phone' | 'type' | 'item' | 'date' | 'time' | 'notes'>) {
  const label = input.type === 'course' ? 'kursus' : 'treatment'
  const message = [`Halo, saya ingin booking ${label} di Beauty Salon Elin.`, `Nama: ${input.name}`, `WhatsApp: ${input.phone}`, `Pilihan: ${input.item}`, input.date && `Tanggal: ${input.date}`, input.time && `Waktu: ${input.time}`, input.notes && `Catatan: ${input.notes}`].filter(Boolean).join('\n')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
