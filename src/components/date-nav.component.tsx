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
  /** Date whose Monday–Sunday week is displayed as the range on the left. Ignored when {@link label} is provided. */
  date?: Date;
  /** Called when the previous arrow is clicked. */
  onPrevious?: () => void;
  /** Called when the next arrow is clicked. */
  onNext?: () => void;
  /** Called when the center button is clicked. */
  onDateClick?: () => void;
  /** Text shown on the left, in place of the week range computed from {@link date}. */
  label?: string;
  /** Text shown in the center button, in place of today's actual date. */
  center?: string;
  /**
   * Disabled state for the next arrow, in place of the default week-based
   * computation (disabled once {@link date}'s week already contains today).
   */
  nextDisabled?: boolean;
  /** Accessible label for the previous arrow. Defaults to `"Previous week"`. */
  previousLabel?: string;
  /** Accessible label for the next arrow. Defaults to `"Next week"`. */
  nextLabel?: string;
}

/**
 * Navigation bar: a label on the left, and previous/next arrows around a
 * center label on the right. Defaults to week navigation — the
 * Monday–Sunday range of `date` on the left, and a clickable button showing
 * today's actual date in the center that jumps back to the current week;
 * the next arrow is disabled once `date`'s week already contains today,
 * since navigating into a future week is not allowed. Pass `label`,
 * `center`, and `nextDisabled` to reuse the same bar for other kinds of
 * navigation (e.g. by year).
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
  label,
  center,
  nextDisabled,
  previousLabel = "Previous week",
  nextLabel = "Next week",
}: DateNavProps): JSX.Element {
  const today = new Date();
  const isCurrentOrFutureWeek = toDateKey(getWeekDays(date)[0]) >= toDateKey(getWeekDays(today)[0]);

  return (
    <div className="date-nav">
      <Button.Transparent onClick={() => {}}>
        <Text.Mono>{label ?? convertDateToWeekRangeLabel(date)}</Text.Mono>
      </Button.Transparent>
      <div className="date-nav-controls">
        <Button.Naked variant="arrowL" label={previousLabel} onClick={() => onPrevious?.()} />
        <Button.Transparent onClick={() => onDateClick?.()}>
          <Text.Mono>{center ?? convertDateToTitle(today)}</Text.Mono>
        </Button.Transparent>
        <Button.Naked
          variant="arrowR"
          label={nextLabel}
          onClick={() => onNext?.()}
          disabled={nextDisabled ?? isCurrentOrFutureWeek}
        />
      </div>
    </div>
  );
}
