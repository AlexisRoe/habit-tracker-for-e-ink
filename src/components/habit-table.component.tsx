import { type JSX, useState } from "react";

import type { HabitWithCompletions } from "../hooks/use-habits.hook";
import { isBeforeDate, isFutureDate, toDateKey } from "../utils/date-converter.util";
import { Icon } from "./icons.component";

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
 * future days render as a fixed, non-interactive diagonally-hatched circle.
 * Clicking a habit's label turns its row into an editable black row for
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
            <span className="habit-table-day-abbr">
              {DAY_ABBREVIATIONS[(day.getDay() + 6) % 7]}
            </span>
            <span className="habit-table-day-num">{day.getDate()}</span>
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
      <button
        type="button"
        className="habit-table-label-col habit-table-label-button"
        onClick={onLabelClick}
      >
        <span className="habit-table-label">{habit.label}</span>
      </button>
      {weekDays.map((day) => {
        const dateKey = toDateKey(day);

        if (isFutureDate(day, today) || isBeforeDate(day, new Date(habit.createdAt))) {
          return <div className="habit-table-day-col habit-cell habit-cell-future" key={dateKey} />;
        }

        const completed = habit.completions.has(dateKey);
        return (
          <div className="habit-table-day-col" key={dateKey}>
            <button
              type="button"
              className={completed ? "habit-cell habit-cell-filled" : "habit-cell"}
              aria-pressed={completed}
              aria-label={`${habit.label} on ${dateKey}`}
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
      <input
        className="habit-table-edit-input"
        type="text"
        value={draftLabel}
        onChange={(event) => setDraftLabel(event.target.value)}
        aria-label="Habit label"
      />
      <div className="habit-table-edit-actions">
        <div className="habit-table-edit-action-group">
          <button type="button" onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move up">
            <span className="habit-table-icon-rotate-up">
              <Icon variant="chevR" label="" />
            </span>
          </button>
          <button type="button" onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move down">
            <span className="habit-table-icon-rotate-down">
              <Icon variant="chevR" label="" />
            </span>
          </button>
        </div>
        <div className="habit-table-edit-action-group">
          <button type="button" onClick={() => onSave(draftLabel)} aria-label="Save habit">
            <Icon variant="check" label="" />
          </button>
          <button type="button" onClick={onCancel} aria-label="Cancel editing">
            <Icon variant="close" label="" />
          </button>
          <button type="button" onClick={onArchive} aria-label="Archive habit">
            <Icon variant="trash" label="" />
          </button>
        </div>
      </div>
    </div>
  );
}
