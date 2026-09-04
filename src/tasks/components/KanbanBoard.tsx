import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router";
import { PriorityIndicator } from "../components/PriorityIndicator";
import { AssigneeAvatar } from "../components/AssigneeAvatar";
import { useTask, type TaskType } from "../store";

// Column definitions: slug is used for matching/dropping, label is the
// human-readable text AND the value sent to the API via updateTaskStatus
// (matches the casing already used by the status filter dropdown).
const COLUMNS = [
  { slug: "to-do", label: "To Do" },
  { slug: "in-progress", label: "In Progress" },
  { slug: "in-review", label: "In Review" },
  { slug: "completed", label: "Completed" },
  { slug: "cancelled", label: "Cancelled" },
];

const toSlug = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "-");

const formatDueDate = (dueDate: string) => {
  if (!dueDate) return "No date";
  const parsed = new Date(dueDate);
  if (isNaN(parsed.getTime())) return "No date";
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

function KanbanCard({ task, dragging = false }: { task: TaskType; dragging?: boolean }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const tagArray = task.tags
    ? task.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        // A drag that ends without moving still fires onClick in some browsers;
        // isDragging guards against opening the task while dropping it.
        if (!isDragging && !dragging) navigate(`/tasks/${task.id}`);
      }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 cursor-grab active:cursor-grabbing touch-none hover:shadow-md hover:border-gray-200 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-slate-800 font-semibold text-sm leading-snug">
          {task.taskTitle}
        </span>
        <PriorityIndicator priority={task.priority} />
      </div>

      {tagArray.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tagArray.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-50/60 text-blue-500/80 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        {task.assignee ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <AssigneeAvatar fname={task.assignee.fname} lname={task.assignee.lname} />
            <span className="text-[11px] text-slate-500 truncate">{task.assignee.lname}</span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-400 italic">Unassigned</span>
        )}
        <span className="text-[10px] text-gray-400 font-semibold tracking-wide shrink-0">
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({
  slug,
  label,
  tasks,
}: {
  slug: string;
  label: string;
  tasks: TaskType[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: slug });

  return (
    <div className="flex flex-col w-[78vw] max-w-72 sm:w-72 shrink-0 snap-center bg-gray-50/60 rounded-2xl border border-gray-300">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </h3>
        <span className="text-xs font-semibold text-gray-400 bg-white rounded-full w-5 h-5 flex items-center justify-center">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 p-3 pt-0 min-h-[140px] flex-1 rounded-xl transition-colors ${
          isOver ? "bg-blue-50/70 ring-2 ring-blue-200" : ""
        }`}
      >
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-300 text-xs py-8 select-none">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ tasks }: { tasks: TaskType[] }) {
  const updateTaskStatus = useTask((state) => state.updateTaskStatus);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  // A small activation distance stops accidental drags from firing on
  // an ordinary click (which needs to still open the task detail page).
  // TouchSensor uses a short hold delay instead of a distance threshold —
  // without it, a normal touch-scroll gesture on the board would get
  // hijacked into a drag on mobile.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 6 },
    })
  );

  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, TaskType[]> = {};
    COLUMNS.forEach((col) => (grouped[col.slug] = []));
    tasks.forEach((task) => {
      const slug = toSlug(task.status);
      if (!grouped[slug]) grouped[slug] = [];
      grouped[slug].push(task);
    });
    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const targetSlug = String(over.id);
    const targetColumn = COLUMNS.find((c) => c.slug === targetSlug);
    if (!targetColumn) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || toSlug(task.status) === targetSlug) return;

    // Optimistic update + rollback on failure is already handled inside
    // updateTaskStatus in the store.
    updateTaskStatus(taskId, targetColumn.label);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full overflow-x-auto pb-2 snap-x snap-proximity">
        <div className="flex gap-3 sm:gap-4 min-w-max px-0.5">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.slug}
              slug={col.slug}
              label={col.label}
              tasks={tasksByColumn[col.slug] ?? []}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="w-72 rotate-2 shadow-xl">
            <KanbanCard task={activeTask} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
