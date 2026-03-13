"use client";

import { useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

interface GradientRevealProps {
  text: string;
  className?: string;
  delayOffset?: number;
}

export default function GradientReveal({
  text,
  className = "",
  delayOffset = 0,
}: GradientRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  if (reduceMotion) {
    return <span className={`text-sheen ${className}`}>{text}</span>;
  }

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{
            duration: 0.4,
            delay: delayOffset + index * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-sheen inline-block"
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
