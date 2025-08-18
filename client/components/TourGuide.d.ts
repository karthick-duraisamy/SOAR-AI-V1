interface TourStep {
    id: string;
    title: string;
    description: string;
    targetSelector: string;
    fallbackSelector?: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    highlightPadding?: number;
    arrow?: boolean;
    textContent?: string;
    category?: 'navigation' | 'action' | 'content' | 'feature';
}
interface TourGuideProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    steps: TourStep[];
    tourTitle?: string;
}
export declare function TourGuide({ isOpen, onClose, onComplete, steps, tourTitle }: TourGuideProps): import("react/jsx-runtime").JSX.Element | null;
export declare const defaultTourSteps: TourStep[];
export declare const aiAssistantTourSteps: TourStep[];
export declare const dashboardTourSteps: TourStep[];
export {};
//# sourceMappingURL=TourGuide.d.ts.map