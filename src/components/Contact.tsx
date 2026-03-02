"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-navy relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Ready to <span className="text-electric">Grow</span> Your Business?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Book a free consultation and we&apos;ll show you exactly how we can
              help you get more leads online.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-navy-light rounded-2xl p-8 sm:p-12 border border-white/5"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="business" className="block text-sm font-medium text-slate-300 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="business"
                    className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-colors"
                    placeholder="Smith HVAC"
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-white focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-colors"
                  >
                    <option value="">Select your industry</option>
                    <option value="hvac">HVAC</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="roofing">Roofing</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="pressure-washing">Pressure Washing</option>
                    <option value="electrical">Electrical</option>
                    <option value="clinic">Clinic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-colors resize-none"
                  placeholder="What are you looking for? Current website URL, goals, timeline..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-electric hover:bg-electric-dark text-white font-semibold py-4 rounded-lg text-lg transition-all hover:shadow-lg hover:shadow-electric/25"
              >
                Send Message
              </button>

              <p className="text-center text-slate-500 text-sm">
                Or email us directly at{" "}
                <a
                  href="mailto:ethanmillerinvestments@gmail.com"
                  className="text-electric hover:underline"
                >
                  ethanmillerinvestments@gmail.com
                </a>
              </p>
            </form>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
