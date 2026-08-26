/**
 * Module: Database seed
 * Purpose: Populate development salon data and default profile settings.
 * Used by: npm run db:seed.
 * Dependencies: Drizzle database client, schema tables, bcryptjs, dotenv.
 * Public functions: seed() via the executable module entrypoint.
 * Side effects: Inserts users, catalog, courses, business, gallery, and settings rows into PostgreSQL.
 */
import * as dotenv from 'dotenv'
// Load environment variables for seed script
dotenv.config({ path: '.env.local' })

import { db } from './index'
import { users, services, courses, pricingTiers, siteContent, businessInfo, gallery, settings } from './schema'
import { hash } from 'bcryptjs'
import { count } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    // 1. Create admin user
    const hashedPassword = await hash('admin123', 10)
    console.log('👤 Creating admin user...')
    
    await db.insert(users).values([
      {
        name: process.env.ADMIN_NAME || 'Elynd Admin',
        email: process.env.ADMIN_EMAIL || 'admin@elynd.com',
        password: hashedPassword,
        role: 'admin',
      },
    ])

    // 2. Create services
    console.log('💅 Creating services...')

    const [{ total: serviceCount }] = await db.select({ total: count() }).from(services)
    if (Number(serviceCount) === 0) await db.insert(services).values([
      {
        name: 'Potong & Styling Rambut',
        description: 'Potong rambut profesional dengan styling modern sesuai tren terkini',
        icon: 'scissors',
        startingPrice: 150000,
        order: 1,
      },
      {
        name: 'Pewarnaan & Highlight',
        description: 'Pewarnaan rambut premium dengan produk berkualitas tinggi',
        icon: 'palette',
        startingPrice: 300000,
        order: 2,
      },
      {
        name: 'Hair Treatment & Spa',
        description: 'Perawatan rambut intensif untuk rambut sehat dan berkilau',
        icon: 'sparkles',
        startingPrice: 250000,
        order: 3,
      },
      {
        name: 'Facial Treatment & Skincare',
        description: 'Perawatan wajah mendalam untuk kulit bersih dan glowing',
        icon: 'face-smile',
        startingPrice: 200000,
        order: 4,
      },
      {
        name: 'Nail Art & Manicure',
        description: 'Desain kuku artistik dengan cat premium tahan lama',
        icon: 'hand',
        startingPrice: 150000,
        order: 5,
      },
      {
        name: 'Spa & Body Massage',
        description: 'Pijat relaksasi dan perawatan tubuh menyeluruh',
        icon: 'flower-2',
        startingPrice: 350000,
        order: 6,
      },
      {
        name: 'Makeup Pesta & Bridal',
        description: 'Makeup profesional untuk acara spesial dan pernikahan',
        icon: 'crown',
        startingPrice: 500000,
        order: 7,
      },
      {
        name: 'Treatment Alis & Bulu Mata',
        description: 'Pembentukan dan pewarnaan alis serta extension bulu mata',
        icon: 'eye',
        startingPrice: 180000,
        order: 8,
      },
    ])

    // 2b. Create sample academy courses
    console.log('📚 Creating sample courses...')

    await db.insert(courses).values([
      {
        title: 'Fundamental Hair Styling',
        description: 'Pelajari fondasi konsultasi, sectioning, dan styling harian bersama tim Elin.',
        instructor: 'Tim Educator Elin',
        level: 'Pemula',
        duration: '2 hari',
        schedule: 'Sabtu–Minggu',
        imageUrl: '/images/courses/hair-styling.jpg',
        enrollmentUrl: '#kontak',
        order: 1,
      },
      {
        title: 'Professional Makeup',
        description: 'Bangun look yang rapi dan tahan lama untuk acara spesial dengan teknik profesional.',
        instructor: 'MUA Elin',
        level: 'Menengah',
        duration: '3 hari',
        schedule: 'Jadwal privat',
        imageUrl: '/images/courses/pro-makeup.jpg',
        enrollmentUrl: '#kontak',
        order: 2,
      },
    ])

    // 3. Create pricing tiers
    console.log('💰 Creating pricing tiers...')
    
    await db.insert(pricingTiers).values([
      {
        name: 'Basic',
        price: 150000,
        features: [
          'Potong rambut standar',
          'Cuci & blow dry',
          'Konsultasi gaya rambut',
          'Minuman gratis',
        ],
        order: 1,
      },
      {
        name: 'Premium',
        price: 350000,
        features: [
          'Semua fitur Basic',
          'Hair treatment premium',
          'Produk berkualitas tinggi',
          'Head massage 15 menit',
          'Diskon 10% kunjungan berikutnya',
        ],
        isPopular: true,
        order: 2,
      },
      {
        name: 'VIP',
        price: 750000,
        features: [
          'Semua fitur Premium',
          'Private room',
          'Senior stylist',
          'Full spa treatment',
          'Complimentary snacks',
          'Priority booking',
          'Diskon 20% semua layanan',
        ],
        order: 3,
      },
    ])

    // 4. Create site content
    console.log('📝 Creating site content...')
    
    await db.insert(siteContent).values([
      // Hero section
      { section: 'hero', key: 'headline', value: 'Kecantikan & Wellness Terbaik untuk Anda' },
      { section: 'hero', key: 'subheadline', value: 'Tampil cantik dan percaya diri bersama tim stylist profesional kami' },
      { section: 'hero', key: 'cta_primary', value: 'Lihat Layanan' },
      { section: 'hero', key: 'cta_secondary', value: 'Hubungi Kami' },
      
      // About section
      { section: 'about', key: 'title', value: 'Tentang Elynd Beauty Salon' },
      { section: 'about', key: 'description', value: 'Elynd Beauty Salon adalah salon kecantikan profesional dengan pengalaman lebih dari 10 tahun. Kami berkomitmen memberikan layanan terbaik dengan produk berkualitas tinggi dan tim stylist yang terlatih.' },
      { section: 'about', key: 'stat_1_value', value: '10+' },
      { section: 'about', key: 'stat_1_label', value: 'Tahun Pengalaman' },
      { section: 'about', key: 'stat_2_value', value: '5000+' },
      { section: 'about', key: 'stat_2_label', value: 'Klien Puas' },
      { section: 'about', key: 'stat_3_value', value: '15+' },
      { section: 'about', key: 'stat_3_label', value: 'Stylist Ahli' },
      { section: 'about', key: 'stat_4_value', value: '20+' },
      { section: 'about', key: 'stat_4_label', value: 'Penghargaan' },
    ])

    // 5. Create business info
    console.log('🏢 Creating business info...')
    
    await db.insert(businessInfo).values({
      address: 'Jl. Contoh No. 123, Jakarta Selatan, Indonesia',
      phone: '+62 21 1234 5678',
      email: 'info@elynd-beauty.com',
      whatsapp: process.env.WHATSAPP_NUMBER || '6281234567890',
      openingHours: {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '08:00', close: '22:00' },
        sunday: { open: '08:00', close: '22:00' },
      },
      mapsUrl: 'https://maps.google.com/?q=your-location',
      instagramUrl: 'https://instagram.com/elyndbeauty',
      tiktokUrl: 'https://tiktok.com/@elyndbeauty',
    })

    // 5b. Create editable salon profile defaults
    await db.insert(settings).values({
      key: 'salon',
      value: {
        salonName: 'Elynd Beauty Salon',
        address: 'Jl. Contoh No. 123, Jakarta Selatan, Indonesia',
        whatsapp: process.env.WHATSAPP_NUMBER || '6281234567890',
        openingHours: 'Senin-Minggu, 09:00-21:00',
        logoUrl: '',
        heroImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&q=85&fit=crop',
        aboutImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop',
        theme: 'cream',
        seoTitle: 'Elynd Beauty Salon',
        seoDescription: 'Salon kecantikan profesional untuk perawatan rambut, wajah, dan tubuh.',
      },
      updatedBy: 'seed',
    })

    // 6. Create sample gallery
    console.log('🖼️ Creating sample gallery...')

    const [{ total: galleryCount }] = await db.select({ total: count() }).from(gallery)
    if (Number(galleryCount) === 0) await db.insert(gallery).values([
      {
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
        title: 'Modern Bob Cut',
        category: 'hair',
        beforeAfter: true,
        order: 1,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
        title: 'Glowing Facial Treatment',
        category: 'facial',
        order: 2,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85',
        title: 'Elegant Nail Design',
        category: 'nail',
        order: 3,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=85',
        title: 'Bridal Makeup Look',
        category: 'makeup',
        order: 4,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=85',
        title: 'Relaxing Spa Treatment',
        category: 'spa',
        order: 5,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85',
        title: 'Balayage Hair Color',
        category: 'hair',
        beforeAfter: true,
        order: 6,
      },
    ])

    console.log('✅ Seed completed successfully!')
    console.log('📧 Admin email: admin@elynd.com')
    console.log('🔑 Admin password: admin123')
    console.log('⚠️  Ganti password setelah login pertama!')
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
