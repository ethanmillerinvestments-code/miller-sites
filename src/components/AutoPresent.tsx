"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

type TourStep = {
  id: string;
  label: string;
  targetId: string;
  durationMs: number;
};

const tourSteps: readonly TourStep[] = [
  {
    id: "display",
    label: "Display",
    targetId: "hero-display",
    durationMs: 2200,
  },
  {
    id: "about",
    label: "About",
    targetId: "about-leadcraft",
    durationMs: 2400,
  },
  {
    id: "why",
    label: "Why It Works",
    targetId: "standards",
    durationMs: 2600,
  },
  {
    id: "pricing",
    label: "Pricing",
    targetId: "pricing",
    durationMs: 3200,
  },
] as const;

function clearActiveTargets() {
  document
    .querySelectorAll("[data-auto-present-active='true']")
    .forEach((element) => {
      element.removeAttribute("data-auto-present-active");
    });
}

function setActiveTarget(targetId: string | null) {
  clearActiveTargets();

  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);
  if (target) {
    target.setAttribute("data-auto-present-active", "true");
  }
}

function setPresentationState(isPlaying: boolean) {
  document.body.toggleAttribute("data-auto-present-running", isPlaying);
}

function scrollTargetIntoFocus(target: HTMLElement, reduceMotion: boolean) {
  const rect = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementTop = rect.top + window.scrollY;
  const visibleHeight = Math.min(rect.height, viewportHeight * 0.72);
  const topOffset =
    window.innerWidth < 640
      ? Math.max(76, (viewportHeight - visibleHeight) * 0.42)
      : Math.max(104, (viewportHeight - visibleHeight) * 0.5);
  const desiredTop = Math.max(0, elementTop - topOffset);
  const maxTop =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;

  window.scrollTo({
    top: Math.min(desiredTop, maxTop),
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

export default function AutoPresent() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = reduceMotion ?? false;
  const timerRef = useRef<number | null>(null);
  const runIdRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const stopTour = useCallback(() => {
    runIdRef.current += 1;

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsPlaying(false);
    setCurrentStep(0);
    clearActiveTargets();
    setPresentationState(false);
  }, []);

  const waitForStep = useCallback((durationMs: number) =>
    new Promise<void>((resolve) => {
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        resolve();
      }, durationMs);
    }), []);

  const runPresentation = useCallback(async (runId: number) => {
    for (const [index, step] of tourSteps.entries()) {
      if (runId !== runIdRef.current) {
        return;
      }

      setCurrentStep(index);

      const target = document.getElementById(step.targetId);
      if (target) {
        scrollTargetIntoFocus(target, prefersReducedMotion);
        setActiveTarget(step.targetId);
      } else {
        clearActiveTargets();
      }

      await waitForStep(step.durationMs);
    }

    if (runId === runIdRef.current) {
      stopTour();
    }
  }, [prefersReducedMotion, stopTour, waitForStep]);

  useEffect(() => {
    return () => {
      stopTour();
    };
  }, [stopTour]);

  useEffect(() => {
    if (pathname === "/") {
      return;
    }

    stopTour();
  }, [pathname, stopTour]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const startTour = () => {
      stopTour();
      runIdRef.current += 1;
      const runId = runIdRef.current;
      setCurrentStep(0);
      setIsPlaying(true);
      setPresentationState(false);
      window.requestAnimationFrame(() => {
        setPresentationState(true);
        void runPresentation(runId);
      });
    };

    window.addEventListener("leadcraft:auto-present:start", startTour);
    window.addEventListener("leadcraft:auto-present:stop", stopTour);

    return () => {
      window.removeEventListener("leadcraft:auto-present:start", startTour);
      window.removeEventListener("leadcraft:auto-present:stop", stopTour);
    };
  }, [pathname, runPresentation, stopTour]);

  useEffect(() => {
    setPresentationState(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || pathname !== "/") {
      return;
    }

    const stopOnIntent = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      stopTour();
    };

    window.addEventListener("wheel", stopOnIntent, { passive: true });
    window.addEventListener("touchstart", stopOnIntent, { passive: true });
    window.addEventListener("pointerdown", stopOnIntent);
    window.addEventListener("keydown", stopOnIntent);

    return () => {
      window.removeEventListener("wheel", stopOnIntent);
      window.removeEventListener("touchstart", stopOnIntent);
      window.removeEventListener("pointerdown", stopOnIntent);
      window.removeEventListener("keydown", stopOnIntent);
    };
  }, [isPlaying, pathname, stopTour]);

  return (
    <AnimatePresence>
      {isPlaying ? (
        <>
          <motion.div
            key="auto-present-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle_at_center,rgba(9,10,13,0.02)_0%,rgba(9,10,13,0.12)_40%,rgba(6,7,10,0.42)_100%)]"
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(8,9,12,0.62),transparent)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(8,9,12,0.68),transparent)]" />
          </motion.div>

          <motion.div
            key="auto-present-caption"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: "easeOut" }}
            className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center sm:bottom-6"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[rgba(8,9,12,0.76)] px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-stone-200 shadow-[0_16px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5">
              <span className="text-[color:var(--accent-strong)]">
                {tourSteps[currentStep]?.label}
              </span>
              <div className="flex items-center gap-1.5">
                {tourSteps.map((step, index) => (
                  <span
                    key={step.id}
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "w-6 bg-[color:var(--accent-strong)]"
                        : "w-1.5 bg-white/25"
                    }`}
                  />
                ))}
              </div>
              <span className="hidden text-stone-400 sm:inline">Scroll or tap to exit</span>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
