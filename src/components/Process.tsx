const steps = [
  {
    number: "01",
    title: "Strategy & Scope",
    detail: "Align the main offer, priority pages, proof, and CTA before design starts.",
  },
  {
    number: "02",
    title: "Design Direction",
    detail: "Shape the layout around how buyers decide to call or request a quote.",
  },
  {
    number: "03",
    title: "Build & QA",
    detail: "Build the pages, forms, and mobile states, then test the lead path.",
  },
  {
    number: "04",
    title: "Launch & Handoff",
    detail: "Launch or hand off the site with scope, ownership, and support clearly documented.",
  },
] as const;

const checklist = [
  "Phone links and primary CTA tested on mobile",
  "Form submission, validation, and inbox routing confirmed",
  "Security headers, SSL readiness, canonical, robots, and sitemap verified",
  "Approved proof positioned where it helps the sale",
] as const;

import SectionDivider from "@/components/SectionDivider";

export default function Process() {
  return (
    <section id="process" className="section-pad">
      <SectionDivider tone="accent" className="mb-16" />
      <div className="section-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <span className="eyebrow">Process</span>
          <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
            How the project moves.
          </h2>
          <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
            Smaller-scope service sites usually move in roughly 2 to 4 weeks
            once content and feedback are approved. Larger builds are scoped
            separately before timing is promised.
          </p>

          <div className="mt-10 space-y-5">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`lux-panel flex gap-5 rounded-[1.5rem] p-5 sm:p-6 ${
                  index === 0 ? "border-[rgba(216,170,115,0.18)]" : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(216,170,115,0.25)] bg-[rgba(216,170,115,0.08)] text-sm font-semibold text-[color:var(--accent-strong)]">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-stone-50">
                    {step.title}
                  </h3>
                  <p className="muted-copy mt-3 text-sm leading-7">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lux-panel rounded-[1.8rem] p-6 sm:p-7">
          <p className="mini-label">Before Launch</p>
          <h3 className="mt-4 text-3xl font-semibold text-stone-50">
            The launch check is part of the build.
          </h3>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
            {checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="mini-label">Kickoff Standard</p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              Scope, deliverables, price, timeline, and signer identity are
              confirmed before work starts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
