import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  turbopack: {
    root: process.cwd(),
  },

  /**
   * Security Headers Configuration
   * Implements OWASP best practices for web application security
   *
   * References:
   * - OWASP Secure Headers Project
   * - Next.js Security Best Practices
   */
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          // HSTS (HTTP Strict Transport Security)
          // Forces browsers to always use HTTPS connections
          // Prevents MITM attacks and protocol downgrade attacks
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // Content Security Policy (CSP)
          // Prevents XSS, clickjacking, and code injection attacks
          // Defines trusted sources for scripts, styles, images, etc.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://api.railway.app https://*.railway.app https://*.vercel.app",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },

          // X-Frame-Options
          // Prevents clickjacking attacks by controlling iframe embedding
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },

          // X-Content-Type-Options
          // Prevents MIME type sniffing attacks
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // X-XSS-Protection
          // Legacy XSS protection for older browsers
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // Referrer-Policy
          // Controls how much referrer information is shared
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Permissions-Policy (formerly Feature-Policy)
          // Controls which browser features and APIs can be used
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },

          // X-DNS-Prefetch-Control
          // Controls DNS prefetching for performance and privacy
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Additional headers for API routes
        source: "/api/:path*",
        headers: [
          // Prevent caching of sensitive API responses
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
