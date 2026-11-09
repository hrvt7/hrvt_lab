import type { NextConfig } from "next";
const config: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Static concept sites exported into /public/<name>/ (e.g. the Zolla Kertkultúra redesign).
  async rewrites() {
    return [
      { source: "/zolla", destination: "/zolla/index.html" },
      { source: "/zolla/", destination: "/zolla/index.html" },
    ];
  },
};
export default config;
