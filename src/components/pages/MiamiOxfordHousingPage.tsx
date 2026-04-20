import { Compass, Globe2, Landmark, ShieldCheck } from "lucide-react";

import MiamiHousingExplorer from "@/components/housing/MiamiHousingExplorer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  buildHousingSummary,
  formatHousingCurrencyRange,
  formatHousingDate,
  miamiOxfordCampusAnchor,
  miamiOxfordHousingOptions,
} from "@/lib/housing/miamiOxfordHousing";

const summary = buildHousingSummary(miamiOxfordHousingOptions);
const lastVerified = miamiOxfordHousingOptions[0]?.lastVerifiedAt ?? "2026-04-20";

const atlasRules = [
  {
    title: "True small-format units only",
    body: "This atlas only keeps studios, efficiencies, and true one-bedrooms. Anything framed as a 1BR plus study is deliberately excluded.",
    icon: ShieldCheck,
  },
  {
    title: "Campus anchor stays fixed",
    body: "Every mile and walk minute compares back to the Armstrong/Uptown campus anchor so distance tradeoffs stay honest.",
    icon: Landmark,
  },
  {
    title: "School-year math stays comparable",
    body: "Semester-priced options are normalized into 10-month school-year equivalents for an August-to-May family decision.",
    icon: Compass,
  },
  {
    title: "Legitimate action path only",
    body: "Each listing links to the cleanest real next step we could verify: direct property page, direct leasing page, or manager call line.",
    icon: Globe2,
  },
] as const;

