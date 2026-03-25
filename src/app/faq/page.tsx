import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import CTABanner from "@/components/CTABanner";
import FAQ from "@/components/FAQ";
import { faqs } from "@/lib/faq-data";
import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";
import { buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Leadcraft pricing, timelines, copy ownership, launch process, and optional monthly support plans for home-service websites.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/faq`,
  },
};

const faqSchema = buildFaqSchema(
  faqs.map((f) => ({ question: f.question, answer: f.answer }))
);

export default function FAQRoute() {
  return (
    <SiteShell mainClassName="pt-20 sm:pt-24" showStickyCTA={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />
      <FAQ />
      <CTABanner />
    </SiteShell>
  );
}
