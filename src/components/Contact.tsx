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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
                <a href="tel:5138151826" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (513) 815-1826
                </a>
                <span className="hidden sm:block text-slate-700">|</span>
                <a href="mailto:ethanmillerinvestments@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  ethanmillerinvestments@gmail.com
                </a>
              </div>
            </form>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
