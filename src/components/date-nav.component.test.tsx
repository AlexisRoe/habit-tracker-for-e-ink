import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { DateNav } from "./date-nav.component";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 3));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("DateNav", () => {
  it("renders the week range and today's actual date", () => {
    render(<DateNav date={new Date(2026, 7, 10)} />);

    expect(screen.getByText("AUG 10 - 16")).toBeInTheDocument();
    expect(screen.getByText("Thu, Sep 3")).toBeInTheDocument();
  });

  it("calls onPrevious, onNext and onDateClick when clicked", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const onDateClick = vi.fn();

    render(
      <DateNav
        date={new Date(2026, 7, 10)}
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

  it("disables the next-week arrow once the viewed week contains today", () => {
    render(<DateNav date={new Date(2026, 8, 3)} />);

    expect(screen.getByRole("button", { name: "Next week" })).toBeDisabled();
  });

  it("keeps the next-week arrow enabled for a past week", () => {
    render(<DateNav date={new Date(2026, 7, 10)} />);

    expect(screen.getByRole("button", { name: "Next week" })).toBeEnabled();
  });
});
