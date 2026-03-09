"use client";

import { useRef } from "react";

import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type ScrollRevealTextProps = {
  text: string;
  className?: string;
  delay?: number;
  wordClassName?: string;
};

export default function ScrollRevealText({
  text,
  className,
  delay = 0,
  wordClassName,
}: ScrollRevealTextProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.4,
    margin: "0px 0px -10% 0px",
  });

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex flex-wrap gap-x-[0.32em] gap-y-[0.1em]", className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.04,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={cn("inline-block", wordClassName)}
          variants={{
            hidden: { opacity: 0, y: "0.52em", filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
