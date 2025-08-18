import { AxiosRequestConfig } from 'axios';
export declare const API_BASE_URL = "/api";
export declare const apiClient: import("axios").AxiosInstance;
export declare const useBaseApi: <T = any>() => {
    request: <R = T>(config: AxiosRequestConfig) => Promise<R>;
    get: <R = T>(url: string, config?: AxiosRequestConfig) => Promise<R>;
    post: <R = T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
    put: <R = T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
    patch: <R = T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
    delete: <R = T>(url: string, config?: AxiosRequestConfig) => Promise<R>;
    data: T | null;
    loading: boolean;
    error: string | null;
};
export declare const useFileUpload: () => {
    uploadFile: (url: string, file: File, additionalData?: Record<string, any>) => Promise<any>;
    request: <R = any>(config: AxiosRequestConfig) => Promise<R>;
    get: <R = any>(url: string, config?: AxiosRequestConfig) => Promise<R>;
    put: <R = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
    patch: <R = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
    delete: <R = any>(url: string, config?: AxiosRequestConfig) => Promise<R>;
    data: any;
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=useBaseApi.d.ts.map