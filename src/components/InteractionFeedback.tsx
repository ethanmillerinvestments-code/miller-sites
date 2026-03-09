"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ClickPulse = {
  id: number;
  x: number;
  y: number;
  tone: "accent" | "teal";
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

      const pulse: ClickPulse = {
        id: Date.now() + Math.round(Math.random() * 1000),
        x: event.clientX,
        y: event.clientY,
        tone: event.pointerType === "touch" ? "teal" : "accent",
      };

      setPulses((current) => [...current, pulse]);

      const timeoutId = window.setTimeout(() => {
        setPulses((current) => current.filter((entry) => entry.id !== pulse.id));
      }, 520);

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
            initial={{ opacity: 0.55, scale: 0.32 }}
            animate={{ opacity: 0, scale: 2.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute h-12 w-12 rounded-full border ${
              pulse.tone === "teal"
                ? "border-[rgba(125,183,176,0.5)] bg-[rgba(125,183,176,0.18)]"
                : "border-[rgba(216,170,115,0.46)] bg-[rgba(216,170,115,0.14)]"
            }`}
            style={{
              left: pulse.x - 24,
              top: pulse.y - 24,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
