"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const GAMMA_HERO_IMG =
  "https://cdn.gamma.app/1hph8hbfgqd8x32/generated-images/M9UYmlywi5f8DTCf75ov_.png";

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
      {/* Gamma AI-generated background image */}
      <div className="absolute inset-0">
        <Image
          src={GAMMA_HERO_IMG}
          alt="Leadcraft Agency hero"
          fill
          priority
          className="object-cover"
          unoptimized
        />
        {/* Dark overlay so text reads clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04080fcc] via-[#04080faa] to-[#04080f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04080f80] via-transparent to-[#04080f80]" />
      </div>

      {/* Glows on top of image */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-brand/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-brand/8 blur-[100px] animate-pulse-glow" />

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
              background: "rgba(99,102,241,0.15)",
              color: "#a5b4fc",
              borderColor: "rgba(99,102,241,0.4)",
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
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            <TypewriterText text="Professional Websites for Home Service Businesses" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10"
        >
          We build high-converting, fast-loading websites that turn visitors
          into paying customers — tailored for HVAC, plumbing, roofing, and
          every trade in between.
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
              boxShadow: "0 0 40px rgba(99,102,241,0.45)",
            }}
          >
            See Our Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="font-semibold px-8 py-4 rounded-lg text-lg text-white border backdrop-blur-sm transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Book a Call
          </motion.a>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400"
        >
          {["50+ Sites Built", "2,500+ Leads Generated", "7-Day Delivery", "98% Client Retention"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-electric inline-block" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
