/**
 * Get today's date string in Eastern timezone (YYYY-MM-DD).
 * Used for all day-boundary logic (daily chore resets, streak calculations).
 */
export function getToday(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}
