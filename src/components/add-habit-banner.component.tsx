import { type JSX, useState } from "react";

import { Icon } from "./icons.component";

import "./add-habit-banner.component.css";

/** Props for {@link AddHabitBanner}. */
interface AddHabitBannerProps {
  /** Called with the trimmed label when the user accepts the new habit. */
  onAdd: (label: string) => void;
  /** Hides the banner entirely when `true`. Defaults to `false`. */
  hidden?: boolean;
}

/**
 * Black banner pinned to the bottom of `Page.Content`. Shows an "Add Habit"
 * label and an add button; clicking the button turns the banner into an
 * inline form with a label input, an accept (check) button, and a cancel
 * button, mirroring the edit row in {@link HabitTable}.
 *
 * @example
 * ```tsx
 * <AddHabitBanner onAdd={addHabit} />
 * ```
 */
export function AddHabitBanner({ onAdd, hidden = false }: AddHabitBannerProps): JSX.Element | null {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");

  if (hidden) {
    return null;
  }

  function handleAccept(): void {
    const label = draftLabel.trim();
    if (label) {
      onAdd(label);
    }
    setDraftLabel("");
    setIsEditing(false);
  }

  function handleCancel(): void {
    setDraftLabel("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="add-habit-banner add-habit-banner-editing">
        <input
          className="add-habit-banner-input"
          type="text"
          value={draftLabel}
          onChange={(event) => setDraftLabel(event.target.value)}
          aria-label="Habit label"
        />
        <div className="add-habit-banner-actions">
          <button type="button" onClick={handleAccept} aria-label="Save habit">
            <Icon variant="check" label="" />
          </button>
          <button type="button" onClick={handleCancel} aria-label="Cancel adding habit">
            <Icon variant="close" label="" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-habit-banner">
      <span className="add-habit-banner-label">Add Habit</span>
      <button
        type="button"
        className="add-habit-banner-button"
        onClick={() => setIsEditing(true)}
        aria-label="Add habit"
      >
        <Icon variant="plus" label="Add habit" />
      </button>
    </div>
  );
}
