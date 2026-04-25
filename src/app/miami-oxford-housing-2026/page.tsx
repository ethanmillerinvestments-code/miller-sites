import type { Metadata } from "next";

import MiamiOxfordHousingPage from "@/components/pages/MiamiOxfordHousingPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Miami Oxford Under-$750 Solo Housing Shortlist 2026",
  },
  description:
    "Private August 2026 under-$750 solo housing shortlist for Miami University Oxford studios, efficiencies, and 1BR options with source notes and parent-ready cost checks.",
  keywords: [
    "Miami University Oxford housing",
    "Miami Oxford off campus housing",
    "Miami University exemption housing",
    "Oxford Ohio 1 bedroom housing",
    "Oxford Ohio under 750 rent",
  ],
  authors: [{ name: "Miami Oxford Housing Shortlist" }],
  creator: "Miami Oxford Housing Shortlist",
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
    title: "Miami Oxford Under-$750 Solo Housing Shortlist 2026",
    description:
      "Private family-share shortlist for August 2026 move-in: verified solo options under $750 with rent, Ethan Price, campus distance, Rec distance, and source evidence.",
    url: `${siteConfig.siteUrl}/miami-oxford-housing-2026`,
    siteName: "Miami Oxford Housing Shortlist",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miami Oxford Under-$750 Solo Housing Shortlist 2026",
    description:
      "Private August 2026 under-$750 solo housing shortlist with parent-ready cost checks and source evidence.",
  },
};

export default function MiamiOxfordHousingRoute() {
  return <MiamiOxfordHousingPage />;
}
