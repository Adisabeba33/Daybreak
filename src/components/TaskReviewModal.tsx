import { useState } from "react";
import type { ParsedTask } from "../lib/ai";
import { PRIORITY_COLOR, PRIORITY_LABEL } from "../lib/taskFormat";

interface Props {
  tasks: ParsedTask[];
  onConfirm: (tasks: ParsedTask[]) => void;
  onCancel: () => void;
}

/**
 * Confirmation step after the AI parses speech: shows what it understood so the
 * user can fix wording or drop a wrong item, then confirm. Only on confirm are
 * the cards actually created; cancel discards everything.
 */
export function TaskReviewModal({ tasks, onConfirm, onCancel }: Props) {
  const [items, setItems] = useState<ParsedTask[]>(tasks);

  const update = (i: number, text: string) =>
    setItems((prev) => prev.map((t, idx) => (idx === i ? { ...t, text } : t)));
  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const valid = items.filter((t) => t.text.trim().length > 0);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal review-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Review tasks"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Did I get this right?</h2>
        <p className="modal-lead">
          Here’s your day, ordered. Check it, tweak if needed, then add to today.
        </p>

        <ul className="review-list">
          {items.map((t, i) => (
            <li key={i} className="review-row">
              <span className="review-num" aria-hidden>
                {i + 1}
              </span>
              {t.priority !== "none" && (
                <span
                  className="prio-dot"
                  style={{ background: PRIORITY_COLOR[t.priority] }}
                  title={`${PRIORITY_LABEL[t.priority]} priority`}
                  aria-hidden
                />
              )}
              <input
                value={t.text}
                onChange={(e) => update(i, e.target.value)}
                aria-label={`Task ${i + 1}`}
                spellCheck={false}
              />
              <button
                type="button"
                className="review-del"
                onClick={() => remove(i)}
                aria-label="Remove task"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onConfirm(valid)}
            disabled={valid.length === 0}
          >
            Add {valid.length || ""}
          </button>
        </div>
      </div>
    </div>
  );
}
