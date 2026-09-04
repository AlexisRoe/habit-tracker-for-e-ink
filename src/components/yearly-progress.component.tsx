import type { JSX } from "react";

import { useYearlyProgress } from "../hooks/use-yearly-progress.hook";
import { formatWeekRange, toDateKey } from "../utils/date-converter.util";
import { Text } from "./text.component";

import "./yearly-progress.component.css";

/** Props for {@link YearlyProgress}. */
interface YearlyProgressProps {
  /** Calendar year to display. Defaults to the current year. */
  year?: number;
  /** Reference date used to highlight the current week. Defaults to today. */
  today?: Date;
}

/**
 * Grid of the year's weeks (52 or 53, depending on the year), each shown as
 * a card with a week number, a date range, and a circle whose fill height
 * represents the share of habits completed that week (0–100%). The week
 * containing `today` is outlined.
 *
 * @example
 * ```tsx
 * <YearlyProgress year={2026} />
 * ```
 */
export function YearlyProgress({
  year = new Date().getFullYear(),
  today = new Date(),
}: YearlyProgressProps): JSX.Element {
  const { weeks } = useYearlyProgress(year, today);
  const todayKey = toDateKey(today);

  return (
    <div className="yearly-progress">
      <div className="yearly-progress-grid">
        {weeks.map((week) => {
          const isCurrentWeek = week.days.some((day) => toDateKey(day) === todayKey);

          return (
            <div
              className={
                isCurrentWeek
                  ? "yearly-progress-card yearly-progress-card-current"
                  : "yearly-progress-card"
              }
              key={week.weekNumber}
            >
              <div className="yearly-progress-circle" aria-hidden="true">
                <div
                  className="yearly-progress-circle-fill"
                  style={{ height: `${week.percentage}%` }}
                />
              </div>
              <div className="yearly-progress-card-info">
                <Text.Label>{`W${String(week.weekNumber).padStart(2, "0")}`}</Text.Label>
                <Text.Mono>{formatWeekRange(week.days)}</Text.Mono>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
