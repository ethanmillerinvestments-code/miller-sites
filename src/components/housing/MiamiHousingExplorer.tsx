"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  CalendarClock,
  Car,
  CheckCircle2,
  DollarSign,
  Dumbbell,
  ExternalLink,
  Home,
  Info,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Waves,
  X,
} from "lucide-react";

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
  getArmstrongDistance,
  getAvailabilityConfidenceLabel,
  getDisclosureLabel,
  getFurnishedStatusLabel,
  getHousingClarityStatus,
  getLaundryStatusLabel,
  getListTierLabel,
  getMissingCostWarnings,
  getQuestionsToAsk,
  getRecCenterDistance,
  getSourceConfidenceLabel,
  getSourceKindLabel,
  getUnitTypeLabel,
  miamiOxfordCampusAnchor,
  miamiOxfordRecCenterAnchor,
  sortHousingOptions,
  type HousingClarityStatus,
  type HousingListTier,
  type HousingOption,
  type HousingSortKey,
  type HousingSummary,
  type HousingUnitType,
} from "@/lib/housing/miamiOxfordHousing";

const MiamiHousingLeafletMap = dynamic(
  () => import("@/components/housing/MiamiHousingLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[26rem] items-center justify-center bg-[#d7d0c1] text-sm font-semibold text-[#615b50]">
        Loading map
      </div>
    ),
  },
);

type UnitFilter = "all" | HousingUnitType;
type DistanceFilter = "all" | "0.5" | "0.75" | "1" | "1.5" | "2";
type BudgetFilter = "all" | "700" | "850" | "1000" | "1250";
type TierFilter = "all" | HousingListTier;
type MobileTab = "map" | "list";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

const unitOptions: FilterOption<UnitFilter>[] = [
  { value: "all", label: "All" },
  { value: "studio", label: "Studio" },
  { value: "efficiency", label: "Efficiency" },
  { value: "one-bedroom", label: "1BR" },
];

const distanceOptions: FilterOption<DistanceFilter>[] = [
  { value: "all", label: "Any" },
  { value: "0.5", label: "0.5 mi" },
  { value: "0.75", label: "0.75 mi" },
  { value: "1", label: "1 mi" },
  { value: "1.5", label: "1.5 mi" },
  { value: "2", label: "2 mi" },
];

const budgetOptions: FilterOption<BudgetFilter>[] = [
  { value: "all", label: "Any" },
  { value: "700", label: "$700" },
  { value: "850", label: "$850" },
  { value: "1000", label: "$1k" },
  { value: "1250", label: "$1.25k" },
];

const sortOptions: FilterOption<HousingSortKey>[] = [
  { value: "best-fit", label: "Best" },
  { value: "walk-asc", label: "Distance" },
  { value: "monthly-equivalent-asc", label: "Price" },
  { value: "move-in-asc", label: "Move-in" },
  { value: "name-asc", label: "A-Z" },
];

const tierOptions: FilterOption<TierFilter>[] = [
  { value: "all", label: "All" },
  { value: "main-under-1k", label: "Main" },
  { value: "backup-over-1k", label: "Backup" },
  { value: "watchlist", label: "Watchlist" },
];

