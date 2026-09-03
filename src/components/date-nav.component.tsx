import type { JSX } from "react";

import { convertDateToTitle, convertDateToWeekRangeLabel } from "../utils/date-converter.util";
import { Icon } from "./icons.component";
import { Mono } from "./text.component";

import "./date-nav.component.css";

/** Props for {@link DateNav}. */
interface DateNavProps {
  /** Date used to derive the displayed week range and current-date label. */
  date?: Date;
  /** Called when the previous-week arrow is clicked. */
  onPrevious?: () => void;
  /** Called when the next-week arrow is clicked. */
  onNext?: () => void;
  /** Called when the current-date label is clicked. */
  onDateClick?: () => void;
}

/**
 * Week navigation bar: the Monday–Sunday range of `date` on the left, and
 * previous/next arrows around the current date's short label on the right.
 *
 * @example
 * ```tsx
 * <DateNav date={selectedDate} onPrevious={goToPreviousWeek} onNext={goToNextWeek} />
 * ```
 */
export function DateNav({
  date = new Date(),
  onPrevious,
  onNext,
  onDateClick,
}: DateNavProps): JSX.Element {
  return (
    <div className="date-nav">
      <Mono className="date-nav-week">{convertDateToWeekRangeLabel(date)}</Mono>
      <div className="date-nav-controls">
        <button
          type="button"
          className="date-nav-arrow"
          onClick={onPrevious}
          aria-label="Previous week"
        >
          <Icon variant="arrowL" label="Previous week" />
        </button>
        <button type="button" className="date-nav-date" onClick={onDateClick}>
          <Mono>{convertDateToTitle(date)}</Mono>
        </button>
        <button type="button" className="date-nav-arrow" onClick={onNext} aria-label="Next week">
          <Icon variant="arrowR" label="Next week" />
        </button>
      </div>
    </div>
  );
}
