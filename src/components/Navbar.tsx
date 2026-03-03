"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";

const pricingDropdown = {
  build: [
    { name: "Starter", price: "$797", href: "#pricing" },
    { name: "Growth", price: "$1,497", href: "#pricing", popular: true },
    { name: "Premium", price: "$2,997", href: "#pricing" },
  ],
  monthly: [
    { name: "Maintenance", price: "$97/mo", href: "#pricing" },
    { name: "Growth Plan", price: "$297/mo", href: "#pricing", popular: true },
    { name: "Agency Partner", price: "$597/mo", href: "#pricing" },
  ],
};

const servicesDropdown = [
  { name: "Website Design", desc: "Custom, conversion-focused builds", icon: "✦" },
  { name: "Local SEO", desc: "Dominate your city on Google", icon: "◈" },
  { name: "Lead Generation", desc: "Forms, funnels, and CRM setup", icon: "⬡" },
  { name: "Maintenance", desc: "Speed, security, and updates", icon: "◎" },
];

function PricingDropdown({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(10,15,28,0.97)", backdropFilter: "blur(20px)", boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,111,255,0.1)" }}
    >
      <div className="p-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Website Build</p>
          {pricingDropdown.build.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium group-hover:text-electric transition-colors">{item.name}</span>
                {item.popular && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "rgba(124,111,255,0.2)", color: "#a89fff" }}>
                    Popular
                  </span>
                )}
              </div>
              <span className="text-slate-400 text-sm font-semibold group-hover:text-electric transition-colors">{item.price}</span>
            </a>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Monthly Plans</p>
          {pricingDropdown.monthly.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium group-hover:text-electric transition-colors">{item.name}</span>
                {item.popular && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "rgba(124,111,255,0.2)", color: "#a89fff" }}>
                    Popular
                  </span>
                )}
              </div>
              <span className="text-slate-400 text-sm font-semibold group-hover:text-electric transition-colors">{item.price}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">Bundle a build + monthly and save 20%</p>
        <a href="#pricing" onClick={onClose} className="text-xs font-semibold text-electric hover:underline">
          See all plans →
        </a>
      </div>
    </motion.div>
  );
}

function ServicesDropdown({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(10,15,28,0.97)", backdropFilter: "blur(20px)", boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,111,255,0.1)" }}
    >
      <div className="p-3">
        {servicesDropdown.map((s) => (
          <a
            key={s.name}
            href="#services"
            onClick={onClose}
            className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
          >
            <span className="text-electric text-lg mt-0.5 leading-none group-hover:scale-110 transition-transform inline-block">{s.icon}</span>
            <div>
              <p className="text-white text-sm font-medium group-hover:text-electric transition-colors">{s.name}</p>
              <p className="text-slate-500 text-xs">{s.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

function NavDropdownLink({
  label,
  href,
  dropdown,
}: {
  label: string;
  href: string;
  dropdown?: "pricing" | "services";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  if (!dropdown) {
    return (
      <a href={href} className="text-sm text-slate-300 hover:text-white transition-colors relative group">
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-electric group-hover:w-full transition-all duration-300" />
      </a>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors group">
        {label}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-3.5 h-3.5 text-slate-500 group-hover:text-electric transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          dropdown === "pricing"
            ? <PricingDropdown onClose={() => setOpen(false)} />
            : <ServicesDropdown onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, openCart } = useCart();

  // Close mobile menu on scroll
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (mobileOpen) closeMobile();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen, closeMobile]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-navy/85 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-navy/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0"
                style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)", boxShadow: "0 0 20px rgba(124,111,255,0.4)" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                LC
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Lead<span className="text-gradient">craft</span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-slate-500 hidden sm:block">
                  Agency
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              <NavDropdownLink label="Services" href="#services" dropdown="services" />
              <a href="#industries" className="text-sm text-slate-300 hover:text-white transition-colors relative group">
                Industries
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-electric group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#process" className="text-sm text-slate-300 hover:text-white transition-colors relative group">
                Process
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-electric group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#results" className="text-sm text-slate-300 hover:text-white transition-colors relative group">
                Results
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-electric group-hover:w-full transition-all duration-300" />
              </a>
              <NavDropdownLink label="Pricing" href="#pricing" dropdown="pricing" />
              <a href="#faq" className="text-sm text-slate-300 hover:text-white transition-colors relative group">
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-electric group-hover:w-full transition-all duration-300" />
              </a>

              {/* Cart */}
              <motion.button
                onClick={openCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:border-electric/40 hover:bg-white/5 transition-all"
                aria-label="Open cart"
              >
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <AnimatePresence>
                  {items.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)", boxShadow: "0 0 10px rgba(124,111,255,0.5)" }}
                    >
                      {items.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="text-white text-sm font-semibold px-5 py-2.5 rounded-lg shimmer-btn relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)", boxShadow: "0 0 25px rgba(124,111,255,0.35)" }}
              >
                <span className="relative z-10">Get Started</span>
              </motion.a>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-white/10"
                aria-label="Open cart"
              >
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {items.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: "#7c6fff" }}
                  >
                    {items.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-white p-2"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden border-t border-white/5 overflow-hidden"
              style={{ background: "rgba(10,15,28,0.97)", backdropFilter: "blur(20px)" }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {/* Services with sub-items */}
                <div>
                  <a
                    href="#services"
                    onClick={closeMobile}
                    className="text-slate-300 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-white/5 block font-medium"
                  >
                    Services
                  </a>
                  <div className="pl-6 flex flex-col gap-0.5">
                    {servicesDropdown.map((s) => (
                      <a
                        key={s.name}
                        href="#services"
                        onClick={closeMobile}
                        className="text-slate-500 hover:text-slate-300 text-sm py-1.5 px-3 rounded-lg hover:bg-white/5 flex items-center gap-2"
                      >
                        <span className="text-electric text-xs">{s.icon}</span>
                        {s.name}
                      </a>
                    ))}
                  </div>
                </div>

                {[
                  { label: "Industries", href: "#industries" },
                  { label: "Process", href: "#process" },
                  { label: "Results", href: "#results" },
                ].map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="text-slate-300 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-white/5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Pricing with sub-items */}
                <div>
                  <a
                    href="#pricing"
                    onClick={closeMobile}
                    className="text-slate-300 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-white/5 block font-medium"
                  >
                    Pricing
                  </a>
                  <div className="pl-6 flex flex-col gap-0.5">
                    {[...pricingDropdown.build, ...pricingDropdown.monthly].map((p) => (
                      <a
                        key={p.name}
                        href="#pricing"
                        onClick={closeMobile}
                        className="text-slate-500 hover:text-slate-300 text-sm py-1.5 px-3 rounded-lg hover:bg-white/5 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          {p.name}
                          {p.popular && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,111,255,0.2)", color: "#a89fff" }}>
                              Popular
                            </span>
                          )}
                        </span>
                        <span className="text-slate-600 text-xs">{p.price}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <motion.a
                  href="#faq"
                  onClick={closeMobile}
                  className="text-slate-300 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-white/5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  FAQ
                </motion.a>

                <motion.a
                  href="#contact"
                  onClick={closeMobile}
                  className="text-white font-semibold px-5 py-3 rounded-lg transition-colors text-center mt-2 shimmer-btn relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="relative z-10">Get Started</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
