"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export default function Aurora() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const warmX = useTransform(scrollYProgress, [0, 0.45, 1], ["20%", "31%", "48%"]);
  const warmY = useTransform(scrollYProgress, [0, 0.5, 1], ["14%", "22%", "32%"]);
  const coolX = useTransform(scrollYProgress, [0, 0.5, 1], ["78%", "68%", "54%"]);
  const coolY = useTransform(scrollYProgress, [0, 0.55, 1], ["18%", "31%", "52%"]);

  const upperGlowOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.48, 0.38, 0.24]);
  const lowerGlowOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0.12, 0.21, 0.32]);
  const surfaceOpacity = useTransform(scrollYProgress, [0, 1], [0.18, 0.34]);
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [0.12, 0.22]);

  const upperGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduceMotion ? "0%" : "-8%"]
  );
  const lowerGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduceMotion ? "0%" : "9%"]
  );
  const beamX = useTransform(
    scrollYProgress,
    [0, 1],
    ["-4%", reduceMotion ? "-4%" : "5%"]
  );
  const upperGlowScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.08]);
  const lowerGlowScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.05]);

  const baseGradient = useMotionTemplate`
    radial-gradient(circle at ${warmX} ${warmY}, rgba(216, 170, 115, 0.16), transparent 27%),
    radial-gradient(circle at ${coolX} ${coolY}, rgba(125, 183, 176, 0.14), transparent 30%),
    linear-gradient(180deg, #090a0d 0%, #0b0c0f 46%, #101116 100%)
  `;

  const atmosphereGradient = useMotionTemplate`
    linear-gradient(
      135deg,
      rgba(216, 170, 115, 0.06) 0%,
      transparent 34%,
      rgba(125, 183, 176, 0.055) 66%,
      transparent 92%
    )
  `;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0 bg-[#0b0c0f]" style={{ backgroundImage: baseGradient }} />
      <motion.div
        style={{ opacity: upperGlowOpacity, scale: upperGlowScale, y: upperGlowY }}
        className="absolute left-[-10%] top-[-15rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,_rgba(216,170,115,0.2),_rgba(216,170,115,0.035)_54%,_transparent_74%)] blur-3xl"
      />
      <motion.div
        style={{ opacity: lowerGlowOpacity, scale: lowerGlowScale, y: lowerGlowY }}
        className="absolute right-[-12%] top-[21rem] h-[31rem] w-[31rem] rounded-full bg-[radial-gradient(circle,_rgba(125,183,176,0.14),_rgba(125,183,176,0.02)_56%,_transparent_78%)] blur-3xl"
      />
      <motion.div
        style={{ x: beamX, opacity: veilOpacity }}
        className="absolute inset-x-[-18rem] top-[30%] h-px bg-[linear-gradient(90deg,transparent,rgba(216,170,115,0.16),rgba(125,183,176,0.18),transparent)]"
      />
      <motion.div
        style={{ opacity: surfaceOpacity, backgroundImage: atmosphereGradient }}
        className="absolute inset-0 mix-blend-screen"
      />
      <div className="absolute inset-0 grain-overlay opacity-35" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.02)_0%,rgba(6,7,10,0.08)_34%,rgba(6,7,10,0.24)_100%)]" />
    </div>
  );
}
