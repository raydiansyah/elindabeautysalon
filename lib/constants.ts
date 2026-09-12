/**
 * Module: Public Content Constants
 * Purpose: Store navigation, service fallback, and opening-hour content.
 * Used by: Public landing sections and server-side content fallbacks.
 * Dependencies: Environment variables for the WhatsApp number.
 * Public functions: None; exports immutable content values.
 * Side effects: Reads one environment variable at module load.
 */
export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '6281234567890'

export const NAVIGATION_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Kursus', href: '#kursus' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'WhatsApp', href: '#lokasi' },
]

export const SERVICES_PLACEHOLDER = [
  {
    id: 1,
    name: 'Potong & Styling Rambut',
    description: 'Potong rambut profesional dengan styling modern',
    icon: 'scissors',
  },
  {
    id: 2,
    name: 'Pewarnaan & Highlight',
    description: 'Pewarnaan rambut premium dengan produk berkualitas',
    icon: 'palette',
  },
  {
    id: 3,
    name: 'Facial Treatment',
    description: 'Perawatan wajah untuk kulit bersih dan glowing',
    icon: 'face-smile',
  },
  {
    id: 4,
    name: 'Spa & Massage',
    description: 'Pijat relaksasi dan perawatan tubuh',
    icon: 'flower-2',
  },
]

export const OPENING_HOURS = [
  { day: 'Senin', hours: '09:00 - 21:00' },
  { day: 'Selasa', hours: '09:00 - 21:00' },
  { day: 'Rabu', hours: '09:00 - 21:00' },
  { day: 'Kamis', hours: '09:00 - 21:00' },
  { day: 'Jumat', hours: '09:00 - 21:00' },
  { day: 'Sabtu', hours: '08:00 - 22:00' },
  { day: 'Minggu', hours: '08:00 - 22:00' },
]
