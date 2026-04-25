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
  calculateEthanPriceRange,
  ETHAN_PARENT_CONTRIBUTION,
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
  isStrictAffordableNextYearOneBed,
  miamiOxfordCampusAnchor,
  miamiOxfordRecCenterAnchor,
  sortHousingOptions,
  type HousingClarityStatus,
  type HousingOption,
  type HousingSortKey,
  type HousingSummary,
} from "@/lib/housing/miamiOxfordHousing";

const MiamiHousingLeafletMap = dynamic(
  () => import("@/components/housing/MiamiHousingLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[26rem] items-center justify-center bg-[#dce4df] text-sm font-semibold text-[#40524b]">
        Loading map
      </div>
    ),
  },
);

type DistanceFilter = "all" | "0.5" | "0.75" | "1" | "1.5" | "2";
type MobileTab = "map" | "list";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

const distanceOptions: FilterOption<DistanceFilter>[] = [
  { value: "all", label: "Any" },
  { value: "0.5", label: "0.5 mi" },
  { value: "0.75", label: "0.75 mi" },
  { value: "1", label: "1 mi" },
  { value: "1.5", label: "1.5 mi" },
  { value: "2", label: "2 mi" },
];

const sortOptions: FilterOption<HousingSortKey>[] = [
  { value: "best-fit", label: "Best" },
  { value: "walk-asc", label: "Distance" },
  { value: "monthly-equivalent-asc", label: "Rent" },
  { value: "move-in-asc", label: "Move-in" },
  { value: "name-asc", label: "A-Z" },
];

