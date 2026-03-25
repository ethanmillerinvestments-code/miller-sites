"use client";

import React, { type CSSProperties, type ReactNode, useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "zoom" | "blur" | "slide" | "scale-blur";
type Pattern = "sequential" | "wave" | "cascade";

interface StaggerRevealProps {
  children: ReactNode;
  staggerDelay?: number;
  direction?: Direction;
  pattern?: Pattern;
  className?: string;
  style?: CSSProperties;
}

const directionVariants: Record<
  Direction,
  { initial: Record<string, number | string>; animate: Record<string, number | string> }
> = {
  up: { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } },
  down: { initial: { opacity: 0, y: -16 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: -18 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 } },
  zoom: { initial: { opacity: 0, scale: 0.975 }, animate: { opacity: 1, scale: 1 } },
  blur: { initial: { opacity: 0, y: 10, scale: 0.99 }, animate: { opacity: 1, y: 0, scale: 1 } },
  slide: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
  "scale-blur": { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 } },
};

function computeDelays(count: number, pattern: Pattern, baseDelay: number): number[] {
  if (pattern === "sequential") {
    return Array.from({ length: count }, (_, i) => i * baseDelay);
  }
  if (pattern === "wave") {
    const center = (count - 1) / 2;
    return Array.from({ length: count }, (_, i) => Math.abs(i - center) * baseDelay);
  }
  // cascade: diagonal feel, each row adds more delay
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return (row + col) * baseDelay;
  });
}

export default function StaggerReveal({
  children,
  staggerDelay = 0.08,
  direction = "up",
  pattern = "sequential",
  className = "",
  style,
}: StaggerRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.14, margin: "0px 0px -12% 0px" });

  const childArray = React.Children.toArray(children);

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const delays = computeDelays(childArray.length, pattern, staggerDelay);
  const variant = directionVariants[direction];
  const needsBlur = direction === "blur" || direction === "scale-blur";

  return (
    <div ref={ref} className={className} style={style}>
      {childArray.map((child, i) => (
        <motion.div
          key={i}
          initial={{
            ...variant.initial,
            ...(needsBlur ? { filter: "blur(8px)" } : {}),
          }}
          animate={
            isInView
              ? { ...variant.animate, ...(needsBlur ? { filter: "blur(0px)" } : {}) }
              : { ...variant.initial, ...(needsBlur ? { filter: "blur(8px)" } : {}) }
          }
          transition={{
            duration: 0.58,
            delay: delays[i],
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
