import Link from "next/link";

import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";
import SiteShell from "@/components/SiteShell";
import StaggerReveal from "@/components/StaggerReveal";
import { siteConfig } from "@/lib/site";

const seoViews = [
  {
    label: "Visibility",
    title: "How local SEO becomes possible",
    summary:
      "Search growth starts with structure, not with a promise. If service pages, headings, metadata, and internal links are weak, future growth stays capped.",
    bullets: [
      "Clear service-page structure gives search engines cleaner intent signals",
      "Metadata and headings help each page explain what it should rank for",
      "Internal links support page relationships instead of leaving pages isolated",
    ],
  },
  {
    label: "Conversion",
    title: "Why rankings alone do not win jobs",
    summary:
      "Traffic only matters if the page earns trust and routes people into a call or quote request. SEO and conversion structure need to work together.",
    bullets: [
      "Service pages need CTA hierarchy, not just keywords",
      "Mobile friction kills value even when the page gets found",
      "Trust signals matter because search traffic is still evaluating the company",
    ],
  },
  {
    label: "Expansion",
    title: "What future growth depends on",
    summary:
      "A build that is structured properly can expand into more services and locations later without needing to be rebuilt from scratch.",
    bullets: [
      "New service pages slot into a clearer hierarchy",
      "Location expansion becomes easier when the base structure is disciplined",
      "A cleaner foundation reduces future SEO cleanup cost",
    ],
  },
] as const;

const growthSequence = [
  {
    step: "01",
    title: "Structure the site around real service intent",
    body:
      "The homepage should not carry every offer alone. Service pages need to map to what buyers are actually searching for.",
  },
  {
    step: "02",
    title: "Support the pages with clean technical foundations",
    body:
      "Titles, descriptions, headings, canonical rules, sitemap, robots, and internal links need to support the structure instead of undermining it.",
  },
  {
    step: "03",
    title: "Turn the click into trust and action",
    body:
      "The buyer still has to believe the company is credible enough to call. That is where conversion layout carries the weight.",
  },
] as const;

const foundationViews = [
  {
    label: "Weak Foundation",
    title: "Why weak SEO setups stall out",
    bullets: [
      "One generic homepage tries to rank for everything and wins nothing clearly",
      "Service pages, headings, and metadata are too vague to support real intent",
      "Traffic that does arrive still faces weak trust signals and weak CTA routing",
    ],
  },
  {
    label: "Growth-Ready",
    title: "What a stronger foundation changes",
    bullets: [
      "Each major service gets cleaner page intent and stronger internal support",
      "Local relevance can expand without rebuilding the whole site from scratch",
      "Traffic lands on pages that are built to earn the call, not just the click",
    ],
  },
] as const;

const readinessMarkers = [
  "No ranking promises or fake averages",
  "Service intent, technical hygiene, and conversion have to align",
  "Future SEO works better when the foundation is already disciplined",
] as const;

