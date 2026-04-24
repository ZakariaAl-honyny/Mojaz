import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Storybook story files cause lint errors unrelated to the app - ignore during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
