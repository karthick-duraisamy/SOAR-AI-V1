import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Building2, Mail, Phone, MapPin, Calendar, Users, Search, Filter, Download, RefreshCw, Plus, MessageSquare, Edit, BarChart3, History, User, ArrowRight, Lightbulb, CheckCircle2, AlertTriangle, Target, Eye, ExternalLink, ChevronDown, PhoneCall, Video, CalendarDays, Activity // Imported for Actions dropdown
 } from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./ui/dropdown-menu";
import { useLeadApi } from '../hooks/api/useLeadApi';
const statusColors = {
    'qualified': 'bg-green-100 text-green-800 border-green-200',
    'contacted': 'bg-blue-100 text-blue-800 border-blue-200',
    'new': 'bg-orange-100 text-orange-800 border-orange-200',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'unqualified': 'bg-red-100 text-red-800 border-red-200',
    'proposal_sent': 'bg-purple-100 text-purple-800 border-purple-200',
    'negotiation': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'won': 'bg-green-100 text-green-800 border-green-200',
    'lost': 'bg-gray-100 text-gray-800 border-gray-200'
};
const urgencyColors = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-green-100 text-green-800'
};
const engagementColors = {
    'High': 'text-green-600',
    'Medium': 'text-yellow-600',
    'Low': 'text-red-600'
};
const getHistoryIcon = (iconType) => {
    const icons = {
        'plus': Plus,
        'mail': Mail,
        'phone': Phone,
        'message-circle': MessageSquare,
        'message-square': MessageSquare,
        'trending-up': BarChart3,
        'user': User,
        'check-circle': CheckCircle2,
        'x-circle': AlertTriangle,
        'calendar': Calendar,
        'briefcase': Building2,
        'file-text': MessageSquare,
        'handshake': User,
        'trophy': CheckCircle2,
        'x': AlertTriangle
    };
    return icons[iconType] || MessageSquare;
};
export function AllLeads({ onNavigate }) {
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
    const [leads, setLeads] = useState([]);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [selectedLeadHistory, setSelectedLeadHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedLeadName, setSelectedLeadName] = useState('');
    const [showAssignAgentDialog, setShowAssignAgentDialog] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [leadsForViewProfile, setLeadsForViewProfile] = useState([]); // State for leads to view profile
    const [selectedCorporate, setSelectedCorporate] = useState(null);
    const [showCorporateProfile, setShowCorporateProfile] = useState(false);
    const [selectedLeadForNote, setSelectedLeadForNote] = useState(null);
    // Modal states for Actions dropdown
    const [showCallDialog, setShowCallDialog] = useState(false);
    const [showMeetingDialog, setShowMeetingDialog] = useState(false);
    const [showDemoDialog, setShowDemoDialog] = useState(false);
    const [selectedLeadForAction, setSelectedLeadForAction] = useState(null);
    // Initialize API hook
    const leadApi = useLeadApi();
    // Lead form states
    const [newLeadForm, setNewLeadForm] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phone: '',
        industry: '',
        location: '',
        companySize: '',
        annualRevenue: '',
        travelBudget: '',
        status: 'new',
        source: 'website',
        score: '0',
        estimatedValue: '',
        notes: '',
        isDecisionMaker: false
    });
    // Fetch leads from API
    const fetchLeads = async () => {
        try {
            const data = await leadApi.getLeads(filters);
            setLeads(data);
        }
        catch (err) {
            toast.error('Failed to fetch leads');
        }
    };
    useEffect(() => {
        fetchLeads();
    }, []);
    // Refetch when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLeads();
        }, 300); // Debounce filter changes
        return () => clearTimeout(timeoutId);
    }, [filters]);
    // Filter states
    const [filters, setFilters] = useState({
        status: 'all',
        industry: 'all',
        score: 'all',
        engagement: 'all',
        search: ''
    });
    // Filter leads based on current filters
    const filteredLeads = leads.filter(lead => {
        if (filters.search && !lead.company.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !lead.contact.first_name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !lead.contact.last_name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
        if (filters.status && filters.status !== 'all' && lead.status !== filters.status) {
            return false;
        }
        if (filters.industry && filters.industry !== 'all' && lead.company.industry !== filters.industry) {
            return false;
        }
        if (filters.score && filters.score !== 'all') {
            if (filters.score === 'high' && lead.score < 80)
                return false;
            if (filters.score === 'medium' && (lead.score < 60 || lead.score >= 80))
                return false;
            if (filters.score === 'low' && lead.score >= 60)
                return false;
        }
        if (filters.engagement && filters.engagement !== 'all' && lead.engagement !== filters.engagement) {
            return false;
        }
        return true;
    });
    // Sync select all state with filtered leads
    useEffect(() => {
        if (selectedLeads.length === 0) {
            setSelectAll(false);
        }
        else if (filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length) {
            setSelectAll(true);
        }
        else {
            setSelectAll(false);
        }
    }, [selectedLeads, filteredLeads]);
    const handleSelectLead = (leadId, checked) => {
        if (checked) {
            setSelectedLeads(prev => [...prev, leadId]);
        }
        else {
            setSelectedLeads(prev => prev.filter(id => id !== leadId));
            setSelectAll(false);
        }
    };
    const handleSelectAll = (checked) => {
        if (checked) {
            const allLeadIds = filteredLeads.map(lead => lead.id);
            setSelectedLeads(allLeadIds);
            setSelectAll(true);
        }
        else {
            setSelectedLeads([]);
            setSelectAll(false);
        }
    };
    const clearFilters = () => {
        setFilters({ status: 'all', industry: 'all', score: 'all', engagement: 'all', search: '' });
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return 'text-green-600';
        if (score >= 60)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    // Handle input change for the new lead form
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setNewLeadForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value
        }));
    };
    // Handle viewing lead history
    const handleViewHistory = async (leadId, companyName) => {
        setHistoryLoading(true);
        setSelectedLeadName(companyName);
        setShowHistoryDialog(true);
        try {
            const history = await leadApi.getHistory(leadId);
            setSelectedLeadHistory(history);
        }
        catch (error) {
            toast.error('Failed to fetch lead history');
            setSelectedLeadHistory([]);
        }
        finally {
            setHistoryLoading(false);
        }
    };
    const handleViewProfile = (lead) => {
        console.log(leadsForViewProfile, 'leadsForViewProfile', lead, "lead");
        const item = leadsForViewProfile.find(entry => entry.id === lead.id);
        console.log(item, "item");
        setSelectedCorporate(item);
        setShowCorporateProfile(true);
    };
    // Handlers for Actions dropdown options
    const handleInitiateCall = (lead) => {
        setSelectedLeadForAction(lead);
        setShowCallDialog(true);
    };
    const handleScheduleMeeting = (lead) => {
        setSelectedLeadForAction(lead);
        setShowMeetingDialog(true);
    };
    const handleScheduleDemo = (lead) => {
        setSelectedLeadForAction(lead);
        setShowDemoDialog(true);
    };
    // Handle bulk actions
    const handleStartCampaign = () => {
        if (selectedLeads.length === 0) {
            toast.error('Please select leads first');
            return;
        }
        // Navigate to campaign creation with selected leads
        const selectedLeadData = filteredLeads.filter(lead => selectedLeads.includes(lead.id));
        onNavigate('marketing-campaign', {
            preSelectedLeads: selectedLeadData,
            campaignType: 'bulk_email'
        });
        toast.success(`Campaign started for ${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''}`);
        // Clear selection after action
        setSelectedLeads([]);
        setSelectAll(false);
    };
    const handleAssignAgent = () => {
        if (selectedLeads.length === 0) {
            toast.error('Please select leads first');
            return;
        }
        setShowAssignAgentDialog(true);
    };
    const handleConfirmAssignAgent = async () => {
        if (!selectedAgent) {
            toast.error('Please select an agent');
            return;
        }
        try {
            // Here you would make API calls to assign the agent to selected leads
            // For now, we'll simulate the API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''} assigned to ${selectedAgent}`);
            setShowAssignAgentDialog(false);
            setSelectedAgent('');
            handleClearSelection();
            // Refresh leads to show updated assignments
            await fetchLeads();
        }
        catch (error) {
            toast.error('Failed to assign agent');
        }
    };
    const handleClearSelection = () => {
        setSelectedLeads([]);
        setSelectAll(false);
        toast.success('Selection cleared');
    };
    // Handle form submission for adding a new lead
    const handleAddLead = async (e) => {
        e.preventDefault();
        // Validate required fields
        if (!newLeadForm.companyName.trim() || !newLeadForm.firstName.trim() || !newLeadForm.email.trim() || !newLeadForm.industry.trim()) {
            toast.error('Please fill in all required fields (Company Name, First Name, Email, and Industry)');
            return;
        }
        try {
            const leadData = {
                company: {
                    name: newLeadForm.companyName,
                    industry: newLeadForm.industry || 'other',
                    location: newLeadForm.location || '',
                    size: newLeadForm.companySize || 'medium',
                    annual_revenue: newLeadForm.annualRevenue ? parseFloat(newLeadForm.annualRevenue.replace(/[^\d.-]/g, '')) : null,
                    travel_budget: newLeadForm.travelBudget ? parseFloat(newLeadForm.travelBudget.replace(/[^\d.-]/g, '')) : null
                },
                contact: {
                    first_name: newLeadForm.firstName,
                    last_name: newLeadForm.lastName,
                    position: newLeadForm.position || '',
                    email: newLeadForm.email,
                    phone: newLeadForm.phone || '',
                    is_decision_maker: newLeadForm.isDecisionMaker
                },
                status: newLeadForm.status || 'new',
                source: newLeadForm.source || 'website',
                score: parseInt(newLeadForm.score) || 0,
                estimated_value: newLeadForm.estimatedValue ? parseFloat(newLeadForm.estimatedValue.replace(/[^\d.-]/g, '')) : null,
                notes: newLeadForm.notes || '',
                priority: 'medium'
            };
            const newLead = await leadApi.createLead(leadData);
            // Refresh the leads list from the server to ensure consistency
            await fetchLeads();
            // Reset form
            setNewLeadForm({
                companyName: '',
                firstName: '',
                lastName: '',
                position: '',
                email: '',
                phone: '',
                industry: '',
                location: '',
                companySize: '',
                annualRevenue: '',
                travelBudget: '',
                status: 'new',
                source: 'website',
                score: '0',
                estimatedValue: '',
                notes: '',
                isDecisionMaker: false
            });
            setShowNewLeadDialog(false);
            toast.success('Lead added successfully!');
        }
        catch (err) {
            toast.error('Failed to add lead. Please try again.');
            console.error('Error creating lead:', err);
        }
    };
    if (leadApi.loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg font-medium", children: "Loading leads..." }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Please wait while we fetch your data" })] }) }));
    }
    if (leadApi.error) {
        return (_jsxs("div", { className: "text-center py-8", children: [_jsx(AlertTriangle, { className: "h-12 w-12 mx-auto mb-4 text-red-500" }), _jsxs("p", { className: "text-red-600 mb-4", children: ["Error: ", leadApi.error] }), _jsxs(Button, { onClick: fetchLeads, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Try Again"] })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 p-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-6", children: [_jsxs("button", { className: "flex items-center gap-1 hover:text-orange-600", children: [_jsx(Users, { className: "h-4 w-4" }), "AI Assistant"] }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-gray-900 font-medium", children: "All Leads" })] }), _jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "All Leads" }), _jsx("p", { className: "text-gray-600", children: "Comprehensive lead management with status tracking and AI suggestions" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "outline", className: "text-gray-600 border-gray-300", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export"] }), _jsxs(Button, { variant: "outline", className: "text-gray-600 border-gray-300", onClick: fetchLeads, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh"] }), _jsxs(Button, { variant: "outline", className: "text-gray-600 border-gray-300", children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), "Email Campaign"] }), _jsxs(Button, { className: "bg-orange-600 hover:bg-orange-700 text-white", onClick: () => setShowNewLeadDialog(true), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add New Lead"] })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { className: "pb-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5 text-gray-500" }), _jsx(CardTitle, { className: "text-lg", children: "Lead Filters" })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Company or contact...", className: "pl-10 border-gray-300", value: filters.search, onChange: (e) => setFilters({ ...filters, search: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Status" }), _jsxs(Select, { value: filters.status, onValueChange: (value) => setFilters({ ...filters, status: value }), children: [_jsx(SelectTrigger, { className: "border-gray-300", children: _jsx(SelectValue, { placeholder: "All statuses" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All statuses" }), _jsx(SelectItem, { value: "qualified", children: "Qualified" }), _jsx(SelectItem, { value: "contacted", children: "Contacted" }), _jsx(SelectItem, { value: "new", children: "New" }), _jsx(SelectItem, { value: "in-progress", children: "In Progress" }), _jsx(SelectItem, { value: "unqualified", children: "Unqualified" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Industry" }), _jsxs(Select, { value: filters.industry, onValueChange: (value) => setFilters({ ...filters, industry: value }), children: [_jsx(SelectTrigger, { className: "border-gray-300", children: _jsx(SelectValue, { placeholder: "All industries" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All industries" }), _jsx(SelectItem, { value: "Technology", children: "Technology" }), _jsx(SelectItem, { value: "Manufacturing", children: "Manufacturing" }), _jsx(SelectItem, { value: "Financial Services", children: "Financial Services" }), _jsx(SelectItem, { value: "Banking", children: "Banking" }), _jsx(SelectItem, { value: "Consulting", children: "Consulting" }), _jsx(SelectItem, { value: "Retail", children: "Retail" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Score" }), _jsxs(Select, { value: filters.score, onValueChange: (value) => setFilters({ ...filters, score: value }), children: [_jsx(SelectTrigger, { className: "border-gray-300", children: _jsx(SelectValue, { placeholder: "All scores" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All scores" }), _jsx(SelectItem, { value: "high", children: "High (80+)" }), _jsx(SelectItem, { value: "medium", children: "Medium (60-79)" }), _jsx(SelectItem, { value: "low", children: "Low (<60)" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Engagement" }), _jsxs(Select, { value: filters.engagement, onValueChange: (value) => setFilters({ ...filters, engagement: value }), children: [_jsx(SelectTrigger, { className: "border-gray-300", children: _jsx(SelectValue, { placeholder: "All levels" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All levels" }), _jsx(SelectItem, { value: "Very High", children: "Very High" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })] }), _jsx("div", { className: "flex items-end", children: _jsx(Button, { variant: "outline", onClick: clearFilters, className: "text-gray-600 border-gray-300", children: "Clear Filters" }) })] }) })] }), selectedLeads.length > 0 && (_jsx("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 shadow-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full", children: _jsx("span", { className: "text-white font-medium text-sm", children: selectedLeads.length }) }), _jsxs("span", { className: "text-orange-800 font-medium", children: [selectedLeads.length, " lead", selectedLeads.length > 1 ? 's' : '', " selected"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { size: "sm", className: "bg-orange-600 hover:bg-orange-700 text-white", onClick: handleStartCampaign, children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), "Start Campaign"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300 hover:bg-gray-50", onClick: handleAssignAgent, children: [_jsx(User, { className: "h-4 w-4 mr-2" }), "Assign Agent"] }), _jsx(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300 hover:bg-gray-50", onClick: handleClearSelection, children: "Clear Selection" })] })] }) })), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["All Leads (", filteredLeads.length, " results)"] }), _jsx("p", { className: "text-sm text-gray-600", children: "Comprehensive lead management with status tracking and AI suggestions" })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "select-all", checked: selectAll, onChange: (e) => handleSelectAll(e.target.checked), className: "rounded border-gray-300" }), _jsx(Label, { htmlFor: "select-all", className: "text-sm text-gray-600", children: "Select All" })] }) })] }), _jsx("div", { className: "space-y-4", children: filteredLeads.map((lead) => (_jsx(Card, { className: "border border-gray-200 hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "checkbox", checked: selectedLeads.includes(lead.id), onChange: (e) => handleSelectLead(lead.id, e.target.checked), className: "rounded border-gray-300" }), _jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg", children: _jsx(Building2, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: lead.company.name }), _jsx(Badge, { className: `${statusColors[lead.status] || 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded-md`, children: lead.status === 'contacted' ? 'Contacted Ready' :
                                                                    lead.status === 'qualified' ? 'Decision Maker' :
                                                                        lead.status }), lead.status === 'contacted' && (_jsx(Badge, { className: "bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md", children: "Action Required" }))] }), _jsxs("p", { className: "text-gray-700 font-medium", children: [lead.contact.first_name, " ", lead.contact.last_name, " \u2022 ", lead.contact.position] }), _jsxs("div", { className: "flex items-center gap-6 text-sm text-gray-600 mt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "h-3 w-3" }), lead.contact.email] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "h-3 w-3" }), lead.contact.phone] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3 w-3" }), "San Francisco, CA"] }), _jsxs("span", { className: "flex items-center gap-1 text-blue-600 hover:underline cursor-pointer", children: [_jsx(ExternalLink, { className: "h-3 w-3" }), "Website"] })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: `text-lg font-bold ${getScoreColor(lead.score)} mb-1`, children: ["Score: ", lead.score] }), _jsxs("div", { className: "text-green-600 font-semibold", children: ["$", lead.estimated_value?.toLocaleString() || '450K', " budget"] }), _jsx(Badge, { className: `${urgencyColors['high'] || 'bg-red-100 text-red-800'} text-xs mt-1`, children: "High urgency" })] })] }), lead.status === 'contacted' && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-red-600 mt-0.5" }), _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-red-800", children: "Next Action: Move to contract" }), _jsx("p", { className: "text-sm text-red-700", children: "Lead is qualified and ready for contract negotiation." })] }), _jsx(Button, { size: "sm", variant: "outline", className: "text-red-600 border-red-300", children: _jsx(ArrowRight, { className: "h-4 w-4" }) })] }) })] }) })), _jsxs("div", { className: "grid grid-cols-2 gap-6 mb-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Industry:" }), " ", lead.company.industry || 'N/A'] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Company Size:" }), " ", lead.company.size || 'N/A'] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Revenue:" }), " ", lead.company.annual_revenue?.toLocaleString() || 'N/A'] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Source:" }), " ", lead.source] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Assigned Agent:" }), " ", lead.assigned_to?.username || 'Unassigned'] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Last Contact:" }), " ", lead.updated_at] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Follow-up Date:" }), " N/A"] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Engagement:" }), _jsx("span", { className: `${engagementColors[lead.engagement] || 'text-gray-600'} ml-1`, children: lead.engagement || 'N/A' })] }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: "Enterprise" }), _jsx(Badge, { variant: "outline", className: "text-xs", children: "High-Value" }), _jsx(Badge, { variant: "outline", className: "text-xs", children: "Decision Maker" })] })] })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Lightbulb, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-blue-800", children: "AI Suggestion:" }), _jsx("p", { className: "text-sm text-blue-700", children: "Schedule product demo within 3 days. High conversion probability." })] })] }) }), lead.notes && (_jsx("div", { className: "bg-gray-50 rounded-lg p-3 mb-4", children: _jsxs("p", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Notes:" }), " ", lead.notes] }) })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs(Button, { size: "sm", className: "bg-orange-600 hover:bg-orange-700 text-white", children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-1" }), "Contacts"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300", children: [_jsx(Edit, { className: "h-4 w-4 mr-1" }), "Add Note"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-orange-700 border-orange-300 bg-orange-50", children: [_jsx(BarChart3, { className: "h-4 w-4 mr-1" }), "Campaign"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300", onClick: () => handleViewHistory(lead.id, lead.company.name), children: [_jsx(History, { className: "h-4 w-4 mr-1" }), "History"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-purple-700 border-purple-300 bg-purple-50", children: [_jsx(User, { className: "h-4 w-4 mr-1" }), "Reassign"] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: "outline", className: "text-blue-700 border-blue-200 bg-blue-50", children: [_jsx(Activity, { className: "h-4 w-4 mr-1" }), "Actions", _jsx(ChevronDown, { className: "h-4 w-4 ml-1" })] }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-56 bg-white shadow-lg border border-gray-200 rounded-lg p-1", children: [_jsxs(DropdownMenuItem, { className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded cursor-pointer", onClick: () => handleInitiateCall(lead), children: [_jsx(PhoneCall, { className: "h-4 w-4 text-blue-500" }), "Initiate Call"] }), _jsxs(DropdownMenuItem, { className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded cursor-pointer", onClick: () => handleScheduleMeeting(lead), children: [_jsx(CalendarDays, { className: "h-4 w-4 text-green-500" }), "Schedule Meeting"] }), _jsxs(DropdownMenuItem, { className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded cursor-pointer", onClick: () => handleScheduleDemo(lead), children: [_jsx(Video, { className: "h-4 w-4 text-purple-500" }), "Schedule Demo"] })] })] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-orange-700 border-orange-300 bg-orange-50", children: [_jsx(Target, { className: "h-4 w-4 mr-1" }), "Create Offer"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-green-700 border-green-300 bg-green-50", children: [_jsx(ArrowRight, { className: "h-4 w-4 mr-1" }), "Move to Opportunity"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", className: "text-red-700 border-red-300", children: "Disqualify" }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300", children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "Details"] })] })] })] }) }, lead.id))) }), filteredLeads.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No leads found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Try adjusting your filters or add new leads to get started." }), _jsxs(Button, { className: "bg-orange-600 hover:bg-orange-700 text-white", onClick: () => setShowNewLeadDialog(true), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add New Lead"] })] })), _jsx(Dialog, { open: showNewLeadDialog, onOpenChange: setShowNewLeadDialog, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Add New Lead" }), _jsx(DialogDescription, { children: "Enter the lead details below. Click save when you're done." })] }), _jsxs("form", { onSubmit: handleAddLead, children: [_jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "companyName", className: "text-right", children: "Company Name *" }), _jsx(Input, { id: "companyName", name: "companyName", value: newLeadForm.companyName, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "industry", className: "text-right", children: "Industry *" }), _jsxs(Select, { name: "industry", value: newLeadForm.industry, onValueChange: (value) => setNewLeadForm(prev => ({ ...prev, industry: value })), required: true, children: [_jsx(SelectTrigger, { className: "col-span-3 border-gray-300", children: _jsx(SelectValue, { placeholder: "Select industry" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Technology", children: "Technology" }), _jsx(SelectItem, { value: "finance", children: "Finance & Banking" }), _jsx(SelectItem, { value: "healthcare", children: "Healthcare" }), _jsx(SelectItem, { value: "manufacturing", children: "Manufacturing" }), _jsx(SelectItem, { value: "retail", children: "Retail" }), _jsx(SelectItem, { value: "consulting", children: "Consulting" }), _jsx(SelectItem, { value: "telecommunications", children: "Telecommunications" }), _jsx(SelectItem, { value: "energy", children: "Energy & Utilities" }), _jsx(SelectItem, { value: "transportation", children: "Transportation" }), _jsx(SelectItem, { value: "education", children: "Education" }), _jsx(SelectItem, { value: "government", children: "Government" }), _jsx(SelectItem, { value: "other", children: "Other" })] })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "location", className: "text-right", children: "Location" }), _jsx(Input, { id: "location", name: "location", value: newLeadForm.location, onChange: handleInputChange, className: "col-span-3", placeholder: "City, State/Country" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "companySize", className: "text-right", children: "Company Size" }), _jsxs(Select, { name: "companySize", value: newLeadForm.companySize, onValueChange: (value) => setNewLeadForm(prev => ({ ...prev, companySize: value })), children: [_jsx(SelectTrigger, { className: "col-span-3 border-gray-300", children: _jsx(SelectValue, { placeholder: "Select company size" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "startup", children: "Startup (1-50)" }), _jsx(SelectItem, { value: "small", children: "Small (51-200)" }), _jsx(SelectItem, { value: "medium", children: "Medium (201-1000)" }), _jsx(SelectItem, { value: "large", children: "Large (1001-5000)" }), _jsx(SelectItem, { value: "enterprise", children: "Enterprise (5000+)" })] })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "annualRevenue", className: "text-right", children: "Annual Revenue" }), _jsx(Input, { id: "annualRevenue", name: "annualRevenue", value: newLeadForm.annualRevenue, onChange: handleInputChange, className: "col-span-3", placeholder: "e.g., $10M, $50M" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "travelBudget", className: "text-right", children: "Travel Budget" }), _jsx(Input, { id: "travelBudget", name: "travelBudget", value: newLeadForm.travelBudget, onChange: handleInputChange, className: "col-span-3", placeholder: "e.g., $250K, $500K" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "firstName", className: "text-right", children: "Contact First Name *" }), _jsx(Input, { id: "firstName", name: "firstName", value: newLeadForm.firstName, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "lastName", className: "text-right", children: "Contact Last Name" }), _jsx(Input, { id: "lastName", name: "lastName", value: newLeadForm.lastName, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "position", className: "text-right", children: "Position" }), _jsx(Input, { id: "position", name: "position", value: newLeadForm.position, onChange: handleInputChange, className: "col-span-3", placeholder: "e.g., Travel Manager, CFO" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "email", className: "text-right", children: "Email *" }), _jsx(Input, { id: "email", name: "email", type: "email", value: newLeadForm.email, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "phone", className: "text-right", children: "Phone" }), _jsx(Input, { id: "phone", name: "phone", value: newLeadForm.phone, onChange: handleInputChange, className: "col-span-3", placeholder: "+1 (555) 123-4567" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "isDecisionMaker", className: "text-right", children: "Decision Maker" }), _jsxs("div", { className: "col-span-3 flex items-center", children: [_jsx("input", { id: "isDecisionMaker", name: "isDecisionMaker", type: "checkbox", checked: newLeadForm.isDecisionMaker, onChange: handleInputChange, className: "rounded border-gray-300" }), _jsx(Label, { htmlFor: "isDecisionMaker", className: "ml-2 text-sm", children: "Contact is a decision maker" })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "status", className: "text-right", children: "Initial Status" }), _jsxs(Select, { name: "status", value: newLeadForm.status, onValueChange: (value) => setNewLeadForm(prev => ({ ...prev, status: value })), children: [_jsx(SelectTrigger, { className: "col-span-3 border-gray-300", children: _jsx(SelectValue, { placeholder: "Select status" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "new", children: "New" }), _jsx(SelectItem, { value: "qualified", children: "Qualified" }), _jsx(SelectItem, { value: "contacted", children: "Contacted" }), _jsx(SelectItem, { value: "unqualified", children: "Unqualified" })] })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "source", className: "text-right", children: "Lead Source" }), _jsxs(Select, { name: "source", value: newLeadForm.source, onValueChange: (value) => setNewLeadForm(prev => ({ ...prev, source: value })), children: [_jsx(SelectTrigger, { className: "col-span-3 border-gray-300", children: _jsx(SelectValue, { placeholder: "Select source" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "website", children: "Website" }), _jsx(SelectItem, { value: "referral", children: "Referral" }), _jsx(SelectItem, { value: "cold_outreach", children: "Cold Outreach" }), _jsx(SelectItem, { value: "marketing", children: "Marketing Campaign" }), _jsx(SelectItem, { value: "social_media", children: "Social Media" }), _jsx(SelectItem, { value: "corporate_search", children: "Corporate Search" }), _jsx(SelectItem, { value: "ai_discovery", children: "AI Discovery" })] })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "estimatedValue", className: "text-right", children: "Estimated Value" }), _jsx(Input, { id: "estimatedValue", name: "estimatedValue", value: newLeadForm.estimatedValue, onChange: handleInputChange, className: "col-span-3", placeholder: "e.g., 25000, 450000" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "notes", className: "text-right", children: "Notes" }), _jsx("textarea", { id: "notes", name: "notes", value: newLeadForm.notes, onChange: handleInputChange, className: "col-span-3 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", placeholder: "Additional notes about this lead..." })] })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { type: "button", variant: "outline", children: "Cancel" }) }), _jsx(Button, { type: "submit", children: "Save Lead" })] })] })] }) }), _jsx(Dialog, { open: showHistoryDialog, onOpenChange: setShowHistoryDialog, children: _jsxs(DialogContent, { className: "sm:max-w-[600px] max-h-[80vh]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Lead History - ", selectedLeadName] }), _jsx(DialogDescription, { children: "Complete timeline of all activities and changes for this lead." })] }), _jsx("div", { className: "max-h-[400px] overflow-y-auto", children: historyLoading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Loading history..." })] })) : selectedLeadHistory.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(History, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-600", children: "No history available for this lead." })] })) : (_jsx("div", { className: "space-y-4", children: selectedLeadHistory.map((entry) => {
                                    const IconComponent = getHistoryIcon(entry.icon);
                                    return (_jsxs("div", { className: "flex items-start gap-4 p-4 border border-gray-200 rounded-lg", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full flex-shrink-0", children: _jsx(IconComponent, { className: "h-5 w-5 text-orange-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: entry.action }), _jsx("span", { className: "text-sm text-gray-500", children: new Date(entry.timestamp).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                }) })] }), _jsx("p", { className: "text-gray-700 text-sm mb-2", children: entry.details }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: entry.history_type.replace('_', ' ') }), _jsxs("span", { className: "text-xs text-gray-500", children: ["by ", entry.user_name] })] })] })] }, entry.id));
                                }) })) }), _jsx(DialogFooter, { children: _jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Close" }) }) })] }) }), _jsx(Dialog, { open: showAssignAgentDialog, onOpenChange: setShowAssignAgentDialog, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Assign Agent" }), _jsxs(DialogDescription, { children: ["Assign ", selectedLeads.length, " selected lead", selectedLeads.length > 1 ? 's' : '', " to an agent."] })] }), _jsx("div", { className: "py-4", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "agent-select", className: "text-sm font-medium text-gray-700", children: "Select Agent" }), _jsxs(Select, { value: selectedAgent, onValueChange: setSelectedAgent, children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, { placeholder: "Choose an agent..." }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "john-doe", children: "John Doe" }), _jsx(SelectItem, { value: "jane-smith", children: "Jane Smith" }), _jsx(SelectItem, { value: "mike-johnson", children: "Mike Johnson" }), _jsx(SelectItem, { value: "sarah-wilson", children: "Sarah Wilson" }), _jsx(SelectItem, { value: "david-brown", children: "David Brown" })] })] })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Selected Leads:" }), " ", selectedLeads.length, " lead", selectedLeads.length > 1 ? 's' : '', " will be assigned to the selected agent."] }) })] }) }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Cancel" }) }), _jsx(Button, { onClick: handleConfirmAssignAgent, className: "bg-orange-600 hover:bg-orange-700 text-white", children: "Assign Agent" })] })] }) }), _jsx(Dialog, { open: showCallDialog, onOpenChange: setShowCallDialog, children: _jsxs(DialogContent, { className: "max-w-md", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(PhoneCall, { className: "h-5 w-5 text-blue-600" }), "Initiate Call with ", selectedLeadForAction?.company.name] }), _jsxs(DialogDescription, { children: ["Start a phone call with ", selectedLeadForAction?.contact.first_name, " ", selectedLeadForAction?.contact.last_name] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-blue-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Phone, { className: "h-4 w-4 text-blue-600" }), _jsx("span", { className: "font-medium text-blue-900", children: "Contact Information" })] }), _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Phone:" }), " ", selectedLeadForAction?.contact.phone] }), _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Email:" }), " ", selectedLeadForAction?.contact.email] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Call Notes (Optional)" }), _jsx(Textarea, { placeholder: "Add any notes or talking points for this call...", className: "mt-1 min-h-[80px] resize-none" })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowCallDialog(false);
                                        setSelectedLeadForAction(null);
                                    }, className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { onClick: () => {
                                        // Handle call initiation logic here
                                        toast.success(`Call initiated with ${selectedLeadForAction?.company.name}`);
                                        setShowCallDialog(false);
                                        setSelectedLeadForAction(null);
                                    }, className: "bg-blue-500 hover:bg-blue-600 text-white", children: [_jsx(PhoneCall, { className: "h-4 w-4 mr-2" }), "Start Call"] })] })] }) }), _jsx(Dialog, { open: showMeetingDialog, onOpenChange: setShowMeetingDialog, children: _jsxs(DialogContent, { className: "max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(CalendarDays, { className: "h-5 w-5 text-green-600" }), "Schedule Meeting with ", selectedLeadForAction?.company.name] }), _jsxs(DialogDescription, { children: ["Schedule a business meeting with ", selectedLeadForAction?.contact.first_name, " ", selectedLeadForAction?.contact.last_name] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Date" }), _jsx(Input, { type: "date", className: "mt-1", min: new Date().toISOString().split('T')[0] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Time" }), _jsx(Input, { type: "time", className: "mt-1" })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Type" }), _jsxs(Select, { children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, { placeholder: "Select meeting type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "discovery", children: "Discovery Call" }), _jsx(SelectItem, { value: "presentation", children: "Business Presentation" }), _jsx(SelectItem, { value: "negotiation", children: "Contract Negotiation" }), _jsx(SelectItem, { value: "follow-up", children: "Follow-up Meeting" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Agenda" }), _jsx(Textarea, { placeholder: "Brief description of meeting agenda and objectives...", className: "mt-1 min-h-[80px] resize-none" })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowMeetingDialog(false);
                                        setSelectedLeadForAction(null);
                                    }, className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { onClick: () => {
                                        // Handle meeting scheduling logic here
                                        toast.success(`Meeting scheduled with ${selectedLeadForAction?.company.name}`);
                                        setShowMeetingDialog(false);
                                        setSelectedLeadForAction(null);
                                    }, className: "bg-green-500 hover:bg-green-600 text-white", children: [_jsx(CalendarDays, { className: "h-4 w-4 mr-2" }), "Schedule Meeting"] })] })] }) }), _jsx(Dialog, { open: showDemoDialog, onOpenChange: setShowDemoDialog, children: _jsxs(DialogContent, { className: "max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Video, { className: "h-5 w-5 text-purple-600" }), "Schedule Demo with ", selectedLeadForAction?.company.name] }), _jsxs(DialogDescription, { children: ["Schedule a product demonstration for ", selectedLeadForAction?.contact.first_name, " ", selectedLeadForAction?.contact.last_name] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Date" }), _jsx(Input, { type: "date", className: "mt-1", min: new Date().toISOString().split('T')[0] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Time" }), _jsx(Input, { type: "time", className: "mt-1" })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Type" }), _jsxs(Select, { children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, { placeholder: "Select demo type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "product-overview", children: "Product Overview" }), _jsx(SelectItem, { value: "technical-demo", children: "Technical Demonstration" }), _jsx(SelectItem, { value: "custom-solution", children: "Custom Solution Demo" }), _jsx(SelectItem, { value: "live-demo", children: "Live System Demo" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Duration" }), _jsxs(Select, { children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, { placeholder: "Select duration" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "30", children: "30 minutes" }), _jsx(SelectItem, { value: "45", children: "45 minutes" }), _jsx(SelectItem, { value: "60", children: "1 hour" }), _jsx(SelectItem, { value: "90", children: "1.5 hours" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Focus Areas" }), _jsx(Textarea, { placeholder: "Key features and solutions to demonstrate based on their business needs...", className: "mt-1 min-h-[80px] resize-none" })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowDemoDialog(false);
                                        setSelectedLeadForAction(null);
                                    }, className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { onClick: () => {
                                        // Handle demo scheduling logic here
                                        toast.success(`Demo scheduled with ${selectedLeadForAction?.company.name}`);
                                        setShowDemoDialog(false);
                                        setSelectedLeadForAction(null);
                                    }, className: "bg-purple-500 hover:bg-purple-600 text-white", children: [_jsx(Video, { className: "h-4 w-4 mr-2" }), "Schedule Demo"] })] })] }) }), _jsx(Dialog, { open: showAddCompanyDialog, onOpenChange: setShowAddCompanyDialog })] }));
}
