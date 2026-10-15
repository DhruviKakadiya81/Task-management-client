"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/services/auth-api";
import { User } from "@/types";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await authApi.getMe();
        return response.data.user;
      } catch {
        // Return null if not authenticated
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user: query.data as User | null | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isAuthenticated: !!query.data,
  };
}
