"use client";

import { startTransition, useState } from "react";
import { ArrowRight, Compass, Layers3, LifeBuoy, ShieldCheck } from "lucide-react";

import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import {
  supportPlans,
  type SupportPlan,
  type SupportPlanId,
  websitePlans,
  type WebsitePlan,
  type WebsitePlanId,
} from "@/lib/offers";
import { cn } from "@/lib/utils";
import { useCart, type CartItem } from "@/store/cart";

type QuestionId = "siteState" | "scope" | "priority" | "involvement";
type Tone = "accent" | "teal" | "neutral";

type FinderOption = {
  id: string;
  title: string;
  detail: string;
  tag: string;
  tone: Tone;
  build?: Partial<Record<WebsitePlanId, number>>;
  support?: Partial<Record<SupportPlanId, number>>;
  reason: string;
};

type FinderQuestion = {
  id: QuestionId;
  number: string;
  prompt: string;
  helper: string;
  options: readonly FinderOption[];
};

type FinderAnswers = Partial<Record<QuestionId, string>>;

const featuredWebsitePlan =
  websitePlans.find((plan) => plan.featured) ?? websitePlans[0];
const featuredSupportPlan =
  supportPlans.find((plan) => plan.featured) ?? supportPlans[0];

const finderQuestions: readonly FinderQuestion[] = [
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

function getToneClasses(tone: Tone) {
  if (tone === "accent") {
    return "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]";
  }

  if (tone === "teal") {
    return "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)]";
  }

  return "border-white/10 bg-white/[0.03]";
}

function buildIntakeHref(ids: Array<WebsitePlanId | SupportPlanId>) {
  if (ids.length === 0) {
    return "/#pricing";
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

function getRecommendation(answers: FinderAnswers) {
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

export default function PackageFinder() {
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);
  const [answers, setAnswers] = useState<FinderAnswers>({});

  const allAnswered = finderQuestions.every((question) => Boolean(answers[question.id]));
  const recommendation = allAnswered ? getRecommendation(answers) : null;

  const handleAnswer = (questionId: QuestionId, optionId: string) => {
    startTransition(() => {
      setAnswers((current) => ({
        ...current,
        [questionId]: optionId,
      }));
    });
  };

  const handleAddFixedPackage = () => {
    if (!recommendation) {
      return;
    }

    if (recommendation.buildPlan?.checkoutMode === "cart") {
      addItem(createCartItem(recommendation.buildPlan, "website", "one-time"));
    }

    if (recommendation.supportPlan?.checkoutMode === "cart") {
      addItem(createCartItem(recommendation.supportPlan, "support", "monthly"));
    }

    openCart();
  };

  return (
    <section id="package-finder" className="section-pad section-rule">
      <div className="section-shell">
        <ScrollReveal direction="blur">
          <div className="max-w-3xl">
            <span className="eyebrow">Price Finder</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              Answer four questions and get the likely lane.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              This is not a gimmick quote calculator. It is a fast way to sort
              whether the business needs a Launch Site, Growth Build, Authority
              Build, or one of the three optional monthly lanes after launch.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            {finderQuestions.map((question) => (
              <PointerCard
                key={question.id}
                className="lux-panel rounded-[1.9rem] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="mini-label">
                      {question.number} / {finderQuestions.length.toString().padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold text-stone-50 sm:text-[1.65rem]">
                      {question.prompt}
                    </h3>
                    <p className="muted-copy mt-2 max-w-2xl text-sm leading-6">
                      {question.helper}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                    One choice
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  {question.options.map((option) => {
                    const isActive = answers[question.id] === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleAnswer(question.id, option.id)}
                        className={cn(
                          "rounded-[1.45rem] border px-4 py-4 text-left transition-colors sm:px-5",
                          getToneClasses(option.tone),
                          isActive
                            ? "ring-1 ring-[rgba(216,170,115,0.28)]"
                            : "hover:border-[rgba(216,170,115,0.24)]"
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="max-w-2xl">
                            <p className="text-base font-semibold text-stone-50">
                              {option.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-300">
                              {option.detail}
                            </p>
                          </div>
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-300">
                            {option.tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </PointerCard>
            ))}
          </div>

          <div className="xl:sticky xl:top-28 xl:self-start">
            <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-7">
              <p className="mini-label">Recommendation</p>
              <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                {allAnswered
                  ? "Here is the most likely fit."
                  : "Finish the questions to unlock the likely fit."}
              </h3>
              <p className="muted-copy mt-4 text-sm leading-7">
                The recommendation stays honest to the live offer ladder. The
                build recommendation points to the most likely one-time tier,
                and the support recommendation only shows up if monthly help
                actually looks justified.
              </p>

              {recommendation ? (
                <div className="mt-6 space-y-4">
                  {recommendation.buildPlan ? (
                    <RecommendationCard
                      icon={Layers3}
                      title="Build path"
                      plan={recommendation.buildPlan}
                      tone={
                        recommendation.buildPlan.id === "launch-site"
                          ? "accent"
                          : recommendation.buildPlan.id === "growth-build"
                            ? "teal"
                            : "neutral"
                      }
                    />
                  ) : (
                    <EmptyLaneCard
                      icon={Compass}
                      title="Build path"
                      body="No rebuild-first path was recommended. The current site sounds close enough to stay live while support handles the immediate need."
                    />
                  )}

                  {recommendation.supportPlan ? (
                    <RecommendationCard
                      icon={LifeBuoy}
                      title="Monthly lane"
                      plan={recommendation.supportPlan}
                      tone={
                        recommendation.supportPlan.id === "search-conversion-support"
                          ? "teal"
                          : recommendation.supportPlan.id === "managed-site-care"
                            ? "accent"
                            : "neutral"
                      }
                    />
                  ) : (
                    <EmptyLaneCard
                      icon={ShieldCheck}
                      title="Monthly lane"
                      body="A clean handoff looks like the better fit right now. Monthly support can stay optional until it earns its keep."
                    />
                  )}

                  <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="mini-label">Why this fit</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
                      {recommendation.reasons.map((reason, index) => (
                        <li key={`${reason}-${index}`} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    {recommendation.requiresScope ? (
                      <a
                        href={recommendation.intakeHref}
                        className="button-primary w-full px-6 py-4 text-sm"
                      >
                        Request Scope Review
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddFixedPackage}
                        className="button-primary w-full px-6 py-4 text-sm"
                      >
                        Add Recommended Package
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}

                    <a
                      href={recommendation.intakeHref}
                      className="button-secondary w-full px-6 py-4 text-center text-sm"
                    >
                      Send Brief Instead
                    </a>
                  </div>

                  <p className="text-sm leading-7 text-stone-400">
                    Kickoff still waits for written scope, timeline, signer
                    clarity, and the right payment path. The package finder only
                    narrows the right lane.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.6rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm leading-7 text-stone-400">
                  Finish the four answers to see the likely build path, monthly
                  lane, and next step.
                </div>
              )}
            </PointerCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({
  icon: Icon,
  title,
  plan,
  tone,
}: {
  icon: typeof Layers3;
  title: string;
  plan: WebsitePlan | SupportPlan;
  tone: Tone;
}) {
  return (
    <div className={cn("rounded-[1.55rem] border p-5", getToneClasses(tone))}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="mini-label">{title}</p>
            <h4 className="mt-3 text-2xl font-semibold text-stone-50">
              {plan.name}
            </h4>
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-100">
          {plan.priceLabel}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-stone-200">{plan.summary}</p>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-7 text-stone-400">{plan.fit}</p>
    </div>
  );
}

function EmptyLaneCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Layers3;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="mini-label">{title}</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">{body}</p>
        </div>
      </div>
    </div>
  );
}
