import { StreakPill } from "./StreakPill";
import { InstallButton } from "./InstallButton";

/** Top bar: brand mark + install affordance + streak pill. */
export function Header({ streak }: { streak: number }) {
  return (
    <header className="header">
      <div className="brand">
        <img
          className="brand-icon"
          src={`${import.meta.env.BASE_URL}icon-192.png`}
          alt=""
          width={22}
          height={22}
        />
        <span className="brand-name">Daybreak</span>
      </div>
      <div className="header-right">
        <InstallButton />
        <StreakPill count={streak} />
      </div>
    </header>
  );
}
