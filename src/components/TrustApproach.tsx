"use client";

import { FileCheck2, FileSearch, User } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";
import StaggerReveal from "@/components/StaggerReveal";

const pillars = [
  {
    icon: FileSearch,
    title: "Real site audits",
    description:
      "Before-and-after comparisons of real local-service websites with clear problems. The redesign is a concept build showing what the site could become.",
  },
  {
    icon: FileCheck2,
    title: "Written scope before payment",
    description:
      "No vague handoff or instant quote. Every project starts with approved scope, signer clarity, and a deposit structure.",
  },
  {
    icon: User,
    title: "Direct operator",
    description:
      "One person handles sales, scope, build, and launch. No handoff chain, no account manager layer.",
  },
] as const;

export default function TrustApproach() {
  return (
    <section id="trust" className="section-pad">
      <SectionBridge variant="glow-pulse" tone="accent" className="mb-16" />
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal direction="zoom" depth="near">
            <span className="eyebrow">Trust framework</span>
          </ScrollReveal>
          <ScrollReveal delay={0.06} direction="zoom" depth="mid">
            <h2 className="display-title mt-6 text-3xl text-stone-50 sm:text-4xl md:text-5xl">
              Built on real work, not invented proof.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.12} direction="zoom" depth="mid">
            <p className="muted-copy mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base">
              Leadcraft shows concept redesigns of real local-service websites
              rather than fabricated testimonials. The work speaks through
              auditable problems and visible design solutions.
            </p>
          </ScrollReveal>
        </div>

        <StaggerReveal staggerDelay={0.1} direction="zoom" pattern="sequential" className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
              <div key={pillar.title} className="lux-panel rounded-[1.5rem] p-6 sm:p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,170,115,0.25)] bg-[rgba(216,170,115,0.08)]">
                  <pillar.icon
                    className="h-5 w-5 text-[color:var(--accent-strong)]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-semibold text-stone-50">
                  {pillar.title}
                </h3>
                <p className="muted-copy mt-2 text-sm leading-7">
                  {pillar.description}
                </p>
              </div>
          ))}
        </StaggerReveal>

        <ScrollReveal delay={0.3} direction="zoom" depth="near">
          <div className="mt-10 text-center">
            <a
              href="/client-products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--accent-strong)] transition-colors hover:text-[color:var(--accent)]"
            >
              See the concept builds
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
