import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server external packages for PDF processing
  serverExternalPackages: ["unpdf"],

  // Empty turbopack config to use Turbopack (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
