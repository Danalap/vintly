/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // Optimized for Render deployment
  output: 'standalone',
};

module.exports = nextConfig;







