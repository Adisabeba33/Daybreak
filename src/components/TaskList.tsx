import type { Task } from "../types";

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRemove?: (id: string) => void;
}

/** The checklist. Tap the row to toggle done. */
export function TaskList({ tasks, onToggle, onRemove }: Props) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet.</p>;
  }
  return (
    <ul className="tasks">
      {tasks.map((task) => (
        <li key={task.id} className={task.status === "done" ? "task done" : "task"}>
          <button
            type="button"
            className="task-toggle"
            onClick={() => onToggle(task.id)}
            aria-pressed={task.status === "done"}
          >
            <span className="checkbox" aria-hidden>
              {task.status === "done" ? "✓" : ""}
            </span>
            <span className="task-text">{task.text}</span>
            {task.carriedFromPlanId && (
              <span className="carried" title="Moved from yesterday">
                ↩
              </span>
            )}
          </button>
          {onRemove && (
            <button
              type="button"
              className="task-remove"
              onClick={() => onRemove(task.id)}
              aria-label={`Remove ${task.text}`}
            >
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
