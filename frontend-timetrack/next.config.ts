import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Deshabilitar generación estática
  trailingSlash: false,
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
