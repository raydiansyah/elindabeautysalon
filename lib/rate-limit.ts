/**
 * Module: In-memory rate limiter
 * Purpose: Apply bounded request windows without an external paid service.
 * Used by: Redemption and coupon-validation API handlers.
 * Dependencies: None; process-local memory.
 * Public functions: consumeRateLimit().
 * Side effects: Maintains ephemeral counters in the current server instance.
 */
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 5000) for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey)
    return { allowed: true, retryAfter: 0 }
  }
  current.count += 1
  return { allowed: current.count <= limit, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
}
