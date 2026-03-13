"use client";

import { useRef } from "react";

import {
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export function useScrollKerning(
  looseKerning = -0.015,
  tightKerning = -0.038
) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const kerning = useTransform(
    scrollYProgress,
    [0, 0.5],
    [looseKerning, tightKerning]
  );

  useMotionValueEvent(kerning, "change", (latest) => {
    if (ref.current && !reduceMotion && isInView) {
      ref.current.style.letterSpacing = `${latest}em`;
    }
  });

  return ref;
}
