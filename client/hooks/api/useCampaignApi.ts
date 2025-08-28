import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Campaign {
  id: number;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  subject_line: string;
  email_content: string;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  target_leads_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
  updated_at: string;
}

interface EmailCampaign {
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
          campaign_type: campaignData.objective === 'lead-nurturing' ? 'nurture' : campaignData.objective,
          subject_line: campaignData.content?.email?.subject || '',
          email_content: campaignData.content?.email?.body || '',
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
  const getCampaigns = useCallback(async (): Promise<Campaign[]> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailCampaign[]> = await axios.get(
        `${API_BASE_URL}/email-campaigns/`
      );

      // Transform the API response to match our interface
      const transformedCampaigns: Campaign[] = response.data.results.map((campaign: EmailCampaign) => ({
        id: parseInt(campaign.id.toString()),
        name: campaign.name,
        description: campaign.description,
        campaign_type: campaign.campaign_type,
        status: campaign.status,
        subject_line: campaign.subject_line,
        email_content: campaign.email_content,
        emails_sent: campaign.emails_sent,
        emails_opened: campaign.emails_opened,
        emails_clicked: campaign.emails_clicked,
        target_leads_count: 0, // Will be populated from the serializer
        open_rate: campaign.emails_sent > 0 ? (campaign.emails_opened / campaign.emails_sent) * 100 : 0,
        click_rate: campaign.emails_sent > 0 ? (campaign.emails_clicked / campaign.emails_sent) * 100 : 0,
        created_at: campaign.created_at,
        updated_at: campaign.updated_at
      }));

      setData(transformedCampaigns);
      return transformedCampaigns;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaigns';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get campaign by ID
  const getCampaignById = useCallback(async (id: string): Promise<Campaign> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailCampaign> = await axios.get(
        `${API_BASE_URL}/email-campaigns/${id}/`
      );

      const transformedCampaign: Campaign = {
        id: parseInt(response.data.id.toString()),
        name: response.data.name,
        description: response.data.description,
        campaign_type: response.data.campaign_type,
        status: response.data.status,
        subject_line: response.data.subject_line,
        email_content: response.data.email_content,
        emails_sent: response.data.emails_sent,
        emails_opened: response.data.emails_opened,
        emails_clicked: response.data.emails_clicked,
        target_leads_count: 0,
        open_rate: response.data.emails_sent > 0 ? (response.data.emails_opened / response.data.emails_sent) * 100 : 0,
        click_rate: response.data.emails_sent > 0 ? (response.data.emails_clicked / response.data.emails_sent) * 100 : 0,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      };

      setData(transformedCampaign);
      return transformedCampaign;
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
      const response: AxiosResponse<EmailCampaign> = await axios.put(
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

  // Launch campaign and send emails
  const launchCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/email-campaigns/${id}/launch/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to launch campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get campaign performance data
  const getCampaignPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.get(
        `${API_BASE_URL}/email-campaigns/performance/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign performance';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Check SMTP status
  const checkSmtpStatus = useCallback(async (campaignId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = campaignId ?
        `${API_BASE_URL}/email-campaigns/${campaignId}/smtp-status/` :
        `${API_BASE_URL}/email-campaigns/smtp-status/`;

      const response: AxiosResponse<any> = await axios.get(endpoint);

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to check SMTP status';
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
    launchCampaign,
    getCampaignAnalytics,
    getCampaignPerformance,
    checkSmtpStatus,
  };
};