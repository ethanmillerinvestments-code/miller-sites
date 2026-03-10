import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  Compass,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ClientProductScene from "@/components/ClientProductScene";
import ClientProductStickyCTA from "@/components/client-products/ClientProductStickyCTA";
import ScrollReveal from "@/components/ScrollReveal";
import Aurora from "@/components/reactbits/Backgrounds/Aurora";
import ScrollRevealText from "@/components/reactbits/TextAnimations/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import type { ClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

type SummitShieldRoofingPageProps = {
  product: ClientProduct;
};

const serviceTags = [
  "Roof repair",
  "Roof replacement",
  "Storm damage inspection",
  "Insurance claim guidance",
  "Gutters",
  "Siding",
] as const;

const damageChecklist = [
  {
    title: "Ceiling stains or attic moisture",
    description:
      "Used here to show how the concept would route a homeowner into an inspection request before guesswork turns into replacement confusion.",
  },
  {
    title: "Missing shingles or lifted flashing",
    description:
      "Framed as a reason to inspect first, not as a made-up emergency promise.",
  },
  {
    title: "Hail, wind, or branch impact concerns",
    description:
      "Positions the business as calm guidance for storm questions without overpromising insurance outcomes.",
  },
] as const;

const inspectionLanes = [
  {
    title: "Inspection first",
    description:
      "The concept puts inspection booking ahead of technical detail so skeptical buyers can act before reading through every service block.",
  },
  {
    title: "Estimate second",
    description:
      "Replacement and exterior scope are introduced after the inspection lane is clear, which keeps the hierarchy decisive on mobile.",
  },
  {
    title: "Guidance third",
    description:
      "Claim-process and financing questions are handled as planning support, not as bait copy.",
  },
] as const;

const insuranceSteps = [
  {
    title: "Confirm visible concerns",
    description:
      "The site frames an initial homeowner conversation around what changed, what was noticed, and whether an inspection should happen first.",
  },
  {
    title: "Document findings clearly",
    description:
      "A clean findings summary helps the buyer understand what was observed before any replacement discussion escalates.",
  },
  {
    title: "Coordinate next-step paperwork",
    description:
      "Insurance guidance is presented as practical help with process questions, never as approval guarantees or partnership claims.",
  },
  {
    title: "Plan repair or replacement",
    description:
      "Once the condition and scope are clear, the concept shifts into estimate, material, and scheduling guidance.",
  },
] as const;

const replacementFrames = [
  {
    title: "Replacement is framed as a planning decision",
    description:
      "The copy emphasizes scope clarity, material discussion, and next-step timing instead of pressure tactics.",
  },
  {
    title: "Gutters and siding stay connected",
    description:
      "Exterior services support the authority story without turning the page into an undifferentiated list of add-ons.",
  },
  {
    title: "Financing questions are acknowledged cleanly",
    description:
      "The concept opens space for budgeting and phased decision-making without fake monthly-payment claims.",
  },
] as const;

const trustPlaceholders = [
  {
    title: "Licenses",
    description:
      "Reserved area for license numbers and state or local operating credentials when a real roofing client provides them.",
  },
  {
    title: "Warranties",
    description:
      "Reserved area for workmanship and manufacturer warranty language approved by the actual roofing business.",
  },
  {
    title: "Certifications",
    description:
      "Reserved area for verified manufacturer or safety certifications. No implied badges are shown in this concept.",
  },
  {
    title: "Reviews",
    description:
      "Reserved area for real customer proof once provided. This concept deliberately avoids fake ratings or testimonial copy.",
  },
] as const;

const galleryItems = [
  {
    title: "Storm-response exterior reset",
    description:
      "A dramatic before-and-after style strip built to show material contrast and roofline clarity without inventing job counts.",
  },
  {
    title: "Inspection findings presentation",
    description:
      "A tighter visual lane for photos, notes, and replacement framing that keeps the conversation specific.",
  },
  {
    title: "Roof, gutter, and siding coordination",
    description:
      "Shows how complementary services can sit under one premium authority story without cluttering the core CTA path.",
  },
] as const;

