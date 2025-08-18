import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Clock, AlertTriangle, CheckCircle, MessageSquare, Phone, Mail, Globe, MessageCircle, Target, Zap, Activity, BarChart3, PieChart as PieChartIcon, Download, RefreshCw, ThumbsUp, ThumbsDown, Star, HelpCircle, Flame, Timer, Minus, AlertCircle, Info, CheckCircle2, XCircle, Gauge, Bolt, Crown, Medal } from 'lucide-react';
// Enhanced agent performance data
const agentPerformanceData = [
    {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        email: 'sarah.johnson@company.com',
        department: 'Senior Support',
        status: 'online',
        // Efficiency Metrics
        ticketsResolved: 42,
        ticketsAssigned: 45,
        resolutionRate: 93.3,
        avgResolutionTime: 2.3,
        firstResponseTime: 0.8,
        // Throughput Metrics
        ticketsPerHour: 5.2,
        ticketsPerDay: 42,
        workingHours: 8,
        utilization: 94,
        // Quality Metrics
        customerSatisfaction: 4.8,
        qualityScore: 96,
        escalationRate: 4.4,
        reopenRate: 2.1,
        // Performance Indicators
        slaCompliance: 94,
        responseTimeCompliance: 98,
        activeTickets: 3,
        overdueTasks: 0,
        efficiency: 93,
        productivity: 89,
        weeklyTrend: 5.2,
        monthlyGrowth: 12.3
    },
    {
        id: 2,
        name: 'Mike Davis',
        avatar: 'MD',
        email: 'mike.davis@company.com',
        department: 'General Support',
        status: 'online',
        ticketsResolved: 33,
        ticketsAssigned: 38,
        resolutionRate: 86.8,
        avgResolutionTime: 3.1,
        firstResponseTime: 1.2,
        ticketsPerHour: 4.1,
        ticketsPerDay: 33,
        workingHours: 8,
        utilization: 87,
        customerSatisfaction: 4.5,
        qualityScore: 88,
        escalationRate: 7.9,
        reopenRate: 3.5,
        slaCompliance: 87,
        responseTimeCompliance: 92,
        activeTickets: 5,
        overdueTasks: 1,
        efficiency: 87,
        productivity: 82,
        weeklyTrend: -2.1,
        monthlyGrowth: 7.8
    },
    {
        id: 3,
        name: 'Lisa Wong',
        avatar: 'LW',
        email: 'lisa.wong@company.com',
        department: 'Technical Support',
        status: 'online',
        ticketsResolved: 39,
        ticketsAssigned: 42,
        resolutionRate: 92.9,
        avgResolutionTime: 2.7,
        firstResponseTime: 0.9,
        ticketsPerHour: 4.9,
        ticketsPerDay: 39,
        workingHours: 8,
        utilization: 92,
        customerSatisfaction: 4.7,
        qualityScore: 94,
        escalationRate: 5.2,
        reopenRate: 1.8,
        slaCompliance: 93,
        responseTimeCompliance: 96,
        activeTickets: 3,
        overdueTasks: 0,
        efficiency: 93,
        productivity: 91,
        weeklyTrend: 3.8,
        monthlyGrowth: 15.2
    },
    {
        id: 4,
        name: 'John Smith',
        avatar: 'JS',
        email: 'john.smith@company.com',
        department: 'General Support',
        status: 'away',
        ticketsResolved: 30,
        ticketsAssigned: 35,
        resolutionRate: 85.7,
        avgResolutionTime: 3.5,
        firstResponseTime: 1.5,
        ticketsPerHour: 3.8,
        ticketsPerDay: 30,
        workingHours: 8,
        utilization: 86,
        customerSatisfaction: 4.3,
        qualityScore: 85,
        escalationRate: 8.6,
        reopenRate: 4.2,
        slaCompliance: 86,
        responseTimeCompliance: 89,
        activeTickets: 5,
        overdueTasks: 2,
        efficiency: 86,
        productivity: 78,
        weeklyTrend: -1.5,
        monthlyGrowth: 4.1
    },
    {
        id: 5,
        name: 'Emma Wilson',
        avatar: 'EW',
        email: 'emma.wilson@company.com',
        department: 'Premium Support',
        status: 'online',
        ticketsResolved: 37,
        ticketsAssigned: 40,
        resolutionRate: 92.5,
        avgResolutionTime: 2.9,
        firstResponseTime: 1.0,
        ticketsPerHour: 4.6,
        ticketsPerDay: 37,
        workingHours: 8,
        utilization: 93,
        customerSatisfaction: 4.6,
        qualityScore: 91,
        escalationRate: 6.0,
        reopenRate: 2.7,
        slaCompliance: 93,
        responseTimeCompliance: 95,
        activeTickets: 3,
        overdueTasks: 0,
        efficiency: 93,
        productivity: 87,
        weeklyTrend: 2.9,
        monthlyGrowth: 9.7
    }
];
// Team performance comparison data
const teamPerformanceData = [
    { department: 'Senior Support', efficiency: 93, throughput: 5.2, satisfaction: 4.8, agents: 1 },
    { department: 'Technical Support', efficiency: 93, throughput: 4.9, satisfaction: 4.7, agents: 1 },
    { department: 'Premium Support', efficiency: 93, throughput: 4.6, satisfaction: 4.6, agents: 1 },
    { department: 'General Support', efficiency: 86.5, throughput: 4.0, satisfaction: 4.4, agents: 2 }
];
// Performance trends data
const performanceTrendData = [
    { week: 'Week 1', efficiency: 89, throughput: 4.2, satisfaction: 4.3 },
    { week: 'Week 2', efficiency: 91, throughput: 4.5, satisfaction: 4.4 },
    { week: 'Week 3', efficiency: 88, throughput: 4.1, satisfaction: 4.2 },
    { week: 'Week 4', efficiency: 92, throughput: 4.7, satisfaction: 4.6 }
];
// Enhanced mock data with more comprehensive metrics
const volumeAnalyticsData = [
    {
        period: 'Week 1',
        totalTickets: 156,
        complaints: 89,
        requests: 45,
        feedback: 22,
        escalations: 12,
        avgWaitTime: 2.3,
        peakHour: '14:00',
        lowPoint: '04:00'
    },
    {
        period: 'Week 2',
        totalTickets: 134,
        complaints: 76,
        requests: 38,
        feedback: 20,
        escalations: 8,
        avgWaitTime: 1.9,
        peakHour: '15:00',
        lowPoint: '03:00'
    },
    {
        period: 'Week 3',
        totalTickets: 178,
        complaints: 102,
        requests: 54,
        feedback: 22,
        escalations: 15,
        avgWaitTime: 2.8,
        peakHour: '13:00',
        lowPoint: '05:00'
    },
    {
        period: 'Week 4',
        totalTickets: 165,
        complaints: 94,
        requests: 48,
        feedback: 23,
        escalations: 11,
        avgWaitTime: 2.2,
        peakHour: '14:00',
        lowPoint: '04:00'
    }
];
const channelAnalyticsData = [
    {
        channel: 'Email',
        volume: 156,
        percentage: 42,
        satisfaction: 4.3,
        avgResolutionTime: 4.2,
        firstResponseTime: 1.2,
        escalationRate: 8.5,
        costPerTicket: 12.5,
        agentUtilization: 87,
        repeatCustomers: 23
    },
    {
        channel: 'WhatsApp',
        volume: 134,
        percentage: 36,
        satisfaction: 4.6,
        avgResolutionTime: 2.8,
        firstResponseTime: 0.8,
        escalationRate: 5.2,
        costPerTicket: 8.3,
        agentUtilization: 92,
        repeatCustomers: 18
    },
    {
        channel: 'Website Chat',
        volume: 58,
        percentage: 16,
        satisfaction: 4.1,
        avgResolutionTime: 3.5,
        firstResponseTime: 1.5,
        escalationRate: 12.1,
        costPerTicket: 15.2,
        agentUtilization: 78,
        repeatCustomers: 31
    },
    {
        channel: 'Phone',
        volume: 22,
        percentage: 6,
        satisfaction: 4.8,
        avgResolutionTime: 1.2,
        firstResponseTime: 0.3,
        escalationRate: 3.8,
        costPerTicket: 25.7,
        agentUtilization: 95,
        repeatCustomers: 12
    }
];
const sentimentAnalyticsData = [
    {
        week: 'Week 1',
        positive: 65,
        neutral: 25,
        negative: 10,
        avgRating: 4.2,
        veryPositive: 28,
        veryNegative: 3,
        emotionalIntensity: 7.2,
        keywordSentiment: { praise: 34, complaint: 8, suggestion: 23 }
    },
    {
        week: 'Week 2',
        positive: 68,
        neutral: 22,
        negative: 10,
        avgRating: 4.3,
        veryPositive: 31,
        veryNegative: 2,
        emotionalIntensity: 7.5,
        keywordSentiment: { praise: 38, complaint: 6, suggestion: 24 }
    },
    {
        week: 'Week 3',
        positive: 62,
        neutral: 28,
        negative: 10,
        avgRating: 4.1,
        veryPositive: 25,
        veryNegative: 4,
        emotionalIntensity: 6.8,
        keywordSentiment: { praise: 29, complaint: 12, suggestion: 21 }
    },
    {
        week: 'Week 4',
        positive: 70,
        neutral: 20,
        negative: 10,
        avgRating: 4.4,
        veryPositive: 35,
        veryNegative: 2,
        emotionalIntensity: 7.8,
        keywordSentiment: { praise: 42, complaint: 5, suggestion: 23 }
    }
];
const slaAnalyticsData = [
    {
        category: 'Critical Issues',
        target: 2,
        current: 1.8,
        compliance: 94,
        breaches: 3,
        totalTickets: 48,
        avgResolution: 1.8,
        withinTarget: 45,
        escalated: 2
    },
    {
        category: 'Standard Requests',
        target: 4,
        current: 3.2,
        compliance: 89,
        breaches: 8,
        totalTickets: 156,
        avgResolution: 3.2,
        withinTarget: 139,
        escalated: 9
    },
    {
        category: 'Low Priority',
        target: 8,
        current: 6.8,
        compliance: 96,
        breaches: 2,
        totalTickets: 89,
        avgResolution: 6.8,
        withinTarget: 85,
        escalated: 2
    },
    {
        category: 'General Inquiries',
        target: 6,
        current: 4.9,
        compliance: 92,
        breaches: 5,
        totalTickets: 78,
        avgResolution: 4.9,
        withinTarget: 72,
        escalated: 1
    }
];
const volumeTrendData = [
    { time: '00:00', volume: 5, complaints: 2, requests: 2, feedback: 1 },
    { time: '02:00', volume: 3, complaints: 1, requests: 1, feedback: 1 },
    { time: '04:00', volume: 2, complaints: 1, requests: 1, feedback: 0 },
    { time: '06:00', volume: 8, complaints: 4, requests: 3, feedback: 1 },
    { time: '08:00', volume: 25, complaints: 12, requests: 10, feedback: 3 },
    { time: '10:00', volume: 35, complaints: 18, requests: 12, feedback: 5 },
    { time: '12:00', volume: 42, complaints: 22, requests: 15, feedback: 5 },
    { time: '14:00', volume: 38, complaints: 20, requests: 13, feedback: 5 },
    { time: '16:00', volume: 45, complaints: 25, requests: 15, feedback: 5 },
    { time: '18:00', volume: 32, complaints: 18, requests: 10, feedback: 4 },
    { time: '20:00', volume: 18, complaints: 10, requests: 6, feedback: 2 },
    { time: '22:00', volume: 12, complaints: 6, requests: 4, feedback: 2 }
];
// Enhanced 3D Tooltip
const Custom3DTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "bg-gradient-to-br from-white via-purple-50/95 to-white backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-5 transform transition-all duration-200 ease-out border border-white/20", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 rounded-2xl" }), _jsxs("div", { className: "relative z-10", children: [_jsx("p", { className: "font-bold text-gray-800 mb-3 text-sm tracking-wide", children: label }), payload.map((entry, index) => (_jsxs("div", { className: "flex items-center gap-3 text-sm mb-2 last:mb-0", children: [_jsx("div", { className: "w-4 h-4 rounded-full shadow-lg ring-2 ring-white/50", style: {
                                        background: `linear-gradient(135deg, ${entry.color}, ${entry.color}DD)`,
                                        boxShadow: `0 4px 12px ${entry.color}40`
                                    } }), _jsxs("span", { className: "font-semibold text-gray-700", children: [entry.name, ": ", entry.value] })] }, index)))] }), _jsx("div", { className: "absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-sm" })] }));
    }
    return null;
};
// Agent performance helper functions
const getPerformanceColor = (value, threshold) => {
    if (value >= threshold.excellent)
        return 'text-green-500';
    if (value >= threshold.good)
        return 'text-yellow-600';
    return 'text-red-600';
};
const getPerformanceBadge = (value, threshold) => {
    if (value >= threshold.excellent)
        return 'default';
    if (value >= threshold.good)
        return 'secondary';
    return 'destructive';
};
const getEfficiencyRank = (agents) => {
    return agents
        .sort((a, b) => b.efficiency - a.efficiency)
        .map((agent, index) => ({ ...agent, rank: index + 1 }));
};
export function AdminDashboard({ onNavigate }) {
    const [selectedTimeframe, setSelectedTimeframe] = useState('week');
    const [selectedMetric, setSelectedMetric] = useState('all');
    const [selectedAgent, setSelectedAgent] = useState('all');
    const COLORS = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))'
    ];
    const rankedAgents = getEfficiencyRank(agentPerformanceData);
    const topPerformer = rankedAgents[0];
    const teamAvgEfficiency = agentPerformanceData.reduce((sum, agent) => sum + agent.efficiency, 0) / agentPerformanceData.length;
    const teamAvgThroughput = agentPerformanceData.reduce((sum, agent) => sum + agent.ticketsPerHour, 0) / agentPerformanceData.length;
    const teamAvgSatisfaction = agentPerformanceData.reduce((sum, agent) => sum + agent.customerSatisfaction, 0) / agentPerformanceData.length;
    return (_jsxs("div", { className: "space-y-6 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Admin Dashboard" }), _jsx("p", { className: "text-muted-foreground", children: "Comprehensive analytics for volume, channels, sentiment, SLA management, and agent performance" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: selectedTimeframe, onValueChange: setSelectedTimeframe, children: [_jsx(SelectTrigger, { className: "w-36", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "day", children: "Today" }), _jsx(SelectItem, { value: "week", children: "This Week" }), _jsx(SelectItem, { value: "month", children: "This Month" }), _jsx(SelectItem, { value: "quarter", children: "This Quarter" })] })] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh"] }), _jsxs(Button, { size: "sm", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export"] })] })] }), _jsxs(Tabs, { defaultValue: "agents", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "agents", children: "Agent Performance" }), _jsx(TabsTrigger, { value: "volumes", children: "Volume Analytics" }), _jsx(TabsTrigger, { value: "channels", children: "Channel Analysis" }), _jsx(TabsTrigger, { value: "sentiment", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Sentiment Trends" }), _jsx(TabsTrigger, { value: "sla", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "SLA Management" })] }), _jsxs(TabsContent, { value: "agents", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Team Efficiency" }), _jsx(Gauge, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: [teamAvgEfficiency.toFixed(1), "%"] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-green-500", children: "+2.3%" }), " vs last week"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Avg Throughput" }), _jsx(Bolt, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: teamAvgThroughput.toFixed(1) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "tickets/hour" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Team Satisfaction" }), _jsx(Star, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: teamAvgSatisfaction.toFixed(1) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "out of 5.0" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Top Performer" }), _jsx(Crown, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: topPerformer.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [topPerformer.efficiency, "% efficiency"] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5" }), "Individual Agent Performance"] }), _jsx(CardDescription, { children: "Comprehensive performance metrics for each team member" })] }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b-2 border-gray-200", children: [_jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Agent" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Efficiency" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Throughput" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Satisfaction" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Resolution Rate" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Avg Time" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Active" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Status" })] }) }), _jsx("tbody", { children: rankedAgents.map((agent, index) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Avatar, { className: "h-10 w-10", children: _jsx(AvatarFallback, { className: "bg-gradient-to-br from-secondary to-secondary text-primary font-semibold", children: agent.avatar }) }), _jsx("div", { className: `absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${agent.status === 'online' ? 'bg-primary' : 'bg-muted-foreground'}` }), agent.rank <= 3 && (_jsxs("div", { className: "absolute -top-2 -left-2", children: [agent.rank === 1 && _jsx(Crown, { className: "h-4 w-4 text-primary" }), agent.rank === 2 && _jsx(Medal, { className: "h-4 w-4 text-muted-foreground" }), agent.rank === 3 && _jsx(Medal, { className: "h-4 w-4 text-muted-foreground" })] }))] }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: agent.name }), _jsx("div", { className: "text-sm text-gray-500", children: agent.department })] })] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsxs("div", { className: `font-bold text-lg ${getPerformanceColor(agent.efficiency, { excellent: 90, good: 80 })}`, children: [agent.efficiency, "%"] }), _jsx(Progress, { value: agent.efficiency, className: "w-16 h-2" })] }) }), _jsxs("td", { className: "text-center p-4", children: [_jsx("div", { className: "font-semibold text-lg", children: agent.ticketsPerHour }), _jsx("div", { className: "text-sm text-gray-500", children: "tickets/hr" })] }), _jsx("td", { className: "text-center p-4", children: _jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-current" }), _jsx("span", { className: "font-semibold", children: agent.customerSatisfaction })] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs(Badge, { variant: getPerformanceBadge(agent.resolutionRate, { excellent: 90, good: 80 }), children: [agent.resolutionRate.toFixed(1), "%"] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("span", { className: "font-semibold", children: [agent.avgResolutionTime, "h"] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "font-bold", children: agent.activeTickets }), agent.overdueTasks > 0 && (_jsxs("span", { className: "text-xs text-red-600", children: [agent.overdueTasks, " overdue"] }))] }) }), _jsx("td", { className: "text-center p-4", children: _jsx("div", { className: "flex items-center justify-center", children: agent.status === 'online' ? (_jsx(CheckCircle2, { className: "h-5 w-5 text-green-600" })) : (_jsx(Clock, { className: "h-5 w-5 text-yellow-600" })) }) })] }, agent.id))) })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2", style: {
                                    gap: 'var(--space-3xl)', /* 16px consistent with theme */
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--text-lg)', /* 18px consistent body text */
                                    lineHeight: '1.4'
                                }, children: [_jsxs(Card, { style: {
                                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                            border: '1px solid #E6EAEF',
                                            borderRadius: 'var(--radius-lg)',
                                            backgroundColor: 'var(--card)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: [_jsxs(CardHeader, { style: {
                                                    paddingTop: 'var(--space-3xl)', /* 16px */
                                                    paddingBottom: 'var(--space-xl)', /* 8px */
                                                    paddingLeft: 'var(--space-3xl)', /* 16px */
                                                    paddingRight: 'var(--space-3xl)' /* 16px */
                                                }, children: [_jsxs(CardTitle, { className: "flex items-center gap-2", style: {
                                                            fontSize: 'var(--text-xl)', /* 20px */
                                                            fontWeight: 'var(--font-weight-medium)',
                                                            color: 'var(--foreground)',
                                                            fontFamily: 'var(--font-family)',
                                                            lineHeight: '1.2',
                                                            marginBottom: 'var(--space-sm)' /* 2px */
                                                        }, children: [_jsx(TrendingUp, { className: "h-5 w-5", style: { color: 'var(--primary)' } }), "Performance Trends"] }), _jsx(CardDescription, { style: {
                                                            fontSize: 'var(--text-base)', /* 16px */
                                                            color: 'var(--muted-foreground)',
                                                            fontFamily: 'var(--font-family)',
                                                            lineHeight: '1.3',
                                                            marginBottom: '0'
                                                        }, children: "Weekly team performance metrics" })] }), _jsx(CardContent, { style: {
                                                    paddingTop: '0',
                                                    paddingBottom: 'var(--space-3xl)', /* 16px */
                                                    paddingLeft: 'var(--space-3xl)', /* 16px */
                                                    paddingRight: 'var(--space-3xl)' /* 16px */
                                                }, children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: performanceTrendData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)", opacity: 0.3 }), _jsx(XAxis, { dataKey: "week", tick: {
                                                                    fontSize: 'var(--text-sm)', /* 14px */
                                                                    fontFamily: 'var(--font-family)',
                                                                    fill: 'var(--muted-foreground)'
                                                                }, axisLine: { stroke: 'var(--border)' }, tickLine: { stroke: 'var(--border)' } }), _jsx(YAxis, { tick: {
                                                                    fontSize: 'var(--text-sm)', /* 14px */
                                                                    fontFamily: 'var(--font-family)',
                                                                    fill: 'var(--muted-foreground)'
                                                                }, axisLine: { stroke: 'var(--border)' }, tickLine: { stroke: 'var(--border)' } }), _jsx(Tooltip, { contentStyle: {
                                                                    backgroundColor: 'var(--popover)',
                                                                    border: '1px solid var(--border)',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    fontFamily: 'var(--font-family)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    color: 'var(--popover-foreground)',
                                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                                }, labelStyle: {
                                                                    color: 'var(--foreground)',
                                                                    fontFamily: 'var(--font-family)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    fontWeight: 'var(--font-weight-medium)'
                                                                } }), _jsx(Legend, { wrapperStyle: {
                                                                    fontFamily: 'var(--font-family)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    color: 'var(--foreground)'
                                                                } }), _jsx(Line, { type: "monotone", dataKey: "efficiency", stroke: "hsl(var(--chart-1))", strokeWidth: 2.5, name: "Efficiency %", dot: { fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }, activeDot: { r: 6, fill: 'hsl(var(--chart-1))', stroke: 'var(--card)' } }), _jsx(Line, { type: "monotone", dataKey: "throughput", stroke: "hsl(var(--chart-2))", strokeWidth: 2.5, name: "Throughput", dot: { fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }, activeDot: { r: 6, fill: 'hsl(var(--chart-2))', stroke: 'var(--card)' } }), _jsx(Line, { type: "monotone", dataKey: "satisfaction", stroke: "hsl(var(--chart-3))", strokeWidth: 2.5, name: "Satisfaction", dot: { fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }, activeDot: { r: 6, fill: 'hsl(var(--chart-3))', stroke: 'var(--card)' } })] }) }) })] }), _jsxs(Card, { style: {
                                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                            border: '1px solid #E6EAEF',
                                            borderRadius: 'var(--radius-lg)',
                                            backgroundColor: 'var(--card)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: [_jsxs(CardHeader, { style: {
                                                    paddingTop: 'var(--space-3xl)', /* 16px */
                                                    paddingBottom: 'var(--space-xl)', /* 8px */
                                                    paddingLeft: 'var(--space-3xl)', /* 16px */
                                                    paddingRight: 'var(--space-3xl)' /* 16px */
                                                }, children: [_jsxs(CardTitle, { className: "flex items-center gap-2", style: {
                                                            fontSize: 'var(--text-xl)', /* 20px */
                                                            fontWeight: 'var(--font-weight-medium)',
                                                            color: 'var(--foreground)',
                                                            fontFamily: 'var(--font-family)',
                                                            lineHeight: '1.2',
                                                            marginBottom: 'var(--space-sm)' /* 2px */
                                                        }, children: [_jsx(BarChart3, { className: "h-5 w-5", style: { color: 'var(--primary)' } }), "Department Comparison"] }), _jsx(CardDescription, { style: {
                                                            fontSize: 'var(--text-base)', /* 16px */
                                                            color: 'var(--muted-foreground)',
                                                            fontFamily: 'var(--font-family)',
                                                            lineHeight: '1.3',
                                                            marginBottom: '0'
                                                        }, children: "Performance metrics by department" })] }), _jsx(CardContent, { style: {
                                                    paddingTop: '0',
                                                    paddingBottom: 'var(--space-3xl)', /* 16px */
                                                    paddingLeft: 'var(--space-3xl)', /* 16px */
                                                    paddingRight: 'var(--space-3xl)' /* 16px */
                                                }, children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: teamPerformanceData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)", opacity: 0.3 }), _jsx(XAxis, { dataKey: "department", tick: {
                                                                    fontSize: 'var(--text-sm)', /* 14px */
                                                                    fontFamily: 'var(--font-family)',
                                                                    fill: 'var(--muted-foreground)'
                                                                }, axisLine: { stroke: 'var(--border)' }, tickLine: { stroke: 'var(--border)' } }), _jsx(YAxis, { tick: {
                                                                    fontSize: 'var(--text-sm)', /* 14px */
                                                                    fontFamily: 'var(--font-family)',
                                                                    fill: 'var(--muted-foreground)'
                                                                }, axisLine: { stroke: 'var(--border)' }, tickLine: { stroke: 'var(--border)' } }), _jsx(Tooltip, { contentStyle: {
                                                                    backgroundColor: 'var(--popover)',
                                                                    border: '1px solid var(--border)',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    fontFamily: 'var(--font-family)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    color: 'var(--popover-foreground)',
                                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                                }, labelStyle: {
                                                                    color: 'var(--foreground)',
                                                                    fontFamily: 'var(--font-family)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    fontWeight: 'var(--font-weight-medium)'
                                                                } }), _jsx(Legend, { wrapperStyle: {
                                                                    fontFamily: 'var(--font-family)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    color: 'var(--foreground)'
                                                                } }), _jsx(Bar, { dataKey: "efficiency", fill: "var(--primary)", name: "Efficiency %", radius: [2, 2, 0, 0], stroke: "var(--primary)", strokeWidth: 1 }), _jsx(Bar, { dataKey: "throughput", fill: "hsl(var(--chart-2))", name: "Throughput", radius: [2, 2, 0, 0], stroke: "hsl(var(--chart-2))", strokeWidth: 1 })] }) }) })] })] })] }), _jsxs(TabsContent, { value: "volumes", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Volume" }), _jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "633" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-green-500", children: "+8.2%" }), " vs last month"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Daily Average" }), _jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "158" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-red-600", children: "-2.1%" }), " vs last week"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Peak Hour" }), _jsx(Clock, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "14:00" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "45 tickets at peak" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Escalation Rate" }), _jsx(AlertTriangle, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "7.2%" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-green-500", children: "-1.8%" }), " improvement"] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "h-5 w-5" }), "24-Hour Volume Distribution"] }), _jsx(CardDescription, { children: "Hourly ticket volume breakdown by category" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(AreaChart, { data: volumeTrendData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "time" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Area, { type: "monotone", dataKey: "volume", stroke: "#f97316", strokeWidth: 2, fill: "#f97316", fillOpacity: 0.1 })] }) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), "Category Breakdown"] }), _jsx(CardDescription, { children: "Volume distribution by ticket category" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: volumeAnalyticsData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "period" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "complaints", fill: "#ef4444", name: "Complaints" }), _jsx(Bar, { dataKey: "requests", fill: "#3b82f6", name: "Requests" }), _jsx(Bar, { dataKey: "feedback", fill: "#10b981", name: "Feedback" })] }) }) })] })] })] }), _jsxs(TabsContent, { value: "channels", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Top Channel" }), _jsx(Mail, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "Email" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "42% of volume" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Best Satisfaction" }), _jsx(Star, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "Phone" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "4.8/5 rating" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Most Efficient" }), _jsx(Zap, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "WhatsApp" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "2.8h avg time" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Cost Leader" }), _jsx(Target, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "WhatsApp" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "$8.30 per ticket" })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), "Channel Performance Analysis"] }), _jsx(CardDescription, { children: "Comprehensive metrics across all communication channels" })] }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b-2 border-gray-200", children: [_jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Channel" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Volume" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Satisfaction" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Avg Resolution" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "First Response" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Escalation Rate" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Cost/Ticket" })] }) }), _jsx("tbody", { children: channelAnalyticsData.map((channel, index) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-200", children: [channel.channel === 'Email' && _jsx(Mail, { className: "h-4 w-4 text-blue-600" }), channel.channel === 'WhatsApp' && _jsx(MessageCircle, { className: "h-4 w-4 text-green-600" }), channel.channel === 'Website Chat' && _jsx(Globe, { className: "h-4 w-4 text-purple-600" }), channel.channel === 'Phone' && _jsx(Phone, { className: "h-4 w-4 text-orange-600" })] }), _jsx("span", { className: "font-semibold", children: channel.channel })] }) }), _jsxs("td", { className: "text-center p-4", children: [_jsx("div", { className: "font-bold text-lg", children: channel.volume }), _jsxs("div", { className: "text-sm text-gray-600", children: [channel.percentage, "%"] })] }), _jsx("td", { className: "text-center p-4", children: _jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-current" }), _jsx("span", { className: "font-semibold", children: channel.satisfaction })] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("span", { className: "font-semibold", children: [channel.avgResolutionTime, "h"] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("span", { className: "font-semibold", children: [channel.firstResponseTime, "h"] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs(Badge, { variant: channel.escalationRate > 10 ? "destructive" : channel.escalationRate > 5 ? "secondary" : "default", children: [channel.escalationRate, "%"] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("span", { className: "font-semibold", children: ["$", channel.costPerTicket] }) })] }, index))) })] }) }) })] })] }), _jsxs(TabsContent, { value: "sentiment", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Positive Sentiment" }), _jsx(ThumbsUp, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "68%" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-green-500", children: "+3.2%" }), " vs last month"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Neutral Sentiment" }), _jsx(Minus, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "22%" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Stable range" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Negative Sentiment" }), _jsx(ThumbsDown, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "10%" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-green-500", children: "-1.1%" }), " improvement"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Avg Rating" }), _jsx(Star, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "4.3" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Out of 5.0" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-5 w-5" }), "Sentiment Trends Over Time"] }), _jsx(CardDescription, { children: "Weekly sentiment analysis tracking" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: sentimentAnalyticsData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "week" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "positive", stroke: "#10b981", strokeWidth: 2, name: "Positive" }), _jsx(Line, { type: "monotone", dataKey: "neutral", stroke: "#6b7280", strokeWidth: 2, name: "Neutral" }), _jsx(Line, { type: "monotone", dataKey: "negative", stroke: "#ef4444", strokeWidth: 2, name: "Negative" })] }) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(PieChartIcon, { className: "h-5 w-5" }), "Current Sentiment Distribution"] }), _jsx(CardDescription, { children: "This week's sentiment breakdown" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: [
                                                                    { name: 'Positive', value: 70, fill: '#10b981' },
                                                                    { name: 'Neutral', value: 20, fill: '#6b7280' },
                                                                    { name: 'Negative', value: 10, fill: '#ef4444' }
                                                                ], cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 120, paddingAngle: 5, dataKey: "value", children: [{ name: 'Positive', value: 70, fill: '#10b981' },
                                                                    { name: 'Neutral', value: 20, fill: '#6b7280' },
                                                                    { name: 'Negative', value: 10, fill: '#ef4444' }].map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }) })] })] })] }), _jsxs(TabsContent, { value: "sla", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Overall Compliance" }), _jsx(CheckCircle, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "92%" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "text-red-600", children: "-2.3%" }), " vs last month"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Breaches" }), _jsx(AlertTriangle, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "18" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "This week" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Avg Resolution" }), _jsx(Timer, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "3.2h" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Across all categories" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Critical Issues" }), _jsx(Flame, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "94%" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Within 2h target" })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-5 w-5" }), "SLA Performance by Category"] }), _jsx(CardDescription, { children: "Detailed breakdown of service level agreement compliance" })] }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b-2 border-gray-200", children: [_jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Category" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Target" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Current Avg" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Compliance" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Breaches" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Total Tickets" }), _jsx("th", { className: "text-center p-4 font-semibold text-gray-700", children: "Status" })] }) }), _jsx("tbody", { children: slaAnalyticsData.map((sla, index) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: `p-2 rounded-lg bg-gradient-to-br ${sla.category === 'Critical Issues' ? 'from-red-100 to-orange-200' :
                                                                                    sla.category === 'Standard Requests' ? 'from-blue-100 to-cyan-200' :
                                                                                        sla.category === 'Low Priority' ? 'from-green-100 to-emerald-200' :
                                                                                            'from-purple-100 to-pink-200'}`, children: [sla.category === 'Critical Issues' && _jsx(Flame, { className: "h-4 w-4 text-red-600" }), sla.category === 'Standard Requests' && _jsx(MessageSquare, { className: "h-4 w-4 text-blue-600" }), sla.category === 'Low Priority' && _jsx(Info, { className: "h-4 w-4 text-green-600" }), sla.category === 'General Inquiries' && _jsx(HelpCircle, { className: "h-4 w-4 text-purple-600" })] }), _jsx("span", { className: "font-semibold", children: sla.category })] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("span", { className: "font-bold text-lg", children: [sla.target, "h"] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("div", { className: `font-semibold ${sla.current <= sla.target ? 'text-green-600' : 'text-red-600'}`, children: [sla.current, "h"] }) }), _jsx("td", { className: "text-center p-4", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Progress, { value: sla.compliance, className: "w-16 h-2" }), _jsxs("span", { className: "font-semibold", children: [sla.compliance, "%"] })] }) }), _jsx("td", { className: "text-center p-4", children: _jsx(Badge, { variant: sla.breaches > 5 ? "destructive" : sla.breaches > 2 ? "secondary" : "default", children: sla.breaches }) }), _jsx("td", { className: "text-center p-4", children: _jsx("span", { className: "font-semibold", children: sla.totalTickets }) }), _jsx("td", { className: "text-center p-4", children: _jsx("div", { className: "flex items-center justify-center", children: sla.compliance >= 95 ? (_jsx(CheckCircle2, { className: "h-5 w-5 text-green-600" })) : sla.compliance >= 90 ? (_jsx(AlertCircle, { className: "h-5 w-5 text-yellow-600" })) : (_jsx(XCircle, { className: "h-5 w-5 text-red-600" })) }) })] }, index))) })] }) }) })] })] })] })] }));
}
