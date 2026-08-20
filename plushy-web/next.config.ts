import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nltcpvneuapohmqpdvfy.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      // Admins can paste any image URL (or a Google Drive link) for homepage
      // media — those are unpredictable hosts, so allow any https source here.
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
