<!--
Module: Elynd Beauty Salon project documentation
Purpose: Explain the product, local setup, validation, deployment, and release conventions.
Used by: Developers, release operators, and salon administrators.
Dependencies: Next.js, Clerk, Neon PostgreSQL, Drizzle ORM, Cloudflare R2, Resend, and Vercel.
Public functions: None; documentation only.
Side effects: Commands documented here may install dependencies, migrate the database, or deploy the application when explicitly run.
-->

# Elynd Beauty Salon

Website publik dan admin CMS untuk mengelola promosi, redemption, layanan, konten salon, notifikasi, dan statistik bisnis.

## Stack

- Next.js 16 App Router dan Route Handlers
- React 19, Tailwind CSS v4, Framer Motion, Lucide React
- Clerk untuk authentication dan RBAC (`admin`, `karyawan`, `member`)
- Neon PostgreSQL dengan Drizzle ORM
- Cloudflare R2 untuk banner image melalui presigned upload
- Resend atau SMTP untuk email notifikasi
- Vercel untuk hosting dan cron jobs

Vercel Analytics, OpenTelemetry, external uptime monitoring, operational alerts, automated backup, integration tests, dan E2E tests tidak termasuk fase pertama sesuai PRD yang disetujui.

## Fitur

- Landing page publik promo aktif, filter, countdown, dan share WhatsApp.
- Admin dashboard dengan statistik promo, redemption, conversion rate, dan export CSV.
- CRUD promo: percentage, fixed, buy X get Y, free service, dan bundle.
- Redemption atomik dengan quota protection dan histori transaksi.
- Clerk webhook untuk sinkronisasi user dan role.
- Settings salon, notifikasi in-app/email, audit log, rate limiting, dan structured request logs.

## Prasyarat

- Node.js 20+
- npm
- Neon PostgreSQL
- Clerk application
- Cloudflare R2 bucket jika upload banner digunakan

## Setup lokal

```bash
npm install
cp .env.example .env.local
```

Isi environment variable server-side di `.env.local`. Minimal development membutuhkan `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, dan `CLERK_SECRET_KEY`. Untuk fitur tambahan, lihat `.env.example`.

Jalankan aplikasi:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Admin login tersedia di `/admin/login`.

## Database

```bash
npm run db:generate  # Generate migration dari perubahan schema
npm run db:migrate   # Jalankan migration committed
npm run db:push      # Development only; jangan gunakan untuk production
npm run db:seed      # Seed data awal
npm run db:studio    # Buka Drizzle Studio
```

Production memakai migration committed melalui `npm run db:migrate`. Backup otomatis dan point-in-time recovery tidak dijanjikan pada fase pertama.

## Quality checks

```bash
npm run version:check
npm run lint
npm test
npx tsc --noEmit
npm run build
```

CI GitHub Actions menjalankan seluruh pemeriksaan tersebut pada push dan pull request. Build memakai `next build --webpack` untuk hasil yang konsisten di runner CI.

## Semantic versioning

Versi proyek mengikuti [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

- `PATCH`: bug fix yang backward-compatible.
- `MINOR`: fitur baru yang backward-compatible.
- `MAJOR`: perubahan breaking.

Versi canonical berada di `package.json`. Release harus menggunakan tag yang sama, misalnya `package.json` `1.2.0` dipublish dengan tag `v1.2.0`. Workflow release menolak tag yang tidak cocok.

## Deployment

1. Push branch atau pull request ke GitHub.
2. Pastikan CI green.
3. Hubungkan repository ke Vercel dan isi environment variables production.
4. Jalankan migration production melalui proses release yang disetujui.
5. Smoke-test landing page, Clerk login, dashboard, dan redemption.

Rollback aplikasi dilakukan melalui Vercel Instant Rollback. Panduan lengkap tersedia di [docs/rollback-strategy.md](docs/rollback-strategy.md); target SLO ada di [docs/slo.md](docs/slo.md).

## Scripts

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm test` | Unit tests Vitest |
| `npm run version:check` | Validasi versi SemVer |
| `npm run build` | Production build |
| `npm run db:migrate` | Jalankan Drizzle migrations |

## Security

Jangan commit `.env.local` atau secret provider. Clerk mengelola session cookie; API melakukan authorization berbasis role. Request logs tidak mencatat token, cookie, query string, atau request body.
