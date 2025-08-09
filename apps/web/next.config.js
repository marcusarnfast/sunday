/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cheery-wolf-188.convex.cloud",
      },
    ],
  },
};
export default nextConfig;
