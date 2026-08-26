/**
 * Module: Settings validation
 * Purpose: Validate partial salon settings before persistence.
 * Used by: PUT /api/settings.
 * Dependencies: None; pure TypeScript validation.
 * Public functions: validateSettingsInput().
 * Side effects: None.
 */
const allowedFields = new Set(['salonName', 'address', 'whatsapp', 'openingHours', 'logoUrl', 'theme', 'seoTitle', 'seoDescription'])

export function validateSettingsInput(input: unknown): { value?: Record<string, string>; error?: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Format settings tidak valid' }
  const value = input as Record<string, unknown>
  const result: Record<string, string> = {}
  for (const [key, raw] of Object.entries(value)) {
    if (!allowedFields.has(key)) return { error: `Field settings tidak didukung: ${key}` }
    if (typeof raw !== 'string' || raw.length > 2000) return { error: `Nilai ${key} tidak valid` }
    result[key] = raw.trim()
  }
  if ('whatsapp' in result && !/^\+?[0-9][0-9\s-]{7,19}$/.test(result.whatsapp)) return { error: 'Format WhatsApp tidak valid' }
  if ('openingHours' in result && !/^(?:[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)?,\s*)?([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/.test(result.openingHours)) return { error: 'Format jam operasional harus HH:mm-HH:mm' }
  return { value: result }
}
