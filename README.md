# Elynd Beauty Salon - Landing Page & CMS

Landing page modern untuk beauty salon dengan admin panel CMS, dibangun dengan Next.js 15, Tailwind CSS v4, Drizzle ORM, dan Neon Database.

## 🚀 Fitur Utama

### Landing Page
- ✅ Desain modern dengan tema violet-black luxury
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth scroll navigation
- ✅ Animasi scroll-triggered dengan Framer Motion
- ✅ 10 section: Hero, About, Services, Pricing, Gallery, Social Media, Location, Contact, Footer
- ✅ WhatsApp floating button
- ✅ Instagram & TikTok feed integration
- ✅ Google Maps embed
- ✅ Contact form dengan validasi

### Admin CMS Panel
- ✅ Authentication dengan NextAuth.js
- ✅ **HttpOnly Cookies** (proteksi XSS)
- ✅ **Secure Flag** (HTTPS only di production)
- ✅ **SameSite Lax** (proteksi CSRF)
- ✅ Dashboard dengan statistik
- ✅ Kelola layanan (CRUD services)
- ✅ Kelola harga (CRUD pricing tiers)
- ✅ Kelola galeri (upload/delete images)
- ✅ Kelola konten halaman
- ✅ Kelola informasi bisnis & jam buka
- ✅ Protected routes dengan middleware

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Playfair Display + Inter (Google Fonts)

