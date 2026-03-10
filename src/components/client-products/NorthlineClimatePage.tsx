import Link from "next/link";

import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  CircleAlert,
  Gauge,
  Layers3,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  TimerReset,
  Wrench,
} from "lucide-react";

import ClientProductStickyCTA from "@/components/client-products/ClientProductStickyCTA";
import ScrollReveal from "@/components/ScrollReveal";
import Aurora from "@/components/reactbits/Backgrounds/Aurora";
import ScrollRevealText from "@/components/reactbits/TextAnimations/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import type { ClientProduct } from "@/lib/client-products";

type NorthlineClimatePageProps = {
  product: ClientProduct;
};

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-7 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-stone-50 sm:text-6xl">
        {title}
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">{body}</p>
    </div>
  );
}

export default function NorthlineClimatePage({
  product,
}: NorthlineClimatePageProps) {
  const concept = product.detail.northline;

  if (!concept) {
    return null;
  }

  return (
    <SiteShell
      showStickyCTA={false}
      mainClassName="bg-[linear-gradient(180deg,#07101a_0%,#0a111b_34%,#141016_100%)]"
    >
      <ClientProductStickyCTA
        eyebrow="Northline Mobile CTA"
        primaryHref="#call-lane"
        primaryLabel="Call Now"
        secondaryHref="#request-service"
        secondaryLabel="Service"
        tertiaryHref="#estimate-lane"
        tertiaryLabel="Estimate"
      />

      <section className="relative overflow-hidden pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-55">
          <Aurora />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.8) 56%, transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 14%, rgba(220,168,109,0.22), transparent 30%), radial-gradient(circle at 86% 12%, rgba(120,182,178,0.14), transparent 22%)",
          }}
        />

        <div className="section-shell relative z-10">
          <div className="grid gap-10 xl:grid-cols-[0.98fr_1.02fr] xl:items-center">
            <ScrollReveal direction="blur" className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">{product.industry}</span>
                <span className="rounded-full border border-[rgba(220,168,109,0.26)] bg-[rgba(220,168,109,0.08)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">
                  {product.conceptBadge}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-stone-300">
                  {concept.conceptLabel}
                </span>
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
                {concept.hero.eyebrow}
              </p>
              <h1 className="mt-4 text-[clamp(3.2rem,9vw,6.2rem)] font-semibold uppercase leading-[0.84] tracking-[-0.05em] text-stone-50">
                <ScrollRevealText text={product.company} className="block" />
              </h1>
              <p className="mt-6 max-w-2xl text-2xl leading-8 text-stone-100 sm:text-[1.9rem] sm:leading-9">
                {concept.hero.headline}
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
                {concept.hero.body}
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-500">
                {product.detail.disclaimer}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {concept.hero.actions.map((action, index) =>
                  action.href.startsWith("/") ? (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={
                        index === 0
                          ? "button-primary px-6 py-3.5 text-sm"
                          : index === 1
                            ? "button-secondary px-6 py-3.5 text-sm"
                            : "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-stone-100 transition-colors hover:border-[rgba(120,182,178,0.26)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,170,115,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111b]"
                      }
                    >
                      {action.label}
                    </Link>
                  ) : (
                    <a
                      key={action.label}
                      href={action.href}
                      className={
                        index === 0
                          ? "button-primary px-6 py-3.5 text-sm"
                          : index === 1
                            ? "button-secondary px-6 py-3.5 text-sm"
                            : "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-stone-100 transition-colors hover:border-[rgba(120,182,178,0.26)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(216,170,115,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111b]"
                      }
                    >
                      {action.label}
                    </a>
                  )
                )}
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
                {concept.hero.supportNote}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="zoom" delay={0.08}>
              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(220,168,109,0.24)] bg-[linear-gradient(165deg,rgba(6,12,20,0.98),rgba(11,17,30,0.92)_58%,rgba(25,18,20,0.9))] p-5 shadow-[0_30px_80px_rgba(220,168,109,0.16)] sm:p-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.45rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div>
                      <p className="mini-label">Dispatch Interface</p>
                      <p className="mt-2 text-base font-semibold text-stone-100 sm:text-lg">
                        Calm under pressure. Clean routing under load.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[rgba(220,168,109,0.22)] bg-[rgba(220,168,109,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                      <Gauge aria-hidden="true" className="h-4 w-4" />
                      Concept system
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(4,8,14,0.78)] p-5">
                      <p className="mini-label">Primary routing</p>
                      <div className="mt-5 space-y-3">
                        <div className="h-2.5 w-24 rounded-full bg-white/20" />
                        <div className="h-7 w-[78%] rounded-full bg-white/90" />
                        <div className="h-7 w-[62%] rounded-full bg-white/70" />
                        <div className="h-2.5 w-[84%] rounded-full bg-white/18" />
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {["Call now", "Request service"].map((label, index) => (
                          <div
                            key={label}
                            className="rounded-[1.2rem] px-4 py-3 text-sm font-semibold"
                            style={{
                              background:
                                index === 0
                                  ? "linear-gradient(135deg, rgba(226,180,122,1), rgba(194,145,90,1))"
                                  : "rgba(255,255,255,0.08)",
                              color: index === 0 ? "#1b130c" : "#f5efe6",
                            }}
                          >
                            {label}
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                        <p className="mini-label">Priority note</p>
                        <p className="mt-3 text-sm leading-7 text-stone-200">
                          Repairs stay urgent, installs stay confident, and maintenance stays secondary.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {concept.hero.markers.map((marker, index) => (
                        <div
                          key={marker}
                          className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4"
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className="mt-1 flex h-10 w-10 items-center justify-center rounded-full"
                              style={{
                                backgroundColor:
                                  index === 1
                                    ? "rgba(120,182,178,0.14)"
                                    : "rgba(220,168,109,0.12)",
                                color: index === 1 ? "#78b6b2" : "#dca86d",
                              }}
                            >
                              {index === 0 ? (
                                <PhoneCall aria-hidden="true" className="h-4 w-4" />
                              ) : index === 1 ? (
                                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                              ) : (
                                <BadgeCheck aria-hidden="true" className="h-4 w-4" />
                              )}
                            </span>
                            <div>
                              <p className="mini-label">
                                {index === 0
                                  ? "Urgent buyer"
                                  : index === 1
                                    ? "Install buyer"
                                    : "Membership buyer"}
                              </p>
                              <p className="mt-2 text-sm leading-7 text-stone-200">
                                {marker}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.45rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="mini-label">Launch note</p>
                    <p className="mt-3 text-sm leading-7 text-stone-300">
                      {concept.launchNote}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <ScrollReveal direction="up">
            <SectionHeading
              eyebrow="Buyer Routing"
              title="The first screen should tell a stressed homeowner where to go next."
              body="Northline separates urgent repair buyers, install comparison shoppers, and maintenance-plan interest before the page turns into a list of undifferentiated offers."
            />
          </ScrollReveal>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {concept.scenarioSelector.map((scenario, index) => (
              <ScrollReveal
                key={scenario.label}
                direction={index === 1 ? "up" : index === 0 ? "left" : "right"}
                delay={0.05 * index}
                className="h-full"
              >
                <article className="h-full rounded-[1.9rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                  <span className="rounded-full border border-[rgba(220,168,109,0.22)] bg-[rgba(220,168,109,0.08)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
                    {scenario.label}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold text-stone-50">
                    {scenario.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    {scenario.summary}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="request-service" className="section-pad section-rule scroll-mt-28">
        <div className="section-shell">
          <ScrollReveal direction="blur">
            <SectionHeading
              eyebrow="Service Split"
              title="Repairs, installs, and maintenance each get their own clean lane."
              body="The hierarchy is designed to stay readable on mobile. Repair traffic sees immediate action. Install traffic sees steadier confidence. Maintenance stays available without overtaking the core conversion path."
            />
          </ScrollReveal>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {concept.serviceLanes.map((lane, index) => (
              <ScrollReveal
                key={lane.label}
                direction={index === 1 ? "up" : index === 0 ? "left" : "right"}
                delay={0.05 + index * 0.04}
                className="h-full"
              >
                <article className="h-full rounded-[1.95rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          index === 1
                            ? "rgba(120,182,178,0.14)"
                            : "rgba(220,168,109,0.12)",
                        color: index === 1 ? "#78b6b2" : "#dca86d",
                      }}
                    >
                      {index === 0 ? (
                        <Wrench aria-hidden="true" className="h-4 w-4" />
                      ) : index === 1 ? (
                        <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        <BadgeCheck aria-hidden="true" className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <p className="mini-label">{lane.label}</p>
                      <h3 className="mt-1 text-2xl font-semibold text-stone-50">
                        {lane.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-stone-300">
                    {lane.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm leading-7 text-stone-200">
                    {lane.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <Check
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent-strong)]"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="call-lane" className="section-pad section-rule scroll-mt-28">
        <div className="section-shell grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
          <ScrollReveal direction="left">
            <div className="rounded-[2rem] border border-[rgba(220,168,109,0.22)] bg-[rgba(220,168,109,0.06)] p-6 sm:p-7">
              <SectionHeading
                eyebrow={concept.emergencyModule.eyebrow}
                title={concept.emergencyModule.title}
                body={concept.emergencyModule.body}
              />
              <ul className="mt-8 space-y-4 text-sm leading-7 text-stone-200">
                {concept.emergencyModule.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <CircleAlert
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent-strong)]"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[rgba(9,14,22,0.74)] p-5">
                <p className="mini-label">Operational note</p>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  {concept.emergencyModule.supportText}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <p className="mini-label">Hero trust hierarchy</p>
              <div className="mt-6 grid gap-4">
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
              <div className="mt-6 rounded-[1.55rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-stone-100">
                    <TimerReset aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">Why this matters</p>
                    <p className="mt-2 text-base font-semibold text-stone-50">
                      Emergency traffic does not tolerate uncertainty.
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  The first impression has to feel engineered and trustworthy in a few seconds, especially when the buyer is on a phone and under temperature stress.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="estimate-lane" className="section-pad section-rule scroll-mt-28">
        <div className="section-shell grid gap-6 xl:grid-cols-[0.96fr_1.04fr] xl:items-start">
          <ScrollReveal direction="left">
            <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <SectionHeading
                eyebrow={concept.financingModule.eyebrow}
                title={concept.financingModule.title}
                body={concept.financingModule.body}
              />
              <div className="mt-8 grid gap-4">
                {concept.financingModule.confidencePoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex gap-3">
                      <ShieldCheck
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent-strong)]"
                      />
                      <p className="text-sm leading-7 text-stone-200">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[2rem] border border-[rgba(120,182,178,0.22)] bg-[rgba(120,182,178,0.08)] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(120,182,178,0.24)] bg-[rgba(120,182,178,0.12)] text-[#78b6b2]">
                  <Layers3 aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <p className="mini-label">Financing placeholder</p>
                  <p className="mt-2 text-lg font-semibold text-stone-50">
                    {concept.financingModule.placeholder}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.45rem] border border-white/10 bg-[rgba(6,12,20,0.72)] p-5">
                  <p className="mini-label">Estimate path</p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    Request estimate and replacement planning without the emergency-service tone dominating the screen.
                  </p>
                </div>
                <div className="rounded-[1.45rem] border border-white/10 bg-[rgba(6,12,20,0.72)] p-5">
                  <p className="mini-label">Confidence path</p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    Use approved financing partner language and real disclosures once the operator confirms them.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-stone-200">
                This section is where real payment options, real lender details, and approved estimate language would live in a production deployment.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
          <ScrollReveal direction="left">
            <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <SectionHeading
                eyebrow="Trust Stack"
                title="Trust is designed in, but proof stays labeled until it is real."
                body="This concept deliberately avoids fake stars, review counts, certifications, or financing claims. The placeholders show where real proof would support the build once approved."
              />
              <div className="mt-8 grid gap-4">
                {concept.trustPlaceholders.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <p className="text-lg font-semibold text-stone-50">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-stone-300">
                      {item.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                  <MapPinned aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <p className="mini-label">{concept.coverageModule.eyebrow}</p>
                  <h2 className="mt-1 text-3xl font-semibold text-stone-50">
                    {concept.coverageModule.title}
                  </h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-stone-300">
                {concept.coverageModule.body}
              </p>
              <div className="mt-8 grid gap-4">
                {concept.coverageModule.zones.map((zone) => (
                  <div
                    key={zone.label}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <p className="mini-label">{zone.label}</p>
                    <p className="mt-2 text-lg font-semibold text-stone-50">
                      {zone.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-300">
                      {zone.detail}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-stone-500">
                {concept.coverageModule.note}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-6 xl:grid-cols-[0.98fr_1.02fr] xl:items-start">
          <ScrollReveal direction="left">
            <div className="rounded-[2rem] border border-[rgba(220,168,109,0.22)] bg-[rgba(220,168,109,0.06)] p-6 sm:p-7">
              <SectionHeading
                eyebrow={concept.deepDive.eyebrow}
                title={concept.deepDive.title}
                body={concept.deepDive.summary}
              />
              <div className="mt-8 rounded-[1.55rem] border border-white/10 bg-[rgba(7,12,20,0.74)] p-5">
                <p className="mini-label">Common AC repair prompts</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
                  {concept.deepDive.symptoms.map((symptom) => (
                    <li key={symptom} className="flex gap-3">
                      <Wrench
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent-strong)]"
                      />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <p className="mini-label">How the page would guide the next step</p>
              <div className="mt-6 space-y-4">
                {concept.deepDive.process.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(220,168,109,0.14)] text-sm font-semibold text-[color:var(--accent-strong)]">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-stone-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
                <p className="mini-label">Proof policy</p>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  {concept.deepDive.note}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <ScrollReveal direction="left">
            <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                  <BadgeCheck aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <p className="mini-label">FAQ</p>
                  <h2 className="mt-1 text-3xl font-semibold text-stone-50">
                    Common questions about the concept
                  </h2>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {concept.faqs.map((item) => (
                  <details
                    key={item.question}
                    className="faq-item rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4">
                      <span className="text-left text-base font-semibold text-stone-50">
                        {item.question}
                      </span>
                      <span className="faq-icon flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-stone-300">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-7 text-stone-300">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_46%,rgba(255,255,255,0.05))] p-6 sm:p-7">
              <p className="mini-label">Final CTA</p>
              <h2 className="mt-4 text-3xl font-semibold text-stone-50 sm:text-4xl">
                {concept.finalCta.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-base">
                {concept.finalCta.body}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={concept.finalCta.primary.href}
                  className="button-primary px-6 py-3 text-sm"
                >
                  {concept.finalCta.primary.label}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href={concept.finalCta.secondary.href}
                  className="button-secondary px-6 py-3 text-sm"
                >
                  {concept.finalCta.secondary.label}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 grid gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="mini-label">Call path</p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    Use the emergency lane when the buyer needs immediate action and the site should reduce hesitation fast.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="mini-label">Estimate path</p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    Use the estimate lane when the buyer is comparing replacement options and needs clarity more than volume.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-stone-500">
                {concept.finalCta.footnote}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
