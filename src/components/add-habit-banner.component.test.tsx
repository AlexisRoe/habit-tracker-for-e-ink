import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { AddHabitBanner } from "./add-habit-banner.component";

describe("AddHabitBanner", () => {
  it("renders the label and calls onAdd when clicked", () => {
    const onAdd = vi.fn();
    render(<AddHabitBanner onAdd={onAdd} />);

    expect(screen.getByText("Add Habit")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when hidden", () => {
    const { container } = render(<AddHabitBanner onAdd={vi.fn()} hidden />);

    expect(container).toBeEmptyDOMElement();
  });
});
