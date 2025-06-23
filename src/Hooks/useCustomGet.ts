/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/api/http";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface CustomGetOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, "queryFn" | "queryKey"> {
  url: string;
  params?: Record<string, any>; // Optional query parameters for GET request
}

export function useCustomGet<TData = unknown, TError = unknown>(
  options: CustomGetOptions<TData, TError>
) {
  const { url, params, ...queryOptions } = options;

  return useQuery<TData, TError>({
    queryKey: [url, params], // react-query will use this as the cache key
    queryFn: async () => {
      const response: any = await api.get<TData>(url, { params });
      return response;
    },
    ...queryOptions, // Spread the remaining query options
  });
}
