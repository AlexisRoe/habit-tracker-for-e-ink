import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import type { HabitWithCompletions } from "../hooks/use-habits.hook";
import { getWeekDays, toDateKey } from "../utils/date-converter.util";
import { HabitTable } from "./habit-table.component";

const weekDays = getWeekDays(new Date(2026, 8, 3));

function makeHabit(id: number, label: string, order: number): HabitWithCompletions {
  return { id, label, order, createdAt: 0, completions: new Set() };
}

function getHabitLabelInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector('input[aria-label="Habit label"]');
  expect(input).not.toBeNull();
  return input as HTMLInputElement;
}

/** Stateful wrapper so interaction tests (move/rename/toggle) reflect back into the table. */
function StatefulHabitTable({ initialHabits }: { initialHabits: HabitWithCompletions[] }) {
  const [habits, setHabits] = useState(initialHabits);

  function moveHabit(habitId: number, direction: -1 | 1): void {
    setHabits((current) => {
      const sorted = [...current].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((habit) => habit.id === habitId);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= sorted.length) return current;
      const orders = sorted.map((habit) => habit.order);
      [orders[index], orders[targetIndex]] = [orders[targetIndex], orders[index]];
      return sorted.map((habit, i) => ({ ...habit, order: orders[i] }));
    });
  }

  return (
    <HabitTable
      habits={[...habits].sort((a, b) => a.order - b.order)}
      weekDays={weekDays}
      onToggleCompletion={(habitId, dateKey) =>
        setHabits((current) =>
          current.map((habit) => {
            if (habit.id !== habitId) return habit;
            const completions = new Set(habit.completions);
            completions.has(dateKey) ? completions.delete(dateKey) : completions.add(dateKey);
            return { ...habit, completions };
          }),
        )
      }
      onRename={(habitId, label) =>
        setHabits((current) =>
          current.map((habit) => (habit.id === habitId ? { ...habit, label } : habit)),
        )
      }
      onArchive={(habitId) =>
        setHabits((current) => current.filter((habit) => habit.id !== habitId))
      }
      onMoveUp={(habitId) => moveHabit(habitId, -1)}
      onMoveDown={(habitId) => moveHabit(habitId, 1)}
    />
  );
}

describe("HabitTable", () => {
  it("renders a row per habit with the week's day headers", () => {
    render(
      <StatefulHabitTable initialHabits={[makeHabit(1, "Read", 0), makeHabit(2, "Move", 1)]} />,
    );

    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.getByText("Move")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("toggles a past/today cell between empty and filled on click", () => {
    render(<StatefulHabitTable initialHabits={[makeHabit(1, "Read", 0)]} />);

    const cell = screen.getByRole("button", { name: "Read on 2026-09-01" });
    const cellHost = cell.closest("e-button");
    expect(cellHost).not.toHaveClass("button-habit-filled");

    fireEvent.click(cell);
    expect(cellHost).toHaveClass("button-habit-filled");

    fireEvent.click(cell);
    expect(cellHost).not.toHaveClass("button-habit-filled");
  });

  it("does not render a clickable cell for future days", () => {
    render(<StatefulHabitTable initialHabits={[makeHabit(1, "Read", 0)]} />);

    expect(screen.queryByRole("button", { name: "Read on 2026-09-06" })).not.toBeInTheDocument();
  });

  it("can un-toggle an already-completed past day", () => {
    const habit: HabitWithCompletions = {
      ...makeHabit(1, "Read", 0),
      completions: new Set(["2026-09-01"]),
    };
    render(<StatefulHabitTable initialHabits={[habit]} />);

    const cell = screen.getByRole("button", { name: "Read on 2026-09-01" });
    const cellHost = cell.closest("e-button");
    expect(cellHost).toHaveClass("button-habit-filled");
    expect(cellHost).not.toBeDisabled();

    fireEvent.click(cell);

    expect(cellHost).not.toHaveClass("button-habit-filled");
  });

  it("locks a day before the habit's creation date, even if it has a stray completion", () => {
    const habit: HabitWithCompletions = {
      ...makeHabit(1, "Read", 0),
      createdAt: new Date(2026, 8, 3).getTime(),
      completions: new Set(["2026-09-01"]),
    };
    render(<StatefulHabitTable initialHabits={[habit]} />);

    expect(screen.queryByRole("button", { name: "Read on 2026-09-01" })).not.toBeInTheDocument();

    const lockedCell = screen
      .getAllByRole("button")
      .find((button) => button.closest("e-button")?.classList.contains("button-habit-locked"));
    expect(lockedCell).toBeDisabled();
  });

  it("turns the row into an editable row when the label is clicked, and supports rename/move/archive", async () => {
    const { container } = render(
      <StatefulHabitTable initialHabits={[makeHabit(1, "Read", 0), makeHabit(2, "Move", 1)]} />,
    );

    fireEvent.click(screen.getByText("Read"));

    const input = getHabitLabelInput(container);
    expect(input).toHaveValue("Read");

    fireEvent.input(input, { target: { value: "Reading" } });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    expect(screen.getByText("Reading")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reading"));
    fireEvent.click(screen.getByRole("button", { name: "Move down" }));
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    const labels = screen.getAllByText(/^(Reading|Move)$/);
    expect(labels[0]).toHaveTextContent("Move");
    expect(labels[1]).toHaveTextContent("Reading");

    fireEvent.click(screen.getByText("Reading"));
    fireEvent.click(screen.getByRole("button", { name: "Archive habit" }));

    expect(screen.queryByText("Reading")).not.toBeInTheDocument();
  });

  it("discards the draft label when editing is cancelled", async () => {
    const { container } = render(<StatefulHabitTable initialHabits={[makeHabit(1, "Read", 0)]} />);

    fireEvent.click(screen.getByText("Read"));

    const input = getHabitLabelInput(container);
    fireEvent.input(input, { target: { value: "Something else" } });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.click(screen.getByRole("button", { name: "Cancel editing" }));

    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.queryByText("Something else")).not.toBeInTheDocument();
  });

  it("calls onToggleCompletion with the habit id and date key", () => {
    const onToggleCompletion = vi.fn();
    render(
      <HabitTable
        habits={[makeHabit(1, "Read", 0)]}
        weekDays={weekDays}
        onToggleCompletion={onToggleCompletion}
        onRename={vi.fn()}
        onArchive={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Read on 2026-09-01" }));
    expect(onToggleCompletion).toHaveBeenCalledWith(1, toDateKey(weekDays[1]));
  });
});
