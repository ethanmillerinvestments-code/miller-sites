import type { Metadata } from "next";

import SeoReadinessPage from "@/components/pages/SeoReadinessPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "SEO Readiness",
  description:
    "How home-service SEO structure supports future growth without fake claims or ranking promises.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/seo-readiness`,
  },
};

export default function SeoReadinessRoute() {
  return <SeoReadinessPage />;
}
