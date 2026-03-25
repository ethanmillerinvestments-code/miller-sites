import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import AboutPage from "@/components/pages/AboutPage";
import { siteConfig } from "@/lib/site";
import { buildWebPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Ethan Miller, the operator behind Leadcraft Agency. Direct founder-led website builds for HVAC, plumbing, roofing, and local service companies.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/about`,
  },
};

const aboutSchema = buildWebPageSchema({
  name: "About Leadcraft Agency",
  description:
    "Meet Ethan Miller, the operator behind Leadcraft Agency. Direct founder-led website builds for HVAC, plumbing, roofing, and local service companies.",
  url: `${siteConfig.siteUrl}/about`,
});

export default function AboutRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutPage
        breadcrumbs={
          <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
        }
      />
    </>
  );
}
