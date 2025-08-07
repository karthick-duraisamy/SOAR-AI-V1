
import { useState, useCallback, useRef } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  annual_revenue?: number;
  employee_count?: number;
  travel_budget?: number;
  description?: string;
  created_at: string;
}

export const useCompanyApi = () => {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  // Cache for recent requests to prevent duplicate API calls
  const requestCache = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_DURATION = 30000; // 30 seconds cache

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  // Search companies with filters
  const searchCompanies = useCallback(async (filters: any = {}) => {
    // Create cache key from filters
    const cacheKey = JSON.stringify(filters);
    const now = Date.now();
    
    // Check cache first
    const cached = requestCache.current.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      setData(cached.data);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Company[]> = await axios.post(
        `${API_BASE_URL}/companies/search/`,
        filters,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Cache the response
      requestCache.current.set(cacheKey, {
        data: response.data,
        timestamp: now
      });

      // Clean old cache entries to prevent memory leaks
      if (requestCache.current.size > 10) {
        const entries = Array.from(requestCache.current.entries());
        entries.forEach(([key, value]) => {
          if ((now - value.timestamp) > CACHE_DURATION) {
            requestCache.current.delete(key);
          }
        });
      }
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to search companies';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get all companies
  const getCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Company[]> = await axios.get(
        `${API_BASE_URL}/companies/`
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch companies';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get company by ID
  const getCompanyById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Company> = await axios.get(
        `${API_BASE_URL}/companies/${id}/`
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch company';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new company
  const createCompany = useCallback(async (companyData: Partial<Company>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Company> = await axios.post(
        `${API_BASE_URL}/companies/`,
        companyData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create company';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update company
  const updateCompany = useCallback(async (id: number, companyData: Partial<Company>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Company> = await axios.put(
        `${API_BASE_URL}/companies/${id}/`,
        companyData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update company';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Delete company
  const deleteCompany = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/companies/${id}/`);
      setData(null);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete company';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    searchCompanies,
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
  };
};
