/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/prodeenDemo',
    assetPrefix: '/prodeenDemo',
    trailingSlash: true,
    images: { unoptimized: true },
    // Add this to ensure CSS is processed correctly
    webpack: (config) => {
      return config;
    },
  };
  
  module.exports = nextConfig;