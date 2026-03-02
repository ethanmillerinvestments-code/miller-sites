"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Particles() {
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; delay: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-electric/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: p.delay }}
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
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse text-electric">|</span>}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse-glow" />

      <Particles />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-electric/10 text-electric text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-electric/20">
            Websites That Generate Leads
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          <TypewriterText text="Professional Websites for Home Service Businesses" />
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
          <a
            href="#results"
            className="bg-electric hover:bg-electric-dark text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:shadow-lg hover:shadow-electric/25"
          >
            See Our Work
          </a>
          <a
            href="#contact"
            className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:bg-white/5"
          >
            Book a Call
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center"
          >
            <motion.div className="w-1.5 h-3 bg-electric rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
