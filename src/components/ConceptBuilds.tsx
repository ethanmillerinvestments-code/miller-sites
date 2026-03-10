import Link from "next/link";

import ClientProductCard from "@/components/ClientProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getFeaturedClientProducts } from "@/lib/client-products";

const featuredProducts = getFeaturedClientProducts();

export default function ConceptBuilds() {
  if (featuredProducts.length === 0) {
    return null;
  }

  const [featuredProduct, ...supportingProducts] = featuredProducts;

  return (
    <section id="client-products" className="section-pad section-rule">
      <div className="section-shell">
        <ScrollReveal direction="blur">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="eyebrow">Proof of Work</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                Concept work built to show how Leadcraft would shape a real
                local-service site.
              </h2>
              <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
                These are clearly labeled fictional production concepts inside
                the Leadcraft portfolio, not real case studies. They exist to
                show category-specific taste, structure, and CTA thinking
                without inventing reviews, awards, or transformation claims.
              </p>
            </div>

            <div className="lux-subtle rounded-[1.75rem] p-5 lg:ml-auto lg:max-w-sm">
              <p className="mini-label">View Portfolio</p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                View the full proof-of-work directory if you want to compare
                the roofing, HVAC, and outdoor-living directions side by side.
              </p>
              <Link
                href="/client-products"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-strong)] transition-colors hover:text-stone-50 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,170,115,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(15,16,22,1)]"
              >
                View All Proof Of Work
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-10" direction="blur" delay={0.06}>
          <ClientProductCard product={featuredProduct} featured />
        </ScrollReveal>

        {supportingProducts.length > 0 ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {supportingProducts.map((product, index) => (
              <ScrollReveal
                key={product.slug}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={0.08 + index * 0.05}
              >
                <ClientProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
