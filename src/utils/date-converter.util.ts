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

/**
 * Whether `date` falls strictly before `referenceDate` (time-of-day ignored).
 */
export function isBeforeDate(date: Date, referenceDate: Date): boolean {
  return toDateKey(date) < toDateKey(referenceDate);
}

/**
 * Returns the Monday–Sunday weeks of `year`, each as its 7 `Date`s, starting
 * from the Monday of the week containing January 1st and continuing through
 * the week containing December 31st (52 or 53 weeks, depending on the year).
 */
export function getWeeksOfYear(year: number): Date[][] {
  const [firstMonday] = getWeekDays(new Date(year, 0, 1));
  const lastDay = new Date(year, 11, 31);

  const weeks: Date[][] = [];
  let monday = firstMonday;
  while (monday <= lastDay) {
    weeks.push(getWeekDays(monday));
    monday = new Date(monday);
    monday.setDate(monday.getDate() + 7);
  }

  return weeks;
}

/**
 * Formats a Monday–Sunday week (as returned by {@link getWeekDays}) as a
 * range label, e.g. `"Dec 29 – Jan 4"`.
 */
export function formatWeekRange(weekDays: Date[]): string {
  const [start, end] = [weekDays[0], weekDays[weekDays.length - 1]];

  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel =
    start.getMonth() === end.getMonth()
      ? end.toLocaleDateString("en-US", { day: "numeric" })
      : end.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${startLabel} – ${endLabel}`;
}
