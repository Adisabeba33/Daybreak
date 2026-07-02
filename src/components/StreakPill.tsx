import { SunStreakIcon } from "./icons";

/** Streak pill — sun-streak mark + count, the primary habit motivator. */
export function StreakPill({ count }: { count: number }) {
  return (
    <div className="streak-pill" aria-label={`${count} day streak`}>
      <SunStreakIcon className="streak-ic" />
      <span className="streak-num">{count}</span>
    </div>
  );
}
