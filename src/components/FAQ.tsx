"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    question: "How long does it take to build my website?",
    answer:
      "Most sites are delivered within 7-14 days depending on the plan. Our Premium tier is typically done in 7 days. We move fast without cutting corners.",
  },
  {
    question: "Do I need to provide content and images?",
    answer:
      "We handle everything. We'll write your copy based on your business details and use professional stock images. If you have your own photos and content, even better.",
  },
  {
    question: "Will my site work on phones and tablets?",
    answer:
      "Every site we build is fully responsive and tested on all devices. Over 70% of home service searches happen on mobile, so this is non-negotiable for us.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Our Premium plan includes 3 months of maintenance. All plans include 30 days of post-launch support. We also offer monthly maintenance packages starting at $97/month.",
  },
  {
    question: "Can I update the site myself after launch?",
    answer:
      "Absolutely. We build on modern platforms and can set up a simple content management system so you can make basic updates. For bigger changes, we're always a message away.",
  },
  {
    question: "What if I don't like the design?",
    answer:
      "We include revision rounds with every plan. We start with a mockup you approve before we build anything. If you're not happy after revisions, we'll keep working until you are.",
  },
  {
    question: "Do you help with Google rankings (SEO)?",
    answer:
      "Yes. Every site includes foundational SEO setup. Our Growth and Premium plans include advanced optimization like local SEO, schema markup, and speed optimization to help you rank higher.",
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
        className="flex items-center justify-between w-full py-5 text-left"
      >
        <span className="font-medium text-white pr-8">{question}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-electric shrink-0"
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
            <p className="pb-5 text-slate-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-navy-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-wider uppercase">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Common <span className="text-electric">Questions</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-navy rounded-2xl p-6 sm:p-8 border border-white/5">
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
      </div>
    </section>
  );
}
