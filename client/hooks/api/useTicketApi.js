import { useState, useCallback } from 'react';
import axios from 'axios';
const API_BASE_URL = '/api';
export const useTicketApi = () => {
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
    // Get all tickets
    const getTickets = useCallback(async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/`, { params: filters });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch tickets';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Get ticket by ID
    const getTicketById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/${id}/`);
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch ticket';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Create new ticket
    const createTicket = useCallback(async (ticketData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets/`, ticketData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create ticket';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Update ticket
    const updateTicket = useCallback(async (id, ticketData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/tickets/${id}/`, ticketData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update ticket';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Update ticket status
    const updateTicketStatus = useCallback(async (id, status) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.patch(`${API_BASE_URL}/tickets/${id}/status/`, { status }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update ticket status';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    // Assign ticket
    const assignTicket = useCallback(async (id, assignedTo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.patch(`${API_BASE_URL}/tickets/${id}/assign/`, { assignedTo }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
            return response.data;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to assign ticket';
            setError(errorMessage);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setData]);
    return {
        ...state,
        getTickets,
        getTicketById,
        createTicket,
        updateTicket,
        updateTicketStatus,
        assignTicket,
    };
};
