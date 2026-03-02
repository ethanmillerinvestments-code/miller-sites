"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Particles() {
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    const colors = ["#6366f1", "#22d3ee", "#a855f7", "#f59e0b"];
    setParticles(
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.4,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="animate-pulse" style={{ color: "#6366f1" }}>
          |
        </span>
      )}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04080f] via-[#0d0f1f] to-[#04080f]" />

      {/* Hero-specific glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-brand/15 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-brand/10 blur-[100px] animate-pulse-glow" />

      <Particles />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6 border"
            style={{
              background: "rgba(99,102,241,0.1)",
              color: "#818cf8",
              borderColor: "rgba(99,102,241,0.3)",
            }}
          >
            Websites That Generate Leads
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            <TypewriterText text="Professional Websites for Home Service Businesses" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          We build fast, modern websites that turn visitors into customers.
          HVAC, plumbing, roofing, landscaping, and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#results"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative overflow-hidden font-semibold px-8 py-4 rounded-lg text-lg text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 0 30px rgba(99,102,241,0.35)",
            }}
          >
            See Our Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="font-semibold px-8 py-4 rounded-lg text-lg text-white border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            Book a Call
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
