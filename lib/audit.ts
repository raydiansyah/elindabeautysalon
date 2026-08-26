/**
 * Module: Audit logging service
 * Purpose: Record append-only before/after snapshots for application writes.
 * Used by: Promotion, redemption, settings, service, and user-management routes.
 * Dependencies: Drizzle database client and audit_log schema.
 * Public functions: recordAudit().
 * Side effects: Inserts one audit row into PostgreSQL; failures are logged and isolated.
 */
import { db } from '@/lib/db'
import { auditLog } from '@/lib/db/schema'

type AuditInput = { userId: string; actionType: string; entityType: string; entityId: string | number; before?: unknown; after?: unknown }

export async function recordAudit(input: AuditInput) {
  try {
    await db.insert(auditLog).values({ userId: input.userId, actionType: input.actionType, entityType: input.entityType, entityId: String(input.entityId), before: (input.before as Record<string, unknown> | null | undefined) ?? null, after: (input.after as Record<string, unknown> | null | undefined) ?? null })
  } catch (error) {
    console.error('Audit log write failed:', error)
  }
}
