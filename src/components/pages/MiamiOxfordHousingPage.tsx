import Breadcrumbs from "@/components/Breadcrumbs";
import MiamiHousingExplorer from "@/components/housing/MiamiHousingExplorer";
import ScrollReveal from "@/components/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import {
  buildHousingSummary,
  formatHousingCurrencyRange,
  formatHousingDate,
  miamiOxfordHousingOptions,
} from "@/lib/housing/miamiOxfordHousing";

const summary = buildHousingSummary(miamiOxfordHousingOptions);
const lastVerified = miamiOxfordHousingOptions[0]?.lastVerifiedAt ?? "2026-04-20";

const methodologyPoints = [
  "Only studios, efficiencies, and true 1BRs are included. Anything marketed as a 1BR plus study is intentionally excluded from this atlas.",
  "Semester-priced listings are normalized into 10-month school-year equivalents so the shortlist stays comparable for an August-to-May family decision.",
  "Taxes and fees are never guessed. Each listing shows whether taxes or non-utility fees are included, excluded, none listed, or still unknown.",
  "Every card routes to the most legitimate live action path available: direct property page, direct leasing page, or a manager phone link when no cleaner booking flow is exposed online.",
] as const;

export default function MiamiOxfordHousingPage() {
  return (
    <SiteShell showStickyCTA={false}>
      <section className="section-pad relative overflow-hidden pt-32 sm:pt-40">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 12% 16%, rgba(125,183,176,0.15), transparent 24%), radial-gradient(circle at 82% 10%, rgba(216,170,115,0.18), transparent 18%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 34%)",
          }}
        />

        <div className="section-shell relative z-10">
          <Breadcrumbs
            items={[
              {
                label: "Miami Oxford Housing 2026",
                href: "/miami-oxford-housing-2026",
              },
            ]}
          />

          <ScrollReveal direction="blur" className="max-w-6xl">
            <span className="eyebrow">Private Share Page · Noindex</span>
            <h1 className="display-title mt-7 text-[clamp(3rem,8vw,5.7rem)] text-stone-50">
              Miami Oxford housing atlas prepared for August 2026 move-in.
            </h1>
            <p className="muted-copy mt-6 max-w-3xl text-lg leading-8">
              Built for exemption-case off-campus planning, and safe to share with family. This
              atlas stays narrow on purpose: only studios, efficiencies, and true one-bedrooms that
              can still make daily walking to the Armstrong/Uptown side of campus feel realistic.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
              The goal is not to crown the cheapest headline rent. The goal is to compare walk
              reality, move-in cash, school-year exposure, utility risk, and how trustworthy each
              source actually is.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <ScrollReveal direction="left">
              <div className="lux-panel rounded-[2rem] p-6 sm:p-7">
                <p className="editorial-kicker">Atlas Read</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[rgba(125,183,176,0.22)] bg-[rgba(125,183,176,0.08)] p-5">
                    <p className="mini-label text-[#aee0da]">Direct Sources</p>
                    <p className="mt-4 text-4xl font-semibold text-stone-50">
                      {summary.primarySourceOptions}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-300">
                      Listings pulled from Oxford Real Estate or South Campus Quarter rather than a
                      campus portal mirror.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[rgba(216,170,115,0.22)] bg-[rgba(216,170,115,0.08)] p-5">
                    <p className="mini-label text-[color:var(--accent-strong)]">Posted Prices</p>
                    <p className="mt-4 text-4xl font-semibold text-stone-50">
                      {summary.postedPriceOptions}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-300">
                      Cards with an actual posted price instead of “call for details.”
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-7">
                <p className="editorial-kicker">Family Snapshot</p>
                <div className="mt-6 space-y-5">
                  <div>
                    <p className="mini-label">Curated Inventory</p>
                    <p className="mt-3 text-3xl font-semibold text-stone-50">
                      {summary.totalOptions} focused options
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="mini-label">Monthly Eq. Band</p>
                      <p className="mt-2 text-xl font-semibold text-stone-50">
                        {formatHousingCurrencyRange(
                          summary.monthlyEquivalentMin,
                          summary.monthlyEquivalentMax,
                        )}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="mini-label">Walk Band</p>
                      <p className="mt-2 text-xl font-semibold text-stone-50">
                        {summary.walkMinutesMin} to {summary.walkMinutesMax} min
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-stone-300">
                    Last verification pass: {formatHousingDate(lastVerified)}. Cost clarity counts:
                    {" "}
                    {summary.clarityCounts.clear}
                    {" "}
                    clearer reads,
                    {" "}
                    {summary.clarityCounts.partial}
                    {" "}
                    partial reads,
                    {" "}
                    {summary.clarityCounts["quote-required"]}
                    {" "}
                    quote-required.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <MiamiHousingExplorer options={miamiOxfordHousingOptions} />

      <section className="section-pad section-rule">
        <div className="section-shell">
          <ScrollReveal direction="up">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-8">
              <p className="editorial-kicker">Methodology</p>
              <h2 className="section-title mt-4 text-3xl text-stone-50 sm:text-4xl">
                How this atlas stays useful without pretending the unknowns are known.
              </h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                {methodologyPoints.map((point, index) => (
                  <article
                    key={point}
                    className={`rounded-[1.5rem] border p-5 ${
                      index === 2
                        ? "border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.08)]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <p className="mini-label">Method {index + 1}</p>
                    <p className="mt-3 text-sm leading-7 text-stone-300">{point}</p>
                  </article>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
