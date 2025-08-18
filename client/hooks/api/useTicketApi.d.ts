interface Ticket {
    id: string;
    channel: string;
    category: string;
    priority: string;
    status: string;
    customer: string;
    subject: string;
    description: string;
    assignedTo: string;
    createdAt: string;
    updatedAt: string;
    expectedResolution: string;
    tags: string[];
    attachments: any[];
}
export declare const useTicketApi: () => {
    getTickets: (filters?: any) => Promise<Ticket[]>;
    getTicketById: (id: string) => Promise<Ticket>;
    createTicket: (ticketData: Partial<Ticket>) => Promise<Ticket>;
    updateTicket: (id: string, ticketData: Partial<Ticket>) => Promise<Ticket>;
    updateTicketStatus: (id: string, status: string) => Promise<Ticket>;
    assignTicket: (id: string, assignedTo: string) => Promise<Ticket>;
    data: any;
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useTicketApi.d.ts.map