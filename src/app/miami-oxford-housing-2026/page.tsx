import type { Metadata } from "next";

import MiamiOxfordHousingPage from "@/components/pages/MiamiOxfordHousingPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Miami Oxford Under-$700 1BR Shortlist 2026",
  },
  description:
    "Private strict shortlist of verified 2026-2027 Miami University Oxford 1BR/1BA options with posted 8/1/26 availability and rent upper bounds under $700.",
  keywords: [
    "Miami University Oxford housing",
    "Miami Oxford off campus housing",
    "Miami University exemption housing",
    "Oxford Ohio 1 bedroom housing",
    "Oxford Ohio under 700 rent",
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
    title: "Miami Oxford Under-$700 1BR Shortlist 2026",
    description:
      "Private family-share shortlist for August 2026 move-in: three verified 1BR/1BA options under $700 with campus and Rec distance context.",
    url: `${siteConfig.siteUrl}/miami-oxford-housing-2026`,
    siteName: "Miami Oxford Housing Shortlist",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miami Oxford Under-$700 1BR Shortlist 2026",
    description:
      "Private strict shortlist of three verified Miami Oxford 1BR/1BA options under $700 for 8/1/26 availability.",
  },
};

export default function MiamiOxfordHousingRoute() {
  return <MiamiOxfordHousingPage />;
}
