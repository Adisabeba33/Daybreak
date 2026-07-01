import type { Progress } from "../types";

/**
 * Encouragement copy. In MVP this is a small deterministic table that praises
 * the *act* of progress, not only 100%. Phase 2 swaps this out for LLM-generated
 * lines so the tone never feels templated — the call site just needs a string,
 * so that upgrade is drop-in.
 */

/** A short line for the day view, tuned to how far along the user is. */
export function dayEncouragement(progress: Progress): string {
  const { done, total, ratio } = progress;
  if (total === 0) return "Add a task to get started 🌱";
  if (done === 0) return "First check is the hardest — pick one 💪";
  if (ratio >= 1) return "Everything done. Beautiful day 🎉";
  if (ratio >= 0.5) return "Over halfway — keep the momentum 🔥";
  return "Nice, you're moving — one at a time 👏";
}

/** The evening wrap-up line, e.g. "Done 5 of 7 — great going 🎉". */
export function eveningSummary(progress: Progress): string {
  const { done, total } = progress;
  if (total === 0) return "No plan today — tomorrow's a fresh start 🌅";
  if (done === 0) return `Nothing checked off today. That's ok — tomorrow's a new sunrise 🌅`;
  if (done === total) return `All ${total} done — what a day! 🎉`;
  if (done >= total / 2) return `Done ${done} of ${total} — great going 🎉`;
  return `Done ${done} of ${total} — every step counts 🌱`;
}

/** A streak nudge shown alongside the summary. */
export function streakLine(streak: number): string {
  if (streak <= 0) return "Start a streak today 🌅";
  if (streak === 1) return "Day 1 — a streak is born 🔥";
  return `${streak}-day streak — don't break the chain 🔥`;
}
