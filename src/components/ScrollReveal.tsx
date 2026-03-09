"use client";

import { type ReactNode, useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "zoom" | "blur";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  duration?: number;
}

const variants: Record<
  Direction,
  { initial: Record<string, number>; animate: Record<string, number> }
> = {
  up: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
  },
  down: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
  },
  left: {
    initial: { opacity: 0, x: -18 },
    animate: { opacity: 1, x: 0 },
  },
  right: {
    initial: { opacity: 0, x: 18 },
    animate: { opacity: 1, x: 0 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.975 },
    animate: { opacity: 1, scale: 1 },
  },
  blur: {
    initial: { opacity: 0, y: 10, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
};

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 0.58,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.14,
    margin: "0px 0px -12% 0px",
  });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variant = variants[direction];
  const hiddenState = {
    ...variant.initial,
    filter: direction === "blur" ? "blur(8px)" : "blur(0px)",
  };
  const visibleState = {
    ...variant.animate,
    filter: "blur(0px)",
  };

  return (
    <motion.div
      ref={ref}
      initial={hiddenState}
      animate={isInView ? visibleState : hiddenState}
      data-reveal="true"
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
