import Link from "next/link";

import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";
import SiteShell from "@/components/SiteShell";
import StaggerReveal from "@/components/StaggerReveal";
import { siteConfig } from "@/lib/site";

const perspectiveViews = [
  {
    label: "Why Leadcraft",
    title: "Leadcraft exists to make local service businesses look more established online.",
    summary:
      "The point is not generic web design. The point is a sharper sales path, stronger mobile trust, and cleaner ownership after launch.",
    bullets: [
      "Home-service companies need credibility and clarity fast",
      "The website should reduce sales friction instead of creating more",
      "One-time builds and recurring support stay clearly separated",
    ],
  },
  {
    label: "How I Work",
    title: "The work stays direct, lean, and tied to the business outcome.",
    summary:
      "Strategy, offer framing, structure, and build quality stay closer together when the same operator is shaping the project end to end.",
    bullets: [
      "Cleaner feedback loop from scope through launch",
      "Fewer handoff gaps between positioning and implementation",
      "More control over how the final site actually sells",
    ],
  },
  {
    label: "Who It Fits",
    title: "Best for owners who want a serious site without agency bloat.",
    summary:
      "Leadcraft fits home-service companies that need a stronger first impression, cleaner pricing clarity, and a better route to booked calls.",
    bullets: [
      "HVAC, plumbing, roofing, landscaping, electrical, painting, and similar local operators",
      "Companies replacing a cheap or generic-looking site",
      "Owners who want either a clean handoff or optional monthly support",
    ],
  },
] as const;

const aboutPoints = [
  {
    title: "Built around home-service buyers",
    body:
      "The positioning, section order, and CTA flow are tuned for local service businesses, not generic SaaS or startup patterns.",
  },
  {
    title: "Sales-first structure",
    body:
      "Pages are treated like selling tools. The goal is faster trust, clearer offers, and better-fit calls.",
  },
  {
    title: "Clear scope and ownership",
    body:
      "Scope, timeline, pricing, deliverables, and ownership stay written and visible before work begins.",
  },
] as const;

const operatingMarkers = [
  "Direct operator-to-owner communication",
  "Mobile trust and CTA clarity as non-negotiables",
  "Written scope before build work begins",
] as const;

const buyerTakeaways = [
  "The site should help the office answer fewer basic questions because the offer and next step are already clear.",
  "The design should look established enough that pricing does not feel suspect before the first call.",
  "The ownership model should stay obvious so the business knows what is handed off and what is optionally managed.",
] as const;

export default function AboutPage({
  breadcrumbs,
}: {
  breadcrumbs?: React.ReactNode;
}) {
  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-6xl">
          {breadcrumbs}
          <span className="eyebrow">About</span>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div>
              <ScrollReveal direction="blur" depth="near">
                <h1 className="display-title text-[clamp(2.8rem,9vw,5.8rem)] text-stone-50">
                  About Ethan, and why Leadcraft runs as a direct operator studio for home-service companies.
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.06}>
                <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
                  Leadcraft is based in {siteConfig.locationDisplay} and built around
                  direct execution, cleaner sales structure, and websites that make
                  local businesses look more established online.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="scale-blur" delay={0.14}>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {operatingMarkers.map((item) => (
                    <div key={item} className="stat-pill text-sm leading-6">
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="blur" delay={0.1}>
              <div className="lux-subtle rounded-[1.9rem] p-6 sm:p-7">
                <p className="mini-label">Working Principle</p>
                <p className="mt-4 text-lg leading-8 text-stone-100">
                  Work directly with the person shaping scope, structure, and launch
                  standards from the first conversation through delivery.
                </p>
                <p className="muted-copy mt-4 text-sm leading-7">
                  Leadcraft stays intentionally narrow so scope, offer framing,
                  build quality, and launch standards do not get diluted across
                  too many layers or too many business types.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionBridge variant="gradient-wipe" tone="mixed" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Perspective</span>
            <ScrollReveal direction="blur" depth="near">
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                Three angles that explain how Leadcraft is set up.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.06}>
              <p className="muted-copy mt-6 text-lg leading-8">
                Each angle answers a different buyer question: why the agency exists,
                how the work is run, and which companies get the most lift from this
                model.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal staggerDelay={0.08} direction="up" pattern="sequential" className="mt-10 grid gap-5 xl:grid-cols-3">
            {perspectiveViews.map((view, index) => (
              <article
                key={view.label}
                className={`lux-panel rounded-[2rem] p-6 sm:p-7 ${
                  index === 1
                    ? "border-[rgba(216,170,115,0.18)] bg-[linear-gradient(180deg,rgba(216,170,115,0.08),rgba(13,14,18,0.98)_32%,rgba(13,14,18,0.96)_100%)]"
                    : ""
                }`}
              >
                <p className="mini-label">{view.label}</p>
                <h3 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                  {view.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{view.summary}</p>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                  {view.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <SectionBridge variant="diamond" tone="accent" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="max-w-3xl">
              <span className="eyebrow">What You Can Expect</span>
              <ScrollReveal direction="blur" depth="near">
                <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                  The operating style behind the work.
                </h2>
              </ScrollReveal>
            </div>

            <StaggerReveal staggerDelay={0.08} direction="zoom" pattern="sequential" className="mt-10 grid gap-5 xl:grid-cols-3">
              {aboutPoints.map((item) => (
                <article key={item.title} className="lux-panel rounded-[1.85rem] p-6">
                  <p className="mini-label">About Leadcraft</p>
                  <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                    {item.title}
                  </h3>
                  <p className="muted-copy mt-4 text-sm leading-7">{item.body}</p>
                </article>
              ))}
            </StaggerReveal>
          </div>

          <ScrollReveal direction="right" delay={0.1}>
            <div className="lux-subtle rounded-[2rem] p-6 sm:p-7">
              <p className="mini-label">Buyer Takeaway</p>
              <h3 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                What this should feel like from the client side.
              </h3>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                {buyerTakeaways.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionBridge variant="dot-trail" tone="teal" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <ScrollReveal direction="scale-blur" delay={0.04}>
            <div className="lux-subtle rounded-[1.95rem] p-6 sm:p-8">
              <p className="mini-label">Next Step</p>
              <h2 className="mt-4 text-3xl font-semibold text-stone-50 sm:text-4xl">
                If the current site is underselling the business, the next move is a scope call.
              </h2>
              <p className="muted-copy mt-4 max-w-3xl text-sm leading-7">
                That call is where the services, pricing, handoff model, and launch
                path get aligned before any build work starts. Initial fit review
                should happen within one business day.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary px-6 py-3 text-sm"
                >
                  Book Strategy Call
                </a>
                <Link
                  href="/#package-finder"
                  className="button-secondary px-6 py-3 text-sm"
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
