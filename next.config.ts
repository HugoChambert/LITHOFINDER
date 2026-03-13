import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to https://username.github.io/lithofinder (a project page),
  // uncomment and set this to your repo name:
  // basePath: '/lithofinder',
  // assetPrefix: '/lithofinder/',
};

export default nextConfig;
