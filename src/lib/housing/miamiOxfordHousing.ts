export type HousingUnitType = "studio" | "efficiency" | "one-bedroom";

export type HousingPricingCadence =
  | "monthly"
  | "monthly-range"
  | "per-semester"
  | "contact-for-price";

export type HousingSourceKind = "primary" | "campus-affiliated" | "aggregator";
export type HousingSourceConfidence = "high" | "medium" | "low";
export type HousingDisclosureState = "none-listed" | "included" | "excluded" | "unknown";
export type HousingClarityStatus = "clear" | "partial" | "quote-required";
export type HousingFurnishedStatus =
  | "furnished"
  | "common-area-only"
  | "unfurnished"
  | "unknown";
export type HousingLaundryStatus = "in-unit" | "on-site" | "off-site-access" | "unknown";
export type HousingACStatus = "central" | "window-wall" | "yes-unspecified" | "unknown";

export interface HousingFeeItem {
  label: string;
  amount: number | null;
  timing: "lease-signing" | "move-in";
  refundable?: boolean;
  note?: string;
}

export interface HousingContactPath {
  label: string;
  href: string;
  kind: "apply" | "book" | "call" | "email" | "listing";
  note?: string;
}

export interface HousingOption {
  id: string;
  propertyName: string;
  optionName: string;
  unitType: HousingUnitType;
  address: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  walkMinutes: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number | null;
  pricingCadence: HousingPricingCadence;
  semesterDueAmount: number | null;
  semesterDueAmountUpper: number | null;
  schoolYearTotal: number | null;
  schoolYearTotalUpper: number | null;
  monthlyEquivalent: number | null;
  monthlyEquivalentUpper: number | null;
  moveInDue: number | null;
  moveInDueUpper: number | null;
  moveInDueHasUnknowns: boolean;
  securityDepositRefundable: number | null;
  adminOrLeaseSigningFees: HousingFeeItem[];
  taxesStatus: HousingDisclosureState;
  nonUtilityFeesStatus: HousingDisclosureState;
  leaseTermLabel: string;
  availabilityLabel: string;
  includedUtilities: string[];
  excludedUtilities: string[];
  unknownUtilities: string[];
  parkingIncluded: boolean | null;
  parkingCost: number | null;
  furnishedStatus: HousingFurnishedStatus;
  laundryStatus: HousingLaundryStatus;
  appliances: string[];
  ACStatus: HousingACStatus;
  pricingNotes: string[];
  availabilityNotes: string[];
  perks: string[];
  sourceUrl: string;
  sourceKind: HousingSourceKind;
  sourceConfidence: HousingSourceConfidence;
  lastVerifiedAt: string;
  contactPath: HousingContactPath;
}

export type HousingSortKey =
  | "best-fit"
  | "monthly-equivalent-asc"
  | "walk-asc"
  | "move-in-asc"
  | "name-asc";

export interface HousingFilters {
  unitTypes?: HousingUnitType[];
  maxWalkMinutes?: number;
  maxMonthlyEquivalent?: number;
  postedPriceOnly?: boolean;
  furnishedOnly?: boolean;
  utilitiesIncludedOnly?: boolean;
  parkingIncludedOnly?: boolean;
  searchQuery?: string;
}

export interface HousingSummary {
  totalOptions: number;
  postedPriceOptions: number;
  furnishedOptions: number;
  primarySourceOptions: number;
  monthlyEquivalentMin: number | null;
  monthlyEquivalentMax: number | null;
  walkMinutesMin: number | null;
  walkMinutesMax: number | null;
  clarityCounts: Record<HousingClarityStatus, number>;
}

export interface HousingMoneySummary {
  label: string;
  note: string;
  status: HousingClarityStatus;
}

const VERIFIED_AT = "2026-04-20";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function compareNames(a: HousingOption, b: HousingOption) {
  return `${a.propertyName} ${a.optionName}`.localeCompare(`${b.propertyName} ${b.optionName}`);
}

export function calculateSchoolYearTotalFromMonthly(monthlyRent: number) {
  return Math.round(monthlyRent * 10);
}

export function calculateMonthlyEquivalentFromSchoolYearTotal(schoolYearTotal: number) {
  return Math.round(schoolYearTotal / 10);
}

export function calculateMoveInDue(args: {
  firstRequiredInstallment: number | null;
  firstRequiredInstallmentUpper?: number | null;
  securityDepositRefundable: number | null;
  adminOrLeaseSigningFees: HousingFeeItem[];
}) {
  const {
    firstRequiredInstallment,
    firstRequiredInstallmentUpper = firstRequiredInstallment,
    securityDepositRefundable,
    adminOrLeaseSigningFees,
  } = args;

  if (firstRequiredInstallment === null) {
    return {
      amount: null,
      amountUpper: null,
      hasUnknownFees: true,
    };
  }

  let amount = firstRequiredInstallment;
  let amountUpper = firstRequiredInstallmentUpper ?? firstRequiredInstallment;
  let hasUnknownFees = false;

  if (securityDepositRefundable !== null) {
    amount += securityDepositRefundable;
    amountUpper += securityDepositRefundable;
  } else {
    hasUnknownFees = true;
  }

  for (const fee of adminOrLeaseSigningFees) {
    if (fee.amount === null) {
      hasUnknownFees = true;
      continue;
    }

    amount += fee.amount;
    amountUpper += fee.amount;
  }

  return {
    amount,
    amountUpper,
    hasUnknownFees,
  };
}

