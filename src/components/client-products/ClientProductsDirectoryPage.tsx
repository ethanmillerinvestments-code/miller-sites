import Link from "next/link";

import { ArrowRight, GalleryVerticalEnd, Orbit, PanelsTopLeft } from "lucide-react";

import ClientProductCard from "@/components/ClientProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import { getClientProduct } from "@/lib/client-products";
import { siteConfig } from "@/lib/site";

const fieldform = getClientProduct("fieldform-outdoor-living");
const northline = getClientProduct("northline-climate");
const summit = getClientProduct("summit-shield-roofing");

export default function ClientProductsDirectoryPage() {
  if (!fieldform || !northline || !summit) {
    return null;
  }

  return (
    <SiteShell showStickyCTA={false}>
      <section className="section-pad relative overflow-hidden pt-32 sm:pt-40">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, rgba(216,170,115,0.16), transparent 24%), radial-gradient(circle at 85% 12%, rgba(125,183,176,0.12), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 34%)",
          }}
        />

        <div className="section-shell relative z-10">
          <ScrollReveal direction="blur" className="max-w-5xl">
            <span className="eyebrow">Proof Of Work</span>
            <h1 className="display-title mt-7 text-[clamp(3rem,9vw,6.15rem)] text-stone-50">
              Three standalone concept sites, each rebuilt with its own visual system.
            </h1>
            <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
              These are fictional production concepts for Leadcraft&apos;s portfolio. They are
              deliberately not palette-swapped copies of the main site. Each concept has its own
              route tree, menu behavior, typography direction, section rhythm, and mobile posture.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <ScrollReveal direction="left">
              <div className="rounded-[1.9rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] text-[color:var(--accent-strong)]">
                    <GalleryVerticalEnd className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="mini-label">What Changed</p>
                    <p className="mt-3 text-lg leading-8 text-stone-100">
                      Each demo now behaves like a small site, not a styled clone.
                    </p>
                    <p className="mt-4 text-sm leading-7 text-stone-300">
                      Northline uses an industrial utility system. Summit uses a high-contrast
                      inspection-first editorial system. Fieldform uses a lighter gallery-led
                      studio system. They are meant to feel structurally different.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                      <PanelsTopLeft className="h-4 w-4" />
                    </span>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-200">
                      Real internal pages
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-400">
                      Every concept has routed subpages instead of a single generic fallback template.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                      <Orbit className="h-4 w-4" />
                    </span>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-200">
                      Distinct motion
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-400">
                      Layout pacing, card behavior, and section rhythm now change by concept instead of sharing one house feel.
                    </p>
                  </div>
                </div>

                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-strong)] transition-colors hover:text-stone-50"
                >
                  Book Strategy Call
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-12 grid gap-6">
            <ScrollReveal direction="up">
              <ClientProductCard product={fieldform} featured />
            </ScrollReveal>

            <div className="grid gap-6 xl:grid-cols-2">
              <ScrollReveal direction="left" delay={0.04}>
                <ClientProductCard product={northline} />
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.08}>
                <ClientProductCard product={summit} />
              </ScrollReveal>
            </div>
          </div>

          <ScrollReveal direction="up" className="mt-12">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-7">
              <p className="mini-label">Need The Real Version?</p>
              <h2 className="mt-4 text-3xl font-semibold text-stone-50 sm:text-4xl">
                Use the concepts to judge direction. Use the real scope call to build the live site.
              </h2>
              <p className="muted-copy mt-4 max-w-3xl text-sm leading-7">
                These concepts stay fictional by design. Real builds use approved business proof,
                actual service-area language, real CTAs, and a written scope before anything goes live.
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
                <Link href="/contact" className="button-secondary px-6 py-3 text-sm">
                  Request A Site Teardown
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
