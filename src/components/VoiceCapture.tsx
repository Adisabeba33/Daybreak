import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { MicIcon } from "./icons";

interface Props {
  /** Each finalized spoken phrase is added as a task card. */
  onAdd: (text: string) => void;
  /** How many tasks are already captured — drives the guided prompts. */
  count: number;
}

/**
 * Voice-first capture panel. Tap the mic, speak a task — it's captured — then
 * it prompts for the next one. Renders nothing where the browser has no speech
 * recognition, so the text field below stays the fallback.
 */
export function VoiceCapture({ onAdd, count }: Props) {
  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang: typeof navigator !== "undefined" ? navigator.language : "en-US",
    continuous: true,
    onResult: onAdd,
  });

  if (!supported) return null;

  const title = listening
    ? interim || (count > 0 ? "Listening… say your next task" : "Listening…")
    : count > 0
      ? "Say your next task"
      : "Tap and say your first task";

  const sub = listening
    ? "Tap to finish"
    : count > 0
      ? `${count} captured — tap to add more`
      : "Each phrase you say becomes a card";

  return (
    <div className={listening ? "voice-panel listening" : "voice-panel"}>
      <button
        type="button"
        className="vp-btn"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        aria-label="Start voice task input"
      >
        {listening && <span className="vp-ring" aria-hidden />}
        <MicIcon />
      </button>
      <span className="vp-dot" aria-hidden />
      <p className="vp-title">{title}</p>
      <p className="vp-sub">{sub}</p>
    </div>
  );
}
