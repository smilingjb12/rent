import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.otodom.pl', 'apollo-ireland.akamaized.net', 'img.otodom.pl'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['pg'],
};

export default nextConfig;
