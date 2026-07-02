import { StreakPill } from "./StreakPill";
import { InstallButton } from "./InstallButton";
import { SettingsButton } from "./SettingsButton";
import { BrandIcon } from "./icons";

/** Top bar: brand mark + install affordance + streak pill. */
export function Header({ streak }: { streak: number }) {
  return (
    <header className="header">
      <div className="brand">
        <BrandIcon className="brand-icon" />
        <span className="brand-name">Daybreak</span>
      </div>
      <div className="header-right">
        <InstallButton />
        <SettingsButton />
        <StreakPill count={streak} />
      </div>
    </header>
  );
}
