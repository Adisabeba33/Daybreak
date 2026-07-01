import { FlameIcon } from "./icons";

/** Streak pill — flame + count, the primary habit motivator. */
export function StreakPill({ count }: { count: number }) {
  return (
    <div className="streak-pill" aria-label={`${count} day streak`}>
      <FlameIcon />
      <span className="streak-num">{count}</span>
    </div>
  );
}
