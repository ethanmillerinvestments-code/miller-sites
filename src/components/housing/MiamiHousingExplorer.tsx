"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";

import { ArrowUpRight, CircleAlert, FileSearch, Filter, MapPinned, Scale } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import {
  buildHousingSummary,
  buildMoveInDueSummary,
  buildRecurringAllInSummary,
  buildSchoolYearSummary,
  filterHousingOptions,
  formatHousingCurrency,
  formatHousingCurrencyRange,
  formatHousingDate,
  getACStatusLabel,
  getDisclosureLabel,
  getFurnishedStatusLabel,
  getHousingClarityLabel,
  getHousingClarityStatus,
  getLaundryStatusLabel,
  getMissingCostWarnings,
  getQuestionsToAsk,
  getRankingScore,
  getSourceConfidenceLabel,
  getSourceKindLabel,
  getUnitTypeLabel,
  sortHousingOptions,
  type HousingOption,
  type HousingSortKey,
  type HousingSourceConfidence,
  type HousingUnitType,
} from "@/lib/housing/miamiOxfordHousing";

const MiamiHousingLeafletMap = dynamic(
  () => import("@/components/housing/MiamiHousingLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[22rem] items-center justify-center rounded-[1.9rem] border border-white/10 bg-white/[0.03] text-sm text-stone-400 md:h-[34rem] xl:h-[38rem]">
        Loading atlas map…
      </div>
    ),
  },
);

type UnitFilter = "all" | HousingUnitType;
type WalkFilter = "all" | "10" | "15" | "20" | "25";
type BudgetFilter = "all" | "700" | "850" | "1000" | "1250";

const clarityBadgeClasses = {
  clear: "border-[rgba(125,183,176,0.26)] bg-[rgba(125,183,176,0.12)] text-[#b8eee6]",
  partial: "border-[rgba(216,170,115,0.28)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]",
  "quote-required":
    "border-[rgba(208,100,91,0.34)] bg-[rgba(208,100,91,0.12)] text-[#f0b1aa]",
} as const;

const confidenceBadgeClasses: Record<HousingSourceConfidence, string> = {
  high: "border-[rgba(125,183,176,0.26)] bg-[rgba(125,183,176,0.1)] text-[#b8eee6]",
  medium:
    "border-[rgba(216,170,115,0.28)] bg-[rgba(216,170,115,0.1)] text-[color:var(--accent-strong)]",
  low: "border-[rgba(208,100,91,0.34)] bg-[rgba(208,100,91,0.1)] text-[#f0b1aa]",
};

