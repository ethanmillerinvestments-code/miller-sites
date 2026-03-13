"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ClickPulse = {
  id: number;
  x: number;
  y: number;
  tone: "accent" | "teal";
  satellite?: boolean;
};

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input[type='submit'], input[type='button'], summary";

export default function InteractionFeedback() {
  const reduceMotion = useReducedMotion();
  const [pulses, setPulses] = useState<ClickPulse[]>([]);
  const cleanupTimers = useRef<number[]>([]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const trigger = target.closest(INTERACTIVE_SELECTOR);
      if (!trigger) {
        return;
      }

      if (
        trigger.hasAttribute("disabled") ||
        trigger.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      if ("vibrate" in navigator && event.pointerType !== "mouse") {
        navigator.vibrate(10);
      }

      if (reduceMotion || event.clientX === 0 || event.clientY === 0) {
        return;
      }

      const baseId = Date.now() + Math.round(Math.random() * 1000);
      const tone = event.pointerType === "touch" ? "teal" : "accent";

      const pulse: ClickPulse = {
        id: baseId,
        x: event.clientX,
        y: event.clientY,
        tone,
      };

      const satellites: ClickPulse[] = Array.from({ length: 3 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 3 + Math.random() * 0.8;
        const dist = 12 + Math.random() * 10;
        return {
          id: baseId + i + 1,
          x: event.clientX + Math.cos(angle) * dist,
          y: event.clientY + Math.sin(angle) * dist,
          tone,
          satellite: true,
        };
      });

      setPulses((current) => [...current, pulse, ...satellites]);

      const allIds = new Set([pulse.id, ...satellites.map((s) => s.id)]);
      const timeoutId = window.setTimeout(() => {
        setPulses((current) => current.filter((entry) => !allIds.has(entry.id)));
      }, 620);

      cleanupTimers.current.push(timeoutId);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      cleanupTimers.current.forEach((timer) => window.clearTimeout(timer));
      cleanupTimers.current = [];
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <AnimatePresence>
        {pulses.map((pulse) => (
          <motion.span
            key={pulse.id}
            initial={{
              opacity: pulse.satellite ? 0.4 : 0.55,
              scale: pulse.satellite ? 0.2 : 0.32,
            }}
            animate={{
              opacity: 0,
              scale: pulse.satellite ? 1.6 : 2.4,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: pulse.satellite ? 0.4 : 0.5,
              ease: "easeOut",
              delay: pulse.satellite ? 0.04 : 0,
            }}
            className={`absolute rounded-full border ${
              pulse.satellite ? "h-6 w-6" : "h-12 w-12"
            } ${
              pulse.tone === "teal"
                ? "border-[rgba(125,183,176,0.5)] bg-[rgba(125,183,176,0.18)]"
                : "border-[rgba(216,170,115,0.46)] bg-[rgba(216,170,115,0.14)]"
            }`}
            style={{
              left: pulse.x - (pulse.satellite ? 12 : 24),
              top: pulse.y - (pulse.satellite ? 12 : 24),
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
