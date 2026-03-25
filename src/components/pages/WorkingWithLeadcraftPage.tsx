import Link from "next/link";

import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";
import SiteShell from "@/components/SiteShell";
import StaggerReveal from "@/components/StaggerReveal";
import { supportPlans } from "@/lib/offers";
import { siteConfig } from "@/lib/site";

const processMarkers = [
  "Written scope before work starts",
  "Site work: 50/50 or full upfront",
  "Sites: Venmo or Stripe after approval",
  "Monthly support: Stripe billing only",
] as const;

const processSteps = [
  {
    label: "Step 01",
    title: "Brief and fit review",
    body:
      "The first step is a practical company brief. Leadcraft reviews the package fit, the business model, and whether the project deserves a written scope.",
  },
  {
    label: "Step 02",
    title: "Written scope and proposal",
    body:
      "If the project looks aligned, the next move is a written proposal. That locks the build tier, deliverables, exclusions, timeline anchor, and who is approving the work.",
  },
  {
    label: "Step 03",
    title: "Signer approval and deposit",
    body:
      "The signer approves the scope in writing. Then the project moves to the right payment step: one-time site work can use Venmo or manual Stripe, either 50/50 or full upfront, while recurring monthly support is billed through Stripe only.",
  },
  {
    label: "Step 04",
    title: "Onboarding and asset collection",
    body:
      "Leadcraft collects the approved business inputs, proof assets, CTA priorities, service areas, and content constraints that shape the actual build.",
  },
  {
    label: "Step 05",
    title: "Build and review rounds",
    body:
      "The website is built around the agreed scope with two structured revision rounds. The delivery clock starts from approved scope, paid deposit, and full assets.",
  },
  {
    label: "Step 06",
    title: "Final balance and launch",
    body:
      "Once the site is approved, the final 50% is cleared before public launch, transfer, or handoff. That keeps the close path clean for both sides.",
  },
] as const;

const paymentPaths = [
  {
    title: "One-time site work",
    tone: "accent",
    body:
      "Once the written scope is approved, one-time site work can be sent through Venmo or manual Stripe, either as 50/50 or paid in full upfront.",
    bullets: [
      "Choose 50/50 or pay the site in full upfront",
      "Venmo and manual Stripe are both valid for the website project",
      "Payment instructions are sent privately after approval, not posted publicly on the site",
    ],
  },
  {
    title: "Monthly support",
    tone: "teal",
    body:
      "Recurring support stays on Stripe so subscription billing, receipts, and ongoing ownership stay clean.",
    bullets: [
      "Hosted Core, Managed Site Care, and Search and Conversion Support are Stripe-billed",
      "Monthly work does not run through Venmo",
      "Bundle buyers can still use Venmo or Stripe for the one-time site portion while monthly runs through Stripe",
    ],
  },
] as const;

const processRules = [
  {
    title: "What the public site handles",
    body:
      "The site shows real pricing, the buying process, and what good-fit delivery looks like. It qualifies serious buyers without pretending websites should be bought like low-trust commodity packages.",
  },
  {
    title: "What the proposal packet handles",
    body:
      "The proposal and agreement lock the actual deliverables, exclusions, payment terms, revision rules, and handoff or hosting decision. That detail belongs in the close packet, not a generic landing page.",
  },
  {
    title: "What keeps the project clean",
    body:
      "Written approval, deposit before onboarding, timeline from full assets, and final payment before launch keep the build from slipping into vague expectations or unpaid stretch work.",
  },
] as const;

const hostingPaths = [
  {
    title: "Leadcraft-hosted, recommended by default",
    tone: "teal",
    body:
      "For most local-service companies, the cleanest setup is keeping the site on Leadcraft's managed deployment stack after launch.",
    bullets: [
      "Cleaner launch control and post-launch fixes",
      "No confusion over deployments, breakage, or routine upkeep",
      "Naturally fits Hosted Core, Managed Site Care, or Search and Conversion Support",
    ],
    note:
      "This is the default recommendation because it is simpler for owners and safer operationally.",
  },
  {
    title: "Self-hosted or transferred, available when needed",
    tone: "accent",
    body:
      "Some clients want full handoff and internal ownership. That path stays available, but it is handled as an explicit delivery choice, not an unspoken assumption.",
    bullets: [
      "Used when the client has internal technical support or a preferred host",
      "Requires a clear ownership split and handoff expectations",
      "Still waits for final payment before transfer, export, or public launch",
    ],
    note:
      "This is the exception path, not the default offer posture for small local-service teams.",
  },
] as const;

