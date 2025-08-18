import { useState, useCallback } from 'react';
import axios from 'axios';
const API_BASE_URL = (import.meta.env?.VITE_API_URL) || '/api';
export const useCompanyApi = () => {
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
    // Search companies with filters
    const searchCompanies = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/companies/search/`, filters, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to search companies';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Get all companies
    const getCompanies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/companies/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch companies';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Get company by ID
    const getCompanyById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/companies/${id}/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch company';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Create new company
    const createCompany = useCallback(async (companyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/companies/`, companyData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create company';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Update company
    const updateCompany = useCallback(async (id, companyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/companies/${id}/`, companyData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update company';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Delete company
    const deleteCompany = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_BASE_URL}/companies/${id}/`);
            setData(null);
            return true;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete company';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Create new lead from corporate data
    const createLead = useCallback(async (leadData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/leads/`, leadData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.detail ||
                error.message ||
                'Failed to create lead';
            setError(errorMessage);
            throw error;
        }
        finally {
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
        createLead,
    };
};
