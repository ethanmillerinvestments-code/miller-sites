import type { Metadata } from "next";

import CTABanner from "@/components/CTABanner";
import FAQ from "@/components/FAQ";
import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Leadcraft pricing, timelines, copy, ownership, and optional monthly support.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/faq`,
  },
};

export default function FAQRoute() {
  return (
    <SiteShell mainClassName="pt-20 sm:pt-24" showStickyCTA={false}>
      <FAQ />
      <CTABanner />
    </SiteShell>
  );
}
