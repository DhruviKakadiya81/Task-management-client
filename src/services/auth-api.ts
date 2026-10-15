import { api } from "@/lib/axios";
import { User, ApiResponse } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.post("/auth/login", payload);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};
