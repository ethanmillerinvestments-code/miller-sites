"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ClientProductStickyCTAProps = {
  eyebrow?: string;
  primaryHref: string;
  primaryLabel?: string;
  secondaryHref: string;
  secondaryLabel?: string;
  tertiaryHref: string;
  tertiaryLabel?: string;
};

export default function ClientProductStickyCTA({
  eyebrow = "Concept Demo CTA Lane",
  primaryHref,
  primaryLabel = "Inspect",
  secondaryHref,
  secondaryLabel = "Estimate",
  tertiaryHref,
  tertiaryLabel = "Call Now",
}: ClientProductStickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 180);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={
            reduceMotion
              ? { duration: 0.16 }
              : { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }
          }
          className="fixed inset-x-4 bottom-4 z-50 pb-[env(safe-area-inset-bottom)] sm:hidden"
        >
          <div className="rounded-[1.4rem] border border-[rgba(240,179,93,0.2)] bg-[rgba(10,12,17,0.92)] p-3 shadow-[0_22px_52px_rgba(0,0,0,0.46)] backdrop-blur-xl">
            <p className="px-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#d7d3cb]">
              {eyebrow}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <a
                href={primaryHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f0b35d,#d7d3cb)] px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#18120b] transition-[transform,filter] duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b35d] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,12,17,0.92)]"
              >
                {primaryLabel}
              </a>
              <a
                href={secondaryHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-stone-100 transition-colors duration-200 hover:border-[rgba(240,179,93,0.3)] hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b35d] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,12,17,0.92)]"
              >
                {secondaryLabel}
              </a>
              <a
                href={tertiaryHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(240,179,93,0.22)] bg-[rgba(240,179,93,0.1)] px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#f5efe6] transition-colors duration-200 hover:border-[rgba(240,179,93,0.4)] hover:bg-[rgba(240,179,93,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b35d] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,12,17,0.92)]"
              >
                {tertiaryLabel}
              </a>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
