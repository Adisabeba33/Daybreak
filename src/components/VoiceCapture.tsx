import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useApiKey, parseTasksFromSpeech, type ParsedTask } from "../lib/ai";
import { useVoiceLang, VOICE_LANGS } from "../lib/voiceLang";
import { MicIcon, GlobeIcon } from "./icons";
import { TaskReviewModal } from "./TaskReviewModal";
import type { TaskPriority } from "../types";

interface Props {
  /** Add a task (the AI path passes an inferred priority and time estimate). */
  onAdd: (
    text: string,
    priority?: TaskPriority,
    estimateMinutes?: number,
    source?: "voice" | "text",
  ) => void;
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
  const { lang, setLang } = useVoiceLang();
  const [processing, setProcessing] = useState(false);
  const [review, setReview] = useState<ParsedTask[] | null>(null);
  const bufferRef = useRef<string[]>([]);
  const wasListening = useRef(false);

  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang,
    continuous: true,
    onResult: (phrase) => {
      if (hasKey) bufferRef.current.push(phrase);
      else onAdd(phrase, "none", undefined, "voice");
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
            else phrases.forEach((p) => onAdd(p, "none", undefined, "voice"));
          })
          .catch(() => phrases.forEach((p) => onAdd(p, "none", undefined, "voice")))
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
    title = "Creating your tasks…";
    sub = "Almost done";
  } else if (listening) {
    title = interim || "Listening…";
    sub = hasKey ? "Talk freely — tap to finish" : "Say one task at a time";
  } else if (count > 0) {
    title = hasKey ? "Add more — just talk" : "Say your next task";
    sub = `${count} captured — tap to add more`;
  } else {
    title = hasKey ? "Tap and say your tasks" : "Tap and say your first task";
    sub = hasKey ? "Talk freely — AI sorts it into cards" : "Each phrase you say becomes a card";
  }

  // Make sure the current language always has an option, even if it's a device
  // locale outside our curated list.
  const langOptions = VOICE_LANGS.some((l) => l.code === lang)
    ? VOICE_LANGS
    : [{ code: lang, label: lang }, ...VOICE_LANGS];

  return (
    <>
      <div className={panelClass}>
        <label className="vp-lang" title="Language I listen in">
          <GlobeIcon />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            disabled={listening || processing}
            aria-label="Speech recognition language"
          >
            {langOptions.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
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
        <span className="vp-wave" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <p className="vp-title">{title}</p>
        <p className="vp-sub">{sub}</p>
      </div>

      {review && (
        <TaskReviewModal
          tasks={review}
          onCancel={() => setReview(null)}
          onConfirm={(tasks) => {
            tasks.forEach((t) => onAdd(t.text, t.priority, t.estimateMinutes, "voice"));
            setReview(null);
          }}
        />
      )}
    </>
  );
}
