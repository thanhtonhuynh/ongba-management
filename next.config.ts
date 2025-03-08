import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/ems-ongba.appspot.com/o/*",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
