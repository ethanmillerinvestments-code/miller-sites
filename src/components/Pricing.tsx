"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const buildTiers = [
  {
    name: "Starter",
    price: "$797",
    note: "one-time",
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
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "$1,497",
    note: "one-time",
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
    cta: "Most Popular",
  },
  {
    name: "Premium",
    price: "$2,997",
    note: "one-time",
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
    cta: "Get Started",
  },
];

const retainerTiers = [
  {
    name: "Maintenance",
    price: "$97",
    note: "/month",
    description: "Keep your site fast, secure, and up to date.",
    features: [
      "Monthly content updates",
      "Security monitoring",
      "Speed optimization checks",
      "Uptime monitoring",
      "Priority email support",
    ],
    popular: false,
    cta: "Add On",
  },
  {
    name: "Growth Plan",
    price: "$297",
    note: "/month",
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
    cta: "Best Value",
  },
  {
    name: "Agency Partner",
    price: "$597",
    note: "/month",
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
    cta: "Let's Talk",
  },
];

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
              Pay once to build your site, then grow with a monthly plan.
              No hidden fees, no surprises.
            </p>

            {/* Toggle */}
            <div className="inline-flex bg-navy rounded-xl p-1 border border-white/5">
              <button
                onClick={() => setView("build")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  view === "build"
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                style={
                  view === "build"
                    ? { background: "linear-gradient(135deg, #6366f1, #a855f7)" }
                    : {}
                }
              >
                Website Build
              </button>
              <button
                onClick={() => setView("monthly")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  view === "monthly"
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                style={
                  view === "monthly"
                    ? { background: "linear-gradient(135deg, #6366f1, #a855f7)" }
                    : {}
                }
              >
                Monthly Plans
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 0.15}>
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative rounded-2xl p-8 h-full flex flex-col ${
                  tier.popular
                    ? "border-2 border-electric/50"
                    : "bg-navy border border-white/5"
                }`}
                style={
                  tier.popular
                    ? { background: "linear-gradient(160deg, rgba(99,102,241,0.12), rgba(4,8,15,0.9))" }
                    : {}
                }
              >
                {tier.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-sm font-semibold px-4 py-1 rounded-full"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                  >
                    {tier.cta}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-slate-400 text-sm">{tier.note}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <svg
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: "#6366f1" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                    tier.popular
                      ? "text-white"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                  style={
                    tier.popular
                      ? { background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }
                      : {}
                  }
                >
                  Get Started
                </motion.a>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {view === "build" && (
          <ScrollReveal delay={0.3}>
            <p className="text-center text-slate-400 text-sm mt-8">
              Add a monthly plan after launch and save 20%.{" "}
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
