// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:1992/:path*", // backend
      },
    ];
  },
};

export default nextConfig;
