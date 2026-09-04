import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { db } from "../db/habit-tracker.db";
import { toDateKey } from "../utils/date-converter.util";
import { MAX_ACTIVE_HABITS, useHabits } from "./use-habits.hook";

const monday = new Date(2026, 8, 7);

beforeEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

afterEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

describe("useHabits", () => {
  it("returns no habits and is not loading once resolved, for an empty db", async () => {
    const { result } = renderHook(() => useHabits(monday));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.habits).toEqual([]);
    expect(result.current.isAtLimit).toBe(false);
  });

  it("adds a habit at the last order position", async () => {
    const { result } = renderHook(() => useHabits(monday));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.addHabit("Read"));
    await waitFor(() => expect(result.current.habits).toHaveLength(1));
    expect(result.current.habits[0]).toMatchObject({ label: "Read", order: 0 });

    await act(() => result.current.addHabit("Move"));
    await waitFor(() => expect(result.current.habits).toHaveLength(2));
    expect(result.current.habits.map((h) => h.label)).toEqual(["Read", "Move"]);
  });

  it("refuses to add a 6th active habit", async () => {
    for (let i = 0; i < MAX_ACTIVE_HABITS; i++) {
      await db.habits.add({ label: `Habit ${i}`, order: i, createdAt: Date.now() });
    }

    const { result } = renderHook(() => useHabits(monday));
    await waitFor(() => expect(result.current.habits).toHaveLength(MAX_ACTIVE_HABITS));
    expect(result.current.isAtLimit).toBe(true);

    await act(() => result.current.addHabit("One too many"));
    await waitFor(() => expect(result.current.habits).toHaveLength(MAX_ACTIVE_HABITS));
  });

  it("renames a habit", async () => {
    const id = (await db.habits.add({ label: "Read", order: 0, createdAt: Date.now() })) as number;
    const { result } = renderHook(() => useHabits(monday));
    await waitFor(() => expect(result.current.habits).toHaveLength(1));

    await act(() => result.current.renameHabit(id, "Reading"));
    await waitFor(() => expect(result.current.habits[0].label).toBe("Reading"));
  });

  it("moves a habit up and down among active habits", async () => {
    const readId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: Date.now(),
    })) as number;
    const moveId = (await db.habits.add({
      label: "Move",
      order: 1,
      createdAt: Date.now(),
    })) as number;

    const { result } = renderHook(() => useHabits(monday));
    await waitFor(() => expect(result.current.habits).toHaveLength(2));
    expect(result.current.habits.map((h) => h.id)).toEqual([readId, moveId]);

    await act(() => result.current.moveHabit(readId, 1));
    await waitFor(() => expect(result.current.habits.map((h) => h.id)).toEqual([moveId, readId]));
  });

  it("archives a habit, removing it from the active list", async () => {
    const id = (await db.habits.add({ label: "Read", order: 0, createdAt: Date.now() })) as number;
    const { result } = renderHook(() => useHabits(monday));
    await waitFor(() => expect(result.current.habits).toHaveLength(1));

    await act(() => result.current.archiveHabit(id));
    await waitFor(() => expect(result.current.habits).toHaveLength(0));

    const archived = await db.habits.get(id);
    expect(archived?.archivedAt).toBeTypeOf("number");
  });

  it("checks and unchecks a habit's fulfillment for a date", async () => {
    const id = (await db.habits.add({ label: "Read", order: 0, createdAt: Date.now() })) as number;
    const dateKey = toDateKey(monday);

    const { result } = renderHook(() => useHabits(monday));
    await waitFor(() => expect(result.current.habits).toHaveLength(1));
    expect(result.current.habits[0].completions.has(dateKey)).toBe(false);

    await act(() => result.current.toggleFulfillment(id, dateKey));
    await waitFor(() => expect(result.current.habits[0].completions.has(dateKey)).toBe(true));

    await act(() => result.current.toggleFulfillment(id, dateKey));
    await waitFor(() => expect(result.current.habits[0].completions.has(dateKey)).toBe(false));
  });
});
