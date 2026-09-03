export function convertDateToTitle(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats the Monday–Sunday week containing `date` as an uppercase range
 * label, e.g. `"AUG 31 - SEP 6"`.
 */
export function convertDateToWeekRangeLabel(date: Date = new Date()): string {
  const diffToMonday = (date.getDay() + 6) % 7;
  const start = new Date(date);
  start.setDate(date.getDate() - diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel =
    start.getMonth() === end.getMonth()
      ? end.toLocaleDateString("en-US", { day: "numeric" })
      : end.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${startLabel} - ${endLabel}`.toUpperCase();
}

/**
 * Returns the seven `Date`s (Monday–Sunday) of the week containing `date`.
 */
export function getWeekDays(date: Date = new Date()): Date[] {
  const diffToMonday = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });
}

/**
 * Formats `date` as a local `"YYYY-MM-DD"` key, suitable for use as a map key
 * independent of time-of-day.
 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Whether `date` falls strictly after today (time-of-day ignored).
 */
export function isFutureDate(date: Date, today: Date = new Date()): boolean {
  return toDateKey(date) > toDateKey(today);
}