const homeownerReasons = [
  {
    title: "The first screen answers the trust question fast",
    description:
      "Instead of leading with a generic contractor pitch, the concept immediately routes the buyer into inspection, estimate, or call intent.",
  },
  {
    title: "Insurance-related questions are handled with restraint",
    description:
      "The site acknowledges the real friction buyers feel without slipping into spammy claims language.",
  },
  {
    title: "High-ticket work looks expensive on purpose",
    description:
      "Typography, contrast, and layout are used to make replacement planning feel established rather than improvised.",
  },
  {
    title: "Mobile CTA hierarchy stays obvious",
    description:
      "Inspection and estimate actions remain visible, but the page still leaves room for detail and trust-building.",
  },
] as const;

const summitFaqs = [
  {
    question: "Why lead with inspections before replacement details?",
    answer:
      "Because roofing buyers are often urgent and skeptical at the same time. An inspection-first path reduces pressure, clarifies the next step, and earns more trust than dropping them straight into a replacement pitch.",
  },
  {
    question: "How does the concept talk about insurance without sounding spammy?",
    answer:
      "By treating insurance as a process question, not a marketing hook. The layout explains what homeowners usually want to understand while avoiding guarantees, partnership claims, or approval promises.",
  },
  {
    question: "Why are the proof sections labeled as placeholders?",
    answer:
      "Because this is a fictional production concept inside a real agency site. Licenses, reviews, warranties, and certifications should only be shown once a real client provides verified details.",
  },
  {
    question: "What does this concept demonstrate for Leadcraft prospects?",
    answer:
      "It shows how Leadcraft can build a more commanding local-service site system for trust-heavy, high-ticket categories without relying on fake proof or generic contractor layouts.",
  },
] as const;

