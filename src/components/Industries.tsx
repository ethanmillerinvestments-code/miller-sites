"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const industries = [
  { name: "HVAC", icon: "🌡️" },
  { name: "Plumbing", icon: "🔧" },
  { name: "Roofing", icon: "🏠" },
  { name: "Landscaping", icon: "🌿" },
  { name: "Pressure Washing", icon: "💧" },
  { name: "Electricians", icon: "⚡" },
  { name: "Clinics", icon: "🏥" },
  { name: "Painting", icon: "🎨" },
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
              We know your industry. Every site we build is tailored to how
              your customers search and buy.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-navy-light p-6 rounded-xl border border-white/5 hover:border-electric/30 text-center cursor-default group transition-colors"
              >
                <div className="text-4xl mb-3">{ind.icon}</div>
                <h3 className="font-semibold text-white group-hover:text-electric transition-colors">
                  {ind.name}
                </h3>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
