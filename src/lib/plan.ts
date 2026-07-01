import type {
  DayRecord,
  Plan,
  PlanPeriod,
  Progress,
  StreakState,
  Task,
} from "../types";
import { dayKey, daysBetween } from "./date";

/**
 * Pure domain logic for Daybreak. No storage, no React — just data in, data out,
 * so every rule here is unit-testable in isolation.
 */

let idCounter = 0;
/** Best-effort unique id. Deterministic ordering, unique within a session. */
function makeId(prefix: string): string {
  idCounter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${idCounter}_${rand}`;
}

export function createTask(
  text: string,
  opts: Partial<Pick<Task, "priority" | "estimateMinutes">> = {},
  now: Date = new Date(),
): Task {
  return {
    id: makeId("task"),
    text: text.trim(),
    status: "todo",
    priority: opts.priority ?? "none",
    estimateMinutes: opts.estimateMinutes,
    createdAt: now.toISOString(),
  };
}

export function createPlan(
  period: PlanPeriod,
  dateKey: string,
  now: Date = new Date(),
): Plan {
  return {
    id: makeId("plan"),
    period,
    dateKey,
    tasks: [],
    createdAt: now.toISOString(),
  };
}

/** Compute progress over a plan's tasks. Never throws; empty plan → ratio 0. */
export function computeProgress(plan: Plan): Progress {
  const total = plan.tasks.length;
  const done = plan.tasks.filter((t) => t.status === "done").length;
  return { total, done, ratio: total === 0 ? 0 : done / total };
}

/** Toggle a task between done and todo, stamping/clearing completedAt. */
export function toggleTask(task: Task, now: Date = new Date()): Task {
  if (task.status === "done") {
    const { completedAt: _drop, ...rest } = task;
    return { ...rest, status: "todo" };
  }
  return { ...task, status: "done", completedAt: now.toISOString() };
}

/**
 * Build the carry-over tasks for a new plan from the previous plan's
 * unfinished work. Each carried task is a fresh task (new id, todo status)
 * that remembers where it came from.
 */
export function carryOverTasks(
  previous: Plan | undefined,
  now: Date = new Date(),
): Task[] {
  if (!previous) return [];
  return previous.tasks
    .filter((t) => t.status !== "done")
    .map((t) => ({
      ...createTask(t.text, { priority: t.priority, estimateMinutes: t.estimateMinutes }, now),
      carriedFromPlanId: previous.id,
    }));
}

/**
 * A day "counts" toward the streak once at least one task was completed.
 * Rewarding the act, not perfection (per the product brief).
 */
export function dayCounts(record: Pick<DayRecord, "done">): boolean {
  return record.done > 0;
}

/**
 * Fold a freshly-finished day into the streak state.
 *
 * Rules:
 *  - A day only counts if the user actually did something (`dayCounts`).
 *  - Consecutive counting days extend the streak; a gap resets it to 1.
 *  - Re-recording the same day is idempotent (no double increment).
 */
export function updateStreak(
  streak: StreakState,
  record: DayRecord,
): StreakState {
  if (!dayCounts(record)) return streak;

  // Idempotent: same day already recorded.
  if (streak.lastActiveDateKey === record.dateKey) return streak;

  let current: number;
  if (!streak.lastActiveDateKey) {
    current = 1;
  } else {
    const gap = daysBetween(record.dateKey, streak.lastActiveDateKey);
    current = gap === 1 ? streak.current + 1 : 1;
  }

  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDateKey: record.dateKey,
  };
}

/**
 * If the last active day is more than one day in the past relative to `today`,
 * the streak has been broken. Used to show an honest current streak without
 * waiting for the user to complete a task.
 */
export function effectiveStreak(streak: StreakState, today: string = dayKey()): number {
  if (!streak.lastActiveDateKey) return 0;
  const gap = daysBetween(today, streak.lastActiveDateKey);
  if (gap <= 0) return streak.current; // today already counted, or clock skew
  if (gap === 1) return streak.current; // yesterday counted, today still open
  return 0; // missed a day
}
