/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/api/http";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface CustomGetOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, "queryFn" | "queryKey"> {
  url: string | null;
  params?: Record<string, any>; // Optional query parameters for GET request
}

export function useCustomGet<TData = unknown, TError = unknown>(
  options: CustomGetOptions<TData, TError>
) {
  const { url, params, ...queryOptions } = options;

  return useQuery<TData, TError>({
    queryKey: [url, params], // react-query will use this as the cache key
    queryFn: async () => {
      if (!url) {
        // Return null or throw a specific error that can be handled by the caller
        return null as unknown as TData; // Type assertion to satisfy TypeScript
      }
      const response: any = await api.get<TData>(url, { params });
      return response;
    },
    enabled: !!url, // Only enable the query if URL exists
    ...queryOptions, // Spread the remaining query options
  });
}