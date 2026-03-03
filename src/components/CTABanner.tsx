"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function CTABanner() {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,111,255,0.12) 0%, rgba(4,8,15,0.95) 40%, rgba(193,101,255,0.08) 100%)",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,111,255,0.15) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal direction="zoom">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Stop Losing Leads to a{" "}
            <span className="text-gradient">Bad Website</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Your competitors are getting the calls you should be getting. A professional,
            lead-optimized website changes that in under two weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.07, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="font-bold px-8 py-4 rounded-xl text-lg text-white shimmer-btn relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #7c6fff, #c165ff)",
                boxShadow: "0 0 40px rgba(124,111,255,0.4), 0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <span className="relative z-10">See Pricing</span>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.07, y: -2, borderColor: "rgba(124,111,255,0.6)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="font-bold px-8 py-4 rounded-xl text-lg text-white border-2 backdrop-blur-md transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}
            >
              Book a Free Call
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
