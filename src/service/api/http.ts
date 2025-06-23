/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { redirect } from "next/navigation";
import { BASE_ENDPOINT } from "./endpoints";

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Extend AxiosRequestConfig to include the 'next' property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  next?: {
    revalidate: number;
  };
}

const apiHttp: AxiosInstance = axios.create({
  baseURL: BASE_ENDPOINT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // @ts-ignore
  next: {
    revalidate: 30000,
  } as CustomAxiosRequestConfig["next"], // Cast to the custom type
});

apiHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || "An error occurred",
      status: error.response?.status || 500,
      data: error.response?.data,
    };

    if (error.response?.status === 401) {
      redirect("/");
    }

    return Promise.reject(apiError);
  }
);

export const api = {
  get: async <T>(url: string, config = {}) => {
    const response = await apiHttp.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data = {}, config = {}) => {
    const response = await apiHttp.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data = {}, config = {}) => {
    const response = await apiHttp.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config = {}) => {
    const response = await apiHttp.delete<T>(url, config);
    return response.data;
  },
};

export { apiHttp };
