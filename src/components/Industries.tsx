"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const industries = [
  {
    name: "HVAC",
    icon: "🌡️",
    detail: "Heating, cooling, and air quality",
  },
  {
    name: "Plumbing",
    icon: "🔧",
    detail: "Residential and commercial plumbers",
  },
  {
    name: "Roofing",
    icon: "🏠",
    detail: "Repair, replacement, and inspection",
  },
  {
    name: "Landscaping",
    icon: "🌿",
    detail: "Design, maintenance, and hardscaping",
  },
  {
    name: "Pressure Washing",
    icon: "💧",
    detail: "Residential driveways and commercial lots",
  },
  {
    name: "Electricians",
    icon: "⚡",
    detail: "Residential wiring and panel upgrades",
  },
  {
    name: "Clinics",
    icon: "🏥",
    detail: "Medical, dental, and wellness practices",
  },
  {
    name: "Painting",
    icon: "🎨",
    detail: "Interior and exterior painting crews",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="py-24 sm:py-32 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Who We Serve
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Built for <span className="text-electric">Home Service</span> Pros
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
            <ScrollReveal key={ind.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-navy-light p-6 rounded-2xl border border-white/5 hover:border-electric/30 text-center cursor-default group transition-all"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {ind.icon}
                </div>
                <h3 className="font-bold text-white group-hover:text-electric transition-colors mb-1">
                  {ind.name}
                </h3>
                <p className="text-slate-500 text-xs leading-snug">{ind.detail}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
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
