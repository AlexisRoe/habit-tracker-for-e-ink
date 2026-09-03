import type { JSX } from "react";

import { Icon } from "./icons.component";

import "./add-habit-banner.component.css";

/** Props for {@link AddHabitBanner}. */
interface AddHabitBannerProps {
  /** Called when the add button is clicked. */
  onAdd: () => void;
  /** Hides the banner entirely when `true`. Defaults to `false`. */
  hidden?: boolean;
}

/**
 * Black banner pinned to the bottom of `Page.Content`, showing an "Add Habit"
 * label and an add button, space-between.
 *
 * @example
 * ```tsx
 * <AddHabitBanner onAdd={openAddHabitDialog} />
 * ```
 */
export function AddHabitBanner({ onAdd, hidden = false }: AddHabitBannerProps): JSX.Element | null {
  if (hidden) {
    return null;
  }

  return (
    <div className="add-habit-banner">
      <span className="add-habit-banner-label">Add Habit</span>
      <button
        type="button"
        className="add-habit-banner-button"
        onClick={onAdd}
        aria-label="Add habit"
      >
        <Icon variant="plus" label="Add habit" />
      </button>
    </div>
  );
}
