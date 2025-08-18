import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { FileText, Plus, Eye, Edit, Clock, CheckCircle, AlertTriangle, Download, PenTool, Calendar, DollarSign, User, Filter, Shield, MessageSquare, Target, Brain, RefreshCw, XCircle, CheckCircle2, Info, Lightbulb, BarChart3, Star, Activity, ArrowRight, Tag, Percent } from 'lucide-react';
const contracts = [
    {
        id: 'CTR-2024-001',
        vendor: 'Global Travel Solutions',
        client: 'Airline Operations',
        type: 'Master Service Agreement',
        value: 1250000,
        status: 'Active',
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        signedDate: '2024-01-10',
        progress: 100,
        nextAction: 'Renewal Review',
        documents: 5,
        breachRisk: 'High',
        breachCount: 2,
        parties: ['SOAR-AI Airlines', 'Global Travel Solutions'],
        attachedOffer: {
            id: 'OFF-001',
            title: 'Premium Business Class Package',
            status: 'Active',
            discount: 25,
            validFrom: '2024-01-15',
            validTo: '2024-12-31',
            appliedDiscounts: ['DISC-001', 'DISC-003'],
            promoCodes: ['PROMO-001']
        },
        milestones: [
            { name: 'Contract Signing', date: '2024-01-10', status: 'completed' },
            { name: 'Service Launch', date: '2024-01-15', status: 'completed' },
            { name: 'Q2 Review', date: '2024-04-15', status: 'completed' },
            { name: 'Q3 Review', date: '2024-07-15', status: 'upcoming' },
            { name: 'Renewal Discussion', date: '2024-10-15', status: 'upcoming' }
        ],
        comments: [
            { id: 1, author: 'John Smith', date: '2024-06-15', content: 'Performance review completed. Some concerns about response times.' },
            { id: 2, author: 'Sarah Johnson', date: '2024-06-10', content: 'Vendor has provided action plan for improvement.' },
            { id: 3, author: 'Mike Wilson', date: '2024-06-05', content: 'Escalated SLA compliance issues to management.' }
        ],
        attachments: [
            { name: 'Master Service Agreement.pdf', size: '2.4 MB', uploadDate: '2024-01-10', type: 'Contract' },
            { name: 'SLA Addendum.pdf', size: '856 KB', uploadDate: '2024-02-15', type: 'Amendment' },
            { name: 'Performance Report Q1.pdf', size: '1.2 MB', uploadDate: '2024-04-15', type: 'Report' },
            { name: 'Renewal Terms Draft.pdf', size: '1.8 MB', uploadDate: '2024-06-10', type: 'Draft' },
            { name: 'Vendor Response Letter.pdf', size: '425 KB', uploadDate: '2024-06-12', type: 'Correspondence' }
        ],
        lastActivity: '2024-06-15',
        performanceScore: 72,
        slaCompliance: 85,
        customerSatisfaction: 3.8,
        costEfficiency: 92,
        breachHistory: [
            { date: '2024-03-15', type: 'SLA Violation', resolved: true },
            { date: '2024-05-20', type: 'Performance', resolved: false }
        ],
        marketPosition: 'Leading',
        alternativeVendors: ['Corporate Journey Ltd', 'Elite Business Travel'],
        financialHealth: 'Good',
        technicalCapability: 'Excellent',
        relationshipScore: 4.2,
        terms: 'Standard enterprise terms with 30-day notice period for modifications. Performance penalties apply for SLA breaches exceeding 5% monthly threshold.',
        description: 'Comprehensive master service agreement covering all airline operations support services including booking systems, customer service, and operational support.'
    },
    {
        id: 'CTR-2024-002',
        vendor: 'Corporate Journey Ltd',
        client: 'Business Travel Dept',
        type: 'Service Level Agreement',
        value: 980000,
        status: 'Pending Signature',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        signedDate: null,
        progress: 85,
        nextAction: 'Awaiting Vendor Signature',
        documents: 3,
        breachRisk: 'Low',
        breachCount: 0,
        parties: ['SOAR-AI Airlines', 'Corporate Journey Ltd'],
        attachedOffer: {
            id: 'OFF-002',
            title: 'Economy Plus Group Rates',
            status: 'Active',
            discount: 15,
            validFrom: '2024-02-01',
            validTo: '2024-11-30',
            appliedDiscounts: ['DISC-002'],
            promoCodes: ['PROMO-002']
        },
        milestones: [
            { name: 'Contract Draft', date: '2024-05-15', status: 'completed' },
            { name: 'Legal Review', date: '2024-05-25', status: 'completed' },
            { name: 'Vendor Signature', date: '2024-06-01', status: 'pending' },
            { name: 'Service Launch', date: '2024-06-15', status: 'upcoming' }
        ],
        comments: [
            { id: 1, author: 'Jane Doe', date: '2024-05-28', content: 'Contract ready for vendor signature. Awaiting final approval from their legal team.' }
        ],
        attachments: [
            { name: 'Service Level Agreement.pdf', size: '1.8 MB', uploadDate: '2024-05-15', type: 'Contract' },
            { name: 'Performance Metrics.pdf', size: '945 KB', uploadDate: '2024-05-20', type: 'Specification' },
            { name: 'Legal Review Notes.pdf', size: '623 KB', uploadDate: '2024-05-25', type: 'Review' }
        ],
        lastActivity: '2024-05-28',
        performanceScore: 88,
        slaCompliance: 96,
        customerSatisfaction: 4.3,
        costEfficiency: 87,
        breachHistory: [],
        marketPosition: 'Competitive',
        alternativeVendors: ['Global Travel Solutions', 'Premier Voyage Group'],
        financialHealth: 'Excellent',
        technicalCapability: 'Good',
        relationshipScore: 4.5,
        terms: 'Service level agreement with 99.5% uptime guarantee. Monthly performance reviews and quarterly business reviews included.',
        description: 'Dedicated service level agreement for business travel department operations with enhanced support and guaranteed response times.'
    },
    {
        id: 'CTR-2024-003',
        vendor: 'Elite Business Travel',
        client: 'Executive Services',
        type: 'Non-Disclosure Agreement',
        value: 0,
        status: 'Draft',
        startDate: '2024-07-01',
        endDate: '2025-06-30',
        signedDate: null,
        progress: 45,
        nextAction: 'Legal Review Required',
        documents: 2,
        breachRisk: 'Low',
        breachCount: 0,
        parties: ['SOAR-AI Airlines', 'Elite Business Travel'],
        attachedOffer: null,
        milestones: [
            { name: 'Initial Draft', date: '2024-06-01', status: 'completed' },
            { name: 'Legal Review', date: '2024-06-15', status: 'in-progress' },
            { name: 'Final Approval', date: '2024-06-25', status: 'upcoming' }
        ],
        comments: [],
        attachments: [
            { name: 'NDA Draft v1.pdf', size: '456 KB', uploadDate: '2024-06-01', type: 'Draft' },
            { name: 'Legal Requirements.pdf', size: '289 KB', uploadDate: '2024-06-05', type: 'Requirements' }
        ],
        lastActivity: '2024-06-10',
        performanceScore: 94,
        slaCompliance: 98,
        customerSatisfaction: 4.7,
        costEfficiency: 91,
        breachHistory: [],
        marketPosition: 'Premium',
        alternativeVendors: ['Global Travel Solutions'],
        financialHealth: 'Excellent',
        technicalCapability: 'Excellent',
        relationshipScore: 4.8,
        terms: 'Standard NDA terms with 2-year confidentiality period and mutual non-compete clauses.',
        description: 'Non-disclosure agreement for strategic partnership discussions and confidential information sharing.'
    },
    {
        id: 'CTR-2024-004',
        vendor: 'Premier Voyage Group',
        client: 'Regional Operations',
        type: 'Partnership Agreement',
        value: 620000,
        status: 'At Risk',
        startDate: '2023-01-01',
        endDate: '2024-07-31',
        signedDate: '2022-12-15',
        progress: 100,
        nextAction: 'Breach Resolution Required',
        documents: 7,
        breachRisk: 'High',
        breachCount: 3,
        parties: ['SOAR-AI Airlines', 'Premier Voyage Group'],
        attachedOffer: {
            id: 'OFF-003',
            title: 'Financial Services Executive',
            status: 'Draft',
            discount: 30,
            validFrom: '2024-03-01',
            validTo: '2024-12-31',
            appliedDiscounts: ['DISC-001', 'DISC-004'],
            promoCodes: ['PROMO-003']
        },
        milestones: [
            { name: 'Contract Signing', date: '2022-12-15', status: 'completed' },
            { name: 'Service Launch', date: '2023-01-01', status: 'completed' },
            { name: 'Contract Expired', date: '2024-01-01', status: 'overdue' },
            { name: 'Renewal Required', date: '2024-06-01', status: 'overdue' }
        ],
        comments: [
            { id: 1, author: 'David Chen', date: '2024-06-14', content: 'Escalated performance issues to senior management. Considering termination.' },
            { id: 2, author: 'Lisa Wong', date: '2024-06-10', content: 'Third breach this quarter. Vendor response inadequate.' },
            { id: 3, author: 'Mark Johnson', date: '2024-06-05', content: 'Performance metrics continue to decline despite interventions.' },
            { id: 4, author: 'Sarah Kim', date: '2024-05-28', content: 'Customer complaints increasing. Impact on regional operations significant.' },
            { id: 5, author: 'Tom Brown', date: '2024-05-20', content: 'Vendor action plan submitted but lacks concrete timelines.' },
            { id: 6, author: 'Anna Davis', date: '2024-05-15', content: 'SLA breach #3 for this quarter. Financial penalties applied.' },
            { id: 7, author: 'James Wilson', date: '2024-05-10', content: 'Emergency meeting scheduled with vendor leadership.' },
            { id: 8, author: 'Rachel Green', date: '2024-05-05', content: 'Performance deterioration continues. Alternative vendors being evaluated.' }
        ],
        attachments: [
            { name: 'Partnership Agreement.pdf', size: '3.2 MB', uploadDate: '2022-12-15', type: 'Contract' },
            { name: 'Performance Report Q1.pdf', size: '1.1 MB', uploadDate: '2024-01-20', type: 'Report' },
            { name: 'Breach Notice #1.pdf', size: '234 KB', uploadDate: '2024-01-25', type: 'Notice' },
            { name: 'Vendor Response Plan.pdf', size: '678 KB', uploadDate: '2024-02-10', type: 'Response' },
            { name: 'Breach Notice #2.pdf', size: '287 KB', uploadDate: '2024-03-15', type: 'Notice' },
            { name: 'Performance Improvement Plan.pdf', size: '892 KB', uploadDate: '2024-04-01', type: 'Plan' },
            { name: 'Termination Evaluation.pdf', size: '1.5 MB', uploadDate: '2024-06-10', type: 'Analysis' }
        ],
        lastActivity: '2024-06-14',
        performanceScore: 45,
        slaCompliance: 62,
        customerSatisfaction: 2.8,
        costEfficiency: 78,
        breachHistory: [
            { date: '2024-01-20', type: 'Financial', resolved: false },
            { date: '2024-03-10', type: 'SLA Violation', resolved: true },
            { date: '2024-05-15', type: 'Performance', resolved: false }
        ],
        marketPosition: 'Declining',
        alternativeVendors: ['Global Travel Solutions', 'Corporate Journey Ltd'],
        financialHealth: 'Concerning',
        technicalCapability: 'Average',
        relationshipScore: 2.1,
        terms: 'Partnership agreement with revenue sharing model. Performance penalties and termination clauses for repeated breaches.',
        description: 'Strategic partnership agreement for regional operations with revenue sharing and performance-based compensation structure.'
    }
];
// Mock offers data for selection
const mockOffers = [
    {
        id: 'OFF-001',
        title: 'Premium Business Class Package',
        corporate: 'TechCorp International',
        type: 'Route-based',
        status: 'Active',
        discount: 25,
        validFrom: '2024-01-15',
        validTo: '2024-12-31',
        appliedDiscounts: ['DISC-001', 'DISC-003'],
        promoCodes: ['PROMO-001'],
        description: 'Comprehensive business class travel package for TechCorp International with flexible routing options and enhanced service features.'
    },
    {
        id: 'OFF-002',
        title: 'Economy Plus Group Rates',
        corporate: 'Global Manufacturing Ltd',
        type: 'Volume-based',
        status: 'Active',
        discount: 15,
        validFrom: '2024-02-01',
        validTo: '2024-11-30',
        appliedDiscounts: ['DISC-002'],
        promoCodes: ['PROMO-002'],
        description: 'Volume-based pricing structure for Global Manufacturing with guaranteed group discounts and flexible travel dates.'
    },
    {
        id: 'OFF-003',
        title: 'Financial Services Executive',
        corporate: 'Sunrise Financial Services',
        type: 'Flexible',
        status: 'Draft',
        discount: 30,
        validFrom: '2024-03-01',
        validTo: '2024-12-31',
        appliedDiscounts: ['DISC-001', 'DISC-004'],
        promoCodes: ['PROMO-003'],
        description: 'Premium first-class travel package for Sunrise Financial executives with maximum flexibility and luxury amenities.'
    },
    {
        id: 'OFF-004',
        title: 'Regional Travel Package',
        corporate: 'Regional Operations Corp',
        type: 'Route-based',
        status: 'Active',
        discount: 18,
        validFrom: '2024-02-15',
        validTo: '2024-11-15',
        appliedDiscounts: ['DISC-002'],
        promoCodes: ['PROMO-001'],
        description: 'Cost-effective regional travel solution with optimized routes and competitive pricing.'
    }
];
// Mock discounts data
const mockDiscounts = [
    {
        id: 'DISC-001',
        name: 'Early Bird Discount',
        type: 'Percentage',
        value: 15,
        description: 'Discount for bookings made 60 days in advance'
    },
    {
        id: 'DISC-002',
        name: 'Volume Discount',
        type: 'Percentage',
        value: 20,
        description: 'Bulk booking discount for 10+ passengers'
    },
    {
        id: 'DISC-003',
        name: 'Student Discount',
        type: 'Fixed',
        value: 100,
        description: 'Fixed discount for verified students'
    },
    {
        id: 'DISC-004',
        name: 'Corporate Premium Discount',
        type: 'Percentage',
        value: 25,
        description: 'Premium discount for enterprise clients'
    }
];
// Mock promo codes data
const mockPromoCodes = [
    {
        id: 'PROMO-001',
        code: 'SAVE2024',
        name: 'New Year Promotion',
        type: 'Percentage',
        value: 10,
        description: 'New Year special offer for all bookings'
    },
    {
        id: 'PROMO-002',
        code: 'BIZTRAVEL',
        name: 'Business Travel Special',
        type: 'Fixed',
        value: 75,
        description: 'Special promotion for business travelers'
    },
    {
        id: 'PROMO-003',
        code: 'SUMMER20',
        name: 'Summer Vacation Deal',
        type: 'Percentage',
        value: 20,
        description: 'Summer holiday discount for leisure travel'
    }
];
const contractTemplates = [
    { id: 1, name: 'Master Service Agreement', category: 'Primary', description: 'Comprehensive service agreement template' },
    { id: 2, name: 'Service Level Agreement', category: 'Performance', description: 'SLA template with KPIs and metrics' },
    { id: 3, name: 'Non-Disclosure Agreement', category: 'Legal', description: 'Standard NDA template' },
    { id: 4, name: 'Partnership Agreement', category: 'Strategic', description: 'Strategic partnership template' },
    { id: 5, name: 'Amendment Template', category: 'Modification', description: 'Contract modification template' }
];
// AI Recommendations based on contract analysis
const aiRecommendations = {
    'CTR-2024-001': {
        recommendation: 'Renegotiate',
        confidence: 78,
        reasoning: [
            'High breach count (2) indicates performance issues',
            'SLA compliance at 85% - below industry standard',
            'Strong market position allows for better terms negotiation',
            'Cost efficiency at 92% demonstrates value but needs performance improvement'
        ],
        actions: [
            'Schedule performance review meeting within 2 weeks',
            'Renegotiate SLA terms with stricter penalties',
            'Implement monthly performance monitoring',
            'Consider 6-month probationary renewal'
        ],
        expectedImpact: 'Improved service quality, reduced breach risk by 60%',
        timeline: '30-45 days',
        riskLevel: 'Medium'
    },
    'CTR-2024-002': {
        recommendation: 'Renew',
        confidence: 92,
        reasoning: [
            'Excellent performance score (88%) and SLA compliance (96%)',
            'High customer satisfaction (4.3/5) with zero breaches',
            'Strong financial health and technical capabilities',
            'Cost-effective solution with competitive positioning'
        ],
        actions: [
            'Initiate renewal discussions 60 days before expiration',
            'Negotiate volume discounts for extended term',
            'Include performance bonuses for sustained excellence',
            'Consider expanding scope of services'
        ],
        expectedImpact: 'Continued high performance, potential 10-15% cost savings',
        timeline: '15-20 days',
        riskLevel: 'Low'
    },
    'CTR-2024-003': {
        recommendation: 'Renew',
        confidence: 95,
        reasoning: [
            'Outstanding performance metrics across all areas',
            'Perfect compliance record with no breaches',
            'Premium market position with excellent relationship score',
            'High customer satisfaction (4.7/5) and technical excellence'
        ],
        actions: [
            'Fast-track renewal process due to excellent performance',
            'Negotiate multi-year agreement with favorable terms',
            'Explore strategic partnership opportunities',
            'Consider preferred vendor status'
        ],
        expectedImpact: 'Long-term strategic partnership, enhanced service delivery',
        timeline: '10-15 days',
        riskLevel: 'Very Low'
    },
    'CTR-2024-004': {
        recommendation: 'Terminate',
        confidence: 89,
        reasoning: [
            'Poor performance score (45%) with multiple unresolved breaches',
            'Low SLA compliance (62%) and customer satisfaction (2.8/5)',
            'Concerning financial health and declining market position',
            'Multiple alternative vendors available with better track records'
        ],
        actions: [
            'Issue formal termination notice within 30 days',
            'Begin vendor transition planning immediately',
            'Document all breach instances for legal protection',
            'Initiate procurement process for replacement vendor'
        ],
        expectedImpact: 'Risk reduction by 80%, improved service quality expected',
        timeline: '60-90 days transition',
        riskLevel: 'High'
    }
};
export function ContractManagement({ initialFilters }) {
    const [selectedContract, setSelectedContract] = useState(null);
    const [isCreatingContract, setIsCreatingContract] = useState(false);
    const [showContractDetail, setShowContractDetail] = useState(false);
    const [showAIRecommendation, setShowAIRecommendation] = useState(false);
    const [showOfferDetail, setShowOfferDetail] = useState(false);
    const [showChangeOffer, setShowChangeOffer] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [activeDetailTab, setActiveDetailTab] = useState('summary');
    const [filters, setFilters] = useState({
        status: '',
        client: '',
        riskLevel: '',
        dateRange: '',
        ...initialFilters
    });
    const [newContract, setNewContract] = useState({
        vendor: '',
        client: '',
        type: '',
        value: '',
        startDate: '',
        endDate: '',
        parties: '',
        milestones: '',
        terms: '',
        attachedOffer: 'none'
    });
    // Helper functions
    const getDaysUntilExpiration = (endDate) => {
        const today = new Date();
        const expiry = new Date(endDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const getExpirationStatus = (endDate) => {
        const days = getDaysUntilExpiration(endDate);
        if (days < 0)
            return { status: 'expired', color: 'destructive', label: 'Expired' };
        if (days <= 30)
            return { status: 'critical', color: 'destructive', label: `${days} days left` };
        if (days <= 60)
            return { status: 'warning', color: 'secondary', label: `${days} days left` };
        if (days <= 90)
            return { status: 'caution', color: 'outline', label: `${days} days left` };
        return { status: 'normal', color: 'default', label: 'Active' };
    };
    const getRecommendationColor = (recommendation) => {
        switch (recommendation) {
            case 'Renew': return 'default';
            case 'Renegotiate': return 'secondary';
            case 'Terminate': return 'destructive';
            default: return 'outline';
        }
    };
    const getRecommendationIcon = (recommendation) => {
        switch (recommendation) {
            case 'Renew': return CheckCircle2;
            case 'Renegotiate': return RefreshCw;
            case 'Terminate': return XCircle;
            default: return Info;
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'default';
            case 'Pending Signature': return 'secondary';
            case 'Draft': return 'outline';
            case 'At Risk': return 'destructive';
            case 'Expired': return 'destructive';
            default: return 'outline';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Active': return CheckCircle;
            case 'Pending Signature': return Clock;
            case 'Draft': return Edit;
            case 'At Risk': return AlertTriangle;
            case 'Expired': return AlertTriangle;
            default: return FileText;
        }
    };
    const getRiskColor = (risk) => {
        switch (risk) {
            case 'High': return 'destructive';
            case 'Medium': return 'secondary';
            case 'Low': return 'default';
            default: return 'outline';
        }
    };
    const getMilestoneStatus = (status) => {
        switch (status) {
            case 'completed': return 'default';
            case 'in-progress': return 'secondary';
            case 'pending': return 'outline';
            case 'upcoming': return 'outline';
            case 'overdue': return 'destructive';
            default: return 'outline';
        }
    };
    const handleCreateContract = () => {
        console.log('Creating contract:', newContract);
        setIsCreatingContract(false);
        setNewContract({
            vendor: '',
            client: '',
            type: '',
            value: '',
            startDate: '',
            endDate: '',
            parties: '',
            milestones: '',
            terms: '',
            attachedOffer: 'none'
        });
    };
    const handleViewOffer = (contract) => {
        if (contract.attachedOffer) {
            setSelectedContract(contract);
            setSelectedOffer(contract.attachedOffer);
            setShowOfferDetail(true);
        }
    };
    const handleChangeOffer = (contract) => {
        setSelectedContract(contract);
        setSelectedOffer(contract.attachedOffer);
        setShowChangeOffer(true);
    };
    const renderPromoCodesAndDiscounts = (appliedDiscounts = [], promoCodes = []) => {
        return (_jsxs("div", { className: "flex flex-wrap gap-1", children: [appliedDiscounts.map(discountId => {
                    const discount = mockDiscounts.find(d => d.id === discountId);
                    return discount ? (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [_jsx(Percent, { className: "h-3 w-3 mr-1" }), discount.name] }, discountId)) : null;
                }), promoCodes.map(promoId => {
                    const promo = mockPromoCodes.find(p => p.id === promoId);
                    return promo ? (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx(Tag, { className: "h-3 w-3 mr-1" }), promo.code] }, promoId)) : null;
                })] }));
    };
    const handleViewContract = (contract) => {
        setSelectedContract(contract);
        setActiveDetailTab('summary');
        setShowContractDetail(true);
    };
    const handleShowAIRecommendation = (contract) => {
        setSelectedContract(contract);
        setShowAIRecommendation(true);
    };
    const handleDownloadContract = (contract) => {
        // Create contract data for download
        const contractData = {
            contract: {
                id: contract.id,
                vendor: contract.vendor,
                client: contract.client,
                type: contract.type,
                value: contract.value,
                status: contract.status,
                startDate: contract.startDate,
                endDate: contract.endDate,
                signedDate: contract.signedDate,
                parties: contract.parties,
                terms: contract.terms,
                description: contract.description
            },
            attachedOffer: contract.attachedOffer,
            milestones: contract.milestones,
            performance: {
                performanceScore: contract.performanceScore,
                slaCompliance: contract.slaCompliance,
                customerSatisfaction: contract.customerSatisfaction,
                costEfficiency: contract.costEfficiency,
                breachCount: contract.breachCount,
                breachHistory: contract.breachHistory
            },
            aiRecommendation: aiRecommendations[contract.id],
            exportDate: new Date().toISOString(),
            exportedBy: 'Current User'
        };
        // Convert to JSON string
        const dataStr = JSON.stringify(contractData, null, 2);
        // Create and download file
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contract.id}_Contract_Details_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        // Show success message
        console.log(`Contract ${contract.id} downloaded successfully`);
    };
    const getExpiringContracts = () => {
        return contracts.filter(contract => {
            const days = getDaysUntilExpiration(contract.endDate);
            return days <= 90 && days >= 0;
        });
    };
    return (_jsxs("div", { className: "space-y-6 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Contract Management" }), _jsx("p", { className: "text-muted-foreground", children: "Manage contracts with AI-powered renewal recommendations and expiration tracking" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Dialog, { open: isCreatingContract, onOpenChange: setIsCreatingContract, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "flex items-center gap-2", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Contract"] }) }), _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create New Contract" }), _jsx(DialogDescription, { children: "Generate a new contract with comprehensive details and milestone tracking" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "vendor", children: "Vendor" }), _jsxs(Select, { value: newContract.vendor, onValueChange: (value) => setNewContract({ ...newContract, vendor: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select vendor" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "global-travel", children: "Global Travel Solutions" }), _jsx(SelectItem, { value: "corporate-journey", children: "Corporate Journey Ltd" }), _jsx(SelectItem, { value: "elite-business", children: "Elite Business Travel" }), _jsx(SelectItem, { value: "premier-voyage", children: "Premier Voyage Group" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "client", children: "Client Department" }), _jsxs(Select, { value: newContract.client, onValueChange: (value) => setNewContract({ ...newContract, client: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select client department" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "airline-operations", children: "Airline Operations" }), _jsx(SelectItem, { value: "business-travel", children: "Business Travel Dept" }), _jsx(SelectItem, { value: "executive-services", children: "Executive Services" }), _jsx(SelectItem, { value: "regional-operations", children: "Regional Operations" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "type", children: "Contract Type" }), _jsxs(Select, { value: newContract.type, onValueChange: (value) => setNewContract({ ...newContract, type: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select type" }) }), _jsx(SelectContent, { children: contractTemplates.map((template) => (_jsx(SelectItem, { value: template.name, children: template.name }, template.id))) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "attachedOffer", children: "Attached Offer (Optional)" }), _jsxs(Select, { value: newContract.attachedOffer, onValueChange: (value) => setNewContract({ ...newContract, attachedOffer: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select offer" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "none", children: "No Offer" }), mockOffers.map((offer) => (_jsx(SelectItem, { value: offer.id, children: offer.title }, offer.id)))] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "value", children: "Contract Value ($)" }), _jsx(Input, { id: "value", type: "number", placeholder: "0", value: newContract.value, onChange: (e) => setNewContract({ ...newContract, value: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Start Date" }), _jsx(Input, { id: "startDate", type: "date", value: newContract.startDate, onChange: (e) => setNewContract({ ...newContract, startDate: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endDate", children: "End Date" }), _jsx(Input, { id: "endDate", type: "date", value: newContract.endDate, onChange: (e) => setNewContract({ ...newContract, endDate: e.target.value }) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "parties", children: "Parties Involved" }), _jsx(Input, { id: "parties", placeholder: "e.g., SOAR-AI Airlines, Vendor Name, Third Party", value: newContract.parties, onChange: (e) => setNewContract({ ...newContract, parties: e.target.value }) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "milestones", children: "Key Milestones & Obligations" }), _jsx(Textarea, { id: "milestones", placeholder: "Define key milestones, deliverables, and obligations...", value: newContract.milestones, onChange: (e) => setNewContract({ ...newContract, milestones: e.target.value }) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "terms", children: "Special Terms & Conditions" }), _jsx(Textarea, { id: "terms", placeholder: "Enter any special terms, conditions, or requirements...", value: newContract.terms, onChange: (e) => setNewContract({ ...newContract, terms: e.target.value }) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsCreatingContract(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreateContract, children: "Generate Contract" })] })] })] }), _jsx(Button, { variant: "outline", children: "Import Contract" })] })] }), getExpiringContracts().length > 0 && (_jsxs(Alert, { className: "border-yellow-200 bg-yellow-50", children: [_jsx(Clock, { className: "h-4 w-4 text-yellow-600" }), _jsxs(AlertDescription, { className: "text-yellow-800", children: [_jsx("strong", { children: "Contracts Expiring Soon:" }), " ", getExpiringContracts().length, " contract", getExpiringContracts().length > 1 ? 's' : '', " require", getExpiringContracts().length === 1 ? 's' : '', " attention within the next 90 days.", _jsx(Button, { variant: "link", className: "p-0 ml-2 text-yellow-800 underline", children: "View Details" })] })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5" }), "Contract Filters"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Status" }), _jsxs(Select, { value: filters.status, onValueChange: (value) => setFilters({ ...filters, status: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All statuses" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Active", children: "Active" }), _jsx(SelectItem, { value: "Pending Signature", children: "Pending Signature" }), _jsx(SelectItem, { value: "Draft", children: "Draft" }), _jsx(SelectItem, { value: "At Risk", children: "At Risk" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Client Department" }), _jsxs(Select, { value: filters.client, onValueChange: (value) => setFilters({ ...filters, client: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All clients" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Airline Operations", children: "Airline Operations" }), _jsx(SelectItem, { value: "Business Travel Dept", children: "Business Travel Dept" }), _jsx(SelectItem, { value: "Executive Services", children: "Executive Services" }), _jsx(SelectItem, { value: "Regional Operations", children: "Regional Operations" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Risk Level" }), _jsxs(Select, { value: filters.riskLevel, onValueChange: (value) => setFilters({ ...filters, riskLevel: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All risk levels" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "High", children: "High Risk" }), _jsx(SelectItem, { value: "Medium", children: "Medium Risk" }), _jsx(SelectItem, { value: "Low", children: "Low Risk" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Expiration" }), _jsxs(Select, { value: filters.dateRange, onValueChange: (value) => setFilters({ ...filters, dateRange: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All periods" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "expired", children: "Expired" }), _jsx(SelectItem, { value: "critical", children: "Critical (\u226430 days)" }), _jsx(SelectItem, { value: "warning", children: "Warning (\u226460 days)" }), _jsx(SelectItem, { value: "caution", children: "Caution (\u226490 days)" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "AI Recommendation" }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All recommendations" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "renew", children: "Renew" }), _jsx(SelectItem, { value: "renegotiate", children: "Renegotiate" }), _jsx(SelectItem, { value: "terminate", children: "Terminate" })] })] })] })] }) })] }), _jsxs(Tabs, { defaultValue: "contract-list", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "contract-list", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Contract List" }), _jsx(TabsTrigger, { value: "expiring-soon", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Expiring Soon" }), _jsx(TabsTrigger, { value: "ai-recommendations", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "AI Recommendations" }), _jsx(TabsTrigger, { value: "templates", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Templates" }), _jsx(TabsTrigger, { value: "analytics", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Analytics" })] }), _jsx(TabsContent, { value: "contract-list", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Contract Overview" }), _jsx(CardDescription, { children: "All contracts with expiration tracking, breach indicators and AI recommendations" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: contracts.map((contract) => {
                                            const StatusIcon = getStatusIcon(contract.status);
                                            const expirationStatus = getExpirationStatus(contract.endDate);
                                            const aiRec = aiRecommendations[contract.id];
                                            const RecommendationIcon = getRecommendationIcon(aiRec?.recommendation);
                                            return (_jsx(Card, { className: "relative", children: _jsxs(CardContent, { className: "p-6", children: [(expirationStatus.status === 'critical' || expirationStatus.status === 'warning') && (_jsx("div", { className: `absolute top-0 left-0 right-0 h-1 ${expirationStatus.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}` })), _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-muted rounded-lg", children: _jsx(FileText, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-semibold", children: contract.id }), contract.breachCount > 0 && (_jsxs(Badge, { variant: "destructive", className: "flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "h-3 w-3" }), contract.breachCount, " breach", contract.breachCount > 1 ? 'es' : ''] })), expirationStatus.status !== 'normal' && (_jsxs(Badge, { variant: expirationStatus.color, className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), expirationStatus.label] }))] }), _jsx("p", { className: "font-medium", children: contract.vendor }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground mt-1", children: [_jsx("span", { children: contract.client }), _jsx("span", { children: contract.type }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), contract.startDate, " - ", contract.endDate] })] }), contract.attachedOffer && (_jsxs("div", { className: "mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-800", children: contract.attachedOffer.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs(Badge, { variant: "outline", className: "text-xs", children: [contract.attachedOffer.discount, "% discount"] }), _jsx(Badge, { className: "text-xs bg-blue-100 text-blue-800", children: contract.attachedOffer.status })] })] })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => handleViewOffer(contract), title: "View Offer Details", children: _jsx(Eye, { className: "h-3 w-3" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => handleChangeOffer(contract), title: "Change Offer", children: _jsx(ArrowRight, { className: "h-3 w-3" }) })] })] }), (contract.attachedOffer.appliedDiscounts?.length > 0 || contract.attachedOffer.promoCodes?.length > 0) && (_jsx("div", { className: "mt-2", children: renderPromoCodesAndDiscounts(contract.attachedOffer.appliedDiscounts, contract.attachedOffer.promoCodes) }))] }))] })] }), _jsxs("div", { className: "text-right space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: getStatusColor(contract.status), children: [_jsx(StatusIcon, { className: "h-3 w-3 mr-1" }), contract.status] }), _jsxs(Badge, { variant: getRiskColor(contract.breachRisk), children: [_jsx(Shield, { className: "h-3 w-3 mr-1" }), contract.breachRisk, " Risk"] })] }), _jsx("div", { className: "text-sm font-medium", children: contract.value > 0 ? `$${(contract.value / 1000).toFixed(0)}K` : 'N/A' })] })] }), aiRec && (_jsxs(Alert, { className: `mb-4 ${aiRec.recommendation === 'Renew' ? 'border-green-200 bg-green-50' : aiRec.recommendation === 'Terminate' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`, children: [_jsx(Brain, { className: "h-4 w-4" }), _jsxs(AlertDescription, { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("strong", { children: "AI Recommendation:" }), _jsxs(Badge, { variant: getRecommendationColor(aiRec.recommendation), className: "ml-2", children: [_jsx(RecommendationIcon, { className: "h-3 w-3 mr-1" }), aiRec.recommendation] }), _jsxs("span", { className: "ml-2 text-sm", children: ["Confidence: ", aiRec.confidence, "%"] })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleShowAIRecommendation(contract), children: "View Details" })] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs", children: "Parties" }), _jsx("p", { className: "text-sm", children: contract.parties.join(', ') })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Star, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs", children: "Performance" }), _jsxs("p", { className: "text-sm", children: [contract.performanceScore, "%"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs", children: "SLA Compliance" }), _jsxs("p", { className: "text-sm", children: [contract.slaCompliance, "%"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs", children: "Comments" }), _jsxs("p", { className: "text-sm", children: [contract.comments?.length || 0, " notes"] })] })] })] }), _jsx(Separator, { className: "my-4" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Last activity: ", contract.lastActivity] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleViewContract(contract), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "View Details"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleShowAIRecommendation(contract), children: [_jsx(Brain, { className: "h-4 w-4 mr-1" }), "AI Insights"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleDownloadContract(contract), children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Download"] }), contract.status === 'Pending Signature' && (_jsxs(Button, { size: "sm", onClick: () => console.log('Initiating digital signature for:', contract.id), children: [_jsx(PenTool, { className: "h-4 w-4 mr-1" }), "Sign"] }))] })] })] }) }, contract.id));
                                        }) }) })] }) }), _jsx(TabsContent, { value: "expiring-soon", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-5 w-5" }), "Contracts Expiring Soon"] }), _jsx(CardDescription, { children: "Contracts requiring renewal decisions within the next 90 days" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: getExpiringContracts().map((contract) => {
                                            const expirationStatus = getExpirationStatus(contract.endDate);
                                            const aiRec = aiRecommendations[contract.id];
                                            const RecommendationIcon = getRecommendationIcon(aiRec?.recommendation);
                                            const daysLeft = getDaysUntilExpiration(contract.endDate);
                                            return (_jsx(Card, { className: `border-l-4 ${daysLeft <= 30 ? 'border-l-red-500' : daysLeft <= 60 ? 'border-l-yellow-500' : 'border-l-blue-500'}`, children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h3", { className: "font-semibold text-lg", children: contract.id }), _jsxs(Badge, { variant: expirationStatus.color, className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), daysLeft, " days left"] }), aiRec && (_jsxs(Badge, { variant: getRecommendationColor(aiRec.recommendation), children: [_jsx(RecommendationIcon, { className: "h-3 w-3 mr-1" }), aiRec.recommendation] }))] }), _jsx("p", { className: "font-medium text-lg", children: contract.vendor }), _jsxs("p", { className: "text-muted-foreground", children: [contract.client, " \u2022 ", contract.type] }), _jsxs("div", { className: "mt-2 text-sm", children: [_jsx("span", { className: "font-medium", children: "Contract Value:" }), " $", (contract.value / 1000).toFixed(0), "K"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-bold mb-1", children: daysLeft }), _jsx("div", { className: "text-sm text-muted-foreground", children: "days remaining" }), _jsxs("div", { className: "text-sm mt-2", children: ["Expires: ", _jsx("span", { className: "font-medium", children: contract.endDate })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Performance" }), _jsxs("div", { className: "font-semibold", children: [contract.performanceScore, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "SLA Compliance" }), _jsxs("div", { className: "font-semibold", children: [contract.slaCompliance, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Satisfaction" }), _jsxs("div", { className: "font-semibold", children: [contract.customerSatisfaction, "/5"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Breaches" }), _jsx("div", { className: "font-semibold", children: contract.breachCount })] })] }), aiRec && (_jsxs(Alert, { className: `mb-4 ${aiRec.recommendation === 'Renew' ? 'border-green-200 bg-green-50' : aiRec.recommendation === 'Terminate' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`, children: [_jsx(Brain, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("strong", { children: ["AI Recommendation: ", aiRec.recommendation] }), _jsxs("div", { className: "text-sm mt-1", children: ["Confidence: ", aiRec.confidence, "% \u2022 ", aiRec.expectedImpact] })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleShowAIRecommendation(contract), children: "View Analysis" })] }) })] })), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { className: "flex-1", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-1" }), "Initiate Renewal"] }), _jsxs(Button, { variant: "outline", onClick: () => handleShowAIRecommendation(contract), children: [_jsx(Brain, { className: "h-4 w-4 mr-1" }), "AI Analysis"] }), _jsxs(Button, { variant: "outline", onClick: () => handleViewContract(contract), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "View Contract"] })] })] }) }, contract.id));
                                        }) }) })] }) }), _jsx(TabsContent, { value: "ai-recommendations", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "h-5 w-5" }), "AI-Powered Contract Recommendations"] }), _jsx(CardDescription, { children: "Intelligent analysis and recommendations for all contracts based on performance, risk, and market data" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-6", children: contracts.map((contract) => {
                                            const aiRec = aiRecommendations[contract.id];
                                            const RecommendationIcon = getRecommendationIcon(aiRec?.recommendation);
                                            if (!aiRec)
                                                return null;
                                            return (_jsx(Card, { className: `border-l-4 ${aiRec.recommendation === 'Renew' ? 'border-l-green-500' : aiRec.recommendation === 'Terminate' ? 'border-l-red-500' : 'border-l-yellow-500'}`, children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs("h3", { className: "font-semibold text-lg", children: [contract.id, " - ", contract.vendor] }), _jsxs(Badge, { variant: getRecommendationColor(aiRec.recommendation), className: "flex items-center gap-1", children: [_jsx(RecommendationIcon, { className: "h-3 w-3" }), aiRec.recommendation] })] }), _jsxs("p", { className: "text-muted-foreground", children: [contract.client, " \u2022 ", contract.type] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold mb-1", children: [aiRec.confidence, "%"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Confidence Score" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Risk Level" }), _jsx(Badge, { variant: aiRec.riskLevel === 'High' ? 'destructive' : aiRec.riskLevel === 'Medium' ? 'secondary' : 'default', children: aiRec.riskLevel })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Timeline" }), _jsx("div", { className: "font-medium", children: aiRec.timeline })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Expected Impact" }), _jsx("div", { className: "font-medium text-sm", children: aiRec.expectedImpact })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium mb-2 block", children: "Key Reasoning" }), _jsx("ul", { className: "space-y-1", children: aiRec.reasoning.map((reason, index) => (_jsxs("li", { className: "text-sm flex items-start gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" }), reason] }, index))) })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium mb-2 block", children: "Recommended Actions" }), _jsx("ul", { className: "space-y-1", children: aiRec.actions.map((action, index) => (_jsxs("li", { className: "text-sm flex items-start gap-2", children: [_jsx(CheckCircle2, { className: "h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" }), action] }, index))) })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { className: "w-1/4 px-[0px] py-[8px]", children: [_jsx(Target, { className: "h-4 w-4 mr-1" }), "Implement Recommendation"] }), _jsxs(Button, { variant: "outline", onClick: () => handleViewContract(contract), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "View Contract"] }), _jsxs(Button, { variant: "outline", onClick: () => handleDownloadContract(contract), children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Export Analysis"] })] })] }) }, contract.id));
                                        }) }) })] }) }), _jsx(TabsContent, { value: "templates", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Contract Templates" }), _jsx(CardDescription, { children: "Pre-configured templates for quick contract creation" })] }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: contractTemplates.map((template) => (_jsx(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("h4", { className: "font-semibold", children: template.name }), _jsx(Badge, { variant: "outline", children: template.category })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: template.description }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", className: "flex-1", children: "Preview" }), _jsx(Button, { size: "sm", className: "flex-1", children: "Use Template" })] })] }) }, template.id))) }) })] }) }), _jsxs(TabsContent, { value: "analytics", className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Contracts" }), _jsx(FileText, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: contracts.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: _jsxs("span", { className: "text-green-600", children: [getExpiringContracts().length, " expiring soon"] }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Value" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", (contracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1), "M"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: _jsx("span", { className: "text-green-600", children: "Active contracts" }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Avg Performance" }), _jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: [Math.round(contracts.reduce((sum, c) => sum + c.performanceScore, 0) / contracts.length), "%"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: _jsx("span", { className: "text-yellow-600", children: "Mixed performance" }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "AI Recommendations" }), _jsx(Brain, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: Object.keys(aiRecommendations).length }), _jsx("p", { className: "text-xs text-muted-foreground", children: _jsx("span", { className: "text-blue-600", children: "Analysis complete" }) })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Contract Performance Overview" }), _jsx(CardDescription, { children: "Performance metrics and renewal recommendations across all contracts" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: contracts.map((contract) => {
                                                const aiRec = aiRecommendations[contract.id];
                                                return (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: contract.vendor }), _jsx("p", { className: "text-sm text-muted-foreground", children: contract.id })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Performance" }), _jsxs("div", { className: "font-semibold", children: [contract.performanceScore, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "SLA" }), _jsxs("div", { className: "font-semibold", children: [contract.slaCompliance, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Satisfaction" }), _jsxs("div", { className: "font-semibold", children: [contract.customerSatisfaction, "/5"] })] }), aiRec && (_jsx(Badge, { variant: getRecommendationColor(aiRec.recommendation), children: aiRec.recommendation }))] })] }, contract.id));
                                            }) }) })] })] })] }), _jsx(Dialog, { open: showContractDetail, onOpenChange: setShowContractDetail, children: _jsxs(DialogContent, { className: "max-w-6xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Contract Details - ", selectedContract?.id] }), _jsxs(DialogDescription, { children: [selectedContract?.vendor, " \u2022 ", selectedContract?.type] })] }), selectedContract && (_jsxs(Tabs, { value: activeDetailTab, onValueChange: setActiveDetailTab, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "summary", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Summary" }), _jsx(TabsTrigger, { value: "documents", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Documents" }), _jsx(TabsTrigger, { value: "timeline", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Timeline" }), _jsx(TabsTrigger, { value: "comments", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Comments" })] }), _jsxs(TabsContent, { value: "summary", className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Contract ID" }), _jsx("p", { className: "font-medium", children: selectedContract.id })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Vendor" }), _jsx("p", { className: "font-medium", children: selectedContract.vendor })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Client Department" }), _jsx("p", { className: "font-medium", children: selectedContract.client })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Contract Type" }), _jsx("p", { className: "font-medium", children: selectedContract.type })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Contract Value" }), _jsxs("p", { className: "font-medium", children: ["$", selectedContract.value.toLocaleString()] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Status" }), _jsx(Badge, { variant: getStatusColor(selectedContract.status), children: selectedContract.status })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Contract Period" }), _jsxs("p", { className: "font-medium", children: [selectedContract.startDate, " to ", selectedContract.endDate] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Signed Date" }), _jsx("p", { className: "font-medium", children: selectedContract.signedDate || 'Not signed' })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Next Action Required" }), _jsx("p", { className: "font-medium", children: selectedContract.nextAction })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Risk Level" }), _jsxs(Badge, { variant: getRiskColor(selectedContract.breachRisk), children: [selectedContract.breachRisk, " Risk"] })] })] })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Parties Involved" }), _jsx("div", { className: "mt-1", children: selectedContract.parties.map((party, index) => (_jsx(Badge, { variant: "outline", className: "mr-2 mb-1", children: party }, index))) })] }), selectedContract.description && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Description" }), _jsx("p", { className: "mt-1 p-3 bg-gray-50 rounded-lg", children: selectedContract.description })] })), selectedContract.terms && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Terms & Conditions" }), _jsx("p", { className: "mt-1 p-3 bg-gray-50 rounded-lg", children: selectedContract.terms })] })), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Performance Metrics" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-blue-600", children: [selectedContract.performanceScore, "%"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Performance Score" })] }), _jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-green-600", children: [selectedContract.slaCompliance, "%"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "SLA Compliance" })] }), _jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-purple-600", children: [selectedContract.customerSatisfaction, "/5"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Satisfaction" })] }), _jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsx("p", { className: "text-2xl font-bold text-orange-600", children: selectedContract.breachCount }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Breaches" })] })] })] }), selectedContract.attachedOffer && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Attached Offer" }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: selectedContract.attachedOffer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: selectedContract.attachedOffer.id }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsxs(Badge, { variant: "outline", children: [selectedContract.attachedOffer.discount, "% discount"] }), _jsx(Badge, { className: "bg-blue-100 text-blue-800", children: selectedContract.attachedOffer.status })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleViewOffer(selectedContract), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "View Offer"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleChangeOffer(selectedContract), children: [_jsx(Edit, { className: "h-4 w-4 mr-1" }), "Change"] })] })] }), (selectedContract.attachedOffer.appliedDiscounts?.length > 0 || selectedContract.attachedOffer.promoCodes?.length > 0) && (_jsx("div", { className: "mt-3 pt-3 border-t", children: renderPromoCodesAndDiscounts(selectedContract.attachedOffer.appliedDiscounts, selectedContract.attachedOffer.promoCodes) }))] }) })] }))] }), _jsxs(TabsContent, { value: "documents", className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-medium", children: "Contract Documents" }), _jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Plus, { className: "h-4 w-4 mr-1" }), "Add Document"] })] }), selectedContract.attachments && selectedContract.attachments.length > 0 ? (_jsx("div", { className: "space-y-2", children: selectedContract.attachments.map((doc, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(FileText, { className: "h-5 w-5 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: doc.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [doc.size, " \u2022 ", doc.type, " \u2022 Uploaded ", doc.uploadDate] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "ghost", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", children: _jsx(Download, { className: "h-4 w-4" }) })] })] }, index))) })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "No documents attached to this contract" }))] }), _jsxs(TabsContent, { value: "timeline", className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Contract Milestones" }), _jsx("div", { className: "space-y-4", children: selectedContract.milestones.map((milestone, index) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Badge, { variant: getMilestoneStatus(milestone.status), children: milestone.status }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium", children: milestone.name }), _jsx("p", { className: "text-sm text-muted-foreground", children: milestone.date })] })] }, index))) })] }), _jsxs(TabsContent, { value: "comments", className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-medium", children: "Contract Comments" }), _jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Plus, { className: "h-4 w-4 mr-1" }), "Add Comment"] })] }), selectedContract.comments && selectedContract.comments.length > 0 ? (_jsx("div", { className: "space-y-4", children: selectedContract.comments.map((comment) => (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-sm font-medium text-blue-600", children: comment.author.split(' ').map(n => n[0]).join('') }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: comment.author }), _jsx("p", { className: "text-xs text-muted-foreground", children: comment.date })] })] }) }), _jsx("p", { className: "text-sm", children: comment.content })] }, comment.id))) })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "No comments on this contract" }))] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowContractDetail(false), children: "Close" }), _jsxs(Button, { variant: "outline", onClick: () => handleDownloadContract(selectedContract), children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Download Contract"] }), _jsxs(Button, { children: [_jsx(Edit, { className: "h-4 w-4 mr-1" }), "Edit Contract"] })] })] }) }), _jsx(Dialog, { open: showAIRecommendation, onOpenChange: setShowAIRecommendation, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "h-5 w-5" }), "AI Contract Analysis - ", selectedContract?.id] }), _jsxs(DialogDescription, { children: ["Comprehensive AI-powered analysis and recommendations for ", selectedContract?.vendor] })] }), selectedContract && aiRecommendations[selectedContract.id] && (_jsx("div", { className: "space-y-6", children: (() => {
                                const aiRec = aiRecommendations[selectedContract.id];
                                const RecommendationIcon = getRecommendationIcon(aiRec.recommendation);
                                return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-muted rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(RecommendationIcon, { className: "h-8 w-8" }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold", children: ["Recommendation: ", aiRec.recommendation] }), _jsxs("p", { className: "text-muted-foreground", children: ["Confidence Score: ", aiRec.confidence, "%"] })] })] }), _jsx(Badge, { variant: getRecommendationColor(aiRec.recommendation), className: "text-lg p-2", children: aiRec.recommendation })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: [selectedContract.performanceScore, "%"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Performance Score" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: [selectedContract.slaCompliance, "%"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "SLA Compliance" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: [selectedContract.customerSatisfaction, "/5"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Satisfaction" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: selectedContract.breachCount }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Breaches" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Key Analysis Points" }) }), _jsx(CardContent, { children: _jsx("ul", { className: "space-y-2", children: aiRec.reasoning.map((reason, index) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-sm", children: reason })] }, index))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Recommended Actions" }) }), _jsx(CardContent, { children: _jsx("ul", { className: "space-y-2", children: aiRec.actions.map((action, index) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(Target, { className: "h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-sm", children: action })] }, index))) }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Expected Impact" }), _jsx("div", { className: "font-medium", children: aiRec.expectedImpact })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Implementation Timeline" }), _jsx("div", { className: "font-medium", children: aiRec.timeline })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Risk Level" }), _jsx(Badge, { variant: aiRec.riskLevel === 'High' ? 'destructive' : aiRec.riskLevel === 'Medium' ? 'secondary' : 'default', children: aiRec.riskLevel })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Market Context & Alternatives" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Vendor Market Position" }), _jsx("p", { className: "mt-1", children: selectedContract.marketPosition })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Financial Health" }), _jsx("p", { className: "mt-1", children: selectedContract.financialHealth })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Technical Capability" }), _jsx("p", { className: "mt-1", children: selectedContract.technicalCapability })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Relationship Score" }), _jsxs("p", { className: "mt-1", children: [selectedContract.relationshipScore, "/5"] })] })] }), selectedContract.alternativeVendors.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx(Label, { className: "text-sm font-medium", children: "Alternative Vendors" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: selectedContract.alternativeVendors.map((vendor, index) => (_jsx(Badge, { variant: "outline", children: vendor }, index))) })] }))] })] })] }));
                            })() })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowAIRecommendation(false), children: "Close" }), _jsxs(Button, { variant: "outline", onClick: () => handleDownloadContract(selectedContract), children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Export Analysis"] }), _jsxs(Button, { children: [_jsx(Target, { className: "h-4 w-4 mr-1" }), "Implement Recommendation"] })] })] }) }), _jsx(Dialog, { open: showOfferDetail, onOpenChange: setShowOfferDetail, children: _jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Attached Offer Details" }), _jsxs(DialogDescription, { children: ["Details of the offer attached to contract ", selectedContract?.id] })] }), selectedOffer && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: selectedOffer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: selectedOffer.id })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { className: "bg-blue-100 text-blue-800", children: selectedOffer.status }), _jsxs(Badge, { variant: "outline", children: [selectedOffer.discount, "% discount"] })] })] }), (selectedOffer.appliedDiscounts?.length > 0 || selectedOffer.promoCodes?.length > 0) && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: "Applied Promotions" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [selectedOffer.appliedDiscounts?.length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-2 block", children: "Applied Discounts" }), _jsx("div", { className: "space-y-2", children: selectedOffer.appliedDiscounts.map(discountId => {
                                                                    const discount = mockDiscounts.find(d => d.id === discountId);
                                                                    return discount ? (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Percent, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: discount.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: discount.description })] })] }), _jsx(Badge, { variant: "secondary", children: discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}` })] }, discountId)) : null;
                                                                }) })] })), selectedOffer.promoCodes?.length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-2 block", children: "Applied Promo Codes" }), _jsx("div", { className: "space-y-2", children: selectedOffer.promoCodes.map(promoId => {
                                                                    const promo = mockPromoCodes.find(p => p.id === promoId);
                                                                    return promo ? (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Tag, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm font-mono text-blue-600", children: promo.code }), _jsx("p", { className: "text-xs text-muted-foreground", children: promo.description })] })] }), _jsx(Badge, { variant: "outline", children: promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}` })] }, promoId)) : null;
                                                                }) })] }))] }) })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Valid Period" }), _jsxs("p", { children: [selectedOffer.validFrom, " to ", selectedOffer.validTo] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Discount" }), _jsxs("p", { children: [selectedOffer.discount, "%"] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Type" }), _jsx("p", { children: selectedOffer.type })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Status" }), _jsx(Badge, { className: "bg-blue-100 text-blue-800", children: selectedOffer.status })] })] })] }), selectedOffer.description && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Description" }), _jsx("p", { className: "mt-1 p-3 bg-gray-50 rounded-lg", children: selectedOffer.description })] }))] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowOfferDetail(false), children: "Close" }), _jsxs(Button, { onClick: () => {
                                        setShowOfferDetail(false);
                                        handleChangeOffer(selectedContract);
                                    }, children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Change Offer"] })] })] }) }), _jsx(Dialog, { open: showChangeOffer, onOpenChange: setShowChangeOffer, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Change Attached Offer" }), _jsxs(DialogDescription, { children: ["Select a different offer to attach to contract ", selectedContract?.id] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h4", { className: "font-medium mb-2", children: "Current Contract" }), _jsxs("p", { children: [selectedContract?.id, " - ", selectedContract?.vendor] }), selectedContract?.attachedOffer && (_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Currently attached: ", selectedContract.attachedOffer.title] }))] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium mb-3 block", children: "Available Offers" }), _jsxs("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: [_jsx("div", { className: "p-3 border rounded-lg hover:bg-gray-50 cursor-pointer", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "No Offer" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Remove the attached offer" })] }), _jsx(Button, { size: "sm", variant: "outline", children: "Select" })] }) }), mockOffers.map((offer) => (_jsx("div", { className: "p-3 border rounded-lg hover:bg-gray-50 cursor-pointer", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("p", { className: "font-medium text-sm", children: offer.title }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: [offer.discount, "% discount"] }), _jsx(Badge, { className: "text-xs bg-blue-100 text-blue-800", children: offer.status })] }), _jsx("p", { className: "text-xs text-muted-foreground mb-2", children: offer.description }), (offer.appliedDiscounts?.length > 0 || offer.promoCodes?.length > 0) && (_jsx("div", { className: "mt-2", children: renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes) }))] }), _jsx(Button, { size: "sm", variant: selectedContract?.attachedOffer?.id === offer.id ? "default" : "outline", disabled: selectedContract?.attachedOffer?.id === offer.id, children: selectedContract?.attachedOffer?.id === offer.id ? "Current" : "Select" })] }) }, offer.id)))] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowChangeOffer(false), children: "Cancel" }), _jsx(Button, { onClick: () => setShowChangeOffer(false), children: "Update Contract" })] })] }) })] }));
}
