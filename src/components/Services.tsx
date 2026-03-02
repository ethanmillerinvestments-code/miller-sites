"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const services = [
  {
    title: "Website Design",
    description:
      "Hand-coded, mobile-first websites built specifically to convert visitors into booked jobs. No page builders, no recycled templates. Every layout, color choice, and call-to-action is engineered around how your customers decide to hire.",
    badge: "Core Service",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Local SEO",
    description:
      "We get your business to the top of Google searches in your city. Technical SEO, Google Business optimization, citation building, schema markup, and keyword targeting so customers searching for your service find you before they find anyone else.",
    badge: "High ROI",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Lead Generation",
    description:
      "Every site we build ships with click-to-call buttons, intelligent contact forms, review funnels, and real-time lead tracking. We measure every visitor action and optimize continuously so your cost per lead drops over time, not up.",
    badge: "Measurable",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Ongoing Maintenance",
    description:
      "Your site stays fast, secure, and ranking every single month. We handle uptime monitoring, security patches, speed optimizations, content updates, and Google algorithm changes so you never have to worry about your website again.",
    badge: "Hands-Off",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-navy-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Everything You Need to{" "}
              <span className="text-electric">Win Online</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              From the first design mockup to a fully deployed, lead-generating website,
              we handle every piece so you can stay focused on your business.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.04, y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative bg-navy p-7 rounded-2xl border border-white/5 hover:border-electric/30 transition-all group cursor-default h-full flex flex-col"
                style={{ boxShadow: "0 0 0 0 rgba(99,102,241,0)" }}
                whileInView={{ boxShadow: "0 4px 32px rgba(0,0,0,0.3)" }}
              >
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                    {service.badge}
                  </span>
                </div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  {service.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
