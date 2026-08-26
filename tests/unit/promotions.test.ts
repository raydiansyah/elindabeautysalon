/**
 * Module: Promotion unit tests
 * Purpose: Verify pure promotion validation, discount, and rate-limit behavior.
 * Used by: Vitest test runner and CI pipeline.
 * Dependencies: Vitest, promotion validation/calculation, rate limiter.
 * Public functions: None; test cases only.
 * Side effects: Mutates only the process-local rate limiter state during tests.
 */
import { describe, expect, it } from 'vitest'
import { calculateDiscount } from '../../lib/promotions/calculation'
import { promotionInputSchema, redemptionInputSchema } from '../../lib/promotions/validation'
import { consumeRateLimit } from '../../lib/rate-limit'

const validPromotion = {
  name: 'Promo Januari', description: 'Diskon salon', couponCode: 'JANUARI1', type: 'percentage' as const,
  discountValue: 20, startsAt: '2026-01-01T00:00:00.000Z', endsAt: '2026-02-01T00:00:00.000Z', quota: 10,
}

describe('promotionInputSchema', () => {
  it('accepts a valid percentage promotion and normalizes the coupon code', () => {
    const result = promotionInputSchema.safeParse({ ...validPromotion, couponCode: ' januari1 ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.couponCode).toBe('JANUARI1')
  })

  it('rejects invalid date ranges and percentage values above 100', () => {
    const result = promotionInputSchema.safeParse({ ...validPromotion, discountValue: 101, endsAt: '2025-12-01T00:00:00.000Z' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues.map((issue) => issue.path.join('.'))).toEqual(expect.arrayContaining(['endsAt', 'discountValue']))
  })

  it('rejects coupon codes that are not exactly eight alphanumeric characters', () => {
    expect(promotionInputSchema.safeParse({ ...validPromotion, couponCode: 'short' }).success).toBe(false)
  })
})

describe('redemptionInputSchema', () => {
  it('rejects non-positive transaction totals', () => {
    expect(redemptionInputSchema.safeParse({ couponCode: 'JANUARI1', customerName: 'Ayu', customerContact: '08123456789', transactionTotal: 0 }).success).toBe(false)
  })
})

describe('calculateDiscount', () => {
  it('calculates percentage discounts and applies a maximum cap', () => {
    expect(calculateDiscount({ type: 'percentage', discountValue: 20, maxDiscount: 50 }, 500)).toBe(50)
  })

  it.each(['fixed', 'buy_x_get_y', 'free_service', 'bundle'] as const)('calculates %s discounts without exceeding the transaction total', (type) => {
    expect(calculateDiscount({ type, discountValue: 150, maxDiscount: null }, 100)).toBe(100)
  })
})

describe('consumeRateLimit', () => {
  it('allows up to the configured limit and rejects the next request', () => {
    const key = `unit-test-${Date.now()}-${Math.random()}`
    expect(consumeRateLimit(key, 2, 60_000).allowed).toBe(true)
    expect(consumeRateLimit(key, 2, 60_000).allowed).toBe(true)
    expect(consumeRateLimit(key, 2, 60_000).allowed).toBe(false)
  })
})
