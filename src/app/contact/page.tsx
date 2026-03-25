import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import Contact from "@/components/Contact";
import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";
import { buildContactPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send your website project request to Leadcraft Agency. Share your current site, market, and goals to receive scope direction within one business day.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/contact`,
  },
};

const contactSchema = buildContactPageSchema();

type ContactRouteProps = {
  searchParams: Promise<{
    package?: string | string[];
    submission?: string | string[];
  }>;
};

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function ContactRoute({
  searchParams,
}: ContactRouteProps) {
  const params = await searchParams;
  const packageInterest = readSearchParam(params.package);
  const submissionKind =
    readSearchParam(params.submission) === "package_inquiry"
      ? "package_inquiry"
      : "contact_inquiry";

  return (
    <SiteShell mainClassName="pt-20 sm:pt-24" showStickyCTA={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <Contact
        packageInterest={packageInterest}
        submissionKind={submissionKind}
      />
    </SiteShell>
  );
}
