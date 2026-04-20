import type { Metadata } from "next";

import MiamiOxfordHousingPage from "@/components/pages/MiamiOxfordHousingPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Miami Oxford Housing Atlas 2026",
  description:
    "Private August 2026 housing atlas for exemption-case off-campus planning near Miami University Oxford, focused on studios, efficiencies, and true 1BRs.",
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
    title: "Miami Oxford Housing Atlas 2026 | Leadcraft Agency",
    description:
      "Prepared for August 2026 move-in and exemption-case off-campus planning. Private family-share atlas with walkability, cost clarity, and verified contact paths.",
    url: `${siteConfig.siteUrl}/miami-oxford-housing-2026`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miami Oxford Housing Atlas 2026 | Leadcraft Agency",
    description:
      "Prepared for August 2026 move-in and exemption-case off-campus planning. Private atlas with walkability, pricing clarity, and contact links.",
  },
};

export default function MiamiOxfordHousingRoute() {
  return <MiamiOxfordHousingPage />;
}
