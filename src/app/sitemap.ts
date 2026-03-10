import { MetadataRoute } from "next";

import { getClientProductSlugs } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/client-products",
    "/contact",
    "/faq",
    "/why-leadcraft",
    "/seo-readiness",
    "/working-with-leadcraft",
  ];

  const clientProductRoutes = getClientProductSlugs().map(
    (slug) => `/client-products/${slug}`
  );
  const clientProductSubroutes = [
    "/client-products/northline-climate/repair",
    "/client-products/northline-climate/install",
    "/client-products/northline-climate/coverage",
    "/client-products/summit-shield-roofing/inspection",
    "/client-products/summit-shield-roofing/replacement",
    "/client-products/summit-shield-roofing/exteriors",
    "/client-products/fieldform-outdoor-living/galleries",
    "/client-products/fieldform-outdoor-living/services",
    "/client-products/fieldform-outdoor-living/process",
  ];

  return [...routes, ...clientProductRoutes, ...clientProductSubroutes].map(
    (route, index): MetadataRoute.Sitemap[number] => ({
      url: `${siteConfig.siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: index === 0 ? 1 : 0.8,
    })
  );
}
