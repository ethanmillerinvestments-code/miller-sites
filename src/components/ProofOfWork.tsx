"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import EditorialReveal from "@/components/EditorialReveal";
import GradientReveal from "@/components/GradientReveal";
import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";
import SectionSpotlight from "@/components/SectionSpotlight";

const proofItems = [
  {
    niche: "Plumbing company",
    location: "Richmond, VA",
    problem: "Site built in the early 2000s. Did not work on mobile.",
    before: "/proof/cl-plumbing-before.png",
    after: "/proof/cl-plumbing-after.png",
  },
  {
    niche: "Concrete contractor",
    location: "San Antonio, TX",
    problem: "Broken counters showed 0 years of experience and 0 projects.",
    before: "/proof/rocking-s-concrete-before.png",
    after: "/proof/rocking-s-concrete-after.png",
  },
  {
    niche: "Landscaping company",
    location: "Raleigh, NC",
    problem: "Homepage images were broken. Social links were dead.",
    before: "/proof/norris-landscaping-before.png",
    after: "/proof/norris-landscaping-after.png",
  },
] as const;

function ComparisonCard({
  item,
  index,
}: {
  item: (typeof proofItems)[number];
  index: number;
}) {
  return (
    <ScrollReveal delay={index * 0.1} direction="slide" depth="mid">
      <div className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.03]">
        <BeforeAfterSlider
          beforeSrc={item.before}
          afterSrc={item.after}
          beforeAlt={`${item.niche} before redesign`}
          afterAlt={`${item.niche} after concept redesign`}
        />

        <div className="p-5 sm:p-6">
          <p className="mini-label">
            {item.niche}, {item.location}
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-300">
            {item.problem}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function ProofOfWork() {
  return (
    <section id="proof" className="relative section-pad">
      <SectionBridge variant="gradient-wipe" tone="accent" className="mb-16" />
      <SectionSpotlight tone="gold" />
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Proof of Work</p>
          <EditorialReveal
            className="mt-6"
            lineClassName="section-title text-3xl sm:text-4xl"
            delayStep={0.06}
            lines={[
              <span key="proof-1">Real sites.</span>,
              <span key="proof-2">
                Real{" "}
                <GradientReveal
                  text="problems."
                  className="headline-accent"
                  delayOffset={0.06}
                />{" "}
                Concept fixes.
              </span>,
            ]}
          />
          <p className="muted-copy mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            These are real local service websites with real issues. The
            &ldquo;after&rdquo; is a concept redesign showing what the homepage
            could look like. No invented metrics, no fake results.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {proofItems.map((item, i) => (
            <ComparisonCard
              key={`${item.niche}-${item.location}`}
              item={item}
              index={i}
            />
          ))}
        </div>

        <p className="muted-copy mt-8 text-center text-xs">
          Business names withheld. Concept redesigns are directional, not
          delivered work.
        </p>
      </div>
    </section>
  );
}
