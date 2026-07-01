/** Small date helpers. All keys are computed in the user's local timezone. */

/** Local YYYY-MM-DD for a given Date (defaults to now). */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** The day key immediately before the given one. */
export function previousDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return dayKey(date);
}

/** Whole-day difference `a - b` (both YYYY-MM-DD). Positive when a is later. */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((da - db) / 86_400_000);
}

/** Three phases of the day the UI switches between. */
export type DayPhase = "morning" | "day" | "evening";

/**
 * Which phase a given hour falls into.
 *   morning  : 00:00–10:59  → "What's today?"
 *   day      : 11:00–17:59  → checklist + progress
 *   evening  : 18:00–23:59  → summary / wrap-up
 */
export function phaseForHour(hour: number): DayPhase {
  if (hour < 11) return "morning";
  if (hour < 18) return "day";
  return "evening";
}
