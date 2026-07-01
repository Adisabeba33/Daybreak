import type { Progress } from "../types";

interface Props {
  progress: Progress;
  size?: number;
}

/** Big circular progress indicator — the centrepiece of the day view. */
export function ProgressRing({ progress, size = 180 }: Props) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress.ratio);
  const pct = Math.round(progress.ratio * 100);

  return (
    <div className="ring" role="img" aria-label={`${pct}% complete`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-label">
        <span className="ring-count">
          {progress.done}
          <span className="ring-total">/{progress.total}</span>
        </span>
        <span className="ring-pct">{pct}%</span>
      </div>
    </div>
  );
}