const deliveryStandards = [
  "2 structured revision rounds",
  "Feedback returned in one clear batch per round",
  "New requests outside scope move to a separate change decision",
  "Launch timing starts from full assets, not from the first inquiry",
] as const;

export default function WorkingWithLeadcraftPage({
  breadcrumbs,
}: {
  breadcrumbs?: React.ReactNode;
}) {
  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-6xl">
          {breadcrumbs}
          <span className="eyebrow">Working With Leadcraft</span>
          <div className="mt-7 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
            <div>
              <ScrollReveal direction="blur" depth="near">
                <h1 className="display-title text-[clamp(2.8rem,9vw,5.8rem)] text-stone-50">
                  The website is how Leadcraft sells, so the process has to be visible and tight.
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.06}>
                <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
                  This page shows the real buying path: what happens after the
                  brief, how the proposal and deposit work, how delivery timing is
                  counted, and what changes if you want Leadcraft to host the site
                  or hand it off.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.14}>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {processMarkers.map((item) => (
                    <div key={item} className="stat-pill text-sm leading-6">
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="blur" delay={0.1}>
              <div className="lux-subtle rounded-[1.9rem] p-6 sm:p-7">
                <p className="mini-label">Operating Model</p>
                <p className="mt-4 text-lg leading-8 text-stone-100">
                  Leadcraft stays small on purpose. Strategy, scope, copy
                  direction, and build execution stay closer together, which makes
                  the close path cleaner and the delivery standard easier to
                  enforce.
                </p>
                <p className="muted-copy mt-4 text-sm leading-7">
                  The business is not buying a vague agency relationship. It is
                  buying a specific project path with visible approvals, visible
                  money movement, and visible launch responsibility.
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
            <span className="eyebrow">Public Sales Process</span>
            <ScrollReveal direction="blur" depth="near">
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The exact path from brief to launch.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.06}>
              <p className="muted-copy mt-6 text-lg leading-8">
                The site should answer the practical questions before the call.
                These are the steps serious buyers move through.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal staggerDelay={0.08} direction="up" pattern="cascade" className="mt-10 grid gap-5 xl:grid-cols-3">
            {processSteps.map((step, index) => (
              <article
                key={step.label}
                className={`lux-panel rounded-[2rem] p-6 sm:p-7 ${
                  index === 2
                    ? "border-[rgba(216,170,115,0.18)] bg-[linear-gradient(180deg,rgba(216,170,115,0.08),rgba(13,14,18,0.98)_32%,rgba(13,14,18,0.96)_100%)]"
                    : index === 5
                      ? "border-[rgba(125,183,176,0.18)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(13,14,18,0.98)_32%,rgba(13,14,18,0.96)_100%)]"
                      : ""
                }`}
              >
                <p className="mini-label">{step.label}</p>
                <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                  {step.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{step.body}</p>
              </article>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <SectionBridge variant="diamond" tone="accent" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Proposal And Contract Layer</span>
            <ScrollReveal direction="blur" depth="near">
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                What the site explains and what the close packet locks down.
              </h2>
            </ScrollReveal>
          </div>

          <StaggerReveal staggerDelay={0.08} direction="zoom" pattern="sequential" className="mt-10 grid gap-5 lg:grid-cols-3">
            {processRules.map((item) => (
              <article key={item.title} className="lux-panel rounded-[1.9rem] p-6">
                <p className="mini-label">Control Point</p>
                <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                  {item.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{item.body}</p>
              </article>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <SectionBridge variant="dot-trail" tone="teal" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Payment Paths</span>
            <ScrollReveal direction="blur" depth="near">
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                Venmo is for one-time site work. Stripe runs the recurring side.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.06}>
              <p className="muted-copy mt-6 text-lg leading-8">
                The public site should make the money movement easy to understand
                before the proposal is opened. One-time website work can use
                Venmo or manual Stripe after approval, either 50/50 or full
                upfront. Monthly support stays on Stripe only.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {paymentPaths.map((path, index) => (
              <ScrollReveal key={path.title} direction={index === 0 ? "left" : "right"} delay={0.06 + index * 0.06}>
                <article
                  className={`rounded-[2rem] border p-6 sm:p-7 ${
                    path.tone === "teal"
                      ? "border-[rgba(125,183,176,0.18)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_24%,rgba(255,255,255,0.01)_100%)]"
                      : "border-[rgba(216,170,115,0.18)] bg-[linear-gradient(180deg,rgba(216,170,115,0.08),rgba(255,255,255,0.02)_24%,rgba(255,255,255,0.01)_100%)]"
                  }`}
                >
                  <p className="mini-label">
                    {path.tone === "teal" ? "Recurring lane" : "One-time lane"}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                    {path.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-200">{path.body}</p>
                  <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                    {path.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className={`mt-2 h-1.5 w-1.5 rounded-full ${
                            path.tone === "teal"
                              ? "bg-[color:var(--teal)]"
                              : "bg-[color:var(--accent)]"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionBridge variant="glow-pulse" tone="mixed" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Hosting And Handoff</span>
            <ScrollReveal direction="blur" depth="near">
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                Hosting through Leadcraft is the default. Self-hosting stays available.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.06}>
              <p className="muted-copy mt-6 text-lg leading-8">
                This is not hidden. The public site should make the ownership
                model easy to understand before the proposal is even opened.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {hostingPaths.map((path, index) => (
              <ScrollReveal key={path.title} direction={index === 0 ? "left" : "right"} delay={0.06 + index * 0.06}>
                <article
                  className={`rounded-[2rem] border p-6 sm:p-7 ${
                    path.tone === "teal"
                      ? "border-[rgba(125,183,176,0.18)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_24%,rgba(255,255,255,0.01)_100%)]"
                      : "border-[rgba(216,170,115,0.18)] bg-[linear-gradient(180deg,rgba(216,170,115,0.08),rgba(255,255,255,0.02)_24%,rgba(255,255,255,0.01)_100%)]"
                  }`}
                >
                  <p className="mini-label">
                    {path.tone === "teal" ? "Recommended lane" : "Exception lane"}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                    {path.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-200">{path.body}</p>
                  <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                    {path.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className={`mt-2 h-1.5 w-1.5 rounded-full ${
                            path.tone === "teal"
                              ? "bg-[color:var(--teal)]"
                              : "bg-[color:var(--accent)]"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-stone-300">
                    {path.note}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionBridge variant="diamond" tone="teal" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal direction="left" delay={0.06}>
            <div className="lux-subtle rounded-[1.9rem] p-6 sm:p-7">
              <p className="mini-label">Delivery Standards</p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
                {deliveryStandards.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <div className="rounded-[1.9rem] border border-[rgba(125,183,176,0.16)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_22%,rgba(255,255,255,0.01)_100%)] p-6 sm:p-7">
              <p className="mini-label text-[color:var(--teal)]">Monthly Paths</p>
              <p className="mt-4 text-sm leading-7 text-stone-200">
                Monthly work is not hidden inside the build number. Leadcraft can
                stay involved after launch, but the lane is visible and priced
                upfront. Recurring monthly support is billed through Stripe only.
              </p>
              <div className="mt-6 grid gap-4">
                {supportPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-50">
                          {plan.name}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-stone-300">
                          {plan.summary}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm font-semibold text-stone-100">
                        {plan.priceLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionBridge variant="gradient-wipe" tone="accent" className="my-12" />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <ScrollReveal direction="scale-blur" delay={0.04}>
            <div className="lux-panel rounded-[2rem] p-7 sm:p-8">
              <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                <div>
                  <p className="mini-label">Next Practical Step</p>
                  <h2 className="mt-4 text-4xl font-semibold text-stone-50 sm:text-5xl">
                    If the pricing looks close, move into the brief and let the process do its job.
                  </h2>
                  <p className="muted-copy mt-4 max-w-2xl text-sm leading-7">
                    Leadcraft reviews qualified briefs within one business day.
                    If the project is a fit, the next move is written scope,
                    signer approval, and the deposit step. From there, the build
                    runs on a cleaner timeline and ownership model.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/#pricing" className="button-primary w-full px-6 py-4 text-center text-sm">
                    View Pricing And Build The Package
                  </Link>
                  <Link
                    href="/checkout/intake"
                    className="button-secondary w-full px-6 py-4 text-center text-sm"
                  >
                    Send Project Brief
                  </Link>
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary w-full px-6 py-4 text-center text-sm"
                  >
                    Book Strategy Call
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
