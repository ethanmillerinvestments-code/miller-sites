"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    question: "How long does it take to build my website?",
    answer:
      "Most projects are delivered within 7 to 14 days from the date you approve the design mockup. The Starter plan typically takes 10 to 14 days. Growth and Premium projects run 7 to 10 days because we allocate more resources. We move fast, but we never rush at the cost of quality. Every site goes through a full quality check before it launches.",
  },
  {
    question: "Do I need to provide content, copy, or photos?",
    answer:
      "No. We write all of your website copy based on a short intake form you fill out about your business. We source high-quality professional photos for your industry. If you have your own photos, customer reviews, or specific content you want included, we will absolutely use it. Your input makes the end result better, but it is never required.",
  },
  {
    question: "Will my site show up on Google?",
    answer:
      "Every site we build includes foundational on-page SEO: optimized title tags, meta descriptions, header structure, image alt text, schema markup, and a submitted sitemap. We also set up Google Search Console and Google Analytics. For clients who want to actively climb local rankings, our Growth and Agency Partner monthly plans include ongoing local SEO, content publishing, and citation building.",
  },
  {
    question: "Will my site work on phones and tablets?",
    answer:
      "Yes, fully. Every site is built mobile-first and tested on iOS, Android, and all major screen sizes before launch. This is not optional for us. Over 70 percent of searches for home service businesses happen on a mobile device. If your site is slow or broken on a phone, you are losing jobs every single day.",
  },
  {
    question: "What if I want changes after the site launches?",
    answer:
      "All plans include a 30-day post-launch window for small tweaks and corrections at no charge. For ongoing updates, our Maintenance plan ($97/mo) covers monthly content changes, plugin and security updates, and priority support. Larger changes like new pages or redesigns are quoted separately at a fair flat rate.",
  },
  {
    question: "What if I do not like the design?",
    answer:
      "We start every project with a full design mockup that you review and approve before we build anything. If you want changes to the mockup, we revise until you are satisfied. Once we are in development, each plan includes revision rounds for final adjustments. We do not consider a project done until you are genuinely happy with what you see.",
  },
  {
    question: "Do you offer any guarantees?",
    answer:
      "Yes. If your site is not live within the delivery window we agreed to and the delay is on our end, we refund 10 percent of your project cost for each business day we are late. We also guarantee your site will score above 90 on Google PageSpeed for mobile performance. We stand behind the work.",
  },
  {
    question: "How does the monthly subscription work?",
    answer:
      "After your site launches, you can add a monthly plan at any time. Plans are billed on the same day each month and can be cancelled with 30 days notice. No long-term contracts, no setup fees. Clients who add a monthly plan at the time of their build get 20 percent off for the first three months.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full py-5 text-left gap-4"
      >
        <span className="font-semibold text-white">{question}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 shrink-0"
          style={{ color: "#6366f1" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-slate-400 leading-relaxed text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-navy-light/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Questions We <span className="text-electric">Always Get</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Straight answers. No fluff.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-navy rounded-2xl p-6 sm:p-10 border border-white/5">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-center text-slate-500 text-sm mt-8">
            Still have questions?{" "}
            <a href="#contact" className="text-electric hover:underline">
              Send us a message and we will respond within a few hours.
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
