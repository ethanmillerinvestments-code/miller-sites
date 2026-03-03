"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "zoom" | "blur";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  duration?: number;
}

const variants: Record<Direction, { initial: Record<string, number>; animate: Record<string, number> }> = {
  up: {
    initial: { opacity: 0, y: 50, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  down: {
    initial: { opacity: 0, y: -40, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  left: {
    initial: { opacity: 0, x: -60, scale: 0.97 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
  right: {
    initial: { opacity: 0, x: 60, scale: 0.97 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
  },
  blur: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
};

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 0.7,
}: ScrollRevealProps) {
  const v = variants[direction];

  return (
    <motion.div
      initial={{ ...v.initial, filter: direction === "blur" ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ ...v.animate, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
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
