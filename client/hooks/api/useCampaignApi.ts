
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
  type: string;
  status: string;
  audience: string;
  subject: string;
  content: string;
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
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

  // Get all campaigns
  const getCampaigns = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Campaign[]> = await axios.get(
        `${API_BASE_URL}/campaigns/`,
        { params: filters }
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
        `${API_BASE_URL}/campaigns/${id}/`
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

  // Create new campaign
  const createCampaign = useCallback(async (campaignData: Partial<Campaign>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Campaign> = await axios.post(
        `${API_BASE_URL}/campaigns/`,
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create campaign';
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
        `${API_BASE_URL}/campaigns/${id}/`,
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
        `${API_BASE_URL}/campaigns/${id}/send/`
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
        `${API_BASE_URL}/campaigns/${id}/analytics/`
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
    getCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    sendCampaign,
    getCampaignAnalytics,
  };
};
import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Campaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  sent_count: number;
  open_rate: number;
  click_rate: number;
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

  // Get all campaigns
  const getCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Campaign[]> = await axios.get(
        `${API_BASE_URL}/campaigns/`
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

  // Create new campaign
  const createCampaign = useCallback(async (campaignData: Partial<Campaign>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Campaign> = await axios.post(
        `${API_BASE_URL}/campaigns/`,
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    getCampaigns,
    createCampaign,
  };
};
