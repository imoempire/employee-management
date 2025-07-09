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
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiHttp.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      fullError: error
    });

    const apiError: ApiError = {
      // @ts-expect-error
      message: error.response?.data?.message ? error.response.data.message : error.message ? error.message : "An error occurred",
      status: error.response?.status ? error.response.status : 500,
      data: error.response?.data,
      originalError: error
    };

    return Promise.reject(apiError);
  }
);

export const api = {
  get: async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    const response = await apiHttp.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    const response = await apiHttp.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    const response = await apiHttp.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    const response = await apiHttp.delete<T>(url, config);
    return response.data;
  },
};

export { apiHttp };