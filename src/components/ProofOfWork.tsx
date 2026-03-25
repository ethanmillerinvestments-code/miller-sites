"use client";

import { type ReactNode, useState } from "react";

import Image from "next/image";

import EditorialReveal from "@/components/EditorialReveal";
import GradientReveal from "@/components/GradientReveal";
import ConcreteConcept from "@/components/proof-concepts/ConcreteConcept";
import LandscapingConcept from "@/components/proof-concepts/LandscapingConcept";
import PlumbingConcept from "@/components/proof-concepts/PlumbingConcept";
import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";
import SectionSpotlight from "@/components/SectionSpotlight";

const proofItems = [
  {
    niche: "Plumbing company",
    location: "Richmond, VA",
    problem: "Site built in the early 2000s. Did not work on mobile.",
    before: "/proof/cl-plumbing-before.png",
    concept: <PlumbingConcept />,
  },
  {
    niche: "Concrete contractor",
    location: "San Antonio, TX",
    problem: "Broken counters showed 0 years of experience and 0 projects.",
    before: "/proof/rocking-s-concrete-before.png",
    concept: <ConcreteConcept />,
  },
  {
    niche: "Landscaping company",
    location: "Raleigh, NC",
    problem: "Homepage images were broken. Social links were dead.",
    before: "/proof/norris-landscaping-before.png",
    concept: <LandscapingConcept />,
  },
] as const;

function ViewToggle({
  view,
  onChange,
}: {
  view: "before" | "after";
  onChange: (v: "before" | "after") => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-0.5 lg:hidden">
      {(["before", "after"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-full px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-all ${
            view === v
              ? "bg-white/12 text-white shadow-sm"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          {v === "before" ? "Before" : "Concept"}
        </button>
      ))}
    </div>
  );
}

function ProofComparisonCard({
  item,
  index,
}: {
  item: {
    niche: string;
    location: string;
    problem: string;
    before: string;
    concept: ReactNode;
  };
  index: number;
}) {
  const [view, setView] = useState<"before" | "after">("after");

  return (
    <ScrollReveal delay={index * 0.12} direction="slide" depth="mid">
      <div className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div>
            <p className="mini-label">
              {item.niche}, {item.location}
            </p>
            <p className="mt-1.5 text-sm leading-7 text-stone-300">
              {item.problem}
            </p>
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {/* Comparison grid */}
        <div className="p-4 sm:p-5 lg:grid lg:grid-cols-2 lg:gap-4">
          {/* Before */}
          <div
            className={`${view === "before" ? "block" : "hidden"} lg:block`}
          >
            <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Current site
            </p>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/8 bg-stone-900">
              <Image
                src={item.before}
                alt={`${item.niche} current website`}
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* After (live concept) */}
          <div
            className={`${view === "after" ? "block" : "hidden"} lg:block`}
          >
            <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Concept redesign
            </p>
            <div className="aspect-[16/10] overflow-hidden rounded-xl border border-white/8">
              {item.concept}
            </div>
          </div>
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

        <div className="mt-12 grid gap-6 sm:gap-8">
          {proofItems.map((item, i) => (
            <ProofComparisonCard
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
