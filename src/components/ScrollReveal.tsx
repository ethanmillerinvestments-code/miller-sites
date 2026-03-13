"use client";

import { type CSSProperties, type ReactNode, useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "zoom" | "blur";
type Depth = "near" | "mid" | "far";

const depthConfig: Record<Depth, { yMultiplier: number; duration: number; scale: number }> = {
  near: { yMultiplier: 0.67, duration: 0.5, scale: 0.995 },
  mid: { yMultiplier: 1, duration: 0.58, scale: 0.99 },
  far: { yMultiplier: 1.56, duration: 0.72, scale: 0.975 },
};

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  duration?: number;
  depth?: Depth;
  style?: CSSProperties;
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
  duration,
  depth = "mid",
  style,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.14,
    margin: "0px 0px -12% 0px",
  });

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const config = depthConfig[depth];
  const resolvedDuration = duration ?? config.duration;
  const variant = variants[direction];
  const scaledInitial = { ...variant.initial };
  if ("y" in scaledInitial && typeof scaledInitial.y === "number") {
    scaledInitial.y = scaledInitial.y * config.yMultiplier;
  }
  if ("x" in scaledInitial && typeof scaledInitial.x === "number") {
    scaledInitial.x = scaledInitial.x * config.yMultiplier;
  }
  if (depth !== "mid") {
    scaledInitial.scale = config.scale;
  }
  const hiddenState = {
    ...scaledInitial,
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
        duration: resolvedDuration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
