import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

const sections = [
  {
    title: "What Leadcraft collects",
    body:
      "Leadcraft may collect the information you submit through contact forms, package-intake forms, email, scheduled calls, or proposal conversations. That can include your name, company name, email, phone, website, service details, service areas, project notes, and basic source or UTM context. The site may also collect standard usage analytics such as page views, landing pages, referrers, campaign parameters, and CTA interactions to understand site performance.",
  },
  {
    title: "How the information is used",
    body:
      "The information is used to review fit, respond to your request, prepare scope notes, improve the sales process, reduce spam, and keep a record of legitimate project conversations.",
  },
  {
    title: "Who may process it",
    body:
      "Leadcraft may use service providers such as website hosting, analytics, email delivery, scheduling, payments, or CRM tools to process legitimate business inquiries and measure site performance. Information is not sold to third parties.",
  },
  {
    title: "Retention and security",
    body:
      "Inquiry data is kept only as long as it is useful for legitimate business operations, project records, compliance, or spam prevention. Reasonable technical and process controls are used, but no internet transmission can be guaranteed as perfectly secure.",
  },
  {
    title: "Your choices",
    body:
      "If you want your inquiry data corrected or removed, contact Leadcraft directly. If the request relates to an active project, some records may still need to be retained for business, payment, or compliance reasons.",
  },
] as const;

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Leadcraft Agency handles inquiry data, contact form submissions, and project-brief information. Data retention, processing, and your choices.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-5xl">
          <Breadcrumbs items={[{ label: "Privacy", href: "/privacy" }]} />
          <span className="eyebrow">Privacy</span>
          <h1 className="display-title mt-7 text-[clamp(2.8rem,9vw,5.2rem)] text-stone-50">
            Leadcraft handles inquiry data for fit review, scope planning, and project communication.
          </h1>
          <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
            This page explains the practical privacy standard used on the site.
            If a project moves forward, any additional handling requirements are
            clarified in the written scope or project documentation.
          </p>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell max-w-5xl">
          <div className="grid gap-5">
            {sections.map((section) => (
              <article key={section.title} className="lux-panel rounded-[1.9rem] p-6 sm:p-7">
                <p className="mini-label">Privacy Standard</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-50">
                  {section.title}
                </h2>
                <p className="muted-copy mt-4 text-sm leading-7">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.9rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)] p-6 sm:p-7">
            <p className="mini-label">Contact</p>
            <p className="mt-4 text-sm leading-7 text-stone-200">
              Privacy questions can be sent to{" "}
              <a
                href={siteConfig.emailHref}
                className="text-[color:var(--accent-strong)] transition-colors hover:text-stone-50"
              >
                {siteConfig.email}
              </a>
              . Leadcraft is based in {siteConfig.locationDisplay}.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
