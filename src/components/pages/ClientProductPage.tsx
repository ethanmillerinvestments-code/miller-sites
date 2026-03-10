import Link from "next/link";

import {
  ArrowUpRight,
  BadgeCheck,
  CalendarRange,
  Flower2,
  Layers3,
  Leaf,
  Quote,
  ShieldCheck,
} from "lucide-react";

import ClientProductScene from "@/components/ClientProductScene";
import NorthlineClimatePage from "@/components/client-products/NorthlineClimatePage";
import ScrollReveal from "@/components/ScrollReveal";
import ClientProductGallery from "@/components/client-products/ClientProductGallery";
import SiteShell from "@/components/SiteShell";
import type { ClientProduct } from "@/lib/client-products";
import { cn } from "@/lib/utils";

type ClientProductPageProps = {
  product: ClientProduct;
};

function ActionLink({
  href,
  label,
  external = false,
  primary = false,
}: {
  href: string;
  label: string;
  external?: boolean;
  primary?: boolean;
}) {
  const className = cn(
    primary ? "button-primary" : "button-secondary",
    "px-6 py-3.5 text-sm"
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}

export default function ClientProductPage({ product }: ClientProductPageProps) {
  if (product.slug === "northline-climate" && product.detail.northline) {
    return <NorthlineClimatePage product={product} />;
  }

  const pageStyle = {
    background: `linear-gradient(180deg, ${product.theme.pageFrom} 0%, ${product.theme.pageTo} 100%)`,
  };

  return (
    <SiteShell showStickyCTA={false}>
      <div className="relative" style={pageStyle}>
        <section className="section-pad pt-32 sm:pt-40">
          <div className="section-shell">
            <div className="grid gap-10 xl:grid-cols-[0.96fr_1.04fr] xl:items-center">
              <ScrollReveal className="max-w-3xl" direction="blur">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow">{product.conceptBadge}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone-300">
                    Fictional Production Concept
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone-300">
                    {product.industry}
                  </span>
                </div>

                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
                  {product.company}
                </p>
                <h1 className="display-title mt-4 text-[clamp(3.2rem,9vw,6.25rem)] text-stone-50">
                  {product.hero.headline}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
                  {product.hero.body}
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-500">
                  {product.detail.disclaimer}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ActionLink href="/contact" label="Request Quote" primary />
                  <ActionLink
                    href={product.detail.finalCta.secondaryHref}
                    label="Book Consultation"
                    external={Boolean(product.detail.finalCta.secondaryExternal)}
                  />
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {product.detail.heroStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={cn(
                        "rounded-[1.5rem] border p-4 sm:p-5",
                        index === 0
                          ? "bg-white/[0.04]"
                          : "bg-[rgba(255,255,255,0.025)]"
                      )}
                      style={{ borderColor: product.theme.outline }}
                    >
                      <p className="mini-label">{stat.label}</p>
                      <p className="mt-3 text-base font-semibold text-stone-50">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08} direction="zoom">
                <ClientProductScene product={product} />
              </ScrollReveal>
            </div>

            <div className="mt-10 grid gap-5 xl:grid-cols-[0.72fr_0.28fr]">
              <ScrollReveal
                delay={0.1}
                className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6"
              >
                <p className="mini-label">Positioning</p>
                <p className="mt-4 text-lg leading-8 text-stone-200">
                  {product.positioning}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {product.palette.map((color) => (
                    <span
                      key={color}
                      className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-300"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                    </span>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal
                delay={0.14}
                className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6"
              >
                <p className="mini-label">Page Stack</p>
                <div className="mt-4 space-y-4">
                  {product.pages.map((page) => (
                    <div key={page.title} className="rounded-[1.3rem] bg-white/[0.03] p-4">
                      <p className="text-sm font-semibold text-stone-50">{page.title}</p>
                      <p className="mt-2 text-sm leading-7 text-stone-300">{page.angle}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="section-pad section-rule">
          <div className="section-shell">
            <ScrollReveal className="max-w-3xl">
              <span className="eyebrow">Visual Browse</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                {product.detail.gallery.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-stone-300">
                {product.detail.gallery.summary}
              </p>
            </ScrollReveal>

            <div className="mt-10">
              <ClientProductGallery product={product} />
            </div>
          </div>
        </section>

        <section className="section-pad section-rule">
          <div className="section-shell">
            <div className="max-w-3xl">
              <ScrollReveal>
                <span className="eyebrow">Project Categories</span>
                <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                  Core modules are organized to support both taste and conversion.
                </h2>
              </ScrollReveal>
            </div>

            <div className="mt-10 grid gap-5 xl:grid-cols-2">
              {product.detail.categoryModules.map((module, index) => (
                <ScrollReveal
                  key={module.title}
                  delay={index * 0.05}
                  className="rounded-[1.9rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7"
                >
                  <p className="mini-label">{module.eyebrow}</p>
                  <h3 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                    {module.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    {module.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm leading-7 text-stone-200">
                    {module.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span
                          className="mt-3 h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: product.theme.accent }}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad section-rule">
          <div className="section-shell">
            <div
              className="overflow-hidden rounded-[2rem] border p-6 sm:p-8"
              style={{
                borderColor: product.theme.outline,
                background:
                  "linear-gradient(140deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              }}
            >
              <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
                <ScrollReveal>
                  <span className="eyebrow">{product.detail.spotlight.eyebrow}</span>
                  <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                    {product.detail.spotlight.title}
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-stone-300">
                    {product.detail.spotlight.description}
                  </p>

                  <ul className="mt-6 space-y-3 text-sm leading-7 text-stone-200">
                    {product.detail.spotlight.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          className="mt-3 h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: product.theme.accent }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-sm leading-7 text-stone-500">
                    {product.detail.spotlight.note}
                  </p>
                </ScrollReveal>

                <ScrollReveal
                  delay={0.08}
                  className="rounded-[1.8rem] border border-white/10 bg-[rgba(15,16,14,0.4)] p-5"
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    {product.detail.spotlight.stats.map((stat) => (
                      <div key={stat.label} className="rounded-[1.4rem] bg-white/[0.04] p-4">
                        <p className="mini-label">{stat.label}</p>
                        <p className="mt-3 text-base font-semibold text-stone-50">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                      <p className="mini-label">Category Focus</p>
                      <div className="mt-4 grid gap-3">
                        {product.designFocus.map((focus) => (
                          <div
                            key={focus.label}
                            className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4"
                          >
                            <p className="mini-label">{focus.label}</p>
                            <p className="mt-2 text-sm leading-7 text-stone-200">
                              {focus.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] p-4">
                      <div className="flex items-center justify-between">
                        <p className="mini-label">Embedded Category Spread</p>
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-stone-300">
                          Placeholder media
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3">
                        <div className="h-36 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02))]" />
                        <div className="grid gap-3 sm:grid-cols-[1.08fr_0.92fr]">
                          <div className="h-28 rounded-[1.25rem] bg-white/[0.05]" />
                          <div className="grid gap-3">
                            <div className="h-[54px] rounded-[1rem] bg-white/[0.05]" />
                            <div className="h-[54px] rounded-[1rem] bg-white/[0.05]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad section-rule">
          <div className="section-shell grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <ScrollReveal className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                  <Layers3 className="h-5 w-5" />
                </span>
                <div>
                  <p className="mini-label">Process</p>
                  <h2 className="mt-1 text-3xl font-semibold text-stone-50">
                    {product.detail.process.title}
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-stone-300">
                {product.detail.process.summary}
              </p>

              <div className="mt-8 space-y-4">
                {product.detail.process.steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: product.theme.accent,
                          color: "#16130d",
                        }}
                      >
                        {index + 1}
                      </span>
                      <p className="text-lg font-semibold text-stone-50">{step.title}</p>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-stone-300">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal
              delay={0.08}
              className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                  <CalendarRange className="h-5 w-5" />
                </span>
                <div>
                  <p className="mini-label">Seasonal Services</p>
                  <h2 className="mt-1 text-3xl font-semibold text-stone-50">
                    {product.detail.seasonalServices.title}
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-stone-300">
                {product.detail.seasonalServices.summary}
              </p>

              <div className="mt-8 grid gap-4">
                {product.detail.seasonalServices.services.map((service, index) => {
                  const Icon = index === 0 ? Flower2 : index === 1 ? Leaf : BadgeCheck;

                  return (
                    <div
                      key={service.title}
                      className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex items-start gap-4">
                        <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="mini-label">{service.season}</p>
                          <p className="mt-2 text-lg font-semibold text-stone-50">
                            {service.title}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-stone-300">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="section-pad section-rule">
          <div className="section-shell grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <ScrollReveal className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="mini-label">Trust Placeholders</p>
                  <h2 className="mt-1 text-3xl font-semibold text-stone-50">
                    {product.detail.trustPlaceholders.title}
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-stone-300">
                {product.detail.trustPlaceholders.summary}
              </p>

              <div className="mt-8 grid gap-4">
                {product.detail.trustPlaceholders.items.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <span className="rounded-full border border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.08)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
                      {item.label}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-stone-50">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-stone-300">
                      {item.description}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-500">{item.note}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal
              delay={0.08}
              className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                  <Quote className="h-5 w-5" />
                </span>
                <div>
                  <p className="mini-label">FAQ</p>
                  <h2 className="mt-1 text-3xl font-semibold text-stone-50">
                    Common questions about the concept
                  </h2>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {product.detail.faq.map((item) => (
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
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="section-pad section-rule">
          <div className="section-shell">
            <ScrollReveal
              className="overflow-hidden rounded-[2rem] border border-white/10 px-6 py-7 sm:px-8 sm:py-9"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 46%, rgba(255,255,255,0.05))",
              }}
            >
              <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
                <div>
                  <p className="eyebrow">{product.detail.finalCta.eyebrow}</p>
                  <h2 className="mt-6 text-3xl font-semibold text-stone-50 sm:text-4xl">
                    {product.detail.finalCta.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">
                    {product.detail.finalCta.body}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ActionLink
                      href={product.detail.finalCta.primaryHref}
                      label={product.detail.finalCta.primaryLabel}
                      primary
                    />
                    <ActionLink
                      href={product.detail.finalCta.secondaryHref}
                      label={product.detail.finalCta.secondaryLabel}
                      external={Boolean(product.detail.finalCta.secondaryExternal)}
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5">
                    <p className="mini-label">What this page is</p>
                    <p className="mt-3 text-sm leading-7 text-stone-200">
                      A fictional production concept inside the Leadcraft portfolio, used to
                      demonstrate visual direction, information architecture, and conversion
                      thinking.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
                    <p className="mini-label">What the live build would change</p>
                    <p className="mt-3 text-sm leading-7 text-stone-200">
                      Real proof, real services, real process documentation, and real project
                      assets would replace every placeholder before publication.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
