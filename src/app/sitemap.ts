import { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/why-leadcraft",
    "/seo-readiness",
    "/working-with-leadcraft",
  ] as const;

  return routes.map((route, index): MetadataRoute.Sitemap[number] => ({
      url: `${siteConfig.siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: index === 0 ? 1 : 0.8,
    }));
}
