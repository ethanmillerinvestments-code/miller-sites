import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Compass,
  GalleryHorizontalEnd,
  Hammer,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import {
  summitBody,
  summitDisplay,
} from "@/components/client-products/concepts/concept-fonts";
import { getClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

export type SummitView = "home" | "inspection" | "replacement" | "exteriors";

const navItems: Array<{
  label: string;
  href: string;
  view: SummitView;
}> = [
  {
    label: "Authority",
    href: "/client-products/summit-shield-roofing",
    view: "home",
  },
  {
    label: "Inspection",
    href: "/client-products/summit-shield-roofing/inspection",
    view: "inspection",
  },
  {
    label: "Replacement",
    href: "/client-products/summit-shield-roofing/replacement",
    view: "replacement",
  },
  {
    label: "Exteriors",
    href: "/client-products/summit-shield-roofing/exteriors",
    view: "exteriors",
  },
];

const damageChecklist = [
  "Ceiling stains, attic moisture, or active leak questions",
  "Missing shingles, flashing lift, or visible storm damage",
  "Hail and wind concerns that need inspection before replacement talk",
] as const;

const insuranceSteps = [
  "Confirm what changed and whether the homeowner needs an inspection first.",
  "Document findings in plain language before any estimate conversation expands.",
  "Handle insurance questions as process guidance, not approval promises.",
  "Move into repair or replacement planning only after condition and scope are clear.",
] as const;

const replacementFrames = [
  "Replacement decisions are framed as planning, materials, and timing.",
  "Budget and financing conversations support the estimate instead of hijacking it.",
  "Gutters and siding reinforce a premium exterior system instead of becoming clutter.",
] as const;

const exteriorLanes = [
  {
    title: "Roof systems",
    body: "Keep inspection and replacement as the authority center of the site.",
  },
  {
    title: "Gutters",
    body: "Connect water-management upgrades without derailing the main roofing story.",
  },
  {
    title: "Siding",
    body: "Present siding as coordinated exterior scope for buyers already in a larger project conversation.",
  },
] as const;

function SummitHeader({ view }: { view: SummitView }) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f0e7]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/client-products"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#4d463c] transition-colors hover:text-black"
          >
            Back to proof of work
          </Link>
          <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#6a5d4e]">
            Summit Shield Roofing
          </p>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-all ${
                item.view === view
                  ? "border-[#b87a3a]/40 bg-[#b87a3a]/10 text-[#2a180b]"
                  : "border-black/10 bg-white/70 text-[#3f382f] hover:border-[#b87a3a]/28 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={siteConfig.calendlyUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full bg-[#171411] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#f7efe4] transition-colors hover:bg-black md:inline-flex"
        >
          Book strategy call
          <ArrowRight className="h-4 w-4" />
        </a>

        <details className="group lg:hidden">
          <summary className="list-none rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#3f382f]">
            Menu
          </summary>
          <div className="absolute right-4 top-[78px] w-[300px] rounded-[1.4rem] border border-black/10 bg-[#fff9f1] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[1rem] border px-4 py-3 text-sm font-semibold ${
                    item.view === view
                      ? "border-[#b87a3a]/35 bg-[#b87a3a]/10 text-[#28160b]"
                      : "border-black/10 bg-white text-[#3f382f]"
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

function SummitFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#f0e5d7]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.78fr_0.22fr] lg:px-8">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#6f5a44]">
            Fictional portfolio concept
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#3a3028]">
            Summit Shield Roofing is a concept build inside the Leadcraft portfolio.
            Replace inspections, insurance language, licenses, certifications,
            warranties, and review proof with approved real-business materials before use.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-[#3a3028]">
          <Link href="/client-products" className="transition-colors hover:text-black">
            Proof of work
          </Link>
          <Link href="/contact" className="transition-colors hover:text-black">
            Request teardown
          </Link>
        </div>
      </div>
    </footer>
  );
}

