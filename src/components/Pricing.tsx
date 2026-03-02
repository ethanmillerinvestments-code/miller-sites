"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const tiers = [
  {
    name: "Starter",
    price: "$497",
    description: "Perfect for new businesses that need a professional online presence fast.",
    features: [
      "5-page custom website",
      "Mobile responsive",
      "Contact form + click-to-call",
      "Basic SEO setup",
      "Google Business integration",
      "1 round of revisions",
      "2-week delivery",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$997",
    description: "For businesses ready to dominate their local market with a lead-generating machine.",
    features: [
      "10-page custom website",
      "Advanced SEO optimization",
      "Lead capture system",
      "Review integration",
      "Speed optimization",
      "Analytics dashboard",
      "3 rounds of revisions",
      "10-day delivery",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$1,997",
    description: "The full package. Everything you need to be the top business in your area.",
    features: [
      "Unlimited pages",
      "Custom animations",
      "Blog / content system",
      "Booking system integration",
      "Priority support",
      "Monthly maintenance (3 mo)",
      "Competitor analysis",
      "Unlimited revisions",
      "7-day delivery",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Simple, <span className="text-electric">Transparent</span> Pricing
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              No hidden fees, no monthly contracts to start. Pick the plan
              that fits your business.
            </p>
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
                    ? "bg-gradient-to-b from-electric/10 to-navy border-2 border-electric shadow-lg shadow-electric/10"
                    : "bg-navy border border-white/5"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-slate-400 text-sm">one-time</span>
                  </div>
                  <p className="text-slate-400 text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <svg
                        className="w-5 h-5 text-electric shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                    tier.popular
                      ? "bg-electric hover:bg-electric-dark text-white shadow-lg shadow-electric/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  Get Started
                </a>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
