/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ['@capacitor-community/speech-recognition'],
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig
