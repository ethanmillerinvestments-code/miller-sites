"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    name: "Mike Johnson",
    business: "Johnson HVAC Solutions",
    quote:
      "MillerSites built us a site that actually brings in calls. We went from maybe 5 leads a month to over 30. Best investment we've made in marketing.",
    stars: 5,
  },
  {
    name: "Sarah Williams",
    business: "Williams Plumbing Co",
    quote:
      "Our old site looked like it was from 2005. MillerSites gave us a modern, fast website and now we're the top result in our area. Couldn't be happier.",
    stars: 5,
  },
  {
    name: "David Chen",
    business: "Peak Roofing & Exteriors",
    quote:
      "The whole process was smooth. They understood our business from day one and delivered a website that makes us look like the biggest company in town.",
    stars: 5,
  },
  {
    name: "Lisa Martinez",
    business: "GreenScape Landscaping",
    quote:
      "I was skeptical about investing in a new website, but the results speak for themselves. We've doubled our revenue since launching with MillerSites.",
    stars: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 sm:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Trusted by <span className="text-electric">Business Owners</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative">
            <div className="bg-navy-light rounded-2xl p-8 sm:p-12 border border-white/5 min-h-[280px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="text-center w-full"
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: testimonials[current].stars }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-gold"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed italic">
                    &ldquo;{testimonials[current].quote}&rdquo;
                  </p>

                  <div>
                    <p className="font-semibold text-white">
                      {testimonials[current].name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {testimonials[current].business}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-electric/50 flex items-center justify-center transition-colors"
                aria-label="Previous testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current ? "bg-electric w-6" : "bg-white/20"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-electric/50 flex items-center justify-center transition-colors"
                aria-label="Next testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
