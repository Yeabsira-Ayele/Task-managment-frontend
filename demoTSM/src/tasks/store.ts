import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import api from "../api/axios"
export type TaskType = {
  id: number;
  taskTitle: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  tags: string;
  createdAt: string;
  file: File | null;
};

interface TaskInterface {
  tasks: TaskType[];
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;

  setCreatetask: (newTask: TaskType) => void;
  setDeletetask: (id: number) => void;
  setEdittask: (updatedTask: TaskType) => void;

  setsearchTerm: (terms: string) => void;
  setstatusFilter: (taskstatus: string) => void;
  setpriorityFilter: (taskPriority: string) => void;

  updateTaskStatus: (id: number, status: string) => void;
}

export const useTask = create<TaskInterface>()(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        searchTerm: "",
        statusFilter: "",
        priorityFilter: "",

        setCreatetask: (newTask) =>
          set((state) => ({
            tasks: [...state.tasks, newTask],
          })),

        setEdittask: (updatedTask) =>
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          })),

        setDeletetask: (id) =>
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          })),

        updateTaskStatus: (id, status) =>
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? { ...task, status }
                : task
            ),
          })),

        setpriorityFilter: (taskPriority) =>
          set(() => ({
            priorityFilter: taskPriority,
          })),

        setstatusFilter: (taskstatus) =>
          set(() => ({
            statusFilter: taskstatus,
          })),

        setsearchTerm: (terms) =>
          set(() => ({
            searchTerm: terms,
          })),
      }),
      {
        name: "All Tasks",
      }
    )
  )
);