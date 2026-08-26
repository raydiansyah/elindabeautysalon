/**
 * Module: Promotion discount calculation
 * Purpose: Calculate the discount amount for a validated promotion and transaction total.
 * Used by: Redemption API route and unit tests.
 * Dependencies: None; accepts normalized promotion values.
 * Public functions: calculateDiscount().
 * Side effects: None; pure numeric calculation.
 */

type DiscountPromotion = {
  type: string
  discountValue: string | number
  maxDiscount: string | number | null
}

export function calculateDiscount(promotion: DiscountPromotion, transactionTotal: number) {
  const value = Number(promotion.discountValue)
  if (promotion.type === 'percentage') return Math.min(transactionTotal * value / 100, promotion.maxDiscount ? Number(promotion.maxDiscount) : Infinity)
  return Math.min(transactionTotal, value)
}
