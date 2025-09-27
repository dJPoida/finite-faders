// next.config.mjs
import withPWA from 'next-pwa'

const isProd = process.env.NODE_ENV === 'production'

export default withPWA({
  dest: 'public',
  disable: !isProd,          // enable SW only on prod builds
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-slider'],
  },
})
