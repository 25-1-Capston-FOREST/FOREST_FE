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

    domains: ['image.tmdb.org'], // 필요한 도메인들 다 나열

  },
};

module.exports = nextConfig;