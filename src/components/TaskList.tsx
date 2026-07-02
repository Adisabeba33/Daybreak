import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "../types";
import { deleteAudio } from "../lib/audioStore";
import { TaskCard } from "./TaskCard";
import { TaskEditModal } from "./TaskEditModal";

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onRemove: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

/** The plan: a drag-to-reorder list of task cards + a tap-to-open editor. */
export function TaskList({ tasks, onToggle, onUpdate, onRemove, onReorder }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Long-press to start dragging on touch, so normal taps still toggle/edit.
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  );

  if (tasks.length === 0) return null;

  const ids = tasks.map((t) => t.id);
  const editing = tasks.find((t) => t.id === editingId) ?? null;

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const from = ids.indexOf(String(active.id));
      const to = ids.indexOf(String(over.id));
      if (from !== -1 && to !== -1) onReorder(arrayMove(ids, from, to));
    }
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className="tasks">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={onToggle} onOpen={setEditingId} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {editing && (
        <TaskEditModal
          task={editing}
          onClose={() => setEditingId(null)}
          onSave={(patch) => {
            onUpdate(editing.id, patch);
            setEditingId(null);
          }}
          onDelete={() => {
            if (editing.voiceNoteId) deleteAudio(editing.voiceNoteId);
            onRemove(editing.id);
            setEditingId(null);
          }}
        />
      )}
    </>
  );
}
