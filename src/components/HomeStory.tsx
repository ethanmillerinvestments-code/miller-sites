import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/site";

const buyerSignals = [
  "Looks established fast",
  "Explains the service clearly",
  "Shows a realistic price path",
  "Makes the next step obvious",
] as const;

const salesCards = [
  {
    title: "Stronger first impression",
    body:
      "A sharper homepage, cleaner hierarchy, and better mobile trust stop the business from looking cheaper than it really is.",
    icon: Sparkles,
    tone: "accent",
  },
  {
    title: "Cleaner service messaging",
    body:
      "The site should separate real services, remove vague copy, and make it easier for better-fit buyers to self-sort.",
    icon: BadgeCheck,
    tone: "teal",
  },
  {
    title: "Faster route to calls and quotes",
    body:
      "Phone-first CTA placement, quote paths, and scope-first intake keep the next step visible before friction starts.",
    icon: PhoneCall,
    tone: "neutral",
  },
] as const;

const buildPoints = [
  "Homepage and service-page structure shaped around what the buyer needs to know first",
  "Phone-first CTA hierarchy that stays obvious on mobile",
  "Forms, anti-spam, metadata, sitemap, robots, and launch QA included before go-live",
  "One-time build first, with monthly support kept separate and optional",
] as const;

const projectSteps = [
  "Scope the offer, page depth, and main CTA path",
  "Design around trust, service clarity, and mobile behavior",
  "Build, test, and harden the main lead path before launch",
  "Launch with clean handoff or optional monthly support",
] as const;

export default function HomeStory() {
  return (
    <section id="why-it-works" className="section-pad section-rule">
      <div className="section-shell">
        <ScrollReveal direction="blur">
          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
            <div className="max-w-3xl">
              <span className="eyebrow">Why It Works</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The shorter page still answers the buyer questions that matter.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                Most home-service buyers decide quickly. They want to know if
                the company looks credible, what it does, what the likely price
                lane is, and how to move forward without digging through a long
                site.
              </p>
            </div>

            <div className="lux-subtle rounded-[1.8rem] p-5 sm:p-6">
              <p className="mini-label">What Buyers Judge First</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {buyerSignals.map((signal, index) => (
                  <div
                    key={signal}
                    className={`rounded-[1.3rem] border px-4 py-4 text-sm leading-7 text-stone-200 ${
                      index === 0
                        ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                        : index === 2
                          ? "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)]"
                          : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {salesCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <ScrollReveal
                key={card.title}
                delay={0.04 + index * 0.05}
                direction={index === 1 ? "blur" : "up"}
              >
                <article
                  className={`h-full rounded-[1.75rem] border p-5 sm:p-6 ${
                    index === 0 ? "lg:col-span-2" : ""
                  } ${
                    card.tone === "accent"
                      ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                      : card.tone === "teal"
                        ? "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)]"
                        : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mini-label">{index === 0 ? "Core Need" : "Client Signal"}</p>
                  </div>
                  <h3 className="mt-4 text-[1.7rem] font-semibold text-stone-50">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
                    {card.body}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <ScrollReveal delay={0.08} direction="left">
            <article className="lux-panel rounded-[1.95rem] p-5 sm:p-6">
              <p className="mini-label">What Leadcraft Builds In</p>
              <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                The technical and sales basics are part of the build.
              </h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {buildPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-stone-200"
                  >
                    <div className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                      <span>{point}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.12} direction="right">
            <article className="lux-panel rounded-[1.95rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="mini-label">How The Project Moves</p>
                  <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                    Smaller builds should feel clear, not dragged out.
                  </h3>
                </div>

                <div className="rounded-[1.3rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] px-4 py-4 text-sm leading-7 text-stone-200">
                  Typical smaller launches land in roughly 2 to 4 weeks once
                  scope and content are approved.
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {projectSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.1)] text-sm font-semibold text-[color:var(--teal)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-7 text-stone-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary px-6 py-3.5 text-sm"
                >
                  Book Strategy Call
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link href="/client-products" className="button-secondary px-6 py-3.5 text-sm">
                  View Proof Of Work
                </Link>
              </div>

              <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-stone-300">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-100">
                      Scope still comes before kickoff.
                    </p>
                    <p className="mt-2">
                      Price, deliverables, timeline, and signer clarity are
                      confirmed before work starts.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-6" delay={0.16} direction="blur">
          <div className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.025)] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="mini-label">Decision Shortcut</p>
                <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
                  If the current site feels generic, hard to trust on mobile,
                  or too vague about services and next steps, the quiz and
                  pricing sections below are the fastest way to sort the right
                  lane.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#package-finder" className="button-secondary px-5 py-3 text-sm">
                  Take The Price Quiz
                </a>
                <a href="#pricing" className="button-primary px-5 py-3 text-sm">
                  Compare Pricing
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
