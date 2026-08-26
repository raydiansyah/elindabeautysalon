/**
 * Module: Promotion validation
 * Purpose: Validate and normalize promotion payloads before database writes.
 * Used by: Promotion collection and item API route handlers.
 * Dependencies: zod.
 * Public functions: promotionInputSchema, promotionPatchSchema.
 * Side effects: None; performs pure validation only.
 */
import { z } from 'zod'

export const promotionTypes = ['percentage', 'fixed', 'buy_x_get_y', 'free_service', 'bundle'] as const
export const promotionStatuses = ['draft', 'active', 'scheduled', 'expired', 'paused'] as const

const basePromotionSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  couponCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{8}$/, 'Kode promo harus 8 karakter alfanumerik').optional().nullable(),
  type: z.enum(promotionTypes),
  discountValue: z.coerce.number().nonnegative(),
  minTransaction: z.coerce.number().nonnegative().optional().nullable(),
  maxDiscount: z.coerce.number().nonnegative().optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  quota: z.coerce.number().int().positive().optional().nullable(),
  status: z.enum(promotionStatuses).default('draft'),
  bannerUrl: z.string().url().max(500).optional().nullable(),
})

export const promotionInputSchema = basePromotionSchema.superRefine((value, context) => {
  if (value.endsAt <= value.startsAt) {
    context.addIssue({ code: 'custom', path: ['endsAt'], message: 'Tanggal berakhir harus setelah tanggal mulai' })
  }
  if (value.type === 'percentage' && value.discountValue > 100) {
    context.addIssue({ code: 'custom', path: ['discountValue'], message: 'Diskon persentase maksimal 100' })
  }
})

export const promotionPatchSchema = basePromotionSchema.partial().superRefine((value, context) => {
  if (value.startsAt && value.endsAt && value.endsAt <= value.startsAt) {
    context.addIssue({ code: 'custom', path: ['endsAt'], message: 'Tanggal berakhir harus setelah tanggal mulai' })
  }
})

export const redemptionInputSchema = z.object({
  couponCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{8}$/, 'Kode promo harus 8 karakter alfanumerik'),
  customerName: z.string().trim().min(1).max(255),
  customerContact: z.string().trim().min(5).max(50),
  transactionTotal: z.coerce.number().positive(),
})
