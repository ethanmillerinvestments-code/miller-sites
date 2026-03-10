"use client";

import { startTransition, useDeferredValue, useState } from "react";

import type { ClientProduct } from "@/lib/client-products";
import { cn } from "@/lib/utils";

type ClientProductGalleryProps = {
  product: ClientProduct;
};

type GalleryCategory = {
  id: string;
  label: string;
  description: string;
};

type GalleryItem = {
  id: string;
  categoryId: string;
  tone: keyof typeof toneStyles;
  layout: keyof typeof layoutStyles;
  eyebrow: string;
  mediaLabel: string;
  title: string;
  description: string;
};

type ClientProductGalleryDetail = {
  gallery: {
    categories: GalleryCategory[];
    items: GalleryItem[];
    note: string;
  };
};

const toneStyles = {
  sage: "from-[rgba(186,195,155,0.34)] via-[rgba(235,229,218,0.08)] to-[rgba(28,30,23,0.62)]",
  sandstone: "from-[rgba(216,181,138,0.36)] via-[rgba(255,255,255,0.1)] to-[rgba(30,26,21,0.62)]",
  bark: "from-[rgba(99,72,50,0.42)] via-[rgba(226,208,188,0.08)] to-[rgba(26,22,18,0.64)]",
  clay: "from-[rgba(172,123,98,0.34)] via-[rgba(255,255,255,0.08)] to-[rgba(31,24,22,0.62)]",
  charcoal: "from-[rgba(78,81,73,0.26)] via-[rgba(255,255,255,0.08)] to-[rgba(18,19,18,0.82)]",
} as const;

const layoutStyles = {
  wide: "sm:col-span-2 min-h-[220px]",
  portrait: "min-h-[320px]",
  square: "min-h-[260px]",
} as const;

export default function ClientProductGallery({
  product,
}: ClientProductGalleryProps) {
  const detail = product.detail as ClientProductGalleryDetail;
  const categories = detail.gallery.categories;
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "all");
  const deferredCategory = useDeferredValue(activeCategory);

  const visibleItems = detail.gallery.items.filter(
    (item: GalleryItem) =>
      deferredCategory === "all" || item.categoryId === deferredCategory
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[0.34fr_0.66fr]">
      <div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => startTransition(() => setActiveCategory(category.id))}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200",
                  isActive
                    ? "text-stone-950"
                    : "border-white/10 bg-white/[0.03] text-stone-300 hover:border-white/20 hover:text-stone-100"
                )}
                style={
                  isActive
                    ? {
                        borderColor: product.theme.accent,
                        backgroundColor: product.theme.accent,
                      }
                    : undefined
                }
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="mini-label">Active Browse Mode</p>
          <h3 className="mt-3 text-2xl font-semibold text-stone-50">
            {categories.find((category) => category.id === deferredCategory)?.label}
          </h3>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            {
              categories.find((category) => category.id === deferredCategory)
                ?.description
            }
          </p>
          <p className="mt-5 text-sm leading-7 text-stone-500">
            {detail.gallery.note}
          </p>
        </div>
      </div>

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className={cn(
              "relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4",
              layoutStyles[item.layout]
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-95",
                toneStyles[item.tone]
              )}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_34%)]" />
            <div className="absolute inset-5 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.035)]" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/10 bg-[rgba(21,22,18,0.58)] p-4 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="mini-label text-stone-300">{item.eyebrow}</p>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-stone-300">
                  {item.mediaLabel}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-stone-50">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
