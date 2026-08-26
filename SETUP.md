# 🚀 Panduan Setup Cepat - Elynd Beauty Salon

## Step 1: Setup Neon Database (5 menit)

1. Buka [https://neon.tech](https://neon.tech)
2. Daftar dengan GitHub/Google (gratis)
3. Klik "New Project"
4. Beri nama: `elynd-beauty-salon`
5. Pilih region: **Singapore (AWS)**
6. Klik "Create Project"
7. Copy **Connection string** (format: `postgres://user:password@ep-xxx...`)

## Step 2: Setup Environment (2 menit)

Di terminal, jalankan:

```bash
cd /Users/raydiansyah/Sites/elynd-beauty-salon

# Buat file .env.local
cp .env.example .env.local

# Edit .env.local dan ganti DATABASE_URL dengan connection string Neon Anda
```

Edit bagian ini di `.env.local`:
```env
DATABASE_URL="postgres://USER:PASSWORD@ep-xxx.region.aws.neon.tech/elynd_beauty_salon?sslmode=require"
AUTH_SECRET="ganti-dengan-random-string"
WHATSAPP_NUMBER="6281234567890"
```

## Step 3: Setup Database (1 menit)

```bash
# Install dependencies (jika belum)
npm install

# Jalankan migrations
npm run db:migrate

# Isi data awal (admin user, services, pricing, dll)
npm run db:seed
```

Setelah seed berhasil, Anda akan melihat:
```
✅ Seed completed successfully!
📧 Admin email: admin@elynd.com
🔑 Admin password: admin123
```

## Step 4: Jalankan Development Server

```bash
npm run dev
```

Buka: **http://localhost:3000**

## Step 5: Login ke Admin Panel

1. Buka: **http://localhost:3000/admin/login**
2. Login dengan:
   - Email: `admin@elynd.com`
   - Password: `admin123`
3. **PENTING**: Ganti password setelah login pertama!

## ✅ Selesai!

Sekarang Anda memiliki:
- ✨ Landing page modern dengan tema violet-black
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Animasi smooth dengan Framer Motion
- 💼 Admin CMS panel untuk kelola konten
- 💾 Database Neon PostgreSQL (serverless, gratis)
- 🔐 Authentication dengan NextAuth.js
- 📸 Galeri portfolio
- 📍 Google Maps integration
- 💬 WhatsApp floating button
- 📱 Instagram & TikTok feed (dengan widget)

## 🎯 Next Steps

### Kelola Konten
- **Layanan**: `/admin/services` - Tambah/edit/hapus layanan
- **Harga**: `/admin/pricing` - Update harga paket
- **Galeri**: `/admin/gallery` - Upload gambar portfolio
- **Konten**: `/admin/content` - Edit teks halaman
- **Pengaturan**: `/admin/settings` - Info bisnis & jam buka

### Setup Social Media Widget (Opsional)

**Instagram Feed:**
1. Daftar di [Elfsight](https://elfsight.com)
2. Buat "Instagram Feed" widget
3. Copy Widget ID
4. Paste ke `INSTAGRAM_WIDGET_ID` di `.env.local`

**TikTok Feed:**
1. Buat widget di Elfsight atau Curator.io
2. Copy Widget ID
3. Paste ke `TIKTOK_WIDGET_ID` di `.env.local`

**Google Maps:**
1. Buka Google Maps
2. Cari lokasi salon Anda
3. Klik "Share" > "Embed a map"
4. Copy URL dari iframe
5. Paste ke `GOOGLE_MAPS_EMBED_URL` di `.env.local`

### Deploy ke Production (Vercel)

```bash
# Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/elynd-beauty-salon.git
git push -u origin main

# Deploy di Vercel
# 1. Buka https://vercel.com
# 2. Import repository GitHub
# 3. Tambah environment variables
# 4. Deploy!
```

## 🆘 Troubleshooting

**Error: Database connection failed**
- Cek `DATABASE_URL` di `.env.local` sudah benar
- Pastikan project Neon aktif di dashboard
- Test koneksi: `npm run db:push`

**Error: AUTH_SECRET missing**
- Generate secret: `openssl rand -base64 32`
- Paste ke `AUTH_SECRET` di `.env.local`

**Build failed**
- Hapus folder `.next`
- Jalankan `npm run build` ulang

**Lupa password admin**
- Buka Drizzle Studio: `npm run db:studio`
- Edit user password di tabel `users`
- Atau reset database dan jalankan `npm run db:seed` ulang

## 📚 Dokumentasi Lengkap

Lihat [README.md](README.md) untuk dokumentasi lengkap.

---

**Selamat! Landing page Elynd Beauty Salon siap digunakan! 🎉**
