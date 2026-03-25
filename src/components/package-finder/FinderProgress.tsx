"use client";

import { cn } from "@/lib/utils";
import type { AnswerSummary } from "./finder-logic";

/* ------------------------------------------------------------------ */
/*  Progress bar (inline)                                              */
/* ------------------------------------------------------------------ */

export function ProgressBar({
  answeredCount,
  pendingCount,
  totalCount,
  progressPercent,
}: {
  answeredCount: number;
  pendingCount: number;
  totalCount: number;
  progressPercent: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        <span>{answeredCount} answered</span>
        <span>{pendingCount} left</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--teal))]"
          style={{ width: progressPercent, transition: "width 0.4s ease" }}
        />
      </div>
      <p className="mt-2 text-center text-[11px] font-semibold tracking-[0.14em] text-stone-500">
        {answeredCount} of {totalCount}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Full-width progress bar (summary strip)                            */
/* ------------------------------------------------------------------ */

export function SummaryProgressBar({
  progressPercent,
}: {
  progressPercent: string;
}) {
  return (
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.05]">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--teal))]"
        style={{ width: progressPercent, transition: "width 0.4s ease" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Answer tracker (sidebar)                                           */
/* ------------------------------------------------------------------ */

export function AnswerTracker({
  answerSummaries,
  countLabel,
}: {
  answerSummaries: AnswerSummary[];
  countLabel: string;
}) {
  return (
    <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="mini-label">Answer Tracker</p>
      <div className="mt-4 space-y-3">
        {answerSummaries.map(({ question, option }) => (
          <div
            key={question.id}
            className="flex items-start justify-between gap-4 rounded-[1.15rem] border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <div>
              <p className="mini-label">
                {question.number} / {countLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                {option?.title ?? "Waiting for answer"}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                option
                  ? "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)] text-[color:var(--teal)]"
                  : "border-white/10 bg-white/[0.04] text-stone-400"
              )}
            >
              {option ? "Locked" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
