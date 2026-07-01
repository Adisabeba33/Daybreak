import { describe, expect, it } from "vitest";
import { dayKey, daysBetween, phaseForHour, previousDayKey } from "./date";

describe("dayKey", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    expect(dayKey(new Date(2026, 6, 1))).toBe("2026-07-01");
    expect(dayKey(new Date(2026, 0, 9))).toBe("2026-01-09");
  });
});

describe("previousDayKey", () => {
  it("steps back a day across month boundaries", () => {
    expect(previousDayKey("2026-07-01")).toBe("2026-06-30");
    expect(previousDayKey("2026-01-01")).toBe("2025-12-31");
  });
});

describe("daysBetween", () => {
  it("counts whole days, signed", () => {
    expect(daysBetween("2026-07-02", "2026-07-01")).toBe(1);
    expect(daysBetween("2026-07-01", "2026-07-05")).toBe(-4);
    expect(daysBetween("2026-07-01", "2026-07-01")).toBe(0);
  });
});

describe("phaseForHour", () => {
  it("maps hours to phases", () => {
    expect(phaseForHour(7)).toBe("morning");
    expect(phaseForHour(10)).toBe("morning");
    expect(phaseForHour(11)).toBe("day");
    expect(phaseForHour(17)).toBe("day");
    expect(phaseForHour(18)).toBe("evening");
    expect(phaseForHour(23)).toBe("evening");
  });
});
