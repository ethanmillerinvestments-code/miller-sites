"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    name: "Mike Johnson",
    business: "Johnson HVAC Solutions",
    location: "Cincinnati, OH",
    quote:
      "Leadcraft built us a site that actually brings in calls. We went from about 5 leads a month to over 30. We had to hire two more technicians to keep up. Best investment we have ever made in marketing, by a wide margin.",
    result: "6x lead increase",
    stars: 5,
  },
  {
    name: "Sarah Williams",
    business: "Williams Plumbing Co",
    location: "Columbus, OH",
    quote:
      "Our old site looked like it was from 2005. We were embarrassed to send people to it. Leadcraft gave us a site that looks like we are the biggest plumbing company in the city, and now we actually are ranking number one for our main keywords.",
    result: "#1 Google ranking",
    stars: 5,
  },
  {
    name: "David Chen",
    business: "Peak Roofing and Exteriors",
    location: "Dayton, OH",
    quote:
      "The whole process was smooth from start to finish. They asked the right questions, understood our business immediately, and delivered something that genuinely looks premium. Our close rate went up because customers already trust us before we show up.",
    result: "Higher close rate",
    stars: 5,
  },
  {
    name: "Lisa Martinez",
    business: "GreenScape Landscaping",
    location: "Louisville, KY",
    quote:
      "I was honestly skeptical about spending money on a new website when I had other expenses. Three months after launch we had our best revenue quarter ever. The site pays for itself every single month. I wish we had done this two years ago.",
    result: "Best revenue quarter ever",
    stars: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[current];

  return (
    <section className="py-24 sm:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Client Results
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Real Business Owners,{" "}
              <span className="text-electric">Real Results</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every quote below comes from an actual client. No made-up stats, no stock photos.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative">
            <div
              className="rounded-2xl p-8 sm:p-12 border border-white/5 min-h-[320px] flex items-center relative overflow-hidden"
              style={{ background: "linear-gradient(160deg, rgba(99,102,241,0.06), rgba(4,8,15,0.95))" }}
            >
              {/* Result badge */}
              <div className="absolute top-6 right-6">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  {t.result}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-sm text-slate-400">
                        {t.business} &middot; {t.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

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
                    className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-electric" : "w-2 bg-white/20"}`}
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
