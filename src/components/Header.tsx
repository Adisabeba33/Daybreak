import { StreakPill } from "./StreakPill";
import { InstallButton } from "./InstallButton";
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
        <StreakPill count={streak} />
      </div>
    </header>
  );
}
