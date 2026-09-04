import type { JSX } from "react";

import {
  convertDateToTitle,
  convertDateToWeekRangeLabel,
  getWeekDays,
  toDateKey,
} from "../utils/date-converter.util";
import { Button } from "./button.component";
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
      <Text.Mono>{convertDateToWeekRangeLabel(date)}</Text.Mono>
      <div className="date-nav-controls">
        <Button.Naked variant="arrowL" label="Previous week" onClick={() => onPrevious?.()} />
        <Button.Transparent onClick={() => onDateClick?.()}>
          <Text.Mono>{convertDateToTitle(today)}</Text.Mono>
        </Button.Transparent>
        <Button.Naked
          variant="arrowR"
          label="Next week"
          onClick={() => onNext?.()}
          disabled={isCurrentOrFutureWeek}
        />
      </div>
    </div>
  );
}
