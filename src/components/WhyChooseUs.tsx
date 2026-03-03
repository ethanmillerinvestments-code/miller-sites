"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(update);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const pillars = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Custom Code, Not Page Builders",
    description: "Every line is hand-written. No WordPress, no Wix, no Squarespace. You get a fast, lightweight site you actually own.",
    stat: 100,
    statSuffix: "%",
    statLabel: "Custom Code",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "7-Day Delivery",
    description: "Most agencies take months. We scope, design, build, and deploy your site in one week or less.",
    stat: 7,
    statSuffix: " days",
    statLabel: "Average Delivery",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "You Own Everything",
    description: "Full source code on GitHub, deployed on your Vercel account. Cancel anytime and keep everything.",
    stat: 0,
    statSuffix: "",
    statLabel: "Lock-in Contracts",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Local SEO Built In",
    description: "Schema markup, optimized meta tags, Google Business setup, and citation-ready structure from day one.",
    stat: 90,
    statSuffix: "+",
    statLabel: "Lighthouse SEO",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 sm:py-32 bg-navy relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.3), transparent)" }}
      />
      <motion.div
        className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,111,255,0.05) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="blur">
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Why Leadcraft
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              What Makes Us{" "}
              <span className="text-gradient">Different</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We are not a template factory. Every project is built from scratch, delivered fast,
              and optimized to generate real business.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={i * 0.1} direction="up">
              <motion.div
                whileHover={{ scale: 1.04, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-navy-light p-6 rounded-2xl border border-white/8 hover:border-electric/40 transition-all group h-full flex flex-col overflow-hidden"
                style={{ boxShadow: "0 0 20px rgba(139,122,255,0.06), 0 4px 20px rgba(0,0,0,0.3)" }}
              >
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,122,255,0.08) 0%, transparent 60%)" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(139,122,255,0.15)", color: "#b8adff" }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    {pillar.icon}
                  </motion.div>

                  {/* Stat */}
                  <div className="text-2xl font-bold text-gradient mb-1">
                    <Counter target={pillar.stat} suffix={pillar.statSuffix} />
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{pillar.statLabel}</p>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-electric transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
