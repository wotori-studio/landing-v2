/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/analytics", "@repo/ui"],
};

module.exports = nextConfig;
