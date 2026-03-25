"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

interface PageEntranceProps {
  children: ReactNode;
}

export default function PageEntrance({ children }: PageEntranceProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