const clarityBadgeClasses: Record<HousingClarityStatus, string> = {
  clear: "bg-[#e8f6ef] text-[#145236] ring-[#b7ddca]",
  partial: "bg-[#fff3d8] text-[#7a4b11] ring-[#e6c77f]",
  "quote-required": "bg-[#fce8e4] text-[#812b1f] ring-[#e9afa5]",
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

function formatFullRent(option: HousingOption, suffix = "/mo") {
  return formatHousingCurrencyRange(option.monthlyEquivalent, option.monthlyEquivalentUpper, suffix);
}

function formatEthanPrice(option: HousingOption, suffix = "/mo") {
  const range = calculateEthanPriceRange(option);

  return `${range.label}${suffix}`;
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

function feeSummary(option: HousingOption) {
  if (!option.adminOrLeaseSigningFees.length) return "No admin or signing fee posted";

  return option.adminOrLeaseSigningFees
    .map((fee) => `${fee.label}: ${formatOptionalNumber(fee.amount)}`)
    .join(" / ");
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
      <p className="mb-2 text-[11px] font-semibold uppercase text-[#66726d]">{label}</p>
      <div className="flex max-w-full gap-1 overflow-x-auto rounded-[8px] border border-[#d5ddd8] bg-[#eef3ef] p-1">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => startTransition(() => onChange(option.value))}
              className={cn(
                "h-9 shrink-0 rounded-[6px] px-3 text-xs font-semibold text-[#4d5e56] transition active:scale-[0.98]",
                active
                  ? "bg-[#17231f] text-[#f8fbf8] shadow-sm"
                  : "hover:bg-white/80 hover:text-[#17231f]",
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
      : "border-[#e9c9a9] bg-[#fff4e8] text-[#87420f]";

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2 border font-semibold",
        large ? "rounded-[8px] px-3 py-2 text-sm" : "rounded-[7px] px-2.5 py-1.5 text-xs",
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
  const warnings = getMissingCostWarnings(option);
  const primaryWarning = warnings[0] ?? "Call Morrison Rentals before signing to confirm final fees and lease terms.";

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
        "group overflow-hidden rounded-[8px] border bg-[#fbfcf8] shadow-[0_10px_24px_rgba(38,52,45,0.06)] transition",
        selected
          ? "border-[#2563eb] shadow-[0_0_0_3px_rgba(37,99,235,0.14),0_18px_38px_rgba(37,51,44,0.14)]"
          : "border-[#d9e0da] hover:border-[#b9c8bf] hover:shadow-[0_16px_34px_rgba(38,52,45,0.1)]",
      )}
    >
      <button type="button" onClick={onSelect} className="block w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[1.42rem] font-bold leading-none text-[#16221e]">
              {formatFullRent(option)}
            </p>
            <p className="mt-1 text-sm font-bold text-[#1d4c91]">
              Ethan Price {formatEthanPrice(option)}
            </p>
            <h2 className="mt-2 truncate text-base font-bold text-[#17231f]">
              {option.propertyName}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#56655e]">{option.address}</p>
            <p className="mt-1 text-xs font-semibold text-[#64746d]">
              {formatBedBath(option)} / {option.leaseTermLabel}
            </p>
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

        <div className="mt-4 grid gap-2">
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

        <div className="mt-3 flex items-center gap-2 text-sm text-[#54625c]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2e7d52]" />
          <span className="line-clamp-1">{option.availabilityLabel}</span>
        </div>

        <div className="mt-2 rounded-[8px] bg-[#f7f8f3] px-3 py-2 text-xs leading-5 text-[#5b6862]">
          <span className="font-bold text-[#17231f]">Utilities:</span> {utilitiesSummary(option)}
        </div>

        <div className="mt-2 rounded-[8px] border border-[#e6c77f] bg-[#fff8e8] px-3 py-2 text-xs leading-5 text-[#725016]">
          <span className="font-bold text-[#5d3b0b]">Confirm:</span> {primaryWarning}
        </div>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-[#e5ebe5] px-3 py-3">
        <button
          type="button"
          onClick={onOpenMap}
          title={`Show ${option.propertyName} on map`}
          className="inline-flex h-10 items-center gap-2 rounded-[7px] border border-[#d5ddd8] bg-[#eef3ef] px-3 text-xs font-bold text-[#42524b] transition hover:border-[#2563eb] hover:bg-[#edf4ff] hover:text-[#1d4c91] active:scale-[0.98]"
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
            className="inline-flex h-10 items-center gap-2 rounded-[7px] border border-[#d5ddd8] px-3 text-xs font-bold text-[#42524b] transition hover:bg-[#eef3ef] active:scale-[0.98]"
          >
            <ExternalLink className="h-4 w-4" />
            Source
          </a>
          <a
            href={option.contactPath.href}
            target={isExternalHref(option.contactPath.href) ? "_blank" : undefined}
            rel={isExternalHref(option.contactPath.href) ? "noreferrer" : undefined}
            title={`${option.contactPath.label} for ${option.propertyName}`}
            className="inline-flex h-10 items-center gap-2 rounded-[7px] bg-[#17231f] px-3 text-xs font-bold text-[#f8fbf8] transition hover:bg-[#1d4c91] active:scale-[0.98]"
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
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-b border-[#e5ebe5] py-3 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#eef3ef] text-[#64746d]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase text-[#66726d]">{label}</p>
        <p className="mt-1 break-words text-sm font-bold leading-5 text-[#17231f]">{value}</p>
        {note ? <p className="mt-1 text-xs leading-5 text-[#64746d]">{note}</p> : null}
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
      className="group border-b border-[#e5ebe5] py-2 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[7px] px-1 py-2 text-sm font-bold text-[#17231f] outline-none transition hover:bg-[#eff5f1]">
        {title}
        <span className="text-lg leading-none text-[#71817a] transition group-open:rotate-45">+</span>
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}

function DecisionList({ items }: { items: string[] }) {
  if (!items.length) {
    return (
      <p className="rounded-[8px] bg-[#f7f8f3] px-3 py-2 text-xs leading-5 text-[#64746d]">
        No extra flags generated from the current source fields.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-[8px] bg-[#f7f8f3] px-3 py-2 text-xs leading-5 text-[#56655e]"
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
  mobile = false,
}: {
  option: HousingOption;
  onClose?: () => void;
  compact?: boolean;
  mobile?: boolean;
}) {
  const recurring = buildRecurringAllInSummary(option);
  const moveIn = buildMoveInDueSummary(option);
  const schoolYear = buildSchoolYearSummary(option);
  const ethanPrice = calculateEthanPriceRange(option);
  const armstrong = getArmstrongDistance(option);
  const rec = getRecCenterDistance(option);
  const clarity = getHousingClarityStatus(option);
  const warnings = getMissingCostWarnings(option);
  const questions = getQuestionsToAsk(option);

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col bg-[#fbfcf8] text-[#17231f]",
        compact && mobile
          ? "max-h-[58dvh] rounded-[8px] border border-[#dfe7e1] shadow-[0_24px_70px_rgba(38,52,45,0.22)]"
          : compact
            ? "max-h-[48vh]"
            : "h-full rounded-[8px] border border-[#dfe7e1] shadow-[0_24px_70px_rgba(38,52,45,0.18)] backdrop-blur",
      )}
    >
      <div className="shrink-0 border-b border-[#e5ebe5] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-none text-[#16221e]">
              {formatFullRent(option)}
            </p>
            <p className="mt-1 text-sm font-bold text-[#1d4c91]">
              Ethan Price {ethanPrice.label}/mo after {formatHousingCurrency(ETHAN_PARENT_CONTRIBUTION)}
            </p>
            <h2 className="mt-2 text-lg font-bold leading-tight text-[#17231f]">
              {option.propertyName}
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#56655e]">{option.address}</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#d5ddd8] bg-[#f8fbf8] text-[#56655e] transition hover:bg-[#eef3ef]"
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
          <span className="rounded-[6px] bg-[#eef3ef] px-2.5 py-1 text-[10px] font-bold uppercase text-[#4f5f58]">
            {getSourceConfidenceLabel(option.sourceConfidence)}
          </span>
        </div>

        {mobile && questions.length ? (
          <div className="mt-3 rounded-[8px] border border-[#e6c77f] bg-[#fff8e8] px-3 py-2 text-xs leading-5 text-[#725016]">
            <p className="font-bold uppercase text-[#5d3b0b]">Ask before signing</p>
            <p className="mt-1">{questions[0]}</p>
          </div>
        ) : null}
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
            label="Posted rent"
            value={formatFullRent(option)}
            note={recurring.note}
          />
          <DetailMetric
            icon={<DollarSign className="h-4 w-4" />}
            label="Ethan Price"
            value={`${ethanPrice.label}/mo`}
            note={`${formatHousingCurrency(ETHAN_PARENT_CONTRIBUTION)} assumed parent contribution; final utilities and fees still need confirmation.`}
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
            label="Deposit"
            value={`Taxes: ${getDisclosureLabel(option.taxesStatus)} / Fees: ${getDisclosureLabel(
              option.nonUtilityFeesStatus,
            )}`}
            note={`Deposit: ${formatOptionalNumber(option.securityDepositRefundable)}`}
          />
          <DetailMetric
            icon={<Info className="h-4 w-4" />}
            label="Posted fees"
            value={feeSummary(option)}
            note="Portal fee tables may omit optional, variable, move-out, or usage-based charges."
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

        <DetailSection title="Decision Check" defaultOpen={!compact || mobile}>
          <div className="grid gap-3">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase text-[#66726d]">Source snapshot</p>
              <DecisionList items={option.sourceSnapshotNotes} />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase text-[#66726d]">Caveats</p>
              <DecisionList items={warnings} />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase text-[#66726d]">Ask before signing</p>
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

      <div
        className={cn(
          "sticky bottom-0 grid shrink-0 gap-2 border-t border-[#e5ebe5] bg-[#fbfcf8]/96 p-4 backdrop-blur",
          mobile ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        <a
          href={option.contactPath.href}
          target={isExternalHref(option.contactPath.href) ? "_blank" : undefined}
          rel={isExternalHref(option.contactPath.href) ? "noreferrer" : undefined}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] bg-[#17231f] px-3 text-sm font-bold text-[#f8fbf8] transition hover:bg-[#1d4c91] active:scale-[0.98]"
        >
          Contact
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <a
          href={directionsLink(option.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-[#d5ddd8] px-3 text-sm font-bold text-[#42524b] transition hover:bg-[#eef3ef] active:scale-[0.98]"
        >
          Route
          <Route className="h-4 w-4" />
        </a>
        <a
          href={option.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-[#d5ddd8] px-3 text-sm font-bold text-[#42524b] transition hover:bg-[#eef3ef] active:scale-[0.98]",
            mobile && "col-span-2 h-10",
          )}
        >
          Source
          <ExternalLink className="h-4 w-4" />
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
    <div className="sticky top-0 z-10 border-b border-[#d9e0da] bg-[#fbfcf8]/96 px-4 py-3 shadow-[0_8px_18px_rgba(38,52,45,0.06)] backdrop-blur">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#56655e]">
        <span>
          {summary.totalOptions} listing{summary.totalOptions === 1 ? "" : "s"}
        </span>
        <span>{activeFilterCount ? `${activeFilterCount} filters` : "unfiltered"}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-[8px] border border-[#d9e0da] bg-[#f8fbf8] px-2.5 py-2">
          <p className="text-[10px] font-bold uppercase text-[#66726d]">Price</p>
          <p className="mt-1 truncate text-xs font-bold text-[#17231f]">{priceLabel}</p>
        </div>
        <div className="rounded-[8px] border border-[#c6d8f6] bg-[#edf4ff] px-2.5 py-2">
          <p className="text-[10px] font-bold uppercase text-[#55729e]">Class</p>
          <p className="mt-1 truncate text-xs font-bold text-[#1d4c91]">{distanceLabel}</p>
        </div>
        <div className="rounded-[8px] border border-[#e7c08e] bg-[#fff4dd] px-2.5 py-2">
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

function rangeFromValues(values: number[], suffix = "") {
  if (!values.length) return "Unknown";

  return formatHousingCurrencyRange(Math.min(...values), Math.max(...values), suffix);
}

function ParentConfidenceStrip({ options }: { options: HousingOption[] }) {
  const rentValues = options.flatMap((option) =>
    option.monthlyEquivalentUpper !== null
      ? [option.monthlyEquivalent, option.monthlyEquivalentUpper]
      : [option.monthlyEquivalent],
  ).filter((value): value is number => value !== null);
  const ethanValues = options.flatMap((option) => {
    const range = calculateEthanPriceRange(option);

    return range.max !== null && range.max !== range.min ? [range.min, range.max] : [range.min];
  }).filter((value): value is number => value !== null);
  const stats = [
    {
      label: `${options.length} strict listings`,
      note: `1BR/1BA, posted 8/1/26, rent upper bound under $700`,
    },
    {
      label: `${rangeFromValues(rentValues, "/mo")} rent`,
      note: "Full posted monthly rent range",
    },
    {
      label: `${rangeFromValues(ethanValues, "/mo")} Ethan Price`,
      note: `${formatHousingCurrency(ETHAN_PARENT_CONTRIBUTION)} parent contribution assumed`,
    },
    {
      label: "8/1/26 availability posted",
      note: "Still call the property manager before signing",
    },
  ];
  const warnings = [
    "Confirm final fees/utilities",
    "Confirm lease terms",
    "Call before signing",
  ];

  return (
    <section className="border-b border-[#d9e0da] bg-[#fffaf0] px-4 py-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[8px] border border-[#ead6a7] bg-[#fffcf3] px-3 py-2"
          >
            <p className="text-sm font-bold text-[#17231f]">{stat.label}</p>
            <p className="mt-1 text-[11px] font-medium leading-4 text-[#725016]">{stat.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {warnings.map((warning) => (
          <span
            key={warning}
            className="inline-flex items-center gap-1.5 rounded-[7px] border border-[#e6c77f] bg-[#fff8e8] px-2.5 py-1.5 text-[11px] font-bold uppercase text-[#765018]"
          >
            <Info className="h-3.5 w-3.5" />
            {warning}
          </span>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[8px] border border-dashed border-[#bdcbc3] bg-[#fbfcf8] p-8 text-center text-[#56655e]">
      <Search className="mx-auto h-8 w-8 text-[#71817a]" />
      <h2 className="mt-4 text-lg font-bold text-[#17231f]">No listings match.</h2>
      <p className="mt-2 text-sm leading-6">
        Widen the distance range, raise the budget cap, or clear the search.
      </p>
    </div>
  );
}

function DetailPlaceholder({ summary }: { summary: HousingSummary }) {
  const priceLabel =
    summary.monthlyEquivalentMin === null
      ? "No posted price"
      : formatHousingCurrencyRange(summary.monthlyEquivalentMin, summary.monthlyEquivalentMax, "/mo");

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-[8px] border border-[#dfe7e1] bg-[#fbfcf8] p-4 text-[#17231f] shadow-[0_24px_70px_rgba(38,52,45,0.14)]">
      <div className="border-b border-[#e5ebe5] pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#66726d]">
          Decision panel
        </p>
        <h2 className="mt-2 text-lg font-bold leading-tight">No listing selected</h2>
        <p className="mt-2 text-sm leading-6 text-[#64746d]">
          Private August 2026 planning centered on price, class distance, Rec distance,
          availability confidence, and cost unknowns.
        </p>
      </div>

      <div className="grid gap-3 py-4">
        <DetailMetric
          icon={<DollarSign className="h-4 w-4" />}
          label="Visible range"
          value={priceLabel}
          note="Displayed as monthly-equivalent comparison where the source gives usable pricing."
        />
        <DetailMetric
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Cost clarity"
          value={`${summary.clarityCounts.clear} clear / ${summary.clarityCounts.partial} partial / ${summary.clarityCounts["quote-required"]} quote`}
        />
        <DetailMetric
          icon={<Building2 className="h-4 w-4" />}
          label="Campus anchor"
          value={miamiOxfordCampusAnchor.name}
          note={miamiOxfordCampusAnchor.address}
        />
        <DetailMetric
          icon={<Dumbbell className="h-4 w-4" />}
          label="Rec anchor"
          value={miamiOxfordRecCenterAnchor.name}
          note={miamiOxfordRecCenterAnchor.address}
        />
      </div>
    </aside>
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
  const [maxDistance, setMaxDistance] = useState<DistanceFilter>("all");
  const [sortMode, setSortMode] = useState<HousingSortKey>("best-fit");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("list");
  const deferredQuery = useDeferredValue(searchQuery);
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();

  const strictOptions = useMemo(
    () => options.filter(isStrictAffordableNextYearOneBed),
    [options],
  );

  const visibleOptions = useMemo(
    () =>
      sortHousingOptions(
        filterHousingOptions(strictOptions, {
          maxDistanceMiles: maxDistance === "all" ? undefined : Number(maxDistance),
          searchQuery: deferredQuery,
        }),
        sortMode,
      ),
    [deferredQuery, maxDistance, sortMode, strictOptions],
  );

  const summary = buildHousingSummary(visibleOptions);
  const strictSummary = buildHousingSummary(strictOptions);
  const selectedOption = selectedId
    ? visibleOptions.find((option) => option.id === selectedId) ?? null
    : null;
  const verifiedDate = useMemo(() => latestVerifiedDate(strictOptions), [strictOptions]);

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
    maxDistance !== "all",
    sortMode !== "best-fit",
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const renderFilterGroups = () => (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <SegmentedControl
          label="Distance"
          value={maxDistance}
          options={distanceOptions}
          onChange={updateFilter(setMaxDistance)}
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
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71817a]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => startTransition(() => setSearchQuery(event.target.value))}
        placeholder="Search building, street, utility, feature"
        className="h-12 w-full rounded-[8px] border border-[#d5ddd8] bg-[#fbfcf8] pl-10 pr-3 text-sm font-medium text-[#17231f] outline-none transition placeholder:text-[#8a9891] focus:border-[#2563eb] focus:ring-2 focus:ring-[#c7d9f8]"
      />
    </label>
  );

  const desktopFilterBar = (
    <div className="hidden border-b border-[#d9e0da] bg-[#fbfcf8]/96 px-4 py-3 shadow-[0_10px_24px_rgba(38,52,45,0.06)] backdrop-blur lg:block">
      <div className="mx-auto grid max-w-[1800px] grid-cols-[minmax(18rem,1fr)_minmax(24rem,0.9fr)] gap-3 xl:grid-cols-[minmax(24rem,1fr)_minmax(28rem,0.75fr)]">
        {searchControl}
        <div className="grid min-w-0 grid-cols-2 gap-3">
          <SegmentedControl
            label="Distance"
            value={maxDistance}
            options={distanceOptions}
            onChange={updateFilter(setMaxDistance)}
          />
          <SegmentedControl
            label="Sort"
            value={sortMode}
            options={sortOptions}
            onChange={updateFilter(setSortMode)}
          />
        </div>
      </div>
    </div>
  );

  const mobileFilterControls = (
    <div className="border-b border-[#d9e0da] bg-[#fbfcf8] p-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71817a]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => startTransition(() => setSearchQuery(event.target.value))}
          placeholder="Search listings"
          className="h-11 w-full rounded-[8px] border border-[#d5ddd8] bg-[#fbfcf8] pl-10 pr-3 text-sm font-medium text-[#17231f] outline-none transition placeholder:text-[#8a9891] focus:border-[#2563eb] focus:ring-2 focus:ring-[#c7d9f8]"
        />
      </label>

      <details
        className="mt-2 rounded-[8px] border border-[#d9e0da] bg-[#eef3ef]"
        onToggle={(event) => {
          if (event.currentTarget.open) triggerHaptic();
        }}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-xs font-bold uppercase text-[#56655e]">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Controls
          </span>
          <span className="rounded-[6px] bg-[#fbfcf8] px-2 py-1 text-[10px]">
            {activeFilterCount ? `${activeFilterCount} active` : "none active"}
          </span>
        </summary>
        <div className="border-t border-[#d9e0da] p-3">
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
              onSelect={() => selectListing(option.id, isDesktop ? null : "map")}
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
    <section className="min-h-screen w-full bg-[#edf2ed] text-[#17231f] lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-0">
        <header className="sticky top-0 z-40 shrink-0 border-b border-[#d9e0da] bg-[#fbfcf8]/96 px-4 py-3 shadow-[0_10px_28px_rgba(38,52,45,0.08)] backdrop-blur sm:px-5 lg:px-6">
          <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase text-[#66726d]">
                <span>August 2026</span>
                <span className="h-1 w-1 rounded-full bg-[#9baaa2]" aria-hidden />
                <span>Strict under-$700 shortlist</span>
                <span className="h-1 w-1 rounded-full bg-[#9baaa2]" aria-hidden />
                <span>Last verified {verifiedDate}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                <h1 className="text-xl font-bold text-[#16221e] sm:text-2xl">
                  Miami Oxford 1BR shortlist
                </h1>
                <p className="text-sm font-semibold text-[#56655e]">
                  {summary.totalOptions} of {strictSummary.totalOptions} strict listings
                </p>
              </div>
            </div>

            <div className="hidden shrink-0 gap-2 text-xs font-bold lg:flex">
              <span className="rounded-[6px] bg-[#e8f6ef] px-3 py-2 text-[#145236]">
                {strictSummary.totalOptions} verified
              </span>
              <span className="rounded-[6px] bg-[#fff4e8] px-3 py-2 text-[#87420f]">
                under $700
              </span>
              <span className="rounded-[6px] bg-[#eef3ef] px-3 py-2 text-[#4f5f58]">
                8/1/26 posted
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 rounded-[8px] border border-[#d5ddd8] bg-[#eef3ef] p-1 lg:hidden">
            {(["map", "list"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => selectMobileTab(tab)}
                className={cn(
                  "h-10 rounded-[6px] text-sm font-bold capitalize transition",
                  mobileTab === tab
                    ? "bg-[#17231f] text-[#f8fbf8] shadow-sm"
                    : "text-[#56655e] hover:bg-white/80",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {desktopFilterBar}

        <div className="hidden w-full max-w-[1800px] flex-1 lg:mx-auto lg:grid lg:min-h-0 lg:grid-cols-[minmax(22rem,28rem)_minmax(0,1fr)] xl:grid-cols-[minmax(21rem,26rem)_minmax(30rem,1fr)_minmax(23rem,27rem)]">
          <aside className="flex h-full min-h-0 flex-col border-r border-[#d9e0da] bg-[#f3f6f1]">
            <ParentConfidenceStrip options={strictOptions} />
            {resultSummary}
            <AnimatePresence initial={false}>
              {selectedOption ? (
                <motion.div
                  key={selectedOption.id}
                  initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-[46vh] shrink-0 border-b border-[#d9e0da] p-3 xl:hidden"
                >
                  <DetailPanel option={selectedOption} compact onClose={() => setSelectedId(null)} />
                </motion.div>
              ) : null}
            </AnimatePresence>
            {listingList}
          </aside>

          <section className="min-h-0 overflow-hidden border-r border-[#d9e0da] bg-[#dce4df]">
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

          <aside className="hidden min-h-0 bg-[#eef3ef] p-3 xl:flex xl:flex-col">
            <AnimatePresence initial={false} mode="wait">
              {selectedOption ? (
                <motion.div
                  key={selectedOption.id}
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: 14 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-0 flex-1"
                >
                  <DetailPanel option={selectedOption} onClose={() => setSelectedId(null)} />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: 14 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-0 flex-1"
                >
                  <DetailPlaceholder summary={summary} />
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>

        <div className="flex flex-1 flex-col lg:hidden">
          <AnimatePresence initial={false} mode="wait">
          {mobileTab === "map" ? (
            <motion.section
              key="map"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="min-h-0 flex-1 border-b border-[#d9e0da]">
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
                    initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.985 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.985 }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { type: "spring", stiffness: 460, damping: 42, mass: 0.85 }
                    }
                    className="absolute inset-x-0 bottom-0 z-[700] p-2"
                    style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
                  >
                    <DetailPanel
                      option={selectedOption}
                      compact
                      mobile
                      onClose={() => setSelectedId(null)}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.section>
          ) : (
            <motion.aside
              key="list"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-0 flex-1 flex-col bg-[#f3f6f1]"
            >
              {mobileFilterControls}
              <ParentConfidenceStrip options={strictOptions} />
              {resultSummary}
              {listingList}
            </motion.aside>
          )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
