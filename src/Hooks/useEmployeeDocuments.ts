/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from "@/service/api/endpoints";
import { api } from "@/service/api/http";
import { useQueries, UseQueryOptions } from "@tanstack/react-query";

interface DocumentStats {
  totalDocuments: number;
  pendingDocuments: number;
  verifiedDocuments: number;
  rejectedDocuments: number;
}

interface UseEmployeeDocumentsOptions {
  employeeId: string;
  queryOptions?: Omit<UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn" | "queryKey">;
}

export function useEmployeeDocuments({ employeeId, queryOptions }: UseEmployeeDocumentsOptions) {
  const endpoints = {
    total: `${API_ENDPOINT.EMPLOYEE}/${employeeId}/total-document-uploaded`,
    pending: `${API_ENDPOINT.EMPLOYEE}/${employeeId}/total-document-pending`,
    verified: `${API_ENDPOINT.EMPLOYEE}/${employeeId}/total-document-verified`,
    rejected: `${API_ENDPOINT.EMPLOYEE}/${employeeId}/total-document-rejected`,
  };

  const queries = useQueries({
    queries: [
      {
        queryKey: [endpoints.total] as const,
        queryFn: async () => {
          const response: any = await api.get(endpoints.total);
          return response.total_documents as number;
        },
        ...queryOptions,
      },
      {
        queryKey: [endpoints.pending] as const,
        queryFn: async () => {
          const response: any = await api.get(endpoints.pending);
          return response.total_pending_documents as number;
        },
        ...queryOptions,
      },
      {
        queryKey: [endpoints.verified] as const,
        queryFn: async () => {
          const response: any = await api.get(endpoints.verified);
          return response.total_verified_documents as number;
        },
        ...queryOptions,
      },
      {
        queryKey: [endpoints.rejected] as const,
        queryFn: async () => {
          const response: any = await api.get(endpoints.rejected);
          return response.total_rejected_documents as number;
        },
        ...queryOptions,
      },
    ],
  });

  const [total, pending, verified, rejected] = queries;

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error;

  const data: DocumentStats = {
    totalDocuments: total.data ?? 0,
    pendingDocuments: pending.data ?? 0,
    verifiedDocuments: verified.data ?? 0,
    rejectedDocuments: rejected.data ?? 0,
  };

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: () => queries.forEach((query) => query.refetch()),
  };
}