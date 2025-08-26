import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  subject_line: string;
  email_content: string;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  created_at: string;
  updated_at: string;
}

export const useCampaignApi = () => {
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

  // Create new campaign
  const createCampaign = useCallback(async (campaignData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/email-campaigns/`,
        {
          name: campaignData.name,
          description: campaignData.description || '',
          type: campaignData.objective === 'lead-nurturing' ? 'nurture' : campaignData.objective,
          subject: campaignData.content?.email?.subject || '',
          content: campaignData.content?.email?.body || '',
          target_count: campaignData.targetAudience?.length || 0,
          target_leads: campaignData.targetAudience?.map((lead: any) => lead.id) || [],
          channels: campaignData.channels,
          settings: campaignData.settings
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get all campaigns
  const getCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Campaign[]> = await axios.get(
        `${API_BASE_URL}/email-campaigns/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaigns';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get campaign by ID
  const getCampaignById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Campaign> = await axios.get(
        `${API_BASE_URL}/email-campaigns/${id}/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update campaign
  const updateCampaign = useCallback(async (id: string, campaignData: Partial<Campaign>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Campaign> = await axios.put(
        `${API_BASE_URL}/email-campaigns/${id}/`,
        campaignData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Send campaign
  const sendCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/email-campaigns/${id}/send/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get campaign analytics
  const getCampaignAnalytics = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.get(
        `${API_BASE_URL}/email-campaigns/${id}/analytics/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign analytics';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    sendCampaign,
    getCampaignAnalytics,
  };
};