"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left shadow-[0_0_24px_rgba(216,170,115,0.28)]"
      style={{
        scaleX,
        backgroundImage:
          "linear-gradient(90deg, rgba(216,170,115,0.95), rgba(241,196,140,0.9) 30%, rgba(125,183,176,0.9) 70%, rgba(125,183,176,0.95))",
        backgroundSize: "200% 100%",
        backgroundPositionX: gradientPosition,
      }}
    />
  );
}
