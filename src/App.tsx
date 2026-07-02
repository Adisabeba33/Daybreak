import { useEffect, useState } from "react";
import { usePlan } from "./hooks/usePlan";
import type { DayPhase } from "./lib/date";
import { effectiveStreak } from "./lib/plan";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { MorningView } from "./views/MorningView";
import { DayView } from "./views/DayView";
import { EveningView } from "./views/EveningView";
import "./App.css";

export default function App() {
  const plan = usePlan();
  // Always land on the capture screen so the first thing shown is "say your
  // tasks". The bottom nav switches between Day / Tasks / Night.
  const [phase, setPhase] = useState<DayPhase>("morning");

  // Entering the evening closes out the day so the streak/history reflect it.
  useEffect(() => {
    if (phase === "evening") plan.reviewDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const streak = effectiveStreak(plan.streak, plan.today);

  // Expose the active tab as a data attribute so the visual mood (Day / Tasks /
  // Night) can later drive theme tokens without touching component code.
  const tab = phase === "morning" ? "day" : phase === "day" ? "tasks" : "night";

  return (
    <div className="app" data-tab={tab}>
      <Header streak={streak} />

      <main className="content">
        {phase === "morning" && (
          <MorningView
            tasks={plan.tasks}
            onAdd={plan.addTask}
            onToggle={plan.toggle}
            onUpdate={plan.updateTask}
            onRemove={plan.removeTask}
            onReorder={plan.reorderTasks}
            onStart={() => setPhase("day")}
          />
        )}

        {phase === "day" && (
          <DayView
            tasks={plan.tasks}
            progress={plan.progress}
            onAdd={plan.addTask}
            onToggle={plan.toggle}
            onUpdate={plan.updateTask}
            onRemove={plan.removeTask}
            onReorder={plan.reorderTasks}
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
      </main>

      <BottomNav phase={phase} onChange={setPhase} />
    </div>
  );
}
