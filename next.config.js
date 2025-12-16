/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
    unoptimized: false,
  },
  // Optimizaciones para desarrollo
  swcMinify: true,
  // Compilación más rápida en desarrollo
  experimental: {
    optimizeCss: false,
  },
  // Solo usar standalone en producción
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
}

module.exports = nextConfig

