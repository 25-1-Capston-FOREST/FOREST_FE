// next.config.js

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: ['www.kopis.or.kr'], // ✅ 외부 이미지 도메인 추가!
  },
};

module.exports = nextConfig;