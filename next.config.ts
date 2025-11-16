import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iconictributes.com',
      },
      {
        protocol: 'https',
        hostname: 'www.sfu.ca',
      },
    ],
  },
};

export default nextConfig;
