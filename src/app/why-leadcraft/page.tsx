import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import WhyLeadcraftPage from "@/components/pages/WhyLeadcraftPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Why Leadcraft",
  description:
    "How trust, mobile CTA clarity, and cleaner ownership improve call quality and close rates for HVAC, plumbing, roofing, and local service companies.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/why-leadcraft`,
  },
};

export default function WhyLeadcraftRoute() {
  return (
    <WhyLeadcraftPage
      breadcrumbs={
        <Breadcrumbs
          items={[{ label: "Why Leadcraft", href: "/why-leadcraft" }]}
        />
      }
    />
  );
}
