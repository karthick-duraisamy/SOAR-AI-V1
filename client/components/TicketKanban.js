import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Plus, Clock, User, MessageSquare, Phone, Mail, Globe, MessageCircle, AlertTriangle, ThumbsUp, HelpCircle, Zap, MoreHorizontal, Eye, RefreshCw, Settings } from 'lucide-react';
// Mock ticket data with status distribution
const initialTickets = [
    {
        id: 'TKT-2024-001',
        subject: 'Flight delay compensation',
        customer: 'John Smith',
        channel: 'WhatsApp',
        category: 'Complaint',
        priority: 'High',
        status: 'Open',
        assignedTo: 'Sarah Johnson',
        avatar: 'SJ',
        createdAt: '2024-06-17 09:30',
        expectedResolution: '2024-06-17 17:30',
        description: 'Customer experienced 4-hour flight delay on AA123',
        tags: ['compensation', 'delay'],
        aiSuggestion: 'Offer $200 compensation voucher'
    },
    {
        id: 'TKT-2024-002',
        subject: 'Seat upgrade request',
        customer: 'Sarah Johnson',
        channel: 'Email',
        category: 'Request',
        priority: 'Medium',
        status: 'AI to Address',
        assignedTo: 'Mike Davis',
        avatar: 'MD',
        createdAt: '2024-06-17 08:15',
        expectedResolution: '2024-06-18 08:15',
        description: 'Corporate traveler requesting premium seat',
        tags: ['upgrade', 'business'],
        aiSuggestion: 'Check premium economy availability'
    },
    {
        id: 'TKT-2024-003',
        subject: 'Lost baggage claim',
        customer: 'Emma Wilson',
        channel: 'Chatbot',
        category: 'Complaint',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'John Smith',
        avatar: 'JS',
        createdAt: '2024-06-17 11:20',
        expectedResolution: '2024-06-17 23:20',
        description: 'Baggage not delivered after connection',
        tags: ['baggage', 'urgent'],
        aiSuggestion: 'Initiate tracing, offer $100 interim'
    },
    {
        id: 'TKT-2024-004',
        subject: 'Excellent service feedback',
        customer: 'Mike Davis',
        channel: 'Website',
        category: 'Feedback',
        priority: 'Low',
        status: 'Moved to Passenger',
        assignedTo: 'Lisa Wong',
        avatar: 'LW',
        createdAt: '2024-06-16 15:45',
        expectedResolution: '2024-06-17 15:45',
        description: 'Positive feedback about cabin crew',
        tags: ['positive', 'service'],
        aiSuggestion: 'Send thank you and loyalty bonus'
    },
    {
        id: 'TKT-2024-005',
        subject: 'Refund processing delay',
        customer: 'Alex Thompson',
        channel: 'WhatsApp',
        category: 'Complaint',
        priority: 'Medium',
        status: 'Resolved',
        assignedTo: 'Sarah Johnson',
        avatar: 'SJ',
        createdAt: '2024-06-16 16:30',
        expectedResolution: '2024-06-18 16:30',
        description: 'Customer waiting for refund processing',
        tags: ['refund', 'processing'],
        aiSuggestion: 'Expedite refund process'
    },
    {
        id: 'TKT-2024-006',
        subject: 'Mobile app bug report',
        customer: 'Sophie Chen',
        channel: 'Email',
        category: 'Suggestion',
        priority: 'Low',
        status: 'Open',
        assignedTo: 'Mike Davis',
        avatar: 'MD',
        createdAt: '2024-06-17 14:20',
        expectedResolution: '2024-06-19 14:20',
        description: 'Reporting checkout issues in mobile app',
        tags: ['app', 'bug', 'mobile'],
        aiSuggestion: 'Forward to tech team, acknowledge issue'
    }
];
const columns = [
    { id: 'Open', title: 'Open Tickets', color: 'bg-yellow-100 border-yellow-300', headerColor: 'bg-yellow-50' },
    { id: 'AI to Address', title: 'AI to Address', color: 'bg-purple-100 border-purple-300', headerColor: 'bg-purple-50' },
    { id: 'Moved to Passenger', title: 'Moved to Passenger', color: 'bg-orange-100 border-orange-300', headerColor: 'bg-orange-50' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100 border-blue-300', headerColor: 'bg-blue-50' },
    { id: 'Resolved', title: 'Resolved', color: 'bg-green-100 border-green-300', headerColor: 'bg-green-50' }
];
const ItemTypes = {
    TICKET: 'ticket'
};
function TicketCard({ ticket, onTicketClick }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TICKET,
        item: { id: ticket.id, status: ticket.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));
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
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-500';
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
    const calculateTimeRemaining = (expectedResolution) => {
        const now = new Date();
        const resolution = new Date(expectedResolution);
        const diff = resolution.getTime() - now.getTime();
        if (diff < 0) {
            return { value: 'Overdue', color: 'text-red-600' };
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 2) {
            return { value: `${hours}h`, color: 'text-red-600' };
        }
        else if (hours < 8) {
            return { value: `${hours}h`, color: 'text-yellow-600' };
        }
        else {
            return { value: `${hours}h`, color: 'text-green-600' };
        }
    };
    const ChannelIcon = getChannelIcon(ticket.channel);
    const CategoryIcon = getCategoryIcon(ticket.category);
    const timeRemaining = calculateTimeRemaining(ticket.expectedResolution);
    return (_jsxs("div", { ref: drag, className: `p-3 bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}`, onClick: () => onTicketClick(ticket.id), children: [_jsx("div", { className: `w-full h-1 ${getPriorityColor(ticket.priority)} rounded-t-lg mb-2` }), _jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-sm", children: ticket.id }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [_jsx(ChannelIcon, { className: "h-3 w-3 text-muted-foreground" }), _jsx(Badge, { variant: getCategoryColor(ticket.category), className: "text-xs", children: ticket.category })] })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0", children: _jsx(MoreHorizontal, { className: "h-3 w-3" }) })] }), _jsx("p", { className: "text-sm font-medium mb-2 line-clamp-2", children: ticket.subject }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(User, { className: "h-3 w-3 text-muted-foreground" }), _jsx("span", { className: "text-xs text-muted-foreground", children: ticket.customer })] }), _jsx("p", { className: "text-xs text-muted-foreground mb-3 line-clamp-2", children: ticket.description }), ticket.tags && ticket.tags.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-1 mb-3", children: [ticket.tags.slice(0, 2).map((tag) => (_jsx("span", { className: "px-1.5 py-0.5 bg-gray-100 text-xs rounded", children: tag }, tag))), ticket.tags.length > 2 && (_jsxs("span", { className: "px-1.5 py-0.5 bg-gray-100 text-xs rounded", children: ["+", ticket.tags.length - 2] }))] })), _jsxs("div", { className: "flex items-start gap-2 mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded", children: [_jsx(Zap, { className: "h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-xs text-yellow-800 line-clamp-2", children: ticket.aiSuggestion })] }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Avatar, { className: "h-6 w-6", children: _jsx(AvatarFallback, { className: "text-xs", children: ticket.avatar }) }), _jsx("span", { className: "text-xs text-muted-foreground", children: ticket.assignedTo })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3 text-muted-foreground" }), _jsx("span", { className: `text-xs ${timeRemaining.color}`, children: timeRemaining.value })] })] })] }));
}
function Column({ column, tickets, onDrop, onTicketClick }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TICKET,
        drop: (item) => {
            if (item.status !== column.id) {
                onDrop(item.id, column.id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));
    return (_jsxs("div", { ref: drop, className: `flex-1 min-w-0 ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`, children: [_jsx("div", { className: `${column.headerColor} border-b-2 ${column.color.split(' ')[1]} p-3 rounded-t-lg`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium text-sm", children: column.title }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: tickets.length }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0", children: _jsx(Plus, { className: "h-3 w-3" }) })] })] }) }), _jsxs("div", { className: `${column.color} border-2 border-t-0 rounded-b-lg min-h-[600px] p-3 space-y-3`, children: [tickets.map((ticket) => (_jsx(TicketCard, { ticket: ticket, onTicketClick: onTicketClick }, ticket.id))), tickets.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center h-32 text-muted-foreground", children: [_jsx(MessageSquare, { className: "h-8 w-8 mb-2 opacity-50" }), _jsx("p", { className: "text-sm", children: "No tickets" })] }))] })] }));
}
export function TicketKanban({ onNavigate }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [searchTerm, setSearchTerm] = useState('');
    const [assignedFilter, setAssignedFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const handleDrop = useCallback((ticketId, newStatus) => {
        setTickets(prevTickets => prevTickets.map(ticket => ticket.id === ticketId
            ? { ...ticket, status: newStatus }
            : ticket));
        // Here you would typically make an API call to update the ticket status
        console.log(`Moved ticket ${ticketId} to ${newStatus}`);
    }, []);
    const handleTicketClick = (ticketId) => {
        if (onNavigate) {
            onNavigate('ticket-details', { ticketId });
        }
    };
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAssigned = assignedFilter === 'all' || ticket.assignedTo === assignedFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
        return matchesSearch && matchesAssigned && matchesPriority && matchesCategory;
    });
    const getTicketsForColumn = (columnId) => {
        return filteredTickets.filter(ticket => ticket.status === columnId);
    };
    return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsxs("div", { className: "space-y-6 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Ticket Board" }), _jsx("p", { className: "text-muted-foreground", children: "Drag and drop tickets to update their status" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-1" }), "Refresh"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Settings, { className: "h-4 w-4 mr-1" }), "Customize"] }), _jsxs(Button, { size: "sm", onClick: () => onNavigate && onNavigate('ticket-list'), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "List View"] })] })] }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search tickets...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-8" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Assigned To" }), _jsxs(Select, { value: assignedFilter, onValueChange: setAssignedFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All agents" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Agents" }), _jsx(SelectItem, { value: "Sarah Johnson", children: "Sarah Johnson" }), _jsx(SelectItem, { value: "Mike Davis", children: "Mike Davis" }), _jsx(SelectItem, { value: "Lisa Wong", children: "Lisa Wong" }), _jsx(SelectItem, { value: "John Smith", children: "John Smith" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Priority" }), _jsxs(Select, { value: priorityFilter, onValueChange: setPriorityFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All priorities" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Priorities" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Category" }), _jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "All categories" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Categories" }), _jsx(SelectItem, { value: "Complaint", children: "Complaint" }), _jsx(SelectItem, { value: "Feedback", children: "Feedback" }), _jsx(SelectItem, { value: "Suggestion", children: "Suggestion" }), _jsx(SelectItem, { value: "Request", children: "Request" })] })] })] })] }) }) }), _jsx("div", { className: "grid grid-cols-5 gap-4", children: columns.map((column) => {
                        const columnTickets = getTicketsForColumn(column.id);
                        return (_jsx(Card, { children: _jsx(CardContent, { className: "p-3", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: columnTickets.length }), _jsx("div", { className: "text-sm text-muted-foreground", children: column.title })] }) }) }, column.id));
                    }) }), _jsx("div", { className: "flex gap-4 overflow-x-auto pb-4", children: columns.map((column) => (_jsx(Column, { column: column, tickets: getTicketsForColumn(column.id), onDrop: handleDrop, onTicketClick: handleTicketClick }, column.id))) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "Priority Legend" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-red-500 rounded" }), _jsx("span", { className: "text-sm", children: "High Priority" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-yellow-500 rounded" }), _jsx("span", { className: "text-sm", children: "Medium Priority" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded" }), _jsx("span", { className: "text-sm", children: "Low Priority" })] })] })] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Drag tickets between columns to change their status" })] }) }) })] }) }));
}
