"use client";

import { motion } from "framer-motion";
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

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-navy-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Live in <span className="text-electric">7 to 14 Days,</span> Done Right
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A tight, transparent process that keeps you informed at every step
              and gets your site online faster than any agency you have ever worked with.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), #6366f1, rgba(99,102,241,0.3))" }} />

          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative text-center"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
                    border: "2px solid rgba(99,102,241,0.4)",
                  }}
                >
                  <span className="text-2xl font-bold" style={{ color: "#818cf8" }}>
                    {step.number}
                  </span>
                </div>
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                  {step.detail}
                </span>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
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
