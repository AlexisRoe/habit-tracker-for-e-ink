import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { db } from "../db/habit-tracker.db";
import { DashboardView } from "./dashboard.view";

beforeEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

afterEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

describe("DashboardView", () => {
  it("shows the empty state when there are no habits", async () => {
    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText("... no habit yet ...")).toBeInTheDocument());
  });

  it("shows the habit table once habits exist", async () => {
    await db.habits.add({ label: "Read", order: 0, createdAt: Date.now() });

    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText("Read")).toBeInTheDocument());
    expect(screen.queryByText("... no habit yet ...")).not.toBeInTheDocument();
  });
});
