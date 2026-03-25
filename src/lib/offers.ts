export type PricingMode = "fixed" | "custom";
export type CheckoutMode = "cart" | "scope";

export type WebsitePlanId = "launch-site" | "growth-build" | "authority-build";
export type SupportPlanId =
  | "hosted-core"
  | "managed-site-care"
  | "search-conversion-support";

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
    id: "launch-site",
    name: "Launch Site",
    priceLabel: "$1,650",
    priceCents: 165000,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "A tighter one-time build for local operators who need a credible lead-generation site fast without stretching into a larger authority scope.",
    features: [
      "Homepage plus core service structure around the main revenue offers",
      "Mobile-first CTA routing for calls, quote requests, and audit or intake flow",
      "Launch setup with metadata, sitemap, robots, anti-spam protection, and QA",
    ],
    fit: "Best fit for owner-led service businesses replacing a weak starter site or launching the first serious version.",
  },
  {
    id: "growth-build",
    name: "Growth Build",
    priceLabel: "$3,250",
    priceCents: 325000,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "A stronger custom-coded build for businesses that need better service hierarchy, deeper trust framing, and a more established presentation before the call.",
    features: [
      "Multi-section homepage and deeper service architecture shaped around the buying path",
      "Stronger visual direction, trust handling, and mobile conversion flow",
      "Launch-ready code, form hardening, metadata, sitemap, robots, and QA",
    ],
    fit: "Best fit for local operators with multiple offers, higher-ticket work, or a website that needs a serious trust upgrade.",
    featured: true,
  },
  {
    id: "authority-build",
    name: "Authority Build",
    priceLabel: "$5,500",
    priceCents: 550000,
    pricingMode: "fixed",
    checkoutMode: "scope",
    summary:
      "A larger authority-tier build for companies that need deeper page architecture, stronger market positioning, and a more commanding online presence.",
    features: [
      "Broader service and page architecture for higher-ticket or multi-lane operations",
      "More assertive visual positioning, proof handling, and expansion-ready structure",
      "Scope-led planning before kickoff so the larger build stays disciplined and fulfillment-safe",
    ],
    fit: "Best fit for established teams that need more than a standard rebuild and want the scope reviewed before kickoff.",
  },
];

export const supportPlans: SupportPlan[] = [
  {
    id: "hosted-core",
    name: "Hosted Core",
    priceLabel: "$279/mo",
    priceCents: 27900,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "Managed hosting and live-site basics for owners who want the technical side covered after launch without a higher-touch monthly lane.",
    features: [
      "Managed hosting, SSL, uptime checks, backups, and routine maintenance",
      "Core security monitoring and live-site stability handling",
      "A cleaner technical ownership path without needing internal website help",
    ],
    fit: "Best fit for businesses that want the site online, secure, and maintained with minimal involvement.",
  },
  {
    id: "managed-site-care",
    name: "Managed Site Care",
    priceLabel: "$399/mo",
    priceCents: 39900,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "A broader monthly maintenance lane for owners who want technical coverage plus a steadier hand on routine updates and live-site quality.",
    features: [
      "Everything in Hosted Core",
      "Routine content and page updates that keep the site current after launch",
      "Recurring QA and issue handling without moving into a full search-growth lane",
    ],
    fit: "Best fit for teams that want a maintained site and occasional updates without a larger conversion program.",
    featured: true,
  },
  {
    id: "search-conversion-support",
    name: "Search and Conversion Support",
    priceLabel: "$599/mo",
    priceCents: 59900,
    pricingMode: "fixed",
    checkoutMode: "cart",
    summary:
      "The higher-touch monthly lane for businesses that want recurring edits, conversion refinements, and search-ready page upkeep after launch.",
    features: [
      "Everything in Managed Site Care",
      "Recurring edits for offers, seasonal pushes, service updates, and landing-page refinements",
      "Ongoing page, CTA, and trust-structure support tied to conversion clarity and search readiness",
    ],
    fit: "Best fit for active companies updating offers, improving page depth, or wanting Leadcraft involved beyond maintenance.",
  },
] as const;

export const supportOffer = supportPlans[0];

export const deliveryViews: DeliveryView[] = [
  {
    id: "build",
    label: "One-Time Build",
    title: "What the one-time build actually covers",
    intro:
      "The build fee covers a scoped website project, not an endless retainer. The goal is a finished sales asset with a clear scope, a real deposit step, and launch setup handled cleanly.",
    bullets: [
      "Website architecture matched to the selected build tier",
      "Mobile CTA hierarchy for calls, quote requests, and intake flow",
      "Form routing, anti-spam, metadata, canonical setup, robots, sitemap, and launch QA",
      "Custom-coded front end with a stronger trust signal than a generic template setup",
    ],
    note: "Best for owners who want the website built right, approved in writing, and launched on a clean process.",
  },
  {
    id: "handoff",
    label: "Handoff",
    title: "What clean handoff means after launch",
    intro:
      "If no monthly plan is selected, the site is delivered with clear ownership boundaries. The business knows what Leadcraft handled, when final payment clears, and what comes next.",
    bullets: [
      "Finished site shipped with the selected build scope already handled",
      "Clear split between build scope and future ongoing work",
      "Handoff notes around hosting ownership, deployment responsibility, and next-step options",
      "No forced monthly plan hidden inside the build price",
    ],
    note: "Best for teams with internal help or an outside hosting partner that will actually manage the site after transfer.",
  },
  {
    id: "hosted",
    label: "Hosted Monthly",
    title: "What the optional monthly plans cover",
    intro:
      "There are three monthly paths depending on whether the business needs pure hosting coverage, broader upkeep, or ongoing search and conversion support.",
    bullets: [
      "Hosted Core for hosting, maintenance, monitoring, and live-site stability",
      "Managed Site Care for a steadier maintenance and update lane",
      "Search and Conversion Support for recurring edits and conversion-minded refinement",
    ],
    note: "Best for owners who want the cleaner default, Leadcraft-hosted launch and ongoing technical control instead of full handoff.",
  },
];

export const buildOnlyPoints = [
  "One-time project fee with written scope, deposit step, and launch checklist",
  "Finished custom-coded website and clean handoff",
  "Public-launch standard includes validated forms, anti-spam protection, metadata, and QA",
  "Optional monthly support can be added after launch, with Leadcraft-hosted launch as the default recommendation",
] as const;

export const monthlySupportSummary = [
  "Hosted Core for hosting, maintenance, and the default post-launch path",
  "Managed Site Care for broader upkeep and recurring live-site updates",
  "Search and Conversion Support for recurring edits, QA, and stronger page refinement",
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
