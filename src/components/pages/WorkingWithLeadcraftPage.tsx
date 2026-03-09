import Link from "next/link";

import SiteShell from "@/components/SiteShell";
import { supportPlans } from "@/lib/offers";
import { siteConfig } from "@/lib/site";

const workflowViews = [
  {
    label: "Communication",
    title: "Direct communication, fewer layers, cleaner decisions",
    summary:
      "One reason smaller agencies outperform bloated ones is speed of communication. The person building the structure is the same person discussing scope, positioning, and changes.",
    bullets: [
      "Fewer handoff mistakes between sales, design, and build layers",
      "Cleaner feedback loops when changes are requested",
      "Stronger alignment between positioning, copy, UX, and launch standards",
    ],
  },
  {
    label: "Execution",
    title: "A tighter execution model from scope to launch",
    summary:
      "The project is run around written scope, clear deliverables, and visible launch standards instead of vague creative promises.",
    bullets: [
      "Scope, price, timeline, and ownership are agreed before work starts",
      "The site is built around real service offers and conversion paths",
      "Mobile QA, metadata, and lead-path testing are part of the delivery standard",
    ],
  },
  {
    label: "After Launch",
    title: "You can keep the site or keep Leadcraft involved",
    summary:
      "Some owners want the site delivered cleanly and then managed internally. Others want a monthly path. Leadcraft is set up for both without forcing a retainer.",
    bullets: [
      "One-time build with clean handoff is always an option",
      "Site Coverage and Growth Support are available after launch when ongoing help actually matters",
      "The delivery model stays clear so the business knows what it owns and what stays managed",
    ],
  },
] as const;

const cooperationBenefits = [
  {
    title: "Clearer scope before money moves",
    body:
      "The work starts with a tighter scope, pricing, timeline, and deliverables conversation so the project does not drift later.",
  },
  {
    title: "More strategic copy and structure",
    body:
      "The site is positioned around what your buyers need to see fast, not generic agency filler or template section order.",
  },
  {
    title: "A better handoff if you do not want monthly",
    body:
      "If you stop at the build, the ownership split is still clear. No hidden dependence on the builder to keep the site usable.",
  },
  {
    title: "Monthly paths if you want more involvement",
    body:
      "If you do want ongoing support, the monthly options are visible upfront and tied to specific responsibilities instead of vague support language.",
  },
] as const;

const clientInputs = [
  "Real services, service areas, and priority revenue offers",
  "Approved proof assets, photos, reviews, or certifications if available",
  "Decision-maker feedback without long approval chains",
  "Clear call-to-action priority, whether that is booked calls or quote requests",
] as const;

const leadcraftOutputs = [
  "Conversion-led page structure and service hierarchy",
  "Launch-ready code, form hardening, security headers, metadata, robots, sitemap, and QA",
  "A stronger visual position than a basic template build",
  "A clear path into handoff or monthly support after launch",
] as const;

const partnershipMarkers = [
  "Direct communication instead of long agency chains",
  "Scope-first execution and visible launch standards",
  "Optional monthly support without a forced retainer",
] as const;

export default function WorkingWithLeadcraftPage() {
  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-6xl">
          <span className="eyebrow">Working With Leadcraft</span>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div>
              <h1 className="display-title text-[clamp(2.8rem,9vw,5.8rem)] text-stone-50">
                What partnering with Leadcraft actually gives a home-service company.
              </h1>
              <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
                This is the practical side of working together: communication,
                execution quality, launch discipline, and what changes when the
                website is treated like a sales asset.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {partnershipMarkers.map((item) => (
                  <div key={item} className="stat-pill text-sm leading-6">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="lux-subtle rounded-[1.9rem] p-6 sm:p-7">
              <p className="mini-label">Partnership Advantage</p>
              <p className="mt-4 text-lg leading-8 text-stone-100">
                Leadcraft stays small on purpose: tighter feedback loops, cleaner
                decisions, and a more direct connection between positioning,
                build quality, and launch execution.
              </p>
              <p className="muted-copy mt-4 text-sm leading-7">
                The business is not buying vague creativity. It is buying a clearer
                sales path, better trust presentation, and a cleaner delivery model.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Working Model</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              How the partnership is structured from the start.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              This is about what the business actually gets, not generic agency
              promises. Communication, execution, and post-launch clarity are part
              of the offer, not side notes.
            </p>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {workflowViews.map((view, index) => (
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
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">What The Business Gets</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              The concrete benefits of working with Leadcraft.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {cooperationBenefits.map((item) => (
              <article key={item.title} className="lux-panel rounded-[1.9rem] p-6">
                <p className="mini-label">Benefit</p>
                <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                  {item.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-6 lg:grid-cols-2">
          <div className="lux-subtle rounded-[1.9rem] p-6 sm:p-7">
            <p className="mini-label">What I Need From You</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
              {clientInputs.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.9rem] border border-[rgba(125,183,176,0.16)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_22%,rgba(255,255,255,0.01)_100%)] p-6 sm:p-7">
            <p className="mini-label text-[color:var(--teal)]">What Leadcraft Handles</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
              {leadcraftOutputs.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Monthly Paths</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              If you want Leadcraft involved after launch, the options are visible.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {supportPlans.map((plan) => (
              <article
                key={plan.id}
                className={`lux-panel flex h-full flex-col rounded-[1.9rem] p-6 ${
                  plan.featured
                    ? "border-[rgba(125,183,176,0.2)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_28%,rgba(255,255,255,0.02)_100%)]"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="mini-label">Optional Monthly</p>
                    <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                      {plan.name}
                    </h3>
                  </div>
                  <div className="rounded-full border border-[rgba(216,170,115,0.22)] bg-[rgba(216,170,115,0.08)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-strong)]">
                    {plan.priceLabel}
                  </div>
                </div>

                <p className="muted-copy mt-4 text-sm leading-7">{plan.summary}</p>

                <ul className="mt-5 flex-1 space-y-4 text-sm leading-7 text-stone-200">
                  {plan.features.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-sm leading-7 text-stone-400">{plan.fit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="lux-subtle rounded-[1.95rem] p-6 sm:p-8">
            <h3 className="section-title text-4xl text-stone-50">
              Work directly with the person shaping the site, the offer flow, and the launch standard.
            </h3>
            <p className="muted-copy mt-4 max-w-3xl text-sm leading-7">
              That is the point of the Leadcraft setup: cleaner communication,
              cleaner execution, clearer ownership, and optional monthly support
              when you want more than a one-time build.
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
        </div>
      </section>
    </SiteShell>
  );
}
