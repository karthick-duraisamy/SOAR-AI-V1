import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

// const API_BASE_URL = '/api';
const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// Define a base API service for common functionalities
const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      const requestBody = {
        search: filters?.search || '',
        status: filters?.status || '',
        industry: filters?.industry || '',
        score: filters?.score || '',
        engagement: filters?.engagement || ''
      };

      const response: AxiosResponse<Lead[]> = await baseApi.post(
        `/leads/search/`,
        requestBody,
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
      const response: AxiosResponse<Lead> = await baseApi.get(
        `/leads/${id}/`
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

      const response: AxiosResponse<Lead> = await baseApi.post(
        `/leads/`,
        leadData,
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
      const response: AxiosResponse<Lead> = await baseApi.put(
        `/leads/${id}/`,
        leadData,
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
      await baseApi.delete(`/leads/${id}/`);
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
  const qualifyLead = useCallback(async (id: number, data: { reason?: string; created_by?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await baseApi.post(`/leads/${id}/qualify/`, data);
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
  const disqualifyLead = useCallback(async (id: number, data: { reason?: string; created_by?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await baseApi.post(`/leads/${id}/disqualify/`, data);
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
      const response = await baseApi.post(`/leads/${id}/update_score/`, {
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
      const response = await baseApi.get(`/leads/pipeline_stats/`);
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
  const addNote = useCallback(async (leadId: number, noteData: { note: string; created_by?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.post(
        `/leads/${leadId}/add_note/`,
        noteData,
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

  // Get history for a lead
  const getHistory = useCallback(async (leadId: number) => {
    return baseApi.post('/get-history/', { lead_id: leadId });
  }, [baseApi]);

  // Get proposal draft for an opportunity
  const getProposalDraft = useCallback(async (opportunityId: number) => {
    return baseApi.get(`/opportunities/${opportunityId}/proposal-draft/`);
  }, [baseApi]);

  // Save proposal draft for an opportunity
  const saveProposalDraft = useCallback(async (opportunityId: number, draftData: any) => {
    return baseApi.post(`/opportunities/${opportunityId}/proposal-draft/`, draftData);
  }, [baseApi]);

  // Update proposal draft for an opportunity
  const updateProposalDraft = useCallback(async (opportunityId: number, draftData: any) => {
    return baseApi.put(`/opportunities/${opportunityId}/proposal-draft/`, draftData);
  }, [baseApi]);

  // Delete proposal draft for an opportunity
  const deleteProposalDraft = useCallback(async (opportunityId: number) => {
    return baseApi.delete(`/opportunities/${opportunityId}/proposal-draft/`);
  }, [baseApi]);

  // Send message function
  const sendMessage = useCallback((message: string) => {
    console.log('Message:', message);
    // This function can be used for sending messages or notifications
    // Implementation depends on your messaging system requirements
  }, []);

  // Placeholder functions for missing API endpoints
  const getLeadStats = useCallback(async () => {
    // Placeholder for lead stats API
    return {};
  }, []);

  const getRecentActivity = useCallback(async () => {
    // Placeholder for recent activity API
    return [];
  }, []);

  const getTopLeads = useCallback(async () => {
    // Placeholder for top leads API
    return [];
  }, []);

  const moveToOpportunity = useCallback(async (leadId: number, opportunityData: any) => {
    // Placeholder for move to opportunity API
    return baseApi.post(`/leads/${leadId}/move-to-opportunity/`, opportunityData);
  }, []);

  const assignAgent = useCallback(async (leadId: number, agentId: number) => {
    // Placeholder for assign agent API
    return baseApi.post(`/leads/${leadId}/assign-agent/`, { agent_id: agentId });
  }, []);

  const createLeadFromCompany = useCallback(async (companyData: any) => {
    // Placeholder for create lead from company API
    return baseApi.post(`/leads/from-company/`, companyData);
  }, []);

  const getOpportunities = useCallback(async (filters: any = {}) => {
    // Placeholder for opportunities API
    return baseApi.post(`/opportunities/search/`, filters);
  }, []);

  const updateOpportunityStage = useCallback(async (opportunityId: number, stageData: any) => {
    // Placeholder for update opportunity stage API
    return baseApi.patch(`/opportunities/${opportunityId}/`, stageData);
  }, []);

  const getOpportunityPipeline = useCallback(async () => {
    // Placeholder for opportunity pipeline API
    return baseApi.get(`/opportunities/pipeline/`);
  }, []);

  const addOpportunityActivity = useCallback(async (opportunityId: number, activityData: any) => {
    // Placeholder for add opportunity activity API
    return baseApi.post(`/opportunities/${opportunityId}/activities/`, activityData);
  }, []);

  const getOpportunityActivities = useCallback(async (opportunityId: number) => {
    // Placeholder for get opportunity activities API
    return baseApi.get(`/opportunities/${opportunityId}/activities/`);
  }, []);

  const getOpportunityHistory = useCallback(async (opportunityId: number) => {
    // Placeholder for get opportunity history API
    return baseApi.get(`/opportunities/${opportunityId}/history/`);
  }, []);

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
    sendMessage,
    getHistory,
    getLeadStats,
    getRecentActivity,
    getTopLeads,
    moveToOpportunity,
    assignAgent,
    createLeadFromCompany,
    getOpportunities,
    updateOpportunityStage,
    getOpportunityPipeline,
    addOpportunityActivity,
    getOpportunityActivities,
    getOpportunityHistory,
    getProposalDraft,
    saveProposalDraft,
    updateProposalDraft,
    deleteProposalDraft,
  };
};