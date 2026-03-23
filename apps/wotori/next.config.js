/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/locales", "@repo/analytics"],
};

module.exports = nextConfig;
