import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import ClientProductsDirectoryPage from "@/components/client-products/ClientProductsDirectoryPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Proof Of Work",
  description:
    "Category-specific concept builds by Leadcraft Agency showing website direction for roofing, HVAC, and outdoor-living local service companies.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/client-products`,
  },
  openGraph: {
    title: "Proof Of Work | Leadcraft Agency",
    description:
      "Fictional proof-of-work concepts for high-ticket local-service website systems.",
    url: `${siteConfig.siteUrl}/client-products`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proof Of Work | Leadcraft Agency",
    description:
      "Fictional proof-of-work concepts for high-ticket local-service website systems.",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function ClientProductsIndexRoute() {
  return (
    <ClientProductsDirectoryPage
      breadcrumbs={
        <Breadcrumbs
          items={[{ label: "Proof of Work", href: "/client-products" }]}
        />
      }
    />
  );
}
