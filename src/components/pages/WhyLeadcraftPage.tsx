import Link from "next/link";

import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

const decisionViews = [
  {
    label: "First Impression",
    title: "What a weak first impression does to a home-service company",
    summary:
      "When the site looks cheap or generic, buyers question pricing, legitimacy, and whether they should trust the company enough to call.",
    bullets: [
      "More shoppers compare on price because the company does not look established",
      "Higher-ticket jobs feel harder to win because the site weakens trust before contact",
      "The sales conversation starts with skepticism instead of confidence",
    ],
  },
  {
    label: "Sales Path",
    title: "What a cleaner sales path changes for the company",
    summary:
      "When services, trust signals, and next steps are obvious, better-fit leads reach out with more context and less confusion.",
    bullets: [
      "Service pages explain what the company does before the call starts",
      "CTA structure reduces friction between interest and inquiry",
      "Stronger routing means fewer weak clicks and cleaner conversations",
    ],
  },
  {
    label: "Ownership",
    title: "Why ownership and handoff matter after launch",
    summary:
      "A business should know whether it is buying a finished build or a managed live site. Ambiguity there creates frustration later.",
    bullets: [
      "One-time builds need clear handoff and no hidden dependence on the builder",
      "Monthly hosting should be optional and clearly defined",
      "Leadcraft separates those two models so buyers know what they own",
    ],
  },
] as const;

const companyEffects = [
  {
    title: "Stronger trust before the call",
    body:
      "A sharper website makes the business look more established before the buyer ever hears your voice.",
  },
  {
    title: "Better-fit leads in the pipeline",
    body:
      "Cleaner service structure and CTA routing help filter out low-intent clicks and bring in better inquiries.",
  },
  {
    title: "Less rebuild friction later",
    body:
      "A structured build makes future SEO, service expansion, and location expansion easier without starting over.",
  },
] as const;

const scenarioViews = [
  {
    label: "Weak Site",
    title: "What a weak site keeps costing the company",
    bullets: [
      "Buyers compare on price faster because the company does not look established enough",
      "The office or estimator has to explain basics the site should have handled already",
      "Follow-up quality drops because the inquiry came in with less trust and less context",
    ],
  },
  {
    label: "Stronger Build",
    title: "What changes when the site starts doing its job",
    bullets: [
      "The buyer sees the service fit, proof, and next step faster",
      "Calls come in with better context because the pages already framed the offer",
      "Future growth work has a cleaner base because the structure is already disciplined",
    ],
  },
] as const;

const workModes = [
  {
    title: "One-Time Build",
    body:
      "Best for owners who want the site built properly and then handed off with clear ownership.",
  },
  {
    title: "Optional Monthly Support",
    body:
      "Best for owners who want Leadcraft involved after launch through Hosted Core, Managed Site Care, or Search and Conversion Support instead of a full handoff.",
  },
] as const;

const impactMarkers = [
  "Price perception starts with presentation",
  "Call quality improves when the path is obvious",
  "Ownership should stay clear after launch",
] as const;

export default function WhyLeadcraftPage() {
  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-6xl">
          <span className="eyebrow">Why Leadcraft</span>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
            <div>
              <h1 className="display-title text-[clamp(2.8rem,9vw,5.8rem)] text-stone-50">
                Why the right website changes the sales conversation for a home-service company.
              </h1>
              <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
                The website affects trust, price perception, and whether a buyer
                feels safe reaching out in the first place.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {impactMarkers.map((item) => (
                  <div key={item} className="stat-pill text-sm leading-6">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="lux-subtle rounded-[1.9rem] p-6 sm:p-7">
              <p className="mini-label">Positioning Standard</p>
              <p className="mt-4 text-lg leading-8 text-stone-100">
                Leadcraft is built for companies that want a sharper first impression,
                clearer service structure, and a clean split between one-time work
                and optional monthly support.
              </p>
              <p className="muted-copy mt-4 text-sm leading-7">
                The site should not behave like a digital brochure. It should help
                frame the offer, reduce confusion, and make the company feel more
                established before the office ever picks up the phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">Business Impact</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              The core business reasons a better site matters.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              The difference is not cosmetic alone. It changes how buyers judge
              credibility, how clearly they understand the offer, and how cleanly
              the business can move from launch into ownership or support.
            </p>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {decisionViews.map((view, index) => (
              <article
                key={view.label}
                className={`lux-panel rounded-[2rem] p-6 sm:p-7 ${
                  index === 1
                    ? "border-[rgba(216,170,115,0.18)] bg-[linear-gradient(180deg,rgba(216,170,115,0.08),rgba(13,14,18,0.98)_32%,rgba(13,14,18,0.96)_100%)]"
                    : ""
                }`}
              >
                <p className="mini-label">{view.label}</p>
                <h3 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                  {view.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{view.summary}</p>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                  {view.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="max-w-3xl">
            <span className="eyebrow">What Changes</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              What working with Leadcraft is meant to improve.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {companyEffects.map((item) => (
              <article key={item.title} className="lux-panel rounded-[1.85rem] p-6">
                <p className="mini-label">Outcome</p>
                <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                  {item.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {scenarioViews.map((view, index) => (
              <article
                key={view.label}
                className={`rounded-[2rem] p-6 sm:p-7 ${
                  index === 0
                    ? "border border-white/10 bg-[rgba(255,255,255,0.025)]"
                    : "lux-panel border-[rgba(125,183,176,0.16)] bg-[linear-gradient(180deg,rgba(125,183,176,0.08),rgba(13,14,18,0.98)_30%,rgba(13,14,18,0.96)_100%)]"
                }`}
              >
                <p className="mini-label">{view.label}</p>
                <h3 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                  {view.title}
                </h3>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                  {view.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className={`mt-2 h-1.5 w-1.5 rounded-full ${
                          index === 0
                            ? "bg-[color:var(--accent)]"
                            : "bg-[color:var(--teal)]"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-rule">
        <div className="section-shell">
          <div className="grid gap-5 lg:grid-cols-2">
            {workModes.map((mode, index) => (
              <article
                key={mode.title}
                className={`rounded-[1.85rem] p-6 sm:p-7 ${
                  index === 0 ? "lux-subtle" : "lux-panel"
                }`}
              >
                <p className="mini-label">Delivery Model</p>
                <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                  {mode.title}
                </h3>
                <p className="muted-copy mt-4 text-sm leading-7">{mode.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 lux-subtle rounded-[1.95rem] p-6 sm:p-8">
            <p className="muted-copy max-w-2xl text-sm leading-7">
              The right site helps the company look established, explain its work
              faster, and stay clear on what is owned outright versus what is
              optionally managed after launch.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="button-primary w-full px-6 py-4 text-sm sm:w-auto"
              >
                Book Strategy Call
              </a>
              <Link
                href="/#package-finder"
                className="button-secondary w-full px-6 py-4 text-sm sm:w-auto"
              >
                Find My Price
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
