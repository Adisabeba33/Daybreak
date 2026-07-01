import { ProgressRing } from "../components/ProgressRing";
import { eveningSummary, streakLine } from "../lib/motivation";
import type { Progress } from "../types";

interface Props {
  progress: Progress;
  streak: number;
  onBack: () => void;
}

/** Evening: short, warm wrap-up of the day + the streak nudge. */
export function EveningView({ progress, streak, onBack }: Props) {
  return (
    <section className="view evening">
      <header className="view-head centered">
        <h1>Today's wrap-up</h1>
        <ProgressRing progress={progress} />
        <p className="summary">{eveningSummary(progress)}</p>
        <p className="streak-line">{streakLine(streak)}</p>
      </header>

      <button type="button" className="ghost" onClick={onBack}>
        ← Back to today
      </button>
    </section>
  );
}
