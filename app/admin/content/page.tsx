/**
 * Module: Legacy admin content route
 * Purpose: Redirect the retired content screen to the live settings editor.
 * Used by: Legacy links to /admin/content.
 * Dependencies: Next.js redirect.
 * Public functions: AdminContent().
 * Side effects: Redirects the current request to /admin/settings.
 */
import { redirect } from 'next/navigation'

export default function AdminContent() {
  redirect('/admin/settings')
}
