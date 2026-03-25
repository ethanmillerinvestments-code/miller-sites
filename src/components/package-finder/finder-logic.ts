import {
  supportPlans,
  type SupportPlan,
  type SupportPlanId,
  websitePlans,
  type WebsitePlan,
  type WebsitePlanId,
} from "@/lib/offers";
import type { CartItem } from "@/store/cart";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type QuestionId = "siteState" | "scope" | "priority" | "involvement";
export type Tone = "accent" | "teal" | "neutral";

export type FinderOption = {
  id: string;
  title: string;
  detail: string;
  tag: string;
  tone: Tone;
  build?: Partial<Record<WebsitePlanId, number>>;
  support?: Partial<Record<SupportPlanId, number>>;
  reason: string;
};

export type FinderQuestion = {
  id: QuestionId;
  number: string;
  prompt: string;
  helper: string;
  options: readonly FinderOption[];
};

export type FinderAnswers = Partial<Record<QuestionId, string>>;

export type Recommendation = {
  buildPlan: WebsitePlan | null;
  supportPlan: SupportPlan | null;
  reasons: string[];
  requiresScope: boolean;
  intakeHref: string;
};

export type AnswerSummary = {
  question: FinderQuestion;
  option: FinderOption | undefined;
};

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

export const featuredWebsitePlan =
  websitePlans.find((plan) => plan.featured) ?? websitePlans[0];
export const featuredSupportPlan =
  supportPlans.find((plan) => plan.featured) ?? supportPlans[0];

export const finderQuestions: readonly FinderQuestion[] = [
  {
    id: "siteState",
    number: "01",
    prompt: "What shape is the current website in?",
    helper:
      "This decides whether the recommendation should start with a rebuild or stay focused on ongoing coverage.",
    options: [
      {
        id: "none",
        title: "No real site yet",
        detail:
          "There is no usable website, or what exists is too weak to launch from.",
        tag: "Fresh launch",
        tone: "accent",
        build: { "launch-site": 2, "growth-build": 1 },
        support: { "hosted-core": 1 },
        reason:
          "You need a finished trust-building asset first, not just edits on something weak.",
      },
      {
        id: "underperforming",
        title: "There is a site, but it looks cheap or sells poorly",
        detail:
          "The current site exists, but it does not build trust well, route leads cleanly, or support stronger positioning.",
        tag: "Rebuild",
        tone: "teal",
        build: { "growth-build": 2, "authority-build": 1 },
        support: { "managed-site-care": 1 },
        reason:
          "The bigger problem is positioning and page depth, not just keeping the current site online.",
      },
      {
        id: "usable",
        title: "The current site can stay, I mainly need coverage",
        detail:
          "A rebuild is not the main priority right now. Stability, edits, and upkeep matter more.",
        tag: "Support first",
        tone: "neutral",
        support: { "hosted-core": 2, "managed-site-care": 1 },
        reason:
          "The strongest immediate lift comes from protecting and refining the live site instead of replacing it first.",
      },
    ],
  },
  {
    id: "scope",
    number: "02",
    prompt: "How much page depth does the business need?",
    helper:
      "More services, locations, and higher-ticket work usually push the recommendation upward.",
    options: [
      {
        id: "tight",
        title: "One core offer and a tight scope",
        detail:
          "The business mainly needs one clear trust upgrade, one strong homepage flow, and clean lead routing.",
        tag: "Lean scope",
        tone: "accent",
        build: { "launch-site": 2, "growth-build": 1 },
        support: { "hosted-core": 1 },
        reason:
          "The scope is tight enough that a fixed-price build can stay realistic without overselling.",
      },
      {
        id: "expanded",
        title: "Multiple services, locations, or a higher-ticket sales path",
        detail:
          "The site needs deeper structure, stronger trust handling, and room to grow without boxing the project in.",
        tag: "Authority scope",
        tone: "teal",
        build: { "authority-build": 2, "growth-build": 1 },
        support: { "search-conversion-support": 1 },
        reason:
          "This is larger than an entry build and should be shaped through scope review, not squeezed into a small package.",
      },
    ],
  },
  {
    id: "priority",
    number: "03",
    prompt: "What matters most right now?",
    helper:
      "This shows whether the project is mainly about launch speed, stronger positioning, or post-launch coverage.",
    options: [
      {
        id: "launch-clean",
        title: "Launch something credible and clean",
        detail:
          "The main goal is to replace a weak site with a stronger trust signal and a clearer lead path.",
        tag: "Launch",
        tone: "accent",
        build: { "launch-site": 2, "growth-build": 1 },
        support: { "hosted-core": 1 },
        reason:
          "A scoped launch build is the right first move when the priority is getting the fundamentals right fast.",
      },
      {
        id: "position-higher",
        title: "Look more established and support bigger growth",
        detail:
          "The site needs a stronger authority layer, deeper pages, and a better pre-call buying experience.",
        tag: "Authority",
        tone: "neutral",
        build: { "growth-build": 1, "authority-build": 2 },
        support: { "search-conversion-support": 1 },
        reason:
          "This is a premium positioning problem, not just a quick replacement project.",
      },
      {
        id: "keep-covered",
        title: "Keep the live site covered and updated",
        detail:
          "The business mostly needs stability, upkeep, and recurring help without rebuilding first.",
        tag: "Coverage",
        tone: "teal",
        support: { "hosted-core": 1, "managed-site-care": 2 },
        reason:
          "The operational problem is support, so the recommendation should not force a rebuild.",
      },
      {
        id: "refine-regularly",
        title: "Keep improving offers and pages month to month",
        detail:
          "The business changes promos, service pushes, or page messaging often enough to justify a higher-touch lane.",
        tag: "Refinement",
        tone: "teal",
        build: { "growth-build": 1, "authority-build": 1 },
        support: { "managed-site-care": 1, "search-conversion-support": 2 },
        reason:
          "Recurring refinements matter here, so the higher-touch support lane earns its place.",
      },
    ],
  },
  {
    id: "involvement",
    number: "04",
    prompt: "How involved should Leadcraft stay after launch?",
    helper:
      "This decides whether the recommendation stops at the build or layers in the right monthly lane.",
    options: [
      {
        id: "handoff",
        title: "Build it and hand it off cleanly",
        detail:
          "The main need is a strong finished asset. Ongoing monthly help can stay optional.",
        tag: "Handoff",
        tone: "accent",
        build: { "launch-site": 1, "growth-build": 1, "authority-build": 1 },
        reason:
          "The one-time project should do the heavy lifting here without forcing recurring work.",
      },
      {
        id: "coverage",
        title: "Cover the technical side after launch",
        detail:
          "Leadcraft should stay on for hosting, maintenance, monitoring, and live-site stability.",
        tag: "Technical",
        tone: "teal",
        support: { "hosted-core": 1, "managed-site-care": 3 },
        reason:
          "The lighter monthly lane is enough when the main goal is technical ownership without internal website work.",
      },
      {
        id: "refinement",
        title: "Stay involved with recurring updates and refinements",
        detail:
          "The business wants recurring edits, QA, and ongoing page improvements after launch.",
        tag: "Growth",
        tone: "neutral",
        support: { "search-conversion-support": 3 },
        reason:
          "The higher-touch monthly lane makes sense when the site should keep evolving instead of just staying online.",
      },
    ],
  },
] as const;

