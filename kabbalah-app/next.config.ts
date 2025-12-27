import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly use Turbopack (Next.js 16 default)
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
};

export default nextConfig;
