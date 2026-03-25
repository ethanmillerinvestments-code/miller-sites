import { supportOffer, supportPlans } from "@/lib/offers";

export const faqs = [
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
