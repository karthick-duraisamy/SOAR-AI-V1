interface Offer {
    id: string;
    title: string;
    corporate: string;
    type: string;
    status: string;
    validFrom: string;
    validTo: string;
    routes: string[];
    cabinClass: string;
    discountType: string;
    discountValue: number;
    minSpend: number;
    maxDiscount: number;
    commission: number;
    usage: number;
    conversion: number;
    revenue: number;
    bookings: number;
    atpcoStatus: string;
    atpcoReference: string;
    lastModified: string;
}
export declare const useOfferApi: () => {
    getOffers: (filters?: any) => Promise<Offer[]>;
    getOfferById: (id: string) => Promise<Offer>;
    createOffer: (offerData: Partial<Offer>) => Promise<Offer>;
    updateOffer: (id: string, offerData: Partial<Offer>) => Promise<Offer>;
    deleteOffer: (id: string) => Promise<boolean>;
    fileOfferWithAtpco: (id: string) => Promise<any>;
    data: any;
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useOfferApi.d.ts.map