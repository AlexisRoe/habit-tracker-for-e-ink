import Dexie, { type EntityTable } from "dexie";
import type { Fulfillment, Habit } from "./habit-tracker.types";

/**
 * Local-first IndexedDB database for the habit tracker, accessed via Dexie.
 * Holds two tables: `habits` (habit identity & metadata) and `fulfillments`
 * (per-day check-in events for each habit).
 */
const db = new Dexie("HabitTrackerDB") as Dexie & {
  /** Habit identity & metadata. Indexed on `label`, `order`, `createdAt`, `archivedAt`. */
  habits: EntityTable<Habit, "id">;
  /**
   * Per-day check-in events. Indexed on `habitId`, `date`, and the compound
   * `[habitId+date]` index for fast lookup of a specific habit on a specific day.
   */
  fulfillments: EntityTable<Fulfillment, "id">;
};

db.version(1).stores({
  habits: "++id, label, createdAt, archivedAt",
  fulfillments: "++id, habitId, date, [habitId+date]",
});

db.version(2).stores({
  habits: "++id, label, order, createdAt, archivedAt",
});

export { db };
