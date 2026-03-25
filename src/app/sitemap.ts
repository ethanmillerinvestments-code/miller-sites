import { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog";
import { getClientProductSlugs } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

type RouteConfig = {
  path: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
};

const coreRoutes: RouteConfig[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/contact", priority: 0.9, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "weekly" },
  { path: "/why-leadcraft", priority: 0.7, changeFrequency: "weekly" },
  { path: "/seo-readiness", priority: 0.7, changeFrequency: "weekly" },
  {
    path: "/working-with-leadcraft",
    priority: 0.7,
    changeFrequency: "weekly",
  },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/client-products", priority: 0.6, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
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

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = [
    ...clientProductRoutes,
    ...clientProductSubroutes,
  ].map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogPosts = getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...coreEntries, ...productEntries, ...blogEntries];
}
