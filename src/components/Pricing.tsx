"use client";

import Link from "next/link";
import { ArrowRight, Layers3, LifeBuoy } from "lucide-react";

import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import SectionDivider from "@/components/SectionDivider";
import SectionSpotlight from "@/components/SectionSpotlight";
import {
  trackCtaClick,
  trackPricingCtaClick,
} from "@/lib/analytics";
import {
  supportOffer,
  supportPlans,
  type SupportPlan,
  websitePlans,
  type WebsitePlan,
} from "@/lib/offers";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCart, type CartItem } from "@/store/cart";

const pricingRules = [
  {
    title: "Fixed where scope stays tight",
    body: "Launch Site and Growth Build stay public because those projects can stay controlled, profitable, and fulfillment-safe.",
    tone: "accent",
  },
  {
    title: "Authority work still gets reviewed",
    body: "Authority Build shows its real number, but larger projects still move through written scope instead of fake instant checkout.",
    tone: "neutral",
  },
  {
    title: "Payment paths stay separate on purpose",
    body: "One-time site work can move through Venmo or manual Stripe after scope approval. Monthly support stays on Stripe so recurring billing stays clean.",
    tone: "teal",
  },
] as const;

const buildProcessNotes = [
  "Choose 50/50 or pay the full site amount upfront",
  "One-time site payments can run through Venmo or manual Stripe after scope approval",
  "Delivery timing starts from approved scope, paid deposit, and full assets",
] as const;

