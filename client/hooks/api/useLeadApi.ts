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
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.get(
        `/leads/${leadId}/history/`
      );
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch history';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get lead statistics for dashboard
  const getLeadStats = useCallback(async (dateRange: string = 'all_time') => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.post(
        `/leads/stats/`,
        { dateRange }
      );
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch lead statistics';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get recent activity
  const getRecentActivity = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.get(
        `/leads/recent-activity/`
      );
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch recent activity';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Send message to lead
  const sendMessage = useCallback(async (leadId: number, messageData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.post(
        `/leads/${leadId}/send_message/`,
        messageData,
      );
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to send message';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get top leads
  const getTopLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.get(
        `/leads/top-leads/`
      );
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch top leads';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Function to move lead to opportunity
  const moveToOpportunity = useCallback(async (leadId: number, opportunityData: any) => {
    setLoading(true);
    setError(null);

    try {
      console.log('API call - moveToOpportunity:', { leadId, data: { opportunity: opportunityData } });

      const response: AxiosResponse<any> = await baseApi.post(
        `/leads/${leadId}/move_to_opportunity/`,
        { opportunity: opportunityData }
      );

      console.log('API response - moveToOpportunity:', response.data);
      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('API error - moveToOpportunity:', error.response?.data);
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to move lead to opportunity';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Function to assign agent to lead
  const assignAgent = useCallback(async (leadId: number, assignmentData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/leads/${leadId}/assign_agent/`,
        assignmentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign agent';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create lead from company data
  const createLeadFromCompany = useCallback(async (companyData: any) => {
    try {
      const response = await baseApi.post('/leads/create_lead_from_company/', companyData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead from company:', error);
      throw error;
    }
  }, [baseApi]);

  // Get opportunities with optimization
  const getOpportunities = useCallback(async (filters: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        search: filters?.search || '',
        stage: filters?.stage || '',
        limit: filters?.limit || 50, // Default limit for faster loading
        page: filters?.page || 1,
        ...filters
      };

      const response: AxiosResponse<any[]> = await baseApi.post(
        `/opportunities/search/`,
        requestBody,
        {
          timeout: 30000, // 30 second timeout
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching opportunities:', error);
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to fetch opportunities';
      setError(errorMessage);
      return []; // Return empty array instead of throwing to prevent crashes
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update opportunity stage
  const updateOpportunityStage = useCallback(async (id: number, stageData: any) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending update request with data:', stageData);

      const response: AxiosResponse<any> = await baseApi.patch(
        `/opportunities/${id}/`,
        stageData
      );

      console.log('Update response received:', response.data);
      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating opportunity stage:', error);
      console.error('Error response:', error.response?.data);

      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to update opportunity stage';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get opportunity pipeline data
  const getOpportunityPipeline = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.get(
        `/opportunities/pipeline_value/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pipeline data:', error);
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to fetch pipeline data';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Add activity to opportunity
  const addOpportunityActivity = useCallback(async (opportunityId: number, activityData: any) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure we send the user information with the activity
      const activityWithUser = {
        type: activityData.type,
        description: activityData.description,
        date: activityData.date,
        created_by_name: activityData.created_by_name || 'Current User'
      };

      const response: AxiosResponse<any> = await baseApi.post(
        `/opportunities/${opportunityId}/add_activity/`,
        activityWithUser
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error adding activity:', error);
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to add activity';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get activities for opportunity
  const getOpportunityActivities = useCallback(async (opportunityId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.get(
        `/opportunities/${opportunityId}/activities/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to fetch activities';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get opportunity history (combining activities and related lead history)
  const getOpportunityHistory = useCallback(async (opportunityId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await baseApi.get(
        `/opportunities/${opportunityId}/history/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching opportunity history:', error);
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to fetch opportunity history';
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
  };
};