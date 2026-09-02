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
  async redirects() {
    return [
      {
        source: '/admision-2026',
        destination: '/admision',
        permanent: true,
      },
      {
        source: '/admision-2027',
        destination: '/admision',
        permanent: true,
      },
    ]
  },
  // Standalone desactivado temporalmente para evitar problemas con archivos estáticos
  // ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
}

module.exports = nextConfig

