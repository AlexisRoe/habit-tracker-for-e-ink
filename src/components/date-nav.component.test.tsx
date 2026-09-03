import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { DateNav } from "./date-nav.component";

describe("DateNav", () => {
  it("renders the week range and the current date", () => {
    render(<DateNav date={new Date(2026, 8, 3)} />);

    expect(screen.getByText("AUG 31 - SEP 6")).toBeInTheDocument();
    expect(screen.getByText("Thu, Sep 3")).toBeInTheDocument();
  });

  it("calls onPrevious, onNext and onDateClick when clicked", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const onDateClick = vi.fn();

    render(
      <DateNav
        date={new Date(2026, 8, 3)}
        onPrevious={onPrevious}
        onNext={onNext}
        onDateClick={onDateClick}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous week" }));
    fireEvent.click(screen.getByRole("button", { name: "Next week" }));
    fireEvent.click(screen.getByText("Thu, Sep 3"));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onDateClick).toHaveBeenCalledTimes(1);
  });
});
