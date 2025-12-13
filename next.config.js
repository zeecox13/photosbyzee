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
  // Explicitly expose environment variables (though they should work automatically)
  env: {
    // These are already available via process.env, but explicitly listing them
    // can help with some edge cases
  },
}

module.exports = nextConfig

