"use client";

import Link from "next/link";
import { ArrowRight, Layers3, LifeBuoy } from "lucide-react";

import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import {
  buildOnlyPoints,
  monthlySupportSummary,
  supportOffer,
  supportPlans,
  type SupportPlan,
  websitePlans,
  type WebsitePlan,
} from "@/lib/offers";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCart, type CartItem } from "@/store/cart";

const qualificationGroups = [
  {
    title: "Best Fit",
    tone: "accent",
    bullets: [
      "Local service operators replacing a weak or generic site",
      "Teams that want scope clarity before kickoff",
      "Businesses that value trust, mobile lead flow, and clean handoff",
    ],
  },
  {
    title: "Not A Fit",
    tone: "neutral",
    bullets: [
      "Cheap brochure buyers shopping only on lowest price",
      "Projects with vague scope and no decision-maker involved",
      "Companies expecting guaranteed rankings or invented proof claims",
    ],
  },
] as const;

const pricingRules = [
  {
    title: "Fixed where scope stays tight",
    body: "Launch Site and Growth Build stay public because those scopes can remain controlled and fulfillment-safe.",
    tone: "accent",
  },
  {
    title: "Scope review where complexity expands",
    body: "Authority Build still shows its fixed price, but the next step stays scope review instead of pretending a larger project should behave like a one-click buy.",
    tone: "neutral",
  },
  {
    title: "Support stays optional",
    body: "Monthly help is visible and priced, but it is not hidden inside the build fee.",
    tone: "teal",
  },
] as const;

function formatCurrency(priceCents: number) {
  return `$${(priceCents / 100).toLocaleString()}`;
}

function buildIntakeHref(ids: string[]) {
  if (ids.length === 0) {
    return "/checkout/intake";
  }

  if (ids.length === 1) {
    return `/checkout/intake?item=${encodeURIComponent(ids[0])}`;
  }

  return `/checkout/intake?items=${encodeURIComponent(ids.join(","))}`;
}

function createCartItem(
  plan: WebsitePlan | SupportPlan,
  category: CartItem["category"],
  billing: CartItem["billing"]
): CartItem {
  return {
    id: plan.id,
    name: plan.name,
    priceCents: plan.priceCents,
    billing,
    category,
    description: plan.summary,
  };
}

