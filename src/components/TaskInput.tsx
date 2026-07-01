import { useState } from "react";

interface Props {
  onAdd: (text: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

/**
 * Quick task entry. Enter (or the + button) adds and keeps focus so several
 * tasks can be typed in a row — the "2-3 taps" morning flow from the brief.
 *
 * Voice input is a Phase 2 add-on: on supporting browsers this maps straight
 * onto the same onAdd, so nothing downstream changes.
 */
export function TaskInput({ onAdd, autoFocus, placeholder }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  return (
    <form
      className="task-input"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <input
        type="text"
        value={text}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        placeholder={placeholder ?? "Add a task…"}
        onChange={(e) => setText(e.target.value)}
        aria-label="New task"
      />
      <button type="submit" aria-label="Add task" disabled={!text.trim()}>
        +
      </button>
    </form>
  );
}
