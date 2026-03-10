import type { Metadata } from "next";

import Contact from "@/components/Contact";
import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send Leadcraft your current site, main problem, and timeline to get direction on fit, scope, and next steps.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/contact`,
  },
};

export default function ContactRoute() {
  return (
    <SiteShell mainClassName="pt-20 sm:pt-24" showStickyCTA={false}>
      <Contact />
    </SiteShell>
  );
}
