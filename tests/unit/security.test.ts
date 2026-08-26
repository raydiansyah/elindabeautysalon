/**
 * Module: Security unit tests
 * Purpose: Verify security-critical input boundaries and source-level rendering safeguards.
 * Used by: Vitest test runner and CI pipeline.
 * Dependencies: Vitest, Zod promotion schemas, rate limiter, Node filesystem API.
 * Public functions: None; test cases only.
 * Side effects: Reads source files and mutates only process-local rate-limit counters.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { promotionInputSchema, redemptionInputSchema } from '../../lib/promotions/validation'
import { consumeRateLimit } from '../../lib/rate-limit'

describe('security boundaries', () => {
  it('requires an exact eight-character coupon code', () => {
    const payload = { name: 'Promo', description: 'Valid', couponCode: "<script>alert('x')</script>", type: 'fixed', discountValue: 10, startsAt: '2026-01-01', endsAt: '2026-02-01' }
    expect(promotionInputSchema.safeParse(payload).success).toBe(false)
    expect(redemptionInputSchema.safeParse({ couponCode: "' OR 1=1 --", customerName: 'Ayu', customerContact: '08123456789', transactionTotal: 100 }).success).toBe(false)
  })

  it('keeps redemption abuse bounded by the rate limiter', () => {
    const key = `security-${Date.now()}-${Math.random()}`
    expect(consumeRateLimit(key, 1, 60_000).allowed).toBe(true)
    expect(consumeRateLimit(key, 1, 60_000).allowed).toBe(false)
  })

  it('does not introduce raw HTML rendering into the app source', () => {
    const source = readFileSync('app/page.tsx', 'utf8')
    expect(source).not.toContain('dangerouslySetInnerHTML')
  })
})
