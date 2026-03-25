"use client";

import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";

const steps = [
  {
    number: "01",
    title: "Take the quiz",
    detail:
      "4 questions to match you with the right build tier.",
  },
  {
    number: "02",
    title: "Scope review",
    detail:
      "Written scope with deliverables, timeline, and price before any commitment.",
  },
  {
    number: "03",
    title: "Deposit",
    detail:
      "50% deposit to begin, 50% before launch or handoff.",
  },
  {
    number: "04",
    title: "Build",
    detail:
      "Direct build with revision rounds and regular progress updates.",
  },
  {
    number: "05",
    title: "Launch",
    detail:
      "QA, final review, go live, and optional ongoing support.",
  },
] as const;

const checklist = [
  "Phone links and primary CTA tested on mobile",
  "Form submission, validation, and inbox routing confirmed",
  "Security headers, SSL readiness, canonical, robots, and sitemap verified",
  "Approved proof positioned where it helps the sale",
] as const;

export default function Process() {
  return (
    <section id="process" className="section-pad">
      <SectionBridge variant="dot-trail" tone="accent" className="mb-16" />
      <div className="section-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <ScrollReveal direction="up" depth="near">
            <span className="eyebrow">Process</span>
          </ScrollReveal>
          <ScrollReveal delay={0.06} direction="up" depth="mid">
            <h2 className="display-title mt-7 text-4xl text-stone-50 sm:text-5xl md:text-6xl">
              How the project moves.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.12} direction="up" depth="mid">
            <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
              Smaller-scope service sites usually move in roughly 2 to 4 weeks
              once content and feedback are approved. Larger builds are scoped
              separately before timing is promised.
            </p>
          </ScrollReveal>

          {/* Timeline: vertical on mobile, stacked cards on all sizes */}
          <div className="relative mt-10 space-y-5">
            {/* Vertical timeline line (mobile and desktop) */}
            <div
              className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[rgba(216,170,115,0.3)] via-[rgba(216,170,115,0.12)] to-transparent"
              aria-hidden="true"
            />

            {steps.map((step, index) => (
              <ScrollReveal
                key={step.number}
                delay={0.14 + index * 0.08}
                direction={index % 2 === 0 ? "left" : "right"}
                depth="mid"
              >
                <div
                  className={`lux-panel relative flex gap-5 rounded-[1.5rem] p-5 sm:p-6 ${
                    index === 0 ? "border-[rgba(216,170,115,0.18)]" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(216,170,115,0.25)] bg-[rgba(216,170,115,0.08)] text-sm font-semibold text-[color:var(--accent-strong)]">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-50">
                      {step.title}
                    </h3>
                    <p className="muted-copy mt-3 text-sm leading-7">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={0.2} direction="blur" depth="mid">
          <div className="lux-panel rounded-[1.8rem] p-6 sm:p-7">
            <p className="mini-label">Before Launch</p>
            <h3 className="mt-4 text-3xl font-semibold text-stone-50">
              The launch check is part of the build.
            </h3>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
              {checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="mini-label">Kickoff Standard</p>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                Scope, deliverables, price, timeline, and signer identity are
                confirmed before work starts.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
