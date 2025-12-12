/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'photosbyzee.com', 'photosbyzee.vercel.app'],
    // Add your image hosting domain here (e.g., S3, Cloudinary)
  },
  // Ensure Prisma works in Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
    }
    return config;
  },
}

module.exports = nextConfig

