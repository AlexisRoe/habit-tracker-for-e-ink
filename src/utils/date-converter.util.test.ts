import { describe, expect, it } from "vitest";

import {
  convertDateToTitle,
  convertDateToWeekRangeLabel,
  formatWeekRange,
  getWeekDays,
  getWeeksOfYear,
  isBeforeDate,
  isFutureDate,
  toDateKey,
} from "./date-converter.util";

describe("convertDateToTitle", () => {
  it("formats a date as a short weekday/month/day title", () => {
    expect(convertDateToTitle(new Date(2026, 8, 4))).toBe("Fri, Sep 4");
  });
});

describe("convertDateToWeekRangeLabel", () => {
  it("formats the Monday–Sunday week containing the date, uppercased", () => {
    expect(convertDateToWeekRangeLabel(new Date(2026, 8, 4))).toBe("AUG 31 - SEP 6");
  });

  it("uses the end month when the week spans two months", () => {
    expect(convertDateToWeekRangeLabel(new Date(2026, 7, 31))).toBe("AUG 31 - SEP 6");
  });
});

describe("getWeekDays", () => {
  it("returns the 7 days of the Monday–Sunday week containing the date", () => {
    const days = getWeekDays(new Date(2026, 8, 4));
    expect(days).toHaveLength(7);
    expect(toDateKey(days[0])).toBe("2026-08-31");
    expect(toDateKey(days[6])).toBe("2026-09-06");
  });

  it("defaults to today when no date is given", () => {
    expect(getWeekDays()).toHaveLength(7);
  });
});

describe("toDateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("isFutureDate", () => {
  it("is true when the date is after today", () => {
    expect(isFutureDate(new Date(2099, 0, 1), new Date(2026, 8, 4))).toBe(true);
  });

  it("is false for today or the past", () => {
    const today = new Date(2026, 8, 4);
    expect(isFutureDate(today, today)).toBe(false);
    expect(isFutureDate(new Date(2000, 0, 1), today)).toBe(false);
  });
});

describe("isBeforeDate", () => {
  it("is true when the date is strictly before the reference date", () => {
    expect(isBeforeDate(new Date(2020, 0, 1), new Date(2026, 0, 1))).toBe(true);
  });

  it("is false for the same date or later", () => {
    const date = new Date(2026, 0, 1);
    expect(isBeforeDate(date, date)).toBe(false);
    expect(isBeforeDate(new Date(2027, 0, 1), date)).toBe(false);
  });
});

describe("getWeeksOfYear", () => {
  it("returns weeks starting from the Monday of the week containing Jan 1st", () => {
    const weeks = getWeeksOfYear(2026);
    expect(toDateKey(weeks[0][0])).toBe("2025-12-29");
    expect(weeks.length).toBeGreaterThanOrEqual(52);
  });

  it("continues through the week containing Dec 31st", () => {
    const weeks = getWeeksOfYear(2026);
    const lastWeek = weeks[weeks.length - 1];
    expect(toDateKey(lastWeek[6]) >= "2026-12-31").toBe(true);
  });
});

describe("formatWeekRange", () => {
  it("formats a week's date range within the same month", () => {
    const days = getWeekDays(new Date(2026, 8, 4));
    expect(formatWeekRange(days)).toBe("Aug 31 – Sep 6");
  });

  it("formats a week's date range spanning a year boundary", () => {
    const days = getWeekDays(new Date(2026, 0, 1));
    expect(formatWeekRange(days)).toBe("Dec 29 – Jan 4");
  });
});
