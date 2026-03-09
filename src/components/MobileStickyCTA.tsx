"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site";
import { useCart } from "@/store/cart";

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const packageFinderHref =
    pathname === "/" ? "#package-finder" : "/#package-finder";
  const { items, openCart } = useCart();
  const itemCount = items.length;

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 220);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          data-mobile-sticky-cta="true"
          className="fixed inset-x-4 bottom-4 z-50 sm:hidden"
        >
          <div className="lux-panel flex items-center gap-2 rounded-[1.35rem] px-3 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
            {itemCount > 0 ? (
              <button
                type="button"
                onClick={openCart}
                className="button-secondary min-h-11 flex-1 justify-center px-3 py-3 text-sm"
              >
                Cart ({itemCount})
              </button>
            ) : (
              <Link
                href={packageFinderHref}
                className="button-secondary min-h-11 flex-1 justify-center px-3 py-3 text-sm"
              >
                Find My Price
              </Link>
            )}
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="button-primary min-h-11 flex-[1.4] justify-center px-3 py-3 text-sm"
            >
              Book Strategy Call
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