const buildCardNotes = [
  {
    title: "Deposit",
    body: "Use the normal 50/50 structure or pay the full site amount upfront if you want to move in one step.",
  },
  {
    title: "Delivery clock",
    body: "Starts only after approved scope, paid deposit, and full assets.",
  },
  {
    title: "After launch",
    body: "If Leadcraft stays involved monthly, recurring billing runs through Stripe.",
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

function buildPackageInquiryHref(packageLabel: string) {
  return `/contact?submission=package_inquiry&package=${encodeURIComponent(packageLabel)}`;
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

    trackPricingCtaClick({
      cta_label: "Add Build To Package",
      cta_location: "pricing_build_card",
      offer_ids: [plan.id],
      package_label: plan.name,
    });

    addItem(createCartItem(plan, "website", "one-time"));
    openCart();
  };

  const handleAddSupport = (plan: SupportPlan) => {
    trackPricingCtaClick({
      cta_label: "Add Support To Package",
      cta_location: "pricing_support_card",
      offer_ids: [plan.id],
      package_label: plan.name,
    });

    addItem(createCartItem(plan, "support", "monthly"));
    openCart();
  };

  return (
    <section id="pricing" className="relative section-pad">
      <SectionDivider tone="teal" className="mb-16" />
      <SectionSpotlight tone="teal" />
      <div className="section-shell">
        <ScrollReveal direction="blur">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <span className="eyebrow">Pricing</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The quiz narrows the lane. Pricing shows the real numbers and the real process.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                The public pricing is real, but the delivery path stays disciplined.
                Every build still moves through written scope, signer approval,
                deposit, delivery, and launch QA before anything goes live.
                One-time site work can use Venmo or manual Stripe after approval,
                either 50/50 or full upfront.
                Monthly support stays Stripe-billed.
              </p>
            </div>

            <div className="lux-subtle rounded-[1.75rem] p-5 text-sm leading-7 text-stone-200 xl:max-w-md">
              If the package match looks right, the next move is simple:
              compare the exact tier, then move into the brief or call. Build
              pricing starts at{" "}
              <span className="text-[color:var(--accent-strong)]">$1,650</span>.
              Hosting starts at{" "}
              <span className="text-[color:var(--teal)]">
                {supportOffer.priceLabel}
              </span>.
              Leadcraft-hosted launch is the default recommendation unless a
              clean handoff path is scoped on purpose.
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {pricingRules.map((rule) => (
            <div
              key={rule.title}
              className={cn(
                "rounded-[1.65rem] border px-5 py-5 text-sm leading-7 text-stone-300",
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

        <ScrollReveal delay={0.05} direction="up" depth="far">
          <PointerCard className="lux-panel mt-10 rounded-[2.2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="mini-label">One-Time Builds</p>
                <h3 className="mt-4 text-3xl font-semibold text-stone-50 sm:text-[2.35rem]">
                  Start with the website, then decide how much involvement you want afterward.
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">
                  The build fee covers the scoped website project itself. It does
                  not quietly hide ongoing hosting or open-ended monthly work
                  inside the number. One-time site work can run through Venmo or
                  manual Stripe once scope is approved, either 50/50 or paid in
                  full upfront.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:max-w-3xl">
                {buildProcessNotes.map((note, index) => (
                  <div
                    key={note}
                    className={cn(
                      "rounded-[1.4rem] border px-4 py-4 text-sm leading-6 text-stone-200",
                      index === 0
                        ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)]"
                        : index === 1
                          ? "border-white/10 bg-white/[0.03]"
                          : "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)]"
                    )}
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {websitePlans.map((plan) => {
                const isSelected = buildItem?.id === plan.id;
                const scopeHref = buildIntakeHref([plan.id]);

                return (
                  <article
                    key={plan.id}
                    className={cn(
                      "rounded-[2rem] border p-6 sm:p-7",
                      plan.checkoutMode === "scope"
                        ? "border-[rgba(125,183,176,0.2)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_26%,rgba(255,255,255,0.02)_100%)]"
                        : plan.featured
                          ? "border-[rgba(216,170,115,0.22)] bg-[linear-gradient(180deg,rgba(216,170,115,0.08),rgba(255,255,255,0.02)_26%,rgba(255,255,255,0.02)_100%)]"
                          : "border-white/10 bg-white/[0.03]"
                    )}
                  >
                    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.85fr)]">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="max-w-3xl">
                            <p className="mini-label">
                              {plan.checkoutMode === "scope" ? "Scope review required" : "Fixed public scope"}
                            </p>
                            <h4 className="mt-4 text-3xl font-semibold text-stone-50 sm:text-[2.2rem]">
                              {plan.name}
                            </h4>
                            <p className="muted-copy mt-4 text-base leading-8">
                              {plan.summary}
                            </p>
                          </div>

                          <div className="rounded-[1.25rem] border border-white/10 bg-black/20 px-5 py-4 text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                              Investment
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-stone-50">
                              {plan.priceLabel}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-3 lg:grid-cols-3">
                          {buildCardNotes.map((note) => (
                            <div
                              key={`${plan.id}-${note.title}`}
                              className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4"
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                                {note.title}
                              </p>
                              <p className="mt-3 text-sm leading-7 text-stone-200">
                                {note.body}
                              </p>
                            </div>
                          ))}
                        </div>

                        <ul className="mt-6 grid gap-3 text-sm leading-7 text-stone-200 sm:grid-cols-2">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4"
                            >
                              <span className="font-semibold text-stone-100">
                                Included:
                              </span>{" "}
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex h-full flex-col rounded-[1.7rem] border border-white/10 bg-black/20 p-5 sm:p-6">
                        <p className="mini-label">Best fit</p>
                        <p className="mt-4 text-sm leading-7 text-stone-200">
                          {plan.fit}
                        </p>

                        <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-sm font-semibold text-stone-100">
                            What happens next
                          </p>
                          <ul className="mt-3 space-y-3 text-sm leading-7 text-stone-300">
                            <li>Written scope and proposal</li>
                            <li>Signer approval and 50% deposit</li>
                            <li>Onboarding, assets, build, final balance, launch</li>
                          </ul>
                        </div>

                        <div className="mt-auto pt-6">
                          {plan.checkoutMode === "cart" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAddBuild(plan)}
                                className="button-primary w-full px-5 py-3.5 text-sm"
                              >
                                {isSelected ? "Selected In Package" : "Add Build To Package"}
                                <ArrowRight className="h-4 w-4" />
                              </button>
                              <Link
                                href={buildPackageInquiryHref(plan.name)}
                                className="mt-3 inline-flex text-sm font-semibold text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                              >
                                Ask about this package first
                              </Link>
                            </>
                          ) : (
                            <>
                              <a
                                href={scopeHref}
                                onClick={() =>
                                  trackPricingCtaClick({
                                    cta_label: "Request Scope Review",
                                    cta_location: "pricing_build_card",
                                    offer_ids: [plan.id],
                                    package_label: plan.name,
                                  })
                                }
                                className="button-primary w-full px-5 py-3.5 text-sm"
                              >
                                Request Scope Review
                                <ArrowRight className="h-4 w-4" />
                              </a>
                              <Link
                                href={buildPackageInquiryHref(plan.name)}
                                className="mt-3 inline-flex text-sm font-semibold text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                              >
                                Ask about this package first
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </PointerCard>
        </ScrollReveal>

        <ScrollReveal delay={0.12} direction="up" depth="far">
          <PointerCard className="lux-panel mt-8 rounded-[2.2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="mini-label">Optional Monthly Support</p>
                <h3 className="mt-4 text-3xl font-semibold text-stone-50 sm:text-[2.2rem]">
                  Keep Leadcraft involved after launch only when it earns its keep.
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">
                  Hosting is the default recommendation because it keeps launches,
                  fixes, and stability cleaner. Broader monthly work stays
                  separate, visible, and Stripe-billed only.
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)] px-5 py-4 text-sm leading-7 text-stone-200 xl:max-w-md">
                A build can still end in clean handoff. Leadcraft-hosted launch
                is simply the safer default for most local-service clients. Any
                recurring monthly support is billed through Stripe only.
              </div>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-3">
              {supportPlans.map((plan) => {
                const isSelected = supportItem?.id === plan.id;

                return (
                  <article
                    key={plan.id}
                    className={cn(
                      "flex h-full flex-col rounded-[1.8rem] border p-5",
                      plan.id === "hosted-core"
                        ? "border-[rgba(125,183,176,0.2)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(255,255,255,0.02)_28%,rgba(255,255,255,0.02)_100%)]"
                        : plan.featured
                          ? "border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.06)]"
                          : "border-white/10 bg-white/[0.03]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mini-label">
                          {plan.id === "hosted-core" ? "Default post-launch lane" : "Optional monthly lane"}
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
                    <Link
                      href={buildPackageInquiryHref(plan.name)}
                      className="mt-3 inline-flex text-sm font-semibold text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                    >
                      Ask about this package first
                    </Link>
                  </article>
                );
              })}
            </div>
          </PointerCard>
        </ScrollReveal>

        <ScrollReveal delay={0.18} direction="up" depth="near">
          <PointerCard className="lux-panel mt-8 rounded-[2.2rem] p-6 sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
              <div>
                <p className="mini-label">Selected Package</p>
                <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                  Build the lane first, then send the brief.
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">
                  The package only frames the likely scope. The actual kickoff
                  still waits for written scope, signer approval, deposit, and
                  the right hosting or handoff plan. Site work can use Venmo or
                  manual Stripe, either 50/50 or full upfront. Monthly stays on
                  Stripe.
                </p>

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
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm text-stone-300">
                    <span>Payment path</span>
                    <span className="font-semibold text-stone-100">
                      {buildItem && supportItem
                        ? "Site: Venmo or Stripe · Monthly: Stripe"
                        : buildItem
                          ? "Venmo or Stripe"
                          : supportItem
                            ? "Stripe only"
                            : "Set after selection"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <Link
                href={checkoutHref()}
                onClick={() =>
                  trackPricingCtaClick({
                    cta_label: "Send Brief For Scope Review",
                    cta_location: "pricing_package_summary",
                    offer_ids: items.map((item) => item.id),
                  })
                }
                className="button-primary w-full px-6 py-4 text-center text-sm"
              >
                Send Brief For Scope Review
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/working-with-leadcraft"
                className="button-secondary w-full px-6 py-4 text-center text-sm"
              >
                See The Full Process
              </Link>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackCtaClick({
                    cta_label: "Book Strategy Call",
                    cta_location: "pricing_package_summary",
                  })
                }
                className="button-secondary w-full px-6 py-4 text-center text-sm lg:w-auto"
              >
                Book Strategy Call
              </a>
            </div>
          </PointerCard>
        </ScrollReveal>
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
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
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
