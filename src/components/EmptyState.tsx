import { SunriseIcon } from "./icons";

/** Calm empty state shown before the first task exists. */
export function EmptyState() {
  return (
    <div className="empty">
      <div className="divider">
        <span className="line" />
        <SunriseIcon className="ic" />
        <span className="line" />
      </div>
      <h3>No tasks yet.</h3>
      <p>Let’s create your first one.</p>
    </div>
  );
}
