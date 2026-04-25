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
export type HousingListTier = "main-under-1k" | "backup-over-1k" | "watchlist";
export type HousingAvailabilityConfidence =
  | "confirmed-2026"
  | "likely-needs-confirmation"
  | "comp-only";
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
  listTier: HousingListTier;
  availabilityConfidence: HousingAvailabilityConfidence;
  lastVerifiedAt: string;
  sourceSnapshotNotes: string[];
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
  listTiers?: HousingListTier[];
  maxDistanceMiles?: number;
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
  mainUnder1kOptions: number;
  backupOptions: number;
  watchlistOptions: number;
  monthlyEquivalentMin: number | null;
  monthlyEquivalentMax: number | null;
  distanceMilesMin: number | null;
  distanceMilesMax: number | null;
  walkMinutesMin: number | null;
  walkMinutesMax: number | null;
  clarityCounts: Record<HousingClarityStatus, number>;
}

export interface HousingMoneySummary {
  label: string;
  note: string;
  status: HousingClarityStatus;
}

export interface HousingAnchor {
  label: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sourceLabel: string;
  sourceUrl: string;
}

export interface HousingDistanceSummary {
  distanceMiles: number;
  walkMinutes: number;
  label: string;
}

const VERIFIED_AT = "2026-04-24";

export const ETHAN_PARENT_CONTRIBUTION = 500;
export const STRICT_MONTHLY_RENT_CEILING = 700;

export const miamiOxfordCampusAnchor = {
  label: "Armstrong / Uptown campus anchor",
  name: "Armstrong Student Center",
  address: "550 E. Spring St., Oxford, OH 45056",
  latitude: 39.50741,
  longitude: -84.73311,
  sourceLabel: "Miami University Armstrong Student Center directions page",
  sourceUrl: "https://miamioh.edu/centers-institutes/armstrong-student-center/about/directions.html",
} as const satisfies HousingAnchor;

export const miamiOxfordRecCenterAnchor = {
  label: "Rec Center anchor",
  name: "Recreational Sports Center",
  address: "750 S. Oak St., Oxford, OH 45056",
  latitude: 39.50388,
  longitude: -84.73625,
  sourceLabel: "Miami University Recreational Sports Center page",
  sourceUrl:
    "https://miamioh.edu/athletics-recreation/recreation/facilities/recreational-sports-center.html",
} as const satisfies HousingAnchor;

const EARTH_RADIUS_MILES = 3958.7613;
const APPROXIMATE_WALK_MINUTES_PER_MILE = 20;

export function calculateDistanceMiles(
  from: Pick<HousingAnchor, "latitude" | "longitude">,
  to: Pick<HousingAnchor, "latitude" | "longitude">,
) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  const distanceMiles =
    2 * EARTH_RADIUS_MILES * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return Number(distanceMiles.toFixed(2));
}

export function calculateApproximateWalkMinutes(distanceMiles: number) {
  return Math.max(1, Math.round(distanceMiles * APPROXIMATE_WALK_MINUTES_PER_MILE));
}

export function getArmstrongDistance(option: HousingOption): HousingDistanceSummary {
  return {
    distanceMiles: option.distanceMiles,
    walkMinutes: option.walkMinutes,
    label: `${option.distanceMiles.toFixed(2)} mi to Armstrong`,
  };
}

export function getRecCenterDistance(option: HousingOption): HousingDistanceSummary {
  const distanceMiles = calculateDistanceMiles(option, miamiOxfordRecCenterAnchor);
  const walkMinutes = calculateApproximateWalkMinutes(distanceMiles);

  return {
    distanceMiles,
    walkMinutes,
    label: `${distanceMiles.toFixed(2)} mi to Rec Center`,
  };
}

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

export function calculateEthanPrice(amount: number | null) {
  if (amount === null) return null;

  return Math.max(0, amount - ETHAN_PARENT_CONTRIBUTION);
}