const clarityBadgeClasses: Record<HousingClarityStatus, string> = {
  clear: "bg-[#edf7ed] text-[#25522f] ring-[#bed9bd]",
  partial: "bg-[#fff4dd] text-[#8b551b] ring-[#e9c98d]",
  "quote-required": "bg-[#fff0ed] text-[#8b3324] ring-[#ebb8ad]",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function directionsLink(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

function isExternalHref(href: string) {
  return href.startsWith("http");
}

function latestVerifiedDate(options: HousingOption[]) {
  const latest = options.reduce<string | null>((current, option) => {
    if (!current || option.lastVerifiedAt > current) return option.lastVerifiedAt;
    return current;
  }, null);

  return latest ? formatHousingDate(latest) : "Not verified";
}

function formatCompactPrice(option: HousingOption) {
  const recurring = buildRecurringAllInSummary(option);
  if (option.monthlyEquivalent === null) return recurring.label;
  return recurring.label.replace(" equivalent", "");
}

function formatBedBath(option: HousingOption) {
  const bedLabel = option.bedrooms === 1 ? "1 bed" : `${option.bedrooms} beds`;
  const bathLabel = option.bathrooms === 1 ? "1 bath" : `${option.bathrooms} baths`;
  return `${bedLabel} / ${bathLabel}`;
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

function pillLabel(status: HousingClarityStatus) {
  if (status === "clear") return "Clear costs";
  if (status === "partial") return "Some unknowns";
  return "Quote";
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] font-semibold uppercase text-[#70695d]">{label}</p>
      <div className="flex max-w-full gap-1 overflow-x-auto rounded-[10px] border border-[#ddd3c3] bg-[#f3eadc] p-1">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => startTransition(() => onChange(option.value))}
              className={cn(
                "h-9 shrink-0 rounded-[8px] px-3 text-xs font-semibold text-[#5f584c] transition active:scale-[0.98]",
                active
                  ? "bg-[#27251f] text-[#fffaf2] shadow-sm"
                  : "hover:bg-white/70 hover:text-[#25231f]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DistanceBadge({
  icon,
  label,
  miles,
  tone,
  large = false,
}: {
  icon: ReactNode;
  label: string;
  miles: number;
  tone: "blue" | "orange";
  large?: boolean;
}) {
  const toneClass =
    tone === "blue"
      ? "border-[#c6d8f6] bg-[#edf4ff] text-[#1d4c91]"
      : "border-[#f0d0ad] bg-[#fff2e4] text-[#9a4a12]";

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2 rounded-[10px] border font-semibold",
        large ? "px-3 py-2 text-sm" : "px-2.5 py-1.5 text-xs",
        toneClass,
      )}
    >
      {icon}
      <span className="shrink-0">{miles.toFixed(2)} mi</span>
      <span className="truncate font-medium opacity-75">
        {label}
      </span>
    </span>
  );
}

