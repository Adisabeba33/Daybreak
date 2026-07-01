interface Props {
  streak: number;
}

/** Small flame badge. The streak is the primary motivator in the brief. */
export function StreakBadge({ streak }: Props) {
  return (
    <div className="streak-badge" title={`${streak}-day streak`}>
      <span aria-hidden>🔥</span>
      <span className="streak-num">{streak}</span>
    </div>
  );
}
