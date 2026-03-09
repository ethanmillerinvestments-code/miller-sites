import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import WhyLeadcraftPage from "@/components/pages/WhyLeadcraftPage";

export const metadata: Metadata = {
  title: "Why Leadcraft",
  description:
    "How Leadcraft improves trust, call quality, and handoff clarity for home-service companies.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/why-leadcraft`,
  },
};

export default function WhyLeadcraftRoute() {
  return <WhyLeadcraftPage />;
}
