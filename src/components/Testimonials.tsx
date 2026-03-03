"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-navy relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.3), transparent)" }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="blur">
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Client Results
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Real Business Owners,{" "}
              <span className="text-gradient">Real Results</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every quote below comes from an actual client. No made-up stats, no stock photos.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative">
            <div
              className="rounded-2xl p-8 sm:p-12 border border-white/5 min-h-[320px] flex items-center relative overflow-hidden group"
              style={{ background: "linear-gradient(160deg, rgba(139,122,255,0.12), rgba(4,6,14,0.95))", boxShadow: "0 0 40px rgba(139,122,255,0.08), 0 4px 30px rgba(0,0,0,0.4)" }}
            >
              {/* Large quote mark decoration */}
              <div
                className="absolute top-6 left-8 text-8xl font-serif leading-none pointer-events-none select-none"
                style={{ color: "rgba(124,111,255,0.06)" }}
              >
                &ldquo;
              </div>

              {/* Subtle glow behind card */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124,111,255,0.04) 0%, transparent 70%)" }}
              />

              {/* Result badge */}
              <div className="absolute top-6 right-6 z-20">
                <motion.span
                  className="text-xs font-bold px-3 py-1.5 rounded-full text-white shimmer-btn"
                  style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)" }}
                  key={current}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.result}
                </motion.span>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full relative z-10"
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-5 h-5 text-gold"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 500 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>

                  <p className="text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)", boxShadow: "0 0 15px rgba(124,111,255,0.3)" }}
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
              <motion.button
                onClick={prev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-electric/50 hover:bg-white/5 flex items-center justify-center transition-all"
                aria-label="Previous testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1);
                      setCurrent(i);
                    }}
                    className="relative h-2 rounded-full transition-all overflow-hidden"
                    style={{ width: i === current ? 28 : 8 }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ background: i === current ? "linear-gradient(90deg, #7c6fff, #c165ff)" : "rgba(255,255,255,0.15)" }}
                    />
                    {i === current && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(90deg, #7c6fff, #c165ff)" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 7, ease: "linear" }}
                        key={current}
                      />
                    )}
                  </button>
                ))}
              </div>
              <motion.button
                onClick={next}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-electric/50 hover:bg-white/5 flex items-center justify-center transition-all"
                aria-label="Next testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
