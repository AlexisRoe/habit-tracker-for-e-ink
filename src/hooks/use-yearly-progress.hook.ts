import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { db } from "../db/habit-tracker.db";
import { getWeeksOfYear, isFutureDate, toDateKey } from "../utils/date-converter.util";

/** A single calendar week's habit-completion share, as a percentage 0–100. */
export interface WeeklyCompletion {
  /** ISO-ish week number within the year, 1-based (52 or 53 weeks total). */
  weekNumber: number;
  /** The week's 7 days, Monday–Sunday, including any that belong to the adjacent year. */
  days: Date[];
  /**
   * Pooled completion percentage (0–100) across every (day, habit) point
   * active within the target year for this week. `0` both when nothing was
   * fulfilled and when there were no active habits — check
   * {@link hasActiveHabits} to tell those apart.
   */
  percentage: number;
  /**
   * Whether at least one habit was active on at least one in-year,
   * non-future day of this week. `false` means there was nothing to track
   * that week (renders as a hatched circle), distinct from `percentage === 0`
   * meaning habits existed but nothing was fulfilled.
   */
  hasActiveHabits: boolean;
}

/** Return value of {@link useYearlyProgress}. */
export interface UseYearlyProgressReturn {
  /** The year's weeks, in order, each with its completion percentage. */
  weeks: WeeklyCompletion[];
  /** `true` once the initial Dexie query has resolved. `weeks` is `[]` until then. */
  isLoading: boolean;
}

/**
 * For each Monday–Sunday week of `year`, pools every active habit's daily
 * points into one week-level completion share. Each (day, habit) pair where
 * the habit was active on that day (created on/before it, not yet archived —
 * archived on that same day still counts) contributes one point to the
 * denominator, and one to the numerator if it was fulfilled; the week's
 * `percentage` is `numerator / denominator * 100`, rounded. Days outside
 * `year` (the trailing days of the prior year in week 1, or the leading days
 * of the next year in the last week) and days after `today` are excluded
 * from the pool entirely.
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
        let totalPoints = 0;
        let fulfilledPoints = 0;
        let hasActiveHabits = false;

        for (const day of days) {
          if (day.getFullYear() !== year) continue;

          const dayKey = toDateKey(day);

          for (const habit of allHabits) {
            if (habit.id == null) continue;
            const habitCreatedKey = toDateKey(new Date(habit.createdAt));
            const habitArchivedKey =
              habit.archivedAt != null ? toDateKey(new Date(habit.archivedAt)) : undefined;
            const isActive =
              dayKey >= habitCreatedKey && (habitArchivedKey == null || dayKey <= habitArchivedKey);
            if (!isActive) continue;

            // A habit active on this day marks the week as having something to
            // track, even on future days (which don't yet contribute points).
            hasActiveHabits = true;
            if (isFutureDate(day, today)) continue;

            totalPoints += 1;
            if (fulfilledKeysByHabitId.get(habit.id)?.has(dayKey)) fulfilledPoints += 1;
          }
        }

        const percentage =
          totalPoints === 0 ? 0 : Math.round((fulfilledPoints / totalPoints) * 100);

        return { weekNumber: index + 1, days, percentage, hasActiveHabits };
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
