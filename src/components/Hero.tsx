"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const GAMMA_HERO_IMG =
  "https://cdn.gamma.app/1hph8hbfgqd8x32/generated-images/M9UYmlywi5f8DTCf75ov_.png";

function Particles() {
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; delay: number; color: string; duration: number; drift: number }[]
  >([]);

  useEffect(() => {
    const colors = ["#7c6fff", "#00e5ff", "#c165ff", "#fbbf24", "#a89fff"];
    setParticles(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 4 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 30,
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
            boxShadow: `0 0 ${p.size * 3}px ${p.color}40`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, p.drift, 0],
            opacity: [0.15, 0.6, 0.15],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
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
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ color: "#7c6fff" }}
        >
          |
        </motion.span>
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
        {/* Dark overlays with richer depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04080fdd] via-[#04080fbb] to-[#04080f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04080f90] via-transparent to-[#04080f90]" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, #04080f 80%)" }} />
      </div>

      {/* Enhanced glows */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,111,255,0.15) 0%, transparent 70%)", filter: "blur(80px)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)", filter: "blur(80px)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <Particles />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className="inline-block text-sm font-medium px-5 py-2 rounded-full mb-8 border shimmer-btn"
            style={{
              background: "rgba(124,111,255,0.12)",
              color: "#a89fff",
              borderColor: "rgba(124,111,255,0.35)",
            }}
            animate={{ boxShadow: ["0 0 20px rgba(124,111,255,0.1)", "0 0 30px rgba(124,111,255,0.25)", "0 0 20px rgba(124,111,255,0.1)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Websites That Generate Leads
          </motion.span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight"
        >
          <span className="text-gradient-white">
            <TypewriterText text="Professional Websites for Home Service Businesses" />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-lg sm:text-xl text-slate-300/90 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          We build high-converting, fast-loading websites that turn visitors
          into paying customers. Tailored for HVAC, plumbing, roofing, and
          every trade in between.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#results"
            whileHover={{ scale: 1.07, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative overflow-hidden font-semibold px-9 py-4 rounded-xl text-lg text-white shimmer-btn"
            style={{
              background: "linear-gradient(135deg, #7c6fff, #c165ff)",
              boxShadow: "0 0 40px rgba(124,111,255,0.4), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            See Our Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.07, y: -2, borderColor: "rgba(124,111,255,0.5)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="font-semibold px-9 py-4 rounded-xl text-lg text-white border backdrop-blur-md transition-all hover:bg-white/8"
            style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}
          >
            Book a Call
          </motion.a>
        </motion.div>

        {/* Trust bar with staggered reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-400"
        >
          {["50+ Sites Built", "2,500+ Leads Generated", "7-Day Delivery", "98% Client Retention"].map((item, i) => (
            <motion.span
              key={item}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.15, duration: 0.5 }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-electric inline-block"
                animate={{ boxShadow: ["0 0 4px #7c6fff", "0 0 12px #7c6fff", "0 0 4px #7c6fff"] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
    </section>
  );
}
