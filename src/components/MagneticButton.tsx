"use client";

import { type ReactNode, useRef } from "react";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  maxShift?: number;
}

export default function MagneticButton({
  children,
  className = "",
  maxShift = 4,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 36, mass: 0.34 });
  const springY = useSpring(y, { stiffness: 320, damping: 36, mass: 0.34 });

  if (reduceMotion || typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = ((event.clientX - centerX) / (rect.width / 2)) * maxShift;
        const distY = ((event.clientY - centerY) / (rect.height / 2)) * maxShift;
        x.set(distX);
        y.set(distY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
