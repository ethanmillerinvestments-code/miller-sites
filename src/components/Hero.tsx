import { BadgeCheck, Clock3, DollarSign, PhoneCall, ShieldCheck } from "lucide-react";

import AutoPresentTrigger from "@/components/AutoPresentTrigger";
import { supportOffer } from "@/lib/offers";
import { siteConfig } from "@/lib/site";

const proofPills = [
  {
    icon: PhoneCall,
    title: "Phone-first CTA",
    detail: "Calls and quote paths stay visible on mobile.",
  },
  {
    icon: ShieldCheck,
    title: "Scope before payment",
    detail: "Price, timeline, and deliverables are confirmed in writing.",
  },
  {
    icon: BadgeCheck,
    title: "Launch-ready build",
    detail: "Forms, QA, metadata, and handoff are handled before go-live.",
  },
] as const;

const fastFacts = [
  {
    label: "Builds",
    value: "From $3,500",
  },
  {
    label: "Launches",
    value: "2-4 weeks",
  },
  {
    label: "Support",
    value: `Optional ${supportOffer.priceLabel}`,
  },
  {
    label: "Best fit",
    value: "Outdated or generic sites",
  },
] as const;

const includedChecks = [
  "Mobile CTA checks",
  "Forms and anti-spam",
  "Metadata, robots, and sitemap",
  "Clean handoff or hosted support",
] as const;

export default function Hero() {
  return (
    <section id="hero-overview" className="section-pad pt-32 sm:pt-36">
      <div className="section-shell grid items-start gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <div className="max-w-2xl">
          <span className="eyebrow">Leadcraft Agency</span>

          <h1 className="display-title mt-7 max-w-4xl text-[clamp(2.8rem,9vw,5.45rem)] text-stone-50">
            Home-service websites built to earn trust and drive calls.
          </h1>

          <p className="mt-5 max-w-2xl text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)] sm:text-base">
            HVAC. Plumbing. Roofing. Electrical. Landscaping. Painting.
          </p>

          <p className="muted-copy mt-6 max-w-xl text-lg leading-8 sm:text-xl">
            Built for local service companies with weak mobile trust, muddy
            service messaging, or a quote path that makes the next step too
            hard.
          </p>

          <div className="mt-8 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#package-finder"
              className="button-primary w-full px-7 py-4 text-base sm:w-auto"
            >
              Find My Price
            </a>
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="button-secondary w-full px-7 py-4 text-base sm:w-auto"
            >
              Book Strategy Call
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm leading-7 text-stone-400">
            <AutoPresentTrigger />
            <p>
              Need a direct teardown first?{" "}
              <a
                href="#contact"
                className="text-[color:var(--accent-strong)] transition-colors hover:text-stone-100"
              >
                Request a 5-point site audit.
              </a>
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {proofPills.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="lux-subtle rounded-[1.45rem] p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.1)] text-[color:var(--accent-strong)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-stone-100">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-6 text-stone-500">
            One-time builds first. Monthly support only if it helps after
            launch.
          </p>
        </div>

        <aside id="hero-display" className="lux-panel rounded-[2rem] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div className="max-w-md">
              <p className="mini-label">At A Glance</p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-50 sm:text-[2rem]">
                The key info buyers usually want is all here first.
              </h2>
            </div>

            <div className="rounded-[1.35rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] px-4 py-4 text-sm leading-7 text-stone-200">
              <p className="mini-label">What changes</p>
              <p className="mt-2">
                Stronger first impression, clearer service pages, and a simpler
                route to calls or quote requests.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {fastFacts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`rounded-[1.45rem] border p-4 ${
                    index === 0
                      ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                      : index === 2
                        ? "border-[rgba(125,183,176,0.2)] bg-[rgba(125,183,176,0.08)]"
                        : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className="mini-label">{fact.label}</p>
                  <p className="mt-3 text-lg font-semibold text-stone-50">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="lux-subtle rounded-[1.4rem] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.1)] text-[color:var(--accent-strong)]">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">Most Buyers Do This</p>
                    <p className="mt-1 text-sm font-semibold text-stone-100">
                      Find price, compare scope, then book the call.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <a
                    href="#pricing"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.22)] hover:text-stone-50"
                  >
                    Compare packages and pricing
                  </a>
                  <a
                    href="#contact"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-200 transition-colors hover:border-[rgba(125,183,176,0.22)] hover:text-stone-50"
                  >
                    Request an audit and scope review
                  </a>
                </div>
              </div>

              <div className="lux-subtle rounded-[1.4rem] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.22)] bg-[rgba(125,183,176,0.1)] text-[color:var(--teal)]">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">Included Before Launch</p>
                    <p className="mt-1 text-sm font-semibold text-stone-100">
                      The technical basics are part of the build, not add-ons.
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
                  {includedChecks.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
