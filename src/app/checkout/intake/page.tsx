import type { Metadata } from "next";

import CheckoutIntakePage from "@/components/pages/CheckoutIntakePage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Project Intake",
  description:
    "Submit the company brief for your selected Leadcraft offer so Leadcraft can review scope, timeline, and next steps cleanly.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/checkout/intake`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

type CheckoutIntakeRouteProps = {
  searchParams: Promise<{
    item?: string;
    items?: string;
  }>;
};

export default async function CheckoutIntakeRoute({
  searchParams,
}: CheckoutIntakeRouteProps) {
  const { item, items } = await searchParams;

  return (
    <CheckoutIntakePage
      itemId={item}
      itemIds={items ? items.split(",") : undefined}
    />
  );
}
