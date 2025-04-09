// next.config.js

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: ['www.kopis.or.kr'],
    domains: ['i.namu.wiki'],
    domains: ['www.culture.go.kr'],
    domains: ['https://i.namu.wiki'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.namu.wiki',
      },
    ],
  },
};

module.exports = nextConfig;