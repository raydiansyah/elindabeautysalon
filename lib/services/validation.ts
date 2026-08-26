/**
 * Module: Service validation
 * Purpose: Validate service catalog payloads before database writes.
 * Used by: POST /api/services and PUT /api/services/:id.
 * Dependencies: None; pure TypeScript validation.
 * Public functions: validateServiceInput(), validateServicePatch().
 * Side effects: None.
 */
const fields = new Set(['name', 'description', 'icon', 'startingPrice', 'order', 'isActive'])

function validate(input: unknown, partial: boolean) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Format layanan tidak valid' }
  const body = input as Record<string, unknown>
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body)) {
    if (!fields.has(key)) return { error: `Field layanan tidak didukung: ${key}` }
    if (['name', 'description', 'icon'].includes(key) && (typeof value !== 'string' || value.trim().length === 0 || value.length > 500)) return { error: `Nilai ${key} tidak valid` }
    if (['startingPrice', 'order'].includes(key) && (typeof value !== 'number' || !Number.isInteger(value) || value < 0)) return { error: `Nilai ${key} tidak valid` }
    if (key === 'isActive' && typeof value !== 'boolean') return { error: 'Nilai isActive tidak valid' }
    result[key] = typeof value === 'string' ? value.trim() : value
  }
  if (!partial && (!('name' in result) || !('description' in result) || !('icon' in result) || !('startingPrice' in result))) return { error: 'Field layanan wajib belum lengkap' }
  if (partial && Object.keys(result).length === 0) return { error: 'Data layanan tidak boleh kosong' }
  return { value: result }
}

export function validateServiceInput(input: unknown) { return validate(input, false) }
export function validateServicePatch(input: unknown) { return validate(input, true) }
