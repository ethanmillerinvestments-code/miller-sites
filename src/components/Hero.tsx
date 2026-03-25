import {
  ArrowDownRight,
  BadgeCheck,
  Clock3,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import AnimatedValue from "@/components/AnimatedValue";
import AutoPresentTrigger from "@/components/AutoPresentTrigger";
import EditorialReveal from "@/components/EditorialReveal";
import GradientReveal from "@/components/GradientReveal";
import MagneticButton from "@/components/MagneticButton";
import ScrollReveal from "@/components/ScrollReveal";
import SectionBridge from "@/components/SectionBridge";
import SectionSpotlight from "@/components/SectionSpotlight";
import StaggerReveal from "@/components/StaggerReveal";
import { supportOffer } from "@/lib/offers";
import { siteConfig } from "@/lib/site";

type FastFact = {
  label: string;
  value: string;
  animatedValue?: number;
  animatedPrefix?: string;
  animatedSuffix?: string;
};

const fastFacts: FastFact[] = [
  {
    label: "Builds",
    value: "From $1,650",
    animatedValue: 1650,
    animatedPrefix: "From $",
  },
  {
    label: "Support",
    value: `Optional ${supportOffer.priceLabel}`,
  },
  {
    label: "Quiz",
    value: "4 questions",
    animatedValue: 4,
    animatedSuffix: " questions",
  },
  {
    label: "Launches",
    value: "2-4 weeks",
  },
];

const assuranceCards = [
  {
    icon: FileCheck2,
    title: "Scope before kickoff",
    detail: "Written scope, signer clarity, and the launch path are locked before the project starts.",
    tone: "accent",
  },
  {
    icon: ShieldCheck,
    title: "Hardened intake path",
    detail: "Anti-spam, lead routing, form checks, and QA are built into the delivery path instead of treated as extras.",
    tone: "teal",
  },
  {
    icon: Clock3,
    title: "Shorter sales path",
    detail: "The homepage is designed to get buyers to the right lane fast, then move them into scope review or booking cleanly.",
    tone: "neutral",
  },
] as const;

const launchSteps = [
  "Take the 4-question package match.",
  "Review the live pricing ladder and fit.",
  "Send the brief or book the call for written scope.",
] as const;

const includedChecks = [
  "Mobile CTA placement",
  "Anti-spam and lead routing",
  "Metadata, robots, and sitemap",
  "Launch QA before go-live",
] as const;

export default function Hero() {
  return (
    <section id="hero-overview" className="relative section-pad pb-10 pt-32 sm:pt-36 sm:pb-12">
      <SectionSpotlight tone="gold" />
      <div className="section-shell">
        <div className="grid items-start gap-8 xl:grid-cols-[1.06fr_0.94fr] xl:gap-10">
          <div className="max-w-3xl">
            <span className="eyebrow">Leadcraft Agency</span>

            <ScrollReveal delay={0.03} direction="blur">
              <p className="editorial-kicker mt-7 max-w-xl">
                Editorial-grade websites for service operators who need a better
                first impression before the call even starts.
              </p>
            </ScrollReveal>

            <h1 className="sr-only">
              Websites that make home-service companies look established before
              the call starts.
            </h1>

            <EditorialReveal
              className="mt-5"
              lineClassName="display-title max-w-4xl text-[clamp(2.85rem,8vw,5.35rem)] text-stone-50"
              animateKerning
              lcpFirst
              lines={[
                <span key="hero-line-1">Websites that make</span>,
                <span key="hero-line-2">
                  home-service companies look{" "}
                  <GradientReveal text="established" className="headline-accent" delayOffset={0.16} />
                </span>,
                <span key="hero-line-3">before the call starts.</span>,
              ]}
            />

            <p className="mt-5 max-w-2xl text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)] sm:text-base">
              HVAC. Plumbing. Roofing. Electrical. Landscaping. Painting.
            </p>

            <p className="muted-copy mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
              Leadcraft rebuilds weak, generic local-service sites into premium
              sales assets with sharper trust, stronger service positioning, and
              a cleaner path to calls, quotes, and scope review.
            </p>

            <div className="mt-8 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
              <MagneticButton>
                <a
                  href="#package-finder"
                  data-analytics-event="cta_clicked"
                  data-analytics-label="Start The 4-Question Quiz"
                  data-analytics-location="hero"
                  className="button-primary w-full px-7 py-4 text-base sm:w-auto"
                >
                  Start The 4-Question Quiz
                </a>
              </MagneticButton>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="button-secondary w-full px-7 py-4 text-base sm:w-auto"
              >
                Book Strategy Call
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm leading-7 text-stone-400">
              <AutoPresentTrigger />
              <p>Audit-first direction. Scope-first intake. No fake instant quote or vague handoff.</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                Trust-first buyer flow
              </span>
              <span className="rounded-full border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">
                Anti-spam and launch QA included
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                One-time build first
              </span>
            </div>
          </div>

          <aside className="lux-panel editorial-frame rounded-[2rem] p-5 sm:p-7">
            <ScrollReveal direction="blur" depth="near">
            <div className="rounded-[1.65rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)] p-5">
              <p className="mini-label">Shortest Path</p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-50 sm:text-[2rem]">
                The homepage stays premium, but buyers now hit the real decision point sooner.
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                The visual system is richer, the flow is tighter, and the site
                moves from first impression to fit, pricing, and scope without
                wasting attention.
              </p>
            </div>
            </ScrollReveal>

            <StaggerReveal staggerDelay={0.07} direction="scale-blur" pattern="wave" className="mt-5 grid min-h-[11rem] gap-3 sm:min-h-[10rem] sm:grid-cols-2">
              {fastFacts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`rounded-[1.35rem] border p-4 ${
                    index === 0
                      ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                      : index === 1
                        ? "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)]"
                        : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className="mini-label">{fact.label}</p>
                  <p className="mt-3 text-lg font-semibold text-stone-50">
                    {fact.animatedValue != null ? (
                      <AnimatedValue
                        value={fact.animatedValue}
                        prefix={fact.animatedPrefix}
                        suffix={fact.animatedSuffix}
                      />
                    ) : (
                      fact.value
                    )}
                  </p>
                </div>
              ))}
            </StaggerReveal>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="lux-subtle rounded-[1.45rem] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                    <ArrowDownRight className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">What Happens First</p>
                    <p className="mt-1 text-sm font-semibold text-stone-100">
                      Buyers should reach the right lane in one pass.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {launchSteps.map((step, index) => (
                    <div
                      key={step}
                      className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-stone-200"
                    >
                      <span className="mr-2 font-semibold text-[color:var(--accent-strong)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lux-subtle rounded-[1.45rem] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">Included Before Launch</p>
                    <p className="mt-1 text-sm font-semibold text-stone-100">
                      Security, lead routing, and trust basics stay in the core build.
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
                  {includedChecks.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <StaggerReveal staggerDelay={0.08} direction="scale-blur" pattern="sequential" className="mt-6 grid gap-4 lg:grid-cols-3">
          {assuranceCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title}
                className={`rounded-[1.55rem] border p-5 ${
                  item.tone === "accent"
                    ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                    : item.tone === "teal"
                      ? "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)]"
                      : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-stone-100">{item.title}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-300">{item.detail}</p>
              </article>
            );
          })}
        </StaggerReveal>

        <SectionBridge variant="diamond" tone="accent" className="mt-10" />
      </div>
    </section>
  );
}
