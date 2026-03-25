"use client";

import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Layers3,
  LifeBuoy,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { WebsitePlan, SupportPlan } from "@/lib/offers";
import { trackPricingCtaClick } from "@/lib/analytics";
import {
  type AnswerSummary,
  type Recommendation,
  type Tone,
  finderGuardrails,
  getToneClasses,
} from "./finder-logic";
import {
  AnswerTracker,
  ProgressBar,
  SummaryProgressBar,
} from "./FinderProgress";

/* ------------------------------------------------------------------ */
/*  Summary panel (left column, after all questions answered)          */
/* ------------------------------------------------------------------ */

export function FinderSummary({
  answerSummaries,
  countLabel,
  progressPercent,
  onBack,
}: {
  answerSummaries: AnswerSummary[];
  countLabel: string;
  progressPercent: string;
  onBack: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="mini-label">All four answers are in</p>
          <h3 className="mt-3 text-2xl font-semibold text-stone-50 sm:text-[1.8rem]">
            The fit is ready on the right.
          </h3>
          <p className="muted-copy mt-2 max-w-2xl text-sm leading-6">
            Review the recommendation, compare the likely lane,
            and use Back if you want to revise the last answer
            before moving forward.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.24)] hover:text-stone-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <span className="rounded-full border border-[rgba(125,183,176,0.2)] bg-[rgba(125,183,176,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">
            Ready
          </span>
        </div>
      </div>

      <SummaryProgressBar progressPercent={progressPercent} />

      <div className="mt-6 grid gap-3">
        {answerSummaries.map(({ question, option }) => (
          <div
            key={question.id}
            className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-2xl">
                <p className="mini-label">
                  {question.number} / {countLabel}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  {question.prompt}
                </p>
              </div>
              {option ? (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-300">
                  {option.tag}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-base font-semibold text-stone-50">
              {option?.title ?? "No answer recorded"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recommendation sidebar (right column)                              */
/* ------------------------------------------------------------------ */

export function FinderRecommendation({
  recommendation,
  onAddFixedPackage,
}: {
  recommendation: Recommendation;
  onAddFixedPackage: () => void;
}) {
  return (
    <>
      <p className="mini-label">Recommendation</p>
      <h3 className="mt-4 text-3xl font-semibold text-stone-50">
        Here is the most likely fit.
      </h3>
      <p className="muted-copy mt-4 text-sm leading-7">
        The recommendation stays tied to the live build and support ladder.
        It narrows the likely lane, then points you to the correct next
        step without pretending every project should check out the same way.
      </p>

      <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
            <LockKeyhole className="h-4 w-4" />
          </span>
          <div>
            <p className="mini-label">Process And Security</p>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-stone-200">
              {finderGuardrails.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

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
              onClick={() =>
                trackPricingCtaClick({
                  cta_label: "Request Scope Review",
                  cta_location: "package_finder_summary",
                  offer_ids: [
                    ...(recommendation.buildPlan
                      ? [recommendation.buildPlan.id]
                      : []),
                    ...(recommendation.supportPlan
                      ? [recommendation.supportPlan.id]
                      : []),
                  ],
                })
              }
              className="button-primary w-full px-6 py-4 text-sm"
            >
              Request Scope Review
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="button"
              onClick={onAddFixedPackage}
              className="button-primary w-full px-6 py-4 text-sm"
            >
              Add Recommended Package
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          <a
            href={recommendation.intakeHref}
            onClick={() =>
              trackPricingCtaClick({
                cta_label: "Send Brief Instead",
                cta_location: "package_finder_summary",
                offer_ids: [
                  ...(recommendation.buildPlan
                    ? [recommendation.buildPlan.id]
                    : []),
                  ...(recommendation.supportPlan
                    ? [recommendation.supportPlan.id]
                    : []),
                ],
              })
            }
            className="button-secondary w-full px-6 py-4 text-center text-sm"
          >
            Send Brief Instead
          </a>
        </div>

        <p className="text-sm leading-7 text-stone-400">
          Kickoff still waits for written scope, timeline, signer
          clarity, and the correct payment path. The package match only
          narrows the lane and next step.
        </p>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Pre-recommendation sidebar (right column, quiz in progress)        */
/* ------------------------------------------------------------------ */

export function FinderPending({
  answeredCount,
  pendingCount,
  progressPercent,
  answerSummaries,
  countLabel,
}: {
  answeredCount: number;
  pendingCount: number;
  progressPercent: string;
  answerSummaries: AnswerSummary[];
  countLabel: string;
}) {
  return (
    <div className="mt-6 space-y-4">
      <p className="mini-label">Progress</p>
      <h3 className="text-3xl font-semibold text-stone-50">
        One question at a time keeps this tighter.
      </h3>
      <p className="muted-copy text-sm leading-7">
        The recommendation stays hidden until the last answer so the
        quiz reads like a guided step instead of four stacked cards.
      </p>

      <ProgressBar
        answeredCount={answeredCount}
        pendingCount={pendingCount}
        totalCount={answeredCount + pendingCount}
        progressPercent={progressPercent}
      />

      <AnswerTracker
        answerSummaries={answerSummaries}
        countLabel={countLabel}
      />

      <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
            <LockKeyhole className="h-4 w-4" />
          </span>
          <div>
            <p className="mini-label">Process And Security</p>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-stone-200">
              {finderGuardrails.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                              */
/* ------------------------------------------------------------------ */

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
