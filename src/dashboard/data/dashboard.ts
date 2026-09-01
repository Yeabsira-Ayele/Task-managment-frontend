import { useMemo } from "react";
import { useTask } from "../../tasks/store";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function useDashboardData() {
  const tasks = useTask((state) => state.tasks);

  const taskStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tasks) {
      counts[t.status] = (counts[t.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const memberTask = useMemo(() => {
    const map: Record<string, { name: string; work: number; Done: number }> = {};
    for (const t of tasks) {
      if (!t.assignee) continue;
      const key = t.assignee.id;
      const name = `${t.assignee.fname} ${t.assignee.lname}`.trim();
      if (!map[key]) map[key] = { name, work: 0, Done: 0 };
      if (t.status.toLowerCase() === "completed") map[key].Done += 1;
      else map[key].work += 1;
    }
    return Object.values(map);
  }, [tasks]);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return tasks
      .filter((t) => t.dueDate && t.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5)
      .map((t) => ({
        heading: t.priority,
        paragraph: t.taskTitle,
        status: t.status,
        name: t.assignee ? `${t.assignee.fname} ${t.assignee.lname}` : "Unassigned",
        date: t.dueDate,
      }));
  }, [tasks]);

  // APPROXIMATION — see note: "completed" reuses createdAt as a stand-in for a real
  // completedAt timestamp, which doesn't exist yet. A task edited any time after being
  // marked Completed can misattribute which day it "completed" on. True accuracy needs
  // a status-change history log (flagging, not fixing here).
  const tasksNum = useMemo(() => {
    const buckets = WEEKDAYS.map((day) => ({ day, added: 0, completed: 0 }));
    for (const t of tasks) {
      if (t.createdAt) {
        const day = new Date(t.createdAt).getDay();
        buckets[day].added += 1;
        if (t.status.toLowerCase() === "completed") {
          buckets[day].completed += 1;
        }
      }
    }
    return buckets;
  }, [tasks]);

  return { taskStatus, memberTask, upcoming, tasksNum };
}