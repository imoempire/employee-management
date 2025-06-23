/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/api/http";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface CustomEditOptions<TData, TError>
  extends Omit<UseMutationOptions<TData, TError, any>, "mutationFn"> {
  url: string;
}

export function useCustomEdit<TData = unknown, TError = unknown>(
  options: CustomEditOptions<TData, TError>
) {
  const { url, ...mutationOptions } = options;

  return useMutation({
    // @ts-ignore
    mutationFn: async (params: any) => {
      if (params instanceof FormData) {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        return api.put<TData>(url, params, config);
      }
      return api.put<TData>(url, params);
    },
    ...mutationOptions,
  });
}
