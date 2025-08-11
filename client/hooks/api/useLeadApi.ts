import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Lead {
  id: number;
  company: {
    id: number;
    name: string;
    industry: string;
    location: string;
  };
  contact: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position: string;
  };
  status: string;
  source: string;
  priority: string;
  score: number;
  estimated_value: number | null;
  notes: string;
  assigned_to?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  next_action: string;
  next_action_date: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadFilters {
  search?: string;
  status?: string;
  industry?: string;
  score?: string;
  engagement?: string;
}

export const useLeadApi = () => {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  // Get all leads
  const getLeads = useCallback(async (filters?: LeadFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.industry) {
        params.append('industry', filters.industry);
      }
      if (filters?.score) {
        params.append('score', filters.score);
      }
      if (filters?.engagement) {
        params.append('engagement', filters.engagement);
      }

      const response: AxiosResponse<Lead[]> = await axios.get(
        `${API_BASE_URL}/leads/?${params.toString()}`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch leads';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get lead by ID
  const getLeadById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Lead> = await axios.get(
        `${API_BASE_URL}/leads/${id}/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch lead';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new lead
  const createLead = useCallback(async (leadData: Partial<Lead>) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Creating lead with data:', leadData);

      const response: AxiosResponse<Lead> = await axios.post(
        `${API_BASE_URL}/leads/`,
        leadData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Lead creation response:', response.data);
      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Lead creation error:', error);
      console.error('Error response:', error.response?.data);

      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message || 
                          'Failed to create lead';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update lead
  const updateLead = useCallback(async (id: number, leadData: Partial<Lead>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Lead> = await axios.put(
        `${API_BASE_URL}/leads/${id}/`,
        leadData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to update lead';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Delete lead
  const deleteLead = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/leads/${id}/`);
      setData(null);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete lead';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Qualify lead
  const qualifyLead = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/leads/${id}/qualify/`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to qualify lead';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Disqualify lead
  const disqualifyLead = useCallback(async (id: number, reason?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/leads/${id}/disqualify/`, {
        reason
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to disqualify lead';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Update lead score
  const updateLeadScore = useCallback(async (id: number, score: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/leads/${id}/update_score/`, {
        score
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to update lead score';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Get pipeline stats
  const getPipelineStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/leads/pipeline_stats/`);
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch pipeline stats';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Add note to lead
  const addNote = useCallback(async (leadId: number, noteData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/leads/${leadId}/add_note/`,
        noteData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.message || 
                          'Failed to add note';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    qualifyLead,
    disqualifyLead,
    updateLeadScore,
    getPipelineStats,
    addNote,
  };
};