/**
 * Module: Database schema
 * Purpose: Define application tables, identity linkage, role access indexes, and promotion data.
 * Used by: Drizzle client, migrations, API route handlers, and seed scripts.
 * Dependencies: drizzle-orm/pg-core.
 * Public functions: schema export and table definitions.
 * Side effects: Defines database read/write shape; no I/O at import time.
 */
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  numeric,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// ==========================================
// USERS TABLE (Admin Authentication)
// ==========================================
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    clerkUserId: text('clerk_user_id').unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password'), // Legacy local auth field; Clerk users do not store passwords here.
    role: text('role').notNull().default('admin'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
      roleIdx: index('users_role_idx').on(table.role),
      createdAtIdx: index('users_created_at_idx').on(table.createdAt),
    }
  }
)

// ==========================================
// SERVICES TABLE (Jenis Layanan)
// ==========================================
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // Lucide icon name
  startingPrice: integer('starting_price').notNull(), // In Rupiah
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ==========================================
// COURSES TABLE (Kursus Kecantikan)
// ==========================================
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  instructor: text('instructor').notNull(),
  level: text('level').notNull().default('Pemula'),
  duration: text('duration').notNull(),
  schedule: text('schedule').notNull(),
  imageUrl: text('image_url'),
  enrollmentUrl: text('enrollment_url'),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  activeOrderIdx: index('courses_active_order_idx').on(table.isActive, table.order),
}))

// ==========================================
// PRICING TIERS TABLE (Harga Layanan)
// ==========================================
export const pricingTiers = pgTable('pricing_tiers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // Basic, Premium, VIP
  price: integer('price').notNull(), // In Rupiah
  features: jsonb('features').notNull().$type<string[]>(), // Array of feature strings
  isPopular: boolean('is_popular').notNull().default(false),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ==========================================
// GALLERY TABLE (Portfolio Images)
// ==========================================
export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(), // hair, facial, nail, spa, makeup, etc.
  beforeAfter: boolean('before_after').notNull().default(false),
  beforeImageUrl: text('before_image_url'),
  description: text('description'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ==========================================
// SITE CONTENT TABLE (Editable Page Content)
// ==========================================
export const siteContent = pgTable(
  'site_content',
  {
    id: serial('id').primaryKey(),
    section: text('section').notNull(), // hero, about, services, pricing, contact, footer
    key: text('key').notNull(), // unique identifier within section
    value: text('value').notNull(), // actual content (text or HTML)
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      sectionKeyIdx: uniqueIndex('section_key_idx').on(table.section, table.key),
    }
  }
)

// ==========================================
// BUSINESS INFO TABLE (Contact & Hours)
// ==========================================
export const businessInfo = pgTable('business_info', {
  id: serial('id').primaryKey(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp').notNull(),
  openingHours: jsonb('opening_hours').notNull().$type<Record<string, { open: string; close: string; closed?: boolean }>>(),
  mapsUrl: text('maps_url').notNull(),
  instagramUrl: text('instagram_url'),
  tiktokUrl: text('tiktok_url'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ==========================================
// PROMOTIONS TABLE (PRD Promotion Management)
// ==========================================
export const promotions = pgTable(
  'promotions',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    couponCode: varchar('coupon_code', { length: 50 }),
    type: text('type').notNull(),
    discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
    minTransaction: numeric('min_transaction', { precision: 10, scale: 2 }),
    maxDiscount: numeric('max_discount', { precision: 10, scale: 2 }),
    startsAt: timestamp('starts_at').notNull(),
    endsAt: timestamp('ends_at').notNull(),
    quota: integer('quota'),
    viewCount: integer('view_count').notNull().default(0),
    redemptionCount: integer('redemption_count').notNull().default(0),
    status: text('status').notNull().default('draft'),
    bannerUrl: varchar('banner_url', { length: 500 }),
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    couponCodeIdx: uniqueIndex('promotions_coupon_code_idx').on(table.couponCode),
    statusPeriodIdx: index('promotions_status_period_idx').on(table.status, table.endsAt),
  }),
)

// ==========================================
// REDEMPTIONS TABLE (Promo redemption history)
// ==========================================
export const redemptions = pgTable(
  'redemptions',
  {
    id: serial('id').primaryKey(),
    promoId: integer('promo_id').notNull().references(() => promotions.id, { onDelete: 'cascade' }),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerContact: varchar('customer_contact', { length: 50 }).notNull(),
    transactionTotal: numeric('transaction_total', { precision: 10, scale: 2 }).notNull(),
    discountApplied: numeric('discount_applied', { precision: 10, scale: 2 }).notNull(),
    redeemedBy: text('redeemed_by').notNull(),
    redeemedAt: timestamp('redeemed_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    promoIdx: index('redemptions_promo_idx').on(table.promoId),
    redeemedByIdx: index('redemptions_redeemed_by_idx').on(table.redeemedBy),
    redeemedAtIdx: index('redemptions_redeemed_at_idx').on(table.redeemedAt),
    contactIdx: index('redemptions_contact_idx').on(table.customerContact),
  }),
)

// ==========================================
// REDEMPTION ARCHIVE TABLE (Retention without destructive deletion)
// ==========================================
export const redemptionArchive = pgTable(
  'redemption_archive',
  {
    id: serial('id').primaryKey(),
    originalId: integer('original_id').notNull().unique(),
    promoId: integer('promo_id').notNull(),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerContact: varchar('customer_contact', { length: 50 }).notNull(),
    transactionTotal: numeric('transaction_total', { precision: 10, scale: 2 }).notNull(),
    discountApplied: numeric('discount_applied', { precision: 10, scale: 2 }).notNull(),
    redeemedBy: text('redeemed_by').notNull(),
    redeemedAt: timestamp('redeemed_at').notNull(),
    createdAt: timestamp('created_at').notNull(),
    archivedAt: timestamp('archived_at').notNull().defaultNow(),
  },
  (table) => ({
    redeemedAtIdx: index('redemption_archive_redeemed_at_idx').on(table.redeemedAt),
  }),
)

// ==========================================
// SETTINGS TABLE (Salon profile and SEO configuration)
// ==========================================
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull().$type<Record<string, unknown>>(),
  updatedBy: text('updated_by').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  valueGinIdx: index('settings_value_gin_idx').using('gin', table.value),
}))

// ==========================================
// NOTIFICATIONS TABLE (Admin in-app alerts)
// ==========================================
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  href: varchar('href', { length: 500 }),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userReadIdx: index('notifications_user_read_idx').on(table.userId, table.readAt),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}))

// ==========================================
// AUDIT LOG TABLE (Append-only write history)
// ==========================================
export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  actionType: varchar('action_type', { length: 50 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: text('entity_id').notNull(),
  before: jsonb('before').$type<Record<string, unknown> | null>(),
  after: jsonb('after').$type<Record<string, unknown> | null>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  entityIdx: index('audit_log_entity_idx').on(table.entityType, table.entityId),
  userCreatedIdx: index('audit_log_user_created_idx').on(table.userId, table.createdAt),
}))

// Export all tables
export const schema = {
  users,
  services,
  courses,
  pricingTiers,
  gallery,
  siteContent,
  businessInfo,
  promotions,
  redemptions,
  redemptionArchive,
  settings,
  notifications,
  auditLog,
}
