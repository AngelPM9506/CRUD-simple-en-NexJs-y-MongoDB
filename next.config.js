/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    AXIOS_URL_BASE: process.env.AXIOS_URL_BASE
  }
}

module.exports = nextConfig
