// client/src/lib/queryClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<any> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // ← Cookie wichtig
  });

  await throwIfResNotOk(res);

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }

  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401 }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Du kannst optional hier "returnNull" global setzen
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }), // ← oder "returnNull" global
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
