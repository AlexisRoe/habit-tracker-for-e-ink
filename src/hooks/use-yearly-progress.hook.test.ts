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
    expect(week36?.hasActiveHabits).toBe(true);
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

  it("pools all habits' active-day points for the week instead of averaging per-habit percentages", async () => {
    const monday = new Date(2026, 7, 31);
    const wednesday = new Date(2026, 8, 2);

    // Habit A: active since Monday, fulfilled every day through today (Fri) => 5/5 points
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

    // Habit B: active since Wednesday (3 active days through Fri), fulfilled only 1 of them => 1/3 points
    const habitBId = (await db.habits.add({
      label: "Move",
      order: 1,
      createdAt: wednesday.getTime(),
    })) as number;
    await db.fulfillments.add({ habitId: habitBId, date: toDateKey(wednesday) });

    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week36 = result.current.weeks.find((w) => w.weekNumber === 36);
    // pooled: (5 + 1) fulfilled out of (5 + 3) active points => 6/8 = 75%, NOT the
    // per-habit average of 100% and 33% (which would be 67%)
    expect(week36?.percentage).toBe(75);
  });

  it("is 100% when every active point across habits is fulfilled", async () => {
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

  it("includes the archival day itself as active", async () => {
    const monday = new Date(2026, 6, 6); // an earlier week, fully in the past
    const habitId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
      archivedAt: new Date(2026, 6, 9).getTime(), // archived Thursday
    })) as number;

    // active days: Mon-Thu (4, archival day included). Fulfill Mon-Wed only.
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
    expect(week?.percentage).toBe(75);
  });

  it("counts a fulfillment made on the archival day", async () => {
    const monday = new Date(2026, 6, 6);
    const thursday = new Date(2026, 6, 9);
    const habitId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
      archivedAt: thursday.getTime(),
    })) as number;

    for (let i = 0; i < 4; i++) {
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

  it("keeps a still-active habit's future weeks as active (empty, not hatched)", async () => {
    const monday = new Date(2026, 7, 31); // week 36, contains "today" (Fri Sep 4)
    await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
    });

    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // week 40 is entirely after "today" — the habit will still be active there
    // once it arrives, so it should render as an empty (bordered) circle, not hatched.
    const week40 = result.current.weeks.find((w) => w.weekNumber === 40);
    expect(week40?.hasActiveHabits).toBe(true);
    expect(week40?.percentage).toBe(0);
  });

  it("has no active habits for a week where no habit existed yet", async () => {
    const { result } = renderHook(() => useYearlyProgress(2026, today));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week1 = result.current.weeks.find((w) => w.weekNumber === 1);
    expect(week1?.hasActiveHabits).toBe(false);
    expect(week1?.percentage).toBe(0);
  });

  it("matches the spec's simple example: two full-week habits, one fully done, => 50%", async () => {
    const monday = new Date(2026, 7, 31);
    const habitAId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
    })) as number;
    await db.habits.add({
      label: "Move",
      order: 1,
      createdAt: monday.getTime(),
    });

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      await db.fulfillments.add({ habitId: habitAId, date: toDateKey(day) });
    }

    // "today" past week end so no days are excluded as future
    const { result } = renderHook(() => useYearlyProgress(2026, new Date(2026, 8, 10)));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week36 = result.current.weeks.find((w) => w.weekNumber === 36);
    // 14 possible points (2 habits x 7 days), 7 fulfilled => 50%
    expect(week36?.percentage).toBe(50);
  });

  it("matches the spec's complex example: pools 6 + 3 points across habits => 44%", async () => {
    const tuesday = new Date(2026, 7, 25); // week 35, Tue Aug 25 - Sun Aug 30
    const friday = new Date(2026, 7, 28);

    const habitAId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: tuesday.getTime(),
    })) as number;
    const habitBId = (await db.habits.add({
      label: "Move",
      order: 1,
      createdAt: friday.getTime(),
    })) as number;

    // habit A (Tue-Sun, 6 active days): fulfilled once, on Tuesday
    await db.fulfillments.add({ habitId: habitAId, date: toDateKey(tuesday) });

    // habit B (Fri-Sun, 3 active days): fully fulfilled
    for (let i = 0; i < 3; i++) {
      const day = new Date(friday);
      day.setDate(friday.getDate() + i);
      await db.fulfillments.add({ habitId: habitBId, date: toDateKey(day) });
    }

    // "today" past week end so no days are excluded as future
    const { result } = renderHook(() => useYearlyProgress(2026, new Date(2026, 8, 10)));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week35 = result.current.weeks.find((w) =>
      w.days.some((day) => toDateKey(day) === toDateKey(tuesday)),
    );
    // 9 possible points (6 + 3), 4 fulfilled (1 + 3) => 44.44%, rounded to 44
    expect(week35?.percentage).toBe(44);
  });

  it("excludes days that belong to the adjacent year from the point pool", async () => {
    // Week 1 of 2026 spans Mon Dec 29 2025 - Sun Jan 4 2026.
    const december29 = new Date(2025, 11, 29);
    const habitId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: december29.getTime(),
    })) as number;

    // Fulfill only the December (out-of-year) days, not Jan 1-4.
    for (let i = 0; i < 3; i++) {
      const day = new Date(december29);
      day.setDate(december29.getDate() + i);
      await db.fulfillments.add({ habitId, date: toDateKey(day) });
    }

    // "today" past week end so no days are excluded as future.
    const { result } = renderHook(() => useYearlyProgress(2026, new Date(2026, 0, 10)));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const week1 = result.current.weeks.find((w) => w.weekNumber === 1);
    // The December fulfillments must not count: habit is active on the 4
    // in-year days (Jan 1-4), none of which were fulfilled => 0%, but the
    // habit was still active in-year so hasActiveHabits stays true.
    expect(week1?.percentage).toBe(0);
    expect(week1?.hasActiveHabits).toBe(true);
  });
});
