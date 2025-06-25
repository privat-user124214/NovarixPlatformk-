// client/src/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient"; // ← Wichtig: Verwende eigene fetch-Logik

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }), // ← Credentials & 401 Handling
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
