import type { Metadata } from "next";

import AboutPage from "@/components/pages/AboutPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ethan and Leadcraft Agency, focused on conversion-led websites for home-service businesses.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/about`,
  },
};

export default function AboutRoute() {
  return <AboutPage />;
}
