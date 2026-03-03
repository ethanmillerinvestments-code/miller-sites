"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const industries = [
  { name: "HVAC", icon: "🌡️", detail: "Heating, cooling, and air quality" },
  { name: "Plumbing", icon: "🔧", detail: "Residential and commercial plumbers" },
  { name: "Roofing", icon: "🏠", detail: "Repair, replacement, and inspection" },
  { name: "Landscaping", icon: "🌿", detail: "Design, maintenance, and hardscaping" },
  { name: "Pressure Washing", icon: "💧", detail: "Residential driveways and commercial lots" },
  { name: "Electricians", icon: "⚡", detail: "Residential wiring and panel upgrades" },
  { name: "Clinics", icon: "🏥", detail: "Medical, dental, and wellness practices" },
  { name: "Painting", icon: "🎨", detail: "Interior and exterior painting crews" },
];

export default function Industries() {
  return (
    <section id="industries" className="py-24 sm:py-32 bg-navy relative">
      {/* Top separator line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="blur">
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Who We Serve
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Built for <span className="text-gradient">Home Service</span> Pros
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We specialize exclusively in home service businesses. That means
              we already understand your customers, your search terms, and
              exactly what it takes to get your phone ringing.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.name} delay={i * 0.06} direction={i < 4 ? "up" : "zoom"}>
              <motion.div
                whileHover={{ scale: 1.06, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-navy-light p-6 rounded-2xl border border-white/8 hover:border-electric/40 text-center cursor-default group transition-all overflow-hidden"
                style={{ boxShadow: "0 0 15px rgba(139,122,255,0.06), 0 4px 20px rgba(0,0,0,0.3)" }}
              >
                {/* Always-on glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "radial-gradient(ellipse at 50% 100%, rgba(139,122,255,0.1) 0%, transparent 70%)",
                  }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.3 }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="text-4xl mb-3 inline-block"
                    aria-hidden="true"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                    whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                  >
                    {ind.icon}
                  </motion.div>
                  <h3 className="font-bold text-white group-hover:text-electric transition-colors duration-300 mb-1">
                    {ind.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-snug">{ind.detail}</p>
                </div>

                {/* Bottom accent line - always on */}
                <motion.div
                  className="absolute bottom-0 left-1/4 right-1/4 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, #8b7aff, transparent)" }}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} direction="blur">
          <p className="text-center text-slate-500 text-sm mt-10">
            Don&apos;t see your trade?{" "}
            <a href="#contact" className="text-electric hover:underline">
              Reach out. We work with any local service business.
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