function formatList(values: string[]) {
  if (!values.length) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

export function formatHousingCurrency(amount: number | null) {
  if (amount === null) return "Unknown";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatHousingCurrencyRange(
  amount: number | null,
  amountUpper: number | null,
  suffix = "",
) {
  if (amount === null) {
    return "Unknown";
  }

  if (amountUpper !== null && amountUpper !== amount) {
    return `${formatHousingCurrency(amount)}-${formatHousingCurrency(amountUpper)}${suffix}`;
  }

  return `${formatHousingCurrency(amount)}${suffix}`;
}

export function formatHousingDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function getSourceKindLabel(kind: HousingSourceKind) {
  if (kind === "campus-affiliated") return "Campus portal";
  if (kind === "aggregator") return "Aggregator";
  return "Direct source";
}

export function getSourceConfidenceLabel(confidence: HousingSourceConfidence) {
  if (confidence === "high") return "High confidence";
  if (confidence === "medium") return "Medium confidence";
  return "Lower confidence";
}

export function getDisclosureLabel(disclosure: HousingDisclosureState) {
  if (disclosure === "none-listed") return "None listed";
  if (disclosure === "included") return "Included";
  if (disclosure === "excluded") return "Excluded";
  return "Unknown";
}

export function getUnitTypeLabel(unitType: HousingUnitType) {
  if (unitType === "studio") return "Studio";
  if (unitType === "efficiency") return "Efficiency";
  return "1BR";
}

export function getFurnishedStatusLabel(status: HousingFurnishedStatus) {
  if (status === "furnished") return "Furnished";
  if (status === "common-area-only") return "Common area furnished";
  if (status === "unfurnished") return "Unfurnished";
  return "Not posted";
}

export function getLaundryStatusLabel(status: HousingLaundryStatus) {
  if (status === "in-unit") return "In-unit";
  if (status === "on-site") return "On-site";
  if (status === "off-site-access") return "Nearby shared laundry";
  return "Not posted";
}

export function getACStatusLabel(status: HousingACStatus) {
  if (status === "central") return "Central A/C";
  if (status === "window-wall") return "Window or wall A/C";
  if (status === "yes-unspecified") return "A/C listed";
  return "Not posted";
}

export function getHousingClarityStatus(option: HousingOption): HousingClarityStatus {
  if (option.monthlyEquivalent === null) {
    return "quote-required";
  }

  const hasUnknowns =
    option.monthlyEquivalentUpper !== null ||
    option.pricingCadence === "monthly-range" ||
    option.unknownUtilities.length > 0 ||
    option.nonUtilityFeesStatus === "unknown" ||
    option.taxesStatus === "unknown" ||
    option.moveInDueHasUnknowns;

  return hasUnknowns ? "partial" : "clear";
}

export function getHousingClarityLabel(status: HousingClarityStatus) {
  if (status === "clear") return "Cost picture is fairly complete";
  if (status === "partial") return "Price posted, but some costs still need confirmation";
  return "Quote required";
}

export function buildRecurringAllInSummary(option: HousingOption): HousingMoneySummary {
  const status = getHousingClarityStatus(option);

  if (option.monthlyEquivalent === null) {
    return {
      label: "Price not posted",
      note: "Call or email for the live 1BR rate before ranking this as affordable.",
      status,
    };
  }

  const label = formatHousingCurrencyRange(
    option.monthlyEquivalent,
    option.monthlyEquivalentUpper,
    "/mo equivalent",
  );

  if (status === "clear") {
    const extras = option.excludedUtilities.length
      ? `Known extras: ${formatList(option.excludedUtilities)}.`
      : "No extra utility buckets were clearly pushed off-rent.";

    return {
      label,
      note: extras,
      status,
    };
  }

  if (option.unknownUtilities.length > 0) {
    return {
      label,
      note: `Unknown utilities still sitting outside the posted price: ${formatList(option.unknownUtilities)}.`,
      status,
    };
  }

  if (option.nonUtilityFeesStatus === "unknown") {
    return {
      label,
      note: "Posted price exists, but the source does not fully break out non-utility fees.",
      status,
    };
  }

  return {
    label,
    note: "Use this as a comparison number, not a guaranteed all-in charge.",
    status,
  };
}

export function buildMoveInDueSummary(option: HousingOption): HousingMoneySummary {
  const status = getHousingClarityStatus(option) === "quote-required" ? "quote-required" : option.moveInDueHasUnknowns ? "partial" : "clear";

  if (option.moveInDue === null) {
    return {
      label: "Move-in due not posted",
      note: "The source does not show enough to estimate first cash needed before move-in.",
      status,
    };
  }

  const labelBase = formatHousingCurrencyRange(option.moveInDue, option.moveInDueUpper, "");

  if (option.moveInDueHasUnknowns) {
    return {
      label: `${labelBase}+`,
      note: "Lower bound only. Ask about any missing deposit or lease-signing charges.",
      status,
    };
  }

  return {
    label: labelBase,
    note: "Includes the first required rent installment plus the posted deposit and lease-signing items.",
    status,
  };
}

export function buildSchoolYearSummary(option: HousingOption): HousingMoneySummary {
  const status = getHousingClarityStatus(option);

  if (option.schoolYearTotal === null) {
    return {
      label: "School-year total not posted",
      note: "No usable school-year comparison is available from the current source.",
      status,
    };
  }

  return {
    label: formatHousingCurrencyRange(option.schoolYearTotal, option.schoolYearTotalUpper),
    note:
      option.pricingCadence === "monthly" || option.pricingCadence === "monthly-range"
        ? "Shown as a 10-month comparison for August-May planning; monthly leases still carry summer exposure."
        : "Taken from the semester-structured student lease math on the source listing.",
    status,
  };
}

function walkScore(walkMinutes: number) {
  if (walkMinutes <= 8) return 100;
  if (walkMinutes <= 10) return 92;
  if (walkMinutes <= 12) return 84;
  if (walkMinutes <= 15) return 72;
  if (walkMinutes <= 18) return 58;
  if (walkMinutes <= 20) return 48;
  if (walkMinutes <= 25) return 34;
  return 20;
}

function affordabilityScore(monthlyEquivalent: number | null) {
  if (monthlyEquivalent === null) return 0;

  const normalized = 100 - ((monthlyEquivalent - 550) / 700) * 100;
  return clamp(Math.round(normalized), 0, 100);
}

function clarityMultiplier(status: HousingClarityStatus) {
  if (status === "clear") return 1;
  if (status === "partial") return 0.55;
  return 0.15;
}

function confidenceScore(confidence: HousingSourceConfidence) {
  if (confidence === "high") return 100;
  if (confidence === "medium") return 70;
  return 40;
}

export function getRankingScore(option: HousingOption) {
  const clarity = getHousingClarityStatus(option);
  const walkComponent = walkScore(option.walkMinutes) * 0.5;
  const affordabilityComponent =
    affordabilityScore(option.monthlyEquivalent) * clarityMultiplier(clarity) * 0.35;
  const confidenceComponent = confidenceScore(option.sourceConfidence) * 0.15;

  return Number((walkComponent + affordabilityComponent + confidenceComponent).toFixed(2));
}

export function getMissingCostWarnings(option: HousingOption) {
  const warnings: string[] = [];

  if (option.monthlyEquivalent === null) {
    warnings.push("Rent is not posted for the 1BR path.");
  }

  if (option.monthlyEquivalentUpper !== null) {
    warnings.push("Posted pricing is a range, not a locked quote.");
  }

  if (option.unknownUtilities.length > 0) {
    warnings.push(`Unknown utilities: ${formatList(option.unknownUtilities)}.`);
  }

  if (option.moveInDueHasUnknowns) {
    warnings.push("Move-in cash still has missing deposit or signing pieces.");
  }

  if (option.nonUtilityFeesStatus === "unknown" || option.taxesStatus === "unknown") {
    warnings.push("Taxes or required fees are not fully broken out online.");
  }

  if (option.sourceConfidence === "low") {
    warnings.push("This ranking relies on second-hand campus-portal data.");
  }

  if (
    option.availabilityNotes.some((note) => note.toLowerCase().includes("reconfirm")) ||
    option.availabilityNotes.some((note) => note.toLowerCase().includes("leased"))
  ) {
    warnings.push("Ask whether an August 2026 unit is still actually available.");
  }

  return warnings;
}

export function getQuestionsToAsk(option: HousingOption) {
  const questions: string[] = [];

  if (option.monthlyEquivalent === null) {
    questions.push("What is the current August 2026 rate for the actual 1BR or efficiency unit?");
  }

  if (option.monthlyEquivalentUpper !== null) {
    questions.push("Which specific unit is available at the low end of the posted price range?");
  }

  if (option.unknownUtilities.length > 0) {
    questions.push(`Which utilities are still outside the posted rent: ${formatList(option.unknownUtilities)}?`);
  }

  if (option.moveInDueHasUnknowns) {
    questions.push("What deposit, admin fee, or lease-signing charge is due before keys are released?");
  }

  if (
    option.availabilityNotes.some((note) => note.toLowerCase().includes("reconfirm")) ||
    option.availabilityNotes.some((note) => note.toLowerCase().includes("leased"))
  ) {
    questions.push("Is there an August 2026 exemption-case unit still open, or is this now a waitlist/rollover lead?");
  }

  if (option.parkingIncluded === null) {
    questions.push("Is parking included, optional, or charged separately?");
  }

  if (option.pricingCadence === "monthly" || option.pricingCadence === "monthly-range") {
    questions.push("If this is a 12-month lease, is there any way to avoid paying summer months?");
  }

  return questions.slice(0, 5);
}

export function sortHousingOptions(options: HousingOption[], sortKey: HousingSortKey) {
  const sorted = [...options];

  sorted.sort((a, b) => {
    if (sortKey === "name-asc") {
      return compareNames(a, b);
    }

    if (sortKey === "walk-asc") {
      if (a.walkMinutes !== b.walkMinutes) {
        return a.walkMinutes - b.walkMinutes;
      }

      return compareNames(a, b);
    }

    if (sortKey === "monthly-equivalent-asc") {
      if (a.monthlyEquivalent === null && b.monthlyEquivalent === null) {
        return compareNames(a, b);
      }

      if (a.monthlyEquivalent === null) return 1;
      if (b.monthlyEquivalent === null) return -1;
      if (a.monthlyEquivalent !== b.monthlyEquivalent) {
        return a.monthlyEquivalent - b.monthlyEquivalent;
      }

      return compareNames(a, b);
    }

    if (sortKey === "move-in-asc") {
      if (a.moveInDue === null && b.moveInDue === null) {
        return compareNames(a, b);
      }

      if (a.moveInDue === null) return 1;
      if (b.moveInDue === null) return -1;
      if (a.moveInDue !== b.moveInDue) {
        return a.moveInDue - b.moveInDue;
      }

      return compareNames(a, b);
    }

    const scoreDelta = getRankingScore(b) - getRankingScore(a);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return compareNames(a, b);
  });

  return sorted;
}

export function filterHousingOptions(options: HousingOption[], filters: HousingFilters) {
  return options.filter((option) => {
    if (filters.unitTypes?.length && !filters.unitTypes.includes(option.unitType)) {
      return false;
    }

    if (filters.maxWalkMinutes !== undefined && option.walkMinutes > filters.maxWalkMinutes) {
      return false;
    }

    if (filters.maxMonthlyEquivalent !== undefined) {
      if (option.monthlyEquivalent === null || option.monthlyEquivalent > filters.maxMonthlyEquivalent) {
        return false;
      }
    }

    if (filters.postedPriceOnly && option.monthlyEquivalent === null) {
      return false;
    }

    if (filters.furnishedOnly && option.furnishedStatus !== "furnished") {
      return false;
    }

    if (filters.utilitiesIncludedOnly && option.includedUtilities.length === 0) {
      return false;
    }

    if (filters.parkingIncludedOnly && option.parkingIncluded !== true) {
      return false;
    }

    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.trim().toLowerCase();
      const haystack = [
        option.propertyName,
        option.optionName,
        option.address,
        option.pricingNotes.join(" "),
        option.availabilityNotes.join(" "),
        option.perks.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function buildHousingSummary(options: HousingOption[]): HousingSummary {
  const monthlyValues = options.flatMap((option) =>
    option.monthlyEquivalentUpper !== null
      ? [option.monthlyEquivalent, option.monthlyEquivalentUpper]
      : [option.monthlyEquivalent],
  ).filter((value): value is number => value !== null);
  const walkValues = options.map((option) => option.walkMinutes);

  const clarityCounts = options.reduce<Record<HousingClarityStatus, number>>(
    (counts, option) => {
      counts[getHousingClarityStatus(option)] += 1;
      return counts;
    },
    {
      clear: 0,
      partial: 0,
      "quote-required": 0,
    },
  );

  return {
    totalOptions: options.length,
    postedPriceOptions: options.filter((option) => option.monthlyEquivalent !== null).length,
    furnishedOptions: options.filter((option) => option.furnishedStatus === "furnished").length,
    primarySourceOptions: options.filter((option) => option.sourceKind === "primary").length,
    monthlyEquivalentMin: monthlyValues.length ? Math.min(...monthlyValues) : null,
    monthlyEquivalentMax: monthlyValues.length ? Math.max(...monthlyValues) : null,
    walkMinutesMin: walkValues.length ? Math.min(...walkValues) : null,
    walkMinutesMax: walkValues.length ? Math.max(...walkValues) : null,
    clarityCounts,
  };
}

export const miamiOxfordHousingOptions: HousingOption[] = [
  {
    id: "308-s-campus",
    propertyName: "308 S. Campus Ave.",
    optionName: "1-Bedroom Apartment",
    unitType: "one-bedroom",
    address: "308 S Campus Ave, Oxford, OH 45056",
    latitude: 39.5062674,
    longitude: -84.7399581,
    distanceMiles: 0.38,
    walkMinutes: 8,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "monthly",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(800),
    schoolYearTotalUpper: null,
    monthlyEquivalent: 800,
    monthlyEquivalentUpper: null,
    moveInDue: 800,
    moveInDueUpper: null,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "1-year lease",
    availabilityLabel: "2026-2027 price captured; currently shown as leased",
    includedUtilities: ["water", "trash", "gas"],
    excludedUtilities: ["electric", "cable/internet"],
    unknownUtilities: [],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "off-site-access",
    appliances: [],
    ACStatus: "window-wall",
    pricingNotes: [
      "SCQ posts this as monthly rent, which is cleaner for parent budgeting than semester billing.",
      "Move-in due is only a lower bound because the live source does not post a deposit or any lease-signing fee.",
    ],
    availabilityNotes: [
      "The 2026-2027 page shows 1BR pricing at $800 per month and labels the unit type as leased.",
      "Useful for benchmark pricing, but August 2026 availability needs direct office confirmation.",
    ],
    perks: [
      "Shortest posted walk in the atlas without the Campus Courts semester pricing jump.",
      "One free parking spot per apartment.",
      "Landlord covers water, trash, and gas.",
    ],
    sourceUrl:
      "https://southcampusquarter.com/miami-university-apartments-oxford-ohio-properties/308-south-campus-avenue-1-bedroom-apartments",
    sourceKind: "primary",
    sourceConfidence: "high",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open SCQ leasing page",
      href:
        "https://southcampusquarter.com/miami-university-apartments-oxford-ohio-properties/308-south-campus-avenue-1-bedroom-apartments",
      kind: "apply",
      note: "This property page includes the live SCQ contact form for availability questions.",
    },
  },
  {
    id: "26-east-walnut-apt-4",
    propertyName: "26 East Walnut Street",
    optionName: "Apt 4 Efficiency",
    unitType: "efficiency",
    address: "26 E Walnut St, Oxford, OH 45056",
    latitude: 39.5095131,
    longitude: -84.7414275,
    distanceMiles: 0.46,
    walkMinutes: 9,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 4200,
    semesterDueAmountUpper: null,
    schoolYearTotal: 8800,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(8800),
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 4200,
      securityDepositRefundable: 200,
      adminOrLeaseSigningFees: [
        {
          label: "Lease-signing rent advance",
          amount: 400,
          timing: "lease-signing",
        },
      ],
    }).amount,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 200,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 400,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "2-semester lease (includes J term)",
    availabilityLabel: "Live page now rolls to 2027-2028",
    includedUtilities: ["water", "sewer", "trash"],
    excludedUtilities: [],
    unknownUtilities: ["electric", "internet"],
    parkingIncluded: null,
    parkingCost: null,
    furnishedStatus: "unknown",
    laundryStatus: "on-site",
    appliances: ["dishwasher", "garbage disposal"],
    ACStatus: "window-wall",
    pricingNotes: [
      "Oxford Real Estate posts the total rent and the lease-signing breakdown, so the move-in cash math is unusually clean.",
      "Monthly equivalent is a 10-month comparison number; the actual billing cadence is semester-based.",
    ],
    availabilityNotes: [
      "Search indexing previously showed this unit under 2026-2027; the live direct page currently displays 2027-2028.",
      "Treat August 2026 timing as a confirm-before-calling item rather than locked availability.",
    ],
    perks: [
      "Efficiency layout keeps the direct source price below many true 1BRs.",
      "Water, sewer, and trash are already folded into the posted rent.",
      "Direct listing discloses deposit and lease-signing rent advance.",
    ],
    sourceUrl: "https://www.oxre.com/rentals/26-east-walnut-street-apt-4",
    sourceKind: "primary",
    sourceConfidence: "medium",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://www.oxre.com/rentals/26-east-walnut-street-apt-4",
      kind: "listing",
      note: "Use the live listing to verify if Oxford Real Estate still has a 2026 move-in path.",
    },
  },
  {
    id: "18-n-elm",
    propertyName: "18 N. Elm",
    optionName: "1 Bedroom Duplex",
    unitType: "one-bedroom",
    address: "18 N Elm St, Oxford, OH 45056",
    latitude: 39.5112275,
    longitude: -84.7472819,
    distanceMiles: 0.79,
    walkMinutes: 16,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 3260,
    semesterDueAmountUpper: null,
    schoolYearTotal: 6920,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(6920),
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 3260,
      securityDepositRefundable: 200,
      adminOrLeaseSigningFees: [
        {
          label: "Lease-signing rent advance",
          amount: 400,
          timing: "lease-signing",
        },
      ],
    }).amount,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 200,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 400,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "2-semester lease (includes J term)",
    availabilityLabel: "Live page now rolls to 2027-2028",
    includedUtilities: [],
    excludedUtilities: ["electric", "gas", "water", "sewer", "trash", "internet"],
    unknownUtilities: [],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "unknown",
    appliances: [],
    ACStatus: "central",
    pricingNotes: [
      "The direct source cleanly separates semester billing, lease-signing rent, and the refundable deposit.",
      "This is one of the clearest direct-price reads if the August 2026 inventory still exists.",
    ],
    availabilityNotes: [
      "The live direct page now shows 2027-2028, not 2026-2027.",
      "Use the listing for pricing reference, but reconfirm August 2026 inventory before treating it as live.",
    ],
    perks: [
      "Lowest direct-source semester total in the atlas.",
      "Off-street parking and central air are both explicitly posted.",
      "All utilities are disclosed as tenant-paid instead of left vague.",
    ],
    sourceUrl: "https://oxre.com/rentals/18-n-elm",
    sourceKind: "primary",
    sourceConfidence: "medium",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://oxre.com/rentals/18-n-elm",
      kind: "listing",
      note: "Direct listing is the cleanest verification point before calling Oxford Real Estate.",
    },
  },
  {
    id: "23-e-high-apt-1-up",
    propertyName: "23 E. High",
    optionName: "Apt 1 Up",
    unitType: "one-bedroom",
    address: "23 E High St, Oxford, OH 45056",
    latitude: 39.5103235,
    longitude: -84.7415711,
    distanceMiles: 0.49,
    walkMinutes: 10,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 4500,
    semesterDueAmountUpper: null,
    schoolYearTotal: 9400,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(9400),
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 4500,
      securityDepositRefundable: 200,
      adminOrLeaseSigningFees: [
        {
          label: "Lease-signing rent advance",
          amount: 400,
          timing: "lease-signing",
        },
      ],
    }).amount,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 200,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 400,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "2-semester lease (includes J term)",
    availabilityLabel: "Live page now rolls to 2027-2028",
    includedUtilities: [],
    excludedUtilities: [],
    unknownUtilities: ["utilities"],
    parkingIncluded: null,
    parkingCost: null,
    furnishedStatus: "unknown",
    laundryStatus: "unknown",
    appliances: [],
    ACStatus: "unknown",
    pricingNotes: [
      "The direct source gives a clean semester price and signing breakdown.",
      "No utilities are broken out on the live page, so the monthly equivalent is still rent-only.",
    ],
    availabilityNotes: [
      "Earlier indexing showed 2026-2027; the live page currently shows 2027-2028.",
      "Downtown location is still relevant for planning, but August 2026 status needs direct confirmation.",
    ],
    perks: [
      "Very short walk for a true 1BR downtown.",
      "Direct Oxford Real Estate pricing structure is posted.",
      "Simple one-occupant student-lease setup.",
    ],
    sourceUrl: "https://oxre.com/rentals/23-e-high-apt-1-up",
    sourceKind: "primary",
    sourceConfidence: "medium",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://oxre.com/rentals/23-e-high-apt-1-up",
      kind: "listing",
      note: "Use the direct listing to verify live timing before contacting the office.",
    },
  },
  {
    id: "10-west-sycamore",
    propertyName: "10 West Sycamore",
    optionName: "1 Bedroom Apartment",
    unitType: "one-bedroom",
    address: "10 W Sycamore St, Oxford, OH 45056",
    latitude: 39.5152077,
    longitude: -84.742584,
    distanceMiles: 0.72,
    walkMinutes: 14,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "monthly-range",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(595),
    schoolYearTotalUpper: calculateSchoolYearTotalFromMonthly(675),
    monthlyEquivalent: 595,
    monthlyEquivalentUpper: 675,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 595,
      firstRequiredInstallmentUpper: 675,
      securityDepositRefundable: 650,
      adminOrLeaseSigningFees: [],
    }).amount,
    moveInDueUpper: calculateMoveInDue({
      firstRequiredInstallment: 595,
      firstRequiredInstallmentUpper: 675,
      securityDepositRefundable: 650,
      adminOrLeaseSigningFees: [],
    }).amountUpper,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: 650,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "12-month lease",
    availabilityLabel: "Campus portal shows 8/1/26 availability",
    includedUtilities: ["water", "sewer", "trash"],
    excludedUtilities: [],
    unknownUtilities: ["remaining utilities"],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "on-site",
    appliances: ["dishwasher", "garbage disposal"],
    ACStatus: "yes-unspecified",
    pricingNotes: [
      "The campus-affiliated portal shows a monthly range and a refundable deposit, but still warns that charges due at move-in or move-out may not be fully captured.",
      "School-year total is shown as a 10-month comparison only; this listing is a 12-month lease.",
    ],
    availabilityNotes: [
      "Campus portal labels the unit available for 8/1/26 and says the listing was updated within the past two weeks.",
      "This is not a direct landlord site, so confirm the exact unit, price tier, and August timing with Morrison Rentals.",
    ],
    perks: [
      "One of the lowest posted monthly ranges in the atlas.",
      "Water, sewer, and trash are already included.",
      "Quiet-building notes plus off-street parking help the parent-read pitch.",
    ],
    sourceUrl:
      "https://www.miamiohoffcampus.com/housing/property/10-west-sycamore-1-bedroom-apts-morrison-rentals/ocp8y3ezd0",
    sourceKind: "campus-affiliated",
    sourceConfidence: "low",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Call Morrison Rentals",
      href: "tel:5139163836",
      kind: "call",
      note: "The campus portal exposes a phone-first contact path for this listing.",
    },
  },
  {
    id: "717-mcguffey",
    propertyName: "717 McGuffey",
    optionName: "1 Bedroom Apartment",
    unitType: "one-bedroom",
    address: "717 McGuffey Avenue, Oxford, OH 45056",
    latitude: 39.5029192,
    longitude: -84.75265,
    distanceMiles: 1.1,
    walkMinutes: 22,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "monthly-range",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(595),
    schoolYearTotalUpper: calculateSchoolYearTotalFromMonthly(650),
    monthlyEquivalent: 595,
    monthlyEquivalentUpper: 650,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 595,
      firstRequiredInstallmentUpper: 650,
      securityDepositRefundable: 650,
      adminOrLeaseSigningFees: [],
    }).amount,
    moveInDueUpper: calculateMoveInDue({
      firstRequiredInstallment: 595,
      firstRequiredInstallmentUpper: 650,
      securityDepositRefundable: 650,
      adminOrLeaseSigningFees: [],
    }).amountUpper,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: 650,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "12-month lease",
    availabilityLabel: "Campus portal shows 8/1/26 availability",
    includedUtilities: ["water", "sewer", "trash", "recycling"],
    excludedUtilities: [],
    unknownUtilities: ["remaining utilities"],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "in-unit",
    appliances: [],
    ACStatus: "yes-unspecified",
    pricingNotes: [
      "Portal listing is strong on deposit details, but still carries the generic plus-fees caveat.",
      "School-year total is shown as an August-May comparison, not the full 12-month lease liability.",
    ],
    availabilityNotes: [
      "Campus portal shows this one-bedroom available 8/1/26.",
      "Portal data is still second-hand, so verify the exact rent tier and laundry setup with Morrison Rentals.",
    ],
    perks: [
      "Ties the lowest monthly floor in the atlas.",
      "Water, sewer, trash, and recycling are included in the portal fee table.",
      "Posted as in-unit laundry on the campus housing portal.",
    ],
    sourceUrl:
      "https://www.miamiohoffcampus.com/housing/property/717-mcguffey-1-bedroom-apts-morrison-rentals/ocpqv63csy",
    sourceKind: "campus-affiliated",
    sourceConfidence: "low",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Call Morrison Rentals",
      href: "tel:5139164182",
      kind: "call",
      note: "Phone contact is the clearest live booking path exposed on the campus listing.",
    },
  },
  {
    id: "718-south-locust",
    propertyName: "718 South Locust",
    optionName: "1 Bedroom Apartment",
    unitType: "one-bedroom",
    address: "718 South Locust Street, Oxford, OH 45056",
    latitude: 39.5031202,
    longitude: -84.7495368,
    distanceMiles: 0.93,
    walkMinutes: 19,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "monthly-range",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(625),
    schoolYearTotalUpper: calculateSchoolYearTotalFromMonthly(675),
    monthlyEquivalent: 625,
    monthlyEquivalentUpper: 675,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 625,
      firstRequiredInstallmentUpper: 675,
      securityDepositRefundable: 675,
      adminOrLeaseSigningFees: [],
    }).amount,
    moveInDueUpper: calculateMoveInDue({
      firstRequiredInstallment: 625,
      firstRequiredInstallmentUpper: 675,
      securityDepositRefundable: 675,
      adminOrLeaseSigningFees: [],
    }).amountUpper,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: 675,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "12-month lease or academic year option",
    availabilityLabel: "Campus portal shows 8/1/26 availability",
    includedUtilities: ["water", "sewer", "trash"],
    excludedUtilities: [],
    unknownUtilities: ["remaining utilities"],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "on-site",
    appliances: ["dishwasher", "garbage disposal"],
    ACStatus: "yes-unspecified",
    pricingNotes: [
      "Campus portal exposes a slightly tighter fee table than the old March scrape, including the refundable deposit.",
      "The listing still carries a plus-fees warning, so the move-in number is safest as a lower-bound estimate.",
    ],
    availabilityNotes: [
      "Portal marks the one-bedroom available 8/1/26 and notes the page was updated within the past two weeks.",
      "Confirm whether the low end of the rent range still corresponds to an actual available unit.",
    ],
    perks: [
      "Posted monthly range stays relatively low for a true 1BR.",
      "Water, sewer, and trash are included.",
      "Laundry and off-street parking are both explicitly mentioned.",
    ],
    sourceUrl:
      "https://www.miamiohoffcampus.com/housing/property/718-south-locust-street/ocp44xjxzk",
    sourceKind: "campus-affiliated",
    sourceConfidence: "low",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Call Morrison Rentals",
      href: "tel:5139163964",
      kind: "call",
      note: "Campus portal lists a direct phone number for this property manager.",
    },
  },
  {
    id: "campus-courts",
    propertyName: "Campus Courts",
    optionName: "1 Bedroom No Balcony",
    unitType: "one-bedroom",
    address: "540 S Campus Ave, Oxford, OH 45056",
    latitude: 39.504224,
    longitude: -84.7394671,
    distanceMiles: 0.42,
    walkMinutes: 8,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 5800,
    semesterDueAmountUpper: null,
    schoolYearTotal: 11600,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(11600),
    monthlyEquivalentUpper: null,
    moveInDue: 5800,
    moveInDueUpper: null,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "Per tenant / per semester / per bedroom",
    availabilityLabel: "2026-2027 1BR shown as leased",
    includedUtilities: [],
    excludedUtilities: ["electric", "water"],
    unknownUtilities: [],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "common-area-only",
    laundryStatus: "in-unit",
    appliances: [],
    ACStatus: "unknown",
    pricingNotes: [
      "SCQ prices the 1BR as per tenant, per semester, per bedroom; for a 1BR that effectively reads as the single-tenant semester charge.",
      "Move-in due is a lower bound because the live page does not post a deposit, and water is billed separately by SCQ.",
    ],
    availabilityNotes: [
      "SCQ still shows the 2026-2027 one-bedroom price but labels the 1BR as leased.",
      "Use this as a walkability and price anchor, then ask about additional options or waitlist paths.",
    ],
    perks: [
      "Shortest walk in the atlas.",
      "Major renovation completed in 2024 with in-unit washer/dryer.",
      "One free parking spot per unit, with a possible extra permit via lottery.",
    ],
    sourceUrl:
      "https://southcampusquarter.com/miami-university-apartments-oxford-ohio-properties/campus-courts-1-2-bedroom-apartments",
    sourceKind: "primary",
    sourceConfidence: "high",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open SCQ leasing page",
      href:
        "https://southcampusquarter.com/miami-university-apartments-oxford-ohio-properties/campus-courts-1-2-bedroom-apartments",
      kind: "apply",
      note: "SCQ keeps the pricing and the contact form on the same property page.",
    },
  },
  {
    id: "the-vines",
    propertyName: "The Vines",
    optionName: "Furnished 1BR",
    unitType: "one-bedroom",
    address: "205 E Vine St, Oxford, OH 45056",
    latitude: 39.5134995,
    longitude: -84.7389112,
    distanceMiles: 0.5,
    walkMinutes: 10,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "contact-for-price",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: null,
    schoolYearTotalUpper: null,
    monthlyEquivalent: null,
    monthlyEquivalentUpper: null,
    moveInDue: null,
    moveInDueUpper: null,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "School-year availability posted; exact lease math not shown",
    availabilityLabel: "26/27 and 27/28 school years posted",
    includedUtilities: ["water", "sewer", "trash"],
    excludedUtilities: ["electric", "internet"],
    unknownUtilities: [],
    parkingIncluded: null,
    parkingCost: null,
    furnishedStatus: "furnished",
    laundryStatus: "on-site",
    appliances: ["dishwasher", "microwave"],
    ACStatus: "central",
    pricingNotes: [
      "Oxford Real Estate posts the furnished 1BR concept, but not the live price.",
      "This stays in the atlas mainly because it is one of the rare furnished true-1BR paths close to campus.",
    ],
    availabilityNotes: [
      "The live direct page still lists units for the 26/27 and 27/28 school years.",
      "Ask for the exact unit, furnishing package, rent, and deposit before using it in a family budget decision.",
    ],
    perks: [
      "Furnished option within a short walk of campus and Uptown.",
      "Dishwasher, microwave, and central A/C are all explicitly posted.",
      "On-site coin-op laundry and off-street parking are both mentioned.",
    ],
    sourceUrl: "https://www.oxre.com/rentals/the-vines-205-east-vine-street",
    sourceKind: "primary",
    sourceConfidence: "medium",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Call Oxford Real Estate",
      href: "tel:5135234532",
      kind: "call",
      note: "The direct listing tells prospects to call Oxford Real Estate for pricing and details.",
    },
  },
  {
    id: "28-east-high-apt-a",
    propertyName: "28 East High",
    optionName: "Apt A Efficiency",
    unitType: "efficiency",
    address: "28 E High St, Oxford, OH 45056",
    latitude: 39.5105557,
    longitude: -84.7414217,
    distanceMiles: 0.48,
    walkMinutes: 10,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 6100,
    semesterDueAmountUpper: null,
    schoolYearTotal: 12600,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(12600),
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 6100,
      securityDepositRefundable: 200,
      adminOrLeaseSigningFees: [
        {
          label: "Lease-signing rent advance",
          amount: 400,
          timing: "lease-signing",
        },
      ],
    }).amount,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 200,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 400,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "2-semester lease (includes J term)",
    availabilityLabel: "Live page now rolls to 2027-2028",
    includedUtilities: ["electric", "water", "sewer", "trash"],
    excludedUtilities: [],
    unknownUtilities: ["internet"],
    parkingIncluded: null,
    parkingCost: null,
    furnishedStatus: "unknown",
    laundryStatus: "unknown",
    appliances: [],
    ACStatus: "unknown",
    pricingNotes: [
      "This is a premium efficiency price point, but the direct listing is unusually clear about total school-year rent and lease-signing math.",
      "All core utilities except internet are explicitly bundled into the posted rent.",
    ],
    availabilityNotes: [
      "The live page currently points to 2027-2028 inventory, even though earlier indexing tied it to 2026-2027.",
      "Use this as a real pricing anchor for high-street efficiencies, not as guaranteed August 2026 availability.",
    ],
    perks: [
      "Efficiency layout still gets a very short walk.",
      "Electric, water, sewer, and trash are all included.",
      "Direct listing cleanly discloses deposit and lease-signing rent advance.",
    ],
    sourceUrl: "https://www.oxre.com/rentals/28-e-high-apt-a",
    sourceKind: "primary",
    sourceConfidence: "medium",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://www.oxre.com/rentals/28-e-high-apt-a",
      kind: "listing",
      note: "Direct listing is the right place to verify whether this efficiency still has a 2026 move-in path.",
    },
  },
];
