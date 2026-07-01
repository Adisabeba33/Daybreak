import type { Task } from "../types";
import { CheckIcon, CloseIcon } from "./icons";

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRemove?: (id: string) => void;
}

/** The plan as a list of soft cards. Tap a row to toggle done. */
export function TaskList({ tasks, onToggle, onRemove }: Props) {
  if (tasks.length === 0) return null;
  return (
    <ul className="tasks">
      {tasks.map((task) => {
        const done = task.status === "done";
        return (
          <li key={task.id} className={done ? "task-card done" : "task-card"}>
            <button
              type="button"
              className="task-check"
              onClick={() => onToggle(task.id)}
              aria-pressed={done}
              aria-label={done ? "Mark not done" : "Mark done"}
            >
              {done && <CheckIcon />}
            </button>
            <span
              className="task-title"
              onClick={() => onToggle(task.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onToggle(task.id);
              }}
            >
              {task.text}
            </span>
            {task.carriedFromPlanId && (
              <span className="task-carried" title="Moved from yesterday" aria-hidden>
                ↩
              </span>
            )}
            {onRemove && (
              <button
                type="button"
                className="task-del"
                onClick={() => onRemove(task.id)}
                aria-label={`Remove ${task.text}`}
              >
                <CloseIcon />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
