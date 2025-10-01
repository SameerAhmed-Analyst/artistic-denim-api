/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontendNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  }
});

const nextConfig = {
  async rewrites() {
    return [
      {
        // source: "/api/proxy/:path*",
        // destination: "http://ems.am5pearl.com:8000/:path*",
        source: '/query', // The endpoint in your frontend you want to rewrite
        destination: 'http://ems.am5pearl.com:5000/query', // The target API URL
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
