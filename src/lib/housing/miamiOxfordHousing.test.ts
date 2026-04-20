import { describe, expect, it } from "vitest";

import {
  buildMoveInDueSummary,
  buildRecurringAllInSummary,
  calculateMonthlyEquivalentFromSchoolYearTotal,
  calculateMoveInDue,
  calculateSchoolYearTotalFromMonthly,
  getRankingScore,
  miamiOxfordHousingOptions,
  sortHousingOptions,
} from "./miamiOxfordHousing";

describe("miamiOxfordHousing dataset", () => {
  it("contains only studios, efficiencies, and true 1BRs", () => {
    expect(miamiOxfordHousingOptions).toHaveLength(10);
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
    expect(summary.label).toBe("$800+");
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
