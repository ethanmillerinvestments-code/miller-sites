"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCheck, FileText, ShieldCheck, Smartphone } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import StaggerReveal from "@/components/StaggerReveal";
import { faqs } from "@/lib/faq-data";

const launchChecks = [
  {
    title: "Mobile CTA clarity",
    body: "Above-the-fold buttons, tap targets, and route choice stay clean on phones.",
    icon: Smartphone,
  },
  {
    title: "Lead-path hardening",
    body: "Forms, anti-spam, and error states are checked before the site is considered ready.",
    icon: ShieldCheck,
  },
  {
    title: "Scope and handoff clarity",
    body: "Pricing, deliverables, signer identity, and monthly support are documented separately.",
    icon: FileText,
  },
] as const;

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="focus-lux flex w-full items-center justify-between gap-4 rounded-2xl py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="flex items-start gap-4">
          <span className="mini-label mt-1">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-base font-semibold text-stone-50">
            {faq.question}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 300, damping: 25 }
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-stone-300"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.1 }
                : { height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }
            }
            style={{ overflow: "hidden" }}
          >
            <div ref={contentRef} className="pb-5 pl-12 pr-4 text-sm leading-7 text-stone-300">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-pad section-rule">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="max-w-xl">
          <ScrollReveal direction="left" depth="near">
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              Straight answers.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              The questions that usually block the decision are answered here:
              price, timeline, copy, ownership, and support.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="blur" delay={0.1}>
            <div className="mt-8 rounded-[1.6rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                  <CheckCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="mini-label">Before Launch</p>
                  <p className="mt-1 text-sm font-semibold text-stone-100">
                    Every build is checked for the basics buyers actually notice.
                  </p>
                </div>
              </div>

              <StaggerReveal staggerDelay={0.08} direction="up" pattern="sequential" className="mt-5 space-y-4">
                {launchChecks.map((check) => {
                  const Icon = check.icon;

                  return (
                    <div
                      key={check.title}
                      className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-stone-50">
                            {check.title}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-stone-300">
                            {check.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </StaggerReveal>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="right" depth="mid">
          <div className="lux-panel rounded-[2rem] px-6 py-3 sm:px-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
