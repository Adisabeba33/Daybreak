import type { TaskPriority } from "../types";

/** Priority → colour used for dots / accents. `none` has no colour. */
export const PRIORITY_COLOR: Record<TaskPriority, string> = {
  none: "transparent",
  low: "#7cc0a0",
  medium: "#f0a23e",
  high: "#ef6b5e",
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  none: "None",
  low: "Low",
  medium: "Med",
  high: "High",
};

/** Format a minute estimate compactly: 45 → "45m", 90 → "1h 30m". */
export function formatMinutes(mins?: number): string {
  if (!mins || mins <= 0) return "";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