function OverviewPage() {
  const product = getClientProduct("summit-shield-roofing");

  if (!product) {
    return null;
  }

  return (
    <>
      <section className="border-b border-black/10 bg-[linear-gradient(180deg,#f7f0e7_0%,#f1e6d8_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="blur" className="max-w-3xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#8b6335]">
              Roofing authority concept
            </p>
            <h1 className="mt-5 text-[clamp(3rem,8vw,6.4rem)] leading-[0.88] tracking-[-0.05em] text-[#17120f] [font-family:var(--font-summit-display)]">
              Inspect the damage. Earn the replacement decision second.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#433931]">
              This concept is intentionally not a clone of the Leadcraft site. It uses
              a light editorial palette, stronger serif hierarchy, and an inspection-first
              content system built for trust-heavy roofing work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/client-products/summit-shield-roofing/inspection"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181310] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f7efe4] transition-transform hover:-translate-y-0.5"
              >
                Open inspection page
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/client-products/summit-shield-roofing/replacement"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b87a3a]/35 bg-[#b87a3a]/10 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2a180b] transition-colors hover:bg-[#b87a3a]/16"
              >
                Replacement planning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[2rem] border border-black/10 bg-[#181411] p-5 text-[#f3eadf] shadow-[0_28px_80px_rgba(0,0,0,0.2)]">
              <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[#f0c790]">
                    Core promise
                  </p>
                  <p className="mt-4 text-2xl leading-tight [font-family:var(--font-summit-display)]">
                    High-ticket clarity without storm-chasing theatrics.
                  </p>
                </div>
                <div className="grid gap-3">
                  {[
                    "Inspection-first CTA hierarchy",
                    "Insurance conversation handled with restraint",
                    "Replacement framed as planning, not pressure",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-stone-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {product.detail.heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/50">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#fff8ef]">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#8b6335]">
                  Authority lanes
                </p>
                <h2 className="mt-4 text-5xl leading-[0.92] tracking-[-0.04em] text-[#17120f] [font-family:var(--font-summit-display)] sm:text-6xl">
                  This site separates urgency, replacement, and exterior scope on purpose.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#5a4c40]">
                The layout is more editorial, lighter, and higher contrast than the HVAC
                concept. Its spacing is slower, its nav feels more luxury-architected,
                and its CTA rhythm centers on inspection.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {[
              {
                title: "Inspection lane",
                body: "Book the inspection before the homeowner needs to parse every roofing detail.",
                href: "/client-products/summit-shield-roofing/inspection",
                icon: TriangleAlert,
              },
              {
                title: "Replacement lane",
                body: "Shift into materials, estimate, and financing only after inspection trust exists.",
                href: "/client-products/summit-shield-roofing/replacement",
                icon: ShieldCheck,
              },
              {
                title: "Exterior lane",
                body: "Connect gutters and siding without turning the site into an undifferentiated list.",
                href: "/client-products/summit-shield-roofing/exteriors",
                icon: Compass,
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <ScrollReveal key={item.title} delay={index * 0.05} className="h-full">
                  <Link
                    href={item.href}
                    className="flex h-full flex-col rounded-[1.8rem] border border-black/10 bg-white p-6 transition-transform hover:-translate-y-1"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#181411] text-[#f2c693]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-3xl leading-tight text-[#17120f] [font-family:var(--font-summit-display)]">
                      {item.title}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#56483c]">{item.body}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#8b6335]">
                      Open page
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function InspectionPage() {
  return (
    <>
      <section className="border-b border-black/10 bg-[linear-gradient(180deg,#fbf4ea_0%,#f3e7d7_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="left" className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#8b6335]">
              Inspection page
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.05em] text-[#17120f] [font-family:var(--font-summit-display)]">
              Turn storm anxiety into a calmer inspection request.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#493e34]">
              This subpage is designed like a dedicated inspection funnel. It answers the
              most immediate homeowner question first: should someone look at this before I
              make a bigger decision?
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[1.9rem] border border-black/10 bg-[#171411] p-6 text-[#f5ede2]">
              <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[#f0c790]">
                Damage-sign checklist
              </p>
              <div className="mt-5 grid gap-4">
                {damageChecklist.map((item) => (
                  <div key={item} className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-stone-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#fffaf3]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          {insuranceSteps.map((step, index) => (
            <ScrollReveal key={step} delay={0.05 * index} className="h-full">
              <article className="flex h-full flex-col rounded-[1.55rem] border border-black/10 bg-white p-5">
                <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#8b6335]">
                  Step 0{index + 1}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#4b4035]">{step}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}

function ReplacementPage() {
  return (
    <>
      <section className="border-b border-black/10 bg-[linear-gradient(180deg,#f7ecdf_0%,#f2dfca_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="left" className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#8b6335]">
              Replacement page
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.05em] text-[#17120f] [font-family:var(--font-summit-display)]">
              Make high-ticket replacement feel deliberate and established.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#483d34]">
              The replacement view slows the pace down. It widens the margins, uses
              stronger material framing, and gives estimate-ready buyers a calmer decision
              environment than the inspection page.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="grid gap-4">
              {replacementFrames.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[1.45rem] border p-5 ${
                    index === 0
                      ? "border-[#b87a3a]/28 bg-[#b87a3a]/10"
                      : "border-black/10 bg-white/80"
                  }`}
                >
                  <p className="text-sm leading-7 text-[#34291f]">{item}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#fff9f2]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: "Material conversation",
              body: "Show the buyer what changes between product levels without noisy roofing jargon.",
            },
            {
              title: "Estimate request",
              body: "Keep the CTA grounded in inspection findings, scope, and decision clarity.",
            },
            {
              title: "Financing posture",
              body: "Acknowledge budgeting questions without sample-payment gimmicks.",
            },
          ].map((item, index) => (
            <ScrollReveal key={item.title} delay={0.04 * index} className="h-full">
              <article className="flex h-full flex-col rounded-[1.55rem] border border-black/10 bg-white p-6">
                <p className="text-3xl leading-tight text-[#17120f] [font-family:var(--font-summit-display)]">
                  {item.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#53463a]">{item.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}

function ExteriorsPage() {
  return (
    <>
      <section className="border-b border-black/10 bg-[linear-gradient(180deg,#faf3e7_0%,#f1e1cf_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="left" className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#8b6335]">
              Exterior systems page
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,5.8rem)] leading-[0.9] tracking-[-0.05em] text-[#17120f] [font-family:var(--font-summit-display)]">
              Gutters and siding should expand authority, not dilute it.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#473d34]">
              This page presents complementary services as coordinated exterior scope. It
              keeps roofing primary while still showing buyers the broader value of working
              with one well-positioned exterior contractor.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[1.9rem] border border-black/10 bg-[#181411] p-6 text-[#f5ede2]">
              <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[#f0c790]">
                Gallery tone
              </p>
              <div className="mt-5 grid gap-4">
                {[
                  "Before-and-after strip with strong material contrast",
                  "Inspection findings presentation with photo and note rhythm",
                  "Coordinated roof, gutter, and siding story for larger scope buyers",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-stone-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#fff9f2]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {exteriorLanes.map((item, index) => (
            <ScrollReveal key={item.title} delay={0.04 * index} className="h-full">
              <article className="flex h-full flex-col rounded-[1.55rem] border border-black/10 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171411] text-[#f2c693]">
                  {index === 0 ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : index === 1 ? (
                    <Hammer className="h-5 w-5" />
                  ) : (
                    <BadgeCheck className="h-5 w-5" />
                  )}
                </span>
                <p className="mt-5 text-3xl leading-tight text-[#17120f] [font-family:var(--font-summit-display)]">
                  {item.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#53463a]">{item.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}

export default function SummitShieldConceptSite({ view }: { view: SummitView }) {
  return (
    <div className={`${summitDisplay.variable} ${summitBody.variable}`}>
      <div className="min-h-screen bg-[#f7f0e7] text-[#17120f] [font-family:var(--font-summit-body)]">
        <SummitHeader view={view} />
        <main>
          {view === "home" ? <OverviewPage /> : null}
          {view === "inspection" ? <InspectionPage /> : null}
          {view === "replacement" ? <ReplacementPage /> : null}
          {view === "exteriors" ? <ExteriorsPage /> : null}
        </main>
        <section className="border-t border-black/10 bg-[#181411] text-[#f5ede2]">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#f0c790]">
                Why this feels different
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-200">
                Summit uses a light editorial backdrop, large serif titles, and inspection-led
                route architecture so it reads like a different company site, not a tinted copy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/client-products"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#f5ede2]"
              >
                <GalleryHorizontalEnd className="h-4 w-4" />
                Portfolio
              </Link>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#f0c790] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#21160d]"
              >
                <Sparkles className="h-4 w-4" />
                Strategy call
              </a>
            </div>
          </div>
        </section>
        <SummitFooter />
      </div>
    </div>
  );
}
