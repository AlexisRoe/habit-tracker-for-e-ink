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