export default function SummitShieldRoofingPage({
  product,
}: SummitShieldRoofingPageProps) {
  return (
    <SiteShell
      showStickyCTA={false}
      mainClassName="bg-[linear-gradient(180deg,#090b11_0%,#0d1016_34%,#15110f_100%)]"
    >
      <ClientProductStickyCTA
        primaryHref="#book-inspection"
        secondaryHref="#replacement-planning"
        tertiaryHref="#final-cta"
      />

      <section className="relative overflow-hidden pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-55">
          <Aurora />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 16% 12%, ${product.theme.glow}, transparent 24%), radial-gradient(circle at 84% 12%, rgba(255,255,255,0.06), transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.03), transparent 30%)`,
          }}
        />
        <div className="section-shell relative z-10">
          <ScrollReveal direction="blur">
            <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow">{product.hero.eyebrow}</span>
                  <span className="rounded-full border border-[rgba(240,179,93,0.24)] bg-[rgba(240,179,93,0.1)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#f4d9ac]">
                    Fictional Production Concept
                  </span>
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[#d7d3cb]">
                  {product.company}
                </p>
                <h1 className="display-title mt-4 text-[clamp(3rem,9vw,6.2rem)] text-[#f7f2e8]">
                  <ScrollRevealText
                    text="Inspect the damage first. Earn the replacement decision second."
                    className="block"
                  />
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
                  A premium roofing concept for skeptical homeowners who need
                  clarity, authority, and a next step that does not feel like a
                  hard sell. This page demonstrates the intended conversion
                  hierarchy only. It is not a live roofing company website.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <a href="#book-inspection" className="button-primary px-6 py-4 text-sm">
                    Book Inspection
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#replacement-planning" className="button-secondary px-6 py-4 text-sm">
                    Request Estimate
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#final-cta"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(240,179,93,0.24)] bg-[rgba(240,179,93,0.1)] px-6 py-4 text-sm font-semibold text-[#f7efe1] transition-colors hover:bg-[rgba(240,179,93,0.18)]"
                  >
                    Call Now
                  </a>
                </div>

                <p className="mt-4 text-sm leading-7 text-stone-500">
                  Demo actions stay on-page because this is a concept build
                  inside Leadcraft&apos;s portfolio.
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {product.detail.heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5"
                    >
                      <p className="mini-label">{stat.label}</p>
                      <p className="mt-3 text-lg font-semibold text-stone-50">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <ClientProductScene product={product} className="min-h-[420px]" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.7rem] border border-[rgba(240,179,93,0.22)] bg-[rgba(240,179,93,0.08)] p-5">
                    <p className="mini-label">Service Stack</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {serviceTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
                    <p className="mini-label">Concept Rule</p>
                    <p className="mt-4 text-sm leading-7 text-stone-200">
                      Trust sections are intentionally placeholders only. No
                      fake badges, reviews, inspection counts, or revenue claims
                      appear anywhere in the concept.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section
        id="book-inspection"
        className="section-pad scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="section-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <ScrollReveal direction="left">
            <div className="max-w-2xl">
              <span className="eyebrow">Storm Damage Inspection</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The page routes uncertainty into a calmer inspection path first.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                The buyer is urgent, but not ready to trust broad claims. This
                section is designed to answer the immediate question: should
                someone inspect this before I make a bigger decision?
              </p>

              <div className="mt-8 rounded-[1.85rem] border border-[rgba(240,179,93,0.2)] bg-[rgba(240,179,93,0.08)] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(240,179,93,0.24)] bg-black/20 text-[#f4d9ac]">
                    <CircleAlert className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">Damage-Sign Checklist</p>
                    <div className="mt-5 space-y-4">
                      {damageChecklist.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4"
                        >
                          <p className="text-sm font-semibold text-stone-50">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-stone-300">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4">
            {inspectionLanes.map((item, index) => (
              <ScrollReveal
                key={item.title}
                direction={index === 1 ? "right" : "up"}
                delay={index * 0.05}
              >
                <article
                  className="rounded-[1.85rem] border p-6"
                  style={{
                    borderColor:
                      index === 0
                        ? "rgba(240,179,93,0.24)"
                        : "rgba(255,255,255,0.08)",
                    background:
                      index === 0
                        ? "linear-gradient(145deg, rgba(240,179,93,0.12), rgba(255,255,255,0.03))"
                        : "rgba(255,255,255,0.03)",
                    transform:
                      index === 1 ? "skewY(-1.4deg)" : index === 2 ? "skewY(1.1deg)" : undefined,
                  }}
                >
                  <p className="mini-label">Lane 0{index + 1}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    {item.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="insurance-path"
        className="section-pad section-rule scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Insurance Process</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              Claim-process questions are handled like planning, not advertising.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              This timeline gives the homeowner enough process clarity to feel
              guided, while deliberately avoiding any fake guarantees, fake
              partnerships, or storm-chasing rhetoric.
            </p>
          </div>

          <div className="mt-10 grid gap-4 xl:grid-cols-4">
            {insuranceSteps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.06} direction="up">
                <article className="relative h-full overflow-hidden rounded-[1.85rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(90deg, rgba(240,179,93,0.82), transparent)"
                          : "linear-gradient(90deg, rgba(215,211,203,0.72), transparent)",
                    }}
                  />
                  <p className="mini-label">Step 0{index + 1}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    {step.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="replacement-planning"
        className="section-pad scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="section-shell grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-start">
          <ScrollReveal direction="left">
            <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <span className="eyebrow">Roof Replacement</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                Replacement gets premium framing instead of generic service-copy clutter.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                The design uses stronger contrast, material language, and clean
                sequencing so high-ticket work feels considered before the buyer
                ever reaches out.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {serviceTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4">
            {replacementFrames.map((item, index) => (
              <ScrollReveal
                key={item.title}
                direction={index === 1 ? "right" : "up"}
                delay={index * 0.05}
              >
                <article className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(240,179,93,0.2)] bg-[rgba(240,179,93,0.1)] text-[#f4d9ac]">
                      {index === 0 ? (
                        <Compass className="h-4 w-4" />
                      ) : index === 1 ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <p className="mini-label">Planning Focus</p>
                      <h3 className="mt-3 text-2xl font-semibold text-stone-50">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-stone-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Trust Placeholders</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              Trust blocks are clearly marked until real proof exists.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              This keeps the concept persuasive without crossing into invented
              claims. The placeholders show where verified business proof would
              live in a real production build.
            </p>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-4">
            {trustPlaceholders.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.05} direction="up">
                <article className="h-full rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="mini-label">Placeholder</p>
                    <BadgeCheck className="h-4 w-4 text-stone-500" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-stone-50">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    {item.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <ScrollReveal direction="left" className="max-w-3xl">
              <span className="eyebrow">Gallery Concept</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The gallery strip sells quality without relying on fake numbers.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                The visual goal is controlled drama: stronger material contrast,
                cleaner framing, and project-story cues that feel established
                without pretending there is already a verified case-study library.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-[1.85rem] border border-[rgba(240,179,93,0.18)] bg-[rgba(240,179,93,0.08)] p-5">
                <p className="mini-label">Concept Note</p>
                <p className="mt-3 text-sm leading-7 text-stone-200">
                  In a real build, this area would be populated with approved
                  job photography, captions, and category filters supplied by
                  the roofing company.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {galleryItems.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.05} direction="up">
                <article className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-[rgba(255,255,255,0.03)]">
                  <div
                    className="h-48"
                    style={{
                      background:
                        index === 0
                          ? "linear-gradient(135deg, rgba(240,179,93,0.3), rgba(255,255,255,0.04), rgba(17,19,24,0.94))"
                          : index === 1
                            ? "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(240,179,93,0.1), rgba(17,19,24,0.92))"
                            : "linear-gradient(135deg, rgba(215,211,203,0.18), rgba(255,255,255,0.03), rgba(17,19,24,0.94))",
                    }}
                  />
                  <div className="p-6">
                    <p className="mini-label">Concept gallery</p>
                    <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-stone-300">
                      {item.description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <ScrollReveal direction="left">
            <div className="max-w-2xl">
              <span className="eyebrow">Why Homeowners Call Us First</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The concept earns the first call by making the next step feel obvious.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                The homeowner is looking for authority, but they are screening
                hard for pressure, confusion, and vague promises. Every section
                is shaped around that tension.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4">
            {homeownerReasons.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delay={index * 0.05}
                direction={index % 2 === 0 ? "up" : "right"}
              >
                <article className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                  <h3 className="text-2xl font-semibold text-stone-50">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    {item.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <ScrollReveal direction="left">
            <div className="max-w-2xl">
              <span className="eyebrow">FAQ</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The last friction points are answered in a direct tone.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                This FAQ reinforces the concept rules: inspection first, no fake
                proof, and no spammy insurance language.
              </p>
            </div>
          </ScrollReveal>

          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] px-6 py-3 sm:px-8">
            {summitFaqs.map((faq, index) => (
              <details
                key={faq.question}
                open={index === 0}
                className="border-b border-white/10 last:border-b-0"
              >
                <summary className="focus-lux flex cursor-pointer items-center justify-between gap-4 rounded-2xl py-5">
                  <span className="flex items-start gap-4">
                    <span className="mini-label mt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-semibold text-stone-50">
                      {faq.question}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300">
                    +
                  </span>
                </summary>
                <div className="pb-5 pl-12 pr-4 text-sm leading-7 text-stone-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="final-cta"
        className="section-pad scroll-mt-24 pb-24 sm:scroll-mt-28 sm:pb-28"
      >
        <div className="section-shell">
          <ScrollReveal direction="blur">
            <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(240,179,93,0.22)] bg-[linear-gradient(135deg,rgba(240,179,93,0.14),rgba(255,255,255,0.04),rgba(8,9,13,0.96))] p-7 sm:p-9">
              <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
                <div className="max-w-3xl">
                  <span className="eyebrow">Final CTA Zone</span>
                  <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                    The concept ends with a decisive next-step lane, not generic contact clutter.
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-stone-200">
                    These actions demonstrate the intended roofing CTA hierarchy.
                    If you want this level of authority and clarity for your own
                    company, the real next move is a Leadcraft strategy call.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <a href="#book-inspection" className="button-primary px-6 py-3 text-sm">
                      Book Inspection
                    </a>
                    <a href="#replacement-planning" className="button-secondary px-6 py-3 text-sm">
                      Request Estimate
                    </a>
                    <Link
                      href="/client-products"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-stone-100 transition-colors hover:border-[rgba(240,179,93,0.28)] hover:text-[color:var(--accent-strong)]"
                    >
                      Browse All Concepts
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                    <p className="mini-label">Concept Integrity</p>
                    <p className="mt-4 text-sm leading-7 text-stone-200">
                      This fictional production concept does not imply a live
                      customer relationship, real inspections, or verified business outcomes.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                    <p className="mini-label">Real Leadcraft CTA</p>
                    <p className="mt-4 text-sm leading-7 text-stone-200">
                      Want this style built around your actual services, proof,
                      and service area? Use the real agency path below.
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                      <a
                        href={siteConfig.calendlyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f0b35d,#d7d3cb)] px-5 py-3 text-sm font-semibold text-[#18120b]"
                      >
                        Book Strategy Call
                      </a>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-stone-100 transition-colors hover:border-[rgba(240,179,93,0.28)] hover:text-[color:var(--accent-strong)]"
                      >
                        Request A Site Audit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
