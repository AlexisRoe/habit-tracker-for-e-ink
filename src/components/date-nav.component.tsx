import type { JSX } from "react";

import {
  convertDateToTitle,
  convertDateToWeekRangeLabel,
  getWeekDays,
  toDateKey,
} from "../utils/date-converter.util";
import { Icon } from "./icons.component";
import { Text } from "./text.component";

import "./date-nav.component.css";

/** Props for {@link DateNav}. */
interface DateNavProps {
  /** Date whose Monday–Sunday week is displayed as the range on the left. */
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
 * previous/next arrows around today's actual date on the right. The center
 * label always shows the real current date, regardless of which week is
 * being viewed; clicking it should jump back to the current week. The next-
 * week arrow is disabled once `date`'s week already contains today, since
 * navigating into a future week is not allowed.
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
  const today = new Date();
  const isCurrentOrFutureWeek = toDateKey(getWeekDays(date)[0]) >= toDateKey(getWeekDays(today)[0]);

  return (
    <div className="date-nav">
      <Text.Mono className="date-nav-week">{convertDateToWeekRangeLabel(date)}</Text.Mono>
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
          <Text.Mono>{convertDateToTitle(today)}</Text.Mono>
        </button>
        <button
          type="button"
          className="date-nav-arrow"
          onClick={onNext}
          disabled={isCurrentOrFutureWeek}
          aria-label="Next week"
        >
          <Icon variant="arrowR" label="Next week" />
        </button>
      </div>
    </div>
  );
}
