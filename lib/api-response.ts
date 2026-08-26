/**
 * Module: API response helpers
 * Purpose: Provide the canonical error envelope for route handlers.
 * Used by: API routes returning validation, authorization, conflict, and server errors.
 * Dependencies: NextResponse.
 * Public functions: apiError().
 * Side effects: None; creates JSON responses only.
 */
import { NextResponse } from 'next/server'

export function apiError(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json({ success: false, error: { code, message, ...(details === undefined ? {} : { details }) } }, { status })
}
