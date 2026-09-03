import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { HabitTable } from "./habit-table.component";

describe("HabitTable", () => {
  it("renders a row per habit with the week's day headers", () => {
    render(<HabitTable date={new Date(2026, 8, 3)} initialHabits={["Read", "Move"]} />);

    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.getByText("Move")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("toggles a past/today cell between empty and filled on click", () => {
    render(<HabitTable date={new Date(2026, 8, 3)} initialHabits={["Read"]} />);

    const cell = screen.getByRole("button", { name: "Read on 2026-09-01" });
    expect(cell).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(cell);
    expect(cell).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(cell);
    expect(cell).toHaveAttribute("aria-pressed", "false");
  });

  it("does not render a clickable cell for future days", () => {
    render(<HabitTable date={new Date(2026, 8, 3)} initialHabits={["Read"]} />);

    expect(screen.queryByRole("button", { name: "Read on 2026-09-06" })).not.toBeInTheDocument();
  });

  it("turns the row into an editable row when the label is clicked, and supports rename/move/delete", () => {
    render(<HabitTable date={new Date(2026, 8, 3)} initialHabits={["Read", "Move"]} />);

    fireEvent.click(screen.getByText("Read"));

    const input = screen.getByLabelText("Habit label");
    expect(input).toHaveValue("Read");

    fireEvent.change(input, { target: { value: "Reading" } });
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    expect(screen.getByText("Reading")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reading"));
    fireEvent.click(screen.getByRole("button", { name: "Move down" }));
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    const labels = screen.getAllByText(/^(Reading|Move)$/);
    expect(labels[0]).toHaveTextContent("Move");
    expect(labels[1]).toHaveTextContent("Reading");

    fireEvent.click(screen.getByText("Reading"));
    fireEvent.click(screen.getByRole("button", { name: "Delete habit" }));

    expect(screen.queryByText("Reading")).not.toBeInTheDocument();
  });

  it("discards the draft label when editing is cancelled", () => {
    render(<HabitTable date={new Date(2026, 8, 3)} initialHabits={["Read"]} />);

    fireEvent.click(screen.getByText("Read"));

    const input = screen.getByLabelText("Habit label");
    fireEvent.change(input, { target: { value: "Something else" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel editing" }));

    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.queryByText("Something else")).not.toBeInTheDocument();
  });
});