export default function SeoReadinessPage({
  breadcrumbs,
}: {
  breadcrumbs?: React.ReactNode;
}) {
  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-6xl">
          {breadcrumbs}
          <span className="eyebrow">SEO Readiness</span>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div>
              <ScrollReveal direction="blur" depth="near">
                <h1 className="display-title text-[clamp(2.8rem,9vw,5.8rem)] text-stone-50">
                  How SEO structure supports growth, without fake averages or ranking promises.
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.06}>
                <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
                  Home-service SEO is a structure, trust, and conversion problem
                  working together over time.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="slide" delay={0.14}>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {readinessMarkers.map((item) => (
                    <div key={item} className="stat-pill text-sm leading-6">
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="blur" delay={0.1}>
              <div className="rounded-[1.9rem] border border-[rgba(125,183,176,0.16)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_24%,rgba(255,255,255,0.01)_100%)] p-6 sm:p-7">
                <p className="mini-label text-[color:var(--teal)]">Foundation Standard</p>
                <p className="mt-4 text-lg leading-8 text-stone-100">
                  Leadcraft does not promise average growth percentages. The job
                  is to build a stronger base for search and conversion.
                </p>
                <p className="muted-copy mt-4 text-sm leading-7">
                  Readiness means cleaner service intent, better local organization,
                  stronger metadata discipline, and pages that are capable of earning
                  trust once traffic arrives.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionBridge variant="dot-trail" tone="teal" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Readiness Breakdown</span>
            <ScrollReveal direction="blur" depth="near">
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The parts of SEO that actually matter here.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.06}>
              <p className="muted-copy mt-6 text-lg leading-8">
                Local SEO is not a trick layer added at the end. It depends on how
                the services are framed, how the site is technically organized, and
                how well the pages turn interest into contact.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal staggerDelay={0.08} direction="up" pattern="sequential" className="mt-10 grid gap-5 xl:grid-cols-3">
            {seoViews.map((view, index) => (
              <article
                key={view.label}
                className={`rounded-[2rem] p-6 sm:p-7 ${
                  index === 1
                    ? "border border-[rgba(125,183,176,0.18)] bg-[linear-gradient(180deg,rgba(125,183,176,0.1),rgba(13,14,18,0.98)_32%,rgba(13,14,18,0.96)_100%)]"
                    : "lux-panel"
                }`}
              >
                <p className="mini-label text-[color:var(--teal)]">{view.label}</p>
                <h3 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                  {view.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{view.summary}</p>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                  {view.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <SectionBridge variant="gradient-wipe" tone="mixed" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Growth Sequence</span>
            <ScrollReveal direction="blur" depth="near">
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                What has to happen before SEO can help the business.
              </h2>
            </ScrollReveal>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {growthSequence.map((item, index) => (
              <ScrollReveal key={item.step} direction={index % 2 === 0 ? "left" : "right"} delay={0.06 + index * 0.06}>
                <article
                  className="rounded-[1.95rem] border border-white/10 bg-[rgba(255,255,255,0.025)] p-6 sm:p-7"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(125,183,176,0.22)] bg-[rgba(125,183,176,0.1)] font-semibold text-[color:var(--teal)]">
                      {item.step}
                    </div>
                    <p className="mini-label text-[color:var(--teal)]">Sequence</p>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-stone-50">
                    {item.title}
                  </h3>
                  <p className="muted-copy mt-4 text-sm leading-7">{item.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionBridge variant="diamond" tone="teal" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-5 lg:grid-cols-2">
          {foundationViews.map((view, index) => (
            <ScrollReveal key={view.label} direction={index === 0 ? "left" : "right"} delay={0.06 + index * 0.06}>
              <article
                className={`rounded-[2rem] p-6 sm:p-7 ${
                  index === 0
                    ? "border border-white/10 bg-[rgba(255,255,255,0.025)]"
                    : "lux-panel border-[rgba(125,183,176,0.18)] bg-[linear-gradient(180deg,rgba(125,183,176,0.1),rgba(13,14,18,0.98)_32%,rgba(13,14,18,0.96)_100%)]"
                }`}
              >
                <p className="mini-label text-[color:var(--teal)]">{view.label}</p>
                <h3 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                  {view.title}
                </h3>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                  {view.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="section-shell mt-6">
          <ScrollReveal direction="scale-blur" delay={0.06}>
            <div className="rounded-[1.95rem] border border-[rgba(125,183,176,0.16)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_20%,rgba(255,255,255,0.01)_100%)] p-6 sm:p-8">
              <h3 className="section-title text-4xl text-stone-50">
                Build the structure first, then let growth work from a better base.
              </h3>
              <p className="muted-copy mt-4 max-w-3xl text-sm leading-7">
                That is the point of Leadcraft&apos;s search-ready structure: better
                page structure, clearer service coverage, and cleaner conversion
                routing. No average growth claims, just a better base for search
                and sales to work from.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary w-full px-6 py-4 text-sm sm:w-auto"
                >
                  Book Strategy Call
                </a>
                <Link
                  href="/#package-finder"
                  className="button-secondary w-full px-6 py-4 text-sm sm:w-auto"
                >
                  Find My Price
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
