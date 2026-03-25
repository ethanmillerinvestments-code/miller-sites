"use client";

import { startTransition, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import {
  trackCtaClick,
  trackEvent,
} from "@/lib/analytics";
import { useCart } from "@/store/cart";

import {
  type FinderAnswers,
  createCartItem,
  finderQuestions,
  finderSignals,
  getRecommendation,
} from "./finder-logic";
import FinderQuestion from "./FinderQuestion";
import { FinderSummary, FinderRecommendation, FinderPending } from "./FinderResult";

/* ------------------------------------------------------------------ */
/*  PackageFinder orchestrator                                         */
/* ------------------------------------------------------------------ */

export default function PackageFinder() {
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);
  const reduceMotion = useReducedMotion();
  const [answers, setAnswers] = useState<FinderAnswers>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);
  const hasTrackedStart = useRef(false);

  const completionStep = finderQuestions.length;
  const showingSummary = currentStep === completionStep;
  const activeQuestion = showingSummary ? null : finderQuestions[currentStep];
  const answerSummaries = finderQuestions.map((question) => {
    const answerId = answers[question.id];
    return {
      question,
      option: question.options.find((option) => option.id === answerId),
    };
  });
  const answeredCount = answerSummaries.filter((summary) => Boolean(summary.option)).length;
  const pendingCount = finderQuestions.length - answeredCount;
  const progressPercent = `${(answeredCount / finderQuestions.length) * 100}%`;
  const countLabel = finderQuestions.length.toString().padStart(2, "0");

  const allAnswered = finderQuestions.every((question) => Boolean(answers[question.id]));
  const recommendation = allAnswered ? getRecommendation(answers) : null;

  const handleAnswer = (questionId: (typeof finderQuestions)[number]["id"], optionId: string) => {
    const questionIndex = finderQuestions.findIndex((question) => question.id === questionId);
    const nextAnswers = {
      ...answers,
      [questionId]: optionId,
    };
    const selectedOption = finderQuestions[questionIndex]?.options.find(
      (option) => option.id === optionId
    );

    if (!hasTrackedStart.current) {
      trackEvent("package_finder_started", {
        question_id: questionId,
        question_number: questionIndex + 1,
      });
      hasTrackedStart.current = true;
    }

    trackEvent("package_finder_step_completed", {
      question_id: questionId,
      question_number: questionIndex + 1,
      answer_id: optionId,
      answer_tag: selectedOption?.tag || "",
    });

    if (finderQuestions.every((question) => Boolean(nextAnswers[question.id]))) {
      const nextRecommendation = getRecommendation(nextAnswers);
      trackEvent("package_finder_completed", {
        recommended_build_id: nextRecommendation.buildPlan?.id || "",
        recommended_support_id: nextRecommendation.supportPlan?.id || "",
        offer_ids: [
          ...(nextRecommendation.buildPlan ? [nextRecommendation.buildPlan.id] : []),
          ...(nextRecommendation.supportPlan ? [nextRecommendation.supportPlan.id] : []),
        ],
        requires_scope: nextRecommendation.requiresScope,
      });
    }

    startTransition(() => {
      setAnswers(nextAnswers);
      setStepDirection(1);
      setCurrentStep(
        questionIndex >= finderQuestions.length - 1 ? completionStep : questionIndex + 1
      );
    });
  };

  const handleBack = () => {
    if (currentStep === 0) {
      return;
    }

    startTransition(() => {
      setStepDirection(-1);
      setCurrentStep((value) => Math.max(0, value - 1));
    });
  };

  const handleNext = () => {
    if (currentStep >= finderQuestions.length - 1) {
      startTransition(() => {
        setStepDirection(1);
        setCurrentStep(completionStep);
      });
      return;
    }

    startTransition(() => {
      setStepDirection(1);
      setCurrentStep((value) => value + 1);
    });
  };

  const handleAddFixedPackage = () => {
    if (!recommendation) {
      return;
    }

    trackCtaClick({
      cta_label: "Add Recommended Package",
      cta_location: "package_finder_summary",
      offer_ids: [
        ...(recommendation.buildPlan ? [recommendation.buildPlan.id] : []),
        ...(recommendation.supportPlan ? [recommendation.supportPlan.id] : []),
      ],
    });

    if (recommendation.buildPlan?.checkoutMode === "cart") {
      addItem(createCartItem(recommendation.buildPlan, "website", "one-time"));
    }

    if (recommendation.supportPlan?.checkoutMode === "cart") {
      addItem(createCartItem(recommendation.supportPlan, "support", "monthly"));
    }

    openCart();
  };

  const stepVariants = {
    enter: (direction: number) =>
      reduceMotion
        ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
        : {
            opacity: 0,
            x: direction > 0 ? 34 : -34,
            y: 10,
            filter: "blur(8px)",
          },
    center: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
    exit: (direction: number) =>
      reduceMotion
        ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
        : {
            opacity: 0,
            x: direction > 0 ? -34 : 34,
            y: -10,
            filter: "blur(8px)",
          },
  };

  const stepTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.25, 0.46, 0.45, 0.94] as const };

  return (
    <section id="package-finder" className="section-pad section-rule section-bg-warm pt-12 sm:pt-14">
      <div className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
          <ScrollReveal direction="blur">
            <div className="max-w-3xl">
              <span className="eyebrow">Package Match</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                The quiz starts immediately and keeps the site in one clean flow.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                Answer the four questions, get the likely build lane, see whether
                monthly support is justified, then move straight into pricing or
                scope review without another long setup section.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.04} direction="up">
            <div className="lux-subtle rounded-[1.85rem] p-5 sm:p-6">
              <p className="mini-label">Why This Feels Cleaner</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {finderSignals.map((item, index) => (
                  <span
                    key={item}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      index === 0
                        ? "border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)] text-[color:var(--accent-strong)]"
                        : index === 1
                          ? "border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)] text-[color:var(--teal)]"
                          : "border border-white/10 bg-white/[0.03] text-stone-300"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                This is still the real offer ladder. The package match simply
                puts the right lane first instead of making the buyer scroll
                through a long preamble.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <div>
            <PointerCard className="lux-panel rounded-[1.8rem] p-5 sm:p-6">
              <AnimatePresence initial={false} mode="wait" custom={stepDirection}>
                <motion.div
                  key={showingSummary ? "summary" : activeQuestion?.id}
                  custom={stepDirection}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={stepTransition}
                >
                  {showingSummary ? (
                    <FinderSummary
                      answerSummaries={answerSummaries}
                      countLabel={countLabel}
                      progressPercent={progressPercent}
                      onBack={handleBack}
                    />
                  ) : activeQuestion ? (
                    <FinderQuestion
                      question={activeQuestion}
                      answers={answers}
                      currentStep={currentStep}
                      answeredCount={answeredCount}
                      pendingCount={pendingCount}
                      progressPercent={progressPercent}
                      countLabel={countLabel}
                      onAnswer={handleAnswer}
                      onBack={handleBack}
                      onNext={answers[activeQuestion.id] ? handleNext : undefined}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </PointerCard>
          </div>

          <div className="xl:sticky xl:top-28 xl:self-start">
            <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-7">
              {recommendation ? (
                <FinderRecommendation
                  recommendation={recommendation}
                  onAddFixedPackage={handleAddFixedPackage}
                />
              ) : (
                <FinderPending
                  answeredCount={answeredCount}
                  pendingCount={pendingCount}
                  progressPercent={progressPercent}
                  answerSummaries={answerSummaries}
                  countLabel={countLabel}
                />
              )}
            </PointerCard>
          </div>
        </div>
      </div>
    </section>
  );
}
