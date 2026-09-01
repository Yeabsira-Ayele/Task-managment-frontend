import { z } from "zod";

export const taskSchema = z.object({
  taskTitle: z
    .string()
    .min(3, "Task name must be at least 3 characters")
    .max(100, "Task name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  status: z.string().min(1, "Please select a status"),
  priority: z.string().min(1, "Please select a priority"),
  assignee: z.string().min(1, "Please select an assignee"),
  dueDate: z.string().min(1, "Due date is required"),
  tags: z.string().min(1, "Tag is required"),
  attachments: z.array(z.string().url("Enter a valid URL")).default([]),
});

export type TaskFormValues = z.infer<typeof taskSchema>;