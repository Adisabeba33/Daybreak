import { ProgressRing } from "../components/ProgressRing";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import { dayEncouragement } from "../lib/motivation";
import type { Progress, Task } from "../types";

interface Props {
  tasks: Task[];
  progress: Progress;
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onWrapUp: () => void;
}

/** Day: checklist + big progress ring + gentle nudge. */
export function DayView({ tasks, progress, onAdd, onToggle, onRemove, onWrapUp }: Props) {
  return (
    <section className="view day">
      <header className="view-head centered">
        <ProgressRing progress={progress} />
        <p className="nudge">{dayEncouragement(progress)}</p>
      </header>

      <TaskList tasks={tasks} onToggle={onToggle} onRemove={onRemove} />
      <TaskInput onAdd={onAdd} placeholder="Add one more…" />

      <button type="button" className="ghost" onClick={onWrapUp}>
        Wrap up the day
      </button>
    </section>
  );
}
