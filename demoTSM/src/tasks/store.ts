    import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import api from "../api/axios";

export type TaskType = {
  id: string; 
  taskTitle: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  tags: string;
  createdAt: string;
  fileUrl: string | null;
};

export type TaskFormInput = Omit<TaskType, "id" | "createdAt" | "fileUrl">;

interface TaskInterface {
  tasks: TaskType[];
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  setCreatetask: (newTask: TaskFormInput) => Promise<void>;
  setDeletetask: (id: string) => Promise<void>;
  setEdittask: (id: string, updatedTask: TaskFormInput) => Promise<void>;

  setsearchTerm: (terms: string) => void;
  setstatusFilter: (taskstatus: string) => void;
  setpriorityFilter: (taskPriority: string) => void;

  updateTaskStatus: (id: string, status: string) => Promise<void>;
}

// Normalizes tags back to a comma-separated string, since the backend
// stores/returns tags as an array but the rest of the frontend expects a string.
const normalizeTask = (raw: any): TaskType => ({
  id: raw.id ?? raw._id,
  taskTitle: raw.taskTitle ?? "",
  description: raw.description ?? "",
  status: raw.status ?? "",
  priority: raw.priority ?? "",
  assignee: raw.assignee ?? "",
  dueDate: raw.dueDate ?? "",
  tags: Array.isArray(raw.tags) ? raw.tags.join(", ") : raw.tags ?? "",
  createdAt: raw.createdAt ?? "",
  fileUrl: raw.fileUrl ?? null,
});

export const useTask = create<TaskInterface>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],
        searchTerm: "",
        statusFilter: "",
        priorityFilter: "",
        loading: false,
        error: null,

        fetchTasks: async () => {
          set({ loading: true, error: null });
          try {
            const res = await api.get("/task");
            const tasks = (res.data?.data ?? []).map(normalizeTask);
            set({ tasks, loading: false });
          } catch (err: any) {
            set({
              error: err?.response?.data?.error ?? "Failed to fetch tasks",
              loading: false,
            });
          }
        },

        setCreatetask: async (newTask) => {
          set({ loading: true, error: null });
          try {
            const res = await api.post("/task", newTask);
            const created = normalizeTask(res.data?.data);
            set((state) => ({
              tasks: [...state.tasks, created],
              loading: false,
            }));
          } catch (err: any) {
            set({
              error: err?.response?.data?.error ?? "Failed to create task",
              loading: false,
            });
            throw err;
          }
        },

        setEdittask: async (id, updatedTask) => {
          set({ loading: true, error: null });
          try {
            const res = await api.patch(`/task/${id}`, updatedTask);
            const updated = normalizeTask(res.data?.data);
            set((state) => ({
              tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
              loading: false,
            }));
          } catch (err: any) {
            set({
              error: err?.response?.data?.error ?? "Failed to update task",
              loading: false,
            });
          }
        },

        setDeletetask: async (id) => {
          const prevTasks = get().tasks;
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
          try {
            await api.delete(`/task/${id}`);
          } catch (err: any) {
            set({
              tasks: prevTasks,
              error: err?.response?.data?.error ?? "Failed to delete task",
            });
          }
        },

        updateTaskStatus: async (id, status) => {
          const prevTasks = get().tasks;
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, status } : task
            ),
          }));
          try {
            await api.patch(`/task/${id}`, { status });
          } catch (err: any) {
            set({
              tasks: prevTasks,
              error: err?.response?.data?.error ?? "Failed to update status",
            });
          }
        },

        setpriorityFilter: (taskPriority) => set(() => ({ priorityFilter: taskPriority })),
        setstatusFilter: (taskstatus) => set(() => ({ statusFilter: taskstatus })),
        setsearchTerm: (terms) => set(() => ({ searchTerm: terms })),
      }),
      {
        name: "All Tasks",
        partialize: (state) => ({
          searchTerm: state.searchTerm,
          statusFilter: state.statusFilter,
          priorityFilter: state.priorityFilter,
        }),
      }
    )
  )
);