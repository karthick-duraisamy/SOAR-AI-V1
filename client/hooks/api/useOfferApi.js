import { useState, useCallback } from 'react';
import axios from 'axios';
const API_BASE_URL = '/api';
export const useOfferApi = () => {
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
    // Get all offers
    const getOffers = useCallback(async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/offers/`, { params: filters });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch offers';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Get offer by ID
    const getOfferById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/offers/${id}/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch offer';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Create new offer
    const createOffer = useCallback(async (offerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/offers/`, offerData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create offer';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Update offer
    const updateOffer = useCallback(async (id, offerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/offers/${id}/`, offerData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update offer';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Delete offer
    const deleteOffer = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_BASE_URL}/offers/${id}/`);
            setData(null);
            return true;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete offer';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // File offer with ATPCO
    const fileOfferWithAtpco = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/offers/${id}/file-atpco/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to file offer with ATPCO';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    return {
        ...state,
        getOffers,
        getOfferById,
        createOffer,
        updateOffer,
        deleteOffer,
        fileOfferWithAtpco,
    };
};
