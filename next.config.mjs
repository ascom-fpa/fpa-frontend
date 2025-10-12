import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

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
  reactStrictMode: false,

  // ✅ Image Optimization + Long-Term Cache for R2
  images: {
    unoptimized: false, // allow Next to optimize and cache
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev', // all your R2 buckets
      },
    ],
  },

  // ✅ Apply cache headers to static assets (optional)
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)