export default function Pricing() {
  const addItem = useCart((state) => state.addItem);
  const items = useCart((state) => state.items);
  const openCart = useCart((state) => state.openCart);
  const checkoutHref = useCart((state) => state.checkoutHref);

  const buildItem = items.find((item) => item.category === "website");
  const supportItem = items.find((item) => item.category === "support");
  const oneTimeTotal = items
    .filter((item) => item.billing === "one-time")
    .reduce((sum, item) => sum + item.priceCents, 0);
  const monthlyTotal = items
    .filter((item) => item.billing === "monthly")
    .reduce((sum, item) => sum + item.priceCents, 0);

  const handleAddBuild = (plan: WebsitePlan) => {
    if (plan.checkoutMode !== "cart") {
      return;
    }

    addItem(createCartItem(plan, "website", "one-time"));
    openCart();
  };

  const handleAddSupport = (plan: SupportPlan) => {
    addItem(createCartItem(plan, "support", "monthly"));
    openCart();
  };

  return (
    <section id="pricing" className="section-pad section-rule">
      <div className="section-shell">
        <ScrollReveal direction="blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow">Pricing</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                Productized where it can be, scoped where it should be.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                The pricing ladder is built to qualify serious local-service
                buyers without pretending every project belongs in a tiny flat
                fee. Smaller builds stay public. Larger authority builds move
                into written scope review.
              </p>
            </div>

            <div className="lux-subtle rounded-[1.5rem] p-5 text-sm leading-7 text-stone-200 lg:max-w-sm">
              Fixed launch pricing starts at{" "}
              <span className="text-[color:var(--accent-strong)]">$1,650</span>.
              Monthly support starts at{" "}
              <span className="text-[color:var(--teal)]">
                {supportOffer.priceLabel}
              </span>.
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {pricingRules.map((rule) => (
            <div
              key={rule.title}
              className={cn(
                "rounded-2xl border px-4 py-4 text-sm leading-7 text-stone-300",
                rule.tone === "accent"
                  ? "border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)]"
                  : rule.tone === "teal"
                    ? "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)]"
                    : "border-white/10 bg-white/[0.03]"
              )}
            >
              <p className="text-sm font-semibold text-stone-100">{rule.title}</p>
              <p className="mt-2">{rule.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="grid gap-8">
            <ScrollReveal delay={0.05} direction="up">
              <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="mini-label">One-Time Builds</p>
                    <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                      Start with the website itself.
                    </h3>
                    <p className="muted-copy mt-4 text-sm leading-7">
                      The build fee covers the site, launch setup, and a clean
                      trust signal. Monthly work stays separate and optional.
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-stone-200">
                    Most clients start here, then add support only if the site
                    needs ongoing help after launch.
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  {websitePlans.map((plan) => {
                    const isSelected = buildItem?.id === plan.id;
                    const scopeHref = buildIntakeHref([plan.id]);

                    return (
                      <article
                        key={plan.id}
                        className={cn(
                          "flex h-full flex-col rounded-[1.8rem] border p-5",
                          plan.checkoutMode === "scope"
                            ? "border-[rgba(125,183,176,0.2)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_28%,rgba(255,255,255,0.02)_100%)]"
                            : plan.featured
                              ? "border-[rgba(216,170,115,0.22)] bg-[rgba(216,170,115,0.08)]"
                              : "border-white/10 bg-white/[0.03]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="mini-label">
                              {plan.checkoutMode === "scope" ? "Scope review" : "Fixed scope"}
                            </p>
                            <h4 className="mt-3 text-[1.6rem] font-semibold text-stone-50">
                              {plan.name}
                            </h4>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-stone-100">
                            {plan.priceLabel}
                          </div>
                        </div>

                        <p className="muted-copy mt-3 text-sm leading-6">
                          {plan.summary}
                        </p>

                        <ul className="mt-4 flex-1 space-y-3 text-sm leading-6 text-stone-200">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-stone-400">
                          {plan.fit}
                        </p>

                        <div className="mt-5">
                          {plan.checkoutMode === "cart" ? (
                            <button
                              type="button"
                              onClick={() => handleAddBuild(plan)}
                              className="button-primary w-full px-5 py-3.5 text-sm"
                            >
                              {isSelected ? "Selected In Package" : "Add Build To Package"}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <a
                              href={scopeHref}
                              className="button-primary w-full px-5 py-3.5 text-sm"
                            >
                              Request Scope Review
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="mini-label">Included In The Build</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
                      {buildOnlyPoints.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="mini-label">Qualification Notes</p>
                    <div className="mt-4 space-y-4">
                      {qualificationGroups.map((group) => (
                        <div key={group.title}>
                          <p className="text-sm font-semibold text-stone-100">
                            {group.title}
                          </p>
                          <ul className="mt-2 space-y-2 text-sm leading-7 text-stone-300">
                            {group.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PointerCard>
            </ScrollReveal>

            <ScrollReveal delay={0.12} direction="up">
              <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="mini-label">Optional Monthly Support</p>
                    <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                      Add support only when it earns its keep.
                    </h3>
                    <p className="muted-copy mt-4 text-sm leading-7">
                      Monthly work is not baked into the build. Use it when the
                      business wants Leadcraft to stay involved after launch.
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] px-4 py-4 text-sm leading-7 text-stone-200">
                    Support can stand alone for an existing site or layer on top
                    of a new build.
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  {supportPlans.map((plan) => {
                    const isSelected = supportItem?.id === plan.id;

                    return (
                      <article
                        key={plan.id}
                        className={cn(
                          "flex h-full flex-col rounded-[1.8rem] border p-5",
                          plan.id === "search-conversion-support"
                            ? "border-[rgba(125,183,176,0.2)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_28%,rgba(255,255,255,0.02)_100%)]"
                            : plan.featured
                              ? "border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.06)]"
                              : "border-white/10 bg-white/[0.03]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="mini-label">Monthly lane</p>
                            <h4 className="mt-3 text-[1.6rem] font-semibold text-stone-50">
                              {plan.name}
                            </h4>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-stone-100">
                            {plan.priceLabel}
                          </div>
                        </div>

                        <p className="muted-copy mt-3 text-sm leading-6">
                          {plan.summary}
                        </p>

                        <ul className="mt-4 flex-1 space-y-3 text-sm leading-6 text-stone-200">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-stone-400">
                          {plan.fit}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleAddSupport(plan)}
                          className="button-primary mt-5 w-full px-5 py-3.5 text-sm"
                        >
                          {isSelected ? "Selected In Package" : "Add Support To Package"}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="mini-label">What Monthly Support Means</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
                    {monthlySupportSummary.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </PointerCard>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.08} direction="up">
            <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-7 xl:sticky xl:top-28">
              <p className="mini-label">Selected Package</p>
              <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                Build the likely scope before the brief.
              </h3>
              <p className="muted-copy mt-4 text-sm leading-7">
                The package only frames the likely lane. Kickoff still waits for
                written scope, timeline, signer review, and the right payment
                path.
              </p>

              <div className="mt-6 space-y-4">
                <SelectionCard
                  icon={Layers3}
                  title="Build"
                  item={buildItem}
                  fallback="No one-time build selected yet."
                />
                <SelectionCard
                  icon={LifeBuoy}
                  title="Monthly Support"
                  item={supportItem}
                  fallback="No monthly support selected yet."
                />
              </div>

              <div className="mt-6 rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between gap-3 text-sm text-stone-300">
                  <span>One-time total</span>
                  <span className="font-semibold text-stone-100">
                    {oneTimeTotal > 0 ? formatCurrency(oneTimeTotal) : "TBD"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-stone-300">
                  <span>Monthly total</span>
                  <span className="font-semibold text-stone-100">
                    {monthlyTotal > 0 ? `${formatCurrency(monthlyTotal)}/mo` : "Optional"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={checkoutHref()}
                  className="button-primary w-full px-6 py-4 text-center text-sm"
                >
                  Send Brief For Scope Review
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary w-full px-6 py-4 text-center text-sm"
                >
                  Book Strategy Call
                </a>
              </div>

              <p className="mt-5 text-sm leading-7 text-stone-400">
                Need the highest-tier build instead of the tighter public lanes.
                Use scope review, not guesswork.
              </p>
              <a
                href={buildIntakeHref(["authority-build"])}
                className="mt-3 inline-flex text-sm font-semibold text-[color:var(--accent-strong)] transition-colors hover:text-stone-100"
              >
                Request Authority Build scope review
              </a>
            </PointerCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function SelectionCard({
  icon: Icon,
  title,
  item,
  fallback,
}: {
  icon: typeof Layers3;
  title: string;
  item: CartItem | undefined;
  fallback: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="mini-label">{title}</p>
          {item ? (
            <>
              <p className="mt-3 text-lg font-semibold text-stone-50">
                {item.name}
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                {item.description}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-7 text-stone-300">{fallback}</p>
          )}
        </div>
      </div>
    </div>
  );
}
