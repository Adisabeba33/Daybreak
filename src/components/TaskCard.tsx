import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";
import { PRIORITY_COLOR, formatMinutes } from "../lib/taskFormat";
import { CheckIcon, ClockIcon, GripIcon } from "./icons";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}

/**
 * One sortable task card. Big checkbox toggles done; tapping the body opens the
 * editor; the grip handle drags to reorder. Shows priority dot, time chip and a
 * note preview when present.
 */
export function TaskCard({ task, onToggle, onOpen }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 2 : undefined,
  };

  const done = task.status === "done";
  const time = formatMinutes(task.estimateMinutes);
  const hasMeta = Boolean(time || task.note || task.carriedFromPlanId);

  return (
    <li ref={setNodeRef} style={style} className={done ? "task-card done" : "task-card"}>
      <button
        type="button"
        className="task-check"
        onClick={() => onToggle(task.id)}
        aria-pressed={done}
        aria-label={done ? "Mark not done" : "Mark done"}
      >
        {done && <CheckIcon />}
      </button>

      <button type="button" className="task-body" onClick={() => onOpen(task.id)}>
        <span className="task-title-row">
          {task.priority !== "none" && (
            <span
              className="prio-dot"
              style={{ background: PRIORITY_COLOR[task.priority] }}
              aria-hidden
            />
          )}
          <span className="task-title">{task.text}</span>
        </span>
        {hasMeta && (
          <span className="task-meta">
            {time && (
              <span className="chip">
                <ClockIcon />
                {time}
              </span>
            )}
            {task.note && <span className="task-note">{task.note}</span>}
            {task.carriedFromPlanId && (
              <span className="task-carried" title="Moved from yesterday" aria-hidden>
                ↩
              </span>
            )}
          </span>
        )}
      </button>

      <button
        type="button"
        className="task-grip"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
    </li>
  );
}
