import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin wrapper over the browser Web Speech API (SpeechRecognition).
 *
 * Recognition runs on-device / via the browser vendor — there's no API key and
 * no per-request cost to us. It supports 100+ languages; we pass the caller's
 * language (defaulting to the device locale) straight through.
 *
 * The Web Speech types aren't in the standard TS DOM lib, so we declare the
 * minimal surface we use and reach for it by casting `window` (no globals, to
 * avoid clashing with any ambient definitions a browser/toolchain might add).
 */

interface SpeechRecognitionAlternative {
  readonly transcript: string;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEventLike {
  readonly error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface Options {
  /** BCP-47 language tag, e.g. "ru-RU", "en-US". */
  lang: string;
  /** Called once per finalized utterance with the trimmed transcript. */
  onResult: (transcript: string) => void;
}

export function useSpeechRecognition({ lang, onResult }: Options) {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  // Keep the latest callback/lang without re-creating `start`.
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const langRef = useRef(lang);
  langRef.current = lang;

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || recRef.current) return;

    const rec = new Ctor();
    rec.lang = langRef.current;
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interimText = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const res = e.results[i];
        const t = res[0].transcript;
        if (res.isFinal) finalText += t;
        else interimText += t;
      }
      if (finalText.trim()) {
        onResultRef.current(finalText.trim());
        setInterim("");
      } else {
        setInterim(interimText);
      }
    };

    const finish = () => {
      setListening(false);
      setInterim("");
      recRef.current = null;
    };
    rec.onerror = finish;
    rec.onend = finish;

    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      finish();
    }
  }, []);

  // Abort any in-flight recognition on unmount.
  useEffect(() => () => recRef.current?.abort(), []);

  return { supported, listening, interim, start, stop };
}
