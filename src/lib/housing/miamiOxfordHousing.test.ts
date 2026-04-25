import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildHousingSummary,
  buildMoveInDueSummary,
  buildRecurringAllInSummary,
  calculateApproximateWalkMinutes,
  calculateDistanceMiles,
  calculateEthanPrice,
  calculateEthanPriceRange,
  calculateMonthlyEquivalentFromSchoolYearTotal,
  calculateMoveInDue,
  calculateSchoolYearTotalFromMonthly,
  filterHousingOptions,
  getRankingBand,
  getParentConfidenceScore,
  getRecCenterDistance,
  getRankingScore,
  getVerifiedUnder750SoloOptions,
  isStrictAffordableNextYearOneBed,
  isVerifiedUnder750SoloOption,
  miamiOxfordCampusAnchor,
  miamiOxfordHousingOptions,
  miamiOxfordRejectedHousingNotes,
  miamiOxfordRecCenterAnchor,
  sortHousingOptions,
  STRICT_MONTHLY_RENT_CEILING,
} from "./miamiOxfordHousing";

describe("miamiOxfordHousing dataset", () => {
  it("contains only studios, efficiencies, and true 1BRs", () => {
    expect(miamiOxfordHousingOptions).toHaveLength(25);
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

    expect(summary.mainUnder1kOptions).toBe(5);
    expect(summary.backupOptions).toBe(5);
    expect(summary.watchlistOptions).toBe(15);
    expect(summary.mainUnder1kOptions + summary.backupOptions + summary.watchlistOptions).toBe(25);
  });

  it("keeps the main list under the $750 solo-housing threshold", () => {
    const main = filterHousingOptions(miamiOxfordHousingOptions, {
      listTiers: ["main-under-1k"],
    });

    expect(main).toHaveLength(5);
    expect(
      main.every(
        (option) =>
          isVerifiedUnder750SoloOption(option) &&
          option.monthlyEquivalent !== null &&
          (option.monthlyEquivalentUpper ?? option.monthlyEquivalent) <=
            STRICT_MONTHLY_RENT_CEILING &&
          option.availabilityConfidence === "confirmed-2026",
      ),
    ).toBe(true);
  });

  it("keeps every row tied to a fresh source snapshot note", () => {
    expect(
      miamiOxfordHousingOptions.every(
        (option) =>
          option.lastVerifiedAt === "2026-04-25" &&
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

describe("August 2026 under-$750 solo shortlist", () => {
  it("keeps only verified August/Fall 2026 solo listings with posted rent under $750", () => {
    const strict = getVerifiedUnder750SoloOptions(miamiOxfordHousingOptions);

    expect(strict.map((option) => option.id)).toEqual([
      "15-n-locust-unit-c",
      "10-west-sycamore",
      "717-mcguffey",
      "718-south-locust",
      "312-s-poplar-unit-10",
    ]);
    expect(
      strict.every((option) => ["studio", "efficiency", "one-bedroom"].includes(option.unitType)),
    ).toBe(true);
    expect(strict.every((option) => option.bedrooms <= 1 && option.bathrooms <= 1)).toBe(true);
  });

  it("keeps source-practical photos on every visible shortlist card", () => {
    const strict = getVerifiedUnder750SoloOptions(miamiOxfordHousingOptions);

    expect(
      strict.every(
        (option) =>
          option.photo?.url.startsWith("https://") &&
          option.photo.alt.includes(option.propertyName) &&
          option.photo.sourceLabel.length > 3,
      ),
    ).toBe(true);
  });

  it("calculates Ethan Price ranges after the parent contribution", () => {
    const ranges = Object.fromEntries(
      miamiOxfordHousingOptions
        .filter(isVerifiedUnder750SoloOption)
        .map((option) => [option.id, calculateEthanPriceRange(option).label]),
    );

    expect(ranges).toEqual({
      "15-n-locust-unit-c": "$100-$125",
      "10-west-sycamore": "$95-$175",
      "717-mcguffey": "$95-$150",
      "718-south-locust": "$125-$175",
      "312-s-poplar-unit-10": "$200-$225",
    });
    expect(calculateEthanPrice(600)).toBe(100);
    expect(calculateEthanPrice(700)).toBe(200);
    expect(calculateEthanPrice(750)).toBe(250);
    expect(calculateEthanPrice(450)).toBe(0);
  });

  it("sorts the strict shortlist by deterministic parent confidence", () => {
    const strict = miamiOxfordHousingOptions.filter(isVerifiedUnder750SoloOption);
    const sorted = sortHousingOptions(strict, "best-fit");

    expect(sorted.map((option) => option.id)).toEqual([
      "10-west-sycamore",
      "717-mcguffey",
      "718-south-locust",
      "15-n-locust-unit-c",
      "312-s-poplar-unit-10",
    ]);
    expect(getParentConfidenceScore(sorted[0]!)).toBeGreaterThan(
      getParentConfidenceScore(sorted[1]!),
    );
    expect(getParentConfidenceScore(sorted[1]!)).toBeGreaterThan(
      getParentConfidenceScore(sorted[2]!),
    );
  });

  it("keeps legacy strict one-bed helper aligned with the new verified shortlist", () => {
    expect(miamiOxfordHousingOptions.filter(isStrictAffordableNextYearOneBed)).toEqual(
      getVerifiedUnder750SoloOptions(miamiOxfordHousingOptions),
    );
  });

  it("adds parent-facing ranking bands for the shortlist", () => {
    const bands = Object.fromEntries(
      getVerifiedUnder750SoloOptions(miamiOxfordHousingOptions).map((option) => [
        option.id,
        getRankingBand(option),
      ]),
    );

    expect(bands).toEqual({
      "15-n-locust-unit-c": "best budget",
      "10-west-sycamore": "solid",
      "717-mcguffey": "best budget",
      "718-south-locust": "solid",
      "312-s-poplar-unit-10": "call first",
    });
  });

  it("keeps source conflicts hidden from the verified main list", () => {
    const verifiedIds = getVerifiedUnder750SoloOptions(miamiOxfordHousingOptions).map(
      (option) => option.id,
    );

    expect(verifiedIds).not.toContain("314-s-poplar-unit-16");
    expect(verifiedIds).not.toContain("314-s-poplar-unit-21");
    expect(verifiedIds).not.toContain("harbor-house-studio");
    expect(
      miamiOxfordRejectedHousingNotes.some(
        (note) =>
          note.id === "314-s-poplar-conflict" &&
          note.reason.includes("2027-2028") &&
          note.notes.some((entry) => entry.includes("2026-2027")),
      ),
    ).toBe(true);
    expect(
      miamiOxfordRejectedHousingNotes.some(
        (note) =>
          note.id === "harbor-house-over-cap-conflict" &&
          note.reason.includes("$760") &&
          note.notes.some((entry) => entry.includes("$725-$745")),
      ),
    ).toBe(true);
  });
});

describe("housing UI source contract", () => {
  it("uses under-$750 shortlist copy and keeps map/list counts fed by the same visible options", () => {
    const routeSource = readFileSync(
      join(process.cwd(), "src/app/miami-oxford-housing-2026/page.tsx"),
      "utf8",
    );
    const explorerSource = readFileSync(
      join(process.cwd(), "src/components/housing/MiamiHousingExplorer.tsx"),
      "utf8",
    );

    expect(routeSource).toContain("under-$750 solo housing shortlist");
    expect(explorerSource).toContain("August 2026 under-$750 solo housing shortlist");
    expect(explorerSource).not.toContain("strict listings");
    expect(explorerSource).not.toContain("under-$700");
    expect(explorerSource).toContain("options={visibleOptions}");
    expect(explorerSource).toContain("visibleOptions.map");
    expect(explorerSource).toContain('useState<MobileTab>("list")');
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
