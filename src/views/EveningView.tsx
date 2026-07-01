import { ProgressRing } from "../components/ProgressRing";
import { eveningSummary, streakLine } from "../lib/motivation";
import type { Progress } from "../types";

interface Props {
  progress: Progress;
  streak: number;
  onBack: () => void;
}

/** Evening: a short, warm wrap-up of the day + the streak nudge. */
export function EveningView({ progress, streak, onBack }: Props) {
  return (
    <section className="main-card">
      <div className="hero centered">
        <h1 className="wrap-title">Today’s wrap-up</h1>
        <ProgressRing progress={progress} />
        <p className="summary">{eveningSummary(progress)}</p>
        <p className="streak-line">{streakLine(streak)}</p>
      </div>

      <button type="button" className="ghost" onClick={onBack}>
        ← Back to today
      </button>
    </section>
  );
}
