"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type StarBorderProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function StarBorder({
  children,
  className,
  contentClassName,
}: StarBorderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] p-[1px]",
        className
      )}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-40%] opacity-70"
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 14,
                repeat: Infinity,
                ease: "linear",
              }
        }
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(216,170,115,0.92) 42deg, transparent 98deg, transparent 182deg, rgba(125,183,176,0.72) 236deg, transparent 298deg, transparent 360deg)",
        }}
      />
      <div
        className={cn(
          "relative rounded-[calc(2rem-1px)] border border-white/10 bg-[linear-gradient(180deg,rgba(17,18,24,0.92),rgba(11,12,15,0.96))]",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
