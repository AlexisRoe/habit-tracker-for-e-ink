import { type JSX, useState } from "react";

import { Button } from "./button.component";
import { Input } from "./input.component";
import { Text } from "./text.component";

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
        <Input
          className="add-habit-banner-input"
          ariaLabel="Habit label"
          onDebouncedChange={setDraftLabel}
          debounceMs={0}
        />
        <div className="add-habit-banner-actions">
          <Button.Naked
            variant="check"
            label="Save habit"
            onClick={handleAccept}
            className="add-habit-banner-action-button"
          />
          <Button.Naked
            variant="close"
            label="Cancel adding habit"
            onClick={handleCancel}
            className="add-habit-banner-action-button"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="add-habit-banner">
      <Text.Label>Add Habit</Text.Label>
      <Button.Naked
        variant="plus"
        label="Add habit"
        size="16"
        onClick={() => setIsEditing(true)}
        className="add-habit-banner-button"
      />
    </div>
  );
}
