import { type JSX, useState } from "react";

import type { HabitWithCompletions } from "../hooks/use-habits.hook";
import { isBeforeDate, isFutureDate, toDateKey } from "../utils/date-converter.util";
import { Button } from "./button.component";
import { Input } from "./input.component";
import { Text } from "./text.component";

import "./habit-table.component.css";

const DAY_ABBREVIATIONS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

/** Props for {@link HabitTable}. */
interface HabitTableProps {
  /** Active habits, in display order, with their completions for `weekDays`. */
  habits: HabitWithCompletions[];
  /** The Monday–Sunday week shown as columns. */
  weekDays: Date[];
  /** Toggles a habit's completion for the given date key (`"YYYY-MM-DD"`). */
  onToggleCompletion: (habitId: number, dateKey: string) => void;
  /** Renames a habit. */
  onRename: (habitId: number, label: string) => void;
  /** Archives a habit. */
  onArchive: (habitId: number) => void;
  /** Moves a habit up by one position. */
  onMoveUp: (habitId: number) => void;
  /** Moves a habit down by one position. */
  onMoveDown: (habitId: number) => void;
}

/**
 * Table of active habits versus the days of a week. Each cell is a circle
 * that can be toggled between empty and filled for today or past days;
 * days before the habit existed render as a fixed, non-interactive
 * diagonally-hatched circle, and future days render as a fixed,
 * non-interactive empty circle. Clicking a habit's label turns its row into an editable black row for
 * renaming, reordering, or archiving the habit.
 *
 * @example
 * ```tsx
 * <HabitTable habits={habits} weekDays={weekDays} onToggleCompletion={toggleFulfillment} ... />
 * ```
 */
export function HabitTable({
  habits,
  weekDays,
  onToggleCompletion,
  onRename,
  onArchive,
  onMoveUp,
  onMoveDown,
}: HabitTableProps): JSX.Element {
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const today = new Date();

  return (
    <div className="habit-table">
      <div className="habit-table-row habit-table-header">
        <div className="habit-table-label-col" />
        {weekDays.map((day) => (
          <div className="habit-table-day-col" key={toDateKey(day)}>
            <Text.Label>{DAY_ABBREVIATIONS[(day.getDay() + 6) % 7]}</Text.Label>
            <Text.Mono>{String(day.getDate())}</Text.Mono>
          </div>
        ))}
      </div>

      {habits.map((habit, index) =>
        editingHabitId === habit.id ? (
          <HabitEditRow
            key={habit.id}
            habit={habit}
            canMoveUp={index > 0}
            canMoveDown={index < habits.length - 1}
            onSave={(label) => {
              onRename(habit.id, label);
              setEditingHabitId(null);
            }}
            onCancel={() => setEditingHabitId(null)}
            onArchive={() => {
              onArchive(habit.id);
              setEditingHabitId(null);
            }}
            onMoveUp={() => onMoveUp(habit.id)}
            onMoveDown={() => onMoveDown(habit.id)}
          />
        ) : (
          <HabitRow
            key={habit.id}
            habit={habit}
            weekDays={weekDays}
            today={today}
            onLabelClick={() => setEditingHabitId(habit.id)}
            onToggleCompletion={(dateKey) => onToggleCompletion(habit.id, dateKey)}
          />
        ),
      )}
    </div>
  );
}

interface HabitRowProps {
  habit: HabitWithCompletions;
  weekDays: Date[];
  today: Date;
  onLabelClick: () => void;
  onToggleCompletion: (dateKey: string) => void;
}

function HabitRow({
  habit,
  weekDays,
  today,
  onLabelClick,
  onToggleCompletion,
}: HabitRowProps): JSX.Element {
  return (
    <div className="habit-table-row">
      <div className="habit-table-label-col">
        <Button.Transparent onClick={onLabelClick} className="habit-table-label-button">
          <Text className="habit-table-label">{habit.label}</Text>
        </Button.Transparent>
      </div>
      {weekDays.map((day) => {
        const dateKey = toDateKey(day);
        // Hatched and locked when before the habit existed; empty and locked when in
        // the future; otherwise editable, filled if completed, empty otherwise.
        const isFuture = isFutureDate(day, today);
        const isLocked = isBeforeDate(day, new Date(habit.createdAt));
        const completed = habit.completions.has(dateKey);

        return (
          <div className="habit-table-day-col" key={dateKey}>
            <Button.Habit
              completed={completed}
              locked={isLocked}
              future={isFuture}
              label={`${habit.label} on ${dateKey}`}
              onClick={() => onToggleCompletion(dateKey)}
            />
          </div>
        );
      })}
    </div>
  );
}

interface HabitEditRowProps {
  habit: HabitWithCompletions;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSave: (label: string) => void;
  onCancel: () => void;
  onArchive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function HabitEditRow({
  habit,
  canMoveUp,
  canMoveDown,
  onSave,
  onCancel,
  onArchive,
  onMoveUp,
  onMoveDown,
}: HabitEditRowProps): JSX.Element {
  const [draftLabel, setDraftLabel] = useState(habit.label);

  return (
    <div className="habit-table-row habit-table-row-editing">
      <Input
        className="habit-table-edit-input"
        ariaLabel="Habit label"
        initialValue={draftLabel}
        onDebouncedChange={setDraftLabel}
        debounceMs={0}
      />
      <div className="habit-table-edit-actions">
        <div className="habit-table-edit-action-group">
          <Button.Naked
            variant="chevR"
            label="Move up"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="habit-table-icon-rotate-up"
          />
          <Button.Naked
            variant="chevR"
            label="Move down"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="habit-table-icon-rotate-down"
          />
        </div>
        <div className="habit-table-edit-action-group">
          <Button.Naked variant="check" label="Save habit" onClick={() => onSave(draftLabel)} />
          <Button.Naked variant="close" label="Cancel editing" onClick={onCancel} />
          <Button.Naked variant="trash" label="Archive habit" onClick={onArchive} />
        </div>
      </div>
    </div>
  );
}
