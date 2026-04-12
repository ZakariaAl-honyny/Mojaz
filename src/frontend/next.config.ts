import type { NextConfig } from "next";
import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl();

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  /* config options here */
};

export default withNextIntl(nextConfig);