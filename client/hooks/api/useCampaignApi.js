import { useState, useCallback } from 'react';
import axios from 'axios';
const API_BASE_URL = '/api';
export const useCampaignApi = () => {
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
    // Get all campaigns
    const getCampaigns = useCallback(async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/campaigns/`, { params: filters });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaigns';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Get campaign by ID
    const getCampaignById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/campaigns/${id}/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Create new campaign
    const createCampaign = useCallback(async (campaignData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/campaigns/`, campaignData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create campaign';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Update campaign
    const updateCampaign = useCallback(async (id, campaignData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/campaigns/${id}/`, campaignData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update campaign';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Send campaign
    const sendCampaign = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/campaigns/${id}/send/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send campaign';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Get campaign analytics
    const getCampaignAnalytics = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/campaigns/${id}/analytics/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign analytics';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    return {
        ...state,
        getCampaigns,
        getCampaignById,
        createCampaign,
        updateCampaign,
        sendCampaign,
        getCampaignAnalytics,
    };
};
