import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface Props {
  /** Each finalized spoken phrase is added as a task card. */
  onAdd: (text: string) => void;
  /** How many tasks are already captured — drives the guided prompts. */
  count: number;
}

/**
 * The voice-first entry point: one big button that guides you through speaking
 * your plan. Tap it, say a task — it's captured — then it prompts for the next
 * one; keep going, tap to finish. Renders nothing where the browser has no
 * speech recognition, so the manual text field stays the fallback.
 */
export function VoiceCapture({ onAdd, count }: Props) {
  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang: typeof navigator !== "undefined" ? navigator.language : "en-US",
    continuous: true,
    onResult: onAdd,
  });

  if (!supported) return null;

  const title = listening
    ? interim || (count > 0 ? "Listening… say your next task" : "Listening… say your first task")
    : count > 0
      ? "Say your next task"
      : "Tap and say your first task";

  const hint = listening
    ? "Tap to finish"
    : count > 0
      ? `✓ ${count} captured — tap to add more`
      : "Each phrase you say becomes a card";

  return (
    <button
      type="button"
      className={listening ? "voice-capture listening" : "voice-capture"}
      onClick={listening ? stop : start}
      aria-pressed={listening}
    >
      <span className="vc-icon" aria-hidden>
        🎤
      </span>
      <span className="vc-text">{title}</span>
      <span className="vc-hint">{hint}</span>
    </button>
  );
}
