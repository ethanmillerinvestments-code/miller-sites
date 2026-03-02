"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useCart, CartItem } from "@/store/cart";

const buildTiers: (CartItem & { features: string[]; popular: boolean; priceLabel: string })[] = [
  {
    id: "build-starter",
    name: "Starter",
    price: 797,
    priceLabel: "$797",
    type: "one-time",
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

const retainerTiers: (CartItem & { features: string[]; popular: boolean; priceLabel: string })[] = [
  {
    id: "monthly-maintenance",
    name: "Maintenance",
    price: 97,
    priceLabel: "$97",
    type: "monthly",
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400 }}
      className="w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
      style={
        inCart
          ? { background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.4)" }
          : tier.type === "monthly"
          ? { background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white", boxShadow: "0 0 20px rgba(99,102,241,0.25)" }
          : { background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }
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
    <section id="pricing" className="py-24 sm:py-32 bg-navy-light/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Simple, <span className="text-electric">Transparent</span> Pricing
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
              Pick a build plan, add a monthly plan, and check out in seconds.
            </p>

            {/* Toggle */}
            <div className="inline-flex bg-navy rounded-xl p-1 border border-white/5">
              <button
                onClick={() => setView("build")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  view === "build" ? "text-white" : "text-slate-400 hover:text-white"
                }`}
                style={view === "build" ? { background: "linear-gradient(135deg, #6366f1, #a855f7)" } : {}}
              >
                Website Build
              </button>
              <button
                onClick={() => setView("monthly")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  view === "monthly" ? "text-white" : "text-slate-400 hover:text-white"
                }`}
                style={view === "monthly" ? { background: "linear-gradient(135deg, #6366f1, #a855f7)" } : {}}
              >
                Monthly Plans
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.id} delay={i * 0.15}>
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative rounded-2xl p-8 h-full flex flex-col ${
                  tier.popular ? "border-2 border-electric/50" : "bg-navy border border-white/5"
                }`}
                style={tier.popular ? { background: "linear-gradient(160deg, rgba(99,102,241,0.12), rgba(4,8,15,0.9))" } : {}}
              >
                {tier.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-sm font-semibold px-4 py-1 rounded-full"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold text-white">{tier.priceLabel}</span>
                    <span className="text-slate-400 text-sm">
                      {tier.type === "monthly" ? "/month" : "one-time"}
                    </span>
                  </div>
                  {tier.type === "one-time" && (
                    <p className="text-xs text-slate-500 mb-3">You manage hosting + domain. No ongoing fees to us.</p>
                  )}
                  <p className="text-slate-400 text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#6366f1" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <AddToCartButton tier={tier} />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {view === "build" && (
          <ScrollReveal delay={0.3}>
            <p className="text-center text-slate-400 text-sm mt-8">
              Want us to handle hosting, updates, and support?{" "}
              <button onClick={() => setView("monthly")} className="text-electric hover:underline">
                View monthly plans →
              </button>
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
