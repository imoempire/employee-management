/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/api/http";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

interface CustomPostOptions<TData, TError>
  extends Omit<UseMutationOptions<TData, TError, any>, "mutationFn"> {
  url: string;
}

export function useCustomPost<TData = unknown, TError = unknown>(
  options: CustomPostOptions<TData, TError>
) {
  const { url, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (params: any) => {
      console.log("Request payload:", params); // Debug payload
      try {
        const config = params instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" }, maxRedirects: 0 }
          : { maxRedirects: 0 };
        const response = await api.post<TData>(url, params, config);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return response.data;
      } catch (error) {
        // console.log(error, 'error');
        
        if (axios.isAxiosError(error)) {
          console.log(error.response?.status, 'error.response?.status');
          
          if (error.response?.status === 401) {
            throw new Error("Unauthorized: Please log in again");
          }
          if (error.response?.status === 301 || error.response?.status === 302) {
            throw new Error(`Redirected to: ${error.response.headers.location}`);
          }
        }
        throw error;
      }
    },
    ...mutationOptions,
  });
}