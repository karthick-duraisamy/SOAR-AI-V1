import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { AlertTriangle, Plus, Eye, Edit, Clock, CheckCircle, User, Calendar, Target, TrendingUp, Shield, AlertCircle, Filter, Brain, Send, FileText, History, Lightbulb, Bell, ExternalLink, Download, Users, DollarSign, Zap } from 'lucide-react';
const breaches = [
    {
        id: 'BR-2024-001',
        contractId: 'CTR-2024-001',
        vendor: 'Global Travel Solutions',
        breachType: 'SLA Violation',
        severity: 'High',
        date: '2024-06-15',
        description: 'Response time exceeded 4 hours for customer support',
        status: 'In Progress',
        assignedTo: 'John Smith',
        dueDate: '2024-06-30',
        riskScore: 85,
        actionTaken: 'Vendor meeting scheduled, corrective action plan requested',
        impactLevel: 'Critical',
        financialImpact: 25000,
        affectedCustomers: 47,
        vendorContact: 'support@globaltravelsolutions.com',
        timeline: [
            { date: '2024-06-15 09:30', event: 'Breach detected by monitoring system', type: 'system' },
            { date: '2024-06-15 10:00', event: 'Breach reported by John Smith', type: 'user' },
            { date: '2024-06-15 14:30', event: 'Initial vendor notification sent', type: 'notification' },
            { date: '2024-06-16 09:00', event: 'Vendor acknowledgment received', type: 'vendor' },
            { date: '2024-06-17 15:00', event: 'Corrective action plan requested', type: 'action' }
        ],
        rootCause: 'Insufficient staffing during peak hours',
        contractClause: 'Section 3.2 - Service Level Requirements'
    },
    {
        id: 'BR-2024-002',
        contractId: 'CTR-2024-002',
        vendor: 'Corporate Journey Ltd',
        breachType: 'Performance',
        severity: 'Medium',
        date: '2024-06-10',
        description: 'Booking accuracy below 95% threshold',
        status: 'Resolved',
        assignedTo: 'Sarah Johnson',
        dueDate: '2024-06-25',
        riskScore: 45,
        actionTaken: 'Training provided to vendor staff, process improvements implemented',
        impactLevel: 'Moderate',
        financialImpact: 8500,
        affectedCustomers: 23,
        vendorContact: 'operations@corporatejourney.com',
        timeline: [
            { date: '2024-06-10 08:00', event: 'Performance metrics review flagged issue', type: 'system' },
            { date: '2024-06-10 11:30', event: 'Breach documented by Sarah Johnson', type: 'user' },
            { date: '2024-06-11 09:00', event: 'Vendor training session scheduled', type: 'action' },
            { date: '2024-06-14 14:00', event: 'Training completed, process improvements deployed', type: 'resolution' },
            { date: '2024-06-18 16:00', event: 'Performance metrics verified - breach resolved', type: 'resolution' }
        ],
        rootCause: 'Outdated booking system interface causing user errors',
        contractClause: 'Section 4.1 - Performance Standards'
    },
    {
        id: 'BR-2024-003',
        contractId: 'CTR-2024-004',
        vendor: 'Premier Voyage Group',
        breachType: 'Financial',
        severity: 'High',
        date: '2024-06-08',
        description: 'Late payment penalty clause triggered',
        status: 'Pending Review',
        assignedTo: 'Mike Davis',
        dueDate: '2024-06-28',
        riskScore: 92,
        actionTaken: 'Financial review initiated, penalty assessment in progress',
        impactLevel: 'Critical',
        financialImpact: 45000,
        affectedCustomers: 0,
        vendorContact: 'finance@premiervoyage.com',
        timeline: [
            { date: '2024-06-08 17:00', event: 'Payment deadline missed', type: 'system' },
            { date: '2024-06-09 09:00', event: 'Automatic penalty calculation triggered', type: 'system' },
            { date: '2024-06-09 10:30', event: 'Financial review team notified', type: 'notification' },
            { date: '2024-06-10 14:00', event: 'Vendor contacted for explanation', type: 'vendor' }
        ],
        rootCause: 'Cash flow issues and delayed invoice processing',
        contractClause: 'Section 7.3 - Payment Terms and Penalties'
    },
    {
        id: 'BR-2024-004',
        contractId: 'CTR-2024-003',
        vendor: 'Elite Business Travel',
        breachType: 'Compliance',
        severity: 'Low',
        date: '2024-06-05',
        description: 'Documentation submission delay',
        status: 'Resolved',
        assignedTo: 'Lisa Wong',
        dueDate: '2024-06-20',
        riskScore: 25,
        actionTaken: 'Documents received, compliance verified',
        impactLevel: 'Minor',
        financialImpact: 0,
        affectedCustomers: 0,
        vendorContact: 'compliance@elitebusinesstravel.com',
        timeline: [
            { date: '2024-06-05 12:00', event: 'Documentation deadline missed', type: 'system' },
            { date: '2024-06-05 14:00', event: 'Compliance team notified', type: 'notification' },
            { date: '2024-06-06 09:00', event: 'Vendor contacted for status update', type: 'vendor' },
            { date: '2024-06-07 16:30', event: 'Documents received and verified', type: 'resolution' }
        ],
        rootCause: 'Internal process delay due to staff absence',
        contractClause: 'Section 6.1 - Compliance and Documentation Requirements'
    }
];
const contractRiskScores = [
    { contractId: 'CTR-2024-001', vendor: 'Global Travel Solutions', riskScore: 75, trend: 'increasing', factors: ['SLA violations', 'Performance decline'] },
    { contractId: 'CTR-2024-002', vendor: 'Corporate Journey Ltd', riskScore: 35, trend: 'stable', factors: ['Good performance', 'Minor issues resolved'] },
    { contractId: 'CTR-2024-003', vendor: 'Elite Business Travel', riskScore: 28, trend: 'decreasing', factors: ['Improving metrics', 'Proactive compliance'] },
    { contractId: 'CTR-2024-004', vendor: 'Premier Voyage Group', riskScore: 88, trend: 'increasing', factors: ['Financial issues', 'Multiple breaches'] }
];
const aiRecommendations = {
    'BR-2024-001': [
        {
            type: 'immediate',
            priority: 'High',
            title: 'Implement 24/7 Monitoring',
            description: 'Deploy automated monitoring system to track response times in real-time and trigger alerts before SLA violations occur.',
            impact: 'Reduces future SLA violations by 75%',
            effort: 'Medium',
            timeline: '2-3 weeks'
        },
        {
            type: 'strategic',
            priority: 'High',
            title: 'Renegotiate SLA Terms',
            description: 'Consider adjusting SLA requirements based on realistic vendor capacity during peak periods.',
            impact: 'Balances expectations with operational reality',
            effort: 'Low',
            timeline: '1 week'
        },
        {
            type: 'preventive',
            priority: 'Medium',
            title: 'Vendor Performance Review',
            description: 'Schedule quarterly performance reviews with escalation procedures for consistent underperformance.',
            impact: 'Improves long-term vendor accountability',
            effort: 'Low',
            timeline: 'Ongoing'
        }
    ],
    'BR-2024-002': [
        {
            type: 'immediate',
            priority: 'Medium',
            title: 'System Integration Review',
            description: 'Audit booking system integration points to identify and resolve accuracy bottlenecks.',
            impact: 'Improves booking accuracy to 98%+',
            effort: 'High',
            timeline: '4-6 weeks'
        },
        {
            type: 'training',
            priority: 'Medium',
            title: 'Enhanced User Training',
            description: 'Implement comprehensive training program with certification requirements for booking staff.',
            impact: 'Reduces user errors by 60%',
            effort: 'Medium',
            timeline: '2-3 weeks'
        }
    ],
    'BR-2024-003': [
        {
            type: 'financial',
            priority: 'High',
            title: 'Payment Plan Negotiation',
            description: 'Establish structured payment plan with milestone-based penalty reductions to ensure cash flow recovery.',
            impact: 'Reduces financial risk exposure',
            effort: 'Medium',
            timeline: '1-2 weeks'
        },
        {
            type: 'monitoring',
            priority: 'High',
            title: 'Financial Health Monitoring',
            description: 'Implement monthly financial health assessments with early warning indicators.',
            impact: 'Prevents future financial breaches',
            effort: 'Medium',
            timeline: '2 weeks'
        }
    ],
    'BR-2024-004': [
        {
            type: 'process',
            priority: 'Low',
            title: 'Automated Reminder System',
            description: 'Implement automated reminder system for documentation deadlines with escalation procedures.',
            impact: 'Eliminates documentation delays',
            effort: 'Low',
            timeline: '1 week'
        }
    ]
};
export function BreachMonitoring({ initialFilters }) {
    const [selectedBreach, setSelectedBreach] = useState(null);
    const [isCreatingBreach, setIsCreatingBreach] = useState(false);
    const [showBreachDetails, setShowBreachDetails] = useState(false);
    const [showAIRecommendations, setShowAIRecommendations] = useState(false);
    const [showVendorNotification, setShowVendorNotification] = useState(false);
    const [filters, setFilters] = useState({
        severity: '',
        status: '',
        assignedTo: '',
        ...initialFilters
    });
    const [newBreach, setNewBreach] = useState({
        contractId: '',
        breachType: '',
        severity: '',
        description: '',
        assignedTo: '',
        dueDate: ''
    });
    const [notificationData, setNotificationData] = useState({
        recipient: '',
        subject: '',
        message: '',
        urgency: 'Medium',
        includeDetails: true,
        requireResponse: true,
        escalationLevel: 'Standard'
    });
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'High': return 'destructive';
            case 'Medium': return 'secondary';
            case 'Low': return 'outline';
            default: return 'outline';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'default';
            case 'In Progress': return 'secondary';
            case 'Pending Review': return 'outline';
            default: return 'outline';
        }
    };
    const getRiskColor = (score) => {
        if (score >= 70)
            return 'text-red-600';
        if (score >= 40)
            return 'text-yellow-600';
        return 'text-green-600';
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'increasing': return _jsx(TrendingUp, { className: "h-4 w-4 text-red-500" });
            case 'decreasing': return _jsx(TrendingUp, { className: "h-4 w-4 text-green-500 rotate-180" });
            default: return _jsx("div", { className: "h-4 w-4 bg-gray-300 rounded-full" });
        }
    };
    const getImpactColor = (impact) => {
        switch (impact) {
            case 'Critical': return 'text-red-600';
            case 'Moderate': return 'text-yellow-600';
            case 'Minor': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'destructive';
            case 'Medium': return 'secondary';
            case 'Low': return 'outline';
            default: return 'outline';
        }
    };
    const getTimelineIcon = (type) => {
        switch (type) {
            case 'system': return _jsx(Zap, { className: "h-4 w-4 text-blue-500" });
            case 'user': return _jsx(User, { className: "h-4 w-4 text-green-500" });
            case 'notification': return _jsx(Bell, { className: "h-4 w-4 text-yellow-500" });
            case 'vendor': return _jsx(ExternalLink, { className: "h-4 w-4 text-purple-500" });
            case 'action': return _jsx(Target, { className: "h-4 w-4 text-orange-500" });
            case 'resolution': return _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
            default: return _jsx(Clock, { className: "h-4 w-4 text-gray-500" });
        }
    };
    const handleCreateBreach = () => {
        console.log('Creating breach:', newBreach);
        setIsCreatingBreach(false);
        setNewBreach({
            contractId: '',
            breachType: '',
            severity: '',
            description: '',
            assignedTo: '',
            dueDate: ''
        });
    };
    const handleViewDetails = (breach) => {
        setSelectedBreach(breach);
        setShowBreachDetails(true);
    };
    const handleShowAIRecommendations = (breach) => {
        setSelectedBreach(breach);
        setShowAIRecommendations(true);
    };
    const handleNotifyVendor = (breach) => {
        setSelectedBreach(breach);
        setNotificationData({
            ...notificationData,
            recipient: breach.vendorContact,
            subject: `Contract Breach Notification - ${breach.id}`,
            message: `Dear ${breach.vendor},\n\nWe have identified a contract breach in your service delivery:\n\nBreach Type: ${breach.breachType}\nSeverity: ${breach.severity}\nDescription: ${breach.description}\n\nImmediate action is required to address this issue. Please provide a corrective action plan within 48 hours.\n\nRegards,\nSOAR-AI Contract Management Team`
        });
        setShowVendorNotification(true);
    };
    const handleSendNotification = () => {
        console.log('Sending notification:', notificationData);
        setShowVendorNotification(false);
        // Here you would integrate with email/notification service
    };
    return (_jsxs("div", { className: "w-full h-full space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Breach Monitoring" }), _jsx("p", { className: "text-muted-foreground", children: "Track contract breaches, risk assessment, and resolution progress" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Dialog, { open: isCreatingBreach, onOpenChange: setIsCreatingBreach, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "flex items-center gap-2", children: [_jsx(Plus, { className: "h-4 w-4" }), "Report Breach"] }) }), _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Report New Breach" }), _jsx(DialogDescription, { children: "Document a contract breach and assign resolution responsibility" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "contractId", children: "Contract ID" }), _jsxs(Select, { value: newBreach.contractId, onValueChange: (value) => setNewBreach({ ...newBreach, contractId: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select contract" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "CTR-2024-001", children: "CTR-2024-001 - Global Travel Solutions" }), _jsx(SelectItem, { value: "CTR-2024-002", children: "CTR-2024-002 - Corporate Journey Ltd" }), _jsx(SelectItem, { value: "CTR-2024-003", children: "CTR-2024-003 - Elite Business Travel" }), _jsx(SelectItem, { value: "CTR-2024-004", children: "CTR-2024-004 - Premier Voyage Group" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "breachType", children: "Breach Type" }), _jsxs(Select, { value: newBreach.breachType, onValueChange: (value) => setNewBreach({ ...newBreach, breachType: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "SLA Violation", children: "SLA Violation" }), _jsx(SelectItem, { value: "Performance", children: "Performance" }), _jsx(SelectItem, { value: "Financial", children: "Financial" }), _jsx(SelectItem, { value: "Compliance", children: "Compliance" }), _jsx(SelectItem, { value: "Security", children: "Security" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "severity", children: "Severity" }), _jsxs(Select, { value: newBreach.severity, onValueChange: (value) => setNewBreach({ ...newBreach, severity: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select severity" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "assignedTo", children: "Assign To" }), _jsxs(Select, { value: newBreach.assignedTo, onValueChange: (value) => setNewBreach({ ...newBreach, assignedTo: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select assignee" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "John Smith", children: "John Smith" }), _jsx(SelectItem, { value: "Sarah Johnson", children: "Sarah Johnson" }), _jsx(SelectItem, { value: "Mike Davis", children: "Mike Davis" }), _jsx(SelectItem, { value: "Lisa Wong", children: "Lisa Wong" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "dueDate", children: "Resolution Due Date" }), _jsx(Input, { id: "dueDate", type: "date", value: newBreach.dueDate, onChange: (e) => setNewBreach({ ...newBreach, dueDate: e.target.value }) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "description", children: "Breach Description" }), _jsx(Textarea, { id: "description", placeholder: "Describe the breach details, impact, and any immediate actions taken...", value: newBreach.description, onChange: (e) => setNewBreach({ ...newBreach, description: e.target.value }) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsCreatingBreach(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreateBreach, children: "Report Breach" })] })] })] }), _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4" }), "Filters"] })] })] }), _jsxs(Tabs, { defaultValue: "breach-list", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "breach-list", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Breach Reports" }), _jsx(TabsTrigger, { value: "risk-assessment", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Risk Assessment" }), _jsx(TabsTrigger, { value: "analytics", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Analytics" })] }), _jsx(TabsContent, { value: "breach-list", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Contract Breach Reports" }), _jsx(CardDescription, { children: "All reported breaches with their resolution status and management actions" })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Breach ID" }), _jsx(TableHead, { children: "Contract" }), _jsx(TableHead, { children: "Type" }), _jsx(TableHead, { children: "Severity" }), _jsx(TableHead, { children: "Date" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Assigned To" }), _jsx(TableHead, { children: "Due Date" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: breaches.map((breach) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: breach.id }), _jsx(TableCell, { children: _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: breach.contractId }), _jsx("div", { className: "text-sm text-muted-foreground", children: breach.vendor })] }) }), _jsx(TableCell, { children: breach.breachType }), _jsx(TableCell, { children: _jsx(Badge, { variant: getSeverityColor(breach.severity), children: breach.severity }) }), _jsx(TableCell, { children: breach.date }), _jsx(TableCell, { children: _jsx(Badge, { variant: getStatusColor(breach.status), children: breach.status }) }), _jsx(TableCell, { children: _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx(User, { className: "h-3 w-3" }), _jsx("span", { children: breach.assignedTo })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsx("span", { children: breach.dueDate })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleViewDetails(breach), title: "View Details", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleShowAIRecommendations(breach), title: "AI Recommendations", children: _jsx(Brain, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleNotifyVendor(breach), title: "Notify Vendor", children: _jsx(Send, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Edit, { className: "h-4 w-4" }) })] }) })] }, breach.id))) })] }) })] }) }), _jsx(TabsContent, { value: "risk-assessment", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-5 w-5" }), "Contract Risk Assessment"] }), _jsx(CardDescription, { children: "AI-powered breach risk scores and trend analysis" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: contractRiskScores.map((contract) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold", children: contract.contractId }), _jsx("p", { className: "text-sm text-muted-foreground", children: contract.vendor })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm font-medium", children: "Risk Trend" }), _jsx("div", { className: "flex items-center justify-center", children: getTrendIcon(contract.trend) })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm font-medium", children: "Risk Score" }), _jsx("div", { className: `text-2xl font-bold ${getRiskColor(contract.riskScore)}`, children: contract.riskScore })] }), _jsx(Progress, { value: contract.riskScore, className: "w-24" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Risk Factors" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: contract.factors.map((factor) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: factor }, factor))) })] })] }) }, contract.contractId))) }) })] }) }), _jsxs(TabsContent, { value: "analytics", className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Breaches" }), _jsx(AlertTriangle, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: breaches.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: _jsx("span", { className: "text-red-600", children: "2 High severity" }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Resolution Rate" }), _jsx(CheckCircle, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "50%" }), _jsx("p", { className: "text-xs text-muted-foreground", children: _jsx("span", { className: "text-green-600", children: "2 of 4 resolved" }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Avg. Resolution Time" }), _jsx(Clock, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "12 days" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-green-600", children: "-3 days" }), " from last month"] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Breach Resolution Timeline" }), _jsx(CardDescription, { children: "Track resolution progress and identify bottlenecks" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-6", children: breaches.filter(b => b.status !== 'Resolved').map((breach) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h4", { className: "font-medium", children: [breach.id, " - ", breach.vendor] }), _jsx(Badge, { variant: getSeverityColor(breach.severity), children: breach.severity })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [_jsxs("span", { children: ["Due: ", breach.dueDate] }), _jsxs("span", { children: ["Assigned: ", breach.assignedTo] }), _jsxs("span", { children: ["Status: ", breach.status] })] }), _jsx(Progress, { value: breach.status === 'In Progress' ? 60 : 30, className: "w-full" }), _jsx("p", { className: "text-sm", children: breach.actionTaken })] }, breach.id))) }) })] })] })] }), _jsx(Dialog, { open: showBreachDetails, onOpenChange: setShowBreachDetails, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "h-5 w-5" }), "Breach Details - ", selectedBreach?.id] }), _jsx(DialogDescription, { children: "Comprehensive breach information and impact analysis" })] }), selectedBreach && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertTriangle, { className: `h-8 w-8 mx-auto mb-2 ${selectedBreach.severity === 'High' ? 'text-red-500' : selectedBreach.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'}` }), _jsx("div", { className: "font-medium", children: "Severity" }), _jsx(Badge, { variant: getSeverityColor(selectedBreach.severity), children: selectedBreach.severity })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx(DollarSign, { className: "h-8 w-8 mx-auto mb-2 text-red-500" }), _jsx("div", { className: "font-medium", children: "Financial Impact" }), _jsxs("div", { className: "text-lg font-bold", children: ["$", selectedBreach.financialImpact?.toLocaleString()] })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx(Users, { className: "h-8 w-8 mx-auto mb-2 text-blue-500" }), _jsx("div", { className: "font-medium", children: "Affected Customers" }), _jsx("div", { className: "text-lg font-bold", children: selectedBreach.affectedCustomers })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx(Target, { className: "h-8 w-8 mx-auto mb-2 text-purple-500" }), _jsx("div", { className: "font-medium", children: "Risk Score" }), _jsxs("div", { className: `text-lg font-bold ${getRiskColor(selectedBreach.riskScore)}`, children: [selectedBreach.riskScore, "/100"] })] }) }) })] }), _jsxs(Tabs, { defaultValue: "overview", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "overview", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Overview" }), _jsx(TabsTrigger, { value: "timeline", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Timeline" }), _jsx(TabsTrigger, { value: "impact", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Impact Analysis" }), _jsx(TabsTrigger, { value: "contract", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Contract Details" })] }), _jsx(TabsContent, { value: "overview", className: "space-y-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Breach Summary" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Contract ID" }), _jsx("p", { className: "font-medium", children: selectedBreach.contractId })] }), _jsxs("div", { children: [_jsx(Label, { children: "Vendor" }), _jsx("p", { className: "font-medium", children: selectedBreach.vendor })] }), _jsxs("div", { children: [_jsx(Label, { children: "Breach Type" }), _jsx("p", { className: "font-medium", children: selectedBreach.breachType })] }), _jsxs("div", { children: [_jsx(Label, { children: "Status" }), _jsx(Badge, { variant: getStatusColor(selectedBreach.status), children: selectedBreach.status })] }), _jsxs("div", { children: [_jsx(Label, { children: "Date Reported" }), _jsx("p", { className: "font-medium", children: selectedBreach.date })] }), _jsxs("div", { children: [_jsx(Label, { children: "Resolution Due" }), _jsx("p", { className: "font-medium", children: selectedBreach.dueDate })] })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsx(Label, { children: "Description" }), _jsx("p", { className: "mt-1", children: selectedBreach.description })] }), _jsxs("div", { children: [_jsx(Label, { children: "Root Cause Analysis" }), _jsx("p", { className: "mt-1", children: selectedBreach.rootCause })] }), _jsxs("div", { children: [_jsx(Label, { children: "Action Taken" }), _jsx("p", { className: "mt-1", children: selectedBreach.actionTaken })] })] })] }) }), _jsx(TabsContent, { value: "timeline", className: "space-y-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(History, { className: "h-5 w-5" }), "Breach Timeline"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: selectedBreach.timeline?.map((event, index) => (_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-full bg-muted", children: getTimelineIcon(event.type) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "font-medium", children: event.event }), _jsx("span", { className: "text-sm text-muted-foreground", children: event.date })] }), _jsx(Badge, { variant: "outline", className: "text-xs mt-1", children: event.type })] })] }, index))) }) })] }) }), _jsx(TabsContent, { value: "impact", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Financial Impact" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Direct Costs:" }), _jsxs("span", { className: "font-medium", children: ["$", selectedBreach.financialImpact?.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Estimated Penalties:" }), _jsx("span", { className: "font-medium", children: "$5,000" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Recovery Costs:" }), _jsx("span", { className: "font-medium", children: "$2,500" })] }), _jsx(Separator, {}), _jsxs("div", { className: "flex justify-between font-bold", children: [_jsx("span", { children: "Total Impact:" }), _jsxs("span", { children: ["$", (selectedBreach.financialImpact + 7500)?.toLocaleString()] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Business Impact" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Impact Level:" }), _jsx(Badge, { variant: selectedBreach.impactLevel === 'Critical' ? 'destructive' : selectedBreach.impactLevel === 'Moderate' ? 'secondary' : 'outline', children: selectedBreach.impactLevel })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Customers Affected:" }), _jsx("span", { className: "font-medium", children: selectedBreach.affectedCustomers })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Service Disruption:" }), _jsx("span", { className: "font-medium", children: "4 hours" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Reputation Impact:" }), _jsx("span", { className: `font-medium ${getImpactColor(selectedBreach.impactLevel)}`, children: selectedBreach.impactLevel })] })] })] })] }) }), _jsx(TabsContent, { value: "contract", className: "space-y-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5" }), "Contract Information"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Relevant Contract Clause" }), _jsx("p", { className: "mt-1 font-medium", children: selectedBreach.contractClause })] }), _jsxs("div", { children: [_jsx(Label, { children: "Vendor Contact" }), _jsx("p", { className: "mt-1", children: selectedBreach.vendorContact })] }), _jsxs("div", { children: [_jsx(Label, { children: "Contract Manager" }), _jsx("p", { className: "mt-1", children: selectedBreach.assignedTo })] }), _jsx(Separator, {}), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(Download, { className: "h-4 w-4" }), "Download Contract"] }), _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(ExternalLink, { className: "h-4 w-4" }), "View Full Contract"] })] })] })] }) })] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowBreachDetails(false), children: "Close" }), _jsx(Button, { onClick: () => handleShowAIRecommendations(selectedBreach), children: "Get AI Recommendations" }), _jsx(Button, { onClick: () => handleNotifyVendor(selectedBreach), children: "Notify Vendor" })] })] }) }), _jsx(Dialog, { open: showAIRecommendations, onOpenChange: setShowAIRecommendations, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "h-5 w-5" }), "AI Recommendations - ", selectedBreach?.id] }), _jsx(DialogDescription, { children: "Intelligent suggestions for breach resolution and prevention" })] }), selectedBreach && aiRecommendations[selectedBreach.id] && (_jsxs("div", { className: "space-y-4", children: [_jsxs(Alert, { className: "border-blue-200 bg-blue-50", children: [_jsx(Lightbulb, { className: "h-4 w-4 text-blue-600" }), _jsx(AlertDescription, { className: "text-blue-800", children: "Our AI system has analyzed similar breaches, contract terms, and vendor performance to generate these recommendations." })] }), _jsx("div", { className: "space-y-4", children: aiRecommendations[selectedBreach.id].map((recommendation, index) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: getPriorityColor(recommendation.priority), children: recommendation.priority }), _jsx(Badge, { variant: "outline", children: recommendation.type })] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Timeline: ", recommendation.timeline] })] }), _jsx("h4", { className: "font-semibold mb-2", children: recommendation.title }), _jsx("p", { className: "text-sm mb-3", children: recommendation.description }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx(Label, { children: "Expected Impact" }), _jsx("p", { className: "text-green-600 font-medium", children: recommendation.impact })] }), _jsxs("div", { children: [_jsx(Label, { children: "Implementation Effort" }), _jsx(Badge, { variant: recommendation.effort === 'High' ? 'destructive' : recommendation.effort === 'Medium' ? 'secondary' : 'outline', children: recommendation.effort })] })] })] }) }, index))) }), _jsx(Card, { className: "border-green-200 bg-green-50", children: _jsxs(CardContent, { className: "p-4", children: [_jsx("h4", { className: "font-semibold text-green-800 mb-2", children: "Recommended Action Plan" }), _jsxs("ol", { className: "list-decimal list-inside space-y-1 text-sm text-green-700", children: [_jsxs("li", { children: ["Implement immediate monitoring for ", selectedBreach.breachType, " violations"] }), _jsx("li", { children: "Schedule vendor meeting within 48 hours to discuss corrective actions" }), _jsx("li", { children: "Document all communications and agreements for compliance tracking" }), _jsx("li", { children: "Set up automated alerts for similar breach patterns" })] })] }) })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowAIRecommendations(false), children: "Close" }), _jsxs(Button, { className: "flex items-center gap-2", children: [_jsx(Download, { className: "h-4 w-4" }), "Export Recommendations"] })] })] }) }), _jsx(Dialog, { open: showVendorNotification, onOpenChange: setShowVendorNotification, children: _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Send, { className: "h-5 w-5" }), "Notify Vendor - ", selectedBreach?.vendor] }), _jsx(DialogDescription, { children: "Send breach notification and corrective action request to vendor" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "recipient", children: "Recipient Email" }), _jsx(Input, { id: "recipient", value: notificationData.recipient, onChange: (e) => setNotificationData({ ...notificationData, recipient: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "urgency", children: "Urgency Level" }), _jsxs(Select, { value: notificationData.urgency, onValueChange: (value) => setNotificationData({ ...notificationData, urgency: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "High", children: "High - Immediate Response Required" }), _jsx(SelectItem, { value: "Medium", children: "Medium - Response within 48 hours" }), _jsx(SelectItem, { value: "Low", children: "Low - Response within 1 week" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "subject", children: "Subject" }), _jsx(Input, { id: "subject", value: notificationData.subject, onChange: (e) => setNotificationData({ ...notificationData, subject: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "message", children: "Message" }), _jsx(Textarea, { id: "message", rows: 8, value: notificationData.message, onChange: (e) => setNotificationData({ ...notificationData, message: e.target.value }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Notification Options" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "includeDetails", checked: notificationData.includeDetails, onCheckedChange: (checked) => setNotificationData({ ...notificationData, includeDetails: checked }) }), _jsx(Label, { htmlFor: "includeDetails", children: "Include detailed breach information" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "requireResponse", checked: notificationData.requireResponse, onCheckedChange: (checked) => setNotificationData({ ...notificationData, requireResponse: checked }) }), _jsx(Label, { htmlFor: "requireResponse", children: "Require acknowledgment response" })] })] })] }), _jsxs(Alert, { className: "border-yellow-200 bg-yellow-50", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-yellow-600" }), _jsx(AlertDescription, { className: "text-yellow-800", children: "This notification will be logged in the breach timeline and tracked for vendor response." })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowVendorNotification(false), children: "Cancel" }), _jsxs(Button, { onClick: handleSendNotification, className: "flex items-center gap-2", children: [_jsx(Send, { className: "h-4 w-4" }), "Send Notification"] })] })] }) })] }));
}
