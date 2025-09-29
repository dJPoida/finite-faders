// next.config.mjs
import withPWA from 'next-pwa'

const isProd = process.env.NODE_ENV === 'production'

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-slider'],
  },
})
