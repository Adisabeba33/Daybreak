import { useEffect, useState } from "react";
import { usePlan } from "./hooks/usePlan";
import type { DayPhase } from "./lib/date";
import { effectiveStreak } from "./lib/plan";
import { StreakBadge } from "./components/StreakBadge";
import { InstallButton } from "./components/InstallButton";
import { MorningView } from "./views/MorningView";
import { DayView } from "./views/DayView";
import { EveningView } from "./views/EveningView";
import "./App.css";

export default function App() {
  const plan = usePlan();
  // Always land on the morning capture screen so the first thing the user sees
  // is the big "say your tasks" button. They can navigate with the bottom tabs.
  const [phase, setPhase] = useState<DayPhase>("morning");

  // When the user lands on / moves to the evening, close out the day so the
  // streak and history reflect it.
  useEffect(() => {
    if (phase === "evening") plan.reviewDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const streak = effectiveStreak(plan.streak, plan.today);

  return (
    <div className="app">
      <nav className="top">
        <span className="brand">Daybreak 🌅</span>
        <div className="top-actions">
          <InstallButton />
          <StreakBadge streak={streak} />
        </div>
      </nav>

      {phase === "morning" && (
        <MorningView
          tasks={plan.tasks}
          onAdd={plan.addTask}
          onToggle={plan.toggle}
          onRemove={plan.removeTask}
          onStart={() => setPhase("day")}
        />
      )}

      {phase === "day" && (
        <DayView
          tasks={plan.tasks}
          progress={plan.progress}
          onAdd={plan.addTask}
          onToggle={plan.toggle}
          onRemove={plan.removeTask}
          onWrapUp={() => setPhase("evening")}
        />
      )}

      {phase === "evening" && (
        <EveningView
          progress={plan.progress}
          streak={streak}
          onBack={() => setPhase("day")}
        />
      )}

      <nav className="phases">
        {(["morning", "day", "evening"] as DayPhase[]).map((p) => (
          <button
            key={p}
            type="button"
            className={p === phase ? "active" : ""}
            onClick={() => setPhase(p)}
          >
            {p === "morning" ? "☀️" : p === "day" ? "✅" : "🌙"}
          </button>
        ))}
      </nav>
    </div>
  );
}
