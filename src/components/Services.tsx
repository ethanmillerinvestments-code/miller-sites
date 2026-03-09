import { BadgeCheck, Blocks, Map } from "lucide-react";

const services = [
  {
    title: "Website Build",
    summary:
      "A custom-coded site built to make the company look more established and make the next step obvious.",
    bullets: [
      "Homepage and core service structure",
      "Phone-first CTA and quote routing",
      "Launch QA, forms, metadata, robots, and sitemap",
    ],
    bestFor: "Best when the current site looks generic or weak on mobile.",
    icon: Blocks,
  },
  {
    title: "Service Page System",
    summary:
      "Separate pages for real services so buyers and searchers are not pushed through one vague homepage.",
    bullets: [
      "One service per page",
      "Location-aware structure for future growth",
      "Cleaner links between service, proof, and CTA",
    ],
    bestFor: "Best when one page is doing too much and the offer feels muddy.",
    icon: BadgeCheck,
  },
  {
    title: "Search-Ready Structure",
    summary:
      "Search-ready structure is built into the site from day one instead of being treated like a fake performance promise.",
    bullets: [
      "Titles, headings, and internal links",
      "Schema setup based on real approved content",
      "Service-area expansion path for later pages",
    ],
    bestFor: "Best when the business wants a clean base before SEO expansion.",
    icon: Map,
  },
] as const;

export default function Services() {
  return (
    <section id="services" className="section-pad section-rule">
      <div className="section-shell">
        <div className="max-w-3xl">
          <span className="eyebrow">Services</span>
          <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
            What you are actually buying.
          </h2>
          <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
            The core offer is simple: stronger first impression, clearer
            service pages, and a cleaner lead path before launch.
          </p>
        </div>

        <div className="mt-12 grid gap-5 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className={`lux-panel rounded-[1.7rem] p-6 sm:p-7 ${
                  index === 0
                    ? "border-[rgba(216,170,115,0.18)]"
                    : index === 2
                      ? "border-[rgba(125,183,176,0.18)]"
                      : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.08)] text-[color:var(--accent-strong)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="mini-label">Offer {index + 1}</p>
                      <h3 className="mt-3 text-2xl font-semibold text-stone-50">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full border border-[rgba(216,170,115,0.22)] bg-[rgba(216,170,115,0.08)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                    Conversion-led
                  </span>
                </div>

                <p className="muted-copy mt-5 max-w-2xl text-sm leading-7">
                  {service.summary}
                </p>

                <ul className="mt-6 space-y-3 text-sm leading-7 text-stone-200">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-stone-300">
                  <span className="mini-label">Best when</span>
                  <p className="mt-2">{service.bestFor}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
