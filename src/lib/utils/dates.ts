/**
 * Get today's date string in Eastern timezone (YYYY-MM-DD).
 * Used for all day-boundary logic (daily chore resets, streak calculations).
 */
export function getToday(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

/**
 * Get a date string N days ago from today in Eastern timezone.
 */
export function getDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}
