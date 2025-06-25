import { useQuery } from "@tanstack/react-query";

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
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
