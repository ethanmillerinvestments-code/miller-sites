"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactNode,
} from "react";

import {
  ArrowUpRight,
  CircleAlert,
  Compass,
  Filter,
  Globe2,
  Landmark,
  MapPinned,
  Orbit,
  SlidersHorizontal,
  X,
} from "lucide-react";

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
  miamiOxfordCampusAnchor,
  sortHousingOptions,
  type HousingClarityStatus,
  type HousingContactPath,
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
      <div className="flex h-[20rem] items-center justify-center rounded-[2rem] border border-[#cabda6] bg-[#f2e8d7] text-sm text-[#61725d] sm:h-[23rem] lg:h-[31rem] xl:h-[36rem]">
        Loading campus orbit…
      </div>
    ),
  },
);

type UnitFilter = "all" | HousingUnitType;
type WalkFilter = "all" | "10" | "15" | "20" | "25";
type BudgetFilter = "all" | "700" | "850" | "1000" | "1250";

const paperPanelClass =
  "rounded-[2rem] border border-[#cabda6] bg-[linear-gradient(180deg,rgba(255,250,241,0.98),rgba(242,233,219,0.94))] shadow-[0_24px_60px_rgba(85,66,44,0.12)]";

const actionBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe6d5]";

const primaryActionClass = `${actionBaseClass} border border-[#40523a] bg-[#40523a] text-[#faf4e8] hover:bg-[#32422d] focus-visible:ring-[#40523a]`;
const secondaryActionClass = `${actionBaseClass} border border-[#c4b69b] bg-[#fbf5e8] text-[#2d3d2a] hover:border-[#af9f82] hover:bg-[#fff9ef] focus-visible:ring-[#8a7c63]`;

const clarityBadgeClasses: Record<HousingClarityStatus, string> = {
  clear: "border-[#87a274] bg-[#eef4e6] text-[#42563b]",
  partial: "border-[#c9a16d] bg-[#fff1dd] text-[#775436]",
  "quote-required": "border-[#d0a190] bg-[#fae6df] text-[#8b4e41]",
};

const confidenceBadgeClasses: Record<HousingSourceConfidence, string> = {
  high: "border-[#87a274] bg-[#eef4e6] text-[#42563b]",
  medium: "border-[#c9a16d] bg-[#fff1dd] text-[#775436]",
  low: "border-[#d0a190] bg-[#fae6df] text-[#8b4e41]",
};

function directionsLink(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

function isExternalHref(href: string) {
  return href.startsWith("http");
}

function getCompactClarityLabel(status: HousingClarityStatus) {
  if (status === "clear") return "Clear";
  if (status === "partial") return "Partial";
  return "Quote";
}

function getCompactConfidenceLabel(confidence: HousingSourceConfidence) {
  if (confidence === "high") return "High";
  if (confidence === "medium") return "Medium";
  return "Low";
}

function getCompactContactLabel(kind: HousingContactPath["kind"]) {
  if (kind === "apply") return "Apply";
  if (kind === "book") return "Book";
  if (kind === "call") return "Call";
  if (kind === "email") return "Email";
  return "Listing";
}

function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const external = isExternalHref(href);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
      className={`${variant === "primary" ? primaryActionClass : secondaryActionClass} ${className}`}
    >
      {children}
    </a>
  );
}

