"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-navy relative overflow-hidden">
      {/* Background accents with animation */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,111,255,0.08) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.3), transparent)" }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="blur">
          <div className="text-center mb-12">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Ready to <span className="text-gradient">Grow</span> Your Business?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Book a free consultation and we&apos;ll show you exactly how we can
              help you get more leads online.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="up">
          <motion.div
            className="bg-navy-light rounded-2xl p-8 sm:p-12 border border-white/5 hover:border-white/8 transition-all duration-500 relative overflow-hidden"
          >
            {/* Corner glow */}
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,111,255,0.06) 0%, transparent 70%)" }}
            />

            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-electric transition-colors">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3.5 bg-navy border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-electric/60 focus:ring-2 focus:ring-electric/20 outline-none transition-all duration-300"
                    placeholder="John Smith"
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-electric transition-colors">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3.5 bg-navy border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-electric/60 focus:ring-2 focus:ring-electric/20 outline-none transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="business" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-electric transition-colors">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="business"
                    className="w-full px-4 py-3.5 bg-navy border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-electric/60 focus:ring-2 focus:ring-electric/20 outline-none transition-all duration-300"
                    placeholder="Smith HVAC"
                  />
                </div>
                <div className="group">
                  <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-electric transition-colors">
                    Industry
                  </label>
                  <select
                    id="industry"
                    className="w-full px-4 py-3.5 bg-navy border border-white/10 rounded-xl text-white focus:border-electric/60 focus:ring-2 focus:ring-electric/20 outline-none transition-all duration-300"
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

              <div className="group">
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-electric transition-colors">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3.5 bg-navy border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-electric/60 focus:ring-2 focus:ring-electric/20 outline-none transition-all duration-300 resize-none"
                  placeholder="What are you looking for? Current website URL, goals, timeline..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-full font-semibold py-4 rounded-xl text-lg text-white shimmer-btn relative overflow-hidden transition-all"
                style={{
                  background: "linear-gradient(135deg, #7c6fff, #c165ff)",
                  boxShadow: "0 0 30px rgba(124,111,255,0.3), 0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <span className="relative z-10">Send Message</span>
              </motion.button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
                <motion.a
                  href="tel:5138151826"
                  className="flex items-center gap-2 hover:text-electric transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-4 h-4 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (513) 815-1826
                </motion.a>
                <span className="hidden sm:block text-slate-700">|</span>
                <motion.a
                  href="mailto:ethanmillerinvestments@gmail.com"
                  className="flex items-center gap-2 hover:text-electric transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-4 h-4 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  ethanmillerinvestments@gmail.com
                </motion.a>
              </div>
            </form>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