export function calculateEthanPriceRange(option: HousingOption) {
  const min = calculateEthanPrice(option.monthlyEquivalent);
  const max = calculateEthanPrice(option.monthlyEquivalentUpper ?? option.monthlyEquivalent);

  return {
    min,
    max,
    label: formatHousingCurrencyRange(min, max),
  };
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

export function getListTierLabel(tier: HousingListTier) {
  if (tier === "main-under-1k") return "Main under $1k";
  if (tier === "backup-over-1k") return "Backup over $1k";
  return "Watchlist";
}

export function getAvailabilityConfidenceLabel(confidence: HousingAvailabilityConfidence) {
  if (confidence === "confirmed-2026") return "2026 timing posted";
  if (confidence === "likely-needs-confirmation") return "Needs confirmation";
  return "Comparison only";
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

function hasPostedAugust2026Availability(option: HousingOption) {
  const availabilityText = [option.availabilityLabel, ...option.availabilityNotes]
    .join(" ")
    .toLowerCase();

  return (
    availabilityText.includes("8/1/26") ||
    availabilityText.includes("08/01/26") ||
    availabilityText.includes("august 2026")
  );
}

export function isStrictAffordableNextYearOneBed(option: HousingOption) {
  const upperRent = option.monthlyEquivalentUpper ?? option.monthlyEquivalent;

  return (
    option.unitType === "one-bedroom" &&
    option.bedrooms === 1 &&
    option.bathrooms === 1 &&
    option.availabilityConfidence === "confirmed-2026" &&
    hasPostedAugust2026Availability(option) &&
    option.monthlyEquivalent !== null &&
    upperRent !== null &&
    upperRent <= STRICT_MONTHLY_RENT_CEILING
  );
}

function parentAffordabilityScore(option: HousingOption) {
  if (option.monthlyEquivalent === null) return 0;

  const upper = option.monthlyEquivalentUpper ?? option.monthlyEquivalent;
  const ceilingRoom = ((STRICT_MONTHLY_RENT_CEILING - upper) / 105) * 100;
  const floorRoom = ((STRICT_MONTHLY_RENT_CEILING - option.monthlyEquivalent) / 105) * 100;

  return clamp(Math.round(ceilingRoom * 0.65 + floorRoom * 0.35), 0, 100);
}

function feeClarityScore(option: HousingOption) {
  let score = 40;

  if (option.securityDepositRefundable !== null) score += 20;
  if (option.adminOrLeaseSigningFees.every((fee) => fee.amount !== null)) score += 10;
  if (option.nonUtilityFeesStatus !== "unknown") score += 15;
  if (!option.moveInDueHasUnknowns) score += 15;
  else score += 4;

  const sourceCaveats = [...option.sourceSnapshotNotes, ...option.pricingNotes]
    .join(" ")
    .toLowerCase();

  if (sourceCaveats.includes("plus fees")) score -= 8;
  if (sourceCaveats.includes("charges due at move-in")) score -= 4;

  return clamp(score, 0, 100);
}

function utilityConfidenceScore(option: HousingOption) {
  const essentials = ["water", "sewer", "trash"];
  const includedEssentialCount = essentials.filter((utility) =>
    option.includedUtilities.some((included) => included.toLowerCase().includes(utility)),
  ).length;
  const bonusUtilityCount = option.includedUtilities.filter(
    (utility) =>
      !essentials.some((essential) => utility.toLowerCase().includes(essential)),
  ).length;

  let score = (includedEssentialCount / essentials.length) * 70;
  score += Math.min(bonusUtilityCount, 3) * 5;
  if (option.parkingIncluded === true) score += 10;
  if (option.unknownUtilities.length) score -= Math.min(option.unknownUtilities.length, 3) * 8;

  return clamp(Math.round(score), 0, 100);
}

function parentDistanceScore(option: HousingOption) {
  const rec = getRecCenterDistance(option);

  return clamp(Math.round(100 - option.distanceMiles * 28 - rec.distanceMiles * 16), 0, 100);
}

export function getParentConfidenceScore(option: HousingOption) {
  const strictComponent = (isStrictAffordableNextYearOneBed(option) ? 100 : 0) * 0.18;
  const sourceComponent = confidenceScore(option.sourceConfidence) * 0.08;
  const feeComponent = feeClarityScore(option) * 0.16;
  const utilityComponent = utilityConfidenceScore(option) * 0.14;
  const distanceComponent = parentDistanceScore(option) * 0.26;
  const availabilityComponent =
    (option.availabilityConfidence === "confirmed-2026" && hasPostedAugust2026Availability(option)
      ? 100
      : 0) * 0.08;
  const affordabilityComponent = parentAffordabilityScore(option) * 0.1;

  return Number(
    (
      strictComponent +
      sourceComponent +
      feeComponent +
      utilityComponent +
      distanceComponent +
      availabilityComponent +
      affordabilityComponent
    ).toFixed(2),
  );
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
  const isStrictShortlist =
    sorted.length > 0 && sorted.every((option) => isStrictAffordableNextYearOneBed(option));

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

    const scoreDelta = isStrictShortlist
      ? getParentConfidenceScore(b) - getParentConfidenceScore(a)
      : getRankingScore(b) - getRankingScore(a);
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

    if (filters.listTiers?.length && !filters.listTiers.includes(option.listTier)) {
      return false;
    }

    if (
      filters.maxDistanceMiles !== undefined &&
      option.distanceMiles > filters.maxDistanceMiles
    ) {
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
        option.contactPath.label,
        option.contactPath.note ?? "",
        getSourceKindLabel(option.sourceKind),
        getListTierLabel(option.listTier),
        getAvailabilityConfidenceLabel(option.availabilityConfidence),
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
  const distanceValues = options.map((option) => option.distanceMiles);
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
    mainUnder1kOptions: options.filter((option) => option.listTier === "main-under-1k").length,
    backupOptions: options.filter((option) => option.listTier === "backup-over-1k").length,
    watchlistOptions: options.filter((option) => option.listTier === "watchlist").length,
    monthlyEquivalentMin: monthlyValues.length ? Math.min(...monthlyValues) : null,
    monthlyEquivalentMax: monthlyValues.length ? Math.max(...monthlyValues) : null,
    distanceMilesMin: distanceValues.length ? Math.min(...distanceValues) : null,
    distanceMilesMax: distanceValues.length ? Math.max(...distanceValues) : null,
    walkMinutesMin: walkValues.length ? Math.min(...walkValues) : null,
    walkMinutesMax: walkValues.length ? Math.max(...walkValues) : null,
    clarityCounts,
  };
}

const miamiOxfordHousingOptionBase: Omit<HousingOption, "sourceSnapshotNotes">[] = [
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
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(850),
    schoolYearTotalUpper: null,
    monthlyEquivalent: 850,
    monthlyEquivalentUpper: null,
    moveInDue: 850,
    moveInDueUpper: null,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "1-year lease",
    availabilityLabel: "2026-2027 1BR leased; 2027-2028 comp is $850",
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
      "SCQ no longer posts the old $800 August 2026 read; the current 2026-2027 row is leased/contact-office only.",
      "The $850 monthly value is the live 2027-2028 1BR comp, not confirmed August 2026 inventory.",
      "Move-in due is only a lower bound because the live source does not post a deposit or any lease-signing fee.",
    ],
    availabilityNotes: [
      "The 2026-2027 page labels the 1BR as leased and points prospects to the office for more options.",
      "The source currently shows 2027-2028 at $850 and available, so this row is a next-cycle comp until SCQ confirms a 2026 path.",
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
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
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
    nonUtilityFeesStatus: "unknown",
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
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
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
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
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
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
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
    listTier: "main-under-1k",
    availabilityConfidence: "confirmed-2026",
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
    listTier: "main-under-1k",
    availabilityConfidence: "confirmed-2026",
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
    laundryStatus: "in-unit",
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
      "The current campus portal amenity table lists washer/dryer in unit plus off-street parking.",
    ],
    sourceUrl:
      "https://www.miamiohoffcampus.com/housing/property/718-south-locust-street/ocp44xjxzk",
    sourceKind: "campus-affiliated",
    sourceConfidence: "low",
    listTier: "main-under-1k",
    availabilityConfidence: "confirmed-2026",
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
    listTier: "backup-over-1k",
    availabilityConfidence: "likely-needs-confirmation",
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
    listTier: "watchlist",
    availabilityConfidence: "confirmed-2026",
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
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://www.oxre.com/rentals/28-e-high-apt-a",
      kind: "listing",
      note: "Direct listing is the right place to verify whether this efficiency still has a 2026 move-in path.",
    },
  },
  {
    id: "26-east-walnut-apt-1",
    propertyName: "26 East Walnut Street",
    optionName: "Apt 1 Efficiency",
    unitType: "efficiency",
    address: "26 East Walnut Street Apt 1, Oxford, OH 45056",
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
    availabilityLabel: "Direct page currently shows 2027-2028",
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
      "Direct Oxford Real Estate page posts the semester amount, total rent, deposit, and lease-signing rent advance.",
      "Keep it as a comparison/waitlist row because the live page now points to the 2027-2028 year.",
    ],
    availabilityNotes: [
      "Not a confirmed August 2026 opening on the direct page.",
      "Use the row to understand the Walnut efficiency price band before calling Oxford Real Estate.",
    ],
    perks: [
      "Efficiency layout keeps the 10-month comparison below $900.",
      "Water, sewer, and trash are included in the posted rent.",
      "Same building cluster as the existing Apt 4 benchmark.",
    ],
    sourceUrl: "https://oxre.com/rentals/26-east-walnut-street-apt-1-390",
    sourceKind: "primary",
    sourceConfidence: "medium",
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://oxre.com/rentals/26-east-walnut-street-apt-1-390",
      kind: "listing",
      note: "Use this direct page as a comp and call before treating it as an August 2026 option.",
    },
  },
  {
    id: "216-n-beech",
    propertyName: "216 N. Beech Street",
    optionName: "1 Bedroom Bungalow",
    unitType: "one-bedroom",
    address: "216 N Beech Street, Oxford, OH 45056",
    latitude: 39.5132674,
    longitude: -84.7440599,
    distanceMiles: 0.71,
    walkMinutes: 14,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 3360,
    semesterDueAmountUpper: null,
    schoolYearTotal: 6920,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(6920),
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 3360,
      securityDepositRefundable: 100,
      adminOrLeaseSigningFees: [
        {
          label: "Lease-signing rent advance",
          amount: 200,
          timing: "lease-signing",
        },
      ],
    }).amount,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 100,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 200,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "2-semester lease (includes J term)",
    availabilityLabel: "Direct page currently shows 2027-2028",
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
      "The direct source includes core utilities in the rent and posts a low refundable deposit.",
      "This is a strong affordability comp, but not a live 2026 row.",
    ],
    availabilityNotes: [
      "Live direct page now shows 2027-2028.",
      "Call Oxford Real Estate only after confirming whether a 2026 rollover or waitlist path exists.",
    ],
    perks: [
      "True 1BR bungalow rather than a shared-bedroom listing.",
      "Electric, water, sewer, and trash are included.",
      "Low posted lease-signing cash compared with many semester leases.",
    ],
    sourceUrl: "https://www.oxre.com/rentals/216-n-beech-street",
    sourceKind: "primary",
    sourceConfidence: "medium",
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://www.oxre.com/rentals/216-n-beech-street",
      kind: "listing",
      note: "Direct page is useful for pricing structure, but timing needs a phone confirmation.",
    },
  },
  {
    id: "112-w-high-apt-3",
    propertyName: "112 W. High Street",
    optionName: "Apt 3 1BR",
    unitType: "one-bedroom",
    address: "112 W High St Apt 3, Oxford, OH 45056",
    latitude: 39.5104267,
    longitude: -84.7446,
    distanceMiles: 0.65,
    walkMinutes: 13,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 4000,
    semesterDueAmountUpper: null,
    schoolYearTotal: 8400,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(8400),
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 4000,
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
    availabilityLabel: "Direct page currently shows 2027-2028",
    includedUtilities: ["gas", "water", "sewer", "trash"],
    excludedUtilities: ["electric", "internet"],
    unknownUtilities: [],
    parkingIncluded: null,
    parkingCost: null,
    furnishedStatus: "unknown",
    laundryStatus: "unknown",
    appliances: [],
    ACStatus: "unknown",
    pricingNotes: [
      "Direct listing keeps the High Street 1BR rent below the $1k comparison line.",
      "Gas, water, sewer, and trash are included, but electric and internet remain tenant-paid.",
    ],
    availabilityNotes: [
      "Direct page shows 2027-2028, while campus-portal summaries can lag or blend multiple units.",
      "Treat as a waitlist/comparison row until Oxford Real Estate confirms 2026 timing.",
    ],
    perks: [
      "True 1BR over High Street, not a bedroom in a shared multi-bedroom unit.",
      "Several utility buckets are included.",
      "Strong downtown location if availability changes.",
    ],
    sourceUrl: "https://www.oxre.com/rentals/112-w-high-st-up-apt-3",
    sourceKind: "primary",
    sourceConfidence: "medium",
    listTier: "watchlist",
    availabilityConfidence: "comp-only",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://www.oxre.com/rentals/112-w-high-st-up-apt-3",
      kind: "listing",
      note: "Use direct listing before relying on mixed campus-portal High Street summaries.",
    },
  },
  {
    id: "28c-east-high",
    propertyName: "28 East High",
    optionName: "Apt C Efficiency",
    unitType: "efficiency",
    address: "28 E High St Apt C, Oxford, OH 45056",
    latitude: 39.5105557,
    longitude: -84.7414217,
    distanceMiles: 0.49,
    walkMinutes: 10,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "monthly",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: 10000,
    schoolYearTotalUpper: null,
    monthlyEquivalent: 1050,
    monthlyEquivalentUpper: null,
    moveInDue: 1050,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 500,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 550,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "9-month lease",
    availabilityLabel: "Direct page shows 8/17/26 to 5/17/27",
    includedUtilities: [],
    excludedUtilities: ["utilities"],
    unknownUtilities: [],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "unknown",
    appliances: [],
    ACStatus: "unknown",
    pricingNotes: [
      "Direct listing posts $1,050 due monthly, with a $10,000 total-rent figure for the 9-month lease.",
      "This is a backup because the monthly line sits just over the $1k threshold.",
    ],
    availabilityNotes: [
      "Direct page specifically lists an 8/17/26 start and 5/17/27 end.",
      "Confirm whether the assigned parking space and utility setup are still unchanged before signing.",
    ],
    perks: [
      "True efficiency, not a bedroom lease.",
      "Assigned parking is posted.",
      "Short downtown/uproute location for class and Uptown access.",
    ],
    sourceUrl: "https://www.oxre.com/rentals/28c-e-high-st",
    sourceKind: "primary",
    sourceConfidence: "high",
    listTier: "backup-over-1k",
    availabilityConfidence: "confirmed-2026",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://www.oxre.com/rentals/28c-e-high-st",
      kind: "listing",
      note: "Direct page has the most complete 2026 timing for this backup efficiency.",
    },
  },
  {
    id: "37-w-high",
    propertyName: "37 W. High Street",
    optionName: "1BR Apartment",
    unitType: "one-bedroom",
    address: "37 W High St, Oxford, OH 45056",
    latitude: 39.5104267,
    longitude: -84.743385,
    distanceMiles: 0.59,
    walkMinutes: 12,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "per-semester",
    semesterDueAmount: 6100,
    semesterDueAmountUpper: null,
    schoolYearTotal: 13000,
    schoolYearTotalUpper: null,
    monthlyEquivalent: calculateMonthlyEquivalentFromSchoolYearTotal(13000),
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 6100,
      securityDepositRefundable: 400,
      adminOrLeaseSigningFees: [
        {
          label: "Lease-signing rent advance",
          amount: 800,
          timing: "lease-signing",
        },
      ],
    }).amount,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 400,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 800,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "2-semester lease (includes J term)",
    availabilityLabel: "Campus portal shows 37 W. High available 8/19/26; 35/39 leased",
    includedUtilities: [],
    excludedUtilities: ["utilities"],
    unknownUtilities: [],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "unknown",
    appliances: [],
    ACStatus: "central",
    pricingNotes: [
      "Campus portal text breaks out the 37 W. High 1BR price, total rent, deposit, and signing advance.",
      "The portal headline also shows a plus-fees/base-rent range, so verify whether anything sits outside the semester and signing amounts.",
      "Above the $1k monthly comparison line, so this belongs in backup status.",
    ],
    availabilityNotes: [
      "Campus portal marks the 35/37/39 W. High group as available for 26/27 and says 35 and 39 are leased.",
      "Use Oxford Real Estate as the final confirmation point because the source is portal-mediated.",
    ],
    perks: [
      "True 1BR over High Street.",
      "Central air and one assigned parking space are posted.",
      "Useful backup if proximity matters more than the under-$1k target.",
    ],
    sourceUrl:
      "https://www.miamiohoffcampus.com/housing/property/37-west-high-street/ocpf5cwvzr",
    sourceKind: "campus-affiliated",
    sourceConfidence: "medium",
    listTier: "backup-over-1k",
    availabilityConfidence: "confirmed-2026",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open campus portal listing",
      href:
        "https://www.miamiohoffcampus.com/housing/property/37-west-high-street/ocpf5cwvzr",
      kind: "listing",
      note: "Portal listing points back to Oxford Real Estate for the final live lease status.",
    },
  },
  {
    id: "4304-oxford-reily",
    propertyName: "4304 Oxford Reily Road",
    optionName: "1 Bedroom Apartment",
    unitType: "one-bedroom",
    address: "4304 Oxford Reily Road, Oxford, OH 45056",
    latitude: 39.4967396,
    longitude: -84.7590341,
    distanceMiles: 1.57,
    walkMinutes: 31,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: null,
    pricingCadence: "monthly",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(850),
    schoolYearTotalUpper: null,
    monthlyEquivalent: 850,
    monthlyEquivalentUpper: null,
    moveInDue: 850,
    moveInDueUpper: null,
    moveInDueHasUnknowns: false,
    securityDepositRefundable: 300,
    adminOrLeaseSigningFees: [
      {
        label: "Lease-signing rent advance",
        amount: 550,
        timing: "lease-signing",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "none-listed",
    leaseTermLabel: "12-month lease",
    availabilityLabel: "Direct page says available now",
    includedUtilities: [],
    excludedUtilities: ["utilities"],
    unknownUtilities: [],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "unknown",
    laundryStatus: "in-unit",
    appliances: [],
    ACStatus: "central",
    pricingNotes: [
      "Direct listing posts $850/month and a $10,750 total-rent figure for the longer lease exposure.",
      "The source also posts a $40 non-refundable application fee for each adult applicant.",
      "The 10-month comparison is shown for planning only; a full 12-month lease changes the real obligation.",
    ],
    availabilityNotes: [
      "Available-now status does not equal held August 2026 inventory.",
      "Keep as an affordability watchlist row unless the office confirms an August 2026 path.",
    ],
    perks: [
      "Newly renovated 1BR with central air.",
      "Washer/dryer and off-street parking are posted.",
      "Rent is below the $1k target, but the location and timing need scrutiny.",
    ],
    sourceUrl: "https://www.oxre.com/rentals/4304-oxford-reily-road",
    sourceKind: "primary",
    sourceConfidence: "medium",
    listTier: "watchlist",
    availabilityConfidence: "likely-needs-confirmation",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford Real Estate listing",
      href: "https://www.oxre.com/rentals/4304-oxford-reily-road",
      kind: "listing",
      note: "Direct page is current, but August 2026 timing is not posted.",
    },
  },
  {
    id: "oxford-west-a1",
    propertyName: "Oxford West",
    optionName: "1BR 588 sq ft",
    unitType: "one-bedroom",
    address: "615 Ogden Ct, Oxford, OH 45056",
    latitude: 39.503606,
    longitude: -84.750972,
    distanceMiles: 0.99,
    walkMinutes: 20,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 588,
    pricingCadence: "monthly",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(990),
    schoolYearTotalUpper: null,
    monthlyEquivalent: 990,
    monthlyEquivalentUpper: null,
    moveInDue: null,
    moveInDueUpper: null,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "12-month or flexible lease shown on campus portal",
    availabilityLabel: "Campus portal shows 1BR available now; updated 1 day ago",
    includedUtilities: [],
    excludedUtilities: [],
    unknownUtilities: ["utilities", "required fees", "deposit"],
    parkingIncluded: null,
    parkingCost: null,
    furnishedStatus: "unknown",
    laundryStatus: "in-unit",
    appliances: [],
    ACStatus: "yes-unspecified",
    pricingNotes: [
      "Campus portal lists a 588 sq ft 1BR at $990 plus fees.",
      "Application fee is posted at $45, but deposit and mandatory utility/fee exposure still need confirmation.",
    ],
    availabilityNotes: [
      "Portal status is available now, not a reserved August 2026 unit; 12-month and flexible/other lease terms are posted.",
      "Direct Oxford West site should be checked before this moves out of watchlist.",
    ],
    perks: [
      "Sq footage is posted, which helps compare against tiny downtown 1BRs.",
      "Washer/dryer in all apartments is posted on the portal.",
      "Base rent is under the $1k target before unknown fees.",
    ],
    sourceUrl: "https://www.miamiohoffcampus.com/housing/property/oxford-west/m421l5k",
    sourceKind: "campus-affiliated",
    sourceConfidence: "medium",
    listTier: "watchlist",
    availabilityConfidence: "likely-needs-confirmation",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Oxford West site",
      href: "https://www.oxfordwestapts.com/pricing",
      kind: "listing",
      note: "Use the direct site or office for the live August 2026 price and fee schedule.",
    },
  },
  {
    id: "the-commons-a1",
    propertyName: "The Commons",
    optionName: "A1 1BR",
    unitType: "one-bedroom",
    address: "610 Oxford Commons, Oxford, OH 45056",
    latitude: 39.5045079,
    longitude: -84.753274,
    distanceMiles: 1.09,
    walkMinutes: 22,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 413,
    pricingCadence: "monthly-range",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(1035),
    schoolYearTotalUpper: null,
    monthlyEquivalent: 1035,
    monthlyEquivalentUpper: null,
    moveInDue: calculateMoveInDue({
      firstRequiredInstallment: 1035,
      firstRequiredInstallmentUpper: null,
      securityDepositRefundable: null,
      adminOrLeaseSigningFees: [
        {
          label: "Administrative fee",
          amount: 100,
          timing: "move-in",
        },
      ],
    }).amount,
    moveInDueUpper: calculateMoveInDue({
      firstRequiredInstallment: 1035,
      firstRequiredInstallmentUpper: null,
      securityDepositRefundable: null,
      adminOrLeaseSigningFees: [
        {
          label: "Administrative fee",
          amount: 100,
          timing: "move-in",
        },
      ],
    }).amountUpper,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [
      {
        label: "Administrative fee",
        amount: 100,
        timing: "move-in",
      },
    ],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "12-month student lease",
    availabilityLabel: "A1 direct floor plan is waitlist/current term; confirm Fall 2026",
    includedUtilities: ["most utilities", "internet", "parking"],
    excludedUtilities: [],
    unknownUtilities: ["exact excluded utilities", "deposit"],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "furnished",
    laundryStatus: "unknown",
    appliances: [],
    ACStatus: "yes-unspecified",
    pricingNotes: [
      "Direct Commons page posts the strict A1 1BR at 413 sq ft and $1,035 for the current displayed term.",
      "A2/A3/A4 office or larger 1BR variants are intentionally excluded from this A1 comparison row.",
      "Listed as a backup because the low end is just over the $1k planning threshold.",
    ],
    availabilityNotes: [
      "Direct page has waitlist/current-term language, so August 2026 needs a direct office confirmation.",
      "Use as a backup complex option, not as a locked available unit.",
    ],
    perks: [
      "One of the few larger-community 1BR floor plans with posted square footage.",
      "Direct site says rent includes most utilities, internet, free parking, and a furniture package.",
      "Professional management and online leasing path are visible.",
    ],
    sourceUrl:
      "https://www.oxfordcommons.com/oxford-oh-apartments/the-commons/1-bedroom-apartments/",
    sourceKind: "primary",
    sourceConfidence: "medium",
    listTier: "backup-over-1k",
    availabilityConfidence: "likely-needs-confirmation",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open The Commons floor plan",
      href:
        "https://www.oxfordcommons.com/oxford-oh-apartments/the-commons/1-bedroom-apartments/",
      kind: "listing",
      note: "Confirm the exact Fall 2026 term and whether A1 has space before ranking it.",
    },
  },
  {
    id: "annex-a1",
    propertyName: "Annex",
    optionName: "1BR 608 sq ft",
    unitType: "one-bedroom",
    address: "1562 Magnolia Dr, Oxford, OH 45056",
    latitude: 39.4903472,
    longitude: -84.7197368,
    distanceMiles: 1.38,
    walkMinutes: 28,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 608,
    pricingCadence: "monthly",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(1215),
    schoolYearTotalUpper: null,
    monthlyEquivalent: 1215,
    monthlyEquivalentUpper: null,
    moveInDue: null,
    moveInDueUpper: null,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "Flexible student lease terms posted",
    availabilityLabel: "Campus portal shows available now",
    includedUtilities: [],
    excludedUtilities: [],
    unknownUtilities: ["utilities", "required fees", "deposit"],
    parkingIncluded: true,
    parkingCost: 0,
    furnishedStatus: "furnished",
    laundryStatus: "in-unit",
    appliances: ["dishwasher", "microwave"],
    ACStatus: "yes-unspecified",
    pricingNotes: [
      "Campus portal lists the 608 sq ft 1BR at $1,215 plus fees.",
      "Direct Annex site advertises broader starting rates, but the 1BR line needs the portal or office detail.",
    ],
    availabilityNotes: [
      "Available-now portal status does not guarantee an August 2026 hold.",
      "Use as an over-$1k backup if private shuttle and amenities matter.",
    ],
    perks: [
      "Largest posted square footage among the added complex 1BR backups.",
      "Furnished and in-unit laundry are posted on the portal.",
      "Free parking and private shuttle are visible source claims.",
    ],
    sourceUrl: "https://www.miamiohoffcampus.com/housing/property/annex/3v75pdf",
    sourceKind: "campus-affiliated",
    sourceConfidence: "medium",
    listTier: "backup-over-1k",
    availabilityConfidence: "likely-needs-confirmation",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Annex site",
      href: "https://live-annex.com/",
      kind: "listing",
      note: "Use direct site for leasing contact, then ask for the exact Fall 2026 1BR fee table.",
    },
  },
  {
    id: "hawks-landing-a1",
    propertyName: "Hawks Landing",
    optionName: "A1 1BR",
    unitType: "one-bedroom",
    address: "5262 Brown Rd, Oxford, OH 45056",
    latitude: 39.5180377,
    longitude: -84.7457618,
    distanceMiles: 1,
    walkMinutes: 20,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 460,
    pricingCadence: "monthly",
    semesterDueAmount: null,
    semesterDueAmountUpper: null,
    schoolYearTotal: calculateSchoolYearTotalFromMonthly(1219),
    schoolYearTotalUpper: null,
    monthlyEquivalent: 1219,
    monthlyEquivalentUpper: null,
    moveInDue: null,
    moveInDueUpper: null,
    moveInDueHasUnknowns: true,
    securityDepositRefundable: null,
    adminOrLeaseSigningFees: [],
    taxesStatus: "none-listed",
    nonUtilityFeesStatus: "unknown",
    leaseTermLabel: "Fall 12-month lease posted",
    availabilityLabel: "Direct page says Fall 2026 sold out / waitlist",
    includedUtilities: ["internet", "pest control", "trash removal"],
    excludedUtilities: [],
    unknownUtilities: ["remaining utilities", "required fees", "deposit"],
    parkingIncluded: null,
    parkingCost: null,
    furnishedStatus: "furnished",
    laundryStatus: "in-unit",
    appliances: [],
    ACStatus: "central",
    pricingNotes: [
      "Direct Hawks page posts A1 as a 460 sq ft 1BR at $1,219 for the Fall 2026 12-month term.",
      "Because the page says Fall 2026 is sold out, this is a waitlist/watchlist row rather than an active backup.",
    ],
    availabilityNotes: [
      "Use the waitlist only if the main under-$1k rows do not work.",
      "Call before assuming a sold-out floor plan can be recovered for August 2026.",
    ],
    perks: [
      "True 1BR floor plan with posted square footage.",
      "Internet, pest control, trash removal, and in-unit laundry are posted on the direct page.",
      "Large amenity complex with bus/walk-to-campus positioning.",
    ],
    sourceUrl: "https://www.hawkshousing.com/oxford-oh-apartments/hawks-landing/student/",
    sourceKind: "primary",
    sourceConfidence: "high",
    listTier: "watchlist",
    availabilityConfidence: "likely-needs-confirmation",
    lastVerifiedAt: VERIFIED_AT,
    contactPath: {
      label: "Open Hawks Landing floor plan",
      href: "https://www.hawkshousing.com/oxford-oh-apartments/hawks-landing/student/",
      kind: "listing",
      note: "Use the direct waitlist page only after confirming the sold-out status with the office.",
    },
  },
];