### Backend
- **ORM**: Drizzle ORM
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: NextAuth.js (Credentials provider)
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:
- Node.js 18+ 
- npm atau yarn atau pnpm
- Akun [Neon Database](https://neon.tech) (gratis)

## 🚀 Quick Start

### 1. Setup Neon Database

1. Daftar di [Neon](https://neon.tech) (gratis)
2. Buat project baru
3. Pilih region terdekat (Singapore/AWS recommended)
4. Copy connection string dari dashboard
   ```
   postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan nilai Anda:

```env
# Database - Ganti dengan connection string Neon Anda
DATABASE_URL="postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# NextAuth.js (generate secret: openssl rand -base64 32)
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"

# Social Media Widget
INSTAGRAM_WIDGET_ID="your-elfsight-widget-id"
TIKTOK_WIDGET_ID="your-elfsight-widget-id"

# Google Maps
GOOGLE_MAPS_EMBED_URL="https://www.google.com/maps/embed?pb=your-url"

# WhatsApp (format: 62xxx tanpa + atau 0)
WHATSAPP_NUMBER="6281234567890"
```

### 4. Run Database Migrations

```bash
npm run db:migrate
```

### 5. Seed Database (Isi Data Awal)

```bash
npm run db:seed
```

Ini akan membuat:
- Admin user (email: admin@elynd.com, password: admin123)
- 8 layanan default
- 3 pricing tiers
- Konten halaman default
- Informasi bisnis default
- Sample galeri

### 6. Start Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Folder

```
elynd-beauty-salon/
├── app/
│   ├── layout.tsx              # Root layout + fonts
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind + custom styles
│   ├── admin/
│   │   ├── login/page.tsx      # Admin login
│   │   ├── dashboard/page.tsx  # Admin dashboard
│   │   ├── services/page.tsx   # Kelola layanan
│   │   ├── pricing/page.tsx    # Kelola harga
│   │   ├── gallery/page.tsx    # Kelola galeri
│   │   ├── content/page.tsx    # Kelola konten
│   │   └── settings/page.tsx   # Pengaturan
│   └── api/
│       ├── auth/               # NextAuth routes
│       ├── services/           # CRUD services API
│       ├── pricing/            # CRUD pricing API
│       ├── gallery/            # CRUD gallery API
│       ├── content/            # Site content API
│       └── business-info/      # Business info API
├── components/
│   ├── landing/                # Landing page components
│   └── admin/                  # Admin panel components
├── lib/
│   ├── db/
│   │   ├── index.ts            # Drizzle instance + Neon connection
│   │   ├── schema.ts           # Database schema
│   │   ├── seed.ts             # Seed script
│   │   └── migrations/         # Auto-generated migrations
│   ├── auth.ts                 # NextAuth configuration
│   ├── constants.ts            # Static data
│   └── utils.ts                # Helper functions
├── middleware.ts                # Auth middleware
├── drizzle.config.ts           # Drizzle configuration
└── package.json
```

## 🎨 Design System

### Color Palette
```css
Primary:        #7C3AED → #A855F7 (Violet gradient)
Background:     #0A0A0A (Black)
Surface:        #1E1B2E, #2D2A3E (Dark gray)
Accent Gold:    #F59E0B
Accent Rose:    #FB7185
Text Muted:     #A1A1AA, #D4D4D8
Border:         #3F3C5A
```

### Typography
- **Headings**: Playfair Display (elegant, luxury)
- **Body**: Inter (modern, readable)

## 🔐 Default Admin Credentials

Setelah menjalankan seed script:
- **Email**: admin@elynd.com
- **Password**: admin123

⚠️ **PENTING**: Ganti password setelah login pertama!

## 📝 Database Commands

```bash
# Generate migration dari schema changes
npm run db:generate

# Jalankan migrations
npm run db:migrate

# Push schema langsung (development only)
npm run db:push

# Buka Drizzle Studio (GUI database)
npm run db:studio

# Seed database dengan data awal
npm run db:seed
```

## 🌐 Deployment

### Deploy ke Vercel

1. Push code ke GitHub
2. Buka [Vercel](https://vercel.com)
3. Import repository
4. Tambah environment variables di Vercel settings
5. Deploy

Environment variables yang diperlukan:
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL` (ganti dengan URL production)
- `WHATSAPP_NUMBER`
- `INSTAGRAM_WIDGET_ID` (opsional)
- `TIKTOK_WIDGET_ID` (opsional)
- `GOOGLE_MAPS_EMBED_URL` (opsional)

## 🎯 Social Media Integration

### Instagram Feed (Elfsight)
1. Daftar di [Elfsight](https://elfsight.com)
2. Buat Instagram Feed widget
3. Copy Widget ID
4. Paste ke `INSTAGRAM_WIDGET_ID` di `.env.local`

### TikTok Feed
1. Buat TikTok Feed widget di Elfsight atau layanan serupa
2. Copy Widget ID
3. Paste ke `TIKTOK_WIDGET_ID` di `.env.local`

## 🛠️ Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build untuk production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migration
npm run db:migrate   # Run Drizzle migration
npm run db:studio    # Open Drizzle Studio
npm run db:push      # Push schema ke database
npm run db:seed      # Seed database
```

## 🔒 Keamanan (Security)

### Cookie Configuration

NextAuth dikonfigurasi dengan keamanan maksimal:

```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,              // Tidak bisa diakses via JavaScript
      secure: process.env.NODE_ENV === 'production',  // HTTPS only
      sameSite: 'lax',             // Proteksi CSRF
      path: '/',
    },
  },
},
```

**Keuntungan:**
- ✅ **HttpOnly**: Token tidak bisa dibaca via JavaScript (proteksi XSS attacks)
- ✅ **Secure Flag**: Cookie hanya dikirim via HTTPS di production
- ✅ **SameSite Lax**: Proteksi terhadap CSRF attacks

### Password Security

- ✅ **bcryptjs** dengan salt rounds 10
- ✅ Password tidak pernah disimpan dalam plain text
- ✅ Hash yang aman dan tidak reversible

### Best Practices

1. **AUTH_SECRET**: Generate dengan `openssl rand -base64 32`
2. **Environment Variables**: Tidak pernah commit `.env.local` ke git
3. **HTTPS**: Wajib di production (secure flag aktif)
4. **Middleware**: Proteksi `/admin/*` routes

## 🔧 Troubleshooting

### Database Connection Error
- Pastikan `DATABASE_URL` di `.env.local` benar
- Pastikan IP Anda diizinkan di Neon dashboard
- Cek koneksi dengan: `npm run db:push`

### NextAuth Error
- Pastikan `AUTH_SECRET` sudah di-set (generate: `openssl rand -base64 32`)
- Pastikan `AUTH_URL` benar

### Build Error
- Hapus `.next` folder dan jalankan `npm run build` ulang
- Pastikan semua dependencies terinstall: `npm install`

## 📄 License

MIT License

## 👥 Support

Untuk pertanyaan atau bantuan:
- Email: admin@elynd.com
- WhatsApp: +62 812-3456-7890

---

Dibuat dengan ❤️ untuk Elynd Beauty Salon
