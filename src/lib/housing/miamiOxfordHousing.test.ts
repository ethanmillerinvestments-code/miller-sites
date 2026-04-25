import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildHousingSummary,
  buildMoveInDueSummary,
  buildRecurringAllInSummary,
  calculateApproximateWalkMinutes,
  calculateDistanceMiles,
  calculateEthanPriceRange,
  calculateMonthlyEquivalentFromSchoolYearTotal,
  calculateMoveInDue,
  calculateSchoolYearTotalFromMonthly,
  filterHousingOptions,
  getParentConfidenceScore,
  getRecCenterDistance,
  getRankingScore,
  isStrictAffordableNextYearOneBed,
  miamiOxfordCampusAnchor,
  miamiOxfordHousingOptions,
  miamiOxfordRecCenterAnchor,
  sortHousingOptions,
} from "./miamiOxfordHousing";

describe("miamiOxfordHousing dataset", () => {
  it("contains only studios, efficiencies, and true 1BRs", () => {
    expect(miamiOxfordHousingOptions).toHaveLength(20);
    expect(
      miamiOxfordHousingOptions.every((option) =>
        ["studio", "efficiency", "one-bedroom"].includes(option.unitType),
      ),
    ).toBe(true);
    expect(
      miamiOxfordHousingOptions.some((option) =>
        `${option.propertyName} ${option.optionName}`.toLowerCase().includes("study"),
      ),
    ).toBe(false);
  });

  it("labels main, backup, and watchlist options explicitly", () => {
    const summary = buildHousingSummary(miamiOxfordHousingOptions);

    expect(summary.mainUnder1kOptions).toBe(3);
    expect(summary.backupOptions).toBe(5);
    expect(summary.watchlistOptions).toBe(12);
    expect(summary.mainUnder1kOptions + summary.backupOptions + summary.watchlistOptions).toBe(20);
  });

  it("keeps the main list under the $1k comparison threshold", () => {
    const main = filterHousingOptions(miamiOxfordHousingOptions, {
      listTiers: ["main-under-1k"],
    });

    expect(main).toHaveLength(3);
    expect(
      main.every(
        (option) =>
          option.monthlyEquivalent !== null &&
          option.monthlyEquivalent <= 1000 &&
          option.availabilityConfidence === "confirmed-2026",
      ),
    ).toBe(true);
  });

  it("keeps every row tied to a fresh source snapshot note", () => {
    expect(
      miamiOxfordHousingOptions.every(
        (option) =>
          option.lastVerifiedAt === "2026-04-24" &&
          option.sourceSnapshotNotes.length >= 2 &&
          option.sourceSnapshotNotes.every((note) => note.trim().length > 20),
      ),
    ).toBe(true);
  });

  it("removes stale 308 S. Campus 2026 pricing after the April 23 source pass", () => {
    const scq308 = miamiOxfordHousingOptions.find((option) => option.id === "308-s-campus");

    expect(scq308?.monthlyEquivalent).toBe(850);
    expect(scq308?.availabilityConfidence).toBe("comp-only");
    expect(scq308?.availabilityLabel).toContain("2026-2027 1BR leased");
    expect(scq308?.sourceSnapshotNotes.join(" ")).toContain("2027-2028");
  });

  it("keeps strict true-1BR pricing from pulling in office/study floor-plan ranges", () => {
    const commons = miamiOxfordHousingOptions.find((option) => option.id === "the-commons-a1");

    expect(commons?.optionName).toBe("A1 1BR");
    expect(commons?.monthlyEquivalent).toBe(1035);
    expect(commons?.monthlyEquivalentUpper).toBeNull();
    expect(commons?.squareFeet).toBe(413);
  });

  it("refreshes exposed unit details from current source pages", () => {
    const southLocust = miamiOxfordHousingOptions.find(
      (option) => option.id === "718-south-locust",
    );
    const hawks = miamiOxfordHousingOptions.find((option) => option.id === "hawks-landing-a1");
    const oxfordWest = miamiOxfordHousingOptions.find((option) => option.id === "oxford-west-a1");

    expect(southLocust?.laundryStatus).toBe("in-unit");
    expect(hawks?.laundryStatus).toBe("in-unit");
    expect(hawks?.includedUtilities).toEqual(
      expect.arrayContaining(["internet", "pest control", "trash removal"]),
    );
    expect(oxfordWest?.leaseTermLabel).toContain("12-month");
  });
});

describe("school-year conversion helpers", () => {
  it("converts semester-priced school-year totals to a 10-month monthly equivalent", () => {
    expect(calculateMonthlyEquivalentFromSchoolYearTotal(6920)).toBe(692);
    expect(calculateMonthlyEquivalentFromSchoolYearTotal(8800)).toBe(880);
  });

  it("converts monthly pricing into a 10-month school-year comparison", () => {
    expect(calculateSchoolYearTotalFromMonthly(595)).toBe(5950);
    expect(calculateSchoolYearTotalFromMonthly(800)).toBe(8000);
  });
});

describe("campus anchor distance helpers", () => {
  it("keeps the official Rec Center anchor available beside Armstrong", () => {
    expect(miamiOxfordCampusAnchor.name).toBe("Armstrong Student Center");
    expect(miamiOxfordCampusAnchor.address).toBe("550 E. Spring St., Oxford, OH 45056");
    expect(miamiOxfordRecCenterAnchor.name).toBe("Recreational Sports Center");
    expect(miamiOxfordRecCenterAnchor.address).toBe("750 S. Oak St., Oxford, OH 45056");
  });

  it("returns stable rounded coordinate distances and approximate walk minutes", () => {
    expect(calculateDistanceMiles(miamiOxfordCampusAnchor, miamiOxfordRecCenterAnchor)).toBe(0.3);
    expect(calculateApproximateWalkMinutes(0.3)).toBe(6);

    const campusCourts = miamiOxfordHousingOptions.find((option) => option.id === "campus-courts");
    expect(getRecCenterDistance(campusCourts!)).toEqual({
      distanceMiles: 0.17,
      walkMinutes: 3,
      label: "0.17 mi to Rec Center",
    });
  });
});

