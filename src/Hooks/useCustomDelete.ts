/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/api/http";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface CustomDeleteOptions<TData, TError>
  extends Omit<UseMutationOptions<TData, TError, any>, "mutationFn"> {
  url: string;
}

export function useCustomDelete<TData = unknown, TError = unknown>(
  options: CustomDeleteOptions<TData, TError>
) {
  const { url, ...mutationOptions } = options;

  return useMutation({
    // @ts-ignore
    mutationFn: async (params: any) => {
      return api.delete<TData>(url, { params });
    },
    ...mutationOptions,
  });
}