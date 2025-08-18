interface ContractCreationProps {
    vendorData?: {
        id: number;
        name: string;
        type: string;
        location: string;
        email: string;
        phone: string;
    };
    onNavigate?: (section: string, filters?: any) => void;
    onBack?: () => void;
}
export declare function ContractCreation({ vendorData, onNavigate, onBack }: ContractCreationProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ContractCreation.d.ts.map