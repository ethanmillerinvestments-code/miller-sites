function readPublicEnv(value: string | undefined, fallback: string) {
  return (value || fallback).trim();
}

export const siteConfig = {
  name: "Leadcraft Agency",
  tagline: "Editorial Websites That Generate Leads For Home-Service Companies",
  siteUrl: readPublicEnv(
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://miller-sites.vercel.app"
  ),
  phoneDisplay: "(513) 815-1826",
  phoneHref: "tel:5138151826",
  email: "leadcraftscale@gmail.com",
  emailHref: "mailto:leadcraftscale@gmail.com",
  calendlyUrl: readPublicEnv(
    process.env.NEXT_PUBLIC_CALENDLY_URL,
    "https://calendly.com/ethanmillerinvestments"
  ),
  founderName: "Ethan Miller",
  locationDisplay: "Cincinnati, Ohio",
  operatingModel: "Direct operator studio",
  responseStandard: "Initial fit review within 1 business day",
  scopeStandard: "Written scope before any payment request",
} as const;

export const guidePages = [
  {
    href: "/about",
    label: "About",
    title: "About Ethan and the Leadcraft operating style",
    description:
      "Why Leadcraft stays direct, lean, and focused on home-service sales paths.",
  },
  {
    href: "/why-leadcraft",
    label: "Why Leadcraft",
    title: "Why the right website changes the sales conversation",
    description:
      "How trust, service clarity, and ownership affect call quality.",
  },
  {
    href: "/seo-readiness",
    label: "SEO Readiness",
    title: "How structure supports future search growth",
    description:
      "How service pages, local relevance, and conversion routing work together.",
  },
  {
    href: "/working-with-leadcraft",
    label: "Working Together",
    title: "What partnering with Leadcraft actually looks like",
    description:
      "Written scope, deposit, hosting posture, launch support, and client ownership.",
  },
  {
    href: "/client-products",
    label: "Proof of Work",
    title: "Fictional proof of work for Leadcraft's portfolio",
    description:
      "Category-specific concept builds showing how Leadcraft structures premium local-service sites.",
  },
] as const;

export const blogPages = [
  {
    href: "/blog",
    label: "Blog",
    title: "Notes on building sites that generate calls",
    description:
      "Insights on website structure, trust signals, and conversion for local service companies.",
  },
] as const;

export const legalPages = [
  {
    href: "/privacy",
    label: "Privacy",
  },
  {
    href: "/terms",
    label: "Terms",
  },
] as const;
