import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { AddHabitBanner } from "./add-habit-banner.component";

describe("AddHabitBanner", () => {
  it("renders the label and add button", () => {
    render(<AddHabitBanner onAdd={vi.fn()} />);

    expect(screen.getByText("Add Habit")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add habit" })).toBeInTheDocument();
  });

  it("renders nothing when hidden", () => {
    const { container } = render(<AddHabitBanner onAdd={vi.fn()} hidden />);

    expect(container).toBeEmptyDOMElement();
  });

  it("switches to an input with accept/cancel buttons when the add button is clicked", () => {
    render(<AddHabitBanner onAdd={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));

    expect(screen.getByLabelText("Habit label")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save habit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel adding habit" })).toBeInTheDocument();
  });

  it("calls onAdd with the trimmed label and closes the form when accepted", () => {
    const onAdd = vi.fn();
    render(<AddHabitBanner onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));
    fireEvent.change(screen.getByLabelText("Habit label"), { target: { value: "  Read  " } });
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    expect(onAdd).toHaveBeenCalledWith("Read");
    expect(screen.queryByLabelText("Habit label")).not.toBeInTheDocument();
    expect(screen.getByText("Add Habit")).toBeInTheDocument();
  });

  it("does not call onAdd when accepting an empty label", () => {
    const onAdd = vi.fn();
    render(<AddHabitBanner onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.queryByLabelText("Habit label")).not.toBeInTheDocument();
  });

  it("discards the draft label and closes the form when cancelled", () => {
    const onAdd = vi.fn();
    render(<AddHabitBanner onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));
    fireEvent.change(screen.getByLabelText("Habit label"), { target: { value: "Read" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel adding habit" }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.queryByLabelText("Habit label")).not.toBeInTheDocument();
  });
});
