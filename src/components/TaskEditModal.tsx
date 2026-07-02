import { useState } from "react";
import type { Task, TaskPriority } from "../types";
import { PRIORITY_COLOR, PRIORITY_LABEL } from "../lib/taskFormat";

interface Props {
  task: Task;
  onSave: (patch: Partial<Task>) => void;
  onDelete: () => void;
  onClose: () => void;
}

const PRIORITIES: TaskPriority[] = ["none", "low", "medium", "high"];

/** Edit everything about a task: title, priority, time estimate, note. */
export function TaskEditModal({ task, onSave, onDelete, onClose }: Props) {
  const [text, setText] = useState(task.text);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [mins, setMins] = useState(task.estimateMinutes ? String(task.estimateMinutes) : "");
  const [note, setNote] = useState(task.note ?? "");

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const n = parseInt(mins, 10);
    onSave({
      text: trimmed,
      priority,
      estimateMinutes: Number.isFinite(n) && n > 0 ? n : undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Edit task"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="tip-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>Edit task</h2>

        <input
          className="key-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task"
          aria-label="Task title"
        />

        <div className="edit-field">
          <label>Priority</label>
          <div className="prio-seg">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                className={p === priority ? "prio-opt active" : "prio-opt"}
                onClick={() => setPriority(p)}
              >
                <span
                  className="prio-dot"
                  style={{
                    background: p === "none" ? "var(--text-muted)" : PRIORITY_COLOR[p],
                  }}
                  aria-hidden
                />
                {PRIORITY_LABEL[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="edit-field">
          <label>Estimate (minutes)</label>
          <input
            className="key-input"
            inputMode="numeric"
            value={mins}
            onChange={(e) => setMins(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="—"
            aria-label="Estimate in minutes"
          />
        </div>

        <div className="edit-field">
          <label>Note</label>
          <textarea
            className="note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Details — address, sizes, what to buy…"
            aria-label="Note"
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onDelete}>
            Delete
          </button>
          <button type="button" className="btn-primary" onClick={save} disabled={!text.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
