import type { Metadata } from "next";

import MiamiOxfordHousingPage from "@/components/pages/MiamiOxfordHousingPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Miami Oxford Housing Atlas 2026",
  },
  description:
    "Private August 2026 housing atlas for exemption-case off-campus planning near Miami University Oxford, focused on studios, efficiencies, and true 1BRs.",
  keywords: [
    "Miami University Oxford housing",
    "Miami Oxford off campus housing",
    "Miami University exemption housing",
    "Oxford Ohio 1 bedroom housing",
    "Oxford Ohio studio housing",
  ],
  authors: [{ name: "Miami Oxford Housing Atlas" }],
  creator: "Miami Oxford Housing Atlas",
  alternates: {
    canonical: `${siteConfig.siteUrl}/miami-oxford-housing-2026`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Miami Oxford Housing Atlas 2026",
    description:
      "Prepared for August 2026 move-in and exemption-case off-campus planning. Private family-share atlas with campus-anchored walkability, cost clarity, and verified contact paths.",
    url: `${siteConfig.siteUrl}/miami-oxford-housing-2026`,
    siteName: "Miami Oxford Housing Atlas",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miami Oxford Housing Atlas 2026",
    description:
      "Prepared for August 2026 move-in and exemption-case off-campus planning. Private atlas with campus-anchored walkability, pricing clarity, and contact links.",
  },
};

export default function MiamiOxfordHousingRoute() {
  return <MiamiOxfordHousingPage />;
}
