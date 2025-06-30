import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // webpack: (config: any, { isServer }: { isServer: boolean }) => {
  //   // Handle Three.js and other client-side libraries
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       net: false,
  //       tls: false,
  //     };
  //   }

  //   // Handle WebAssembly
  //   config.experiments = {
  //     ...config.experiments,
  //     asyncWebAssembly: true,
  //   };

  //   return config;
  // },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
}

module.exports = nextConfig
