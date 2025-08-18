import { useState, useCallback } from 'react';
import axios from 'axios';
// Base API configuration
export const API_BASE_URL = '/api';
// Axios instance with default configuration
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
apiClient.interceptors.request.use((config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor
apiClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// Generic API hook
export const useBaseApi = () => {
    const [state, setState] = useState({
        data: null,
        loading: false,
        error: null,
    });
    const setLoading = useCallback((loading) => {
        setState(prev => ({ ...prev, loading }));
    }, []);
    const setError = useCallback((error) => {
        setState(prev => ({ ...prev, error }));
    }, []);
    const setData = useCallback((data) => {
        setState(prev => ({ ...prev, data }));
    }, []);
    const request = useCallback(async (config) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient(config);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.detail ||
                error.message ||
                'An error occurred';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    const get = useCallback(async (url, config) => {
        return request({ ...config, method: 'GET', url });
    }, [request]);
    const post = useCallback(async (url, data, config) => {
        return request({ ...config, method: 'POST', url, data });
    }, [request]);
    const put = useCallback(async (url, data, config) => {
        return request({ ...config, method: 'PUT', url, data });
    }, [request]);
    const patch = useCallback(async (url, data, config) => {
        return request({ ...config, method: 'PATCH', url, data });
    }, [request]);
    const del = useCallback(async (url, config) => {
        return request({ ...config, method: 'DELETE', url });
    }, [request]);
    return {
        ...state,
        request,
        get,
        post,
        put,
        patch,
        delete: del,
    };
};
// Utility function for handling file uploads
export const useFileUpload = () => {
    const { post, ...rest } = useBaseApi();
    const uploadFile = useCallback(async (url, file, additionalData) => {
        const formData = new FormData();
        formData.append('file', file);
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }
        return post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }, [post]);
    return {
        ...rest,
        uploadFile,
    };
};
