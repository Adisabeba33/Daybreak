import { describe, expect, it } from "vitest";
import {
  carryOverTasks,
  computeProgress,
  createPlan,
  createTask,
  effectiveStreak,
  toggleTask,
  updateStreak,
} from "./plan";
import type { DayRecord, StreakState } from "../types";

const at = (iso: string) => new Date(iso);

describe("computeProgress", () => {
  it("is 0/0 ratio 0 for an empty plan", () => {
    const plan = createPlan("day", "2026-07-01");
    expect(computeProgress(plan)).toEqual({ total: 0, done: 0, ratio: 0 });
  });

  it("counts done tasks", () => {
    const plan = createPlan("day", "2026-07-01");
    plan.tasks = [createTask("a"), createTask("b"), createTask("c")];
    plan.tasks[0] = toggleTask(plan.tasks[0]);
    const p = computeProgress(plan);
    expect(p).toMatchObject({ total: 3, done: 1 });
    expect(p.ratio).toBeCloseTo(1 / 3);
  });
});

describe("toggleTask", () => {
  it("marks done with a timestamp and back to todo without one", () => {
    const t = createTask("x");
    const done = toggleTask(t, at("2026-07-01T09:00:00Z"));
    expect(done.status).toBe("done");
    expect(done.completedAt).toBe("2026-07-01T09:00:00.000Z");
    const undone = toggleTask(done);
    expect(undone.status).toBe("todo");
    expect(undone.completedAt).toBeUndefined();
  });
});

describe("carryOverTasks", () => {
  it("carries only unfinished tasks as fresh todos tagged with the source plan", () => {
    const prev = createPlan("day", "2026-06-30");
    prev.tasks = [createTask("keep"), createTask("done-one")];
    prev.tasks[1] = toggleTask(prev.tasks[1]);

    const carried = carryOverTasks(prev);
    expect(carried).toHaveLength(1);
    expect(carried[0].text).toBe("keep");
    expect(carried[0].status).toBe("todo");
    expect(carried[0].carriedFromPlanId).toBe(prev.id);
    expect(carried[0].id).not.toBe(prev.tasks[0].id);
  });

  it("returns nothing when there is no previous plan", () => {
    expect(carryOverTasks(undefined)).toEqual([]);
  });
});

describe("updateStreak", () => {
  const rec = (dateKey: string, done: number, total = 3): DayRecord => ({
    dateKey,
    done,
    total,
  });
  const fresh: StreakState = { current: 0, longest: 0 };

  it("does not count a day with zero completions", () => {
    expect(updateStreak(fresh, rec("2026-07-01", 0))).toEqual(fresh);
  });

  it("starts at 1 on the first counting day", () => {
    const s = updateStreak(fresh, rec("2026-07-01", 1));
    expect(s).toMatchObject({ current: 1, longest: 1, lastActiveDateKey: "2026-07-01" });
  });

  it("extends on consecutive days", () => {
    let s = updateStreak(fresh, rec("2026-07-01", 1));
    s = updateStreak(s, rec("2026-07-02", 2));
    expect(s.current).toBe(2);
    expect(s.longest).toBe(2);
  });

  it("resets to 1 after a gap but keeps the longest", () => {
    let s = updateStreak(fresh, rec("2026-07-01", 1));
    s = updateStreak(s, rec("2026-07-02", 1));
    s = updateStreak(s, rec("2026-07-05", 1)); // gap
    expect(s.current).toBe(1);
    expect(s.longest).toBe(2);
  });

  it("is idempotent for the same day", () => {
    const s1 = updateStreak(fresh, rec("2026-07-01", 1));
    const s2 = updateStreak(s1, rec("2026-07-01", 3));
    expect(s2).toEqual(s1);
  });
});

describe("effectiveStreak", () => {
  const base: StreakState = { current: 4, longest: 9, lastActiveDateKey: "2026-06-30" };

  it("keeps the streak when today is still open (yesterday counted)", () => {
    expect(effectiveStreak(base, "2026-07-01")).toBe(4);
  });

  it("keeps the streak when today already counted", () => {
    expect(effectiveStreak({ ...base, lastActiveDateKey: "2026-07-01" }, "2026-07-01")).toBe(4);
  });

  it("drops to 0 after a missed day", () => {
    expect(effectiveStreak(base, "2026-07-02")).toBe(0);
  });

  it("is 0 with no history", () => {
    expect(effectiveStreak({ current: 0, longest: 0 }, "2026-07-01")).toBe(0);
  });
});
