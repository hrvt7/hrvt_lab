import type { MetadataRoute } from "next";

/** Only the studio's own pages are listed; concept and sample pages stay out of the sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hrvtmotion.com/", changeFrequency: "monthly", priority: 1 },
    { url: "https://hrvtmotion.com/foto", changeFrequency: "monthly", priority: 0.5 },
  ];
}
