import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SummitShieldConceptSite, {
  type SummitView,
} from "@/components/client-products/concepts/SummitShieldConceptSite";
import { getClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

type RouteProps = {
  params: Promise<{
    section?: string[];
  }>;
};

const sectionMeta: Record<SummitView, { title: string; description: string }> = {
  home: {
    title: "Summit Shield Roofing Concept Build",
    description:
      "Inspection-first roofing authority concept with a standalone site system and separate inspection, replacement, and exterior pages.",
  },
  inspection: {
    title: "Summit Shield Inspection Concept",
    description:
      "Roofing inspection concept page built for storm-damage trust, calmer homeowner guidance, and direct inspection booking.",
  },
  replacement: {
    title: "Summit Shield Replacement Concept",
    description:
      "High-ticket roofing replacement concept page with calmer estimate framing, material discussion, and financing posture.",
  },
  exteriors: {
    title: "Summit Shield Exteriors Concept",
    description:
      "Exterior systems concept page connecting roofing, gutters, and siding without generic contractor sprawl.",
  },
};

function resolveView(section?: string[]): SummitView | null {
  if (!section || section.length === 0) {
    return "home";
  }

  if (section.length !== 1) {
    return null;
  }

  const [segment] = section;

  if (segment === "inspection" || segment === "replacement" || segment === "exteriors") {
    return segment;
  }

  return null;
}

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ["inspection"] },
    { section: ["replacement"] },
    { section: ["exteriors"] },
  ];
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const product = getClientProduct("summit-shield-roofing");
  const { section } = await params;
  const view = resolveView(section);

  if (!product || !view) {
    return {
      title: "Concept Not Found",
      robots: { index: false, follow: false },
    };
  }

  const pathname =
    view === "home"
      ? `/client-products/${product.slug}`
      : `/client-products/${product.slug}/${view}`;

  return {
    title: sectionMeta[view].title,
    description: sectionMeta[view].description,
    alternates: {
      canonical: `${siteConfig.siteUrl}${pathname}`,
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
}

export default async function SummitShieldConceptRoute({ params }: RouteProps) {
  const { section } = await params;
  const view = resolveView(section);

  if (!view) {
    notFound();
  }

  return <SummitShieldConceptSite view={view} />;
}
