import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import WorkingWithLeadcraftPage from "@/components/pages/WorkingWithLeadcraftPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Working With Leadcraft",
  description:
    "The Leadcraft buying process from brief through launch, including written scope, deposit structure, revision rounds, hosting, and handoff paths.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/working-with-leadcraft`,
  },
};

export default function WorkingWithLeadcraftRoute() {
  return (
    <WorkingWithLeadcraftPage
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: "Working With Leadcraft",
              href: "/working-with-leadcraft",
            },
          ]}
        />
      }
    />
  );
}
