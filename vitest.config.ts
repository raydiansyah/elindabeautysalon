/**
 * Module: Vitest configuration
 * Purpose: Configure isolated Node.js unit tests for pure application logic.
 * Used by: npm test and CI test jobs.
 * Dependencies: Vitest configuration API.
 * Public functions: Default Vitest configuration export.
 * Side effects: Discovers and executes tests; no application or database writes.
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.{test,spec}.ts'],
  },
})
