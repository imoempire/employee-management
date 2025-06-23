/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/api/http";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface CustomPostOptions<TData, TError>
  extends Omit<UseMutationOptions<TData, TError, any>, "mutationFn"> {
  url: string;
}

export function useCustomPost<TData = unknown, TError = unknown>(
  options: CustomPostOptions<TData, TError>
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
        return api.post(url, params, config);
      }
      return api.post<TData>(url, params);
    },
    ...mutationOptions,
  });
}