describe("move-in due helpers", () => {
  it("adds deposits and lease-signing fees to the first required installment", () => {
    const totals = calculateMoveInDue({
      firstRequiredInstallment: 3260,
      securityDepositRefundable: 200,
      adminOrLeaseSigningFees: [
        {
          label: "Lease-signing rent advance",
          amount: 400,
          timing: "lease-signing",
        },
      ],
    });

    expect(totals).toEqual({
      amount: 3860,
      amountUpper: 3860,
      hasUnknownFees: false,
    });
  });

  it("keeps move-in due visibly incomplete when a deposit is missing", () => {
    const scq308 = miamiOxfordHousingOptions.find((option) => option.id === "308-s-campus");
    const summary = buildMoveInDueSummary(scq308!);

    expect(summary.status).toBe("partial");
    expect(summary.label).toBe("$850+");
    expect(summary.note.toLowerCase()).toContain("lower bound");
  });
});

describe("derived summaries", () => {
  it("keeps unknown rent or utility exposure visibly incomplete", () => {
    const theVines = miamiOxfordHousingOptions.find((option) => option.id === "the-vines");
    const sycamore = miamiOxfordHousingOptions.find((option) => option.id === "10-west-sycamore");

    const vinesSummary = buildRecurringAllInSummary(theVines!);
    const sycamoreSummary = buildRecurringAllInSummary(sycamore!);

    expect(vinesSummary.status).toBe("quote-required");
    expect(vinesSummary.label).toBe("Price not posted");
    expect(sycamoreSummary.status).toBe("partial");
    expect(sycamoreSummary.note.toLowerCase()).toContain("unknown utilities");
  });
});

describe("best-fit ranking", () => {
  it("prefers clearer direct listings over cheaper but unclear second-hand listings", () => {
    const sorted = sortHousingOptions(miamiOxfordHousingOptions, "best-fit");
    const elmIndex = sorted.findIndex((option) => option.id === "18-n-elm");
    const sycamoreIndex = sorted.findIndex((option) => option.id === "10-west-sycamore");

    expect(elmIndex).toBeGreaterThanOrEqual(0);
    expect(sycamoreIndex).toBeGreaterThanOrEqual(0);
    expect(elmIndex).toBeLessThan(sycamoreIndex);
    expect(getRankingScore(sorted[0]!)).toBeGreaterThan(getRankingScore(sorted.at(-1)!));
  });
});

describe("filtering and sorting", () => {
  it("filters search results before sorting by lowest monthly equivalent", () => {
    const filtered = filterHousingOptions(miamiOxfordHousingOptions, {
      unitTypes: ["one-bedroom"],
      maxMonthlyEquivalent: 700,
      searchQuery: "morrison",
    });
    const sorted = sortHousingOptions(filtered, "monthly-equivalent-asc");

    expect(sorted.map((option) => option.id)).toEqual([
      "10-west-sycamore",
      "717-mcguffey",
      "718-south-locust",
    ]);
  });
});

describe("strict under-$700 parent shortlist", () => {
  it("keeps only verified 2026 1BR/1BA listings with posted rent under $700", () => {
    const strict = miamiOxfordHousingOptions.filter(isStrictAffordableNextYearOneBed);

    expect(strict.map((option) => option.id)).toEqual([
      "10-west-sycamore",
      "717-mcguffey",
      "718-south-locust",
    ]);
  });

  it("calculates Ethan Price ranges after the parent contribution", () => {
    const ranges = Object.fromEntries(
      miamiOxfordHousingOptions
        .filter(isStrictAffordableNextYearOneBed)
        .map((option) => [option.id, calculateEthanPriceRange(option).label]),
    );

    expect(ranges).toEqual({
      "10-west-sycamore": "$95-$175",
      "717-mcguffey": "$95-$150",
      "718-south-locust": "$125-$175",
    });
  });

  it("sorts the strict shortlist by deterministic parent confidence", () => {
    const strict = miamiOxfordHousingOptions.filter(isStrictAffordableNextYearOneBed);
    const sorted = sortHousingOptions(strict, "best-fit");

    expect(sorted.map((option) => option.id)).toEqual([
      "10-west-sycamore",
      "717-mcguffey",
      "718-south-locust",
    ]);
    expect(getParentConfidenceScore(sorted[0]!)).toBeGreaterThan(
      getParentConfidenceScore(sorted[1]!),
    );
    expect(getParentConfidenceScore(sorted[1]!)).toBeGreaterThan(
      getParentConfidenceScore(sorted[2]!),
    );
  });
});

describe("housing visible distance policy", () => {
  it("keeps UI labels on miles and routes instead of walk-minute claims", () => {
    const explorerSource = readFileSync(
      join(process.cwd(), "src/components/housing/MiamiHousingExplorer.tsx"),
      "utf8",
    );
    const mapSource = readFileSync(
      join(process.cwd(), "src/components/housing/MiamiHousingLeafletMap.tsx"),
      "utf8",
    );

    expect(explorerSource).not.toContain("min walk");
    expect(explorerSource).not.toContain("label=\"Walk\"");
    expect(mapSource).not.toContain(" min</p>");
    expect(mapSource).not.toContain("} min");
  });
});
