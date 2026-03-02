"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Sites Built", value: 50, suffix: "+" },
  { label: "Leads Generated", value: 2500, suffix: "+" },
  { label: "Avg. Load Time", value: 1.2, suffix: "s" },
  { label: "Client Retention", value: 98, suffix: "%" },
];

export default function Results() {
  return (
    <section id="results" className="py-24 sm:py-32 bg-navy relative overflow-hidden">
      {/* Parallax background element */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-electric/5 to-transparent pointer-events-none"
        style={{ y: 0 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Results
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Real Numbers, <span className="text-electric">Real Growth</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We measure success by the leads we generate and the revenue
              we help our clients earn.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="bg-navy-light rounded-xl p-6 text-center border border-white/5">
                <div className="text-3xl sm:text-4xl font-bold text-electric mb-2">
                  {stat.suffix === "s" ? (
                    <span>
                      {stat.value}
                      {stat.suffix}
                    </span>
                  ) : (
                    <Counter target={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Portfolio mockups */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-navy-light rounded-xl overflow-hidden border border-white/5 group"
            >
              <div className="aspect-video bg-gradient-to-br from-navy-lighter to-navy flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3 opacity-30">🏠</div>
                  <p className="text-slate-500 text-sm">HVAC Company Website</p>
                  <p className="text-electric text-xs mt-1">Before &amp; After</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-1">Comfort Pro HVAC</h3>
                <p className="text-slate-400 text-sm">
                  312% increase in monthly leads after redesign
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-navy-light rounded-xl overflow-hidden border border-white/5 group"
            >
              <div className="aspect-video bg-gradient-to-br from-navy-lighter to-navy flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3 opacity-30">🔧</div>
                  <p className="text-slate-500 text-sm">Plumbing Company Website</p>
                  <p className="text-electric text-xs mt-1">Before &amp; After</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-1">Elite Plumbing Co</h3>
                <p className="text-slate-400 text-sm">
                  From zero online presence to 45 leads/month
                </p>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
