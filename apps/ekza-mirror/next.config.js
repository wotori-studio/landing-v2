/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/analytics", "@repo/ui"],
  // No `images.remotePatterns`: every <Image> src in this app is now a local
  // asset under `public/` (avatar cards live in `public/img/cards`). The VRM
  // `modelUrl`s still point at arweave/pinata, but those are plain `fetch`
  // downloads in the browser, not `next/image` requests, so they need no
  // pattern here.
};

module.exports = nextConfig;
