/**
 * Module: Clerk route proxy
 * Purpose: Protect admin pages and API routes with the Clerk session boundary.
 * Used by: Next.js 16.2 proxy request pipeline.
 * Dependencies: @clerk/nextjs/server.
 * Public functions: proxy default export and route matcher configuration.
 * Side effects: Reads and refreshes Clerk session cookies; no application writes.
 */
import { clerkMiddleware } from '@clerk/nextjs/server'
import { createCorrelationId, logRequest } from './lib/request-logger'

const proxy = clerkMiddleware(async (auth, request) => {
  const startedAt = Date.now()
  const correlationId = createCorrelationId(request)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/admin/login')
  let status = 200
  let userId: string | null = null

  try {
    userId = (await auth()).userId
    if (isAdminRoute && !isLoginRoute) await auth.protect()
  } catch (error) {
    status = error instanceof Response ? error.status : 500
    throw error
  } finally {
    logRequest({
      correlationId,
      durationMs: Date.now() - startedAt,
      method: request.method,
      path: request.nextUrl.pathname,
      status,
      userId,
    })
  }
})

export { proxy }
export default proxy

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
