import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  status: z.enum(["Pending", "In Progress", "Completed"], {
    error: "Select a valid status",
  }),
  priority: z.enum(["Low", "Medium", "High"], {
    error: "Select a valid priority",
  }),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
