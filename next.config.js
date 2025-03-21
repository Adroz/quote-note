/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: process.env.NODE_ENV === 'production' ? '/quote-note' : '',
  // This setting may be needed if your repo name doesn't match the base path
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/quote-note/' : '',
};

module.exports = nextConfig; 