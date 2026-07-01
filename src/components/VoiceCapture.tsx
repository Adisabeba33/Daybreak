import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface Props {
  /** Each finalized spoken phrase is added as a task card. */
  onAdd: (text: string) => void;
}

/**
 * The voice-first entry point: one big button. Tap it, speak your tasks — each
 * phrase you say (separated by a natural pause) instantly becomes a card. Tap
 * again to stop. Renders nothing where the browser has no speech recognition,
 * so the manual text field below stays the fallback.
 */
export function VoiceCapture({ onAdd }: Props) {
  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang: typeof navigator !== "undefined" ? navigator.language : "en-US",
    continuous: true,
    onResult: onAdd,
  });

  if (!supported) return null;

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
      <span className="vc-text">
        {listening ? interim || "Listening… say your tasks" : "Say a task"}
      </span>
      <span className="vc-hint">
        {listening ? "Tap to finish" : "Each phrase becomes a card"}
      </span>
    </button>
  );
}
