import Link from "next/link";

import {
  ArrowRight,
  Compass,
  Gauge,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  Snowflake,
  ThermometerSun,
  Wrench,
} from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import {
  northlineBody,
  northlineDisplay,
} from "@/components/client-products/concepts/concept-fonts";
import { getClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

export type NorthlineView = "home" | "repair" | "install" | "coverage";

const navItems: Array<{
  label: string;
  href: string;
  view: NorthlineView;
}> = [
  { label: "Overview", href: "/client-products/northline-climate", view: "home" },
  { label: "Repair", href: "/client-products/northline-climate/repair", view: "repair" },
  { label: "Install", href: "/client-products/northline-climate/install", view: "install" },
  {
    label: "Coverage",
    href: "/client-products/northline-climate/coverage",
    view: "coverage",
  },
];

function NorthlineHeader({ view }: { view: NorthlineView }) {
  return (
    <header className="sticky top-0 z-30 border-b border-cyan-300/10 bg-[#081018]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/client-products"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-cyan-200/70 transition-colors hover:text-cyan-100"
          >
            Back to proof of work
          </Link>
          <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/45">
            Northline Climate Co.
          </p>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-all ${
                item.view === view
                  ? "border-[#71c7dd]/40 bg-[#71c7dd]/12 text-[#d8f7ff]"
                  : "border-white/10 bg-white/[0.03] text-white/68 hover:border-[#d8a86d]/40 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={siteConfig.phoneHref}
          className="hidden items-center gap-2 rounded-full border border-[#d8a86d]/35 bg-[#d8a86d]/12 px-4 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-[#f8d7af] transition-colors hover:bg-[#d8a86d]/18 md:inline-flex"
        >
          <PhoneCall className="h-4 w-4" />
          Call route
        </a>

        <details className="group lg:hidden">
          <summary className="list-none rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/80">
            Menu
          </summary>
          <div className="absolute right-4 top-[72px] w-[280px] rounded-[1.4rem] border border-cyan-300/20 bg-[#09131e]/96 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[1rem] border px-4 py-3 text-sm font-semibold transition-colors ${
                    item.view === view
                      ? "border-[#71c7dd]/40 bg-[#71c7dd]/12 text-[#d8f7ff]"
                      : "border-white/10 bg-white/[0.03] text-white/76"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

function NorthlineFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050b11]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_0.2fr] lg:px-8">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.26em] text-cyan-200/68">
            Fictional production concept
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Northline Climate Co. is a portfolio concept inside Leadcraft. Replace
            dispatch policy, service-area language, review proof, certifications,
            and financing details with approved client materials before any live use.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-300">
          <Link href="/client-products" className="transition-colors hover:text-white">
            Proof of work
          </Link>
          <Link href="/contact" className="transition-colors hover:text-white">
            Request teardown
          </Link>
        </div>
      </div>
    </footer>
  );
}

function NorthlineHeroActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <a
        href={siteConfig.phoneHref}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#d8a86d,#b77b3d)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#14100d] transition-transform hover:-translate-y-0.5"
      >
        Call dispatch
        <PhoneCall className="h-4 w-4" />
      </a>
      <Link
        href="/client-products/northline-climate/repair"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#d8f7ff] transition-colors hover:bg-cyan-300/16"
      >
        View repair lane
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        href="/client-products/northline-climate/install"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/86 transition-colors hover:border-[#d8a86d]/35 hover:text-white"
      >
        Replacement flow
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function OverviewPage() {
  const product = getClientProduct("northline-climate");

  if (!product || !product.detail.northline) {
    return null;
  }

  const concept = product.detail.northline;

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(113,199,221,0.16),transparent_30%),linear-gradient(180deg,#07111b_0%,#081018_45%,#0c1520_100%)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="blur" className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d8a86d]">
              Industrial HVAC concept
            </p>
            <h1 className="mt-5 text-[clamp(3rem,8vw,6.4rem)] font-semibold uppercase leading-[0.82] tracking-[-0.05em] text-white [font-family:var(--font-northline-display)]">
              Dispatch-first design for urgent HVAC calls.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This is not a Leadcraft landing page with swapped copy. It is a
              standalone concept site built around mechanical clarity, fast repair
              routing, and calmer install positioning.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
              {concept.hero.supportNote}
            </p>
            <NorthlineHeroActions />

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {product.detail.heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.35rem] border border-cyan-300/14 bg-[#0d1b29]/82 p-5"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-200/68">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[2rem] border border-cyan-300/18 bg-[#09131f]/92 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)]">
              <div className="flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-200/70">
                    Dispatch board
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Repair urgency, install confidence, maintenance second.
                  </p>
                </div>
                <span className="rounded-full border border-[#d8a86d]/30 bg-[#d8a86d]/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[#f9d8b0]">
                  Live concept
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#06111b] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/48">
                      Queue logic
                    </p>
                    <Gauge className="h-4 w-4 text-cyan-200/75" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {concept.hero.markers.map((marker, index) => (
                      <div
                        key={marker}
                        className={`rounded-[1.2rem] border p-4 ${
                          index === 0
                            ? "border-[#d8a86d]/24 bg-[#d8a86d]/8"
                            : index === 1
                              ? "border-cyan-300/24 bg-cyan-300/8"
                              : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/50">
                          Route 0{index + 1}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-200">{marker}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  {concept.scenarioSelector.map((scenario) => (
                    <div
                      key={scenario.label}
                      className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-[0.64rem] uppercase tracking-[0.22em] text-[#d8a86d]">
                        {scenario.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">{scenario.title}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{scenario.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Repair lane", value: "Call-first" },
                  { label: "Install lane", value: "Estimate-driven" },
                  { label: "Coverage lane", value: "Policy-aware" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-white/8 bg-[#07111b]">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/68">
                  Distinct service architecture
                </p>
                <h2 className="mt-4 text-5xl font-semibold uppercase tracking-[-0.04em] text-white [font-family:var(--font-northline-display)] sm:text-6xl">
                  Every buyer intent gets its own lane.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                This site uses a hard-grid layout, condensed typography, and utility-style
                routing. It is intentionally unlike the Leadcraft main site and unlike the
                other proof-of-work concepts.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {concept.serviceLanes.map((lane, index) => {
              const Icon =
                index === 0 ? Wrench : index === 1 ? ThermometerSun : Snowflake;

              return (
                <ScrollReveal
                  key={lane.label}
                  direction={index === 1 ? "up" : index === 0 ? "left" : "right"}
                  delay={0.05 * index}
                  className="h-full"
                >
                  <article className="flex h-full flex-col rounded-[1.7rem] border border-white/10 bg-[#0b1724] p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[0.64rem] uppercase tracking-[0.22em] text-cyan-200/68">
                          {lane.label}
                        </p>
                        <p className="mt-1 text-xl font-semibold text-white">{lane.title}</p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-300">{lane.description}</p>

                    <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
                      {lane.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[#d8a86d]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#09131f]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.76fr_0.24fr] lg:px-8 lg:py-20">
          <ScrollReveal direction="left" className="rounded-[1.8rem] border border-white/10 bg-[#0c1b2b] p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#d8a86d]">
              Internal pages
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  href: "/client-products/northline-climate/repair",
                  title: "Repair page",
                  body: "Symptom-first routing, urgent CTA placement, and operational trust blocks.",
                },
                {
                  href: "/client-products/northline-climate/install",
                  title: "Install page",
                  body: "Replacement planning, financing posture, and calmer estimate framing.",
                },
                {
                  href: "/client-products/northline-climate/coverage",
                  title: "Coverage page",
                  body: "Service radius logic, after-hours notes, and maintenance positioning.",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-300/30"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-cyan-200/78">
                    Open page
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[1.8rem] border border-cyan-300/18 bg-cyan-300/8 p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-100">
                Distinctive design choices
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-100">
                <li>Condensed uppercase typography instead of Leadcraft’s serif-led rhythm.</li>
                <li>Blueprint grids, hard utility panels, and command-center spacing.</li>
                <li>Segmented route menu rather than the main site’s standard section flow.</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function RepairPage() {
  const product = getClientProduct("northline-climate");

  if (!product || !product.detail.northline) {
    return null;
  }

  const concept = product.detail.northline;

  return (
    <>
      <section className="border-b border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(216,168,109,0.16),transparent_28%),linear-gradient(180deg,#08111b_0%,#09131d_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="left" className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#d8a86d]">
              Repair lane
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,6rem)] font-semibold uppercase tracking-[-0.05em] text-white [font-family:var(--font-northline-display)]">
              Symptom-first repair routing for the stressed buyer.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This page prototype is built to cut friction for homeowners who are
              already in breakdown mode. The layout keeps the next step obvious before
              the buyer falls into comparison paralysis.
            </p>
            <div className="mt-8 rounded-[1.6rem] border border-[#d8a86d]/22 bg-[#d8a86d]/8 p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#f8d7af]">
                Emergency response framing
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-100">
                {concept.emergencyModule.body}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="grid gap-4">
              {concept.deepDive.symptoms.map((symptom, index) => (
                <div
                  key={symptom}
                  className={`rounded-[1.45rem] border p-5 ${
                    index === 0
                      ? "border-[#d8a86d]/24 bg-[#d8a86d]/8"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className="text-[0.64rem] uppercase tracking-[0.22em] text-cyan-200/70">
                    Symptom 0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{symptom}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-white/8 bg-[#07111b]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {concept.deepDive.process.map((step, index) => (
            <ScrollReveal key={step} delay={0.05 * index} className="h-full">
              <article className="flex h-full flex-col rounded-[1.6rem] border border-white/10 bg-[#0d1825] p-6">
                <p className="text-[0.64rem] uppercase tracking-[0.22em] text-cyan-200/68">
                  Repair step 0{index + 1}
                </p>
                <p className="mt-4 text-xl font-semibold text-white">{step}</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Repair messaging stays practical and next-step focused instead of
                  turning into vague contractor filler.
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-[#09131f]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.72fr_0.28fr] lg:px-8">
          <ScrollReveal direction="blur" className="rounded-[1.8rem] border border-white/10 bg-[#0c1b2b] p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#d8a86d]">
              Repair CTA architecture
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {concept.emergencyModule.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-5"
                >
                  <p className="text-sm leading-7 text-slate-200">{bullet}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-400">
              {concept.deepDive.note}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.08}>
            <div className="rounded-[1.8rem] border border-cyan-300/18 bg-cyan-300/8 p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-100">
                Next view
              </p>
              <p className="mt-4 text-xl font-semibold text-white">
                Install buyers need a different page rhythm.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-100/90">
                The install view slows the tone down, separates financing, and gives
                estimate shoppers more breathing room.
              </p>
              <Link
                href="/client-products/northline-climate/install"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white"
              >
                Open install page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function InstallPage() {
  const product = getClientProduct("northline-climate");

  if (!product || !product.detail.northline) {
    return null;
  }

  const concept = product.detail.northline;

  return (
    <>
      <section className="border-b border-white/8 bg-[radial-gradient(circle_at_top_right,rgba(113,199,221,0.16),transparent_24%),linear-gradient(180deg,#06111a_0%,#091420_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="left" className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/70">
              Install lane
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,5.8rem)] font-semibold uppercase tracking-[-0.05em] text-white [font-family:var(--font-northline-display)]">
              Replacement planning without panic-language clutter.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Install shoppers should feel steadiness, not emergency noise. This page
              leans on larger spacing, cleaner comparison blocks, and financing posture
              that reads like support instead of bait.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[1.9rem] border border-cyan-300/16 bg-[#0a1723] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-200/68">
                Confidence points
              </p>
              <div className="mt-5 grid gap-4">
                {concept.financingModule.confidencePoints.map((point, index) => (
                  <div
                    key={point}
                    className={`rounded-[1.35rem] border p-5 ${
                      index === 1
                        ? "border-cyan-300/24 bg-cyan-300/8"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-sm leading-7 text-slate-200">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-white/8 bg-[#07111b]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: "Estimate rail",
              body: "Separate the estimate conversation from same-day repair traffic.",
            },
            {
              title: "Financing rail",
              body: "Introduce financing with calm language and real disclosure placeholders.",
            },
            {
              title: "Decision rail",
              body: "Give system replacement enough context to feel like a planning choice.",
            },
          ].map((item, index) => (
            <ScrollReveal key={item.title} delay={0.04 * index} className="h-full">
              <article className="flex h-full flex-col rounded-[1.6rem] border border-white/10 bg-[#0d1825] p-6">
                <p className="text-[0.64rem] uppercase tracking-[0.22em] text-[#d8a86d]">
                  Install block 0{index + 1}
                </p>
                <p className="mt-4 text-xl font-semibold text-white">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-[#09131f]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.68fr_0.32fr] lg:px-8">
          <ScrollReveal direction="blur" className="rounded-[1.9rem] border border-white/10 bg-[#0a1723] p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#d8a86d]">
              Financing posture
            </p>
            <h2 className="mt-4 text-4xl font-semibold uppercase tracking-[-0.04em] text-white [font-family:var(--font-northline-display)] sm:text-5xl">
              Support the estimate, do not hijack it.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              {concept.financingModule.body}
            </p>
            <div className="mt-6 rounded-[1.35rem] border border-cyan-300/18 bg-cyan-300/8 p-5 text-sm leading-7 text-slate-100">
              {concept.financingModule.placeholder}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.08}>
            <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-200/70">
                Next view
              </p>
              <p className="mt-4 text-xl font-semibold text-white">
                Coverage policy needs its own utility page.
              </p>
              <Link
                href="/client-products/northline-climate/coverage"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100"
              >
                Open coverage page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function CoveragePage() {
  const product = getClientProduct("northline-climate");

  if (!product || !product.detail.northline) {
    return null;
  }

  const concept = product.detail.northline;

  return (
    <>
      <section className="border-b border-white/8 bg-[radial-gradient(circle_at_bottom_left,rgba(113,199,221,0.16),transparent_24%),linear-gradient(180deg,#08111a_0%,#09131d_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="left" className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/68">
              Coverage lane
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,5.8rem)] font-semibold uppercase tracking-[-0.05em] text-white [font-family:var(--font-northline-display)]">
              Service area policy should read like operations, not filler.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This view turns map questions, after-hours policies, and membership fit into
              a cleaner utility page for the buyer who wants specifics.
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-400">{concept.coverageModule.note}</p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="grid gap-4">
              {concept.coverageModule.zones.map((zone, index) => (
                <article
                  key={zone.label}
                  className={`rounded-[1.5rem] border p-5 ${
                    index === 0
                      ? "border-cyan-300/20 bg-cyan-300/8"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100">
                      {index === 0 ? (
                        <MapPinned className="h-4 w-4" />
                      ) : index === 1 ? (
                        <Compass className="h-4 w-4" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-[0.64rem] uppercase tracking-[0.22em] text-cyan-200/68">
                        {zone.label}
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">{zone.title}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{zone.detail}</p>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-white/8 bg-[#07111b]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <ScrollReveal direction="left" className="rounded-[1.8rem] border border-white/10 bg-[#0d1825] p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#d8a86d]">
              Maintenance support
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Membership and IAQ stay secondary until the core question is answered: do
              you serve my area, and what happens after I call?
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.08} className="rounded-[1.8rem] border border-cyan-300/18 bg-cyan-300/8 p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-100">
              Page behavior
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-100/90">
              This page is intentionally more informational and utility-heavy than the
              homepage or install view, which reinforces that the Northline site system
              can change posture by buyer intent.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

export default function NorthlineConceptSite({ view }: { view: NorthlineView }) {
  return (
    <div className={`${northlineDisplay.variable} ${northlineBody.variable}`}>
      <div className="min-h-screen bg-[#07111a] text-white [font-family:var(--font-northline-body)]">
        <NorthlineHeader view={view} />
        <main>
          {view === "home" ? <OverviewPage /> : null}
          {view === "repair" ? <RepairPage /> : null}
          {view === "install" ? <InstallPage /> : null}
          {view === "coverage" ? <CoveragePage /> : null}
        </main>
        <NorthlineFooter />
      </div>
    </div>
  );
}
