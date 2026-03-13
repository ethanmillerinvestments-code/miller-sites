"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { useScrollKerning } from "@/hooks/useScrollKerning";
import { cn } from "@/lib/utils";

type EditorialRevealProps = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delayStep?: number;
  animateKerning?: boolean;
};

export default function EditorialReveal({
  lines,
  className,
  lineClassName,
  delayStep = 0.08,
  animateKerning = false,
}: EditorialRevealProps) {
  const reduceMotion = useReducedMotion();
  const kerningRef = useScrollKerning();

  if (reduceMotion) {
    return (
      <div className={cn("space-y-1.5", className)}>
        {lines.map((line, index) => (
          <div key={index} className={lineClassName}>
            {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={animateKerning ? kerningRef : undefined}
      className={cn("space-y-1.5", className)}
    >
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.72,
            delay: index * delayStep,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={lineClassName}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}
