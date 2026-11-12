import type { MetadataRoute } from "next";

/** Only the studio's own page is listed; concept and sample pages stay out of the sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://hrvt.vercel.app/", changeFrequency: "monthly", priority: 1 }];
}