const sourceSnapshotNotesById: Record<string, string[]> = {
  "308-s-campus": [
    "SCQ source rechecked Apr. 24 shows the 2026-2027 1BR as leased/contact-office and no longer posts the old $800 amount.",
    "The same SCQ page shows the 2027-2028 1BR at $850 and available, so this stays a next-cycle comp until the office confirms August 2026.",
  ],
  "26-east-walnut-apt-4": [
    "Oxford Real Estate source shows the efficiency as 2027-2028 at $4,200 per semester and $8,800 total rent.",
    "The source lists dishwasher, disposal, onsite laundry, wall A/C, and water, sewer, and trash included.",
  ],
  "18-n-elm": [
    "Oxford Real Estate source shows the 1BR duplex as 2027-2028 at $3,260 per semester and $6,920 total rent.",
    "The source lists off-street parking and central air, with occupants paying all utilities.",
  ],
  "23-e-high-apt-1-up": [
    "Oxford Real Estate source shows Apt. 1 Up as 2027-2028 at $4,500 per semester and $9,400 total rent.",
    "The page describes a 1BR/1BA apartment over High Street and posts the $600 lease-signing amount.",
  ],
  "10-west-sycamore": [
    "Miami off-campus portal shows a 1BR at $595-$675 per bedroom, 12-month lease, and 8/1/26 availability.",
    "The portal lists a $650 refundable security deposit and says water, sewer, and trash are included, with other charges still subject to change.",
  ],
  "717-mcguffey": [
    "Miami off-campus portal shows a 1BR at $595-$650 plus fees and 8/1/26 availability.",
    "The source lists a $650 refundable security deposit, water/sewer/trash/recycling included, off-street parking, and washer/dryer in unit.",
  ],
  "718-south-locust": [
    "Miami off-campus portal shows a 1BR at $625-$675 per bedroom plus fees and 8/1/26 availability.",
    "The current amenity table lists washer/dryer in unit, while the description also references laundry facilities; the row uses the more specific laundry field.",
  ],
  "campus-courts": [
    "SCQ source shows the 2026-2027 1BR no-balcony price at $5,800 per tenant/semester/bedroom and leased.",
    "The source lists in-unit washer/dryer, common-area furnishings, and one free parking spot per unit.",
  ],
  "the-vines": [
    "Oxford Real Estate source still says call for details on price for The Vines.",
    "The source posts furnished 1BR or 2BR units for the 26/27 and 27/28 school years with water, sewer, and trash included.",
  ],
  "28-east-high-apt-a": [
    "Oxford Real Estate source shows Apt. A as 2027-2028 at $6,100 per semester and $12,600 total rent.",
    "The source lists electric, water, sewer, and trash included, but internet and 2026 timing still need confirmation.",
  ],
  "26-east-walnut-apt-1": [
    "Oxford Real Estate source shows Apt. 1 as 2027-2028 at $4,200 per semester and $8,800 total rent.",
    "The source lists dishwasher, disposal, onsite laundry, wall A/C, and water, sewer, and trash included.",
  ],
  "216-n-beech": [
    "Oxford Real Estate source shows the 1BR bungalow as 2027-2028 at $3,360 per semester and $6,920 total rent.",
    "The source says electric, water, sewer, and trash are included and posts a $300 lease-signing amount.",
  ],
  "112-w-high-apt-3": [
    "Oxford Real Estate source shows Apt. 3 as 2027-2028 at $4,000 per semester and $8,400 total rent.",
    "The page says gas, water, sewer, and trash are included, while electric and internet are tenant-paid.",
  ],
  "28c-east-high": [
    "Oxford Real Estate source shows Apt. C available 8/17/26 to 5/17/27 at $1,050 per month.",
    "The source posts a 9-month lease, $10,000 total rent, assigned parking, all utilities tenant-paid, and $1,050 due at lease signing.",
  ],
  "37-w-high": [
    "Miami off-campus portal shows 37 W. High in the 35/37/39 group as available for 26/27, with 35 and 39 marked leased.",
    "The source text gives the 37 row at $6,100 per semester and $13,000 total rent, while the portal headline still carries a plus-fees/base-rent caveat.",
  ],
  "4304-oxford-reily": [
    "Oxford Real Estate source shows the Southview 1BR available now at $850 per month and $10,750 total rent.",
    "The source lists central air, washer/dryer, bonus storage, off-street parking, all utilities tenant-paid, and a $40 application fee.",
  ],
  "oxford-west-a1": [
    "Miami off-campus portal shows Oxford West 1BR at $990 per bedroom plus fees, 588 sq ft, and available now.",
    "The portal was updated 1 day ago and lists 12-month/flexible terms plus a $45 application fee, but not a held August 2026 unit.",
  ],
  "the-commons-a1": [
    "The Commons direct floor-plan page shows A1 as a 413 sq ft 1BR at $1,035 for the displayed current term and waitlist only.",
    "The direct page includes most utilities, high-speed internet, free parking, and a furniture package, but it does not show a confirmed Fall 2026 A1 slot.",
  ],
  "annex-a1": [
    "Miami off-campus portal shows Annex 1BR at $1,215 per bedroom, 608 sq ft, and available now.",
    "The direct Annex site shows only broad starting-rate and promo language, so the campus portal remains the better 1BR price source.",
  ],
  "hawks-landing-a1": [
    "Hawks direct floor-plan page says Fall 2026 is sold out and points users to waitlist options.",
    "The A1 row shows 1BR/1BA, 460 sq ft, $1,219, Fall 12 Month 08/21/2026-07/27/2027, high-speed internet, in-unit laundry, and furnished status.",
  ],
};

function attachSourceSnapshotNotes(
  options: Omit<HousingOption, "sourceSnapshotNotes">[],
): HousingOption[] {
  return options.map((option) => {
    const sourceSnapshotNotes = sourceSnapshotNotesById[option.id];

    if (!sourceSnapshotNotes) {
      throw new Error(`Missing source snapshot notes for ${option.id}`);
    }

    return {
      ...option,
      sourceSnapshotNotes,
    };
  });
}

export const miamiOxfordHousingOptions: HousingOption[] =
  attachSourceSnapshotNotes(miamiOxfordHousingOptionBase);
