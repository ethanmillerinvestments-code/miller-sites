"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2500;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(update);
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
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.3), transparent)" }}
      />

      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,111,255,0.06) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="blur">
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Results
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Real Numbers, <span className="text-gradient">Real Growth</span>
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
            <ScrollReveal key={stat.label} delay={i * 0.1} direction="zoom">
              <motion.div
                className="bg-navy-light rounded-xl p-6 text-center border border-white/5 group hover:border-electric/20 transition-all relative overflow-hidden"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124,111,255,0.06) 0%, transparent 70%)" }}
                />
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
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
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Portfolio mockups */}
        <ScrollReveal direction="up">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
                tag: "HVAC",
                name: "Comfort Pro HVAC",
                result: "312% increase in monthly leads after redesign",
                badge: "+312% Leads",
              },
              {
                img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                tag: "Plumbing",
                name: "Elite Plumbing Co",
                result: "From zero online presence to 45 leads/month",
                badge: "0 → 45 leads/mo",
              },
            ].map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-navy-light rounded-xl overflow-hidden border border-white/5 group cursor-default hover:border-electric/20 transition-all relative"
              >
                <div className="aspect-video relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-light via-navy-light/30 to-transparent" />

                  {/* Shine sweep on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s ease-in-out",
                    }}
                  />

                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm"
                      style={{ background: "rgba(124,111,255,0.8)", color: "white" }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <motion.span
                      className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-500/90 text-white"
                      animate={{ boxShadow: ["0 0 8px rgba(34,197,94,0.3)", "0 0 16px rgba(34,197,94,0.5)", "0 0 8px rgba(34,197,94,0.3)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {item.badge}
                    </motion.span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-1 group-hover:text-electric transition-colors duration-300">{item.name}</h3>
                  <p className="text-slate-400 text-sm">{item.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
