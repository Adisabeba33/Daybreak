import { useState } from "react";
import { KeyboardIcon, PlusIcon } from "./icons";

interface Props {
  onAdd: (
    text: string,
    priority?: "none" | "low" | "medium" | "high",
    estimateMinutes?: number,
    source?: "voice" | "text",
  ) => void;
  placeholder?: string;
}

/**
 * Manual quick-add row: a soft field + gradient add button. Enter or the +
 * button adds when the trimmed input is non-empty. (Voice lives in the panel
 * above on the capture screen.)
 */
export function TaskInput({ onAdd, placeholder }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, "none", undefined, "text");
    setText("");
  };

  return (
    <form
      className="input-row"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="field">
        <KeyboardIcon className="field-icon" />
        <input
          type="text"
          value={text}
          placeholder={placeholder ?? "…or type a task"}
          onChange={(e) => setText(e.target.value)}
          aria-label="New task"
        />
      </div>
      <button type="submit" className="add-btn" aria-label="Add task" disabled={!text.trim()}>
        <PlusIcon />
      </button>
    </form>
  );
}
