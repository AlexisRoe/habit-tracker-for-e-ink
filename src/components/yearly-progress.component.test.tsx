import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { db } from "../db/habit-tracker.db";
import { toDateKey } from "../utils/date-converter.util";
import { YearlyProgress } from "./yearly-progress.component";

beforeEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

afterEach(async () => {
  await db.habits.clear();
  await db.fulfillments.clear();
});

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

  it("renders a hatched circle for a week with no active habits", async () => {
    render(<YearlyProgress year={2026} today={new Date(2026, 8, 4)} />);

    const week1Label = await screen.findByText("W01");
    const card = week1Label.closest(".yearly-progress-card");

    expect(card?.querySelector(".yearly-progress-circle-hatched")).not.toBeNull();
  });

  it("renders a full-height fill for a fully-fulfilled week", async () => {
    const monday = new Date(2026, 7, 31); // week 36 starts Mon Aug 31
    const habitId = (await db.habits.add({
      label: "Read",
      order: 0,
      createdAt: monday.getTime(),
    })) as number;

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      await db.fulfillments.add({ habitId, date: toDateKey(day) });
    }

    render(<YearlyProgress year={2026} today={new Date(2026, 8, 10)} />);

    const week36Label = await screen.findByText("W36");
    const card = week36Label.closest(".yearly-progress-card");
    const fill = card?.querySelector(".yearly-progress-circle-fill") as HTMLElement;

    expect(fill.style.height).toBe("100%");
    expect(card?.querySelector(".yearly-progress-circle-hatched")).toBeNull();
  });
});
