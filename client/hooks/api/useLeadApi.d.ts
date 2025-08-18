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
export declare const useLeadApi: () => {
    getLeads: (filters?: LeadFilters) => Promise<Lead[]>;
    getLeadById: (id: number) => Promise<Lead>;
    createLead: (leadData: Partial<Lead>) => Promise<Lead>;
    updateLead: (id: number, leadData: Partial<Lead>) => Promise<Lead>;
    deleteLead: (id: number) => Promise<boolean>;
    qualifyLead: (id: number, data: {
        reason?: string;
        created_by?: string;
    }) => Promise<any>;
    disqualifyLead: (id: number, data: {
        reason?: string;
        created_by?: string;
    }) => Promise<any>;
    updateLeadScore: (id: number, score: number) => Promise<any>;
    getPipelineStats: () => Promise<any>;
    addNote: (leadId: number, noteData: {
        note: string;
        created_by?: string;
    }) => Promise<any>;
    sendMessage: (leadId: number, messageData: any) => Promise<any>;
    getHistory: (leadId: number) => Promise<any>;
    getLeadStats: (dateRange?: string) => Promise<any>;
    getRecentActivity: () => Promise<any>;
    getTopLeads: () => Promise<any>;
    moveToOpportunity: (leadId: number, opportunityData: any) => Promise<any>;
    assignAgent: (leadId: number, assignmentData: any) => Promise<any>;
    createLeadFromCompany: (companyData: any) => Promise<any>;
    getOpportunities: (filters?: any) => Promise<any[]>;
    updateOpportunityStage: (id: number, stageData: any) => Promise<any>;
    getOpportunityPipeline: () => Promise<any>;
    data: any;
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useLeadApi.d.ts.map