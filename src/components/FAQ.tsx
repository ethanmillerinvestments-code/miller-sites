import { CheckCheck, FileText, ShieldCheck, Smartphone } from "lucide-react";

import { supportOffer, supportPlans } from "@/lib/offers";

const faqs = [
  {
    question: "How fast can a project launch?",
    answer:
      "Smaller-scope service sites usually move in roughly 2 to 4 weeks after approved content is in place. Larger multi-service builds take longer, and the timeline is set during scope review before kickoff.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Pricing moves with scope, page count, service depth, and integrations. Build fees are one-time. Monthly billing only starts if support is added after launch.",
  },
  {
    question: "Do you write the copy?",
    answer:
      "Yes. Copy is written around your services, service area, and proof. Existing reviews, photos, and offers are folded into the build.",
  },
  {
    question: "What is included before launch?",
    answer:
      "Mobile CTA checks, form testing, anti-spam, security headers, metadata, canonical rules, robots, sitemap, and a final pass on the main lead path.",
  },
  {
    question: "Do I need a monthly plan after launch?",
    answer:
      `No. The build can be delivered as a one-time project with a clean handoff. If you want hosting and upkeep, ${supportOffer.name} starts at ${supportOffer.priceLabel}.`,
  },
  {
    question: "What monthly options are available after launch?",
    answer:
      `There are three optional lanes: ${supportPlans[0].name} for hosting and core upkeep, ${supportPlans[1].name} for broader live-site care, and ${supportPlans[2].name} for recurring edits, search-ready upkeep, and conversion refinement.`,
  },
  {
    question: "How do scope, signer, and payment work?",
    answer:
      "Kickoff only happens after scope, deliverables, price, timeline, and signer identity are confirmed in writing. Monthly support, if added, is documented separately.",
  },
] as const;

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

export default function FAQ() {
  return (
    <section id="faq" className="section-pad section-rule">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="max-w-xl">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
            Straight answers.
          </h2>
          <p className="muted-copy mt-6 text-lg leading-8">
            The questions that usually block the decision are answered here:
            price, timeline, copy, ownership, and support.
          </p>

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

            <div className="mt-5 space-y-4">
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
            </div>
          </div>
        </div>

        <div className="lux-panel rounded-[2rem] px-6 py-3 sm:px-8">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="faq-item border-b border-white/10 last:border-b-0"
            >
              <summary className="faq-summary focus-lux flex items-center justify-between gap-4 rounded-2xl py-5">
                <span className="flex items-start gap-4">
                  <span className="mini-label mt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-semibold text-stone-50">
                    {faq.question}
                  </span>
                </span>
                <span className="faq-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300">
                  +
                </span>
              </summary>

              <div className="faq-content pb-5 pl-12 pr-4 text-sm leading-7 text-stone-300">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
