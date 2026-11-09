import type { NextConfig } from "next";
const config: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Static concept sites exported into /public/<name>/ (e.g. the Zolla Kertkultúra redesign).
  async rewrites() {
    return [
      { source: "/zolla", destination: "/zolla/index.html" },
      { source: "/zolla/", destination: "/zolla/index.html" },
      { source: "/xkft", destination: "/xkft/index.html" },
      { source: "/xkft/", destination: "/xkft/index.html" },
      { source: "/sportpresszo", destination: "/sportpresszo/index.html" },
      { source: "/sportpresszo/", destination: "/sportpresszo/index.html" },
      { source: "/novodom", destination: "/novodom/index.html" },
      { source: "/novodom/", destination: "/novodom/index.html" },
      { source: "/hrvtburgers", destination: "/hrvtburgers/index.html" },
      { source: "/hrvtburgers/", destination: "/hrvtburgers/index.html" },
    ];
  },
};
export default config;
