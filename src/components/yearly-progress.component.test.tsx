import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { YearlyProgress } from "./yearly-progress.component";

describe("YearlyProgress", () => {
  it("renders 52 week cards with their date ranges", async () => {
    render(<YearlyProgress year={2026} today={new Date(2026, 8, 4)} />);

    expect(await screen.findByText("W01")).toBeInTheDocument();
    expect(screen.getByText("W52")).toBeInTheDocument();
    expect(screen.getByText("Dec 29 – Jan 4")).toBeInTheDocument();
  });

  it("outlines the card for the week containing today", async () => {
    render(<YearlyProgress year={2026} today={new Date(2026, 8, 4)} />);

    const currentWeekLabel = await screen.findByText("W36");
    const card = currentWeekLabel.closest(".yearly-progress-card");

    expect(card).toHaveClass("yearly-progress-card-current");
  });
});
