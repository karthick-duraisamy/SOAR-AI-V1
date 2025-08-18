import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { FileText, TrendingUp, TrendingDown, Users, DollarSign, CheckCircle, Clock, AlertTriangle, Calendar, Bell, Shield, Target, ExternalLink } from 'lucide-react';
// Mock data
const renewalTimelineData = [
    { month: 'Jan', upcoming: 4, completed: 12 },
    { month: 'Feb', upcoming: 8, completed: 9 },
    { month: 'Mar', upcoming: 6, completed: 11 },
    { month: 'Apr', upcoming: 10, completed: 8 },
    { month: 'May', upcoming: 5, completed: 13 },
    { month: 'Jun', upcoming: 7, completed: 10 }
];
const breachTrendsData = [
    { quarter: 'Q1', breaches: 8, resolved: 7, pending: 1 },
    { quarter: 'Q2', breaches: 5, resolved: 4, pending: 1 },
    { quarter: 'Q3', breaches: 3, resolved: 3, pending: 0 },
    { quarter: 'Q4', breaches: 4, resolved: 3, pending: 1 }
];
const contractStatusData = [
    { name: 'Active', value: 156, color: '#10b981' },
    { name: 'Pending', value: 18, color: '#eab308' },
    { name: 'At Risk', value: 4, color: '#ef4444' },
    { name: 'Expired', value: 12, color: '#6b7280' }
];
const notifications = [
    {
        id: 1,
        type: 'contract',
        severity: 'high',
        title: 'Contract Renewal Due',
        message: 'Global Travel Solutions contract expires in 15 days. Schedule renewal meeting.',
        time: '2 hours ago',
        action: 'Schedule Meeting'
    },
    {
        id: 2,
        type: 'breach',
        severity: 'medium',
        title: 'SLA Breach Alert',
        message: 'Premier Voyage Group has exceeded response time SLA for the second time this quarter.',
        time: '4 hours ago',
        action: 'Review Performance'
    },
    {
        id: 3,
        type: 'vendor',
        severity: 'low',
        title: 'New Vendor Application',
        message: 'Elite Business Solutions has submitted a partnership application for review.',
        time: '1 day ago',
        action: 'Review Application'
    },
    {
        id: 4,
        type: 'opportunity',
        severity: 'high',
        title: 'High-Value Opportunity',
        message: 'TechCorp International showing strong engagement. Consider priority outreach.',
        time: '1 day ago',
        action: 'Contact Now'
    }
];
const topVendors = [
    {
        name: 'Global Travel Solutions',
        contracts: 12,
        revenue: 2800000,
        riskLevel: 'Low',
        score: 98
    },
    {
        name: 'Corporate Journey Ltd',
        contracts: 8,
        revenue: 1950000,
        riskLevel: 'Low',
        score: 95
    },
    {
        name: 'Elite Business Travel',
        contracts: 6,
        revenue: 1680000,
        riskLevel: 'Medium',
        score: 92
    },
    {
        name: 'Premier Voyage Group',
        contracts: 4,
        revenue: 890000,
        riskLevel: 'High',
        score: 78
    },
    {
        name: 'Business Travel Pro',
        contracts: 3,
        revenue: 650000,
        riskLevel: 'Low',
        score: 88
    }
];
export function Dashboard({ onNavigate }) {
    const Custom3DTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (_jsxs("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [_jsx("p", { className: "font-medium text-gray-900 mb-2", children: label }), payload.map((entry, index) => (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }), _jsxs("span", { className: "text-gray-700", children: [entry.name, ": ", entry.value] })] }, index)))] }));
        }
        return null;
    };
    const getSeverityIcon = (type) => {
        switch (type) {
            case 'contract': return Calendar;
            case 'breach': return AlertTriangle;
            case 'vendor': return Users;
            case 'opportunity': return Target;
            default: return Bell;
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'border-red-200 bg-red-50';
            case 'medium': return 'border-yellow-200 bg-yellow-50';
            case 'low': return 'border-blue-200 bg-blue-50';
            default: return 'border-gray-200 bg-gray-50';
        }
    };
    const handleNotificationAction = (notification) => {
        switch (notification.type) {
            case 'contract':
                onNavigate('contracts', { focus: 'renewals' });
                break;
            case 'breach':
                onNavigate('breach-monitoring');
                break;
            case 'vendor':
                onNavigate('vendor-search');
                break;
            case 'opportunity':
                onNavigate('qualified-leads');
                break;
            default:
                break;
        }
    };
    const handleVendorClick = (vendor) => {
        onNavigate('vendor-search', { vendor: vendor.name });
    };
    return (_jsxs("div", { className: "space-y-8 p-5", children: [_jsx("svg", { width: "0", height: "0", style: { position: 'absolute' }, children: _jsxs("defs", { children: [_jsxs("linearGradient", { id: "blueGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#3b82f6", stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: "#1e40af", stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: "#1e3a8a", stopOpacity: 0.4 })] }), _jsxs("linearGradient", { id: "greenGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#10b981", stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: "#047857", stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: "#065f46", stopOpacity: 0.4 })] }), _jsxs("linearGradient", { id: "yellowGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#f59e0b", stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: "#d97706", stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: "#b45309", stopOpacity: 0.4 })] }), _jsxs("linearGradient", { id: "redGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#ef4444", stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: "#dc2626", stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: "#b91c1c", stopOpacity: 0.4 })] }), _jsxs("linearGradient", { id: "purpleGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#8b5cf6", stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: "#7c3aed", stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: "#6d28d9", stopOpacity: 0.4 })] }), _jsxs("linearGradient", { id: "indigoGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#6366f1", stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: "#4f46e5", stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: "#4338ca", stopOpacity: 0.4 })] }), _jsxs("linearGradient", { id: "tealGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#14b8a6", stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: "#0f766e", stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: "#0d544d", stopOpacity: 0.4 })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(Card, { className: "cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white", onClick: () => onNavigate('contracts', { status: 'Active' }), children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center", children: _jsx(FileText, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Active Contracts" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "156" })] })] }), _jsx(ExternalLink, { className: "h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded-full bg-green-50", children: [_jsx(TrendingUp, { className: "h-3 w-3 text-green-500" }), _jsx("span", { className: "text-green-500 font-medium", children: "+12%" })] }), _jsx("span", { className: "text-gray-500", children: "from last month" })] })] }) }), _jsx(Card, { className: "cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white", onClick: () => onNavigate('contracts', { dateRange: 'expiring-soon' }), children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center", children: _jsx(Calendar, { className: "h-6 w-6 text-orange-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Expiring Soon" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "18" })] })] }), _jsx(ExternalLink, { className: "h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors duration-300" })] }), _jsx("div", { className: "flex items-center gap-2 text-sm", children: _jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50", children: [_jsx(Clock, { className: "h-3 w-3 text-orange-600" }), _jsx("span", { className: "text-orange-600 font-medium", children: "Next 30 days" })] }) })] }) }), _jsx(Card, { className: "cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white", onClick: () => onNavigate('breach-monitoring'), children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center", children: _jsx(AlertTriangle, { className: "h-6 w-6 text-red-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Breaches Reported" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "4" })] })] }), _jsx(ExternalLink, { className: "h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors duration-300" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded-full bg-green-50", children: [_jsx(TrendingDown, { className: "h-3 w-3 text-green-500" }), _jsx("span", { className: "text-green-500 font-medium", children: "-2" })] }), _jsx("span", { className: "text-gray-500", children: "from last month" })] })] }) }), _jsx(Card, { className: "cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white", onClick: () => onNavigate('contracts', { tab: 'analytics' }), children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center", children: _jsx(DollarSign, { className: "h-6 w-6 text-green-500" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Value" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "$3.58M" })] })] }), _jsx(ExternalLink, { className: "h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors duration-300" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded-full bg-green-50", children: [_jsx(TrendingUp, { className: "h-3 w-3 text-green-500" }), _jsx("span", { className: "text-green-500 font-medium", children: "+18%" })] }), _jsx("span", { className: "text-gray-500", children: "from last month" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs(Card, { className: "cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white", onClick: () => onNavigate('contracts', { tab: 'analytics', focus: 'renewals' }), children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsxs(CardTitle, { className: "flex items-center justify-between text-lg", children: [_jsx("span", { className: "text-gray-900 font-semibold", children: "Contract Renewal Timeline" }), _jsx(ExternalLink, { className: "h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" })] }), _jsx(CardDescription, { className: "text-gray-600", children: "Upcoming and completed contract renewals - Click to view details" })] }), _jsx(CardContent, { children: _jsx("div", { className: "relative p-4 rounded-lg bg-gray-50/30", children: _jsx(ResponsiveContainer, { width: "100%", height: 320, children: _jsxs(AreaChart, { data: renewalTimelineData, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "upcomingGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#FD9646", stopOpacity: 0.8 }), _jsx("stop", { offset: "50%", stopColor: "#FD9646", stopOpacity: 0.6 }), _jsx("stop", { offset: "100%", stopColor: "#FD9646", stopOpacity: 0.1 })] }), _jsxs("linearGradient", { id: "completedGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#717182", stopOpacity: 0.8 }), _jsx("stop", { offset: "50%", stopColor: "#717182", stopOpacity: 0.6 }), _jsx("stop", { offset: "100%", stopColor: "#717182", stopOpacity: 0.1 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0", strokeOpacity: 0.6 }), _jsx(XAxis, { dataKey: "month", axisLine: false, tickLine: false, tick: { fill: '#64748b', fontSize: 13, fontWeight: 500 } }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fill: '#64748b', fontSize: 13, fontWeight: 500 } }), _jsx(Tooltip, { content: _jsx(Custom3DTooltip, {}) }), _jsx(Area, { type: "monotone", dataKey: "upcoming", stackId: "1", stroke: "#FD9646", strokeWidth: 4, fill: "url(#upcomingGradient)" }), _jsx(Area, { type: "monotone", dataKey: "completed", stackId: "1", stroke: "#717182", strokeWidth: 4, fill: "url(#completedGradient)" })] }) }) }) })] }), _jsxs(Card, { className: "cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white", onClick: () => onNavigate('breach-monitoring', { tab: 'analytics' }), children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsxs(CardTitle, { className: "flex items-center justify-between text-lg", children: [_jsx("span", { className: "text-gray-900 font-semibold", children: "Breach Trends" }), _jsx(ExternalLink, { className: "h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors duration-300" })] }), _jsx(CardDescription, { className: "text-gray-600", children: "Quarterly breach reports and resolution status - Click to view details" })] }), _jsx(CardContent, { children: _jsx("div", { className: "relative p-4 rounded-lg bg-gray-50/30", children: _jsx(ResponsiveContainer, { width: "100%", height: 320, children: _jsxs(BarChart, { data: breachTrendsData, barGap: 15, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0", strokeOpacity: 0.6 }), _jsx(XAxis, { dataKey: "quarter", axisLine: false, tickLine: false, tick: { fill: '#64748b', fontSize: 13, fontWeight: 500 } }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fill: '#64748b', fontSize: 13, fontWeight: 500 } }), _jsx(Tooltip, { content: _jsx(Custom3DTooltip, {}) }), _jsx(Bar, { dataKey: "breaches", fill: "url(#redGradient)", radius: [6, 6, 0, 0] }), _jsx(Bar, { dataKey: "resolved", fill: "url(#greenGradient)", radius: [6, 6, 0, 0] }), _jsx(Bar, { dataKey: "pending", fill: "url(#yellowGradient)", radius: [6, 6, 0, 0] })] }) }) }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { className: "border border-gray-100 bg-white", children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsxs(CardTitle, { className: "flex items-center gap-4 text-lg", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center", children: _jsx(Bell, { className: "h-6 w-6 text-blue-600" }) }), _jsx("span", { className: "text-gray-900 font-semibold", children: "Real-time Alerts & Notifications" })] }), _jsx(CardDescription, { className: "text-gray-600 ml-16", children: "Critical alerts, deadlines, and AI recommendations - Click actions to navigate" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: notifications.map((notification) => {
                                            const Icon = getSeverityIcon(notification.type);
                                            return (_jsxs(Alert, { className: `${getSeverityColor(notification.severity)} hover:shadow-md transition-all duration-300 border flex items-start`, children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0", children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex items-start justify-between w-full", style: { marginLeft: '20px' }, children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(AlertDescription, { className: "font-semibold mb-1 text-sm", children: notification.title }), _jsx(AlertDescription, { className: "text-sm text-gray-600 leading-relaxed", children: notification.message })] }), _jsxs("div", { className: "flex items-center gap-3 ml-6 flex-shrink-0", children: [_jsx("span", { className: "text-xs text-gray-500 font-medium", children: notification.time }), _jsx(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                                                            e.stopPropagation();
                                                                            handleNotificationAction(notification);
                                                                        }, className: "transition-all duration-300 bg-white hover:bg-gray-50 font-medium", children: notification.action })] })] })] }, notification.id));
                                        }) }) })] }) }), _jsxs(Card, { className: "cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white", onClick: () => onNavigate('contracts', { focus: 'status-overview' }), children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsxs(CardTitle, { className: "flex items-center justify-between text-lg", children: [_jsx("span", { className: "text-gray-900 font-semibold", children: "Contract Status Overview" }), _jsx(ExternalLink, { className: "h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" })] }), _jsx(CardDescription, { className: "text-gray-600", children: "Current status distribution - Click to view details" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "relative p-4 rounded-lg bg-gray-50/20 px-[16px] py-[10px]", children: _jsx(ResponsiveContainer, { width: "100%", height: 280, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: contractStatusData, cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 95, paddingAngle: 8, dataKey: "value", children: contractStatusData.map((entry, index) => (_jsx(Cell, { fill: entry.color, stroke: "#ffffff", strokeWidth: 3 }, `cell-${index}`))) }), _jsx(Tooltip, { content: _jsx(Custom3DTooltip, {}) })] }) }) }), _jsx("div", { className: "grid grid-cols-2 gap-3 mt-6", children: contractStatusData.map((item) => (_jsxs("div", { className: "group/item flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/60 cursor-pointer transition-all duration-300 border border-gray-50 bg-gray-50/20 hover:shadow-md", onClick: (e) => {
                                                e.stopPropagation();
                                                onNavigate('contracts', { status: item.name });
                                            }, children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: {
                                                        backgroundColor: item.color
                                                    } }), _jsxs("span", { className: "text-sm font-semibold text-gray-700", children: [item.name, ": ", item.value] })] }, item.name))) })] })] })] }), _jsxs(Card, { className: "border border-gray-100 bg-white", children: [_jsxs(CardHeader, { className: "pb-6", children: [_jsxs(CardTitle, { className: "flex items-center justify-between text-xl", children: [_jsx("span", { className: "text-gray-900 font-semibold", children: "Top Performing Vendors" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => onNavigate('vendor-search'), className: "hover:shadow-md transition-all duration-300 border border-gray-200 bg-white hover:bg-gray-50 font-medium", children: "View All Vendors" })] }), _jsx(CardDescription, { className: "text-gray-600", children: "AI-powered vendor ranking with risk indicators - Click vendors for details" })] }), _jsx(CardContent, { className: "relative z-10", children: _jsx("div", { className: "space-y-2", children: topVendors.map((vendor, index) => {
                                const gradientColors = [
                                    'from-blue-100 to-blue-200',
                                    'from-green-100 to-green-200',
                                    'from-orange-100 to-orange-200',
                                    'from-purple-100 to-purple-200',
                                    'from-indigo-100 to-indigo-200'
                                ];
                                return (_jsxs("div", { className: "group flex items-center justify-between p-3 border-b border-gray-100 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 bg-gray-50/20 hover:bg-gray-50/40", onClick: () => handleVendorClick(vendor), children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: `flex items-center justify-center w-12 h-12 bg-gradient-to-br ${gradientColors[index]} text-gray-700 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`, children: _jsx("span", { className: "font-bold text-lg", children: index + 1 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-lg", children: vendor.name }), _jsxs("p", { className: "text-sm text-gray-600 font-medium", children: [vendor.contracts, " contracts \u2022 $", (vendor.revenue / 1000).toFixed(0), "K revenue"] })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm font-semibold mb-2 text-gray-700", children: "Risk Level" }), _jsx(Badge, { variant: vendor.riskLevel === 'Low' ? 'default' :
                                                                vendor.riskLevel === 'Medium' ? 'secondary' : 'destructive', className: "shadow-sm px-3 py-1 font-medium", children: vendor.riskLevel })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm font-semibold mb-2 text-gray-700", children: "AI Score" }), _jsxs(Badge, { variant: vendor.score >= 95 ? "default" : vendor.score >= 90 ? "secondary" : "outline", className: "shadow-sm bg-green-500 text-white border-0 px-3 py-1 font-medium", children: [vendor.score, "/100"] })] }), _jsxs("div", { className: "relative", children: [_jsx(Progress, { value: vendor.score, className: "w-28 h-3 bg-gray-200" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full shadow-sm", style: { width: `${vendor.score}%` } })] }), _jsx(ExternalLink, { className: "h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" })] })] }, vendor.name));
                            }) }) })] }), _jsxs(Card, { className: "border border-gray-100 bg-white", children: [_jsxs(CardHeader, { className: "pb-6", children: [_jsxs(CardTitle, { className: "flex items-center gap-4 text-xl", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center", children: _jsx(Target, { className: "h-6 w-6 text-purple-600" }) }), _jsx("span", { className: "text-gray-900 font-semibold", children: "AI-Powered Smart Recommendations" })] }), _jsx(CardDescription, { className: "text-gray-600 ml-16", children: "Proactive insights and risk management suggestions - Click recommendations to take action" })] }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                                {
                                    gradient: 'from-blue-50 to-blue-100',
                                    iconGradient: 'from-blue-100 to-blue-200',
                                    textColor: 'text-blue-800',
                                    icon: TrendingUp,
                                    title: 'Renewal Opportunity:',
                                    content: 'Elite Business Travel contract shows strong performance metrics. Consider early renewal with improved terms.',
                                    onClick: () => onNavigate('contracts', { vendor: 'Elite Business Travel', focus: 'renewal' })
                                },
                                {
                                    gradient: 'from-yellow-50 to-yellow-100',
                                    iconGradient: 'from-yellow-100 to-yellow-200',
                                    textColor: 'text-yellow-800',
                                    icon: Shield,
                                    title: 'Risk Mitigation:',
                                    content: 'Skyline Travel Partners showing declining performance indicators. Recommend contract review within 30 days.',
                                    onClick: () => onNavigate('vendor-search', { vendor: 'Skyline Travel Partners', focus: 'risk' })
                                },
                                {
                                    gradient: 'from-green-50 to-green-100',
                                    iconGradient: 'from-green-100 to-green-200',
                                    textColor: 'text-green-800',
                                    icon: CheckCircle,
                                    title: 'Cost Optimization:',
                                    content: 'Consolidating contracts with Global Travel Solutions could save an estimated $150K annually.',
                                    onClick: () => onNavigate('contracts', { focus: 'cost-optimization' })
                                },
                                {
                                    gradient: 'from-purple-50 to-purple-100',
                                    iconGradient: 'from-purple-100 to-purple-200',
                                    textColor: 'text-purple-800',
                                    icon: Calendar,
                                    title: 'Market Intelligence:',
                                    content: 'New vendors in Asia-Pacific region showing competitive rates. Consider RFP process for route expansion.',
                                    onClick: () => onNavigate('vendor-search', { region: 'Asia-Pacific', focus: 'market-expansion' })
                                }
                            ].map((item, index) => (_jsxs(Alert, { className: "border border-gray-50 bg-gray-50/20 cursor-pointer hover:shadow-lg transition-all duration-300 flex items-start", onClick: item.onClick, children: [_jsx("div", { className: `w-10 h-10 rounded-lg bg-gradient-to-br ${item.iconGradient} flex items-center justify-center flex-shrink-0`, children: _jsx(item.icon, { className: "h-5 w-5 text-gray-700" }) }), _jsxs("div", { className: "flex items-start justify-between w-full", style: { marginLeft: '20px' }, children: [_jsx(AlertDescription, { className: "text-gray-800 flex-1", children: _jsxs("div", { className: "leading-relaxed", children: [_jsx("span", { className: "font-semibold", children: item.title }), " ", item.content] }) }), _jsx(ExternalLink, { className: "h-5 w-5 ml-4 flex-shrink-0 text-gray-400" })] })] }, index))) }) })] })] }));
}
