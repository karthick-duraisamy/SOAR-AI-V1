import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Send, Phone, Mail, Globe, MessageCircle, AlertTriangle, ThumbsUp, HelpCircle, User, Calendar, Tag, Paperclip, Download, Edit, Save, Zap, History, MessageSquare, FileText, Star, Flag, Eye, Copy, Printer, RefreshCw, CheckCircle, AlertCircle, Settings } from 'lucide-react';
// Mock ticket data with full details
const ticketDetails = {
    id: 'TKT-2024-001',
    subject: 'Flight delay compensation request',
    description: 'I was on flight AA123 from New York (JFK) to Los Angeles (LAX) on June 15th, 2024. The flight was delayed by 4 hours due to mechanical issues. According to your policy, I should be entitled to compensation. I have all my boarding passes and receipts. Please process my compensation claim as soon as possible as this delay caused me to miss an important business meeting.',
    customer: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        loyaltyTier: 'Gold',
        loyaltyNumber: 'AA123456789',
        preferredLanguage: 'English',
        timezone: 'EST'
    },
    channel: 'WhatsApp',
    category: 'Complaint',
    priority: 'High',
    status: 'Open',
    assignedTo: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@soarai.com',
        avatar: 'SJ',
        department: 'Customer Support'
    },
    createdAt: '2024-06-17 09:30:00',
    updatedAt: '2024-06-17 14:22:00',
    expectedResolution: '2024-06-17 17:30:00',
    actualResolution: null,
    tags: ['compensation', 'delay', 'domestic', 'business'],
    flightDetails: {
        flightNumber: 'AA123',
        route: 'JFK → LAX',
        scheduledDeparture: '2024-06-15 08:00',
        actualDeparture: '2024-06-15 12:00',
        delayReason: 'Mechanical Issues',
        delayDuration: '4 hours'
    },
    aiSuggestion: {
        recommendation: 'Offer compensation voucher worth $200 based on 4-hour delay policy.',
        confidence: 95,
        reasoning: 'Customer is eligible for compensation under Policy P-DEL-001. Delay exceeds 3 hours threshold for domestic flights.',
        suggestedActions: [
            'Verify flight delay details in system',
            'Check customer loyalty status for bonus compensation',
            'Generate $200 compensation voucher',
            'Send personalized apology email'
        ],
        policyReference: 'P-DEL-001: Domestic Flight Delay Compensation'
    },
    attachments: [
        { name: 'boarding_pass_AA123.pdf', size: '245 KB', type: 'pdf' },
        { name: 'business_meeting_proof.jpg', size: '1.2 MB', type: 'image' }
    ],
    relatedTickets: [
        { id: 'TKT-2024-015', subject: 'Similar delay complaint', status: 'Resolved' },
        { id: 'TKT-2024-028', subject: 'AA123 delay inquiry', status: 'In Progress' }
    ]
};
const chatHistory = [
    {
        id: 1,
        sender: 'customer',
        senderName: 'John Smith',
        message: 'Hi, I was on flight AA123 yesterday and it was delayed by 4 hours. I need compensation for this delay as I missed my important business meeting.',
        timestamp: '2024-06-17 09:30:00',
        channel: 'WhatsApp',
        read: true
    },
    {
        id: 2,
        sender: 'system',
        senderName: 'System',
        message: 'Ticket TKT-2024-001 has been created and assigned to Customer Support Team.',
        timestamp: '2024-06-17 09:32:00',
        channel: 'System',
        read: true
    },
    {
        id: 3,
        sender: 'agent',
        senderName: 'Sarah Johnson',
        message: 'Hello John, I apologize for the inconvenience caused by the flight delay. I have received your compensation request and I am reviewing your case. Can you please provide your boarding pass and any documentation related to the missed meeting?',
        timestamp: '2024-06-17 10:15:00',
        channel: 'WhatsApp',
        read: true
    },
    {
        id: 4,
        sender: 'customer',
        senderName: 'John Smith',
        message: 'Thank you for the quick response. I have attached my boarding pass and a confirmation email for the business meeting I missed. The meeting was worth a potential $50,000 contract.',
        timestamp: '2024-06-17 10:45:00',
        channel: 'WhatsApp',
        read: true,
        attachments: ['boarding_pass_AA123.pdf', 'business_meeting_proof.jpg']
    },
    {
        id: 5,
        sender: 'agent',
        senderName: 'Sarah Johnson',
        message: 'Thank you for providing the documentation. I can see that you experienced a 4-hour delay which qualifies for compensation under our policy. I am processing a $200 compensation voucher for you right now.',
        timestamp: '2024-06-17 14:22:00',
        channel: 'WhatsApp',
        read: true
    }
];
const ticketHistory = [
    {
        id: 1,
        action: 'Ticket Created',
        description: 'Ticket automatically created from WhatsApp message',
        user: 'System',
        timestamp: '2024-06-17 09:30:00'
    },
    {
        id: 2,
        action: 'Assigned',
        description: 'Ticket assigned to Sarah Johnson',
        user: 'Auto-Assignment System',
        timestamp: '2024-06-17 09:32:00'
    },
    {
        id: 3,
        action: 'Priority Updated',
        description: 'Priority changed from Medium to High',
        user: 'Sarah Johnson',
        timestamp: '2024-06-17 10:00:00'
    },
    {
        id: 4,
        action: 'AI Analysis',
        description: 'AI recommendation generated with 95% confidence',
        user: 'AI System',
        timestamp: '2024-06-17 10:05:00'
    },
    {
        id: 5,
        action: 'Customer Response',
        description: 'Customer provided additional documentation',
        user: 'John Smith',
        timestamp: '2024-06-17 10:45:00'
    },
    {
        id: 6,
        action: 'Status Update',
        description: 'Agent working on compensation processing',
        user: 'Sarah Johnson',
        timestamp: '2024-06-17 14:22:00'
    }
];
export function TicketDetails({ ticketId, onNavigate, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [newMessage, setNewMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedStatus, setEditedStatus] = useState(ticketDetails.status);
    const [editedPriority, setEditedPriority] = useState(ticketDetails.priority);
    const [editedAssignee, setEditedAssignee] = useState(ticketDetails.assignedTo.name);
    const [internalNote, setInternalNote] = useState('');
    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'WhatsApp': return Phone;
            case 'Email': return Mail;
            case 'Website': return Globe;
            case 'Chatbot': return MessageCircle;
            case 'System': return Settings;
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
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Here you would send the message via API
            console.log('Sending message:', newMessage);
            setNewMessage('');
        }
    };
    const handleSaveChanges = () => {
        // Here you would save the changes via API
        console.log('Saving changes:', { status: editedStatus, priority: editedPriority, assignee: editedAssignee });
        setIsEditing(false);
    };
    const handleAddInternalNote = () => {
        if (internalNote.trim()) {
            // Here you would add the internal note via API
            console.log('Adding internal note:', internalNote);
            setInternalNote('');
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
    const timeRemaining = calculateTimeRemaining(ticketDetails.expectedResolution);
    const CategoryIcon = getCategoryIcon(ticketDetails.category);
    return (_jsxs("div", { className: "space-y-6 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => onNavigate ? onNavigate('ticket-list') : onClose?.(), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }), "Back to Tickets"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: ticketDetails.id }), _jsx("p", { className: "text-muted-foreground", children: ticketDetails.subject })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Copy, { className: "h-4 w-4 mr-1" }), "Copy Link"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Printer, { className: "h-4 w-4 mr-1" }), "Print"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Export"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsEditing(!isEditing), children: [_jsx(Edit, { className: "h-4 w-4 mr-1" }), isEditing ? 'Cancel' : 'Edit'] }), isEditing && (_jsxs(Button, { size: "sm", onClick: handleSaveChanges, children: [_jsx(Save, { className: "h-4 w-4 mr-1" }), "Save Changes"] }))] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "overview", children: "Overview" }), _jsx(TabsTrigger, { value: "conversation", children: "Conversation" }), _jsx(TabsTrigger, { value: "history", children: "History" }), _jsx(TabsTrigger, { value: "attachments", children: "Attachments" })] }), _jsxs(TabsContent, { value: "overview", className: "space-y-4", children: [_jsxs(Alert, { className: `${ticketDetails.priority === 'High' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`, children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Status Update:" }), " This ticket requires immediate attention. Expected resolution: ", ticketDetails.expectedResolution, _jsxs("span", { className: `ml-2 font-medium ${timeRemaining.color}`, children: ["(", timeRemaining.value, " remaining)"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(User, { className: "h-5 w-5" }), "Customer Information"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Name" }), _jsx("p", { className: "text-sm", children: ticketDetails.customer.name })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Email" }), _jsx("p", { className: "text-sm", children: ticketDetails.customer.email })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Phone" }), _jsx("p", { className: "text-sm", children: ticketDetails.customer.phone })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Loyalty Tier" }), _jsx(Badge, { variant: "default", children: ticketDetails.customer.loyaltyTier })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-5 w-5" }), "Flight Details"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Flight Number" }), _jsx("p", { className: "text-sm font-mono", children: ticketDetails.flightDetails.flightNumber })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Route" }), _jsx("p", { className: "text-sm", children: ticketDetails.flightDetails.route })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Scheduled Departure" }), _jsx("p", { className: "text-sm", children: ticketDetails.flightDetails.scheduledDeparture })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Actual Departure" }), _jsx("p", { className: "text-sm text-red-600", children: ticketDetails.flightDetails.actualDeparture })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Delay Reason" }), _jsx("p", { className: "text-sm", children: ticketDetails.flightDetails.delayReason })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Delay Duration" }), _jsx("p", { className: "text-sm font-medium text-red-600", children: ticketDetails.flightDetails.delayDuration })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Description" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-sm leading-relaxed", children: ticketDetails.description }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Related Tickets" }), _jsx(CardDescription, { children: "Similar or connected support cases" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: ticketDetails.relatedTickets.map((ticket) => (_jsxs("div", { className: "flex items-center justify-between p-2 border rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: ticket.id }), _jsx("p", { className: "text-xs text-muted-foreground", children: ticket.subject })] }), _jsx(Badge, { variant: getStatusColor(ticket.status), children: ticket.status })] }, ticket.id))) }) })] })] }), _jsx(TabsContent, { value: "conversation", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), "Customer Conversation"] }), _jsx(CardDescription, { children: "Chat history with the customer" })] }), _jsxs(CardContent, { children: [_jsx(ScrollArea, { className: "h-96 w-full pr-4", children: _jsx("div", { className: "space-y-4", children: chatHistory.map((message) => {
                                                                const ChannelIcon = getChannelIcon(message.channel);
                                                                const isCustomer = message.sender === 'customer';
                                                                const isAgent = message.sender === 'agent';
                                                                const isSystem = message.sender === 'system';
                                                                return (_jsx("div", { className: `flex ${isAgent ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] ${isAgent
                                                                            ? 'bg-blue-500 text-white'
                                                                            : isSystem
                                                                                ? 'bg-gray-100 border border-gray-200'
                                                                                : 'bg-white border border-gray-200'} rounded-lg p-3`, children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(ChannelIcon, { className: "h-3 w-3" }), _jsx("span", { className: "text-xs font-medium", children: message.senderName }), _jsx("span", { className: "text-xs opacity-70", children: message.timestamp })] }), _jsx("p", { className: "text-sm", children: message.message }), message.attachments && (_jsx("div", { className: "mt-2 space-y-1", children: message.attachments.map((attachment, index) => (_jsxs("div", { className: "flex items-center gap-2 text-xs", children: [_jsx(Paperclip, { className: "h-3 w-3" }), _jsx("span", { children: attachment })] }, index))) }))] }) }, message.id));
                                                            }) }) }), _jsx(Separator, { className: "my-4" }), _jsxs("div", { className: "space-y-3", children: [_jsx(Textarea, { placeholder: "Type your response to the customer...", value: newMessage, onChange: (e) => setNewMessage(e.target.value), rows: 3 }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Paperclip, { className: "h-4 w-4 mr-1" }), "Attach"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Zap, { className: "h-4 w-4 mr-1" }), "Use AI"] })] }), _jsxs(Button, { onClick: handleSendMessage, disabled: !newMessage.trim(), children: [_jsx(Send, { className: "h-4 w-4 mr-1" }), "Send Reply"] })] })] })] })] }) }), _jsx(TabsContent, { value: "history", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(History, { className: "h-5 w-5" }), "Ticket History"] }), _jsx(CardDescription, { children: "All actions and updates on this ticket" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: ticketHistory.map((event, index) => (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium", children: event.action }), _jsx("span", { className: "text-xs text-muted-foreground", children: event.timestamp })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: event.description }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["by ", event.user] })] })] }, event.id))) }) })] }) }), _jsx(TabsContent, { value: "attachments", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Paperclip, { className: "h-5 w-5" }), "Attachments"] }), _jsx(CardDescription, { children: "Files uploaded by customer and agents" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: ticketDetails.attachments.map((attachment, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(FileText, { className: "h-5 w-5 text-muted-foreground" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: attachment.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: attachment.size })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Download, { className: "h-4 w-4" }) })] })] }, index))) }) })] }) })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Ticket Details" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Status" }), isEditing ? (_jsxs(Select, { value: editedStatus, onValueChange: setEditedStatus, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Open", children: "Open" }), _jsx(SelectItem, { value: "In Progress", children: "In Progress" }), _jsx(SelectItem, { value: "AI to Address", children: "AI to Address" }), _jsx(SelectItem, { value: "Moved to Passenger", children: "Moved to Passenger" }), _jsx(SelectItem, { value: "Resolved", children: "Resolved" })] })] })) : (_jsx("div", { className: "mt-1", children: _jsx(Badge, { variant: getStatusColor(ticketDetails.status), children: ticketDetails.status }) }))] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Priority" }), isEditing ? (_jsxs(Select, { value: editedPriority, onValueChange: setEditedPriority, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })) : (_jsx("div", { className: "mt-1", children: _jsx(Badge, { variant: getPriorityColor(ticketDetails.priority), children: ticketDetails.priority }) }))] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Channel" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [(() => {
                                                                const ChannelIcon = getChannelIcon(ticketDetails.channel);
                                                                return _jsx(ChannelIcon, { className: "h-4 w-4 text-muted-foreground" });
                                                            })(), _jsx("span", { className: "text-sm", children: ticketDetails.channel })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Category" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(CategoryIcon, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { className: "text-sm", children: ticketDetails.category })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Assigned To" }), isEditing ? (_jsxs(Select, { value: editedAssignee, onValueChange: setEditedAssignee, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Sarah Johnson", children: "Sarah Johnson" }), _jsx(SelectItem, { value: "Mike Davis", children: "Mike Davis" }), _jsx(SelectItem, { value: "Lisa Wong", children: "Lisa Wong" }), _jsx(SelectItem, { value: "John Smith", children: "John Smith" })] })] })) : (_jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Avatar, { className: "h-6 w-6", children: _jsx(AvatarFallback, { className: "text-xs", children: ticketDetails.assignedTo.avatar }) }), _jsx("span", { className: "text-sm", children: ticketDetails.assignedTo.name })] }))] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Created" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: ticketDetails.createdAt })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Last Updated" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: ticketDetails.updatedAt })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Expected Resolution" }), _jsxs("p", { className: `text-sm mt-1 ${timeRemaining.color}`, children: [ticketDetails.expectedResolution, _jsx("br", {}), _jsxs("span", { className: "text-xs", children: ["(", timeRemaining.value, ")"] })] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-5 w-5" }), "AI Recommendations"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-blue-600" }), _jsxs("span", { className: "text-sm font-medium text-blue-800", children: ["Confidence: ", ticketDetails.aiSuggestion.confidence, "%"] })] }), _jsx("p", { className: "text-sm text-blue-800 mb-3", children: ticketDetails.aiSuggestion.recommendation }), _jsxs("p", { className: "text-xs text-blue-700 mb-3", children: [_jsx("strong", { children: "Reasoning:" }), " ", ticketDetails.aiSuggestion.reasoning] }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs font-medium text-blue-800", children: "Suggested Actions:" }), ticketDetails.aiSuggestion.suggestedActions.map((action, index) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("div", { className: "w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" }), _jsx("p", { className: "text-xs text-blue-700", children: action })] }, index)))] }), _jsx("div", { className: "mt-3 pt-2 border-t border-blue-200", children: _jsxs("p", { className: "text-xs text-blue-600", children: [_jsx("strong", { children: "Policy:" }), " ", ticketDetails.aiSuggestion.policyReference] }) })] }), _jsxs(Button, { className: "w-full", size: "sm", children: [_jsx(Zap, { className: "h-4 w-4 mr-1" }), "Apply AI Suggestion"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Tag, { className: "h-5 w-5" }), "Tags"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "flex flex-wrap gap-2", children: ticketDetails.tags.map((tag) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: tag }, tag))) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Internal Notes" }), _jsx(CardDescription, { children: "Notes visible only to agents" })] }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx(Textarea, { placeholder: "Add internal note...", value: internalNote, onChange: (e) => setInternalNote(e.target.value), rows: 3 }), _jsx(Button, { size: "sm", className: "w-full", onClick: handleAddInternalNote, disabled: !internalNote.trim(), children: "Add Note" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Quick Actions" }) }), _jsxs(CardContent, { className: "space-y-2", children: [_jsxs(Button, { variant: "outline", className: "w-full justify-start", size: "sm", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Escalate to Manager"] }), _jsxs(Button, { variant: "outline", className: "w-full justify-start", size: "sm", children: [_jsx(Flag, { className: "h-4 w-4 mr-2" }), "Mark as Priority"] }), _jsxs(Button, { variant: "outline", className: "w-full justify-start", size: "sm", children: [_jsx(Star, { className: "h-4 w-4 mr-2" }), "Add to Favorites"] }), _jsxs(Button, { variant: "outline", className: "w-full justify-start", size: "sm", children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-2" }), "Create Follow-up"] })] })] })] })] })] }));
}
