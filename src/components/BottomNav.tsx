import type { ComponentType, SVGProps } from "react";
import type { DayPhase } from "../lib/date";
import { SunIcon, CheckCircleIcon, MoonIcon } from "./icons";

const TABS: {
  key: DayPhase;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { key: "morning", label: "Day", Icon: SunIcon },
  { key: "day", label: "Tasks", Icon: CheckCircleIcon },
  { key: "evening", label: "Night", Icon: MoonIcon },
];

/** Floating glass nav — Day / Tasks / Night. */
export function BottomNav({
  phase,
  onChange,
}: {
  phase: DayPhase;
  onChange: (p: DayPhase) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Views">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={key === phase ? "nav-item active" : "nav-item"}
          onClick={() => onChange(key)}
          aria-label={label}
          aria-current={key === phase ? "page" : undefined}
        >
          <Icon />
          {key === phase && <span className="nav-dot" aria-hidden />}
        </button>
      ))}
    </nav>
  );
}
