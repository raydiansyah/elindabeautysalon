import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Next.js automatically loads .env.local, no need for dotenv.config()
// Create Neon HTTP client
const sql = neon(process.env.DATABASE_URL!)

// Create Drizzle instance
export const db = drizzle({ client: sql, schema })

// Export schema for use in other files
export { schema }
