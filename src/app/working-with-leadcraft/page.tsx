import type { Metadata } from "next";

import WorkingWithLeadcraftPage from "@/components/pages/WorkingWithLeadcraftPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Working With Leadcraft",
  description:
    "What partnering with Leadcraft looks like, including communication, execution, launch support, and monthly paths.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/working-with-leadcraft`,
  },
};

export default function WorkingWithLeadcraftRoute() {
  return <WorkingWithLeadcraftPage />;
}
