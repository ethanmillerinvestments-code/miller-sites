"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  CalendarClock,
  Car,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  Home,
  Info,
  Map,
  MapPin,
  Search,
  ShieldCheck,
  Snowflake,
  Waves,
  X,
} from "lucide-react";

import {
  buildHousingSummary,
  buildMoveInDueSummary,
  buildRecurringAllInSummary,
  filterHousingOptions,
  formatHousingCurrency,
  formatHousingDate,
  getACStatusLabel,
  getArmstrongDistance,
  getDisclosureLabel,
  getFurnishedStatusLabel,
  getHousingClarityStatus,
  getLaundryStatusLabel,
  getRecCenterDistance,
  getSourceConfidenceLabel,
  getSourceKindLabel,
  getUnitTypeLabel,
  miamiOxfordCampusAnchor,
  miamiOxfordRecCenterAnchor,
  sortHousingOptions,
  type HousingClarityStatus,
  type HousingOption,
  type HousingSortKey,
  type HousingUnitType,
} from "@/lib/housing/miamiOxfordHousing";

const MiamiHousingLeafletMap = dynamic(
  () => import("@/components/housing/MiamiHousingLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[26rem] items-center justify-center bg-slate-200 text-sm text-slate-500">
        Loading map
      </div>
    ),
  },
);

type UnitFilter = "all" | HousingUnitType;
type WalkFilter = "all" | "10" | "15" | "20" | "25";
type BudgetFilter = "all" | "700" | "850" | "1000" | "1250";

const clarityBadgeClasses: Record<HousingClarityStatus, string> = {
  clear: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partial: "bg-amber-50 text-amber-800 ring-amber-200",
  "quote-required": "bg-rose-50 text-rose-800 ring-rose-200",
};

function directionsLink(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

function isExternalHref(href: string) {
  return href.startsWith("http");
}

function formatCompactPrice(option: HousingOption) {
  const recurring = buildRecurringAllInSummary(option);
  if (option.monthlyEquivalent === null) return recurring.label;
  return recurring.label.replace(" equivalent", "");
}

function formatBedBath(option: HousingOption) {
  const bedLabel = option.bedrooms === 1 ? "1 bed" : `${option.bedrooms} beds`;
  const bathLabel = option.bathrooms === 1 ? "1 bath" : `${option.bathrooms} baths`;
  return `${bedLabel} · ${bathLabel} · ${getUnitTypeLabel(option.unitType)}`;
}

function formatOptionalNumber(amount: number | null) {
  return amount === null ? "Not posted" : formatHousingCurrency(amount);
}

function utilitiesSummary(option: HousingOption) {
  if (option.includedUtilities.length) {
    return option.includedUtilities.join(", ");
  }

  if (option.unknownUtilities.length) {
    return `Unknown: ${option.unknownUtilities.join(", ")}`;
  }

  if (option.excludedUtilities.length) {
    return `Tenant pays: ${option.excludedUtilities.join(", ")}`;
  }

  return "Not posted";
}

function parkingSummary(option: HousingOption) {
  if (option.parkingIncluded === true) {
    return option.parkingCost && option.parkingCost > 0
      ? `${formatHousingCurrency(option.parkingCost)} parking`
      : "Included";
  }

  if (option.parkingIncluded === false) return "Not included";
  return "Not posted";
}

function SelectControl({
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
    <label className="min-w-0">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => startTransition(() => onChange(event.target.value))}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
    </label>
  );
}

