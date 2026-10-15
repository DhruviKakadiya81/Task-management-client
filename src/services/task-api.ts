import { api } from "@/lib/axios";
import { Task, TaskPriority, TaskStatus, ApiResponse, PaginatedTasksResponse } from "@/types";

export interface TaskFilterParams {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export const taskApi = {
  getTasks: async (params?: TaskFilterParams): Promise<ApiResponse<PaginatedTasksResponse>> => {
    const res = await api.get("/tasks", { params });
    return res.data;
  },

  getTaskById: async (id: string): Promise<ApiResponse<Task>> => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  createTask: async (payload: CreateTaskPayload): Promise<ApiResponse<Task>> => {
    const res = await api.post("/tasks", payload);
    return res.data;
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> => {
    const res = await api.patch(`/tasks/${id}`, payload);
    return res.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};
