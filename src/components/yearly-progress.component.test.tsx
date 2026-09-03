import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { YearlyProgress } from "./yearly-progress.component";

describe("YearlyProgress", () => {
  it("renders 52 week cards with their date ranges", () => {
    render(<YearlyProgress year={2026} today={new Date(2026, 8, 4)} />);

    expect(screen.getByText("W01")).toBeInTheDocument();
    expect(screen.getByText("W52")).toBeInTheDocument();
    expect(screen.getByText("Dec 29 – Jan 4")).toBeInTheDocument();
  });

  it("navigates to the previous/next year via the arrow buttons", () => {
    const onPreviousYear = vi.fn();
    const onNextYear = vi.fn();
    render(
      <YearlyProgress
        year={2025}
        today={new Date(2026, 8, 4)}
        onPreviousYear={onPreviousYear}
        onNextYear={onNextYear}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous year" }));
    fireEvent.click(screen.getByRole("button", { name: "Next year" }));

    expect(onPreviousYear).toHaveBeenCalledTimes(1);
    expect(onNextYear).toHaveBeenCalledTimes(1);
  });

  it("disables the next-year arrow once the current year is displayed", () => {
    const today = new Date(2026, 8, 4);
    render(<YearlyProgress year={2026} today={today} />);
    expect(screen.getByRole("button", { name: "Next year" })).toBeDisabled();

    render(<YearlyProgress year={2025} today={today} />);
    expect(screen.getAllByRole("button", { name: "Next year" })[1]).not.toBeDisabled();
  });

  it("outlines the card for the week containing today", () => {
    render(<YearlyProgress year={2026} today={new Date(2026, 8, 4)} />);

    const currentWeekLabel = screen.getByText("W36");
    const card = currentWeekLabel.closest(".yearly-progress-card");

    expect(card).toHaveClass("yearly-progress-card-current");
  });
});
