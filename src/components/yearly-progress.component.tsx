import type { JSX } from "react";

import { formatWeekRange, getWeeksOfYear, toDateKey } from "../utils/date-converter.util";
import { Icon } from "./icons.component";
import { Mono } from "./text.component";

import "./yearly-progress.component.css";

/** A single calendar week's habit-completion share, as a percentage 0–100. */
interface WeeklyCompletion {
  /** ISO-ish week number within the year, 1-based (52 or 53 weeks total). */
  weekNumber: number;
  /** The week's 7 days, Monday–Sunday. */
  days: Date[];
  /** Share of habits completed across the week, 0–100. */
  percentage: number;
}

/**
 * Builds mocked weekly-completion data for `year`. All weeks currently mock
 * to 0% until real completion data is wired in.
 */
function createMockWeeklyCompletions(year: number): WeeklyCompletion[] {
  return getWeeksOfYear(year).map((days, index) => ({
    weekNumber: index + 1,
    days,
    percentage: 0,
  }));
}

/** Props for {@link YearlyProgress}. */
interface YearlyProgressProps {
  /** Calendar year to display. Defaults to the current year. */
  year?: number;
  /** Reference date used to highlight the current week. Defaults to today. */
  today?: Date;
  /** Called when the previous-year arrow is clicked. */
  onPreviousYear?: () => void;
  /** Called when the next-year arrow is clicked. */
  onNextYear?: () => void;
}

/**
 * Grid of the year's weeks (52 or 53, depending on the year), each shown as
 * a card with a week number, a date range, and a circle whose fill height
 * represents the share of habits completed that week (0–100%). The week
 * containing `today` is outlined.
 *
 * @example
 * ```tsx
 * <YearlyProgress />
 * ```
 */
export function YearlyProgress({
  year = new Date().getFullYear(),
  today = new Date(),
  onPreviousYear,
  onNextYear,
}: YearlyProgressProps): JSX.Element {
  const weeks = createMockWeeklyCompletions(year);
  const todayKey = toDateKey(today);
  const isCurrentYear = year >= today.getFullYear();

  return (
    <div className="yearly-progress">
      <div className="yearly-progress-header">
        <Mono className="yearly-progress-title">
          {`${year} — ${weeks.length} weeks`.toUpperCase()}
        </Mono>
        <div className="yearly-progress-controls">
          <button
            type="button"
            className="yearly-progress-arrow"
            onClick={onPreviousYear}
            aria-label="Previous year"
          >
            <Icon variant="arrowL" label="Previous year" />
          </button>
          <Mono>{String(year)}</Mono>
          <button
            type="button"
            className="yearly-progress-arrow"
            onClick={onNextYear}
            disabled={isCurrentYear}
            aria-label="Next year"
          >
            <Icon variant="arrowR" label="Next year" />
          </button>
        </div>
      </div>
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
              <div className="yearly-progress-card-info">
                <span className="yearly-progress-week-label">
                  W{String(week.weekNumber).padStart(2, "0")}
                </span>
                <span className="yearly-progress-range">{formatWeekRange(week.days)}</span>
              </div>
              <div className="yearly-progress-circle" aria-hidden="true">
                <div
                  className="yearly-progress-circle-fill"
                  style={{ height: `${week.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
