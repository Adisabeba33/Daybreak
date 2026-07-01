import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import { VoiceCapture } from "../components/VoiceCapture";
import { EmptyState } from "../components/EmptyState";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onStart: () => void;
}

/**
 * Capture screen: hero → voice panel → manual field → tasks (or empty state).
 * Speaking a phrase adds a card; "Start the day" moves to the checklist.
 */
export function MorningView({ tasks, onAdd, onToggle, onRemove, onStart }: Props) {
  const carried = tasks.filter((t) => t.carriedFromPlanId).length;
  return (
    <section className="main-card">
      <div className="hero">
        <h1>What’s today?</h1>
        <p className="subtitle">Say your tasks — each becomes a card.</p>
      </div>

      <VoiceCapture onAdd={onAdd} count={tasks.length} />
      <TaskInput onAdd={onAdd} placeholder="…or type a task" />

      {carried > 0 && (
        <p className="carried-note">↩ {carried} carried over from yesterday</p>
      )}

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <TaskList tasks={tasks} onToggle={onToggle} onRemove={onRemove} />
      )}

      {tasks.length > 0 && (
        <button type="button" className="primary-cta" onClick={onStart}>
          Start the day
        </button>
      )}
    </section>
  );
}
