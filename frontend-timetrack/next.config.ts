import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Usar SSR (Server-Side Rendering)
  output: 'standalone',
  trailingSlash: false,
  // Habilitar SSR
  async generateBuildId() {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
