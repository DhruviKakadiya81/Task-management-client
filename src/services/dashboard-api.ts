import { api } from "@/lib/axios";
import { Task, ApiResponse } from "@/types";

export interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  recentTasks: Task[];
}

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res = await api.get("/dashboard/stats");
    return res.data;
  },
};
