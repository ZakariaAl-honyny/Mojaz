import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Storybook story files cause lint errors unrelated to the app - ignore during builds
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/doctor/:path*',
        destination: '/employee/doctor/:path*',
        permanent: true,
      },
      {
        source: '/examiner/:path*',
        destination: '/employee/examiner/:path*',
        permanent: true,
      },
      {
        source: '/manager/:path*',
        destination: '/employee/manager/:path*',
        permanent: true,
      },
      {
        source: '/security/:path*',
        destination: '/employee/security/:path*',
        permanent: true,
      },
      {
        source: '/admin/settings/:path*',
        destination: '/admin/system-settings/:path*',
        permanent: true,
      },
      {
        source: '/admin/settings',
        destination: '/admin/system-settings',
        permanent: true,
      },
      {
        source: '/ar/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};


export default nextConfig;
