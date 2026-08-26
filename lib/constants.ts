export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '6281234567890'

export const NAVIGATION_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Harga', href: '#harga' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Kontak', href: '#kontak' },
]

export const SERVICES_PLACEHOLDER = [
  {
    id: 1,
    name: 'Potong & Styling Rambut',
    description: 'Potong rambut profesional dengan styling modern',
    icon: 'scissors',
    startingPrice: 150000,
  },
  {
    id: 2,
    name: 'Pewarnaan & Highlight',
    description: 'Pewarnaan rambut premium dengan produk berkualitas',
    icon: 'palette',
    startingPrice: 300000,
  },
  {
    id: 3,
    name: 'Facial Treatment',
    description: 'Perawatan wajah untuk kulit bersih dan glowing',
    icon: 'face-smile',
    startingPrice: 200000,
  },
  {
    id: 4,
    name: 'Spa & Massage',
    description: 'Pijat relaksasi dan perawatan tubuh',
    icon: 'flower-2',
    startingPrice: 350000,
  },
]

export const PRICING_PLACEHOLDER = [
  {
    id: 1,
    name: 'Basic',
    price: 150000,
    features: ['Potong rambut', 'Cuci & blow dry', 'Konsultasi'],
    isPopular: false,
  },
  {
    id: 2,
    name: 'Premium',
    price: 350000,
    features: ['Semua fitur Basic', 'Hair treatment', 'Head massage'],
    isPopular: true,
  },
  {
    id: 3,
    name: 'VIP',
    price: 750000,
    features: ['Semua fitur Premium', 'Private room', 'Priority booking'],
    isPopular: false,
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