function directionsLink(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

function MetricTile({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
      <p className="mini-label">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-50">{value}</p>
      <p className="mt-2 text-xs leading-6 text-stone-400">{note}</p>
    </div>
  );
}

export default function MiamiHousingExplorer({ options }: { options: HousingOption[] }) {
  const [unitFilter, setUnitFilter] = useState<UnitFilter>("all");
  const [maxWalk, setMaxWalk] = useState<WalkFilter>("all");
  const [maxMonthly, setMaxMonthly] = useState<BudgetFilter>("all");
  const [postedPriceOnly, setPostedPriceOnly] = useState(false);
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [utilitiesIncludedOnly, setUtilitiesIncludedOnly] = useState(false);
  const [parkingIncludedOnly, setParkingIncludedOnly] = useState(false);
  const [sortMode, setSortMode] = useState<HousingSortKey>("best-fit");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(options[0]?.id ?? null);
  const [shouldScrollToCard, setShouldScrollToCard] = useState(false);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const deferredQuery = useDeferredValue(searchQuery);

  const visibleOptions = sortHousingOptions(
    filterHousingOptions(options, {
      unitTypes: unitFilter === "all" ? undefined : [unitFilter],
      maxWalkMinutes: maxWalk === "all" ? undefined : Number(maxWalk),
      maxMonthlyEquivalent: maxMonthly === "all" ? undefined : Number(maxMonthly),
      postedPriceOnly,
      furnishedOnly,
      utilitiesIncludedOnly,
      parkingIncludedOnly,
      searchQuery: deferredQuery,
    }),
    sortMode,
  );

  const summary = buildHousingSummary(visibleOptions);
  const selectedOption = visibleOptions.find((option) => option.id === selectedId) ?? visibleOptions[0] ?? null;

  useEffect(() => {
    if (!visibleOptions.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !visibleOptions.some((option) => option.id === selectedId)) {
      setSelectedId(visibleOptions[0].id);
    }
  }, [selectedId, visibleOptions]);

  useEffect(() => {
    if (!shouldScrollToCard || !selectedId) return;

    cardRefs.current[selectedId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
    setShouldScrollToCard(false);
  }, [selectedId, shouldScrollToCard]);

  const rankingPreview = visibleOptions.slice(0, 5);

  return (
    <section className="section-pad section-rule">
      <div className="section-shell space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-start">
          <div className="space-y-6">
            <ScrollReveal direction="left">
              <div className="lux-panel rounded-[2rem] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="editorial-kicker">Atlas</p>
                    <h2 className="section-title mt-3 text-3xl text-stone-50 sm:text-[2.35rem]">
                      Map first, then compare what it actually costs to get in the door.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
                      “Best overall fit” prioritizes verified walking practicality, then the clearest
                      all-in affordability picture, then source confidence. Cheap-but-fuzzy listings
                      stay below slightly pricier options with cleaner documentation.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(8,10,14,0.46)] px-4 py-3 text-right">
                    <p className="mini-label">Visible Ranking</p>
                    <p className="mt-2 text-3xl font-semibold text-stone-50">{summary.totalOptions}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-400">
                      Listings after filters
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <label className="space-y-2">
                    <span className="mini-label">Search</span>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        startTransition(() => setSearchQuery(event.target.value))
                      }
                      placeholder="Try Vine, Sycamore, or furnished"
                      className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-[rgba(216,170,115,0.28)] focus:outline-none"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="mini-label">Sort</span>
                    <select
                      value={sortMode}
                      onChange={(event) =>
                        startTransition(() => setSortMode(event.target.value as HousingSortKey))
                      }
                      className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-stone-100 focus:border-[rgba(216,170,115,0.28)] focus:outline-none"
                    >
                      <option value="best-fit">Best overall fit</option>
                      <option value="walk-asc">Shortest walk</option>
                      <option value="monthly-equivalent-asc">Lowest monthly equivalent</option>
                      <option value="move-in-asc">Lowest move-in due</option>
                      <option value="name-asc">Alphabetical</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="mini-label">Unit type</span>
                    <select
                      value={unitFilter}
                      onChange={(event) =>
                        startTransition(() => setUnitFilter(event.target.value as UnitFilter))
                      }
                      className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-stone-100 focus:border-[rgba(216,170,115,0.28)] focus:outline-none"
                    >
                      <option value="all">Studios, efficiencies, and 1BRs</option>
                      <option value="studio">Studios only</option>
                      <option value="efficiency">Efficiencies only</option>
                      <option value="one-bedroom">True 1BRs only</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="mini-label">Max walk</span>
                    <select
                      value={maxWalk}
                      onChange={(event) =>
                        startTransition(() => setMaxWalk(event.target.value as WalkFilter))
                      }
                      className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-stone-100 focus:border-[rgba(216,170,115,0.28)] focus:outline-none"
                    >
                      <option value="all">Any practical walk</option>
                      <option value="10">10 min or less</option>
                      <option value="15">15 min or less</option>
                      <option value="20">20 min or less</option>
                      <option value="25">25 min or less</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="mini-label">Max monthly equivalent</span>
                    <select
                      value={maxMonthly}
                      onChange={(event) =>
                        startTransition(() => setMaxMonthly(event.target.value as BudgetFilter))
                      }
                      className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-stone-100 focus:border-[rgba(216,170,115,0.28)] focus:outline-none"
                    >
                      <option value="all">No cap</option>
                      <option value="700">$700/mo or less</option>
                      <option value="850">$850/mo or less</option>
                      <option value="1000">$1,000/mo or less</option>
                      <option value="1250">$1,250/mo or less</option>
                    </select>
                  </label>

                  <div className="space-y-2">
                    <span className="mini-label">Quick toggles</span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        {
                          checked: postedPriceOnly,
                          label: "Posted price only",
                          onChange: (value: boolean) => setPostedPriceOnly(value),
                        },
                        {
                          checked: furnishedOnly,
                          label: "Furnished only",
                          onChange: (value: boolean) => setFurnishedOnly(value),
                        },
                        {
                          checked: utilitiesIncludedOnly,
                          label: "Any utilities included",
                          onChange: (value: boolean) => setUtilitiesIncludedOnly(value),
                        },
                        {
                          checked: parkingIncludedOnly,
                          label: "Parking included",
                          onChange: (value: boolean) => setParkingIncludedOnly(value),
                        },
                      ].map((toggle) => (
                        <label
                          key={toggle.label}
                          className="inline-flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-stone-200"
                        >
                          <input
                            type="checkbox"
                            checked={toggle.checked}
                            onChange={(event) =>
                              startTransition(() => toggle.onChange(event.target.checked))
                            }
                            className="h-4 w-4 rounded border-white/20 bg-transparent accent-[color:var(--accent)]"
                          />
                          {toggle.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MetricTile
                    label="Posted Prices"
                    value={`${summary.postedPriceOptions}/${summary.totalOptions}`}
                    note="Listings with an actual posted price instead of call-for-details."
                  />
                  <MetricTile
                    label="Walk Band"
                    value={`${summary.walkMinutesMin ?? "?"}-${summary.walkMinutesMax ?? "?"} min`}
                    note="Straight-line estimate to the Armstrong/Uptown side of campus."
                  />
                  <MetricTile
                    label="Monthly Band"
                    value={formatHousingCurrencyRange(
                      summary.monthlyEquivalentMin,
                      summary.monthlyEquivalentMax,
                    )}
                    note="Shown as monthly equivalents; semester-priced units are normalized to 10 months."
                  />
                  <MetricTile
                    label="Cost Clarity"
                    value={`${summary.clarityCounts.clear} clear / ${summary.clarityCounts.partial} partial`}
                    note="Quote-required cards stay visible when they still solve a location or furnishing need."
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up">
              <MiamiHousingLeafletMap
                options={visibleOptions}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setShouldScrollToCard(true);
                }}
              />
            </ScrollReveal>

            <ScrollReveal direction="up">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="editorial-kicker">Visible Ranking</p>
                    <h3 className="mt-3 text-2xl font-semibold text-stone-50">
                      Current best-fit order
                    </h3>
                  </div>
                  <div className="rounded-[1.2rem] border border-[rgba(216,170,115,0.22)] bg-[rgba(216,170,115,0.08)] px-4 py-3 text-sm leading-7 text-stone-200">
                    Walkability drives the first cut. Cost clarity and confidence decide the close
                    calls.
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {rankingPreview.map((option, index) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedId(option.id)}
                      className={`rounded-[1.35rem] border px-4 py-4 text-left transition-all ${
                        selectedId === option.id
                          ? "border-[rgba(216,170,115,0.34)] bg-[rgba(216,170,115,0.08)]"
                          : "border-white/10 bg-white/[0.02] hover:border-[rgba(216,170,115,0.18)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="mini-label">#{index + 1}</p>
                          <p className="mt-2 text-lg font-semibold text-stone-50">
                            {option.propertyName}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-400">
                            {getUnitTypeLabel(option.unitType)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="mini-label">Score</p>
                          <p className="mt-2 text-lg font-semibold text-stone-50">
                            {getRankingScore(option).toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-stone-300">
                        {option.walkMinutes} min walk
                        {" · "}
                        {buildRecurringAllInSummary(option).label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="xl:sticky xl:top-24">
            <ScrollReveal direction="right">
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="editorial-kicker">Compare Rail</p>
                    <h2 className="section-title mt-3 text-3xl text-stone-50 sm:text-[2.15rem]">
                      Shortlist cards with direct booking or contact links.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
                      Each card links to the most legitimate live action path we could verify for
                      that listing: direct property page, direct leasing page, or manager phone
                      line when no cleaner booking flow is exposed online.
                    </p>
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[color:var(--accent-strong)]">
                    <MapPinned className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-5 space-y-4 xl:max-h-[calc(100vh-12rem)] xl:overflow-y-auto xl:pr-2">
                  {visibleOptions.length ? (
                    visibleOptions.map((option, index) => {
                      const recurring = buildRecurringAllInSummary(option);
                      const moveIn = buildMoveInDueSummary(option);
                      const warnings = getMissingCostWarnings(option).slice(0, 2);
                      const clarity = getHousingClarityStatus(option);
                      const isSelected = option.id === selectedId;

                      return (
                        <article
                          key={option.id}
                          ref={(node) => {
                            cardRefs.current[option.id] = node;
                          }}
                          onClick={() => setSelectedId(option.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedId(option.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className={`rounded-[1.75rem] border p-4 text-left transition-all ${
                            isSelected
                              ? "border-[rgba(216,170,115,0.34)] bg-[rgba(216,170,115,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                              : "border-white/10 bg-white/[0.03] hover:border-[rgba(216,170,115,0.18)]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="max-w-[16rem]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="mini-label">#{index + 1}</span>
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${clarityBadgeClasses[clarity]}`}
                                >
                                  {getHousingClarityLabel(clarity)}
                                </span>
                              </div>
                              <h3 className="mt-3 text-xl font-semibold text-stone-50">
                                {option.propertyName}
                              </h3>
                              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-400">
                                {getUnitTypeLabel(option.unitType)}
                              </p>
                            </div>
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${confidenceBadgeClasses[option.sourceConfidence]}`}
                            >
                              {getSourceConfidenceLabel(option.sourceConfidence)}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <MetricTile
                              label="Walk"
                              value={`${option.walkMinutes} min`}
                              note={`${option.distanceMiles.toFixed(2)} mi to the Armstrong/Uptown anchor.`}
                            />
                            <MetricTile
                              label="Monthly Eq."
                              value={recurring.label}
                              note={recurring.note}
                            />
                            <MetricTile
                              label="Semester Due"
                              value={
                                option.semesterDueAmount === null
                                  ? "Monthly cadence"
                                  : formatHousingCurrencyRange(
                                      option.semesterDueAmount,
                                      option.semesterDueAmountUpper,
                                    )
                              }
                              note={option.semesterDueAmount === null ? option.leaseTermLabel : "Per rent cycle, before spring repeats."}
                            />
                            <MetricTile label="Move-In Due" value={moveIn.label} note={moveIn.note} />
                          </div>

                          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                            <div>
                              <p className="mini-label">Top 3 perks</p>
                              <ul className="mt-3 space-y-2 text-sm leading-7 text-stone-300">
                                {option.perks.slice(0, 3).map((perk) => (
                                  <li key={perk}>{perk}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="mini-label">Top missing-cost warnings</p>
                              {warnings.length ? (
                                <ul className="mt-3 space-y-2 text-sm leading-7 text-stone-300">
                                  {warnings.map((warning) => (
                                    <li key={warning} className="text-[#f0c1bb]">
                                      {warning}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-3 text-sm leading-7 text-stone-300">
                                  No major missing-cost flags beyond usage-based utilities.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-3">
                            <a
                              href={option.contactPath.href}
                              target={option.contactPath.href.startsWith("http") ? "_blank" : undefined}
                              rel={option.contactPath.href.startsWith("http") ? "noreferrer" : undefined}
                              className="button-primary px-5 py-3 text-sm"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {option.contactPath.label}
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <button
                              type="button"
                              className="button-secondary px-5 py-3 text-sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedId(option.id);
                              }}
                            >
                              Open deep view
                              <Scale className="h-4 w-4" />
                            </button>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-8 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[color:var(--accent-strong)]">
                        <FileSearch className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold text-stone-50">
                        No listings match that filter stack.
                      </h3>
                      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">
                        Loosen the walk cap, allow unpriced listings back in, or remove the
                        furnished/parking toggles to widen the atlas again.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal direction="up">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="editorial-kicker">Property Deep View</p>
                <h2 className="section-title mt-3 text-3xl text-stone-50 sm:text-[2.35rem]">
                  Drill into one property without losing the map or filter context.
                </h2>
              </div>
              {selectedOption ? (
                <div className="rounded-[1.3rem] border border-white/10 bg-[rgba(8,10,14,0.48)] px-4 py-3 text-sm text-stone-300">
                  Selected:
                  {" "}
                  <span className="font-semibold text-stone-50">{selectedOption.propertyName}</span>
                </div>
              ) : null}
            </div>

            <AnimatePresence mode="wait">
              {selectedOption ? (
                <motion.div
                  key={selectedOption.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6"
                >
                  {(() => {
                    const recurring = buildRecurringAllInSummary(selectedOption);
                    const moveIn = buildMoveInDueSummary(selectedOption);
                    const schoolYear = buildSchoolYearSummary(selectedOption);
                    const clarity = getHousingClarityStatus(selectedOption);
                    const questions = getQuestionsToAsk(selectedOption);

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${clarityBadgeClasses[clarity]}`}
                              >
                                {getHousingClarityLabel(clarity)}
                              </span>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${confidenceBadgeClasses[selectedOption.sourceConfidence]}`}
                              >
                                {getSourceConfidenceLabel(selectedOption.sourceConfidence)}
                              </span>
                              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-300">
                                {getSourceKindLabel(selectedOption.sourceKind)}
                              </span>
                            </div>

                            <h3 className="mt-4 text-3xl font-semibold text-stone-50">
                              {selectedOption.propertyName}
                              {" "}
                              <span className="text-xl font-normal text-stone-300">
                                {selectedOption.optionName}
                              </span>
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-stone-300">
                              {selectedOption.address}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-stone-300">
                              {selectedOption.walkMinutes} minute estimated walk
                              {" · "}
                              {selectedOption.distanceMiles.toFixed(2)} miles
                              {" · "}
                              {getUnitTypeLabel(selectedOption.unitType)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <a
                              href={selectedOption.contactPath.href}
                              target={
                                selectedOption.contactPath.href.startsWith("http") ? "_blank" : undefined
                              }
                              rel={
                                selectedOption.contactPath.href.startsWith("http")
                                  ? "noreferrer"
                                  : undefined
                              }
                              className="button-primary px-5 py-3 text-sm"
                            >
                              {selectedOption.contactPath.label}
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a
                              href={selectedOption.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="button-secondary px-5 py-3 text-sm"
                            >
                              Open source listing
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a
                              href={directionsLink(selectedOption.address)}
                              target="_blank"
                              rel="noreferrer"
                              className="button-secondary px-5 py-3 text-sm"
                            >
                              Get directions
                              <MapPinned className="h-4 w-4" />
                            </a>
                          </div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-4">
                          <MetricTile
                            label="Monthly Equivalent"
                            value={recurring.label}
                            note={recurring.note}
                          />
                          <MetricTile
                            label="Semester Due"
                            value={
                              selectedOption.semesterDueAmount === null
                                ? "Monthly cadence"
                                : formatHousingCurrencyRange(
                                    selectedOption.semesterDueAmount,
                                    selectedOption.semesterDueAmountUpper,
                                  )
                            }
                            note={selectedOption.leaseTermLabel}
                          />
                          <MetricTile
                            label="School-Year Total"
                            value={schoolYear.label}
                            note={schoolYear.note}
                          />
                          <MetricTile
                            label="Move-In Due"
                            value={moveIn.label}
                            note={moveIn.note}
                          />
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
                          <div className="space-y-4">
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                              <div className="flex items-center gap-2 text-sm font-semibold text-stone-100">
                                <Filter className="h-4 w-4 text-[color:var(--accent-strong)]" />
                                Pricing Waterfall
                              </div>
                              <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <div className="rounded-[1.2rem] border border-white/10 bg-[rgba(8,10,14,0.48)] p-4">
                                  <p className="mini-label">Taxes</p>
                                  <p className="mt-2 text-lg font-semibold text-stone-50">
                                    {getDisclosureLabel(selectedOption.taxesStatus)}
                                  </p>
                                </div>
                                <div className="rounded-[1.2rem] border border-white/10 bg-[rgba(8,10,14,0.48)] p-4">
                                  <p className="mini-label">Non-Utility Fees</p>
                                  <p className="mt-2 text-lg font-semibold text-stone-50">
                                    {getDisclosureLabel(selectedOption.nonUtilityFeesStatus)}
                                  </p>
                                </div>
                                <div className="rounded-[1.2rem] border border-white/10 bg-[rgba(8,10,14,0.48)] p-4">
                                  <p className="mini-label">Refundable Deposit</p>
                                  <p className="mt-2 text-lg font-semibold text-stone-50">
                                    {selectedOption.securityDepositRefundable === null
                                      ? "Not posted"
                                      : formatHousingCurrency(selectedOption.securityDepositRefundable)}
                                  </p>
                                </div>
                                <div className="rounded-[1.2rem] border border-white/10 bg-[rgba(8,10,14,0.48)] p-4">
                                  <p className="mini-label">Lease-Signing Items</p>
                                  <p className="mt-2 text-lg font-semibold text-stone-50">
                                    {selectedOption.adminOrLeaseSigningFees.length
                                      ? selectedOption.adminOrLeaseSigningFees
                                          .map((fee) => formatHousingCurrency(fee.amount))
                                          .join(" + ")
                                      : "None listed"}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 grid gap-3 md:grid-cols-2">
                                {selectedOption.pricingNotes.map((note) => (
                                  <div
                                    key={note}
                                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.02] p-4 text-sm leading-7 text-stone-300"
                                  >
                                    {note}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                              <div className="flex items-center gap-2 text-sm font-semibold text-stone-100">
                                <MapPinned className="h-4 w-4 text-[color:var(--accent-strong)]" />
                                Availability, Source, and Contact Path
                              </div>
                              <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <MetricTile
                                  label="Availability"
                                  value={selectedOption.availabilityLabel}
                                  note="Treat availability timing literally; do not assume a matching August unit exists without direct confirmation."
                                />
                                <MetricTile
                                  label="Last Verified"
                                  value={formatHousingDate(selectedOption.lastVerifiedAt)}
                                  note={`Source type: ${getSourceKindLabel(selectedOption.sourceKind)}.`}
                                />
                              </div>

                              <div className="mt-4 space-y-3">
                                {selectedOption.availabilityNotes.map((note) => (
                                  <div
                                    key={note}
                                    className="rounded-[1.2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 text-sm leading-7 text-stone-300"
                                  >
                                    {note}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-5 rounded-[1.2rem] border border-[rgba(125,183,176,0.22)] bg-[rgba(125,183,176,0.08)] p-4 text-sm leading-7 text-stone-200">
                                {selectedOption.contactPath.note ?? "Use the primary CTA above for the cleanest live contact path."}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                              <div className="flex items-center gap-2 text-sm font-semibold text-stone-100">
                                <Scale className="h-4 w-4 text-[color:var(--accent-strong)]" />
                                Included vs Extra-Cost Matrix
                              </div>
                              <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <div className="rounded-[1.2rem] border border-[rgba(125,183,176,0.22)] bg-[rgba(125,183,176,0.08)] p-4">
                                  <p className="mini-label text-[#b8eee6]">Included</p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedOption.includedUtilities.length ? (
                                      selectedOption.includedUtilities.map((utility) => (
                                        <span
                                          key={utility}
                                          className="rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] px-3 py-1 text-xs font-medium text-[#b8eee6]"
                                        >
                                          {utility}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-sm text-stone-300">None clearly listed.</span>
                                    )}
                                  </div>
                                </div>
                                <div className="rounded-[1.2rem] border border-[rgba(216,170,115,0.22)] bg-[rgba(216,170,115,0.08)] p-4">
                                  <p className="mini-label text-[color:var(--accent-strong)]">Extra Cost</p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedOption.excludedUtilities.length ? (
                                      selectedOption.excludedUtilities.map((utility) => (
                                        <span
                                          key={utility}
                                          className="rounded-full border border-[rgba(216,170,115,0.28)] bg-[rgba(216,170,115,0.12)] px-3 py-1 text-xs font-medium text-[color:var(--accent-strong)]"
                                        >
                                          {utility}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-sm text-stone-300">No explicit extra-cost utility list.</span>
                                    )}
                                  </div>
                                </div>
                                <div className="rounded-[1.2rem] border border-[rgba(208,100,91,0.26)] bg-[rgba(208,100,91,0.08)] p-4">
                                  <p className="mini-label text-[#f0b1aa]">Unknown</p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedOption.unknownUtilities.length ? (
                                      selectedOption.unknownUtilities.map((utility) => (
                                        <span
                                          key={utility}
                                          className="rounded-full border border-[rgba(208,100,91,0.32)] bg-[rgba(208,100,91,0.12)] px-3 py-1 text-xs font-medium text-[#f0c1bb]"
                                        >
                                          {utility}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-sm text-stone-300">No remaining unknown utility buckets.</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                              <div className="flex items-center gap-2 text-sm font-semibold text-stone-100">
                                <MapPinned className="h-4 w-4 text-[color:var(--accent-strong)]" />
                                Setup Snapshot
                              </div>
                              <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <MetricTile
                                  label="Parking"
                                  value={
                                    selectedOption.parkingIncluded === true
                                      ? selectedOption.parkingCost && selectedOption.parkingCost > 0
                                        ? `${formatHousingCurrency(selectedOption.parkingCost)} parking`
                                        : "Included"
                                      : selectedOption.parkingIncluded === false
                                        ? "Not included"
                                        : "Not posted"
                                  }
                                  note="Parking filter only includes listings where a free or clearly included spot is explicitly posted."
                                />
                                <MetricTile
                                  label="Furnishing"
                                  value={getFurnishedStatusLabel(selectedOption.furnishedStatus)}
                                  note="Family share note: common-area furniture is not the same as a furnished bedroom."
                                />
                                <MetricTile
                                  label="Laundry"
                                  value={getLaundryStatusLabel(selectedOption.laundryStatus)}
                                  note="Laundry setup often matters more than a small rent delta for a freshman exemption case."
                                />
                                <MetricTile
                                  label="A/C"
                                  value={getACStatusLabel(selectedOption.ACStatus)}
                                  note="A/C detail stays conservative when the live source is vague."
                                />
                              </div>

                              <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-[rgba(8,10,14,0.48)] p-4">
                                <p className="mini-label">Appliances</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {selectedOption.appliances.length ? (
                                    selectedOption.appliances.map((appliance) => (
                                      <span
                                        key={appliance}
                                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-stone-300"
                                      >
                                        {appliance}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-sm text-stone-300">No appliance list posted beyond the basic listing copy.</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                              <div className="flex items-center gap-2 text-sm font-semibold text-stone-100">
                                <CircleAlert className="h-4 w-4 text-[color:var(--accent-strong)]" />
                                Questions To Ask Before Committing
                              </div>
                              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                                {questions.map((question) => (
                                  <li key={question}>{question}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-8 text-center text-stone-300"
                >
                  Pick a listing from the compare rail or map to open the full pricing and
                  verification view.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
