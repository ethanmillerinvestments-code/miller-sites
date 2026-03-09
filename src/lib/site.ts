export const siteConfig = {
  name: "Leadcraft Agency",
  tagline: "Home-Service Websites That Turn Clicks Into Booked Calls",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://miller-sites.vercel.app",
  phoneDisplay: "(513) 815-1826",
  phoneHref: "tel:5138151826",
  email: "ethanmillerinvestments@gmail.com",
  emailHref: "mailto:ethanmillerinvestments@gmail.com",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/ethanmillerinvestments",
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
      "Communication, launch support, monthly options, and client ownership.",
  },
] as const;
