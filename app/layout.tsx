/**
 * Module: Root application layout
 * Purpose: Configure global fonts, PWA metadata, styles, and Clerk auth context.
 * Used by: Every App Router page.
 * Dependencies: Next metadata/fonts, @clerk/nextjs, global CSS.
 * Public functions: RootLayout().
 * Side effects: Provides Clerk session context to client components.
 */
import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import PWARegister from '@/components/PWARegister'
import "./globals.css";

export const metadata: Metadata = {
  title: "Salon Kecantikan & Wellness Terbaik",
  description: "Salon kecantikan profesional dengan layanan terbaik: hair styling, facial treatment, spa, nail art, dan makeup.",
  keywords: ["beauty salon", "hair styling", "facial treatment", "spa", "nail art", "makeup", "wellness"],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground"><ClerkProvider><PWARegister />{children}</ClerkProvider></body>
    </html>
  );
}
