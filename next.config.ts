import type { NextConfig } from 'next'
import path from 'path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  // Type-checking is enforced in CI (tsc --noEmit). Skipping it during
  // `next build` avoids the memory-heavy TypeScript pass that was
  // OOM-killing the production Docker build on the server.
  // Note: an `eslint: { ignoreDuringBuilds: true }` key was previously added
  // here too, but `eslint` is not a valid NextConfig property on this
  // Next.js version — it broke `tsc --noEmit` in CI (TS2353) without ever
  // being needed, since `next build` here doesn't run ESLint and CI's
  // lint-and-typecheck job never calls `npm run lint` either.
  typescript: { ignoreBuildErrors: true },
  // Fix workspace root detection warning (non-ASCII chars in parent path)
  outputFileTracingRoot: path.join(__dirname),
  // Server external packages (needed for Prisma adapter)
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-avatar',
      '@radix-ui/react-slider',
    ],
  },
  // Degraissage des pages publiques (session 15.6, ROADMAP.md §15.6) : ces
  // routes sont fusionnees/retirees du public, rien n'est supprime en base.
  async redirects() {
    return [
      { source: '/lumens', destination: '/points', permanent: true },
      { source: '/lumens/:path*', destination: '/points', permanent: true },
      { source: '/tv/live', destination: '/tv', permanent: true },
      { source: '/tv/live/:path*', destination: '/tv', permanent: true },
      { source: '/produce', destination: '/create', permanent: true },
      { source: '/act', destination: '/create/casting', permanent: true },
      { source: '/tv/invest', destination: '/invest', permanent: true },
      // Session 15.11 : l'outil « Studio Bande-Annonce » devient « Mini Studio ».
      { source: '/trailer-studio', destination: '/mini-studio', permanent: true },
      { source: '/trailer-studio/:path*', destination: '/mini-studio/:path*', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
