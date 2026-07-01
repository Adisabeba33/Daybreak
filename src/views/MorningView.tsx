import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import { VoiceCapture } from "../components/VoiceCapture";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onStart: () => void;
}

/**
 * Morning: voice-first. A big "Say a task" button turns each spoken phrase into
 * a card; a text field is the fallback. Carried-over tasks show up too. When
 * the plan is set, "Start the day" moves to the checklist.
 */
export function MorningView({ tasks, onAdd, onToggle, onRemove, onStart }: Props) {
  const carried = tasks.filter((t) => t.carriedFromPlanId).length;
  return (
    <section className="view morning">
      <header className="view-head">
        <h1>What's today?</h1>
        <p className="subtitle">Say your tasks — each becomes a card.</p>
      </header>

      <VoiceCapture onAdd={onAdd} count={tasks.length} />
      <TaskInput onAdd={onAdd} placeholder="…or type a task" showMic={false} />

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
