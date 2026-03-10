import Link from "next/link";

import {
  ArrowRight,
  Compass,
  Grid2X2,
  Layers3,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

import type { ClientProduct } from "@/lib/client-products";
import { cn } from "@/lib/utils";

type ClientProductCardProps = {
  product: ClientProduct;
  featured?: boolean;
  className?: string;
};

const quickRoutes: Record<string, Array<{ label: string; href: string }>> = {
  "northline-climate": [
    { label: "Repair", href: "/client-products/northline-climate/repair" },
    { label: "Install", href: "/client-products/northline-climate/install" },
    { label: "Coverage", href: "/client-products/northline-climate/coverage" },
  ],
  "summit-shield-roofing": [
    { label: "Inspection", href: "/client-products/summit-shield-roofing/inspection" },
    { label: "Replacement", href: "/client-products/summit-shield-roofing/replacement" },
    { label: "Exteriors", href: "/client-products/summit-shield-roofing/exteriors" },
  ],
  "fieldform-outdoor-living": [
    { label: "Galleries", href: "/client-products/fieldform-outdoor-living/galleries" },
    { label: "Services", href: "/client-products/fieldform-outdoor-living/services" },
    { label: "Process", href: "/client-products/fieldform-outdoor-living/process" },
  ],
};

function CardPreview({ product }: { product: ClientProduct }) {
  if (product.slug === "northline-climate") {
    return (
      <div className="rounded-[1.8rem] border border-cyan-300/22 bg-[linear-gradient(160deg,#08131f,#0f1b2a)] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between">
          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-cyan-200/70">
            Dispatch board
          </span>
          <PhoneCall className="h-4 w-4 text-[#d8a86d]" />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="h-2 w-20 rounded-full bg-white/20" />
            <div className="mt-4 space-y-2">
              <div className="h-6 rounded-full bg-white/90" />
              <div className="h-6 w-[78%] rounded-full bg-cyan-200/55" />
              <div className="h-6 w-[62%] rounded-full bg-[#d8a86d]/55" />
            </div>
          </div>
          <div className="grid gap-2">
            {["Urgent repair", "Install confidence", "Coverage utility"].map((item, index) => (
              <div
                key={item}
                className={`rounded-[1rem] border p-3 text-xs uppercase tracking-[0.18em] ${
                  index === 0
                    ? "border-[#d8a86d]/24 bg-[#d8a86d]/10 text-[#f8dab4]"
                    : "border-white/10 bg-white/[0.03] text-white/72"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (product.slug === "summit-shield-roofing") {
    return (
      <div className="rounded-[1.8rem] border border-black/10 bg-[linear-gradient(180deg,#fff8ef,#f2e5d4)] p-5 text-[#181310] shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between">
          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#8b6335]">
            Inspection-first
          </span>
          <ShieldCheck className="h-4 w-4 text-[#b87a3a]" />
        </div>
        <div className="mt-5 rounded-[1.45rem] bg-[#181411] p-5 text-[#f5ede2]">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#f0c790]">
            Premium authority lane
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Inspect", "Replace", "Coordinate"].map((item) => (
              <div key={item} className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-4 text-center text-[0.64rem] uppercase tracking-[0.18em]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.8rem] border border-[#d7c7b3] bg-[linear-gradient(180deg,#fbf5eb,#f0e5d7)] p-5 text-[#241e18] shadow-[0_24px_70px_rgba(75,56,32,0.1)]">
      <div className="flex items-center justify-between">
        <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#7e9567]">
          Editorial browse
        </span>
        <Grid2X2 className="h-4 w-4 text-[#7e9567]" />
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[1.4rem] bg-[linear-gradient(150deg,#d9c0a0,#b7c7a9)] p-4">
          <div className="h-[124px] rounded-[1.2rem] bg-white/40" />
          <p className="mt-4 text-xl leading-tight [font-family:var(--font-display)]">
            Gallery-led project storytelling.
          </p>
        </div>
        <div className="grid gap-2">
          {["Galleries", "Services", "Process"].map((item, index) => (
            <div
              key={item}
              className={`rounded-[1rem] border px-4 py-4 text-[0.68rem] uppercase tracking-[0.18em] ${
                index === 0
                  ? "border-[#7e9567]/26 bg-[#7e9567]/10 text-[#314126]"
                  : "border-[#d7c7b3] bg-white/80 text-[#5c5147]"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClientProductCard({
  product,
  featured = false,
  className,
}: ClientProductCardProps) {
  const routes = quickRoutes[product.slug] ?? [
    { label: "Overview", href: `/client-products/${product.slug}` },
  ];

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.18)]",
        featured ? "sm:p-6" : "",
        className
      )}
    >
      <div className={cn("grid gap-6", featured ? "xl:grid-cols-[0.98fr_1.02fr] xl:items-center" : "")}>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone-300">
              {product.industry}
            </span>
            <span className="rounded-full border border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.08)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
              Standalone concept site
            </span>
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
            {product.company}
          </p>
          <h3 className={cn("section-title mt-3 text-stone-50", featured ? "text-4xl sm:text-5xl" : "text-3xl")}>
            {product.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
            {product.summary}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">{product.atmosphere}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {routes.map((route, index) => (
              <Link
                key={route.href}
                href={route.href}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  index === 0
                    ? "border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.08)] text-[color:var(--accent-strong)]"
                    : "border-white/10 bg-white/[0.03] text-stone-300 hover:text-stone-50"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={`/client-products/${product.slug}`} className="button-secondary px-5 py-3 text-sm">
              Enter concept site
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href={routes[0].href}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.22)] hover:text-stone-50"
            >
              Jump to subpage
              {product.slug === "northline-climate" ? (
                <PhoneCall className="h-4 w-4" />
              ) : product.slug === "summit-shield-roofing" ? (
                <Compass className="h-4 w-4" />
              ) : (
                <Layers3 className="h-4 w-4" />
              )}
            </Link>
          </div>
        </div>

        <CardPreview product={product} />
      </div>
    </article>
  );
}
