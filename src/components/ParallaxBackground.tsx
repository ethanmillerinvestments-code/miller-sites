"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 1.8]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.5]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.15, 0.25, 0.2, 0.1]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.2, 0.25, 0.15]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large violet orb - top left, moves up fast */}
      <motion.div
        style={{ y: y1, scale: scale1, opacity: opacity1 }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-violet-brand/20 blur-[120px]" />
      </motion.div>

      {/* Cyan orb - bottom right, moves down */}
      <motion.div
        style={{ y: y2, scale: scale2, opacity: opacity2 }}
        className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full"
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-cyan-brand/15 blur-[140px]" />
      </motion.div>

      {/* Electric indigo orb - center, moves up slow */}
      <motion.div
        style={{ y: y3, opacity: opacity1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-electric/10 blur-[100px]" />
      </motion.div>

      {/* Gold accent - mid left, moves down */}
      <motion.div
        style={{ y: y4, opacity: opacity2 }}
        className="absolute top-[60%] -left-20 w-[300px] h-[300px] rounded-full"
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-gold/10 blur-[80px]" />
      </motion.div>

      {/* Rotating grid ring - top right */}
      <motion.div
        style={{ rotate: rotate1, y: y1, opacity: opacity2 }}
        className="absolute top-20 right-20 w-[400px] h-[400px]"
        aria-hidden
      >
        <div className="w-full h-full rounded-full border border-electric/10" />
        <div className="absolute inset-8 rounded-full border border-violet-brand/10" />
        <div className="absolute inset-16 rounded-full border border-cyan-brand/10" />
      </motion.div>

      {/* Rotating ring - bottom left */}
      <motion.div
        style={{ rotate: rotate2, y: y2, opacity: opacity2 }}
        className="absolute bottom-40 left-10 w-[300px] h-[300px]"
        aria-hidden
      >
        <div className="w-full h-full rounded-full border border-violet-brand/10" />
        <div className="absolute inset-8 rounded-full border border-electric/10" />
      </motion.div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />
    </div>
  );
}
