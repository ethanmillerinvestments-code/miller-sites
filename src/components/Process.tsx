"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "We start with a 30-minute call to understand your business, service area, ideal customer, and top competitors. This is where we learn what makes you the best choice in your market so we can build your site around that.",
    detail: "30-min call",
  },
  {
    number: "02",
    title: "Design Mockup",
    description:
      "We create a full visual mockup of your homepage before writing a single line of code. You review it, give feedback, and approve it. Nothing gets built until you love the direction.",
    detail: "You approve first",
  },
  {
    number: "03",
    title: "Development",
    description:
      "We hand-code your site with sub-2-second load times, full mobile responsiveness, and on-page SEO built in from the ground up. No drag-and-drop builders. No bloated plugins. Clean, fast code that ranks.",
    detail: "Clean code only",
  },
  {
    number: "04",
    title: "Launch and Grow",
    description:
      "We deploy your site, connect Google Analytics and Google Search Console, verify your Google Business listing, and submit your sitemap. Then we send you a full handoff guide and stay available for questions.",
    detail: "Full setup included",
  },
];

function AnimatedConnectionLine() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <div ref={ref} className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px overflow-hidden">
      {/* Static base line */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(124,111,255,0.15)" }}
      />
      {/* Animated fill */}
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{
          background: "linear-gradient(90deg, #7c6fff, #c165ff, #7c6fff)",
        }}
        initial={{ width: "0%" }}
        animate={isInView ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {/* Moving dot */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{
          background: "#c165ff",
          boxShadow: "0 0 10px #c165ff, 0 0 20px rgba(193,101,255,0.5)",
        }}
        initial={{ left: "0%" }}
        animate={isInView ? { left: ["0%", "100%"] } : { left: "0%" }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
      />
    </div>
  );
}

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-navy-light/60 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="blur">
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Live in <span className="text-gradient">7 to 14 Days,</span> Done Right
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A tight, transparent process that keeps you informed at every step
              and gets your site online faster than any agency you have ever worked with.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <AnimatedConnectionLine />

          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.12} direction="up">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative text-center group"
              >
                {/* Step circle with pulse */}
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,111,255,0.15), rgba(193,101,255,0.1))",
                    border: "2px solid rgba(124,111,255,0.4)",
                  }}
                  whileHover={{
                    boxShadow: "0 0 30px rgba(124,111,255,0.3), 0 0 60px rgba(124,111,255,0.1)",
                    borderColor: "rgba(124,111,255,0.7)",
                  }}
                >
                  {/* Inner glow ring */}
                  <motion.div
                    className="absolute inset-1 rounded-full"
                    style={{ border: "1px solid rgba(124,111,255,0.15)" }}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <span className="text-2xl font-bold text-gradient">{step.number}</span>
                </motion.div>

                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ background: "rgba(124,111,255,0.1)", color: "#7c6fff" }}
                >
                  {step.detail}
                </span>
                <h3 className="text-xl font-bold mb-3 group-hover:text-electric transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
