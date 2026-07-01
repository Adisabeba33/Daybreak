import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onStart: () => void;
}

/** Morning: "What's today?" — fast entry + carried-over tasks. */
export function MorningView({ tasks, onAdd, onToggle, onRemove, onStart }: Props) {
  const carried = tasks.filter((t) => t.carriedFromPlanId).length;
  return (
    <section className="view morning">
      <header className="view-head">
        <h1>What's today?</h1>
        <p className="subtitle">Jot down what matters. Keep it small.</p>
      </header>

      <TaskInput onAdd={onAdd} autoFocus placeholder="e.g. Ship the report" />

      {carried > 0 && (
        <p className="carried-note">↩ {carried} carried over from yesterday</p>
      )}

      <TaskList tasks={tasks} onToggle={onToggle} onRemove={onRemove} />

      {tasks.length > 0 && (
        <button type="button" className="primary" onClick={onStart}>
          Start the day →
        </button>
      )}
    </section>
  );
}
