"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 700);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="focus-lux fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(216,170,115,0.22)] bg-[rgba(18,19,24,0.88)] text-[color:var(--accent-strong)] shadow-[0_16px_36px_rgba(0,0,0,0.4)] backdrop-blur-md sm:bottom-6 sm:right-6"
          aria-label="Back to top"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
