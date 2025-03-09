import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '**',
        search: '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

export default nextConfig;
