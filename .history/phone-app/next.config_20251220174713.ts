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
  },
};

export default nextConfig;
