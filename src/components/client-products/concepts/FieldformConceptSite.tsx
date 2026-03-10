import Link from "next/link";

import {
  ArrowRight,
  BookOpenText,
  Flower2,
  Grid2X2,
  Layers3,
  Leaf,
  Sparkles,
  Trees,
} from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import {
  fieldformBody,
  fieldformDisplay,
} from "@/components/client-products/concepts/concept-fonts";
import { getClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

export type FieldformView = "home" | "galleries" | "services" | "process";

const navItems: Array<{
  label: string;
  href: string;
  view: FieldformView;
}> = [
  {
    label: "Atelier",
    href: "/client-products/fieldform-outdoor-living",
    view: "home",
  },
  {
    label: "Galleries",
    href: "/client-products/fieldform-outdoor-living/galleries",
    view: "galleries",
  },
  {
    label: "Services",
    href: "/client-products/fieldform-outdoor-living/services",
    view: "services",
  },
  {
    label: "Process",
    href: "/client-products/fieldform-outdoor-living/process",
    view: "process",
  },
];

function FieldformHeader({ view }: { view: FieldformView }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#bcae98]/35 bg-[#f5efe5]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/client-products"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#6d5f51] transition-colors hover:text-[#241e18]"
          >
            Back to proof of work
          </Link>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[#8a7c6e]">
            Fieldform Outdoor Living
          </p>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-all ${
                item.view === view
                  ? "border-[#7e9567]/38 bg-[#7e9567]/10 text-[#314126]"
                  : "border-[#cdbca5] bg-white/70 text-[#5d5146] hover:border-[#d2a67b]/36 hover:text-[#241e18]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full border border-[#7e9567]/28 bg-[#7e9567]/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#314126] md:inline-flex"
        >
          Request teardown
        </Link>

        <details className="group lg:hidden">
          <summary className="list-none rounded-full border border-[#cdbca5] bg-white/80 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#4b4138]">
            Menu
          </summary>
          <div className="absolute right-4 top-[74px] w-[296px] rounded-[1.4rem] border border-[#cdbca5] bg-[#faf5ed] p-3 shadow-[0_24px_60px_rgba(36,28,21,0.14)]">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[1rem] border px-4 py-3 text-sm font-semibold ${
                    item.view === view
                      ? "border-[#7e9567]/36 bg-[#7e9567]/10 text-[#314126]"
                      : "border-[#d7c7b3] bg-white/85 text-[#574d43]"
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

function FieldformFooter() {
  return (
    <footer className="border-t border-[#cdbca5] bg-[#efe6d9]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.78fr_0.22fr] lg:px-8">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#7c6e61]">
            Fictional production concept
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4d433a]">
            Fieldform Outdoor Living is a fictional portfolio concept. Replace project
            imagery, reviews, design credentials, and process proof with approved real client
            materials before any live use.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-[#4d433a]">
          <Link href="/client-products" className="transition-colors hover:text-[#241e18]">
            Proof of work
          </Link>
          <Link href="/contact" className="transition-colors hover:text-[#241e18]">
            Request teardown
          </Link>
        </div>
      </div>
    </footer>
  );
}

function GalleryMosaic() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] bg-[linear-gradient(160deg,#d9c0a0,#b8c8aa)] p-5 text-[#211c17]">
        <div className="h-[300px] rounded-[1.6rem] bg-[linear-gradient(150deg,rgba(255,255,255,0.48),rgba(112,131,93,0.24))]" />
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#4b463b]">
              Featured outdoor living concept
            </p>
            <p className="mt-2 text-3xl leading-tight [font-family:var(--font-fieldform-display)]">
              Layered patio, soft planting edge, and lounge-zone rhythm.
            </p>
          </div>
          <span className="rounded-full border border-[#6f8661]/30 bg-white/50 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[#314126]">
            Editorial
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[1.8rem] bg-[#f9f2e9] p-5 shadow-[0_18px_40px_rgba(64,48,33,0.08)]">
          <div className="h-[148px] rounded-[1.35rem] bg-[linear-gradient(145deg,#c6d2b3,#e7d2bc)]" />
          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.22em] text-[#817364]">
            Hardscape frame
          </p>
          <p className="mt-2 text-xl leading-tight text-[#241e18] [font-family:var(--font-fieldform-display)]">
            Material detail with retaining and step geometry.
          </p>
        </div>
        <div className="rounded-[1.8rem] bg-[#efe3d3] p-5 shadow-[0_18px_40px_rgba(64,48,33,0.08)]">
          <div className="h-[148px] rounded-[1.35rem] bg-[linear-gradient(145deg,#d8b58a,#f0ebde)]" />
          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.22em] text-[#817364]">
            Scoped inquiry card
          </p>
          <p className="mt-2 text-xl leading-tight text-[#241e18] [font-family:var(--font-fieldform-display)]">
            Quote path stays serious without flattening the aspirational feel.
          </p>
        </div>
      </div>
    </div>
  );
}

function OverviewPage() {
  const product = getClientProduct("fieldform-outdoor-living");

  if (!product) {
    return null;
  }

  return (
    <>
      <section className="border-b border-[#ccbda9]/45 bg-[radial-gradient(circle_at_top,rgba(126,149,103,0.12),transparent_28%),linear-gradient(180deg,#f5efe5_0%,#f0e5d7_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="blur" className="max-w-3xl text-center lg:text-left">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#7e9567]">
              Outdoor living atelier
            </p>
            <h1 className="mt-5 text-[clamp(3rem,8vw,6.1rem)] leading-[0.92] tracking-[-0.05em] text-[#241e18] [font-family:var(--font-fieldform-display)]">
              A softer, more editorial service site that still sells scope.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#54483e] lg:mx-0">
              This concept breaks away from both the Leadcraft main site and the other
              demos. It uses centered rhythm, more open white space, lighter atmosphere,
              and an image-forward layout designed for aspirational outdoor-living buyers.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:items-start">
              <Link
                href="/client-products/fieldform-outdoor-living/galleries"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#324128] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f2f0ea] transition-transform hover:-translate-y-0.5"
              >
                Browse galleries
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/client-products/fieldform-outdoor-living/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d2a67b]/35 bg-[#d2a67b]/10 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5c4123] transition-colors hover:bg-[#d2a67b]/16"
              >
                Explore services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <GalleryMosaic />
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-[#ccbda9]/45 bg-[#fbf6ef]">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7e9567]">
                Distinct site grammar
              </p>
              <h2 className="mt-4 text-5xl leading-[0.94] tracking-[-0.04em] text-[#241e18] [font-family:var(--font-fieldform-display)] sm:text-6xl">
                Centered, airy, tactile, and disciplined.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#5d5146]">
                This concept is lighter, more gallery-led, and more emotionally paced than the
                HVAC and roofing sites. It uses softer motion, warmer neutrals, and a centered
                navigation system to feel like a different studio entirely.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Gallery-led homepage",
                body: "Lead with project atmosphere, then pull the user into a scoped next step.",
                href: "/client-products/fieldform-outdoor-living/galleries",
                icon: Grid2X2,
              },
              {
                title: "Service atelier",
                body: "Design, build, and care each get their own quieter, more elegant lane.",
                href: "/client-products/fieldform-outdoor-living/services",
                icon: Layers3,
              },
              {
                title: "Process journal",
                body: "Turn planning and communication into the trust system for higher-ticket work.",
                href: "/client-products/fieldform-outdoor-living/process",
                icon: BookOpenText,
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <ScrollReveal key={item.title} delay={0.05 * index} className="h-full">
                  <Link
                    href={item.href}
                    className="flex h-full flex-col rounded-[1.9rem] border border-[#d7c7b3] bg-white/80 p-6 shadow-[0_18px_40px_rgba(64,48,33,0.08)] transition-transform hover:-translate-y-1"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3e5] text-[#314126]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-3xl leading-tight text-[#241e18] [font-family:var(--font-fieldform-display)]">
                      {item.title}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#564c42]">{item.body}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#7e9567]">
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

function GalleriesPage() {
  return (
    <>
      <section className="border-b border-[#ccbda9]/45 bg-[linear-gradient(180deg,#f6efe4_0%,#eee2d0_100%)]">
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7e9567]">
              Galleries
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,6rem)] leading-[0.92] tracking-[-0.05em] text-[#241e18] [font-family:var(--font-fieldform-display)]">
              Visual browsing should feel curated, not crowded.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#564b40]">
              This view gives the concept a distinct image-first browse pattern with category
              chips, more whitespace, and a softer cadence than the other concept sites.
            </p>
          </ScrollReveal>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["All concepts", "Outdoor living", "Hardscape", "Seasonal detail"].map((chip, index) => (
              <ScrollReveal key={chip} delay={0.04 * index}>
                <span
                  className={`inline-flex rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] ${
                    index === 0
                      ? "border-[#7e9567]/36 bg-[#7e9567]/10 text-[#314126]"
                      : "border-[#d7c7b3] bg-white/75 text-[#5c5147]"
                  }`}
                >
                  {chip}
                </span>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              <div className="rounded-[2rem] bg-[linear-gradient(150deg,#d8b58a,#dce5cd)] p-6">
                <div className="h-[340px] rounded-[1.7rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.48),rgba(112,131,93,0.24))]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.8rem] bg-[#f9f2e9] p-5 shadow-[0_18px_40px_rgba(64,48,33,0.08)]">
                  <div className="h-[180px] rounded-[1.35rem] bg-[linear-gradient(145deg,#e8ddd0,#c5d2b4)]" />
                </div>
                <div className="rounded-[1.8rem] bg-[#ece4d8] p-5 shadow-[0_18px_40px_rgba(64,48,33,0.08)]">
                  <div className="h-[180px] rounded-[1.35rem] bg-[linear-gradient(145deg,#d8b58a,#f0efe9)]" />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                "Featured patio and lounge narrative card",
                "Stone and retaining-detail material study",
                "Scoped inquiry teaser with soft CTA reinforcement",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.8rem] border border-[#d7c7b3] bg-white/80 p-6 shadow-[0_18px_40px_rgba(64,48,33,0.08)]"
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#8b7d6f]">
                    Gallery note
                  </p>
                  <p className="mt-3 text-xl leading-tight text-[#241e18] [font-family:var(--font-fieldform-display)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <section className="border-b border-[#ccbda9]/45 bg-[linear-gradient(180deg,#f7efe5_0%,#efe4d5_100%)]">
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7e9567]">
              Services
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,5.8rem)] leading-[0.92] tracking-[-0.05em] text-[#241e18] [font-family:var(--font-fieldform-display)]">
              Design, build, and care are separated with much calmer rhythm.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#564b40]">
              This page trades the typical contractor service grid for a more editorial layout
              with spacious cards, centered transitions, and quieter calls to action.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Design",
                body: "Planning, concept direction, and layout discussions for the buyer who needs clarity before scope.",
                icon: Flower2,
              },
              {
                title: "Build",
                body: "Outdoor living, hardscape, and material-forward construction systems presented with stronger visual trust.",
                icon: Trees,
              },
              {
                title: "Care",
                body: "Seasonal refresh, garden care, and upkeep support framed as retention without overtaking premium work.",
                icon: Leaf,
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <ScrollReveal key={item.title} delay={0.05 * index} className="h-full">
                  <article className="flex h-full flex-col rounded-[1.9rem] border border-[#d7c7b3] bg-white/80 p-6 shadow-[0_18px_40px_rgba(64,48,33,0.08)]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3e5] text-[#314126]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-3xl leading-tight text-[#241e18] [font-family:var(--font-fieldform-display)]">
                      {item.title}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#564c42]">{item.body}</p>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function ProcessPage() {
  return (
    <>
      <section className="border-b border-[#ccbda9]/45 bg-[linear-gradient(180deg,#f6eee3_0%,#ede0cf_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-20">
          <ScrollReveal direction="left" className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7e9567]">
              Process journal
            </p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,5.8rem)] leading-[0.92] tracking-[-0.05em] text-[#241e18] [font-family:var(--font-fieldform-display)]">
              Planning becomes the trust layer instead of generic “quality” claims.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#564b40]">
              This page shows how a premium landscaping brand can win confidence through
              communication, material thinking, and scoped next steps instead of fake awards
              or luxury clichés.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="grid gap-4">
              {[
                "Discover the project intent and lifestyle use first.",
                "Shape the scope around category fit, materials, and budget reality.",
                "Move to a disciplined consultation or quote request with better context.",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[1.5rem] border p-5 ${
                    index === 1
                      ? "border-[#7e9567]/34 bg-[#7e9567]/10"
                      : "border-[#d7c7b3] bg-white/80"
                  }`}
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#857567]">
                    Step 0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#463c33]">{item}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

export default function FieldformConceptSite({ view }: { view: FieldformView }) {
  return (
    <div className={`${fieldformDisplay.variable} ${fieldformBody.variable}`}>
      <div className="min-h-screen bg-[#f5efe5] text-[#241e18] [font-family:var(--font-fieldform-body)]">
        <FieldformHeader view={view} />
        <main>
          {view === "home" ? <OverviewPage /> : null}
          {view === "galleries" ? <GalleriesPage /> : null}
          {view === "services" ? <ServicesPage /> : null}
          {view === "process" ? <ProcessPage /> : null}
        </main>
        <section className="border-t border-[#ccbda9]/45 bg-[#f8f2e9]">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-12 text-center sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7e9567]">
                Why this feels different
              </p>
              <p className="mt-4 text-sm leading-7 text-[#564b40]">
                Fieldform uses centered menus, wider breathing room, lighter surfaces, softer
                tonal contrast, and an editorial serif/body pairing so it reads like a separate
                design studio site rather than another Leadcraft variant.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/client-products"
                className="inline-flex items-center gap-2 rounded-full border border-[#d7c7b3] bg-white/80 px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#4e4339]"
              >
                <Grid2X2 className="h-4 w-4" />
                Portfolio
              </Link>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#324128] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#f2f0ea]"
              >
                <Sparkles className="h-4 w-4" />
                Strategy call
              </a>
            </div>
          </div>
        </section>
        <FieldformFooter />
      </div>
    </div>
  );
}
