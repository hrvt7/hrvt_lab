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
      { source: "/cristiano", destination: "/cristiano/index.html" },
      { source: "/cristiano/", destination: "/cristiano/index.html" },
      { source: "/cristiano/de", destination: "/cristiano/de/index.html" },
      { source: "/cristiano/de/", destination: "/cristiano/de/index.html" },
      { source: "/priorite", destination: "/priorite/index.html" },
      { source: "/priorite/", destination: "/priorite/index.html" },
      { source: "/cleankong", destination: "/cleankong/index.html" },
      { source: "/cleankong/", destination: "/cleankong/index.html" },
      { source: "/gamersgarage", destination: "/gamersgarage/index.html" },
      { source: "/gamersgarage/", destination: "/gamersgarage/index.html" },
      { source: "/harlekin", destination: "/harlekin/index.html" },
      { source: "/harlekin/", destination: "/harlekin/index.html" },
      { source: "/harlekin/adatkezeles", destination: "/harlekin/adatkezeles/index.html" },
      { source: "/harlekin/adatkezeles/", destination: "/harlekin/adatkezeles/index.html" },
    ];
  },
};
export default config;
