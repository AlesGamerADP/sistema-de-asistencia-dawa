import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
