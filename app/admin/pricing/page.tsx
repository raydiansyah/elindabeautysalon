/**
 * Module: Legacy admin pricing route
 * Purpose: Redirect the retired pricing screen to the service catalog.
 * Used by: Legacy links to /admin/pricing.
 * Dependencies: Next.js redirect.
 * Public functions: AdminPricing().
 * Side effects: Redirects the current request to /admin/services.
 */
import { redirect } from 'next/navigation'

export default function AdminPricing() {
  redirect('/admin/services')
}
