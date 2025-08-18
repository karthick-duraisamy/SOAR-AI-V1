import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { MessageSquare, AlertCircle, TrendingUp, TrendingDown, Target, Zap, Calendar, Phone, Mail, MessageCircle, Globe, Star, Award, Activity, BarChart3, PieChart as PieChartIcon, ArrowRight, Download, RefreshCw, ThumbsUp, AlertTriangle, HelpCircle, Eye } from 'lucide-react';
// Mock data for dashboard
const ticketStatusData = [
    { status: 'Open', count: 45, color: '#f59e0b', percentage: 25 },
    { status: 'In Progress', count: 32, color: '#3b82f6', percentage: 18 },
    { status: 'AI to Address', count: 28, color: '#8b5cf6', percentage: 16 },
    { status: 'Moved to Passenger', count: 38, color: '#f97316', percentage: 21 },
    { status: 'Resolved', count: 35, color: '#10b981', percentage: 20 }
];
const agentPerformanceData = [
    { name: 'Assigned', value: 178, color: '#3b82f6' },
    { name: 'Resolved', value: 142, color: '#10b981' }
];
const categoryTrendData = [
    { month: 'Jan', Complaints: 45, Feedback: 32, Suggestions: 28, Requests: 52 },
    { month: 'Feb', Complaints: 38, Feedback: 28, Suggestions: 35, Requests: 48 },
    { month: 'Mar', Complaints: 42, Feedback: 35, Suggestions: 32, Requests: 55 },
    { month: 'Apr', Complaints: 35, Feedback: 42, Suggestions: 38, Requests: 48 },
    { month: 'May', Complaints: 48, Feedback: 38, Suggestions: 42, Requests: 62 },
    { month: 'Jun', Complaints: 52, Feedback: 45, Suggestions: 35, Requests: 58 }
];
const channelDistribution = [
    { channel: 'Email', count: 85, percentage: 35, color: '#3b82f6' },
    { channel: 'WhatsApp', count: 72, percentage: 30, color: '#10b981' },
    { channel: 'Website', count: 58, percentage: 24, color: '#8b5cf6' },
    { channel: 'Chatbot', count: 28, percentage: 11, color: '#f59e0b' }
];
const efficiencyMetrics = [
    { metric: 'Avg Response Time', value: '2.3 hrs', trend: 'down', change: '12%', color: 'text-green-600' },
    { metric: 'Resolution Rate', value: '89%', trend: 'up', change: '5%', color: 'text-green-600' },
    { metric: 'Customer Satisfaction', value: '4.6/5', trend: 'up', change: '3%', color: 'text-green-600' },
    { metric: 'First Contact Resolution', value: '76%', trend: 'up', change: '8%', color: 'text-green-600' }
];
const recentTickets = [
    {
        id: 'TKT-2024-001',
        channel: 'WhatsApp',
        category: 'Complaint',
        priority: 'High',
        status: 'Open',
        customer: 'John Smith',
        subject: 'Flight delay compensation',
        createdAt: '2024-06-17 09:30',
        expectedResolution: '2024-06-17 17:30'
    },
    {
        id: 'TKT-2024-002',
        channel: 'Email',
        category: 'Request',
        priority: 'Medium',
        status: 'In Progress',
        customer: 'Sarah Johnson',
        subject: 'Seat upgrade request',
        createdAt: '2024-06-17 08:15',
        expectedResolution: '2024-06-18 08:15'
    },
    {
        id: 'TKT-2024-003',
        channel: 'Website',
        category: 'Feedback',
        priority: 'Low',
        status: 'Resolved',
        customer: 'Mike Davis',
        subject: 'Service appreciation',
        createdAt: '2024-06-16 15:45',
        expectedResolution: '2024-06-17 15:45'
    }
];
// Custom 3D Tooltip
const Custom3DTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "bg-gradient-to-br from-white via-gray-50/95 to-white backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-5 transform transition-all duration-200 ease-out border border-white/20", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl" }), _jsxs("div", { className: "relative z-10", children: [_jsx("p", { className: "font-bold text-gray-800 mb-3 text-sm tracking-wide", children: label }), payload.map((entry, index) => (_jsxs("div", { className: "flex items-center gap-3 text-sm mb-2 last:mb-0", children: [_jsx("div", { className: "w-4 h-4 rounded-full shadow-lg ring-2 ring-white/50", style: {
                                        background: `linear-gradient(135deg, ${entry.color}, ${entry.color}DD)`,
                                        boxShadow: `0 4px 12px ${entry.color}40`
                                    } }), _jsxs("span", { className: "font-semibold text-gray-700", children: [entry.name, ": ", entry.value] })] }, index)))] }), _jsx("div", { className: "absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-sm" })] }));
    }
    return null;
};
export function CustomerSupportDashboard({ onNavigate }) {
    const [selectedTimeframe, setSelectedTimeframe] = useState('today');
    const [selectedMetric, setSelectedMetric] = useState('all');
    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'secondary';
            case 'In Progress': return 'default';
            case 'AI to Address': return 'secondary';
            case 'Moved to Passenger': return 'outline';
            case 'Resolved': return 'default';
            default: return 'outline';
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
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Complaint': return AlertTriangle;
            case 'Feedback': return ThumbsUp;
            case 'Suggestion': return HelpCircle;
            case 'Request': return MessageCircle;
            default: return MessageSquare;
        }
    };
    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'WhatsApp': return Phone;
            case 'Email': return Mail;
            case 'Website': return Globe;
            case 'Chatbot': return MessageCircle;
            default: return MessageSquare;
        }
    };
    const handleStatusClick = (status) => {
        if (onNavigate) {
            onNavigate('ticket-list', { status });
        }
    };
    const handleTicketClick = (ticketId) => {
        if (onNavigate) {
            onNavigate('ticket-details', { ticketId });
        }
    };
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return (_jsxs("div", { className: "space-y-6 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Customer Support Dashboard" }), _jsx("p", { className: "text-muted-foreground", children: "Monitor and manage customer tickets efficiently with AI-powered insights" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: selectedTimeframe, onValueChange: setSelectedTimeframe, children: [_jsx(SelectTrigger, { className: "w-36", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "today", children: "Today" }), _jsx(SelectItem, { value: "week", children: "This Week" }), _jsx(SelectItem, { value: "month", children: "This Month" }), _jsx(SelectItem, { value: "quarter", children: "This Quarter" })] })] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh"] }), _jsxs(Button, { size: "sm", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export"] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: ticketStatusData.map((item, index) => (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleStatusClick(item.status), children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: item.status }), _jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: item.count }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [item.percentage, "% of total"] })] })] }, item.status))) }), _jsxs(Alert, { children: [_jsx(Activity, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Performance Update:" }), " You've resolved 142 out of 178 assigned tickets (79.8% resolution rate).", _jsx(Button, { variant: "link", className: "p-0 ml-1", children: "View detailed analytics \u2192" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-5 w-5" }), "Performance Overview"] }), _jsx(CardDescription, { children: "Ticket assignment and resolution performance" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Assigned Tickets" }), _jsx("span", { className: "font-medium", children: "178" })] }), _jsx(Progress, { value: 100, className: "h-2" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Resolved Tickets" }), _jsx("span", { className: "font-medium", children: "142" })] }), _jsx(Progress, { value: (142 / 178) * 100, className: "h-2" })] }), _jsxs("div", { className: "text-center mt-6 p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-500", children: "79.8%" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Resolution Rate" })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "h-5 w-5" }), "Recent Activity"] }), _jsx(CardDescription, { children: "Latest ticket interactions and status changes" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: recentTickets.slice(0, 4).map((ticket) => (_jsxs("div", { className: "flex items-start gap-3 p-3 border rounded-lg", children: [_jsx(MessageSquare, { className: "h-4 w-4 mt-0.5 text-blue-600" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-sm", children: ticket.id }), _jsx("p", { className: "text-sm text-muted-foreground", children: ticket.subject }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Badge, { variant: getStatusColor(ticket.status), className: "text-xs", children: ticket.status }), _jsx("span", { className: "text-xs text-muted-foreground", children: ticket.createdAt })] })] }), _jsx("div", { className: "text-xs font-medium text-green-500", children: ticket.priority })] }, ticket.id))) }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(PieChartIcon, { className: "h-5 w-5" }), "Channel Distribution"] }), _jsx(CardDescription, { children: "Communication channels breakdown" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: channelDistribution.map((channel, index) => {
                                        const ChannelIcon = getChannelIcon(channel.channel);
                                        return (_jsxs("div", { className: "flex items-center gap-3 p-3 border rounded-lg", children: [_jsx(ChannelIcon, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: channel.channel }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [channel.count, " tickets (", channel.percentage, "%)"] })] })] }, channel.channel));
                                    }) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-5 w-5" }), "Efficiency Metrics"] }), _jsx(CardDescription, { children: "Performance indicators" })] }), _jsx(CardContent, { className: "space-y-4", children: efficiencyMetrics.map((metric, index) => {
                                    const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
                                    return (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: metric.metric }), _jsx("div", { className: "text-xl font-bold", children: metric.value })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(TrendIcon, { className: `h-4 w-4 ${metric.color}` }), _jsx("span", { className: `text-sm font-medium ${metric.color}`, children: metric.change })] })] }, index));
                                }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-5 w-5" }), "AI Insights"] }), _jsx(CardDescription, { children: "Smart recommendations" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3 p-3 border rounded-lg", children: [_jsx(AlertCircle, { className: "h-4 w-4 mt-0.5 text-yellow-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Priority Alert" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "3 high-priority complaints require immediate attention" })] })] }), _jsxs("div", { className: "flex items-start gap-3 p-3 border rounded-lg", children: [_jsx(Star, { className: "h-4 w-4 mt-0.5 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Opportunity" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "12 tickets can be auto-resolved using AI suggestions" })] })] }), _jsxs("div", { className: "flex items-start gap-3 p-3 border rounded-lg", children: [_jsx(Award, { className: "h-4 w-4 mt-0.5 text-green-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Achievement" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "You're performing 15% above team average this week" })] })] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), "Recent Tickets"] }), _jsx(CardDescription, { children: "Latest customer support tickets" })] }), _jsxs(Button, { variant: "outline", onClick: () => onNavigate && onNavigate('ticket-list'), children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "View All"] })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: recentTickets.map((ticket) => {
                                const CategoryIcon = getCategoryIcon(ticket.category);
                                const ChannelIcon = getChannelIcon(ticket.channel);
                                return (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", onClick: () => handleTicketClick(ticket.id), children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg", children: _jsx(CategoryIcon, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-medium", children: ticket.id }), _jsx(Badge, { variant: getStatusColor(ticket.status), children: ticket.status })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [ticket.subject, " \u2022 ", ticket.customer] }), _jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ChannelIcon, { className: "h-3 w-3" }), ticket.channel] }), _jsx("span", { children: ticket.category }), _jsxs("span", { className: `font-medium ${getPriorityColor(ticket.priority) === 'destructive' ? 'text-red-600' : getPriorityColor(ticket.priority) === 'secondary' ? 'text-yellow-600' : 'text-green-600'}`, children: [ticket.priority, " priority"] })] })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm font-medium", children: ticket.createdAt.split(' ')[0] }), _jsx("div", { className: "text-xs text-muted-foreground", children: ticket.expectedResolution.split(' ')[0] })] }), _jsx(Button, { size: "sm", variant: "outline", children: _jsx(ArrowRight, { className: "h-4 w-4" }) })] })] }, ticket.id));
                            }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => onNavigate && onNavigate('ticket-kanban'), children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx(BarChart3, { className: "h-8 w-8 mx-auto mb-2 text-blue-600" }), _jsx("h3", { className: "font-medium", children: "Ticket Board" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Kanban view of tickets" })] }) }), _jsx(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => onNavigate && onNavigate('ticket-list'), children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx(MessageSquare, { className: "h-8 w-8 mx-auto mb-2 text-green-500" }), _jsx("h3", { className: "font-medium", children: "All Tickets" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Complete ticket list" })] }) }), _jsx(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx(Zap, { className: "h-8 w-8 mx-auto mb-2 text-purple-600" }), _jsx("h3", { className: "font-medium", children: "AI Suggestions" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Smart recommendations" })] }) }), _jsx(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx(Calendar, { className: "h-8 w-8 mx-auto mb-2 text-orange-600" }), _jsx("h3", { className: "font-medium", children: "Schedule" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage your schedule" })] }) })] })] }));
}
