/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { BASE_ENDPOINT } from "./endpoints";

interface ApiError {
  message: string;
  status: number;
  data?: any;
  originalError?: AxiosError;
}

const apiHttp: AxiosInstance = axios.create({
  baseURL: BASE_ENDPOINT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
apiHttp.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message:
      // @ts-expect-error
        error.message || error.response?.data?.message || "An error occurred",
      status: error.response?.status ? error.response.status : 500,
      data: error.response?.data,
      originalError: error,
    };

    return Promise.reject(apiError);
  }
);

export const api = {
  get: async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    const response = await apiHttp.get<T>(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    const response = await apiHttp.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    const response = await apiHttp.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    const response = await apiHttp.delete<T>(url, config);
    return response.data;
  },
};

export { apiHttp };
