"use client";

import { useEffect, useRef } from "react";

import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface AnimatedValueProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedValue({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedValueProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 28,
    mass: 0.6,
  });

  useEffect(() => {
    if (isInView && !reduceMotion) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, reduceMotion, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });

    return unsubscribe;
  }, [springValue, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {reduceMotion
        ? `${prefix}${value.toLocaleString()}${suffix}`
        : `${prefix}0${suffix}`}
    </span>
  );
}
