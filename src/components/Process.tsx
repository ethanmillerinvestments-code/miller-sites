"use client";

import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn about your business, customers, and goals. You tell us what makes you different, and we build around that.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We create a custom design mockup based on your brand. You review it, request changes, and approve before we build.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We code your site with fast load times, mobile responsiveness, and SEO baked in from the start. No page builders.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "We deploy your site, set up analytics, and make sure everything is running perfectly. Then we keep it that way.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              From Zero to <span className="text-electric">Live</span> in 7 Days
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A simple, proven process that gets your site online fast
              without cutting corners.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-electric/50 via-electric to-electric/50" />

          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.15}>
              <div className="relative text-center">
                <div className="w-24 h-24 bg-navy rounded-full border-2 border-electric/30 flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-electric">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
