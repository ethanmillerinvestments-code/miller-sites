import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

const sections = [
  {
    title: "Site information only",
    body:
      "The site explains Leadcraft's offer, pricing lanes, process, and contact paths. Public content is informational and does not create a project agreement by itself.",
  },
  {
    title: "Scope before project start",
    body:
      "No project starts from browsing the site alone. Project work begins only after fit review, written scope, deliverables, timeline, and the next-step process are clearly confirmed.",
  },
  {
    title: "Pricing and approvals",
    body:
      "Public pricing is a real starting point for the listed offer lanes, but final scope and fit still need review. Payment requests are sent only through the explicit approval path used for that project.",
  },
  {
    title: "Concepts and proof",
    body:
      "Concept work shown by Leadcraft is labeled as concept work. Live client proof is published only when it is real, approved, and safe to share publicly.",
  },
  {
    title: "Ownership and handoff",
    body:
      "The exact ownership split, handoff model, support coverage, and excluded items are defined in the written project scope or related delivery documents, not assumed from general site copy.",
  },
] as const;

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Leadcraft Agency site terms, scope-first project standard, pricing interpretation, proof-of-work labeling, and ownership and handoff policy.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-5xl">
          <Breadcrumbs items={[{ label: "Terms", href: "/terms" }]} />
          <span className="eyebrow">Terms</span>
          <h1 className="display-title mt-7 text-[clamp(2.8rem,9vw,5.2rem)] text-stone-50">
            Leadcraft runs on a scope-first, approval-first project standard.
          </h1>
          <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
            These terms explain how the public site, pricing, proof-of-work,
            and project-start rules should be interpreted before any live
            project begins.
          </p>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell max-w-5xl">
          <div className="grid gap-5">
            {sections.map((section) => (
              <article key={section.title} className="lux-panel rounded-[1.9rem] p-6 sm:p-7">
                <p className="mini-label">Commercial Standard</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-50">
                  {section.title}
                </h2>
                <p className="muted-copy mt-4 text-sm leading-7">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.9rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] p-6 sm:p-7">
            <p className="mini-label text-[color:var(--teal)]">Project note</p>
            <p className="mt-4 text-sm leading-7 text-stone-200">
              For any active deal, the written scope, proposal notes, and
              approval path override general site copy where more specific
              project terms are needed.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
