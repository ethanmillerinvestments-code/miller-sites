"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

export default function ScrollDepthCTA() {
  const [visible, setVisible] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("scroll-cta-dismissed")) return;

    const pricing = document.getElementById("pricing");
    if (!pricing) return;

    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && !dismissed.current) {
          timer = setTimeout(() => {
            if (!dismissed.current) setVisible(true);
          }, 30000);
        }
      },
      { threshold: 0 }
    );

    observer.observe(pricing);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  const dismiss = () => {
    setVisible(false);
    dismissed.current = true;
    sessionStorage.setItem("scroll-cta-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 lux-panel rounded-2xl px-5 py-4 flex items-center gap-3"
        >
          <p className="text-sm flex-1">
            Still deciding? The{" "}
            <Link href="/#package-finder" className="text-[var(--accent)] underline underline-offset-2" onClick={dismiss}>
              4-question quiz
            </Link>{" "}
            takes less than a minute.
          </p>
          <button onClick={dismiss} className="text-[var(--muted)] hover:text-[var(--copy)] transition-colors p-1" aria-label="Dismiss">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
