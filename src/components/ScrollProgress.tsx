"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left shadow-[0_0_24px_rgba(216,170,115,0.28)]"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, rgba(216,170,115,0.92), rgba(241,196,140,0.95), rgba(125,183,176,0.85))",
      }}
    />
  );
}
