import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

// Only use PWA in development - Cloudflare doesn't need it
if (process.env.NODE_ENV === 'development') {
  const withPWA = withPWAInit({
    dest: "public",
    disable: false,
    register: true,
    scope: "/",
    sw: "service-worker.js",
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
