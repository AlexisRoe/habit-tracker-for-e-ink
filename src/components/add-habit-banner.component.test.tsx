import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { AddHabitBanner } from "./add-habit-banner.component";

function getHabitLabelInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector('input[aria-label="Habit label"]');
  expect(input).not.toBeNull();
  return input as HTMLInputElement;
}

describe("AddHabitBanner", () => {
  it("renders the label and add button", () => {
    render(<AddHabitBanner onAdd={vi.fn()} />);

    expect(screen.getByText("ADD HABIT")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add habit" })).toBeInTheDocument();
  });

  it("renders nothing when hidden", () => {
    const { container } = render(<AddHabitBanner onAdd={vi.fn()} hidden />);

    expect(container).toBeEmptyDOMElement();
  });

  it("switches to an input with accept/cancel buttons when the add button is clicked", () => {
    const { container } = render(<AddHabitBanner onAdd={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));

    expect(getHabitLabelInput(container)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save habit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel adding habit" })).toBeInTheDocument();
  });

  it("calls onAdd with the trimmed label and closes the form when accepted", async () => {
    const onAdd = vi.fn();
    const { container } = render(<AddHabitBanner onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));
    fireEvent.input(getHabitLabelInput(container), { target: { value: "  Read  " } });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    expect(onAdd).toHaveBeenCalledWith("Read");
    expect(container.querySelector('input[aria-label="Habit label"]')).not.toBeInTheDocument();
    expect(screen.getByText("ADD HABIT")).toBeInTheDocument();
  });

  it("does not call onAdd when accepting an empty label", () => {
    const onAdd = vi.fn();
    const { container } = render(<AddHabitBanner onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));
    fireEvent.click(screen.getByRole("button", { name: "Save habit" }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(container.querySelector('input[aria-label="Habit label"]')).not.toBeInTheDocument();
  });

  it("discards the draft label and closes the form when cancelled", async () => {
    const onAdd = vi.fn();
    const { container } = render(<AddHabitBanner onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));
    fireEvent.input(getHabitLabelInput(container), { target: { value: "Read" } });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.click(screen.getByRole("button", { name: "Cancel adding habit" }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(container.querySelector('input[aria-label="Habit label"]')).not.toBeInTheDocument();
  });
});
