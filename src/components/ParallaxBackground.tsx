"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";

function ShootingStars() {
  const [stars, setStars] = useState<
    { id: number; x: number; y: number; angle: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60,
        angle: 30 + Math.random() * 30,
        delay: Math.random() * 12,
        duration: 1.5 + Math.random() * 2,
      }))
    );
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 0 6px 2px rgba(124,111,255,0.6), -20px 0 12px rgba(124,111,255,0.3), -40px 0 20px rgba(193,101,255,0.15)",
            rotate: `${star.angle}deg`,
          }}
          animate={{
            x: [0, 300],
            y: [0, 300],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            repeatDelay: 8 + Math.random() * 12,
            ease: "easeOut",
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y5 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const y6 = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 1.8]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.5]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.45, 0.6, 0.5, 0.35]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.35, 0.5, 0.55, 0.4]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.25, 0.4, 0.35, 0.2]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Aurora top sweep - enhanced with multiple layers */}
      <div
        className="absolute top-0 left-0 right-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,111,255,0.25) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="absolute top-0 left-0 right-0 h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% -5%, rgba(193,101,255,0.12) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Large violet orb - top left */}
      <motion.div
        style={{ y: y1, scale: scale1, opacity: opacity1 }}
        className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(193,101,255,0.5) 0%, rgba(124,111,255,0.2) 60%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Cyan orb - bottom right */}
      <motion.div
        style={{ y: y2, scale: scale2, opacity: opacity2 }}
        className="absolute -bottom-60 -right-40 w-[900px] h-[900px] rounded-full"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.4) 0%, rgba(0,229,255,0.1) 60%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Electric indigo center orb */}
      <motion.div
        style={{ y: y3, opacity: opacity1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,111,255,0.35) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Gold mid-left orb */}
      <motion.div
        style={{ y: y4, opacity: opacity3 }}
        className="absolute top-[55%] -left-20 w-[450px] h-[450px] rounded-full"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Hot violet orb - mid right */}
      <motion.div
        style={{ y: y5, opacity: opacity2 }}
        className="absolute top-[35%] -right-20 w-[500px] h-[500px] rounded-full"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(193,101,255,0.4) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Deep cyan accent - bottom center (NEW) */}
      <motion.div
        style={{ y: y6, opacity: opacity3 }}
        className="absolute bottom-[20%] left-1/3 w-[600px] h-[600px] rounded-full"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(124,111,255,0.08) 50%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Rotating ring - top right */}
      <motion.div
        style={{ rotate: rotate1, y: y1, opacity: opacity3 }}
        className="absolute top-20 right-20 w-[500px] h-[500px]"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{ border: "1px solid rgba(124,111,255,0.25)" }}
        />
        <div
          className="absolute inset-10 rounded-full"
          style={{ border: "1px solid rgba(193,101,255,0.2)" }}
        />
        <div
          className="absolute inset-20 rounded-full"
          style={{ border: "1px solid rgba(0,229,255,0.15)" }}
        />
      </motion.div>

      {/* Rotating ring - bottom left */}
      <motion.div
        style={{ rotate: rotate2, y: y2, opacity: opacity3 }}
        className="absolute bottom-40 left-10 w-[380px] h-[380px]"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{ border: "1px solid rgba(193,101,255,0.2)" }}
        />
        <div
          className="absolute inset-10 rounded-full"
          style={{ border: "1px solid rgba(124,111,255,0.15)" }}
        />
      </motion.div>

      {/* Small rotating ring - center (NEW) */}
      <motion.div
        style={{ rotate: rotate3, y: y3, opacity: opacity3 }}
        className="absolute top-[60%] right-[30%] w-[200px] h-[200px]"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{ border: "1px solid rgba(0,229,255,0.12)" }}
        />
        <div
          className="absolute inset-6 rounded-full"
          style={{ border: "1px solid rgba(124,111,255,0.1)" }}
        />
      </motion.div>

      {/* Shooting stars */}
      <ShootingStars />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,111,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 1,
        }}
        aria-hidden
      />

      {/* Noise texture for depth */}
      <div className="absolute inset-0 noise-overlay" aria-hidden />
    </div>
  );
}