export default function MiamiOxfordHousingPage() {
  return (
    <main className="bg-[#e5dcc7] text-[#213024]">
      <section className="relative overflow-hidden pt-28 sm:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at 14% 18%, rgba(122,149,111,0.18), transparent 22%), radial-gradient(circle at 84% 10%, rgba(175,134,96,0.22), transparent 18%), linear-gradient(180deg, rgba(255,250,241,0.78), rgba(229,220,199,0.92)), repeating-radial-gradient(circle at 70% 30%, rgba(88,104,82,0.08) 0, rgba(88,104,82,0.08) 1px, transparent 1px, transparent 20px)",
          }}
        />

        <div className="section-shell relative z-10 pb-8">
          <ScrollReveal direction="blur">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
              <div className="max-w-4xl">
                <span className="inline-flex rounded-full border border-[#b7c7a8] bg-[#eff4e8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#42563b]">
                  Private Share Page · Noindex · August 2026
                </span>
                <h1 className="mt-7 text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.96] text-[#213024]">
                  Miami Oxford housing atlas built around campus, not around rent headlines.
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f5b4e]">
                  Prepared for August 2026 move-in and exemption-case off-campus planning. This is
                  a family-shareable atlas page with a different visual language from the main site
                  on purpose: lighter, map-first, and grounded in one fixed comparison point.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4c5c45]">
                  The shortlist stays intentionally narrow: only studios, efficiencies, and true
                  1BRs that can make daily walking to the Armstrong/Uptown side of Miami feel
                  realistic, while still showing the real unknowns in pricing and setup.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-[#cabda6] bg-[linear-gradient(180deg,rgba(255,250,241,0.96),rgba(240,231,216,0.92))] p-6 shadow-[0_24px_60px_rgba(85,66,44,0.12)] sm:p-7">
                <div
                  aria-hidden="true"
                  className="absolute right-[-3rem] top-[-2rem] h-52 w-52 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(247,240,227,0.96) 0, rgba(247,240,227,0.96) 32%, rgba(104,127,96,0.16) 33%, rgba(104,127,96,0.16) 34%, transparent 35%), radial-gradient(circle, transparent 0, transparent 54%, rgba(104,127,96,0.12) 55%, rgba(104,127,96,0.12) 56%, transparent 57%)",
                  }}
                />

                <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b57]">
                  Campus Anchor
                </p>
                <h2 className="relative mt-4 text-3xl font-semibold text-[#213024]">
                  {miamiOxfordCampusAnchor.name}
                </h2>
                <p className="relative mt-3 text-sm leading-7 text-[#5f5b4e]">
                  {miamiOxfordCampusAnchor.address}
                </p>
                <p className="relative mt-4 text-sm leading-7 text-[#4c5c45]">
                  All walk minutes, map lines, and distance notes compare back to this point so
                  every shortlist decision stays centered on actual campus access.
                </p>

                <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-[#b7c7a8] bg-[#eff4e8] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#42563b]">
                      Monthly Band
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#213024]">
                      {formatHousingCurrencyRange(
                        summary.monthlyEquivalentMin,
                        summary.monthlyEquivalentMax,
                      )}
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-[#d7b78f] bg-[#fff3e4] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#775436]">
                      Campus Walk Band
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#213024]">
                      {summary.walkMinutesMin} to {summary.walkMinutesMax} min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <ScrollReveal direction="left">
              <div className="rounded-[1.8rem] border border-[#cabda6] bg-[#faf4e8] p-5 shadow-[0_20px_48px_rgba(85,66,44,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
                  Direct Sources
                </p>
                <p className="mt-3 text-4xl font-semibold text-[#213024]">
                  {summary.primarySourceOptions}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5f5b4e]">
                  Listings pulled directly from landlord or property-manager pages where those
                  pages exposed enough detail to trust the comparison.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up">
              <div className="rounded-[1.8rem] border border-[#cabda6] bg-[#faf4e8] p-5 shadow-[0_20px_48px_rgba(85,66,44,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
                  Posted Prices
                </p>
                <p className="mt-3 text-4xl font-semibold text-[#213024]">
                  {summary.postedPriceOptions}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5f5b4e]">
                  Options with a real posted number instead of a quote-only path. Unknowns still
                  stay visible, but they are never disguised as known totals.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-[1.8rem] border border-[#cabda6] bg-[#faf4e8] p-5 shadow-[0_20px_48px_rgba(85,66,44,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
                  Verification Pass
                </p>
                <p className="mt-3 text-2xl font-semibold text-[#213024]">
                  {formatHousingDate(lastVerified)}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5f5b4e]">
                  Cost clarity currently breaks into {summary.clarityCounts.clear} clearer reads,
                  {" "}
                  {summary.clarityCounts.partial} partial reads, and
                  {" "}
                  {summary.clarityCounts["quote-required"]} quote-required listings.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <MiamiHousingExplorer options={miamiOxfordHousingOptions} />

      <section className="section-pad pt-8">
        <div className="section-shell">
          <ScrollReveal direction="up">
            <div className="rounded-[2rem] border border-[#cabda6] bg-[linear-gradient(180deg,rgba(255,250,241,0.96),rgba(240,231,216,0.92))] p-6 shadow-[0_24px_60px_rgba(85,66,44,0.12)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b57]">
                Atlas Rules
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[#213024] sm:text-4xl">
                How this share page stays useful without pretending unknowns are known.
              </h2>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                {atlasRules.map((rule) => {
                  const Icon = rule.icon;

                  return (
                    <article
                      key={rule.title}
                      className="rounded-[1.5rem] border border-[#d7ccb8] bg-[#fbf6ed] p-5"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7ccb8] bg-[#f5eedf] text-[#5f7456]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-[#213024]">{rule.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#5f5b4e]">{rule.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-14 pt-4">
        <div className="section-shell">
          <div className="rounded-[1.5rem] border border-[#cabda6] bg-[#faf4e8] px-5 py-4 text-sm leading-7 text-[#5f5b4e] shadow-[0_18px_40px_rgba(85,66,44,0.08)]">
            Private family share page for exemption-case planning. No public navigation, no index
            intent, and every listing still links out to the most legitimate live action path
            available.
          </div>
        </div>
      </section>
    </main>
  );
}
