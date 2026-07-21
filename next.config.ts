import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // xuất tĩnh -> deploy Netlify một chạm (chưa cần server)
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
