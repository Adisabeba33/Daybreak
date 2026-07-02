import { useCallback, useRef, useState } from "react";

/** Whether this browser can record audio at all (hide the mic where it can't). */
export const recorderSupported =
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function" &&
  typeof MediaRecorder !== "undefined";

function pickMime(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac", "audio/ogg"];
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(m)) return m;
    } catch {
      /* ignore */
    }
  }
  return "";
}

/**
 * Minimal Telegram-style voice recorder. start() opens the mic; stop() resolves
 * with the recorded blob + duration in seconds. Mic permission is requested on
 * start; on denial, `error` is set.
 */
export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mrRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const timerRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      mrRef.current = mr;
      streamRef.current = stream;
      startedAt.current = performance.now();
      // Timeslice: flush a chunk every second so a short/interrupted recording
      // still yields a valid, playable file (some engines emit nothing until stop).
      mr.start(1000);
      setSeconds(0);
      setRecording(true);
      timerRef.current = window.setInterval(() => {
        setSeconds(Math.floor((performance.now() - startedAt.current) / 1000));
      }, 250);
    } catch {
      setError("mic");
      setRecording(false);
    }
  }, []);

  const stop = useCallback(
    () =>
      new Promise<{ blob: Blob; duration: number } | null>((resolve) => {
        const mr = mrRef.current;
        stopTimer();
        if (!mr || mr.state === "inactive") {
          setRecording(false);
          resolve(null);
          return;
        }
        const duration = Math.max(1, Math.round((performance.now() - startedAt.current) / 1000));
        mr.onstop = () => {
          streamRef.current?.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
          setRecording(false);
          resolve(blob.size ? { blob, duration } : null);
        };
        mr.stop();
      }),
    [],
  );

  return { recording, seconds, error, start, stop };
}
