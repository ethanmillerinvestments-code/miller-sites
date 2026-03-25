"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { FinderAnswers, FinderQuestion as FinderQuestionType } from "./finder-logic";
import { getToneClasses } from "./finder-logic";
import { ProgressBar } from "./FinderProgress";

/* ------------------------------------------------------------------ */
/*  Active question card                                               */
/* ------------------------------------------------------------------ */

export default function FinderQuestion({
  question,
  answers,
  currentStep,
  answeredCount,
  pendingCount,
  progressPercent,
  countLabel,
  onAnswer,
  onBack,
  onNext,
}: {
  question: FinderQuestionType;
  answers: FinderAnswers;
  currentStep: number;
  answeredCount: number;
  pendingCount: number;
  progressPercent: string;
  countLabel: string;
  onAnswer: (questionId: FinderQuestionType["id"], optionId: string) => void;
  onBack: () => void;
  onNext?: () => void;
}) {
  const canGoBack = currentStep > 0;
  const canGoForward = Boolean(onNext);

  return (
    <motion.div
      drag={canGoBack || canGoForward ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x < -80 && onNext) onNext();
        if (info.offset.x > 80 && canGoBack) onBack();
      }}
      style={{ touchAction: "pan-y" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="mini-label">
            {question.number} / {countLabel}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-stone-50 sm:text-[1.55rem]">
            {question.prompt}
          </h3>
          <p className="muted-copy mt-2 max-w-2xl text-sm leading-6">
            {question.helper}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.24)] hover:text-stone-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : null}
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
            Pick one
          </span>
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar
          answeredCount={answeredCount}
          pendingCount={pendingCount}
          totalCount={answeredCount + pendingCount}
          progressPercent={progressPercent}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isActive = answers[question.id] === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onAnswer(question.id, option.id)}
              className={cn(
                "rounded-[1.35rem] border px-4 py-4 text-left transition-colors sm:px-5",
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
    </motion.div>
  );
}
