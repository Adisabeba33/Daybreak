import type { Task } from "../types";
import { formatMinutes, PRIORITY_COLOR } from "../lib/taskFormat";
import { ClockIcon } from "./icons";

/**
 * The "one big plan card": a calm header above the task list that gives the
 * shape of the day at a glance — how many tasks, roughly how much time, and
 * whether anything is high priority. Shown only once at least one task exists.
 */
export function PlanSummary({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const minutes = tasks.reduce((sum, t) => sum + (t.estimateMinutes ?? 0), 0);
  const high = tasks.filter((t) => t.priority === "high").length;
  const time = formatMinutes(minutes);

  const countLabel = `${total} ${total === 1 ? "task" : "tasks"}`;
  const sub = done > 0 ? `${done} of ${total} done` : countLabel;

  return (
    <div className="plan-summary">
      <div className="ps-left">
        <span className="ps-title">Today’s plan</span>
        <span className="ps-sub">
          {sub}
          {high > 0 && (
            <>
              {" · "}
              <span
                className="prio-dot"
                style={{ background: PRIORITY_COLOR.high }}
                aria-hidden
              />
              {high} high
            </>
          )}
        </span>
      </div>
      {time && (
        <span className="ps-time">
          <ClockIcon />~{time}
        </span>
      )}
    </div>
  );
}
