import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FieldformConceptSite, {
  type FieldformView,
} from "@/components/client-products/concepts/FieldformConceptSite";
import { getClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

type RouteProps = {
  params: Promise<{
    section?: string[];
  }>;
};

const sectionMeta: Record<FieldformView, { title: string; description: string }> = {
  home: {
    title: "Fieldform Outdoor Living Concept Build",
    description:
      "Standalone outdoor-living concept site with centered editorial layout, dedicated galleries, service lanes, and process pages.",
  },
  galleries: {
    title: "Fieldform Galleries Concept",
    description:
      "Image-forward outdoor-living gallery concept with softer motion, category chips, and curated visual browse patterns.",
  },
  services: {
    title: "Fieldform Services Concept",
    description:
      "Outdoor-living service concept page for design, build, and care presented in a calmer editorial system.",
  },
  process: {
    title: "Fieldform Process Concept",
    description:
      "Outdoor-living process concept page that turns planning, scope, and communication into the trust layer.",
  },
};

function resolveView(section?: string[]): FieldformView | null {
  if (!section || section.length === 0) {
    return "home";
  }

  if (section.length !== 1) {
    return null;
  }

  const [segment] = section;

  if (segment === "galleries" || segment === "services" || segment === "process") {
    return segment;
  }

  return null;
}

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ["galleries"] },
    { section: ["services"] },
    { section: ["process"] },
  ];
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const product = getClientProduct("fieldform-outdoor-living");
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

export default async function FieldformConceptRoute({ params }: RouteProps) {
  const { section } = await params;
  const view = resolveView(section);

  if (!view) {
    notFound();
  }

  return <FieldformConceptSite view={view} />;
}
