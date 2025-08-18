interface Company {
    id: number;
    name: string;
    industry: string;
    size: string;
    location: string;
    website?: string;
    annual_revenue?: number;
    employee_count?: number;
    travel_budget?: number;
    description?: string;
    created_at: string;
}
export declare const useCompanyApi: () => {
    searchCompanies: (filters?: any) => Promise<Company[]>;
    getCompanies: () => Promise<Company[]>;
    getCompanyById: (id: number) => Promise<Company>;
    createCompany: (companyData: Partial<Company>) => Promise<Company>;
    updateCompany: (id: number, companyData: Partial<Company>) => Promise<Company>;
    deleteCompany: (id: number) => Promise<boolean>;
    createLead: (leadData: any) => Promise<any>;
    data: any;
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useCompanyApi.d.ts.map