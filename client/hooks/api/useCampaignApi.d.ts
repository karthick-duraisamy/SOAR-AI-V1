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
export declare const useCampaignApi: () => {
    getCampaigns: (filters?: any) => Promise<Campaign[]>;
    getCampaignById: (id: string) => Promise<Campaign>;
    createCampaign: (campaignData: Partial<Campaign>) => Promise<Campaign>;
    updateCampaign: (id: string, campaignData: Partial<Campaign>) => Promise<Campaign>;
    sendCampaign: (id: string) => Promise<any>;
    getCampaignAnalytics: (id: string) => Promise<any>;
    data: any;
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useCampaignApi.d.ts.map