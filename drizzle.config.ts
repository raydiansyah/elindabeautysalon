/**
 * Module: Drizzle Kit configuration
 * Purpose: Configure schema generation and migrations against the Neon database.
 * Used by: db:generate, db:migrate, and db:push npm scripts.
 * Dependencies: drizzle-kit and dotenv; DATABASE_URL_UNPOOLED preferred for DDL.
 * Public functions: Default Drizzle configuration export.
 * Side effects: Loads local environment variables; no database I/O at import time.
 */
import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
})
