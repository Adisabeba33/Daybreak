import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";
import { PRIORITY_COLOR, formatMinutes } from "../lib/taskFormat";
import { CheckIcon, ClockIcon, GripIcon, CarryIcon } from "./icons";
import { AudioPlayer } from "./AudioPlayer";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  /** Called when the user checks an unfinished task — parent confirms first. */
  onRequestComplete: (id: string) => void;
  onOpen: (id: string) => void;
}

/**
 * One sortable task card. Big checkbox toggles done; tapping the body opens the
 * editor; the grip handle drags to reorder. Shows priority dot, time chip, a
 * note preview, and a play button for an attached voice note.
 */
export function TaskCard({ task, onToggle, onRequestComplete, onOpen }: Props) {
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
  const sourceLabel = task.source === "voice" ? "Voice" : task.source === "text" ? "Typed" : "";
  const hasMeta = Boolean(
    time || task.note || task.voiceNoteId || task.carriedFromPlanId || sourceLabel,
  );

  const open = () => onOpen(task.id);

  return (
    <li ref={setNodeRef} style={style} className={done ? "task-card done" : "task-card"}>
      <button
        type="button"
        className="task-check"
        onClick={() => (done ? onToggle(task.id) : onRequestComplete(task.id))}
        aria-pressed={done}
        aria-label={done ? "Mark not done" : "Mark done"}
      >
        {done && <CheckIcon />}
      </button>

      <div
        className="task-body"
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
      >
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
            {sourceLabel && <span className="task-source">{sourceLabel}</span>}
            {task.voiceNoteId && (
              <span className="chip voice-chip">
                <AudioPlayer
                  audioId={task.voiceNoteId}
                  durationSec={task.voiceDurationSec}
                  compact
                />
              </span>
            )}
            {time && (
              <span className="chip">
                <ClockIcon />
                {time}
              </span>
            )}
            {task.note && <span className="task-note">{task.note}</span>}
            {task.carriedFromPlanId && (
              <span className="task-carried" title="Moved from yesterday" aria-hidden>
                <CarryIcon />
              </span>
            )}
          </span>
        )}
      </div>

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
