import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useApiKey, parseTasksFromSpeech, type ParsedTask } from "../lib/ai";
import { MicIcon } from "./icons";
import { TaskReviewModal } from "./TaskReviewModal";
import type { TaskPriority } from "../types";

interface Props {
  /** Add a task (priority optional — the AI path passes an inferred one). */
  onAdd: (text: string, priority?: TaskPriority) => void;
  /** How many tasks are already captured — drives the guided prompts. */
  count: number;
}

/**
 * Voice-first capture.
 * - With an API key: collect the whole spoken brain-dump, send it to Claude
 *   Haiku 4.5 on stop, then show a review modal ("Did I get this right?").
 *   Cards are created only after the user confirms.
 * - Without a key: each finalized phrase becomes a card immediately (offline,
 *   zero-cost). If the AI call fails, we fall back to the raw phrases so
 *   nothing spoken is ever lost.
 */
export function VoiceCapture({ onAdd, count }: Props) {
  const { hasKey } = useApiKey();
  const [processing, setProcessing] = useState(false);
  const [review, setReview] = useState<ParsedTask[] | null>(null);
  const bufferRef = useRef<string[]>([]);
  const wasListening = useRef(false);

  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang: typeof navigator !== "undefined" ? navigator.language : "en-US",
    continuous: true,
    onResult: (phrase) => {
      if (hasKey) bufferRef.current.push(phrase);
      else onAdd(phrase);
    },
  });

  // When listening stops in AI mode, parse the buffered transcript and open
  // the review modal (raw phrases as fallback on empty result or error).
  useEffect(() => {
    if (wasListening.current && !listening && hasKey) {
      const phrases = bufferRef.current;
      bufferRef.current = [];
      if (phrases.length > 0) {
        setProcessing(true);
        parseTasksFromSpeech(phrases.join(". "))
          .then((tasks) => {
            if (tasks.length) setReview(tasks);
            else phrases.forEach((p) => onAdd(p));
          })
          .catch(() => phrases.forEach((p) => onAdd(p)))
          .finally(() => setProcessing(false));
      }
    }
    wasListening.current = listening;
  }, [listening, hasKey, onAdd]);

  if (!supported) return null;

  const panelClass = processing
    ? "voice-panel processing"
    : listening
      ? "voice-panel listening"
      : "voice-panel";

  let title: string;
  let sub: string;
  if (processing) {
    title = "Organizing…";
    sub = "Turning your words into tasks";
  } else if (listening) {
    title = interim || (hasKey ? "Listening… talk freely" : "Listening…");
    sub = hasKey ? "Say everything — tap to finish" : "Tap to finish";
  } else if (count > 0) {
    title = hasKey ? "Add more — just talk" : "Say your next task";
    sub = `${count} captured — tap to add more`;
  } else {
    title = hasKey ? "Tap and say your tasks" : "Tap and say your first task";
    sub = hasKey ? "Talk freely — AI sorts it into cards" : "Each phrase you say becomes a card";
  }

  return (
    <>
      <div className={panelClass}>
        <button
          type="button"
          className="vp-btn"
          onClick={listening ? stop : start}
          aria-pressed={listening}
          aria-label="Start voice task input"
          disabled={processing}
        >
          {listening && <span className="vp-ring" aria-hidden />}
          <MicIcon />
        </button>
        <span className="vp-dot" aria-hidden />
        <p className="vp-title">{title}</p>
        <p className="vp-sub">{sub}</p>
      </div>

      {review && (
        <TaskReviewModal
          tasks={review}
          onCancel={() => setReview(null)}
          onConfirm={(tasks) => {
            tasks.forEach((t) => onAdd(t.text, t.priority));
            setReview(null);
          }}
        />
      )}
    </>
  );
}
