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
  const saveProposalDraft = useCallback(async (opportunityId: number, draftData: any, file?: File) => {
    const formData = new FormData();
    
    // Add all draft data to form data
    Object.keys(draftData).forEach(key => {
      if (typeof draftData[key] === 'object' && draftData[key] !== null) {
        formData.append(key, JSON.stringify(draftData[key]));
      } else {
        formData.append(key, draftData[key]);
      }
    });
    
    // Add file if provided
    if (file) {
      formData.append('attachment', file);
    }
    
    return baseApi.post(`/opportunities/${opportunityId}/proposal-draft/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, [baseApi]);

  // Update proposal draft for an opportunity
  const updateProposalDraft = useCallback(async (opportunityId: number, draftData: any, file?: File) => {
    const formData = new FormData();
    
    // Add all draft data to form data
    Object.keys(draftData).forEach(key => {
      if (typeof draftData[key] === 'object' && draftData[key] !== null) {
        formData.append(key, JSON.stringify(draftData[key]));
      } else {
        formData.append(key, draftData[key]);
      }
    });
    
    // Add file if provided
    if (file) {
      formData.append('attachment', file);
    }
    
    return baseApi.put(`/opportunities/${opportunityId}/proposal-draft/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, [baseApi]);

  // Delete proposal draft for an opportunity
  const deleteProposalDraft = useCallback(async (opportunityId: number) => {
    return baseApi.delete(`/opportunities/${opportunityId}/proposal-draft/`);
  }, [baseApi]);

  // Get attachment download URL
  const getAttachmentDownloadUrl = useCallback((opportunityId: number) => {
    return `${API_BASE_URL}/opportunities/${opportunityId}/proposal-draft/attachment/`;
  }, []);

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
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from the actual API endpoint
      const response = await baseApi.post(`/opportunities/search/`, filters);
      setData(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching opportunities:', error);

      // If API fails, return mock data for development
      const mockOpportunities = [
        {
          id: 1,
          name: "TechCorp Solutions - Corporate Travel Agreement",
          stage: "discovery",
          probability: 25,
          value: 250000,
          estimated_close_date: "2024-12-31",
          description: "Corporate travel management solution for TechCorp Solutions",
          next_steps: "Send initial proposal and schedule presentation",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-20T14:30:00Z",
          lead_info: {
            company: {
              id: 1,
              name: "TechCorp Solutions",
              industry: "Technology",
              location: "San Francisco, CA",
              employee_count: 500
            },
            contact: {
              id: 1,
              first_name: "John",
              last_name: "Smith",
              email: "john.smith@techcorp.com",
              phone: "+1 (555) 123-4567",
              position: "Travel Manager"
            }
          },
          latest_activities: [
            {
              id: 1,
              type: "call",
              type_display: "Phone Call",
              description: "Initial discovery call completed",
              date: "2024-01-20",
              created_at: "2024-01-20T14:30:00Z",
              created_by_name: "Sales Agent"
            }
          ]
        },
        {
          id: 2,
          name: "Global Industries - Travel Partnership",
          stage: "proposal",
          probability: 65,
          value: 450000,
          estimated_close_date: "2024-11-30",
          description: "Comprehensive travel solution for Global Industries",
          next_steps: "Follow up on proposal feedback",
          created_at: "2024-01-10T09:00:00Z",
          updated_at: "2024-01-18T16:45:00Z",
          lead_info: {
            company: {
              id: 2,
              name: "Global Industries",
              industry: "Manufacturing",
              location: "Chicago, IL",
              employee_count: 1200
            },
            contact: {
              id: 2,
              first_name: "Sarah",
              last_name: "Johnson",
              email: "sarah.johnson@globalind.com",
              phone: "+1 (555) 987-6543",
              position: "CFO"
            }
          },
          latest_activities: [
            {
              id: 2,
              type: "proposal",
              type_display: "Proposal Sent",
              description: "Comprehensive proposal sent for review",
              date: "2024-01-18",
              created_at: "2024-01-18T16:45:00Z",
              created_by_name: "Account Manager"
            }
          ]
        },
        {
          id: 3,
          name: "Healthcare Plus - Medical Travel Program",
          stage: "negotiation",
          probability: 80,
          value: 180000,
          estimated_close_date: "2024-10-15",
          description: "Specialized travel program for healthcare professionals",
          next_steps: "Contract terms discussion",
          created_at: "2024-01-05T08:00:00Z",
          updated_at: "2024-01-22T11:15:00Z",
          lead_info: {
            company: {
              id: 3,
              name: "Healthcare Plus",
              industry: "Healthcare",
              location: "Boston, MA",
              employee_count: 800
            },
            contact: {
              id: 3,
              first_name: "Dr. Michael",
              last_name: "Chen",
              email: "m.chen@healthcareplus.com",
              phone: "+1 (555) 456-7890",
              position: "Director of Operations"
            }
          },
          latest_activities: [
            {
              id: 3,
              type: "negotiation",
              type_display: "Contract Negotiation",
              description: "Negotiating contract terms and pricing",
              date: "2024-01-22",
              created_at: "2024-01-22T11:15:00Z",
              created_by_name: "Senior Sales Manager"
            }
          ]
        }
      ];

      setData(mockOpportunities);
      return mockOpportunities;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

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
    getAttachmentDownloadUrl,
  };
};