/**
 * Module: Booking validation tests
 * Purpose: Verify valid, invalid, and WhatsApp fallback booking payloads.
 * Used by: Vitest unit test suite.
 * Dependencies: booking validation module and Vitest.
 * Public functions: None; test cases only.
 * Side effects: None; no database or external API calls.
 */
import { describe, expect, it } from 'vitest'
import { buildBookingWhatsAppUrl, validateBookingInput } from '../../lib/bookings/validation'

describe('booking validation', () => {
  it('accepts a treatment booking with optional details', () => {
    const result = validateBookingInput({ name: 'Ayu', phone: '08123456789', type: 'treatment', item: 'Hair Spa', date: '', time: '', notes: '', turnstileToken: 'token' })
    expect(result.error).toBeUndefined()
    expect(result.value?.item).toBe('Hair Spa')
  })

  it('rejects incomplete booking contact data', () => {
    const result = validateBookingInput({ name: 'A', phone: '123', type: 'course', item: '' })
    expect(result.error).toBe('Nama, nomor WhatsApp, jenis, dan pilihan booking wajib diisi')
  })

  it('encodes course details in the WhatsApp fallback', () => {
    const url = buildBookingWhatsAppUrl('6281234567890', { name: 'Ayu', phone: '08123456789', type: 'course', item: 'Professional Makeup', date: '2026-10-01', time: '10:00', notes: 'Minta info biaya' })
    expect(url).toContain('wa.me/6281234567890?text=')
    expect(decodeURIComponent(url)).toContain('Pilihan: Professional Makeup')
  })
})
