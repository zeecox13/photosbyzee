/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    // Add your image hosting domain here (e.g., S3, Cloudinary)
  },
}

module.exports = nextConfig

