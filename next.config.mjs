/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000", process.env.NEXT_PUBLIC_APP_URL].filter(Boolean) },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.anthropic.com https://clerk.accounts.dev https://*.clerk.accounts.dev wss://*.supabase.co",
              "frame-src https://js.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // API routes — no caching
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma",        value: "no-cache" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/clerk-js",
        destination: "https://rational-grackle-53.clerk.accounts.dev/npm/@clerk/clerk-js@5.125.13/dist/clerk.browser.js",
      },
      {
        source: "/framework_clerk.browser_dc50cf_5.125.13.js",
        destination: "https://rational-grackle-53.clerk.accounts.dev/npm/@clerk/clerk-js@5.125.13/dist/framework_clerk.browser_dc50cf_5.125.13.js",
      },
      {
        source: "/vendors_clerk.browser_dc50cf_5.125.13.js",
        destination: "https://rational-grackle-53.clerk.accounts.dev/npm/@clerk/clerk-js@5.125.13/dist/vendors_clerk.browser_dc50cf_5.125.13.js",
      },
      {
        source: "/ui-common_clerk.browser_dc50cf_5.125.13.js",
        destination: "https://rational-grackle-53.clerk.accounts.dev/npm/@clerk/clerk-js@5.125.13/dist/ui-common_clerk.browser_dc50cf_5.125.13.js",
      },
      {
        source: "/signin_clerk.browser_dc50cf_5.125.13.js",
        destination: "https://rational-grackle-53.clerk.accounts.dev/npm/@clerk/clerk-js@5.125.13/dist/signin_clerk.browser_dc50cf_5.125.13.js",
      },
      {
        source: "/signup_clerk.browser_dc50cf_5.125.13.js",
        destination: "https://rational-grackle-53.clerk.accounts.dev/npm/@clerk/clerk-js@5.125.13/dist/signup_clerk.browser_dc50cf_5.125.13.js",
      },
      {
        source: "/subscriptionDetails_clerk.browser_dc50cf_5.125.13.js",
        destination: "https://rational-grackle-53.clerk.accounts.dev/npm/@clerk/clerk-js@5.125.13/dist/subscriptionDetails_clerk.browser_dc50cf_5.125.13.js",
      },
    ];
  },
};

export default nextConfig;
// Updated: env vars configured
