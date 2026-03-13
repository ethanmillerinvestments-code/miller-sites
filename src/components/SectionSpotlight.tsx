"use client";

import { useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

interface SectionSpotlightProps {
  tone?: "gold" | "teal";
  className?: string;
}

export default function SectionSpotlight({
  tone = "gold",
  className = "",
}: SectionSpotlightProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  if (reduceMotion) {
    return null;
  }

  const color =
    tone === "gold"
      ? "rgba(216, 170, 115, 0.08)"
      : "rgba(125, 183, 176, 0.08)";

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={
        isInView
          ? { scale: 1.2, opacity: [0, 0.6, 0] }
          : { scale: 0.4, opacity: 0 }
      }
      transition={{ duration: 1.8, ease: "easeOut" }}
      className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
      }}
    />
  );
}
