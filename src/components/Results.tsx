import Link from "next/link";
import { ChartSpline, Headphones, LayoutGrid, TrendingUp } from "lucide-react";

import { deliveryViews } from "@/lib/offers";
import { guidePages } from "@/lib/site";

const growthCards = [
  {
    title: "What it means for your company",
    body:
      "A stronger website changes how prospects judge your pricing, your professionalism, and whether they trust you enough to call.",
    icon: TrendingUp,
  },
  {
    title: "What it means for your sales process",
    body:
      "Service pages, CTA placement, and cleaner routing reduce the work your follow-up process has to do after the click.",
    icon: Headphones,
  },
  {
    title: "What it means for future SEO",
    body:
      "A site with better structure can expand into more service and location coverage later without needing a full rebuild first.",
    icon: ChartSpline,
  },
  {
    title: "What it means after launch",
    body:
      "If you want ongoing help, the monthly support lanes are visible and tiered instead of buried behind one vague maintenance line.",
    icon: LayoutGrid,
  },
  {
    title: "What happens before kickoff",
    body:
      "A company brief and scope review happen before kickoff so price, deliverables, timeline, and ownership stay clear before any payment step.",
    icon: Headphones,
  },
] as const;

export default function Results() {
  return (
    <section id="results" className="section-pad section-rule">
      <div className="section-shell">
        <div className="max-w-3xl">
          <span className="eyebrow">What You Get</span>
          <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
            Clear deliverables, clear ownership, and a scope-first next step.
          </h2>
          <p className="muted-copy mt-6 text-lg leading-8">
            For home-service companies, the question is simple, what gets
            built, what gets handed off, and what optional upkeep includes.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="mini-label">Delivery Breakdown</p>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-[0.16em] text-stone-400">
                Scope first, then compare
              </div>
            </div>

            {deliveryViews.map((view, index) => (
              <article
                key={view.id}
                className={`lux-panel rounded-[1.6rem] p-5 ${
                  index === 0
                    ? "border-[rgba(216,170,115,0.18)]"
                    : index === 2
                      ? "border-[rgba(125,183,176,0.18)]"
                      : ""
                }`}
              >
                <p className="mini-label">{view.label}</p>
                <h3 className="mt-3 text-2xl font-semibold text-stone-50">
                  {view.title}
                </h3>
                <p className="muted-copy mt-3 text-sm leading-7">{view.intro}</p>

                <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                  {view.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-sm leading-7 text-stone-400">{view.note}</p>
              </article>
            ))}
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.28)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.18)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
              <span className="ml-auto text-xs uppercase tracking-[0.18em] text-stone-500">
                Why it matters
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {growthCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`rounded-[1.4rem] p-4 ${
                      index === 0
                        ? "border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)]"
                        : "border border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="mini-label">{card.title}</p>
                        <p className="mt-3 text-sm leading-7 text-stone-200">
                          {card.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="mini-label">Explore deeper</p>
              <div className="mt-4 grid gap-3">
                {guidePages.map((guide, index) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className={`rounded-[1.35rem] border px-4 py-4 text-sm transition-colors ${
                      index === 0
                        ? "border-white/10 bg-white/[0.03] text-stone-200 hover:border-[rgba(216,170,115,0.24)] hover:text-stone-50"
                        : "border-white/10 bg-white/[0.03] text-stone-200 hover:border-[rgba(125,183,176,0.24)] hover:text-stone-50"
                    }`}
                  >
                    <p className="font-semibold text-stone-50">{guide.title}</p>
                    <p className="mt-2 leading-7 text-stone-300">
                      {guide.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
