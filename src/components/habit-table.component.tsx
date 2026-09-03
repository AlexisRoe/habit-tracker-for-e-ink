import { type JSX, useState } from "react";

import { getWeekDays, isFutureDate, toDateKey } from "../utils/date-converter.util";
import { Icon } from "./icons.component";

import "./habit-table.component.css";

/** A single habit tracked across days, with its per-day completion state. */
interface Habit {
  /** Unique identifier, generated via `crypto.randomUUID()`. */
  id: string;
  /** Display label. */
  label: string;
  /** Set of `"YYYY-MM-DD"` date keys on which the habit was completed. */
  completions: Set<string>;
}

const DEFAULT_HABIT_LABELS = ["Read", "Move", "Sit quietly", "Write", "Lights out by 11"];

const DAY_ABBREVIATIONS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

function createHabit(label: string): Habit {
  return { id: crypto.randomUUID(), label, completions: new Set() };
}

/** Props for {@link HabitTable}. */
interface HabitTableProps {
  /** Reference date whose Monday–Sunday week is shown as columns. Defaults to today. */
  date?: Date;
  /** Initial habit labels to seed the table with. */
  initialHabits?: string[];
}

/**
 * Table of habits versus the days of a week. Each cell is a circle that can
 * be toggled between empty and filled for today or past days; future days
 * render as a fixed, non-interactive diagonally-hatched circle. Clicking a
 * habit's label turns its row into an editable black row for renaming,
 * reordering, or deleting the habit.
 *
 * @example
 * ```tsx
 * <HabitTable date={selectedDate} />
 * ```
 */
export function HabitTable({
  date = new Date(),
  initialHabits = DEFAULT_HABIT_LABELS,
}: HabitTableProps): JSX.Element {
  const [habits, setHabits] = useState<Habit[]>(() => initialHabits.map(createHabit));
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  const weekDays = getWeekDays(date);
  const today = new Date();

  function toggleCompletion(habitId: string, dateKey: string): void {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) return habit;

        const completions = new Set(habit.completions);
        if (completions.has(dateKey)) {
          completions.delete(dateKey);
        } else {
          completions.add(dateKey);
        }
        return { ...habit, completions };
      }),
    );
  }

  function renameHabit(habitId: string, label: string): void {
    setHabits((current) =>
      current.map((habit) => (habit.id === habitId ? { ...habit, label } : habit)),
    );
  }

  function deleteHabit(habitId: string): void {
    setHabits((current) => current.filter((habit) => habit.id !== habitId));
    setEditingHabitId(null);
  }

  function moveHabit(habitId: string, direction: -1 | 1): void {
    setHabits((current) => {
      const index = current.findIndex((habit) => habit.id === habitId);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

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
              renameHabit(habit.id, label);
              setEditingHabitId(null);
            }}
            onCancel={() => setEditingHabitId(null)}
            onDelete={() => deleteHabit(habit.id)}
            onMoveUp={() => moveHabit(habit.id, -1)}
            onMoveDown={() => moveHabit(habit.id, 1)}
          />
        ) : (
          <HabitRow
            key={habit.id}
            habit={habit}
            weekDays={weekDays}
            today={today}
            onLabelClick={() => setEditingHabitId(habit.id)}
            onToggleCompletion={(dateKey) => toggleCompletion(habit.id, dateKey)}
          />
        ),
      )}
    </div>
  );
}

interface HabitRowProps {
  habit: Habit;
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

        if (isFutureDate(day, today)) {
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
  habit: Habit;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSave: (label: string) => void;
  onCancel: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function HabitEditRow({
  habit,
  canMoveUp,
  canMoveDown,
  onSave,
  onCancel,
  onDelete,
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
          <button type="button" onClick={onDelete} aria-label="Delete habit">
            <Icon variant="trash" label="" />
          </button>
        </div>
      </div>
    </div>
  );
}
