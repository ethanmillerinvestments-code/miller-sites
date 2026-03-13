"use client";

import { useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

interface SectionDividerProps {
  tone?: "accent" | "teal" | "mixed";
  className?: string;
}

export default function SectionDivider({
  tone = "mixed",
  className = "",
}: SectionDividerProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const gradient =
    tone === "accent"
      ? "linear-gradient(90deg, transparent, rgba(216, 170, 115, 0.42), transparent)"
      : tone === "teal"
        ? "linear-gradient(90deg, transparent, rgba(125, 183, 176, 0.38), transparent)"
        : "linear-gradient(90deg, transparent, rgba(216, 170, 115, 0.42), rgba(125, 183, 176, 0.38), transparent)";

  if (reduceMotion) {
    return (
      <div
        className={`mx-auto h-px w-full max-w-[42rem] ${className}`}
        style={{ background: gradient }}
      />
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto h-px w-full max-w-[42rem] origin-center ${className}`}
      style={{ background: gradient }}
    />
  );
}
