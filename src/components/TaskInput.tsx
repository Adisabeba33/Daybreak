import { useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface Props {
  onAdd: (text: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

/**
 * Quick task entry. Enter (or the + button) adds and keeps focus so several
 * tasks can be typed in a row — the "2-3 taps" morning flow from the brief.
 *
 * Voice input uses the browser Web Speech API via useSpeechRecognition: the mic
 * button appears only where the browser supports it, dictation follows the
 * device language, and the transcript lands in the same field so the user can
 * review/fix it before adding — recognition isn't perfect, so we don't auto-add.
 */
export function TaskInput({ onAdd, autoFocus, placeholder }: Props) {
  const [text, setText] = useState("");

  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang: typeof navigator !== "undefined" ? navigator.language : "en-US",
    onResult: (transcript) =>
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript)),
  });

  const submit = () => {
    // Pressing + / Enter also turns the mic off.
    if (listening) stop();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  // While listening, show the live (interim) transcript appended to the field.
  const displayValue =
    listening && interim ? (text ? `${text} ${interim}` : interim) : text;

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
        value={displayValue}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        placeholder={listening ? "Listening…" : placeholder ?? "Add a task…"}
        onChange={(e) => setText(e.target.value)}
        aria-label="New task"
      />
      {supported && (
        <button
          type="button"
          className={listening ? "mic listening" : "mic"}
          onClick={listening ? stop : start}
          aria-label={listening ? "Stop dictation" : "Dictate task"}
          title={listening ? "Stop" : "Dictate"}
        >
          🎤
        </button>
      )}
      <button type="submit" aria-label="Add task" disabled={!displayValue.trim()}>
        +
      </button>
    </form>
  );
}