function FactChip({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 rounded-[8px] bg-[#f2eadf] px-2.5 py-1.5 text-xs font-medium text-[#5c5549]">
      <span className="shrink-0 text-[#8d8373]">{icon}</span>
      <span className="truncate">{value}</span>
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
  const reduceMotion = useReducedMotion();
  const armstrong = getArmstrongDistance(option);
  const rec = getRecCenterDistance(option);
  const clarity = getHousingClarityStatus(option);

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      onMouseEnter={() => onHoverChange(option.id)}
      onMouseLeave={() => onHoverChange(null)}
      className={cn(
        "group overflow-hidden rounded-[12px] border bg-[#fffdf8] shadow-[0_10px_24px_rgba(60,48,34,0.06)] transition",
        selected
          ? "border-[#2f68c4] shadow-[0_0_0_3px_rgba(47,104,196,0.14),0_16px_36px_rgba(42,48,54,0.12)]"
          : "border-[#dfd5c5] hover:border-[#c9bdab] hover:shadow-[0_16px_34px_rgba(60,48,34,0.1)]",
      )}
    >
      <button type="button" onClick={onSelect} className="block w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[1.42rem] font-bold leading-none text-[#24231f]">
              {formatCompactPrice(option)}
            </p>
            <h2 className="mt-2 truncate text-base font-bold text-[#28251f]">
              {option.propertyName}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#625b50]">{option.address}</p>
          </div>

          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1",
              clarityBadgeClasses[clarity],
            )}
          >
            {pillLabel(clarity)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <FactChip
            icon={<Home className="h-3.5 w-3.5" />}
            value={getUnitTypeLabel(option.unitType)}
          />
          <FactChip icon={<BedDouble className="h-3.5 w-3.5" />} value={formatBedBath(option)} />
          <FactChip
            icon={<Bath className="h-3.5 w-3.5" />}
            value={option.squareFeet === null ? "Sq ft not posted" : `${option.squareFeet} sq ft`}
          />
          <FactChip icon={<CalendarClock className="h-3.5 w-3.5" />} value={option.leaseTermLabel} />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <DistanceBadge
            icon={<Building2 className="h-3.5 w-3.5" />}
            label="to class"
            miles={armstrong.distanceMiles}
            tone="blue"
          />
          <DistanceBadge
            icon={<Dumbbell className="h-3.5 w-3.5" />}
            label="to Rec"
            miles={rec.distanceMiles}
            tone="orange"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-[#655d52]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#63865a]" />
          <span className="line-clamp-1">{option.availabilityLabel}</span>
        </div>

        <div className="mt-3 rounded-[9px] bg-[#f8f1e8] px-3 py-2 text-xs leading-5 text-[#625b50]">
          <span className="font-bold text-[#28251f]">Utilities:</span> {utilitiesSummary(option)}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f2eadf] px-2.5 py-1 text-[10px] font-bold uppercase text-[#625b50]">
            {getListTierLabel(option.listTier)}
          </span>
          <span className="rounded-full bg-[#f2eadf] px-2.5 py-1 text-[10px] font-bold uppercase text-[#625b50]">
            {getSourceConfidenceLabel(option.sourceConfidence)}
          </span>
        </div>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-[#eee5d8] px-3 py-3">
        <button
          type="button"
          onClick={onOpenMap}
          title={`Show ${option.propertyName} on map`}
          className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#d9cfbf] bg-[#f8f1e8] px-3 text-xs font-bold text-[#4e493f] transition hover:border-[#2f68c4] hover:bg-[#edf4ff] hover:text-[#1d4c91] active:scale-[0.98]"
          aria-label={`Show ${option.propertyName} on map`}
        >
          <MapPin className="h-4 w-4" />
          Map
        </button>

        <div className="flex min-w-0 justify-end gap-2">
          <a
            href={option.sourceUrl}
            target="_blank"
            rel="noreferrer"
            title={`Open source for ${option.propertyName}`}
            className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#d9cfbf] px-3 text-xs font-bold text-[#4e493f] transition hover:bg-[#f8f1e8] active:scale-[0.98]"
          >
            <ExternalLink className="h-4 w-4" />
            Source
          </a>
          <a
            href={option.contactPath.href}
            target={isExternalHref(option.contactPath.href) ? "_blank" : undefined}
            rel={isExternalHref(option.contactPath.href) ? "noreferrer" : undefined}
            title={`${option.contactPath.label} for ${option.propertyName}`}
            className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#25231f] px-3 text-xs font-bold text-[#fffaf2] transition hover:bg-[#1d4c91] active:scale-[0.98]"
          >
            <ArrowUpRight className="h-4 w-4" />
            Contact
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function DetailMetric({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-b border-[#eee5d8] py-3 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f2eadf] text-[#6b6357]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase text-[#796f62]">{label}</p>
        <p className="mt-1 break-words text-sm font-bold leading-5 text-[#28251f]">{value}</p>
        {note ? <p className="mt-1 text-xs leading-5 text-[#756b5d]">{note}</p> : null}
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-[#eee5d8] py-2 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[9px] px-1 py-2 text-sm font-bold text-[#28251f] outline-none transition hover:bg-[#f8f1e8]">
        {title}
        <span className="text-lg leading-none text-[#8d8373] transition group-open:rotate-45">+</span>
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}

function DecisionList({ items }: { items: string[] }) {
  if (!items.length) {
    return (
      <p className="rounded-[9px] bg-[#f8f1e8] px-3 py-2 text-xs leading-5 text-[#756b5d]">
        No extra flags generated from the current source fields.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-[9px] bg-[#f8f1e8] px-3 py-2 text-xs leading-5 text-[#625b50]"
        >
          {item}
        </li>
      ))}
    </ul>
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
  const schoolYear = buildSchoolYearSummary(option);
  const armstrong = getArmstrongDistance(option);
  const rec = getRecCenterDistance(option);
  const clarity = getHousingClarityStatus(option);
  const warnings = getMissingCostWarnings(option);
  const questions = getQuestionsToAsk(option);

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col bg-[#fffdf8] text-[#28251f]",
        compact
          ? "max-h-[48vh]"
          : "h-full rounded-[12px] border border-white/70 shadow-[0_24px_70px_rgba(33,31,27,0.24)] backdrop-blur",
      )}
    >
      <div className="shrink-0 border-b border-[#eee5d8] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-none text-[#24231f]">{recurring.label}</p>
            <h2 className="mt-2 text-lg font-bold leading-tight text-[#28251f]">
              {option.propertyName}
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#625b50]">{option.address}</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#d9cfbf] bg-[#fffaf2] text-[#625b50] transition hover:bg-[#f3eadc]"
              aria-label="Close listing details"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <DistanceBadge
            icon={<Building2 className="h-4 w-4" />}
            label="to class"
            miles={armstrong.distanceMiles}
            tone="blue"
            large
          />
          <DistanceBadge
            icon={<Dumbbell className="h-4 w-4" />}
            label="to Rec"
            miles={rec.distanceMiles}
            tone="orange"
            large
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1",
              clarityBadgeClasses[clarity],
            )}
          >
            {pillLabel(clarity)}
          </span>
          <span className="rounded-full bg-[#f2eadf] px-2.5 py-1 text-[10px] font-bold uppercase text-[#625b50]">
            {getSourceConfidenceLabel(option.sourceConfidence)}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        <DetailSection title="Overview" defaultOpen>
          <DetailMetric
            icon={<Home className="h-4 w-4" />}
            label="Unit"
            value={`${getUnitTypeLabel(option.unitType)} / ${formatBedBath(option)} / ${
              option.squareFeet === null ? "sq ft not posted" : `${option.squareFeet} sq ft`
            }`}
          />
          <DetailMetric
            icon={<Building2 className="h-4 w-4" />}
            label="Class distance"
            value={`${armstrong.distanceMiles.toFixed(2)} mi to ${miamiOxfordCampusAnchor.name}`}
          />
          <DetailMetric
            icon={<Dumbbell className="h-4 w-4" />}
            label="Rec distance"
            value={`${rec.distanceMiles.toFixed(2)} mi to ${miamiOxfordRecCenterAnchor.name}`}
          />
        </DetailSection>

        <DetailSection title="Costs" defaultOpen={!compact}>
          <DetailMetric
            icon={<DollarSign className="h-4 w-4" />}
            label="Recurring estimate"
            value={recurring.label}
            note={recurring.note}
          />
          <DetailMetric
            icon={<Info className="h-4 w-4" />}
            label="Move-in"
            value={moveIn.label}
            note={moveIn.note}
          />
          <DetailMetric
            icon={<DollarSign className="h-4 w-4" />}
            label="School-year comparison"
            value={schoolYear.label}
            note={schoolYear.note}
          />
          <DetailMetric
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Taxes / fees / deposit"
            value={`Taxes: ${getDisclosureLabel(option.taxesStatus)} / Fees: ${getDisclosureLabel(
              option.nonUtilityFeesStatus,
            )}`}
            note={`Deposit: ${formatOptionalNumber(option.securityDepositRefundable)}`}
          />
        </DetailSection>

        <DetailSection title="Lease/Availability">
          <DetailMetric
            icon={<CalendarClock className="h-4 w-4" />}
            label="Lease"
            value={option.leaseTermLabel}
            note={option.availabilityLabel}
          />
          <DetailMetric
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Availability confidence"
            value={getAvailabilityConfidenceLabel(option.availabilityConfidence)}
            note={option.availabilityNotes.slice(0, 2).join(" ")}
          />
        </DetailSection>

        <DetailSection title="Utilities/Parking">
          <DetailMetric
            icon={<Waves className="h-4 w-4" />}
            label="Utilities"
            value={utilitiesSummary(option)}
          />
          <DetailMetric
            icon={<Car className="h-4 w-4" />}
            label="Parking"
            value={parkingSummary(option)}
          />
          <DetailMetric
            icon={<BedDouble className="h-4 w-4" />}
            label="Furnished"
            value={getFurnishedStatusLabel(option.furnishedStatus)}
          />
          <DetailMetric
            icon={<Bath className="h-4 w-4" />}
            label="Laundry"
            value={getLaundryStatusLabel(option.laundryStatus)}
          />
          <DetailMetric
            icon={<Snowflake className="h-4 w-4" />}
            label="A/C"
            value={getACStatusLabel(option.ACStatus)}
          />
        </DetailSection>

        <DetailSection title="Decision Check" defaultOpen={!compact}>
          <div className="grid gap-3">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase text-[#796f62]">Source snapshot</p>
              <DecisionList items={option.sourceSnapshotNotes} />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase text-[#796f62]">Caveats</p>
              <DecisionList items={warnings} />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase text-[#796f62]">Ask before signing</p>
              <DecisionList items={questions} />
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Source/Contact">
          <DetailMetric
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Source"
            value={`${getSourceKindLabel(option.sourceKind)} / ${getSourceConfidenceLabel(
              option.sourceConfidence,
            )}`}
            note={`Verified ${formatHousingDate(option.lastVerifiedAt)} / ${getListTierLabel(
              option.listTier,
            )}`}
          />
          <DetailMetric
            icon={<ExternalLink className="h-4 w-4" />}
            label="Contact path"
            value={option.contactPath.label}
            note={option.contactPath.note}
          />
        </DetailSection>
      </div>

      <div className="sticky bottom-0 grid shrink-0 grid-cols-3 gap-2 border-t border-[#eee5d8] bg-[#fffdf8]/96 p-4 backdrop-blur">
        <a
          href={option.contactPath.href}
          target={isExternalHref(option.contactPath.href) ? "_blank" : undefined}
          rel={isExternalHref(option.contactPath.href) ? "noreferrer" : undefined}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] bg-[#25231f] px-3 text-sm font-bold text-[#fffaf2] transition hover:bg-[#1d4c91] active:scale-[0.98]"
        >
          Contact
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <a
          href={option.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] border border-[#d9cfbf] px-3 text-sm font-bold text-[#4e493f] transition hover:bg-[#f8f1e8] active:scale-[0.98]"
        >
          Source
          <ExternalLink className="h-4 w-4" />
        </a>
        <a
          href={directionsLink(option.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] border border-[#d9cfbf] px-3 text-sm font-bold text-[#4e493f] transition hover:bg-[#f8f1e8] active:scale-[0.98]"
        >
          Route
          <Route className="h-4 w-4" />
        </a>
      </div>
    </aside>
  );
}

function ComparisonSummary({
  summary,
  activeFilterCount,
}: {
  summary: HousingSummary;
  activeFilterCount: number;
}) {
  const priceLabel =
    summary.monthlyEquivalentMin === null
      ? "No posted prices"
      : formatHousingCurrencyRange(
          summary.monthlyEquivalentMin,
          summary.monthlyEquivalentMax,
          "/mo",
        );
  const distanceLabel =
    summary.distanceMilesMin === null || summary.distanceMilesMax === null
      ? "No distance"
      : `${summary.distanceMilesMin.toFixed(2)}-${summary.distanceMilesMax.toFixed(2)} mi`;

  return (
    <div className="sticky top-0 z-10 border-b border-[#ded3c2] bg-[#fffaf2]/96 px-4 py-3 shadow-[0_8px_18px_rgba(67,55,38,0.06)] backdrop-blur">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#625b50]">
        <span>
          {summary.totalOptions} listing{summary.totalOptions === 1 ? "" : "s"}
        </span>
        <span>{activeFilterCount ? `${activeFilterCount} filters` : "unfiltered"}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-[9px] border border-[#ded3c2] bg-[#fffdf8] px-2.5 py-2">
          <p className="text-[10px] font-bold uppercase text-[#7d7366]">Price</p>
          <p className="mt-1 truncate text-xs font-bold text-[#28251f]">{priceLabel}</p>
        </div>
        <div className="rounded-[9px] border border-[#c6d8f6] bg-[#edf4ff] px-2.5 py-2">
          <p className="text-[10px] font-bold uppercase text-[#55729e]">Class</p>
          <p className="mt-1 truncate text-xs font-bold text-[#1d4c91]">{distanceLabel}</p>
        </div>
        <div className="rounded-[9px] border border-[#e7c08e] bg-[#fff4dd] px-2.5 py-2">
          <p className="text-[10px] font-bold uppercase text-[#8b551b]">Clarity</p>
          <p className="mt-1 truncate text-xs font-bold text-[#6f4215]">
            {summary.clarityCounts.clear}/{summary.clarityCounts.partial}/
            {summary.clarityCounts["quote-required"]}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[12px] border border-dashed border-[#cfc4b4] bg-[#fffdf8] p-8 text-center text-[#625b50]">
      <Search className="mx-auto h-8 w-8 text-[#918777]" />
      <h2 className="mt-4 text-lg font-bold text-[#28251f]">No listings match.</h2>
      <p className="mt-2 text-sm leading-6">
        Widen the distance range, raise the budget cap, or clear the search.
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
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [maxDistance, setMaxDistance] = useState<DistanceFilter>("all");
  const [maxMonthly, setMaxMonthly] = useState<BudgetFilter>("all");
  const [sortMode, setSortMode] = useState<HousingSortKey>("best-fit");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");
  const deferredQuery = useDeferredValue(searchQuery);
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();

  const visibleOptions = useMemo(
    () =>
      sortHousingOptions(
        filterHousingOptions(options, {
          unitTypes: unitFilter === "all" ? undefined : [unitFilter],
          listTiers: tierFilter === "all" ? undefined : [tierFilter],
          maxDistanceMiles: maxDistance === "all" ? undefined : Number(maxDistance),
          maxMonthlyEquivalent: maxMonthly === "all" ? undefined : Number(maxMonthly),
          searchQuery: deferredQuery,
        }),
        sortMode,
      ),
    [deferredQuery, maxDistance, maxMonthly, options, sortMode, tierFilter, unitFilter],
  );

  const summary = buildHousingSummary(visibleOptions);
  const allSummary = buildHousingSummary(options);
  const selectedOption = selectedId
    ? visibleOptions.find((option) => option.id === selectedId) ?? null
    : null;
  const verifiedDate = useMemo(() => latestVerifiedDate(options), [options]);

  useEffect(() => {
    if (!visibleOptions.length) {
      setSelectedId(null);
      setHoveredId(null);
      return;
    }

    if (selectedId && !visibleOptions.some((option) => option.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, visibleOptions]);

  useEffect(() => {
    if (hoveredId && !visibleOptions.some((option) => option.id === hoveredId)) {
      setHoveredId(null);
    }
  }, [hoveredId, visibleOptions]);

  function triggerHaptic() {
    if (reduceMotion || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    try {
      navigator.vibrate?.(10);
    } catch {
      // Haptics are an optional enhancement and should never block the UI.
    }
  }

  function selectListing(id: string, mobileTarget: MobileTab | null = null) {
    triggerHaptic();
    startTransition(() => setSelectedId(id));
    if (mobileTarget) {
      setMobileTab(mobileTarget);
    }
  }

  function selectMobileTab(tab: MobileTab) {
    triggerHaptic();
    setMobileTab(tab);
  }

  function updateFilter<T extends string>(setter: Dispatch<SetStateAction<T>>) {
    return (value: T) => {
      triggerHaptic();
      setter(value);
    };
  }

  const activeFilterCount = [
    tierFilter !== "all",
    unitFilter !== "all",
    maxDistance !== "all",
    maxMonthly !== "all",
    sortMode !== "best-fit",
  ].filter(Boolean).length;

  const renderFilterGroups = () => (
    <div className="grid gap-3">
      <SegmentedControl
        label="Tier"
        value={tierFilter}
        options={tierOptions}
        onChange={updateFilter(setTierFilter)}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <SegmentedControl
          label="Unit"
          value={unitFilter}
          options={unitOptions}
          onChange={updateFilter(setUnitFilter)}
        />
        <SegmentedControl
          label="Distance"
          value={maxDistance}
          options={distanceOptions}
          onChange={updateFilter(setMaxDistance)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <SegmentedControl
          label="Budget"
          value={maxMonthly}
          options={budgetOptions}
          onChange={updateFilter(setMaxMonthly)}
        />
        <SegmentedControl
          label="Sort"
          value={sortMode}
          options={sortOptions}
          onChange={updateFilter(setSortMode)}
        />
      </div>
    </div>
  );

  const searchControl = (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d8373]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => startTransition(() => setSearchQuery(event.target.value))}
        placeholder="Search building, street, utility, feature"
        className="h-12 w-full rounded-[10px] border border-[#d8cdbc] bg-[#fffdf8] pl-10 pr-3 text-sm font-medium text-[#28251f] outline-none transition placeholder:text-[#9b9284] focus:border-[#2f68c4] focus:ring-2 focus:ring-[#c7d9f8]"
      />
    </label>
  );

  const filterControls = (
    <div className="border-b border-[#ded3c2] bg-[#fffaf2] p-4">
      {searchControl}

      <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase text-[#756b5d]">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>

      <div className="mt-3">{renderFilterGroups()}</div>
    </div>
  );

  const mobileFilterControls = (
    <div className="border-b border-[#ded3c2] bg-[#fffaf2] p-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d8373]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => startTransition(() => setSearchQuery(event.target.value))}
          placeholder="Search listings"
          className="h-11 w-full rounded-[10px] border border-[#d8cdbc] bg-[#fffdf8] pl-10 pr-3 text-sm font-medium text-[#28251f] outline-none transition placeholder:text-[#9b9284] focus:border-[#2f68c4] focus:ring-2 focus:ring-[#c7d9f8]"
        />
      </label>

      <details
        className="mt-2 rounded-[10px] border border-[#ded3c2] bg-[#f8f1e8]"
        onToggle={(event) => {
          if (event.currentTarget.open) triggerHaptic();
        }}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-xs font-bold uppercase text-[#625b50]">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </span>
          <span className="rounded-full bg-[#fffaf2] px-2 py-1 text-[10px]">
            {activeFilterCount ? `${activeFilterCount} active` : "tap to refine"}
          </span>
        </summary>
        <div className="border-t border-[#ded3c2] p-3">
          {renderFilterGroups()}
        </div>
      </details>
    </div>
  );

  const resultSummary = (
    <ComparisonSummary summary={summary} activeFilterCount={activeFilterCount} />
  );

  const listingList = (
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
      <AnimatePresence initial={false} mode="popLayout">
        {visibleOptions.length ? (
          visibleOptions.map((option) => (
            <ListingCard
              key={option.id}
              option={option}
              selected={selectedOption?.id === option.id}
              onHoverChange={setHoveredId}
              onSelect={() => selectListing(option.id)}
              onOpenMap={() => selectListing(option.id, "map")}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section className="min-h-screen w-full bg-[#f4efe6] text-[#28251f] lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-0">
        <header className="shrink-0 border-b border-[#d8cdbc] bg-[#fffaf2]/96 px-4 py-3 shadow-[0_10px_28px_rgba(67,55,38,0.08)] backdrop-blur sm:px-5 lg:px-6">
          <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase text-[#746b5d]">
                <span>August 2026</span>
                <span className="h-1 w-1 rounded-full bg-[#a09584]" aria-hidden />
                <span>Private planning</span>
                <span className="h-1 w-1 rounded-full bg-[#a09584]" aria-hidden />
                <span>Last verified {verifiedDate}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                <h1 className="text-xl font-bold text-[#24231f] sm:text-2xl">
                  Miami Oxford housing
                </h1>
                <p className="text-sm font-semibold text-[#61594d]">
                  {summary.totalOptions} of {allSummary.totalOptions} results
                </p>
              </div>
            </div>

            <div className="hidden shrink-0 gap-2 text-xs font-bold lg:flex">
              <span className="rounded-full bg-[#e9f3e4] px-3 py-2 text-[#355b31]">
                {allSummary.mainUnder1kOptions} main
              </span>
              <span className="rounded-full bg-[#fff2e4] px-3 py-2 text-[#9a4a12]">
                {allSummary.backupOptions} backups
              </span>
              <span className="rounded-full bg-[#f2eadf] px-3 py-2 text-[#625b50]">
                {allSummary.watchlistOptions} watchlist
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 rounded-[10px] border border-[#d8cdbc] bg-[#f3eadc] p-1 lg:hidden">
            {(["map", "list"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => selectMobileTab(tab)}
                className={cn(
                  "h-10 rounded-[8px] text-sm font-bold capitalize transition",
                  mobileTab === tab
                    ? "bg-[#25231f] text-[#fffaf2] shadow-sm"
                    : "text-[#625b50] hover:bg-white/70",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="hidden w-full max-w-[1800px] flex-1 lg:mx-auto lg:grid lg:min-h-0 lg:grid-cols-[minmax(23rem,32rem)_minmax(0,1fr)]">
          <aside className="flex h-full min-h-0 flex-col border-r border-[#d8cdbc] bg-[#f8f1e8]">
            {filterControls}
            {resultSummary}
            <AnimatePresence initial={false}>
              {selectedOption ? (
                <motion.div
                  key={selectedOption.id}
                  initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-[48vh] shrink-0 border-b border-[#ded3c2] p-3"
                >
                  <DetailPanel option={selectedOption} compact onClose={() => setSelectedId(null)} />
                </motion.div>
              ) : null}
            </AnimatePresence>
            {listingList}
          </aside>

          <section className="min-h-0 overflow-hidden bg-[#d7d0c1]">
            {isDesktop ? (
              <MiamiHousingLeafletMap
                options={visibleOptions}
                selectedId={selectedOption?.id ?? null}
                hoveredId={hoveredId}
                sidebarOpen={false}
                onSelect={(id) => selectListing(id)}
                onHoverChange={setHoveredId}
              />
            ) : null}
          </section>
        </div>

        <div className="flex flex-1 flex-col lg:hidden">
          {mobileTab === "map" ? (
            <section className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-[22rem] flex-1 border-b border-[#ded3c2]">
                {!isDesktop ? (
                  <MiamiHousingLeafletMap
                    options={visibleOptions}
                    selectedId={selectedOption?.id ?? null}
                    hoveredId={hoveredId}
                    sidebarOpen={false}
                    onSelect={(id) => selectListing(id)}
                    onHoverChange={setHoveredId}
                  />
                ) : null}
              </div>
              <AnimatePresence initial={false}>
                {selectedOption ? (
                  <motion.div
                    key={selectedOption.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="max-h-[42vh] overflow-y-auto border-t border-[#ded3c2] bg-[#fffaf2] p-3"
                    style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
                  >
                    <DetailPanel option={selectedOption} compact />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </section>
          ) : (
            <aside className="flex min-h-0 flex-1 flex-col bg-[#f8f1e8]">
              {mobileFilterControls}
              <div className="grid grid-cols-3 gap-2 border-b border-[#ded3c2] bg-[#fffaf2] px-4 py-3 text-center text-[11px] font-bold uppercase text-[#625b50]">
                <span>{allSummary.mainUnder1kOptions} main</span>
                <span>{allSummary.backupOptions} backup</span>
                <span>{allSummary.watchlistOptions} watch</span>
              </div>
              {resultSummary}
              {listingList}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
