import { useEffect, useState } from "react";
import { StreakPill } from "./StreakPill";
import { InstallButton } from "./InstallButton";
import { SettingsButton } from "./SettingsButton";
import { BrandIcon } from "./icons";

const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";

/** Re-render every 30s so the header clock stays current without ticking seconds. */
function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatWhen(now: Date): string {
  const date = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const line = `${date} · ${time}`;
  return line.charAt(0).toUpperCase() + line.slice(1);
}

/** Top bar: brand mark + today's date/time + install affordance + streak pill. */
export function Header({ streak }: { streak: number }) {
  const now = useNow();
  return (
    <header className="header">
      <div className="header-row">
        <div className="brand">
          <BrandIcon className="brand-icon" />
          <span className="brand-name">Daybreak</span>
        </div>
        <div className="header-right">
          <InstallButton />
          <SettingsButton />
          <StreakPill count={streak} />
        </div>
      </div>
      <p className="brand-date">{formatWhen(now)}</p>
    </header>
  );
}
