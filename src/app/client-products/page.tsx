import type { Metadata } from "next";

import ClientProductsDirectoryPage from "@/components/client-products/ClientProductsDirectoryPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Proof Of Work",
  description:
    "Fictional proof-of-work concepts by Leadcraft Agency showing category-specific website direction for roofing, HVAC, and outdoor-living businesses.",
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
  return <ClientProductsDirectoryPage />;
}
