import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NorthlineConceptSite, {
  type NorthlineView,
} from "@/components/client-products/concepts/NorthlineConceptSite";
import { getClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

type RouteProps = {
  params: Promise<{
    section?: string[];
  }>;
};

const sectionMeta: Record<NorthlineView, { title: string; description: string }> = {
  home: {
    title: "Northline Climate Co. Concept Build",
    description:
      "Dispatch-first HVAC concept site with standalone routing, industrial typography, and separate repair, install, and coverage views.",
  },
  repair: {
    title: "Northline Repair Page Concept",
    description:
      "Symptom-first HVAC repair concept page with urgent CTA structure and operational trust framing.",
  },
  install: {
    title: "Northline Install Page Concept",
    description:
      "Standalone HVAC install concept page for replacement planning, estimate flow, and financing posture.",
  },
  coverage: {
    title: "Northline Coverage Page Concept",
    description:
      "HVAC concept utility page for service-area logic, after-hours policy, and maintenance support positioning.",
  },
};

function resolveView(section?: string[]): NorthlineView | null {
  if (!section || section.length === 0) {
    return "home";
  }

  if (section.length !== 1) {
    return null;
  }

  const [segment] = section;

  if (segment === "repair" || segment === "install" || segment === "coverage") {
    return segment;
  }

  return null;
}

export function generateStaticParams() {
  return [{ section: [] }, { section: ["repair"] }, { section: ["install"] }, { section: ["coverage"] }];
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const product = getClientProduct("northline-climate");
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

export default async function NorthlineConceptRoute({ params }: RouteProps) {
  const { section } = await params;
  const view = resolveView(section);

  if (!view) {
    notFound();
  }

  return <NorthlineConceptSite view={view} />;
}
