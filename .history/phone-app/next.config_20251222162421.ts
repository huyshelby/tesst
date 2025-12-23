import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Backend/local dev
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
      // Any HTTPS CDN or backend host in prod
      { protocol: "https", hostname: "**" },
      // Existing sample images
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
};

export default nextConfig;
