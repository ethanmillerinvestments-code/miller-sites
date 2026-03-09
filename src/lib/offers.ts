export type PricingMode = "fixed" | "custom";
export type CheckoutMode = "cart" | "scope";

export type WebsitePlanId = "lead-launch" | "authority-build";
export type SupportPlanId = "site-coverage" | "growth-support";

type OfferBase = {
  id: string;
  name: string;
  priceLabel: string;
  priceCents: number;
  pricingMode: PricingMode;
  checkoutMode: CheckoutMode;
  summary: string;
  features: string[];
  fit: string;
  featured?: boolean;
};

export type WebsitePlan = OfferBase & {
  id: WebsitePlanId;
};

export type SupportPlan = OfferBase & {
  id: SupportPlanId;
};

export type DeliveryViewId = "build" | "handoff" | "hosted";

export type DeliveryView = {
  id: DeliveryViewId;
  label: string;
  title: string;
  intro: string;
  bullets: string[];
  note: string;
};

export const websitePlans: WebsitePlan[] = [
  {
    id: "lead-launch",
    name: "Lead Launch",
    priceLabel: "$3,500",
    priceCents: 350000,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "Custom-coded lead-generation website for local service operators that need a stronger first impression and a clean handoff without a sprawling scope.",
    features: [
      "Homepage and core service structure around the main revenue offer",
      "Mobile-first CTA path, quote-request routing, and lead form setup",
      "Launch setup with metadata, robots, sitemap, anti-spam protection, and QA",
    ],
    fit: "Best fit for owner-led local service businesses that need a real trust upgrade, cleaner mobile conversion, and a scoped one-time build.",
    featured: true,
  },
  {
    id: "authority-build",
    name: "Authority Build",
    priceLabel: "Custom Quote",
    priceCents: 650000,
    pricingMode: "custom",
    checkoutMode: "scope",
    summary:
      "Custom-scoped build for multi-service or higher-ticket companies that need stronger positioning, deeper page architecture, and a more established market presence.",
    features: [
      "Multi-service or service-area page architecture shaped around the sales path",
      "Stronger visual direction, proof handling, and trust-building content structure",
      "Scope-led rollout planning for larger launches, expansions, or campaign-ready page depth",
    ],
    fit: "Best fit for established teams that need more than a starter rebuild and want the scope shaped around a larger growth push.",
  },
];

export const supportPlans: SupportPlan[] = [
  {
    id: "site-coverage",
    name: "Site Coverage",
    priceLabel: "$349/mo",
    priceCents: 34900,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "Managed hosting, maintenance, monitoring, and live-site stability for owners who want the technical side covered after launch.",
    features: [
      "Managed hosting, SSL, uptime checks, backups, and routine maintenance",
      "Security monitoring and live-site issue handling",
      "A clean technical ownership path without needing internal website help",
    ],
    fit: "Best fit for businesses that want the site live, secure, and maintained with minimal involvement.",
  },
  {
    id: "growth-support",
    name: "Growth Support",
    priceLabel: "$749/mo",
    priceCents: 74900,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "Higher-touch monthly support for businesses that need recurring edits, conversion refinements, and search-ready page upkeep after launch.",
    features: [
      "Everything in Site Coverage",
      "Recurring edits for offers, financing, seasonal pushes, and service updates",
      "Monthly QA plus page and section refinement tied to conversion clarity",
    ],
    fit: "Best fit for active companies updating offers, expanding pages, or wanting Leadcraft involved beyond pure hosting and maintenance.",
    featured: true,
  },
] as const;

export const supportOffer = supportPlans[0];

export const deliveryViews: DeliveryView[] = [
  {
    id: "build",
    label: "One-Time Build",
    title: "What the one-time build actually covers",
    intro:
      "The build fee covers a scoped website project, not an endless retainer. The goal is a finished sales asset with the lead path and launch setup handled cleanly.",
    bullets: [
      "Homepage and service structure around the main revenue offers",
      "Mobile CTA hierarchy for calls and quote requests",
      "Form routing, anti-spam, metadata, canonical, robots, sitemap, and launch QA",
      "Custom-coded front end with a cleaner trust signal than a generic template setup",
    ],
    note: "Best for owners who want the website built right and scoped once.",
  },
  {
    id: "handoff",
    label: "Handoff",
    title: "What clean handoff means after launch",
    intro:
      "If no monthly plan is selected, the site is delivered with clear ownership boundaries. The business knows what Leadcraft handled and what comes next.",
    bullets: [
      "Finished site shipped with launch-ready essentials already handled",
      "Clear split between build scope and future ongoing work",
      "Handoff notes around hosting ownership and next-step options",
      "No forced monthly plan hidden inside the build price",
    ],
    note: "Best for teams with internal help or an outside hosting partner.",
  },
  {
    id: "hosted",
    label: "Hosted Monthly",
    title: "What the optional monthly plans cover",
    intro:
      "There are two monthly paths depending on whether you just want the technical side covered or want recurring edits and refinement as well.",
    bullets: [
      "Site Coverage for hosting, maintenance, monitoring, and live-site stability",
      "Growth Support for recurring edits, monthly QA, and conversion-minded refinements",
      "Both monthly paths stay optional after the one-time build goes live",
    ],
    note: "Best for owners who want the site managed instead of fully handed off.",
  },
];

export const buildOnlyPoints = [
  "One-time project fee with written scope and launch checklist",
  "Finished custom-coded website and clean handoff",
  "Public-launch standard includes validated forms, anti-spam protection, metadata, and QA",
  "Client-managed hosting and future updates unless monthly support is added",
] as const;

export const monthlySupportSummary = [
  "Site Coverage for hosting, maintenance, and technical stability",
  "Growth Support for recurring edits, QA, and page refinement",
] as const;

export function getWebsitePlan(planId: WebsitePlanId) {
  return websitePlans.find((plan) => plan.id === planId);
}

export function getSupportPlan(planId: SupportPlanId) {
  return supportPlans.find((plan) => plan.id === planId);
}

export function getCheckoutOffer(offerId: WebsitePlanId | SupportPlanId) {
  return (
    getWebsitePlan(offerId as WebsitePlanId) ||
    getSupportPlan(offerId as SupportPlanId) ||
    null
  );
}

export function isScopeOnlyOffer(offerId: WebsitePlanId | SupportPlanId) {
  const offer = getCheckoutOffer(offerId);
  return offer?.checkoutMode === "scope";
}

export function isFixedPriceOffer(offerId: WebsitePlanId | SupportPlanId) {
  const offer = getCheckoutOffer(offerId);
  return offer?.pricingMode === "fixed";
}
