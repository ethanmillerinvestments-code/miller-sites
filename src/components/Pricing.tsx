"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useCart, CartItem } from "@/store/cart";

const buildTiers: (CartItem & { features: string[]; popular: boolean; priceLabel: string; icon: string; badge?: string })[] = [
  {
    id: "build-starter",
    name: "Starter",
    price: 797,
    priceLabel: "$797",
    type: "one-time",
    icon: "⚡",
    description: "Perfect for new businesses that need a professional online presence fast.",
    features: [
      "5-page custom website",
      "Mobile responsive",
      "Contact form + click-to-call",
      "Basic on-page SEO",
      "Google Business setup",
      "Speed optimized",
      "1 revision round",
      "14-day delivery",
    ],
    popular: false,
  },
  {
    id: "build-growth",
    name: "Growth",
    price: 1497,
    priceLabel: "$1,497",
    type: "one-time",
    icon: "🚀",
    badge: "Most Popular",
    description: "For businesses ready to dominate their local market and generate consistent leads.",
    features: [
      "10-page custom website",
      "Advanced local SEO",
      "Lead capture + CRM integration",
      "Google Reviews widget",
      "Before/after gallery",
      "Analytics dashboard setup",
      "Blog-ready structure",
      "3 revision rounds",
      "10-day delivery",
    ],
    popular: true,
  },
  {
    id: "build-premium",
    name: "Premium",
    price: 2997,
    priceLabel: "$2,997",
    type: "one-time",
    icon: "👑",
    description: "The full package for established businesses that want to be the #1 result in their market.",
    features: [
      "Unlimited pages",
      "Custom animations + micro-interactions",
      "Online booking system",
      "Client portal",
      "Competitor analysis",
      "Full SEO audit + strategy",
      "Google Ads landing page",
      "Unlimited revisions",
      "7-day delivery",
    ],
    popular: false,
  },
];

const retainerTiers: (CartItem & { features: string[]; popular: boolean; priceLabel: string; icon: string; badge?: string })[] = [
  {
    id: "monthly-maintenance",
    name: "Maintenance",
    price: 97,
    priceLabel: "$97",
    type: "monthly",
    icon: "🛡️",
    description: "Keep your site fast, secure, and up to date every month.",
    features: [
      "Monthly content updates",
      "Security monitoring",
      "Speed optimization checks",
      "Uptime monitoring",
      "Priority email support",
    ],
    popular: false,
  },
  {
    id: "monthly-growth",
    name: "Growth Plan",
    price: 297,
    priceLabel: "$297",
    type: "monthly",
    icon: "📈",
    badge: "Best Value",
    description: "Ongoing SEO and lead generation to grow your rankings every month.",
    features: [
      "Everything in Maintenance",
      "2x monthly blog posts",
      "Local SEO optimization",
      "Google Business management",
      "Monthly performance report",
      "Backlink building",
    ],
    popular: true,
  },
  {
    id: "monthly-agency",
    name: "Agency Partner",
    price: 597,
    priceLabel: "$597",
    type: "monthly",
    icon: "🏆",
    description: "Full-service digital marketing partner for businesses scaling fast.",
    features: [
      "Everything in Growth Plan",
      "Google Ads management",
      "Landing page A/B testing",
      "Lead tracking dashboard",
      "Monthly strategy call",
      "Social proof automation",
    ],
    popular: false,
  },
];

function AddToCartButton({ tier }: { tier: CartItem }) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.id === tier.id);

  return (
    <motion.button
      onClick={() => addItem(tier)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400 }}
      className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
      style={
        inCart
          ? { background: "rgba(124,111,255,0.12)", color: "#a89fff", border: "1px solid rgba(124,111,255,0.35)" }
          : tier.type === "monthly"
          ? { background: "linear-gradient(135deg, #7c6fff, #c165ff)", color: "white", boxShadow: "0 0 24px rgba(124,111,255,0.35)" }
          : { background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.12)" }
      }
    >
      {inCart ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </>
      )}
    </motion.button>
  );
}

export default function Pricing() {
  const [view, setView] = useState<"build" | "monthly">("build");
  const tiers = view === "build" ? buildTiers : retainerTiers;

  return (
    <section id="pricing" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,111,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(124,111,255,0.12)", color: "#a89fff", border: "1px solid rgba(124,111,255,0.25)" }}
            >
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 mb-4 tracking-tight">
              Simple,{" "}
              <span style={{ background: "linear-gradient(90deg, #7c6fff, #c165ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Transparent
              </span>{" "}
              Pricing
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base mb-10">
              Pick a build plan, add a monthly plan, and check out in seconds.
            </p>

            {/* Fancy toggle */}
            <div
              className="inline-flex rounded-2xl p-1.5 gap-1 relative"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
            >
              {(["build", "monthly"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  className="relative px-7 py-2.5 rounded-xl text-sm font-semibold transition-colors z-10"
                  style={{ color: view === tab ? "white" : "#64748b" }}
                >
                  {view === tab && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)", boxShadow: "0 0 20px rgba(124,111,255,0.4)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab === "build" ? "Website Build" : "Monthly Plans"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -6 }}
                className="relative rounded-2xl flex flex-col overflow-hidden"
                style={
                  tier.popular
                    ? {
                        background: "linear-gradient(160deg, rgba(124,111,255,0.15) 0%, rgba(6,9,30,0.95) 60%)",
                        border: "1.5px solid rgba(124,111,255,0.45)",
                        boxShadow: "0 0 40px rgba(124,111,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }
                    : {
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                      }
                }
              >
                {/* Popular glow beam */}
                {tier.popular && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.8), transparent)" }}
                  />
                )}

                {/* Badge */}
                {tier.badge && (
                  <div className="absolute top-4 right-4">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                      style={{ background: "linear-gradient(135deg, #7c6fff, #c165ff)", color: "white" }}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={
                        tier.popular
                          ? { background: "linear-gradient(135deg, rgba(124,111,255,0.3), rgba(193,101,255,0.2))", border: "1px solid rgba(124,111,255,0.4)" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
                      }
                    >
                      {tier.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{tier.name}</h3>
                      <p className="text-xs text-slate-500">{tier.type === "monthly" ? "per month" : "one-time"}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    <span
                      className="text-4xl font-black tracking-tight"
                      style={
                        tier.popular
                          ? { background: "linear-gradient(135deg, #7c6fff, #c165ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
                          : { color: "white" }
                      }
                    >
                      {tier.priceLabel}
                    </span>
                  </div>

                  {tier.type === "one-time" && (
                    <p className="text-[11px] text-slate-600 mb-3">You manage hosting + domain. No ongoing fees to us.</p>
                  )}

                  <p className="text-slate-400 text-xs leading-relaxed mb-5">{tier.description}</p>

                  {/* Divider */}
                  <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.05)" }} />

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: "rgba(124,111,255,0.2)" }}
                        >
                          <svg className="w-2.5 h-2.5" style={{ color: "#a89fff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <AddToCartButton tier={tier} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {view === "build" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-slate-500 text-sm mt-8"
          >
            Want us to handle hosting, updates, and support?{" "}
            <button onClick={() => setView("monthly")} className="font-semibold hover:underline" style={{ color: "#a89fff" }}>
              View monthly plans →
            </button>
          </motion.p>
        )}
      </div>
    </section>
  );
}
