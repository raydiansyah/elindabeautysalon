/**
 * Module: Structured request logger
 * Purpose: Emit searchable request events for Vercel Logs with a safe correlation ID.
 * Used by: proxy.ts at the Next.js request boundary.
 * Dependencies: Web Crypto API and console transport provided by the runtime.
 * Public functions: createCorrelationId(), logRequest().
 * Side effects: Writes structured JSON events to the runtime log stream; never writes request bodies or secrets.
 */

export function createCorrelationId(request: Request) {
  return request.headers.get('x-correlation-id') ?? crypto.randomUUID()
}

export function logRequest(input: {
  correlationId: string
  durationMs: number
  method: string
  path: string
  status: number
  userId?: string | null
}) {
  const event = {
    event: 'http.request',
    correlation_id: input.correlationId,
    duration_ms: input.durationMs,
    method: input.method,
    path: input.path,
    status: input.status,
    user_id: input.userId ?? null,
  }

  if (input.status >= 500) {
    console.error(JSON.stringify(event))
  } else if (input.status >= 400) {
    console.warn(JSON.stringify(event))
  } else {
    console.info(JSON.stringify(event))
  }
}
