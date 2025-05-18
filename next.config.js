// next.config.js

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: [
      'www.kopis.or.kr',
      'www.culture.go.kr',
      'image.tmdb.org',
      'www.themoviedb.org',
      'i.namu.wiki',
    ],
  },
};

module.exports = nextConfig;