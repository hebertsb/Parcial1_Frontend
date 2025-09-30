/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuración para Netlify - Exportación estática
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Optimizaciones para desarrollo
  swcMinify: true,
  experimental: {
    turbo: {},
  },
}

export default nextConfig