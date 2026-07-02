import { useEffect, useRef, useState } from "react";
import { getAudioBlob } from "../lib/audioStore";
import { PlayIcon, PauseIcon } from "./icons";

interface Props {
  /** Play a stored recording by id… */
  audioId?: string;
  /** …or a freshly recorded (not yet stored) blob. */
  blob?: Blob;
  durationSec?: number;
  /** Compact = just play button + time (used on the card). */
  compact?: boolean;
}

function fmt(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Small audio player: play/pause + time (+ progress bar when not compact). */
export function AudioPlayer({ audioId, blob, durationSec, compact }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [len, setLen] = useState(durationSec ?? 0);
  const [err, setErr] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    let objUrl: string | null = null;
    if (blob) {
      objUrl = URL.createObjectURL(blob);
      setUrl(objUrl);
    } else if (audioId) {
      getAudioBlob(audioId).then((b) => {
        if (alive && b) {
          objUrl = URL.createObjectURL(b);
          setUrl(objUrl);
        }
      });
    } else {
      setUrl(null);
    }
    return () => {
      alive = false;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [audioId, blob]);

  // Force the element to (re)load whenever the source changes. iOS Safari
  // sometimes ignores a changed `src` attribute without an explicit load().
  useEffect(() => {
    setErr(false);
    setCur(0);
    setPlaying(false);
    setLen(durationSec ?? 0);
    const a = ref.current;
    if (a && url) {
      a.muted = false;
      a.volume = 1;
      a.load();
    }
  }, [url, durationSec]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = ref.current;
    if (!a || !url) return;
    if (playing) {
      a.pause();
      return;
    }
    setErr(false);
    a.muted = false;
    a.volume = 1;
    // play() can reject (autoplay policy, decode error). Surface a hint so a
    // silent phone / unsupported format doesn't look like a broken button.
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.catch(() => setErr(true));
    }
  };

  // webm from MediaRecorder often reports duration=Infinity; fall back to the
  // recorded length so the bar and time are still meaningful.
  const effLen = len > 0 && Number.isFinite(len) ? len : (durationSec ?? 0);
  const shown = playing || cur > 0 ? cur : effLen;
  const pct = effLen > 0 ? Math.min(100, (cur / effLen) * 100) : 0;

  return (
    <div className={compact ? "audio compact" : "audio"} onClick={(e) => e.stopPropagation()}>
      <audio
        ref={ref}
        src={url ?? undefined}
        preload="metadata"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCur(0);
        }}
        onError={() => setErr(true)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setLen(d);
        }}
      />
      <button
        type="button"
        className="audio-play"
        onClick={toggle}
        disabled={!url}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      {!compact && (
        <div className="audio-bar" aria-hidden>
          <span style={{ width: `${pct}%` }} />
        </div>
      )}
      <span className="audio-time">{fmt(shown)}</span>
      {err && !compact && (
        <span className="audio-hint">Нет звука? Проверьте бесшумный режим (кнопка сбоку).</span>
      )}
    </div>
  );
}
