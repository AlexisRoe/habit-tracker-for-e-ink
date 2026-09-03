import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { db } from "../db/habit-tracker.db";
import { toDateKey } from "../utils/date-converter.util";
import { useYearlyProgress } from "./use-yearly-progress.hook";

const today = new Date(2026, 8, 4); // Fri, Sep 4 2026 — within week 36 (Aug 31 - Sep 6)

beforeEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

afterEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

describe("useYearlyProgress", () => {
  it("is 100% for a habit active the whole week and fulfilled every day", async () => {
    const monday = new Date(2026, 7, 31); // week 36 starts Mon Aug 31
    const habitId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
    })) as number;

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      await db.fulfillments.add({ habitId, date: toDateKey(day) });
    }

    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week36 = result.current.weeks.find((w) => w.weekNumber === 36);
    expect(week36?.percentage).toBe(100);
  });

  it("is 100% for a habit created mid-week and fulfilled from creation through week end", async () => {
    const wednesday = new Date(2026, 8, 2); // week 36, Wed Sep 2
    const habitId = (await db.habits.add({
      label: "Move",
      order: 0,
      createdAt: wednesday.getTime(),
    })) as number;

    // active days for the habit within week 36: Wed 2 - Sun 6 (5 days),
    // but "today" is Fri Sep 4, so only Wed-Fri count (future days excluded)
    for (let i = 0; i < 3; i++) {
      const day = new Date(wednesday);
      day.setDate(wednesday.getDate() + i);
      await db.fulfillments.add({ habitId, date: toDateKey(day) });
    }

    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week36 = result.current.weeks.find((w) => w.weekNumber === 36);
    expect(week36?.percentage).toBe(100);
  });

  it("averages each habit's own percentage, unweighted by its active-day count", async () => {
    const monday = new Date(2026, 7, 31);
    const wednesday = new Date(2026, 8, 2);

    // Habit A: active since Monday, fulfilled every day through today (Fri) => 100%
    const habitAId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
    })) as number;
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      await db.fulfillments.add({ habitId: habitAId, date: toDateKey(day) });
    }

    // Habit B: active since Wednesday (3 active days through Fri), fulfilled only 1 of them => ~33%
    const habitBId = (await db.habits.add({
      label: "Move",
      order: 1,
      createdAt: wednesday.getTime(),
    })) as number;
    await db.fulfillments.add({ habitId: habitBId, date: toDateKey(wednesday) });

    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week36 = result.current.weeks.find((w) => w.weekNumber === 36);
    // average of 100% and 33% (1/3, rounded) => 67%, NOT the pooled 6/8=75%
    expect(week36?.percentage).toBe(67);
  });

  it("matches the worked example: full-week habit + mid-week habit both 100% average to 100%", async () => {
    const monday = new Date(2026, 7, 31);
    const wednesday = new Date(2026, 8, 2);
    const sunday = new Date(2026, 8, 6);

    const habitAId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
    })) as number;
    const habitBId = (await db.habits.add({
      label: "Move",
      order: 1,
      createdAt: wednesday.getTime(),
    })) as number;

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      await db.fulfillments.add({ habitId: habitAId, date: toDateKey(day) });
    }
    for (let day = new Date(wednesday); day <= sunday; day.setDate(day.getDate() + 1)) {
      await db.fulfillments.add({ habitId: habitBId, date: toDateKey(day) });
    }

    // use a "today" past the end of the week so all 7 days count as non-future
    const { result } = renderHook(() => useYearlyProgress(2026, new Date(2026, 8, 10)));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week36 = result.current.weeks.find((w) => w.weekNumber === 36);
    expect(week36?.percentage).toBe(100);
  });

  it("excludes days before the habit was created and after the archival date", async () => {
    const monday = new Date(2026, 6, 6); // an earlier week, fully in the past
    const habitId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
      archivedAt: new Date(2026, 6, 9).getTime(), // archived Thursday
    })) as number;

    // active days: Mon-Wed (3 days). Fulfill all 3.
    for (let i = 0; i < 3; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      await db.fulfillments.add({ habitId, date: toDateKey(day) });
    }

    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week = result.current.weeks.find((w) =>
      w.days.some((day) => toDateKey(day) === toDateKey(monday)),
    );
    expect(week?.percentage).toBe(100);
  });

  it("is 0% for a week with no active habits", async () => {
    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week1 = result.current.weeks.find((w) => w.weekNumber === 1);
    expect(week1?.percentage).toBe(0);
  });
});
