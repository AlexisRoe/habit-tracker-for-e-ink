import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { YearlyView } from "./yearly.view";

describe("YearlyView", () => {
  it("renders the page title, nav and yearly progress for the current year", () => {
    render(
      <MemoryRouter>
        <YearlyView />
      </MemoryRouter>,
    );

    expect(screen.getByText("HabitTracker")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument();
  });
});
