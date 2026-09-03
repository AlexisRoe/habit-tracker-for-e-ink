import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { db } from "../db/habit-tracker.db";
import { getWeeksOfYear, isFutureDate, toDateKey } from "../utils/date-converter.util";

/** A single calendar week's habit-completion share, as a percentage 0–100. */
export interface WeeklyCompletion {
  /** ISO-ish week number within the year, 1-based (52 or 53 weeks total). */
  weekNumber: number;
  /** The week's 7 days, Monday–Sunday. */
  days: Date[];
  /** Average of the week's active habits' own completion shares, 0–100. */
  percentage: number;
}

/** Return value of {@link useYearlyProgress}. */
export interface UseYearlyProgressReturn {
  /** The year's weeks, in order, each with its completion percentage. */
  weeks: WeeklyCompletion[];
  /** `true` once the initial Dexie query has resolved. `weeks` is `[]` until then. */
  isLoading: boolean;
}

/**
 * For each Monday–Sunday week of `year`, computes the average per-habit
 * completion share. For every habit active at some point that week (on/after
 * its creation date, before its archival date if any), its own percentage is
 * the share of its active days (through today, for the current week) that
 * were checked off — so a habit created mid-week is 100% once it's fulfilled
 * every day from its creation through week's end, same as a habit active the
 * whole week. The week's percentage is then the plain average of the active
 * habits' individual percentages (a habit at 100% and one at 50% average to
 * 75%, regardless of how many active days each had).
 *
 * Backed by Dexie/IndexedDB via `useLiveQuery`, so the returned `weeks`
 * update automatically as the underlying data changes.
 *
 * @example
 * ```tsx
 * const { weeks } = useYearlyProgress(2026);
 * ```
 */
export function useYearlyProgress(year: number, today: Date = new Date()): UseYearlyProgressReturn {
  const weeksOfYear = useMemo(() => getWeeksOfYear(year), [year]);

  const data = useLiveQuery(
    async () => {
      const [allHabits, allFulfillments] = await Promise.all([
        db.habits.toArray(),
        db.fulfillments.toArray(),
      ]);

      const fulfilledKeysByHabitId = new Map<number, Set<string>>();
      for (const fulfillment of allFulfillments) {
        const keys = fulfilledKeysByHabitId.get(fulfillment.habitId) ?? new Set<string>();
        keys.add(fulfillment.date);
        fulfilledKeysByHabitId.set(fulfillment.habitId, keys);
      }

      return weeksOfYear.map((days, index) => {
        const habitPercentages: number[] = [];

        for (const habit of allHabits) {
          if (habit.id == null) continue;
          const habitCreatedKey = toDateKey(new Date(habit.createdAt));
          const habitArchivedKey =
            habit.archivedAt != null ? toDateKey(new Date(habit.archivedAt)) : undefined;
          const fulfilledKeys = fulfilledKeysByHabitId.get(habit.id) ?? new Set<string>();

          let activeDays = 0;
          let fulfilledDays = 0;

          for (const day of days) {
            if (isFutureDate(day, today)) continue;

            const dayKey = toDateKey(day);
            const isActive =
              dayKey >= habitCreatedKey && (habitArchivedKey == null || dayKey < habitArchivedKey);
            if (!isActive) continue;

            activeDays += 1;
            if (fulfilledKeys.has(dayKey)) fulfilledDays += 1;
          }

          if (activeDays > 0) habitPercentages.push((fulfilledDays / activeDays) * 100);
        }

        const percentage =
          habitPercentages.length === 0
            ? 0
            : Math.round(
                habitPercentages.reduce((sum, value) => sum + value, 0) / habitPercentages.length,
              );

        return { weekNumber: index + 1, days, percentage };
      });
    },
    [year, toDateKey(today)],
    undefined,
  );

  return {
    weeks: data ?? [],
    isLoading: data === undefined,
  };
}
