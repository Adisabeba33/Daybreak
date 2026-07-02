import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppState, Plan, Task, TaskPriority } from "../types";
import { dayKey, previousDayKey } from "../lib/date";
import {
  carryOverTasks,
  computeProgress,
  createPlan,
  createTask,
  toggleTask,
  updateStreak,
} from "../lib/plan";
import { emptyState, loadState, saveState } from "../lib/storage";

/**
 * The one stateful hook the UI talks to. Owns the persisted AppState and
 * exposes today's day-plan plus the actions that mutate it. Everything it does
 * is composed from the pure helpers in lib/, so the rules stay testable.
 */
export function usePlan(now: Date = new Date()) {
  const today = dayKey(now);
  const [state, setState] = useState<AppState>(() => loadState());

  // Persist on every change.
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Ensure a plan exists for today, carrying over yesterday's unfinished tasks.
  useEffect(() => {
    setState((prev) => {
      if (prev.plans.some((p) => p.period === "day" && p.dateKey === today)) {
        return prev;
      }
      const yesterday = previousDayKey(today);
      const prevPlan = prev.plans.find(
        (p) => p.period === "day" && p.dateKey === yesterday,
      );
      const plan = createPlan("day", today, now);
      plan.tasks = carryOverTasks(prevPlan, now);
      return { ...prev, plans: [...prev.plans, plan] };
    });
    // Only re-run when the calendar day changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const todayPlan: Plan | undefined = useMemo(
    () => state.plans.find((p) => p.period === "day" && p.dateKey === today),
    [state.plans, today],
  );

  const progress = useMemo(
    () => (todayPlan ? computeProgress(todayPlan) : { total: 0, done: 0, ratio: 0 }),
    [todayPlan],
  );

  const mutateToday = useCallback(
    (fn: (tasks: Task[]) => Task[]) => {
      setState((prev) => ({
        ...prev,
        plans: prev.plans.map((p) =>
          p.period === "day" && p.dateKey === today
            ? { ...p, tasks: fn(p.tasks) }
            : p,
        ),
      }));
    },
    [today],
  );

  const addTask = useCallback(
    (text: string, priority: TaskPriority = "none", estimateMinutes?: number) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      mutateToday((tasks) => [
        ...tasks,
        createTask(trimmed, { priority, estimateMinutes }, now),
      ]);
    },
    [mutateToday, now],
  );

  /** Patch a task's editable fields (text, priority, estimate, note). */
  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      mutateToday((tasks) => tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [mutateToday],
  );

  /** Reorder today's tasks to match the given id order (drag-and-drop). */
  const reorderTasks = useCallback(
    (orderedIds: string[]) => {
      mutateToday((tasks) => {
        const byId = new Map(tasks.map((t) => [t.id, t]));
        const next = orderedIds
          .map((id) => byId.get(id))
          .filter((t): t is Task => Boolean(t));
        return next.length === tasks.length ? next : tasks;
      });
    },
    [mutateToday],
  );

  const toggle = useCallback(
    (taskId: string) => {
      mutateToday((tasks) =>
        tasks.map((t) => (t.id === taskId ? toggleTask(t, now) : t)),
      );
    },
    [mutateToday, now],
  );

  const removeTask = useCallback(
    (taskId: string) => {
      mutateToday((tasks) => tasks.filter((t) => t.id !== taskId));
    },
    [mutateToday],
  );

  /**
   * Close out the day: record it in history and fold it into the streak.
   * Idempotent for a given day thanks to updateStreak's guard.
   */
  const reviewDay = useCallback(() => {
    setState((prev) => {
      const plan = prev.plans.find((p) => p.period === "day" && p.dateKey === today);
      if (!plan) return prev;
      const p = computeProgress(plan);
      const record = { dateKey: today, total: p.total, done: p.done };
      const history = [
        ...prev.history.filter((h) => h.dateKey !== today),
        record,
      ];
      return {
        ...prev,
        history,
        streak: updateStreak(prev.streak, record),
        plans: prev.plans.map((pl) =>
          pl.id === plan.id ? { ...pl, reviewedAt: now.toISOString() } : pl,
        ),
      };
    });
  }, [today, now]);

  const reset = useCallback(() => setState(emptyState()), []);

  return {
    today,
    todayPlan,
    tasks: todayPlan?.tasks ?? [],
    progress,
    streak: state.streak,
    history: state.history,
    addTask,
    updateTask,
    reorderTasks,
    toggle,
    removeTask,
    reviewDay,
    reset,
  };
}