function ActionButton({
  children,
  variant = "secondary",
  className = "",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${variant === "primary" ? primaryActionClass : secondaryActionClass} ${className}`}
    >
      {children}
    </button>
  );
}

function MetricTile({
  label,
  value,
  note,
  accent = "paper",
}: {
  label: string;
  value: string;
  note: string;
  accent?: "paper" | "sage" | "dune";
}) {
  const accentClass =
    accent === "sage"
      ? "border-[#b7c7a8] bg-[#eff4e8]"
      : accent === "dune"
        ? "border-[#d7b78f] bg-[#fff3e4]"
        : "border-[#d7ccb8] bg-[#fbf6ed]";

  return (
    <div className={`rounded-[1.35rem] border p-3.5 sm:p-4 ${accentClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a725f]">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-[#213024] sm:text-lg">{value}</p>
      <p className="mt-1.5 text-xs leading-5 text-[#6a6659] sm:leading-6">{note}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => startTransition(() => onChange(event.target.value))}
        className="w-full rounded-[1.2rem] border border-[#d4c7b2] bg-[#f8f2e8] px-4 py-3 text-sm text-[#213024] focus:border-[#7d8c6f] focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function DetailBody({ option, compact = false }: { option: HousingOption; compact?: boolean }) {
  const recurring = buildRecurringAllInSummary(option);
  const moveIn = buildMoveInDueSummary(option);
  const schoolYear = buildSchoolYearSummary(option);
  const clarity = getHousingClarityStatus(option);
  const questions = getQuestionsToAsk(option);
  const warnings = getMissingCostWarnings(option);
  const blockClass = compact
    ? "rounded-[1.6rem] border border-[#d7ccb8] bg-[#fbf6ed] p-4"
    : "rounded-[1.75rem] border border-[#d7ccb8] bg-[#fbf6ed] p-5 sm:p-6";

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className={blockClass}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${clarityBadgeClasses[clarity]}`}
              >
                <span className="sm:hidden">{getCompactClarityLabel(clarity)}</span>
                <span className="hidden sm:inline">{getHousingClarityLabel(clarity)}</span>
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${confidenceBadgeClasses[option.sourceConfidence]}`}
              >
                <span className="sm:hidden">{getCompactConfidenceLabel(option.sourceConfidence)}</span>
                <span className="hidden sm:inline">{getSourceConfidenceLabel(option.sourceConfidence)}</span>
              </span>
              <span className="inline-flex rounded-full border border-[#d7ccb8] bg-[#f5eedf] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a6659]">
                {getSourceKindLabel(option.sourceKind)}
              </span>
            </div>

            <h3 className={`mt-4 font-semibold text-[#213024] ${compact ? "text-2xl" : "text-3xl"}`}>
              {option.propertyName}
              {" "}
              <span className={`${compact ? "text-lg" : "text-xl"} font-normal text-[#5d6859]`}>
                {option.optionName}
              </span>
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#655f53]">{option.address}</p>
            <p className="mt-3 text-sm leading-7 text-[#4a5c45]">
              {option.walkMinutes} minute estimated walk
              {" · "}
              {option.distanceMiles.toFixed(2)} miles
              {" · "}
              {getUnitTypeLabel(option.unitType)}
              {" · "}
              Compared to {miamiOxfordCampusAnchor.label}.
            </p>
          </div>

          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <ActionLink href={option.contactPath.href} className="w-full sm:w-auto">
              {option.contactPath.label}
              <ArrowUpRight className="h-4 w-4" />
            </ActionLink>
            <ActionLink href={option.sourceUrl} variant="secondary" className="w-full sm:w-auto">
              Open source listing
              <ArrowUpRight className="h-4 w-4" />
            </ActionLink>
            <ActionLink
              href={directionsLink(option.address)}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Get directions
              <MapPinned className="h-4 w-4" />
            </ActionLink>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Monthly Equivalent" value={recurring.label} note={recurring.note} accent="sage" />
          <MetricTile
            label="Semester Due"
            value={
              option.semesterDueAmount === null
                ? "Monthly cadence"
                : formatHousingCurrencyRange(option.semesterDueAmount, option.semesterDueAmountUpper)
            }
            note={option.leaseTermLabel}
          />
          <MetricTile label="School-Year Total" value={schoolYear.label} note={schoolYear.note} accent="dune" />
          <MetricTile label="Move-In Due" value={moveIn.label} note={moveIn.note} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-4">
          <div className={blockClass}>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#223126]">
              <Filter className="h-4 w-4 text-[#5f7456]" />
              Pricing waterfall
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricTile label="Taxes" value={getDisclosureLabel(option.taxesStatus)} note="Only shown when the live source explicitly says so." />
              <MetricTile label="Non-Utility Fees" value={getDisclosureLabel(option.nonUtilityFeesStatus)} note="Admin or lease-signing charges are never guessed." />
              <MetricTile
                label="Refundable Deposit"
                value={
                  option.securityDepositRefundable === null
                    ? "Not posted"
                    : formatHousingCurrency(option.securityDepositRefundable)
                }
                note="Treated as move-in cash when it is explicitly listed."
              />
              <MetricTile
                label="Lease-Signing Items"
                value={
                  option.adminOrLeaseSigningFees.length
                    ? option.adminOrLeaseSigningFees
                        .map((fee) => (fee.amount === null ? fee.label : formatHousingCurrency(fee.amount)))
                        .join(" + ")
                    : "None listed"
                }
                note="Shown as posted, including partial unknowns."
              />
            </div>

            <div className="mt-4 grid gap-3">
              {option.pricingNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[1.2rem] border border-[#ddd3c3] bg-[#fffaf1] p-4 text-sm leading-7 text-[#5f5b4e]"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div className={blockClass}>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#223126]">
              <Landmark className="h-4 w-4 text-[#5f7456]" />
              Availability and source trail
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Availability"
                value={option.availabilityLabel}
                note="Treat timing literally. Do not assume a matching August unit exists without direct confirmation."
                accent="dune"
              />
              <MetricTile
                label="Last Verified"
                value={formatHousingDate(option.lastVerifiedAt)}
                note={`Source type: ${getSourceKindLabel(option.sourceKind)}.`}
              />
            </div>

            <div className="mt-4 grid gap-3">
              {option.availabilityNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[1.2rem] border border-[#ddd3c3] bg-[#fffaf1] p-4 text-sm leading-7 text-[#5f5b4e]"
                >
                  {note}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.2rem] border border-[#b7c7a8] bg-[#eef4e8] p-4 text-sm leading-7 text-[#42563b]">
              {option.contactPath.note ?? "Use the primary action link above for the cleanest live contact path."}
            </div>
          </div>

          <div className={blockClass}>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#223126]">
              <CircleAlert className="h-4 w-4 text-[#9b6a50]" />
              Missing-cost warnings
            </div>
            {warnings.length ? (
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#705243]">
                {warnings.map((warning) => (
                  <li key={warning} className="rounded-[1.1rem] border border-[#ead1c6] bg-[#fff3ef] px-4 py-3">
                    {warning}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[#5f5b4e]">
                No major missing-cost warnings beyond ordinary usage-based utilities.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className={blockClass}>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#223126]">
              <Globe2 className="h-4 w-4 text-[#5f7456]" />
              Included vs extra-cost matrix
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[#b7c7a8] bg-[#eef4e8] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#42563b]">
                  Included
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {option.includedUtilities.length ? (
                    option.includedUtilities.map((utility) => (
                      <span
                        key={utility}
                        className="rounded-full border border-[#a8bc99] bg-[#f7fbf1] px-3 py-1 text-xs font-medium text-[#42563b]"
                      >
                        {utility}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#5f5b4e]">None clearly listed.</span>
                  )}
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[#d7b78f] bg-[#fff3e4] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#775436]">
                  Extra Cost
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {option.excludedUtilities.length ? (
                    option.excludedUtilities.map((utility) => (
                      <span
                        key={utility}
                        className="rounded-full border border-[#d7b78f] bg-[#fff8ef] px-3 py-1 text-xs font-medium text-[#775436]"
                      >
                        {utility}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#5f5b4e]">No explicit extra-cost utility list.</span>
                  )}
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[#d6aea0] bg-[#fae6df] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b4e41]">
                  Unknown
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {option.unknownUtilities.length ? (
                    option.unknownUtilities.map((utility) => (
                      <span
                        key={utility}
                        className="rounded-full border border-[#d6aea0] bg-[#fff4ef] px-3 py-1 text-xs font-medium text-[#8b4e41]"
                      >
                        {utility}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#5f5b4e]">No remaining unknown utility buckets.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={blockClass}>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#223126]">
              <Compass className="h-4 w-4 text-[#5f7456]" />
              Setup snapshot
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Parking"
                value={
                  option.parkingIncluded === true
                    ? option.parkingCost && option.parkingCost > 0
                      ? `${formatHousingCurrency(option.parkingCost)} parking`
                      : "Included"
                    : option.parkingIncluded === false
                      ? "Not included"
                      : "Not posted"
                }
                note="Filter only keeps listings where a free or clearly included spot is explicitly posted."
              />
              <MetricTile
                label="Furnishing"
                value={getFurnishedStatusLabel(option.furnishedStatus)}
                note="Shared-living furniture is not the same as a furnished bedroom."
              />
              <MetricTile
                label="Laundry"
                value={getLaundryStatusLabel(option.laundryStatus)}
                note="Laundry setup can matter more than a small rent delta for a freshman exemption case."
              />
              <MetricTile
                label="A/C"
                value={getACStatusLabel(option.ACStatus)}
                note="A/C detail stays conservative when the live source is vague."
              />
            </div>

            <div className="mt-4 rounded-[1.2rem] border border-[#ddd3c3] bg-[#fffaf1] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a725f]">
                Appliances
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {option.appliances.length ? (
                  option.appliances.map((appliance) => (
                    <span
                      key={appliance}
                      className="rounded-full border border-[#d7ccb8] bg-[#f5eedf] px-3 py-1 text-xs font-medium text-[#5f5b4e]"
                    >
                      {appliance}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#5f5b4e]">
                    No appliance list posted beyond the basic listing copy.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={blockClass}>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#223126]">
              <CircleAlert className="h-4 w-4 text-[#5f7456]" />
              Questions to ask before committing
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f5b4e]">
              {questions.map((question) => (
                <li key={question} className="rounded-[1.1rem] border border-[#ddd3c3] bg-[#fffaf1] px-4 py-3">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
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
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
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
  const rankingPreview = visibleOptions.slice(0, 5);

  useEffect(() => {
    if (!visibleOptions.length) {
      setSelectedId(null);
      setIsMobileDetailOpen(false);
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

  useEffect(() => {
    if (!isMobileDetailOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileDetailOpen]);

  return (
    <section className="section-pad relative overflow-hidden bg-[#ddd4bf] pb-28 lg:pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 14% 16%, rgba(122,149,111,0.16), transparent 22%), radial-gradient(circle at 86% 12%, rgba(175,134,96,0.18), transparent 18%), linear-gradient(180deg, rgba(255,250,241,0.48), rgba(225,214,193,0.52)), repeating-radial-gradient(circle at 60% 30%, rgba(90,103,79,0.08) 0, rgba(90,103,79,0.08) 1px, transparent 1px, transparent 18px)",
        }}
      />

      <div className="section-shell relative space-y-6">
        <ScrollReveal direction="up">
          <div className={`${paperPanelClass} relative overflow-hidden p-5 sm:p-7`}>
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-[32%] lg:block"
              style={{
                background:
                  "radial-gradient(circle at 52% 40%, rgba(122,149,111,0.24), transparent 24%), radial-gradient(circle at 50% 50%, rgba(247,240,227,0.78) 0, rgba(247,240,227,0.78) 35%, transparent 36%), radial-gradient(circle at 50% 50%, rgba(96,118,88,0.12) 42%, transparent 43%), radial-gradient(circle at 50% 50%, rgba(96,118,88,0.1) 56%, transparent 57%)",
              }}
            />

            <div className="relative grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b57]">
                  Campus Orbit Atlas
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#213024] sm:text-[2.6rem]">
                  Start at campus, then orbit outward to the clearest true fits.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f5b4e] sm:text-base">
                  This route now behaves like a field atlas instead of the main site. Every walk
                  time and distance compares back to one real anchor:
                  {" "}
                  {miamiOxfordCampusAnchor.label},
                  {" "}
                  {miamiOxfordCampusAnchor.address}.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4c5c45]">
                  Best overall fit still ranks verified campus practicality first, then known
                  all-in affordability, then source confidence. Cheap-but-fuzzy listings stay below
                  slightly pricier options with cleaner paperwork.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-[#b7c7a8] bg-[#eff4e8] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#42563b]">
                      Fixed Comparison Point
                    </p>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9db291] bg-[#f6fbef] text-[#42563b]">
                      <Globe2 className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-[#213024]">
                    {miamiOxfordCampusAnchor.name}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#4c5c45]">
                    The map draws a campus line to whichever property you select, so the tradeoff
                    is always visible.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-[#d7b78f] bg-[#fff3e4] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#775436]">
                      Visible Shortlist
                    </p>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7b78f] bg-[#fff8ef] text-[#775436]">
                      <Orbit className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-[#213024]">{summary.totalOptions}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6e5b42]">
                    Listings left after filters, each with a legitimate apply/contact path.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
                  Search
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => startTransition(() => setSearchQuery(event.target.value))}
                  placeholder="Try furnished, Vine, Sycamore, or studio"
                  className="w-full rounded-[1.2rem] border border-[#d4c7b2] bg-[#f8f2e8] px-4 py-3 text-sm text-[#213024] placeholder:text-[#938c7f] focus:border-[#7d8c6f] focus:outline-none"
                />
              </label>

              <FilterSelect label="Sort" value={sortMode} onChange={(value) => setSortMode(value as HousingSortKey)}>
                <option value="best-fit">Best overall fit</option>
                <option value="walk-asc">Shortest walk</option>
                <option value="monthly-equivalent-asc">Lowest monthly equivalent</option>
                <option value="move-in-asc">Lowest move-in due</option>
                <option value="name-asc">Alphabetical</option>
              </FilterSelect>

              <FilterSelect label="Unit type" value={unitFilter} onChange={(value) => setUnitFilter(value as UnitFilter)}>
                <option value="all">Studios, efficiencies, and 1BRs</option>
                <option value="studio">Studios only</option>
                <option value="efficiency">Efficiencies only</option>
                <option value="one-bedroom">True 1BRs only</option>
              </FilterSelect>

              <FilterSelect label="Max walk" value={maxWalk} onChange={(value) => setMaxWalk(value as WalkFilter)}>
                <option value="all">Any practical walk</option>
                <option value="10">10 min or less</option>
                <option value="15">15 min or less</option>
                <option value="20">20 min or less</option>
                <option value="25">25 min or less</option>
              </FilterSelect>

              <FilterSelect label="Max monthly equivalent" value={maxMonthly} onChange={(value) => setMaxMonthly(value as BudgetFilter)}>
                <option value="all">No cap</option>
                <option value="700">$700/mo or less</option>
                <option value="850">$850/mo or less</option>
                <option value="1000">$1,000/mo or less</option>
                <option value="1250">$1,250/mo or less</option>
              </FilterSelect>

              <div className="rounded-[1.35rem] border border-[#d4c7b2] bg-[#f8f2e8] p-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
                  <SlidersHorizontal className="h-4 w-4" />
                  Toggle Layers
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    {
                      checked: postedPriceOnly,
                      label: "Posted prices",
                      onChange: (value: boolean) => setPostedPriceOnly(value),
                    },
                    {
                      checked: furnishedOnly,
                      label: "Furnished only",
                      onChange: (value: boolean) => setFurnishedOnly(value),
                    },
                    {
                      checked: utilitiesIncludedOnly,
                      label: "Utilities included",
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
                      className="inline-flex items-center gap-2 rounded-[1rem] border border-[#ddd3c3] bg-[#fffaf1] px-3 py-2.5 text-xs text-[#465444]"
                    >
                      <input
                        type="checkbox"
                        checked={toggle.checked}
                        onChange={(event) => startTransition(() => toggle.onChange(event.target.checked))}
                        className="h-4 w-4 rounded border-[#cbbfa9] accent-[#5f7456]"
                      />
                      {toggle.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                label="Posted Prices"
                value={`${summary.postedPriceOptions}/${summary.totalOptions}`}
                note="Cards with a real posted price instead of call-for-details."
                accent="sage"
              />
              <MetricTile
                label="Campus Walk Band"
                value={`${summary.walkMinutesMin ?? "?"}-${summary.walkMinutesMax ?? "?"} min`}
                note="All measured back to Armstrong / Uptown."
              />
              <MetricTile
                label="Monthly Band"
                value={formatHousingCurrencyRange(summary.monthlyEquivalentMin, summary.monthlyEquivalentMax)}
                note="Semester-style pricing is normalized to a 10-month school-year equivalent."
                accent="dune"
              />
              <MetricTile
                label="Cost Clarity"
                value={`${summary.clarityCounts.clear} clear / ${summary.clarityCounts.partial} partial`}
                note="Quote-required options stay visible when they still solve location or furnishing needs."
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <ScrollReveal direction="left">
              <div className={`${paperPanelClass} p-4 sm:p-5`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b57]">
                      Campus Orbit
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-[#213024] sm:text-[2.2rem]">
                      Select a property and draw the line back to campus.
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5f5b4e]">
                      The fixed campus point makes the tradeoff visible immediately: how much you
                      save, how much farther you walk, and how solid the source looks.
                    </p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7ccb8] bg-[#fffaf1] text-[#5f7456]">
                    <MapPinned className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-5">
                  <MiamiHousingLeafletMap
                    options={visibleOptions}
                    selectedId={selectedId}
                    onSelect={(id) => {
                      setSelectedId(id);
                      setShouldScrollToCard(true);
                    }}
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up">
              <div className={`${paperPanelClass} p-4 sm:p-5`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b57]">
                      Best-Fit Orbit
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-[#213024]">
                      Current top campus-first picks
                    </h3>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#d7b78f] bg-[#fff3e4] px-4 py-3 text-sm leading-7 text-[#705243]">
                    Rank order is walk first, clarity second, confidence third.
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {rankingPreview.map((option, index) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedId(option.id)}
                      className={`rounded-[1.45rem] border p-4 text-left transition ${
                        selectedId === option.id
                          ? "border-[#7d8c6f] bg-[#eff4e8]"
                          : "border-[#d7ccb8] bg-[#fffaf1] hover:border-[#b5a78d]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a725f]">
                            Orbit #{index + 1}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-[#213024]">{option.propertyName}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7b776b]">
                            {getUnitTypeLabel(option.unitType)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a725f]">
                            Score
                          </p>
                          <p className="mt-2 text-lg font-semibold text-[#213024]">
                            {getRankingScore(option).toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[#5f5b4e]">
                        {option.walkMinutes} min to campus
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
              <div className={`${paperPanelClass} p-4 sm:p-5`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b57]">
                      Field Shortlist
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-[#213024] sm:text-[2.25rem]">
                      Compare the units that survive the campus orbit.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f5b4e]">
                      Every card keeps the legitimate action path close: direct property page,
                      direct leasing page, or a manager phone line when that is the real route.
                    </p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7ccb8] bg-[#fffaf1] text-[#5f7456]">
                    <Compass className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-5 space-y-3 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-1">
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
                          className={`rounded-[1.7rem] border p-4 text-left transition ${
                            isSelected
                              ? "border-[#7d8c6f] bg-[#eff4e8] shadow-[0_22px_48px_rgba(91,110,85,0.14)]"
                              : "border-[#d7ccb8] bg-[#fffaf1] hover:border-[#b5a78d]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-[#d7ccb8] bg-[#f5eedf] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a6659]">
                                  #{index + 1}
                                </span>
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${clarityBadgeClasses[clarity]}`}
                                >
                                  <span className="sm:hidden">{getCompactClarityLabel(clarity)}</span>
                                  <span className="hidden sm:inline">{getHousingClarityLabel(clarity)}</span>
                                </span>
                              </div>
                              <h3 className="mt-3 text-xl font-semibold text-[#213024]">
                                {option.propertyName}
                              </h3>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7b776b]">
                                {getUnitTypeLabel(option.unitType)}
                              </p>
                            </div>
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${confidenceBadgeClasses[option.sourceConfidence]}`}
                            >
                              <span className="sm:hidden">
                                {getCompactConfidenceLabel(option.sourceConfidence)}
                              </span>
                              <span className="hidden sm:inline">
                                {getSourceConfidenceLabel(option.sourceConfidence)}
                              </span>
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <MetricTile
                              label="Campus Walk"
                              value={`${option.walkMinutes} min`}
                              note={`${option.distanceMiles.toFixed(2)} mi to Armstrong.`}
                              accent="sage"
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
                              note={
                                option.semesterDueAmount === null
                                  ? option.leaseTermLabel
                                  : "Per rent cycle before spring repeats."
                              }
                            />
                            <MetricTile label="Move-In Due" value={moveIn.label} note={moveIn.note} accent="dune" />
                          </div>

                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a725f]">
                                Top 3 perks
                              </p>
                              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5f5b4e]">
                                {option.perks.slice(0, 3).map((perk) => (
                                  <li key={perk} className="rounded-[1rem] bg-[#f5eedf] px-3 py-2">
                                    {perk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a725f]">
                                Top 2 missing-cost warnings
                              </p>
                              {warnings.length ? (
                                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#705243]">
                                  {warnings.map((warning) => (
                                    <li
                                      key={warning}
                                      className="rounded-[1rem] border border-[#ead1c6] bg-[#fff3ef] px-3 py-2"
                                    >
                                      {warning}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-3 rounded-[1rem] bg-[#f5eedf] px-3 py-2 text-sm leading-6 text-[#5f5b4e]">
                                  No major missing-cost flags beyond ordinary usage-based utilities.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 grid gap-2 sm:grid-cols-2">
                            <ActionLink
                              href={option.contactPath.href}
                              className="w-full"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {option.contactPath.label}
                              <ArrowUpRight className="h-4 w-4" />
                            </ActionLink>
                            <ActionButton
                              className="w-full"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedId(option.id);
                                setIsMobileDetailOpen(true);
                              }}
                            >
                              Open habitat detail
                              <Compass className="h-4 w-4" />
                            </ActionButton>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="rounded-[1.8rem] border border-[#d7ccb8] bg-[#fffaf1] p-8 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d7ccb8] bg-[#f5eedf] text-[#5f7456]">
                        <Filter className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold text-[#213024]">
                        No listings match that orbit.
                      </h3>
                      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5f5b4e]">
                        Loosen the walk cap, allow unpriced listings back in, or remove the
                        furnished or parking filters to widen the atlas again.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {selectedOption ? (
          <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
            <div className="rounded-[1.5rem] border border-[#c5b79d] bg-[rgba(250,244,233,0.96)] p-3 shadow-[0_18px_40px_rgba(77,61,39,0.18)] backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
                    Selected habitat
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#213024]">
                    {selectedOption.propertyName}
                  </p>
                  <p className="mt-1 text-xs text-[#5f5b4e]">
                    {selectedOption.walkMinutes} min to campus
                    {" · "}
                    {buildRecurringAllInSummary(selectedOption).label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDetailOpen(true)}
                  className="rounded-full border border-[#d4c7b2] bg-[#fffaf1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#40523a]"
                >
                  Detail
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <ActionLink href={selectedOption.contactPath.href} className="w-full px-3 py-2.5 text-xs">
                  {getCompactContactLabel(selectedOption.contactPath.kind)}
                  <ArrowUpRight className="h-4 w-4" />
                </ActionLink>
                <ActionButton className="w-full px-3 py-2.5 text-xs" onClick={() => setIsMobileDetailOpen(true)}>
                  Deep view
                  <Compass className="h-4 w-4" />
                </ActionButton>
              </div>
            </div>
          </div>
        ) : null}

        <AnimatePresence>
          {selectedOption && isMobileDetailOpen ? (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                aria-label="Close property detail view"
                onClick={() => setIsMobileDetailOpen(false)}
                className="absolute inset-0 bg-[rgba(31,41,31,0.46)] backdrop-blur-sm"
              />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-hidden rounded-t-[2rem] border-t border-[#c8bba1] bg-[#efe6d5]"
              >
                <div className="flex items-center justify-between border-b border-[#d7ccb8] px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5b6b57]">
                      Property deep view
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#213024]">
                      {selectedOption.propertyName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileDetailOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7ccb8] bg-[#fffaf1] text-[#40523a]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div
                  className="max-h-[calc(90vh-4.5rem)] overflow-y-auto px-4 pt-4"
                  style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
                >
                  <DetailBody option={selectedOption} compact />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="hidden lg:block">
          <ScrollReveal direction="up">
            <div className={`${paperPanelClass} p-5 sm:p-6`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b57]">
                    Habitat Detail
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#213024] sm:text-[2.35rem]">
                    Drill into one property without losing the campus context.
                  </h2>
                </div>
                {selectedOption ? (
                  <div className="rounded-[1.3rem] border border-[#d7ccb8] bg-[#fffaf1] px-4 py-3 text-sm text-[#5f5b4e]">
                    Selected:
                    {" "}
                    <span className="font-semibold text-[#213024]">{selectedOption.propertyName}</span>
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
                    <DetailBody option={selectedOption} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-6 rounded-[1.7rem] border border-[#d7ccb8] bg-[#fffaf1] p-8 text-center text-[#5f5b4e]"
                  >
                    Pick a listing from the shortlist or the map to open the full campus-centered
                    detail view.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
