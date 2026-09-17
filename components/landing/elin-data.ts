/**
 * Module: Elin landing content
 * Purpose: Keep the public-facing treatment and navigation copy together.
 * Used by: ElinLanding and its presentational section components.
 * Dependencies: None.
 * Public functions: None; exports immutable content values.
 * Side effects: None.
 */

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&q=85&fit=crop'

export const elinServices = [
  { name: 'Hair Styling & Coloring', detail: 'Potong, styling, coloring, dan konsultasi warna yang disesuaikan dengan karakter Anda.', icon: 'scissors' },
  { name: 'Facial & Skincare', detail: 'Perawatan wajah dengan ritme yang tenang untuk membantu kulit terasa lebih segar.', icon: 'droplets' },
  { name: 'Manicure & Pedicure', detail: 'Detail tangan dan kaki yang rapi untuk melengkapi penampilan sehari-hari.', icon: 'hand' },
  { name: 'Spa & Massage', detail: 'Waktu jeda untuk tubuh dengan sentuhan relaksasi yang terukur.', icon: 'flower' },
  { name: 'Makeup', detail: 'Riasan untuk momen penting, dari tampilan natural hingga acara spesial.', icon: 'brush' },
] as const

export const elinPackages = [
  { name: 'Signature Hair', detail: 'Konsultasi, cut, wash, dan styling.', note: 'Harga mengikuti panjang rambut dan pilihan warna.' },
  { name: 'Skin Reset', detail: 'Konsultasi singkat dan facial sesuai kondisi kulit.', note: 'Tim akan merekomendasikan treatment saat booking.' },
  { name: 'Event Ready', detail: 'Makeup dan hair styling untuk hari yang spesial.', note: 'Ketersediaan jadwal dikonfirmasi via WhatsApp.' },
] as const
