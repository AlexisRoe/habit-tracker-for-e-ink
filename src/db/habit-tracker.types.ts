/**
 * A single habit's identity and metadata, stored in the `habits` table.
 */
export interface Habit {
  /** Auto-incrementing primary key. Undefined until the record is first persisted. */
  id?: number;
  /** Display name of the habit. */
  label: string;
  /** Sort position among other habits, ascending. */
  order: number;
  /** Creation timestamp (Unix ms). */
  createdAt: number;
  /** Archival timestamp (Unix ms), or `undefined` while the habit is active. */
  archivedAt?: number;
}

/**
 * A single check-in event marking a {@link Habit} as fulfilled on a given
 * date, stored in the `fulfillments` table.
 */
export interface Fulfillment {
  /** Auto-incrementing primary key. Undefined until the record is first persisted. */
  id?: number;
  /** Foreign key referencing {@link Habit.id}. */
  habitId: number;
  /** Date of the check-in, formatted as `"YYYY-MM-DD"`. */
  date: string;
}
