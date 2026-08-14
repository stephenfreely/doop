/**
 * Start of the current local week (Monday 00:00).
 * Used for "this week" statistics on the Home screen.
 */
export function getStartOfWeek(now: Date = new Date()): Date {
  const date = new Date(now);
  const day = date.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? 6 : day - 1;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - diffToMonday);
  return date;
}

export function isWithinCurrentWeek(
  isoDate: string,
  now: Date = new Date(),
): boolean {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date >= getStartOfWeek(now) && date <= now;
}
