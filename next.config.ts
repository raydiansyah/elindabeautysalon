/**
 * Module: Next.js configuration
 * Purpose: Configure production security headers for deployed App Router traffic.
 * Used by: Next.js build and Vercel deployment.
 * Dependencies: NextConfig type and Node environment variables.
 * Public functions: Default NextConfig export.
 * Side effects: Adds HSTS response headers in production only.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    if (process.env.NODE_ENV !== 'production') return []
    return [{
      source: '/(.*)',
      headers: [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
    }]
  },
};

export default nextConfig;
