"use client";

import { useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

type BridgeVariant = "gradient-wipe" | "diamond" | "dot-trail" | "glow-pulse";
type Tone = "accent" | "teal" | "mixed";

interface SectionBridgeProps {
  variant?: BridgeVariant;
  tone?: Tone;
  className?: string;
}

const toneColors: Record<Tone, { primary: string; secondary: string }> = {
  accent: {
    primary: "rgba(216, 170, 115, 0.5)",
    secondary: "rgba(216, 170, 115, 0.2)",
  },
  teal: {
    primary: "rgba(125, 183, 176, 0.45)",
    secondary: "rgba(125, 183, 176, 0.18)",
  },
  mixed: {
    primary: "rgba(216, 170, 115, 0.5)",
    secondary: "rgba(125, 183, 176, 0.4)",
  },
};

export default function SectionBridge({
  variant = "gradient-wipe",
  tone = "mixed",
  className = "",
}: SectionBridgeProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const colors = toneColors[tone];

  const staticGradient = `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)`;

  if (reduceMotion) {
    return (
      <div
        className={`mx-auto h-px w-full max-w-[42rem] ${className}`}
        style={{ background: staticGradient }}
      />
    );
  }

  if (variant === "gradient-wipe") {
    return (
      <div ref={ref} className={`relative mx-auto h-[2px] w-full max-w-[42rem] overflow-hidden ${className}`}>
        <motion.div
          initial={{ x: "-100%" }}
          animate={isInView ? { x: "0%" } : { x: "-100%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 30%, ${colors.secondary} 70%, transparent 100%)` }}
        />
      </div>
    );
  }

  if (variant === "diamond") {
    return (
      <div ref={ref} className={`relative mx-auto flex h-3 w-full max-w-[42rem] items-center ${className}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-px flex-1 origin-right"
          style={{ background: `linear-gradient(90deg, transparent, ${colors.primary})` }}
        />
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={isInView ? { scale: 1, rotate: 45 } : { scale: 0, rotate: 45 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-2 h-[6px] w-[6px] shrink-0"
          style={{ background: colors.primary, boxShadow: `0 0 8px ${colors.primary}` }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-px flex-1 origin-left"
          style={{ background: `linear-gradient(90deg, ${colors.secondary}, transparent)` }}
        />
      </div>
    );
  }

  if (variant === "dot-trail") {
    const dotCount = 5;
    return (
      <div ref={ref} className={`mx-auto flex w-full max-w-[42rem] items-center justify-center gap-3 ${className}`}>
        {Array.from({ length: dotCount }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-[3px] w-[3px] rounded-full"
            style={{
              background: i % 2 === 0 ? colors.primary : colors.secondary,
              boxShadow: `0 0 6px ${i % 2 === 0 ? colors.primary : colors.secondary}`,
            }}
          />
        ))}
      </div>
    );
  }

  // glow-pulse
  return (
    <div ref={ref} className={`relative mx-auto h-px w-full max-w-[42rem] overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 origin-center"
        style={{ background: staticGradient }}
      />
      <motion.div
        initial={{ x: "-10%", opacity: 0 }}
        animate={isInView ? { x: "110%", opacity: [0, 1, 0] } : { x: "-10%", opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
        className="absolute inset-y-0 w-12"
        style={{
          background: `radial-gradient(ellipse, ${colors.primary}, transparent)`,
          filter: "blur(4px)",
        }}
      />
    </div>
  );
}
