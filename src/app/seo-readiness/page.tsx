import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import SeoReadinessPage from "@/components/pages/SeoReadinessPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "SEO Readiness",
  description:
    "How service-page structure, metadata, and conversion routing prepare home-service websites for local search growth without ranking promises.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/seo-readiness`,
  },
};

export default function SeoReadinessRoute() {
  return (
    <SeoReadinessPage
      breadcrumbs={
        <Breadcrumbs
          items={[{ label: "SEO Readiness", href: "/seo-readiness" }]}
        />
      }
    />
  );
}
