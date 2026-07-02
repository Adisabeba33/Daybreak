/**
 * Daybreak data model.
 *
 * Designed once, for the whole roadmap. Phase 1 (MVP) only ever creates and
 * reads Plans with `period: "day"`, but the shape already supports week/month
 * and richer task metadata so those features light up without a migration.
 */

/** Where a task is in its lifecycle. */
export type TaskStatus = "todo" | "doing" | "done";

/** Coarse priority. `none` is the default so quick entry stays frictionless. */
export type TaskPriority = "none" | "low" | "medium" | "high";

/**
 * The single knob that turns "plan my day" into "plan my week/month".
 * Day/week/month are NOT three features — they are one feature parameterised
 * by `period`. MVP ships `day` only.
 */
export type PlanPeriod = "day" | "week" | "month";

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** Optional self-estimate in minutes. */
  estimateMinutes?: number;
  /** Optional short note / detail (address, sizes, what to buy…). */
  note?: string;
  /** Id of an attached voice note (stored in IndexedDB via audioStore). */
  voiceNoteId?: string;
  /** Duration of the attached voice note, in seconds. */
  voiceDurationSec?: number;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of the last status change to `done`, if any. */
  completedAt?: string;
  /**
   * If this task was carried over from an earlier plan, the id of the plan it
   * originated in. Lets us show "moved from yesterday" and avoid double counting.
   */
  carriedFromPlanId?: string;
}

export interface Plan {
  id: string;
  period: PlanPeriod;
  /**
   * The calendar key this plan belongs to.
   * - day:   YYYY-MM-DD
   * - week:  YYYY-Www (ISO week)
   * - month: YYYY-MM
   */
  dateKey: string;
  tasks: Task[];
  createdAt: string;
  /** Set once the user closes out the plan (sees the evening summary). */
  reviewedAt?: string;
}

/**
 * Derived view over a plan's tasks. Never stored — computed on demand so it
 * can never drift from the task list.
 */
export interface Progress {
  total: number;
  done: number;
  /** 0..1 fraction complete. 0 when there are no tasks. */
  ratio: number;
}

/**
 * Persisted habit metadata, independent of any single plan.
 * `history` is the append-only record the streak is derived from.
 */
export interface StreakState {
  /** Current consecutive-day streak. */
  current: number;
  /** Best streak ever reached. */
  longest: number;
  /** dateKey (YYYY-MM-DD) of the most recent day that counted toward the streak. */
  lastActiveDateKey?: string;
}

/** One entry per completed day, used for history and the streak. */
export interface DayRecord {
  dateKey: string;
  total: number;
  done: number;
}

/** The whole persisted app state. One JSON blob in localStorage for MVP. */
export interface AppState {
  version: number;
  plans: Plan[];
  streak: StreakState;
  history: DayRecord[];
}
