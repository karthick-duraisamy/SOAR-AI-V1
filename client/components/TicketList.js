import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Search, Filter, Download, Eye, Edit, MessageSquare, Phone, Mail, Globe, MessageCircle, AlertTriangle, ThumbsUp, HelpCircle, User, Zap, ArrowUpDown, MoreHorizontal, RefreshCw, Plus } from 'lucide-react';
// Mock ticket data
const tickets = [
    {
        id: 'TKT-2024-001',
        channel: 'WhatsApp',
        category: 'Complaint',
        subject: 'Flight delay compensation request',
        customer: 'John Smith',
        customerEmail: 'john.smith@email.com',
        priority: 'High',
        status: 'Open',
        createdAt: '2024-06-17 09:30',
        expectedResolution: '2024-06-17 17:30',
        assignedTo: 'Sarah Johnson',
        aiSuggestion: 'Offer compensation voucher worth $200 based on 4-hour delay policy. Reference policy P-DEL-001.',
        description: 'Customer experienced 4-hour flight delay on AA123 from NYC to LAX. Requesting compensation as per airline policy.',
        lastUpdated: '2024-06-17 10:15',
        tags: ['compensation', 'delay', 'domestic']
    },
    {
        id: 'TKT-2024-002',
        channel: 'Email',
        category: 'Request',
        subject: 'Seat upgrade request for business travel',
        customer: 'Sarah Johnson',
        customerEmail: 'sarah.j@company.com',
        priority: 'Medium',
        status: 'In Progress',
        createdAt: '2024-06-17 08:15',
        expectedResolution: '2024-06-18 08:15',
        assignedTo: 'Mike Davis',
        aiSuggestion: 'Check available premium economy seats on flight BA456. Offer upgrade for additional $180.',
        description: 'Corporate traveler requesting seat upgrade for London-Paris flight. Has gold status.',
        lastUpdated: '2024-06-17 14:22',
        tags: ['upgrade', 'business', 'premium']
    },
    {
        id: 'TKT-2024-003',
        channel: 'Website',
        category: 'Feedback',
        subject: 'Excellent service on recent flight',
        customer: 'Mike Davis',
        customerEmail: 'mike.davis@gmail.com',
        priority: 'Low',
        status: 'Resolved',
        createdAt: '2024-06-16 15:45',
        expectedResolution: '2024-06-17 15:45',
        assignedTo: 'Lisa Wong',
        aiSuggestion: 'Send personalized thank you message and offer loyalty points bonus.',
        description: 'Customer praising cabin crew service on international flight. Mentioned excellent meal service.',
        lastUpdated: '2024-06-17 09:30',
        tags: ['positive', 'service', 'international']
    },
    {
        id: 'TKT-2024-004',
        channel: 'Chatbot',
        category: 'Complaint',
        subject: 'Lost baggage claim',
        customer: 'Emma Wilson',
        customerEmail: 'emma.w@email.com',
        priority: 'High',
        status: 'AI to Address',
        createdAt: '2024-06-17 11:20',
        expectedResolution: '2024-06-17 23:20',
        assignedTo: 'John Smith',
        aiSuggestion: 'Initiate baggage tracing with reference BWI2024001. Offer interim compensation of $100.',
        description: 'Baggage not delivered after connecting flight. Contains important business documents.',
        lastUpdated: '2024-06-17 11:45',
        tags: ['baggage', 'lost', 'urgent']
    },
    {
        id: 'TKT-2024-005',
        channel: 'WhatsApp',
        category: 'Suggestion',
        subject: 'Mobile app improvement suggestion',
        customer: 'Alex Thompson',
        customerEmail: 'alex.t@email.com',
        priority: 'Low',
        status: 'Moved to Passenger',
        createdAt: '2024-06-16 16:30',
        expectedResolution: '2024-06-18 16:30',
        assignedTo: 'Sarah Johnson',
        aiSuggestion: 'Forward to product team and acknowledge customer contribution with loyalty points.',
        description: 'Suggests adding real-time seat map feature to mobile app for better user experience.',
        lastUpdated: '2024-06-17 08:15',
        tags: ['app', 'feature', 'product']
    }
];
export function TicketList({ initialFilters, onNavigate }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(initialFilters?.status || 'all');
    const [channelFilter, setChannelFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [assignedFilter, setAssignedFilter] = useState('all');
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'WhatsApp': return Phone;
            case 'Email': return Mail;
            case 'Website': return Globe;
            case 'Chatbot': return MessageCircle;
            default: return MessageSquare;
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
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Complaint': return 'destructive';
            case 'Feedback': return 'default';
            case 'Suggestion': return 'secondary';
            case 'Request': return 'outline';
            default: return 'outline';
        }
    };
    const handleTicketClick = (ticketId) => {
        if (onNavigate) {
            onNavigate('ticket-details', { ticketId });
        }
    };
    const handleTicketSelect = (ticketId, checked) => {
        if (checked) {
            setSelectedTickets([...selectedTickets, ticketId]);
        }
        else {
            setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
        }
    };
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedTickets(filteredTickets.map(ticket => ticket.id));
        }
        else {
            setSelectedTickets([]);
        }
    };
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesChannel = channelFilter === 'all' || ticket.channel === channelFilter;
        const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesAssigned = assignedFilter === 'all' || ticket.assignedTo === assignedFilter;
        return matchesSearch && matchesStatus && matchesChannel && matchesCategory && matchesPriority && matchesAssigned;
    }).sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        }
        else {
            return aValue < bValue ? 1 : -1;
        }
    });
    const calculateTimeRemaining = (expectedResolution) => {
        const now = new Date();
        const resolution = new Date(expectedResolution);
        const diff = resolution.getTime() - now.getTime();
        if (diff < 0) {
            return { value: 'Overdue', color: 'text-red-600' };
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours < 2) {
            return { value: `${hours}h ${minutes}m`, color: 'text-red-600' };
        }
        else if (hours < 8) {
            return { value: `${hours}h ${minutes}m`, color: 'text-yellow-600' };
        }
        else {
            return { value: `${hours}h ${minutes}m`, color: 'text-green-600' };
        }
    };
    return (_jsxs("div", { className: "space-y-6 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Ticket Management" }), _jsx("p", { className: "text-muted-foreground", children: "View and manage all customer support tickets" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-1" }), "Refresh"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Export"] }), _jsxs(Button, { size: "sm", onClick: () => onNavigate && onNavigate('ticket-kanban'), children: [_jsx(Plus, { className: "h-4 w-4 mr-1" }), "Kanban View"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5" }), "Filters"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search tickets...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-8" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Status" }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All statuses" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Statuses" }), _jsx(SelectItem, { value: "Open", children: "Open" }), _jsx(SelectItem, { value: "In Progress", children: "In Progress" }), _jsx(SelectItem, { value: "AI to Address", children: "AI to Address" }), _jsx(SelectItem, { value: "Moved to Passenger", children: "Moved to Passenger" }), _jsx(SelectItem, { value: "Resolved", children: "Resolved" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Channel" }), _jsxs(Select, { value: channelFilter, onValueChange: setChannelFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All channels" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Channels" }), _jsx(SelectItem, { value: "WhatsApp", children: "WhatsApp" }), _jsx(SelectItem, { value: "Email", children: "Email" }), _jsx(SelectItem, { value: "Website", children: "Website" }), _jsx(SelectItem, { value: "Chatbot", children: "Chatbot" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Category" }), _jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All categories" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Categories" }), _jsx(SelectItem, { value: "Complaint", children: "Complaint" }), _jsx(SelectItem, { value: "Feedback", children: "Feedback" }), _jsx(SelectItem, { value: "Suggestion", children: "Suggestion" }), _jsx(SelectItem, { value: "Request", children: "Request" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Priority" }), _jsxs(Select, { value: priorityFilter, onValueChange: setPriorityFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All priorities" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Priorities" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Assigned To" }), _jsxs(Select, { value: assignedFilter, onValueChange: setAssignedFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All agents" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Agents" }), _jsx(SelectItem, { value: "Sarah Johnson", children: "Sarah Johnson" }), _jsx(SelectItem, { value: "Mike Davis", children: "Mike Davis" }), _jsx(SelectItem, { value: "Lisa Wong", children: "Lisa Wong" }), _jsx(SelectItem, { value: "John Smith", children: "John Smith" })] })] })] })] }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Showing ", filteredTickets.length, " of ", tickets.length, " tickets", selectedTickets.length > 0 && (_jsxs("span", { className: "ml-2", children: ["(", selectedTickets.length, " selected)"] }))] }), selectedTickets.length > 0 && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", children: "Bulk Assign" }), _jsx(Button, { variant: "outline", size: "sm", children: "Bulk Status Change" })] }))] }), _jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-12", children: _jsx(Checkbox, { checked: selectedTickets.length === filteredTickets.length, onCheckedChange: handleSelectAll }) }), _jsx(TableHead, { className: "cursor-pointer hover:bg-muted/50", onClick: () => handleSort('id'), children: _jsxs("div", { className: "flex items-center gap-1", children: ["Ticket ID", _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx(TableHead, { children: "Channel" }), _jsx(TableHead, { children: "Category" }), _jsx(TableHead, { className: "cursor-pointer hover:bg-muted/50", onClick: () => handleSort('createdAt'), children: _jsxs("div", { className: "flex items-center gap-1", children: ["Date & Time", _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx(TableHead, { children: "Expected Resolution" }), _jsx(TableHead, { children: "Assigned To" }), _jsx(TableHead, { children: "AI Suggestion" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: filteredTickets.map((ticket) => {
                                        const ChannelIcon = getChannelIcon(ticket.channel);
                                        const CategoryIcon = getCategoryIcon(ticket.category);
                                        const timeRemaining = calculateTimeRemaining(ticket.expectedResolution);
                                        return (_jsxs(TableRow, { className: "hover:bg-muted/50 cursor-pointer", onClick: () => handleTicketClick(ticket.id), children: [_jsx(TableCell, { onClick: (e) => e.stopPropagation(), children: _jsx(Checkbox, { checked: selectedTickets.includes(ticket.id), onCheckedChange: (checked) => handleTicketSelect(ticket.id, checked) }) }), _jsx(TableCell, { children: _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: ticket.id }), _jsx("div", { className: "text-sm text-muted-foreground truncate max-w-[200px]", children: ticket.subject })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ChannelIcon, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { className: "text-sm", children: ticket.channel })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CategoryIcon, { className: "h-4 w-4 text-muted-foreground" }), _jsx(Badge, { variant: getCategoryColor(ticket.category), children: ticket.category })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsx("div", { children: ticket.createdAt.split(' ')[0] }), _jsx("div", { className: "text-muted-foreground", children: ticket.createdAt.split(' ')[1] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsx("div", { children: ticket.expectedResolution.split(' ')[0] }), _jsx("div", { className: `${timeRemaining.color}`, children: timeRemaining.value })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { className: "text-sm", children: ticket.assignedTo })] }) }), _jsx(TableCell, { children: _jsx("div", { className: "max-w-[250px]", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Zap, { className: "h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: ticket.aiSuggestion })] }) }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: getStatusColor(ticket.status), children: ticket.status }) }), _jsx(TableCell, { onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) })] }) })] }, ticket.id));
                                    }) })] }) }) }) }), filteredTickets.length === 0 && (_jsx(Card, { children: _jsxs(CardContent, { className: "text-center py-8", children: [_jsx(MessageSquare, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }), _jsx("h3", { className: "font-medium mb-2", children: "No tickets found" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Try adjusting your filters or search criteria" })] }) }))] }));
}
