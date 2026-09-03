import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { db } from "../db/habit-tracker.db";
import type { Habit } from "../db/habit-tracker.types";
import { getWeekDays, toDateKey } from "../utils/date-converter.util";

/** Maximum number of habits that may be active (non-archived) at once. */
export const MAX_ACTIVE_HABITS = 5;

/** A persisted, active {@link Habit} together with its completions for the requested week. */
export interface HabitWithCompletions extends Habit {
  /** Auto-incrementing primary key. Always defined for a persisted habit. */
  id: number;
  /** Set of `"YYYY-MM-DD"` date keys, within the requested week, on which the habit was fulfilled. */
  completions: Set<string>;
}

/** Return value of {@link useHabits}. */
export interface UseHabitsReturn {
  /** Active (non-archived) habits for the requested week, ordered by `order` ascending. */
  habits: HabitWithCompletions[];
  /** `true` once the initial Dexie query has resolved. `habits` is `[]` until then. */
  isLoading: boolean;
  /** `true` when {@link MAX_ACTIVE_HABITS} active habits already exist, disallowing further adds. */
  isAtLimit: boolean;
  /**
   * Creates a new active habit, appended after the last habit. No-ops when
   * already {@link isAtLimit}.
   */
  addHabit: (label: string) => Promise<void>;
  /** Renames an existing habit. */
  renameHabit: (habitId: number, label: string) => Promise<void>;
  /**
   * Moves a habit up or down by one position among the active habits,
   * swapping `order` with its neighbor. No-ops at either end of the list.
   */
  moveHabit: (habitId: number, direction: -1 | 1) => Promise<void>;
  /** Archives a habit, removing it from the active list and freeing an active slot. */
  archiveHabit: (habitId: number) => Promise<void>;
  /** Toggles a habit's fulfillment for `dateKey` (`"YYYY-MM-DD"`) on or off. */
  toggleFulfillment: (habitId: number, dateKey: string) => Promise<void>;
}

/**
 * Loads and manages active (non-archived) habits, together with their
 * fulfillment state for the Monday–Sunday week containing `date`.
 *
 * Backed by Dexie/IndexedDB via `useLiveQuery`, so the returned `habits`
 * update automatically as the underlying data changes.
 *
 * @example
 * ```tsx
 * const { habits, isAtLimit, addHabit, toggleFulfillment } = useHabits(selectedDate);
 * ```
 */
export function useHabits(date: Date = new Date()): UseHabitsReturn {
  const weekKeys = useMemo(() => getWeekDays(date).map(toDateKey), [date]);

  const data = useLiveQuery(
    async () => {
      const [allHabits, weekFulfillments] = await Promise.all([
        db.habits.toArray(),
        db.fulfillments.where("date").anyOf(weekKeys).toArray(),
      ]);

      const weekEndKey = weekKeys[weekKeys.length - 1];
      const activeHabits = allHabits
        .filter((habit): habit is Habit & { id: number } => habit.archivedAt == null)
        .filter((habit) => toDateKey(new Date(habit.createdAt)) <= weekEndKey)
        .sort((a, b) => a.order - b.order);

      const completionsByHabitId = new Map<number, Set<string>>();
      for (const fulfillment of weekFulfillments) {
        const completions = completionsByHabitId.get(fulfillment.habitId) ?? new Set<string>();
        completions.add(fulfillment.date);
        completionsByHabitId.set(fulfillment.habitId, completions);
      }

      const habits: HabitWithCompletions[] = activeHabits.map((habit) => ({
        ...habit,
        completions: completionsByHabitId.get(habit.id) ?? new Set<string>(),
      }));

      return habits;
    },
    [weekKeys.join(",")],
    undefined,
  );

  const habits = data ?? [];
  const isLoading = data === undefined;
  const isAtLimit = habits.length >= MAX_ACTIVE_HABITS;

  async function addHabit(label: string): Promise<void> {
    const activeCount = await db.habits.filter((habit) => habit.archivedAt == null).count();
    if (activeCount >= MAX_ACTIVE_HABITS) return;

    const maxOrder = await db.habits.orderBy("order").last();
    await db.habits.add({
      label,
      order: (maxOrder?.order ?? -1) + 1,
      createdAt: Date.now(),
    });
  }

  async function renameHabit(habitId: number, label: string): Promise<void> {
    await db.habits.update(habitId, { label });
  }

  async function moveHabit(habitId: number, direction: -1 | 1): Promise<void> {
    const activeHabits = (
      await db.habits.filter((habit) => habit.archivedAt == null).toArray()
    ).sort((a, b) => a.order - b.order);

    const index = activeHabits.findIndex((habit) => habit.id === habitId);
    const targetIndex = index + direction;
    if (index === -1 || targetIndex < 0 || targetIndex >= activeHabits.length) return;

    const current = activeHabits[index];
    const target = activeHabits[targetIndex];
    await db.transaction("rw", db.habits, async () => {
      await db.habits.update(current.id as number, { order: target.order });
      await db.habits.update(target.id as number, { order: current.order });
    });
  }

  async function archiveHabit(habitId: number): Promise<void> {
    await db.habits.update(habitId, { archivedAt: Date.now() });
  }

  async function toggleFulfillment(habitId: number, dateKey: string): Promise<void> {
    const existing = await db.fulfillments.where({ habitId, date: dateKey }).first();
    if (existing) {
      await db.fulfillments.delete(existing.id as number);
    } else {
      await db.fulfillments.add({ habitId, date: dateKey });
    }
  }

  return {
    habits,
    isLoading,
    isAtLimit,
    addHabit,
    renameHabit,
    moveHabit,
    archiveHabit,
    toggleFulfillment,
  };
}
