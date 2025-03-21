/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  // Remove basePath for Firebase Hosting
  // basePath: process.env.NODE_ENV === 'production' ? '/quote-note' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/quote-note/' : '',
};

module.exports = nextConfig; 