function DistanceBadge({
  icon,
  label,
  minutes,
  miles,
  tone,
}: {
  icon: ReactNode;
  label: string;
  minutes: number;
  miles: number;
  tone: "blue" | "orange";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-100 bg-blue-50 text-blue-900"
      : "border-orange-100 bg-orange-50 text-orange-900";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs ${toneClass}`}>
      {icon}
      <span className="font-semibold">{minutes} min</span>
      <span className="text-current/70">{miles.toFixed(2)} mi {label}</span>
    </span>
  );
}

function ListingCard({
  option,
  selected,
  onSelect,
  onHoverChange,
  onOpenMap,
}: {
  option: HousingOption;
  selected: boolean;
  onSelect: () => void;
  onHoverChange: (id: string | null) => void;
  onOpenMap: () => void;
}) {
  const armstrong = getArmstrongDistance(option);
  const rec = getRecCenterDistance(option);
  const clarity = getHousingClarityStatus(option);

  return (
    <article
      onMouseEnter={() => onHoverChange(option.id)}
      onMouseLeave={() => onHoverChange(null)}
      className={`rounded-xl border bg-white shadow-sm transition ${
        selected
          ? "border-blue-400 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <button type="button" onClick={onSelect} className="block w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[1.35rem] font-semibold leading-none text-slate-950">
              {formatCompactPrice(option)}
            </p>
            <h2 className="mt-2 truncate text-base font-semibold text-slate-950">
              {option.propertyName}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{option.address}</p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ${clarityBadgeClasses[clarity]}`}
          >
            {clarity === "quote-required" ? "Quote" : clarity}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-700">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-slate-400" />
            {formatBedBath(option)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-slate-400" />
            {option.squareFeet === null ? "Sq ft not posted" : `${option.squareFeet} sq ft`}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <DistanceBadge
            icon={<Building2 className="h-3.5 w-3.5" />}
            label="to class"
            minutes={armstrong.walkMinutes}
            miles={armstrong.distanceMiles}
            tone="blue"
          />
          <DistanceBadge
            icon={<Dumbbell className="h-3.5 w-3.5" />}
            label="to Rec"
            minutes={rec.walkMinutes}
            miles={rec.distanceMiles}
            tone="orange"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <CalendarClock className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{option.availabilityLabel}</span>
        </div>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
        <button
          type="button"
          onClick={onOpenMap}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          aria-label={`Show ${option.propertyName} on map`}
        >
          <MapPin className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 justify-end gap-2">
          <a
            href={option.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Source
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={option.contactPath.href}
            target={isExternalHref(option.contactPath.href) ? "_blank" : undefined}
            rel={isExternalHref(option.contactPath.href) ? "noreferrer" : undefined}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Contact
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium leading-5 text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function DetailPanel({
  option,
  onClose,
  compact = false,
}: {
  option: HousingOption;
  onClose?: () => void;
  compact?: boolean;
}) {
  const recurring = buildRecurringAllInSummary(option);
  const moveIn = buildMoveInDueSummary(option);
  const armstrong = getArmstrongDistance(option);
  const rec = getRecCenterDistance(option);
  const clarity = getHousingClarityStatus(option);

  return (
    <aside className={`bg-white ${compact ? "" : "rounded-xl border border-slate-200 shadow-sm"}`}>
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[1.45rem] font-semibold leading-none text-slate-950">
              {recurring.label}
            </p>
            <h2 className="mt-2 text-lg font-semibold leading-tight text-slate-950">
              {option.propertyName}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-600">{option.address}</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label="Close listing details"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <DistanceBadge
            icon={<Building2 className="h-3.5 w-3.5" />}
            label="to class"
            minutes={armstrong.walkMinutes}
            miles={armstrong.distanceMiles}
            tone="blue"
          />
          <DistanceBadge
            icon={<Dumbbell className="h-3.5 w-3.5" />}
            label="to Rec"
            minutes={rec.walkMinutes}
            miles={rec.distanceMiles}
            tone="orange"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ${clarityBadgeClasses[clarity]}`}
          >
            {clarity === "clear" ? "Clear costs" : clarity === "partial" ? "Some unknowns" : "Quote required"}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
            {getSourceConfidenceLabel(option.sourceConfidence)}
          </span>
        </div>
      </div>

      <div className="max-h-[17rem] overflow-y-auto px-4 lg:max-h-[18.5rem]">
        <DetailRow
          icon={<Home className="h-4 w-4" />}
          label="Layout"
          value={`${formatBedBath(option)} · ${option.squareFeet === null ? "sq ft not posted" : `${option.squareFeet} sq ft`}`}
        />
        <DetailRow icon={<CalendarClock className="h-4 w-4" />} label="Lease" value={option.leaseTermLabel} />
        <DetailRow icon={<CheckCircle2 className="h-4 w-4" />} label="Availability" value={option.availabilityLabel} />
        <DetailRow icon={<Info className="h-4 w-4" />} label="Move-In Due" value={moveIn.label} />
        <DetailRow icon={<Waves className="h-4 w-4" />} label="Utilities" value={utilitiesSummary(option)} />
        <DetailRow icon={<Car className="h-4 w-4" />} label="Parking" value={parkingSummary(option)} />
        <DetailRow icon={<BedDouble className="h-4 w-4" />} label="Furnished" value={getFurnishedStatusLabel(option.furnishedStatus)} />
        <DetailRow icon={<Bath className="h-4 w-4" />} label="Laundry" value={getLaundryStatusLabel(option.laundryStatus)} />
        <DetailRow icon={<Snowflake className="h-4 w-4" />} label="A/C" value={getACStatusLabel(option.ACStatus)} />
        <DetailRow
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Source"
          value={`${getSourceKindLabel(option.sourceKind)} · ${getSourceConfidenceLabel(option.sourceConfidence)} · Verified ${formatHousingDate(option.lastVerifiedAt)}`}
        />
        <DetailRow
          icon={<Info className="h-4 w-4" />}
          label="Cost Gaps"
          value={`Taxes: ${getDisclosureLabel(option.taxesStatus)} · Required fees: ${getDisclosureLabel(option.nonUtilityFeesStatus)} · Deposit: ${formatOptionalNumber(option.securityDepositRefundable)}`}
        />
      </div>

      <div className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-3">
        <a
          href={option.contactPath.href}
          target={isExternalHref(option.contactPath.href) ? "_blank" : undefined}
          rel={isExternalHref(option.contactPath.href) ? "noreferrer" : undefined}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {option.contactPath.kind === "call" ? "Call" : "Contact"}
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <a
          href={option.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Source
          <ExternalLink className="h-4 w-4" />
        </a>
        <a
          href={directionsLink(option.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Route
          <MapPin className="h-4 w-4" />
        </a>
      </div>
    </aside>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <Search className="mx-auto h-8 w-8 text-slate-400" />
      <h2 className="mt-4 text-lg font-semibold text-slate-950">No listings match.</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Widen the walk range, increase the budget cap, or clear the search.
      </p>
    </div>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export default function MiamiHousingExplorer({ options }: { options: HousingOption[] }) {
  const [unitFilter, setUnitFilter] = useState<UnitFilter>("all");
  const [maxWalk, setMaxWalk] = useState<WalkFilter>("all");
  const [maxMonthly, setMaxMonthly] = useState<BudgetFilter>("all");
  const [sortMode, setSortMode] = useState<HousingSortKey>("best-fit");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(options[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
  const deferredQuery = useDeferredValue(searchQuery);
  const isDesktop = useIsDesktop();

  const visibleOptions = useMemo(
    () =>
      sortHousingOptions(
        filterHousingOptions(options, {
          unitTypes: unitFilter === "all" ? undefined : [unitFilter],
          maxWalkMinutes: maxWalk === "all" ? undefined : Number(maxWalk),
          maxMonthlyEquivalent: maxMonthly === "all" ? undefined : Number(maxMonthly),
          searchQuery: deferredQuery,
        }),
        sortMode,
      ),
    [deferredQuery, maxMonthly, maxWalk, options, sortMode, unitFilter],
  );

  const summary = buildHousingSummary(visibleOptions);
  const allSummary = buildHousingSummary(options);
  const selectedOption = selectedId
    ? visibleOptions.find((option) => option.id === selectedId) ?? null
    : null;
  const activeOption = selectedOption ?? visibleOptions[0] ?? null;

  useEffect(() => {
    if (!visibleOptions.length) {
      setSelectedId(null);
      setHoveredId(null);
      return;
    }

    if (!selectedId || !visibleOptions.some((option) => option.id === selectedId)) {
      setSelectedId(visibleOptions[0]!.id);
    }
  }, [selectedId, visibleOptions]);

  useEffect(() => {
    if (hoveredId && !visibleOptions.some((option) => option.id === hoveredId)) {
      setHoveredId(null);
    }
  }, [hoveredId, visibleOptions]);

  useEffect(() => {
    if (!isMobileMapOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMapOpen]);

  function selectListing(id: string, openMobileMap = false) {
    setSelectedId(id);
    if (openMobileMap) {
      setIsMobileMapOpen(true);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[1800px] px-3 pb-16 pt-20 text-slate-950 sm:px-5 lg:h-screen lg:px-6 lg:pb-6 lg:pt-20">
      <div className="grid gap-4 lg:h-full lg:grid-cols-[minmax(22rem,29rem)_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          <div className="border-b border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Private · Noindex · August 2026
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-[-0.01em] text-slate-950">
                  Miami Oxford housing
                </h1>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {summary.totalOptions} of {allSummary.totalOptions} studio, efficiency, and 1BR options
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMapOpen(true)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg lg:hidden"
                aria-label="Open map"
              >
                <Map className="h-5 w-5" />
              </button>
            </div>

            <label className="relative mt-4 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => startTransition(() => setSearchQuery(event.target.value))}
                placeholder="Search by building, street, utility, or feature"
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SelectControl
                label="Unit"
                value={unitFilter}
                onChange={(value) => setUnitFilter(value as UnitFilter)}
              >
                <option value="all">All small units</option>
                <option value="studio">Studios</option>
                <option value="efficiency">Efficiencies</option>
                <option value="one-bedroom">1BRs</option>
              </SelectControl>
              <SelectControl
                label="Walk"
                value={maxWalk}
                onChange={(value) => setMaxWalk(value as WalkFilter)}
              >
                <option value="all">Any walk</option>
                <option value="10">10 min or less</option>
                <option value="15">15 min or less</option>
                <option value="20">20 min or less</option>
                <option value="25">25 min or less</option>
              </SelectControl>
              <SelectControl
                label="Budget"
                value={maxMonthly}
                onChange={(value) => setMaxMonthly(value as BudgetFilter)}
              >
                <option value="all">Any posted price</option>
                <option value="700">$700/mo or less</option>
                <option value="850">$850/mo or less</option>
                <option value="1000">$1,000/mo or less</option>
                <option value="1250">$1,250/mo or less</option>
              </SelectControl>
              <SelectControl
                label="Sort"
                value={sortMode}
                onChange={(value) => setSortMode(value as HousingSortKey)}
              >
                <option value="best-fit">Best fit</option>
                <option value="walk-asc">Shortest walk</option>
                <option value="monthly-equivalent-asc">Lowest monthly</option>
                <option value="move-in-asc">Lowest move-in</option>
                <option value="name-asc">A-Z</option>
              </SelectControl>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-800">
                Class: {miamiOxfordCampusAnchor.name}
              </span>
              <span className="rounded-full bg-orange-50 px-2.5 py-1 font-medium text-orange-800">
                Rec: {miamiOxfordRecCenterAnchor.name}
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            {visibleOptions.length ? (
              visibleOptions.map((option) => (
                <ListingCard
                  key={option.id}
                  option={option}
                  selected={activeOption?.id === option.id}
                  onHoverChange={setHoveredId}
                  onSelect={() => selectListing(option.id)}
                  onOpenMap={() => selectListing(option.id, true)}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        <div className="hidden min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 lg:grid">
          <div className="min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
            {isDesktop ? (
              <MiamiHousingLeafletMap
                options={visibleOptions}
                selectedId={activeOption?.id ?? null}
                hoveredId={hoveredId}
                sidebarOpen={Boolean(activeOption)}
                onSelect={(id) => selectListing(id)}
                onHoverChange={setHoveredId}
              />
            ) : null}
          </div>

          {activeOption ? <DetailPanel option={activeOption} /> : <EmptyState />}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsMobileMapOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-2xl lg:hidden"
      >
        <Map className="h-4 w-4" />
        Map
      </button>

      <AnimatePresence>
        {isMobileMapOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 flex max-h-[95vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Map
                  </p>
                  <p className="text-sm font-semibold text-slate-950">
                    {activeOption?.propertyName ?? `${visibleOptions.length} listings`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMapOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
                  aria-label="Close map"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="h-[42vh] min-h-[20rem] border-b border-slate-200">
                {!isDesktop ? (
                  <MiamiHousingLeafletMap
                    options={visibleOptions}
                    selectedId={activeOption?.id ?? null}
                    hoveredId={hoveredId}
                    sidebarOpen={Boolean(activeOption)}
                    onSelect={(id) => selectListing(id)}
                    onHoverChange={setHoveredId}
                  />
                ) : null}
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                {activeOption ? <DetailPanel option={activeOption} compact /> : <EmptyState />}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