export const finderSignals = [
  "4 questions only",
  "Uses the live offer ladder",
  "Larger scopes still route to review",
] as const;

export const finderGuardrails = [
  "No fake instant quote. The result narrows the right lane and next step.",
  "Authority-fit projects still move into written scope review before any kickoff path.",
  "Routing, anti-spam, and launch QA stay part of the implementation, not the sales theater.",
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getToneClasses(tone: Tone) {
  if (tone === "accent") {
    return "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]";
  }

  if (tone === "teal") {
    return "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)]";
  }

  return "border-white/10 bg-white/[0.03]";
}

export function buildIntakeHref(ids: Array<WebsitePlanId | SupportPlanId>) {
  if (ids.length === 0) {
    return "/#pricing";
  }

  if (ids.length === 1) {
    return `/checkout/intake?item=${encodeURIComponent(ids[0])}`;
  }

  return `/checkout/intake?items=${encodeURIComponent(ids.join(","))}`;
}

export function createCartItem(
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

/* ------------------------------------------------------------------ */
/*  Recommendation engine                                              */
/* ------------------------------------------------------------------ */

export function getRecommendation(answers: FinderAnswers): Recommendation {
  const buildScores: Record<WebsitePlanId, number> = {
    "launch-site": 0,
    "growth-build": 0,
    "authority-build": 0,
  };
  const supportScores: Record<SupportPlanId, number> = {
    "hosted-core": 0,
    "managed-site-care": 0,
    "search-conversion-support": 0,
  };

  const reasons: string[] = [];

  finderQuestions.forEach((question) => {
    const answerId = answers[question.id];
    if (!answerId) {
      return;
    }

    const selectedOption = question.options.find((option) => option.id === answerId);
    if (!selectedOption) {
      return;
    }

    reasons.push(selectedOption.reason);

    Object.entries(selectedOption.build ?? {}).forEach(([planId, score]) => {
      buildScores[planId as WebsitePlanId] += score ?? 0;
    });

    Object.entries(selectedOption.support ?? {}).forEach(([planId, score]) => {
      supportScores[planId as SupportPlanId] += score ?? 0;
    });
  });

  const supportOnly = answers.siteState === "usable";
  const wantsHandoff = answers.involvement === "handoff";

  const buildPlan = supportOnly
    ? null
    : (websitePlans.toSorted(
        (left, right) => buildScores[right.id] - buildScores[left.id]
      )[0] ?? featuredWebsitePlan);

  const supportPlan = wantsHandoff
    ? null
    : (supportPlans.toSorted(
        (left, right) => supportScores[right.id] - supportScores[left.id]
      )[0] ?? featuredSupportPlan);

  const recommendationIds = [
    ...(buildPlan ? [buildPlan.id] : []),
    ...(supportPlan ? [supportPlan.id] : []),
  ];

  const requiresScope = recommendationIds.includes("authority-build");

  return {
    buildPlan,
    supportPlan,
    reasons,
    requiresScope,
    intakeHref: buildIntakeHref(recommendationIds),
  };
}
