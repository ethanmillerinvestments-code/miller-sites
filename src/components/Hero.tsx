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
    const colors = ["#8b7aff", "#00f0ff", "#d06fff", "#fbbf24", "#b8adff"];
    const isMobile = window.innerWidth < 768;
    setParticles(
      Array.from({ length: isMobile ? 20 : 60 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 1.5,
        delay: Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 3 + Math.random() * 5,
        drift: (Math.random() - 0.5) * 40,
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
            boxShadow: `0 0 ${p.size * 4}px ${p.color}80`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, p.drift, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
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
    }, 38);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="text-gradient"
          style={{ WebkitTextFillColor: "#8b7aff" }}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

function BrowserMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 4 }}
      transition={{ duration: 1.2, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden lg:block mt-16 mx-auto max-w-3xl perspective-[1200px]"
    >
      <motion.div
        className="rounded-xl overflow-hidden border border-white/10 relative"
        style={{
          boxShadow: "0 25px 60px rgba(124,111,255,0.15), 0 10px 30px rgba(0,0,0,0.5)",
          transform: "perspective(1200px) rotateX(4deg)",
        }}
        whileHover={{ rotateX: 0, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1424] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 mx-8">
            <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-slate-500 text-center truncate">
              comfortprohvac.com
            </div>
          </div>
        </div>
        {/* Site preview */}
        <div className="aspect-[16/9] relative bg-navy">
          <Image
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
            alt="Comfort Pro HVAC portfolio website preview"
            fill
            sizes="(max-width: 1024px) 0vw, 768px"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-24 rounded bg-white/20" />
              <div className="h-2 w-16 rounded bg-electric/30" />
            </div>
            <div className="h-3 w-48 rounded bg-white/10" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gamma AI-generated background image */}
      <div className="absolute inset-0">
        <Image
          src={GAMMA_HERO_IMG}
          alt="Professional website design for home service businesses by Leadcraft Agency"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060ecc] via-[#04060eaa] to-[#04060e]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060e80] via-transparent to-[#04060e80]" />
      </div>

      {/* CSS gradient mesh animation layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(124,111,255,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.12) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(168,85,247,0.15) 0%, transparent 50%)",
        }}
      />

      {/* BIG animated glows */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,122,255,0.3) 0%, transparent 60%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,240,255,0.25) 0%, transparent 60%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(208,111,255,0.2) 0%, transparent 60%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
            className="inline-block text-sm font-semibold px-6 py-2.5 rounded-full mb-8 border shimmer-btn"
            style={{
              background: "rgba(139,122,255,0.18)",
              color: "#b8adff",
              borderColor: "rgba(139,122,255,0.5)",
            }}
            animate={{
              boxShadow: ["0 0 20px rgba(139,122,255,0.2)", "0 0 40px rgba(139,122,255,0.5)", "0 0 20px rgba(139,122,255,0.2)"],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
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
          className="text-lg sm:text-xl text-slate-200/90 max-w-2xl mx-auto mb-12 leading-relaxed"
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
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <motion.a
            href="#results"
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative overflow-hidden font-bold px-10 py-4.5 rounded-xl text-lg text-white shimmer-btn"
            style={{
              background: "linear-gradient(135deg, #8b7aff, #d06fff)",
              boxShadow: "0 0 50px rgba(139,122,255,0.5), 0 0 100px rgba(139,122,255,0.2), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <span className="relative z-10">See Our Work</span>
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.08, y: -3, borderColor: "rgba(139,122,255,0.7)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="font-bold px-10 py-4.5 rounded-xl text-lg text-white border-2 backdrop-blur-md transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}
          >
            Book a Call
          </motion.a>
        </motion.div>

        {/* Browser Mockup */}
        <BrowserMockup />

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-300"
        >
          {["50+ Sites Built", "2,500+ Leads Generated", "7-Day Delivery", "98% Client Retention"].map((item, i) => (
            <motion.span
              key={item}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.15, duration: 0.5 }}
            >
              <motion.span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: "#8b7aff", boxShadow: "0 0 8px #8b7aff" }}
                animate={{ boxShadow: ["0 0 6px #8b7aff", "0 0 18px #8b7aff", "0 0 6px #8b7aff"], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#04060e] to-transparent pointer-events-none" />
    </section>
  );
}
