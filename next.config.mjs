import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 여기 추가!
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './');
    return config;
  },
};

export default nextConfig;