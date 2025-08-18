import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useLeadApi } from '../hooks/api/useLeadApi';
import { toast } from 'sonner';
import { DollarSign, Building2, Phone, Mail, Globe, CheckCircle, Plus, Edit, Search, Download, RefreshCw, Target, BarChart3, FileText, Handshake, Award, ArrowRight, History } from 'lucide-react';
const stages = [
    { id: 'discovery', label: 'Discovery', color: 'bg-blue-500', headerColor: 'bg-blue-50', probability: 25 },
    { id: 'proposal', label: 'Proposal', color: 'bg-orange-500', headerColor: 'bg-orange-50', probability: 65 },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-500', headerColor: 'bg-purple-50', probability: 80 },
    { id: 'closed_won', label: 'Closed Won', color: 'bg-green-500', headerColor: 'bg-green-50', probability: 100 },
    { id: 'closed_lost', label: 'Closed Lost', color: 'bg-red-500', headerColor: 'bg-red-50', probability: 0 }
];
const ItemTypes = {
    OPPORTUNITY: 'opportunity'
};
function OpportunityCard({ opportunity, onEdit, onAddActivity, onViewHistory, onSendProposal, onMoveToNegotiation, onCloseDeal }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.OPPORTUNITY,
        item: { id: opportunity.id, stage: opportunity.stage },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));
    const company = opportunity.lead_info?.company || { name: 'Unknown Company', industry: 'Unknown', location: 'Unknown', employee_count: 0 };
    const contact = opportunity.lead_info?.contact || { first_name: 'Unknown', last_name: 'Contact', email: '', phone: '', position: '' };
    const getBadgeColor = (stage) => {
        switch (stage) {
            case 'discovery': return 'bg-blue-100 text-blue-800';
            case 'proposal': return 'bg-orange-100 text-orange-800';
            case 'negotiation': return 'bg-purple-100 text-purple-800';
            case 'closed_won': return 'bg-green-100 text-green-800';
            case 'closed_lost': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatCurrency = (amount) => {
        // Handle null, undefined, or NaN values
        const numAmount = Number(amount);
        if (!numAmount || isNaN(numAmount)) {
            return '$0';
        }
        if (numAmount >= 1000000) {
            return `$${(numAmount / 1000000).toFixed(1)}M`;
        }
        else if (numAmount >= 1000) {
            return `$${(numAmount / 1000).toFixed(0)}K`;
        }
        else {
            return `$${numAmount.toFixed(0)}`;
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };
    return (_jsxs("div", { ref: drag, className: `bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0", children: _jsx(Building2, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h4", { className: "font-semibold text-base text-gray-900 truncate", children: company.name }), _jsx(Badge, { className: `text-xs px-2 py-1 ${getBadgeColor(opportunity.stage)}`, children: stages.find(s => s.id === opportunity.stage)?.label || opportunity.stage })] }), _jsxs("div", { className: "flex items-center gap-1 text-sm text-gray-600", children: [_jsxs("span", { children: [contact.first_name, " ", contact.last_name] }), contact.position && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsx("span", { children: contact.position })] }))] })] })] }), _jsxs("div", { className: "text-right flex-shrink-0", children: [_jsx("div", { className: "text-lg font-bold text-green-600", children: formatCurrency(opportunity.value) }), _jsxs("div", { className: "text-sm text-gray-500", children: [opportunity.probability, "% probability"] })] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "flex items-center justify-between mb-1", children: _jsxs("span", { className: "text-sm font-medium text-gray-700", children: ["Probability: ", opportunity.probability, "%"] }) }), _jsx(Progress, { value: opportunity.probability, className: "h-2" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Industry:" }), _jsx("span", { className: "ml-1 text-gray-900", children: company.industry })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Created:" }), _jsx("span", { className: "ml-1 text-gray-900", children: formatDate(opportunity.created_at) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Company Size:" }), _jsxs("span", { className: "ml-1 text-gray-900", children: [company.employee_count || 'Unknown', " employees"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Last Activity:" }), _jsx("span", { className: "ml-1 text-gray-900", children: formatDate(opportunity.updated_at) })] })] }), _jsxs("div", { className: "flex items-center gap-4 mb-3 text-sm text-gray-600", children: [contact.email && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "h-3 w-3" }), _jsx("span", { className: "truncate max-w-[120px]", children: contact.email })] })), contact.phone && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "h-3 w-3" }), _jsx("span", { children: contact.phone })] })), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Globe, { className: "h-3 w-3" }), _jsx("span", { children: company.location })] })] }), _jsxs("div", { className: "mb-3 p-2 bg-gray-50 rounded text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Next Action:" }), _jsx("span", { className: "ml-1 text-gray-900", children: opportunity.next_steps || 'Follow up on proposal review and feedback' })] }), _jsxs("div", { className: "flex flex-wrap gap-1 mb-3", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: company.industry }), _jsx(Badge, { variant: "outline", className: "text-xs", children: company.size || 'Enterprise' }), _jsx(Badge, { variant: "outline", className: "text-xs", children: "Decision Maker" })] }), _jsxs("div", { className: "flex gap-1", children: [_jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 text-xs", onClick: (e) => {
                            e.stopPropagation();
                            onEdit(opportunity);
                        }, children: [_jsx(Edit, { className: "h-3 w-3 mr-1" }), "Edit"] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 text-xs", onClick: (e) => {
                            e.stopPropagation();
                            onAddActivity(opportunity);
                        }, children: [_jsx(Plus, { className: "h-3 w-3 mr-1" }), "Add Activity"] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 text-xs", onClick: (e) => {
                            e.stopPropagation();
                            onViewHistory(opportunity);
                        }, children: [_jsx(History, { className: "h-3 w-3 mr-1" }), "History"] }), opportunity.stage === 'proposal' && onSendProposal && (_jsxs(Button, { size: "sm", className: "h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700", onClick: (e) => {
                            e.stopPropagation();
                            onSendProposal(opportunity);
                        }, children: [_jsx(FileText, { className: "h-3 w-3 mr-1" }), "Send Proposal"] })), opportunity.stage === 'proposal' && onMoveToNegotiation && (_jsxs(Button, { size: "sm", className: "h-7 px-2 text-xs bg-orange-600 hover:bg-orange-700", onClick: (e) => {
                            e.stopPropagation();
                            onMoveToNegotiation(opportunity);
                        }, children: [_jsx(ArrowRight, { className: "h-3 w-3 mr-1" }), "Move to Negotiation"] })), opportunity.stage === 'negotiation' && onCloseDeal && (_jsxs(Button, { size: "sm", className: "h-7 px-2 text-xs bg-green-600 hover:bg-green-700", onClick: (e) => {
                            e.stopPropagation();
                            onCloseDeal(opportunity);
                        }, children: [_jsx(Handshake, { className: "h-3 w-3 mr-1" }), "Close Deal"] }))] })] }));
}
function PipelineColumn({ stage, opportunities, onDrop, onEdit, onAddActivity, onViewHistory, onSendProposal, onMoveToNegotiation, onCloseDeal }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.OPPORTUNITY,
        drop: (item) => {
            if (item.stage !== stage.id) {
                onDrop(item.id, stage.id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));
    const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
    const formatCurrency = (amount) => {
        // Handle null, undefined, or NaN values
        const numAmount = Number(amount);
        if (!numAmount || isNaN(numAmount)) {
            return '$0';
        }
        if (numAmount >= 1000000) {
            return `$${(numAmount / 1000000).toFixed(1)}M`;
        }
        else if (numAmount >= 1000) {
            return `$${(numAmount / 1000).toFixed(0)}K`;
        }
        else {
            return `$${numAmount.toFixed(0)}`;
        }
    };
    return (_jsxs("div", { ref: drop, className: `flex-1 min-w-80 ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`, children: [_jsx("div", { className: `${stage.headerColor} border-b-2 border-${stage.color.split('-')[1]}-500 p-3 rounded-t-lg`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium text-sm text-gray-900", children: stage.label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: opportunities.length }), _jsx("span", { className: "text-xs text-muted-foreground font-medium", children: formatCurrency(totalValue) })] })] }) }), _jsx(ScrollArea, { className: `${stage.color.replace('bg-', 'bg-').replace('-500', '-50')} border-2 border-t-0 border-${stage.color.split('-')[1]}-200 rounded-b-lg min-h-[600px] p-3`, children: _jsxs("div", { className: "space-y-3", children: [opportunities.map((opportunity) => (_jsx(OpportunityCard, { opportunity: opportunity, onEdit: onEdit, onAddActivity: onAddActivity, onViewHistory: onViewHistory, onSendProposal: onSendProposal, onMoveToNegotiation: onMoveToNegotiation, onCloseDeal: onCloseDeal }, opportunity.id))), opportunities.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center h-32 text-muted-foreground", children: [_jsx(Target, { className: "h-8 w-8 mb-2 opacity-50" }), _jsx("p", { className: "text-sm", children: "No opportunities" })] }))] }) })] }));
}
export function Opportunities({ initialFilters, onNavigate }) {
    const { getOpportunities, updateOpportunityStage } = useLeadApi();
    const [opportunities, setOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showActivityDialog, setShowActivityDialog] = useState(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [showProposalDialog, setShowProposalDialog] = useState(false);
    const [currentView, setCurrentView] = useState('list');
    const [filters, setFilters] = useState({
        stage: 'all',
        search: ''
    });
    const [editForm, setEditForm] = useState({
        stage: '',
        probability: '',
        value: '',
        estimated_close_date: '',
        next_steps: '',
        description: ''
    });
    const [activityForm, setActivityForm] = useState({
        type: 'call',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [proposalForm, setProposalForm] = useState({
        title: '',
        description: '',
        validityPeriod: '30',
        specialTerms: '',
        deliveryMethod: 'email'
    });
    // Fetch opportunities data on component mount and when filters change
    useEffect(() => {
        const fetchOpportunities = async () => {
            setIsLoading(true);
            try {
                const data = await getOpportunities(filters);
                setOpportunities(Array.isArray(data) ? data : []);
            }
            catch (error) {
                console.error('Error fetching opportunities:', error);
                setOpportunities([]);
                toast.error('Failed to fetch opportunities. Please try again.');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchOpportunities();
    }, [getOpportunities, filters]);
    // Handle new opportunity from leads
    useEffect(() => {
        if (initialFilters?.newOpportunity) {
            const newOpportunity = {
                id: initialFilters.newOpportunity.id || Math.max(...opportunities.map(o => o.id), 0) + 1,
                leadId: initialFilters.newOpportunity.leadId || null,
                name: `${initialFilters.newOpportunity.company || 'Unknown Company'} - Corporate Travel Solution`,
                stage: initialFilters.newOpportunity.stage || 'proposal',
                probability: initialFilters.newOpportunity.probability || 65,
                value: initialFilters.newOpportunity.value || initialFilters.newOpportunity.dealValue || 250000,
                estimated_close_date: initialFilters.newOpportunity.estimated_close_date || initialFilters.newOpportunity.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: initialFilters.newOpportunity.description || initialFilters.newOpportunity.notes || 'Converted from qualified lead',
                next_steps: initialFilters.newOpportunity.next_steps || 'Send initial proposal and schedule presentation',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                lead_info: {
                    company: {
                        id: 1,
                        name: initialFilters.newOpportunity.company || 'Unknown Company',
                        industry: initialFilters.newOpportunity.industry || 'Unknown',
                        location: initialFilters.newOpportunity.location || 'Unknown Location',
                        employee_count: initialFilters.newOpportunity.employees || 0
                    },
                    contact: {
                        id: 1,
                        first_name: initialFilters.newOpportunity.contact?.split(' ')[0] || 'Unknown',
                        last_name: initialFilters.newOpportunity.contact?.split(' ').slice(1).join(' ') || 'Contact',
                        email: initialFilters.newOpportunity.email || 'unknown@email.com',
                        phone: initialFilters.newOpportunity.phone || 'N/A',
                        position: initialFilters.newOpportunity.title || 'Contact'
                    }
                }
            };
            setOpportunities(prev => [newOpportunity, ...prev]);
            setSuccessMessage(initialFilters.message || `${newOpportunity.lead_info.company.name} has been converted to an opportunity`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [initialFilters, opportunities]);
    // Calculate pipeline metrics
    const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
    const totalValue = safeOpportunities.reduce((sum, opp) => sum + (opp?.value || 0), 0);
    const weightedValue = safeOpportunities.reduce((sum, opp) => sum + ((opp?.value || 0) * (opp?.probability || 0) / 100), 0);
    const avgDealSize = safeOpportunities.length > 0 ? totalValue / safeOpportunities.length : 0;
    const winRate = safeOpportunities.length > 0 ? (safeOpportunities.filter(opp => opp?.stage === 'closed_won').length / safeOpportunities.length) * 100 : 0;
    const stageMetrics = stages.map(stage => ({
        ...stage,
        count: safeOpportunities.filter(opp => opp?.stage === stage.id).length,
        value: safeOpportunities.filter(opp => opp?.stage === stage.id).reduce((sum, opp) => sum + (opp?.value || 0), 0)
    }));
    // Filtered opportunities
    const filteredOpportunities = safeOpportunities.filter(opp => {
        if (!opp)
            return false;
        if (filters.stage && filters.stage !== 'all' && opp.stage !== filters.stage)
            return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const companyName = opp.lead_info?.company?.name?.toLowerCase() || '';
            const firstName = opp.lead_info?.contact?.first_name?.toLowerCase() || '';
            const lastName = opp.lead_info?.contact?.last_name?.toLowerCase() || '';
            if (!companyName.includes(searchLower) &&
                !firstName.includes(searchLower) &&
                !lastName.includes(searchLower)) {
                return false;
            }
        }
        return true;
    });
    // Format currency function
    const formatCurrency = (amount) => {
        // Handle null, undefined, or NaN values
        const numAmount = Number(amount);
        if (!numAmount || isNaN(numAmount)) {
            return '$0';
        }
        if (numAmount >= 1000000) {
            return `$${(numAmount / 1000000).toFixed(1)}M`;
        }
        else if (numAmount >= 1000) {
            return `$${(numAmount / 1000).toFixed(0)}K`;
        }
        else {
            return `$${numAmount.toFixed(0)}`;
        }
    };
    // Event handlers
    const handleEditOpportunity = (opportunity) => {
        setSelectedOpportunity(opportunity);
        setEditForm({
            stage: opportunity.stage,
            probability: opportunity.probability.toString(),
            value: opportunity.value.toString(),
            estimated_close_date: opportunity.estimated_close_date,
            next_steps: opportunity.next_steps || '',
            description: opportunity.description || ''
        });
        setShowEditDialog(true);
    };
    const handleAddActivity = (opportunity) => {
        setSelectedOpportunity(opportunity);
        setActivityForm({
            type: 'call',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
        setShowActivityDialog(true);
    };
    const handleViewHistory = (opportunity) => {
        setSelectedOpportunity(opportunity);
        setShowHistoryDialog(true);
    };
    const handleSendProposal = (opportunity) => {
        setSelectedOpportunity(opportunity);
        setProposalForm({
            title: `Travel Solutions Proposal - ${opportunity.lead_info?.company?.name}`,
            description: `Comprehensive travel management solution tailored for ${opportunity.lead_info?.company?.name}'s needs including cost optimization, policy compliance, and reporting analytics.`,
            validityPeriod: '30',
            specialTerms: '',
            deliveryMethod: 'email'
        });
        setShowProposalDialog(true);
    };
    const handleMoveToNegotiation = (opportunity) => {
        const updatedOpportunity = {
            ...opportunity,
            stage: 'negotiation',
            probability: 80,
            updated_at: new Date().toISOString()
        };
        setOpportunities(prev => prev.map(opp => opp.id === opportunity.id ? updatedOpportunity : opp));
        setSuccessMessage(`${opportunity.lead_info?.company?.name} opportunity moved to Negotiation stage`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };
    const handleCloseDeal = (opportunity) => {
        const updatedOpportunity = {
            ...opportunity,
            stage: 'closed_won',
            probability: 100,
            actual_close_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
        };
        setOpportunities(prev => prev.map(opp => opp.id === opportunity.id ? updatedOpportunity : opp));
        setSuccessMessage(`${opportunity.lead_info?.company?.name} deal closed successfully! 🎉`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };
    const handleSaveEdit = () => {
        if (!selectedOpportunity)
            return;
        const updatedOpportunity = {
            ...selectedOpportunity,
            stage: editForm.stage,
            probability: parseInt(editForm.probability),
            value: parseFloat(editForm.value),
            estimated_close_date: editForm.estimated_close_date,
            next_steps: editForm.next_steps,
            description: editForm.description,
            updated_at: new Date().toISOString()
        };
        setOpportunities(prev => prev.map(opp => opp.id === selectedOpportunity.id ? updatedOpportunity : opp));
        setShowEditDialog(false);
        setSuccessMessage(`${selectedOpportunity.lead_info?.company?.name} opportunity has been updated`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };
    const handleSaveActivity = () => {
        if (!selectedOpportunity)
            return;
        // In a real implementation, you would send this to the API
        setShowActivityDialog(false);
        setSuccessMessage(`Activity added to ${selectedOpportunity.lead_info?.company?.name} opportunity`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };
    const handleSaveProposal = () => {
        if (!selectedOpportunity)
            return;
        // In a real implementation, you would send this to the API
        setShowProposalDialog(false);
        setSuccessMessage(`Proposal sent to ${selectedOpportunity.lead_info?.company?.name} successfully`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };
    // Drag and Drop Handler
    const handleDrop = useCallback(async (opportunityId, newStage) => {
        if (!opportunityId || !newStage) {
            toast.error('Invalid opportunity or stage data');
            return;
        }
        try {
            // Update via API
            await updateOpportunityStage(parseInt(opportunityId), { stage: newStage });
            // Update local state
            setOpportunities(prevOpportunities => prevOpportunities.map(opportunity => opportunity.id === parseInt(opportunityId)
                ? {
                    ...opportunity,
                    stage: newStage,
                    probability: stages.find(s => s.id === newStage)?.probability || opportunity.probability,
                    updated_at: new Date().toISOString()
                }
                : opportunity));
            const stageName = stages.find(s => s.id === newStage)?.label || newStage;
            const oppName = opportunities.find(o => o.id === parseInt(opportunityId))?.lead_info?.company?.name || 'Opportunity';
            setSuccessMessage(`${oppName} moved to ${stageName} stage`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        catch (error) {
            console.error('Error updating opportunity stage:', error);
            toast.error('Failed to update opportunity stage. Please try again.');
            // Refresh opportunities to revert any optimistic updates
            try {
                const data = await getOpportunities(filters);
                setOpportunities(Array.isArray(data) ? data : []);
            }
            catch (refreshError) {
                console.error('Error refreshing opportunities:', refreshError);
            }
        }
    }, [opportunities, stages, updateOpportunityStage, getOpportunities, filters]);
    const getOpportunitiesForStage = (stageId) => {
        return filteredOpportunities.filter(opportunity => opportunity.stage === stageId);
    };
    return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsxs("div", { className: "space-y-6 p-6 bg-gray-50 min-h-screen", children: [successMessage && (_jsxs(Alert, { className: "bg-green-50 border-green-200", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), _jsx(AlertDescription, { className: "text-green-800", children: successMessage })] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Sales Opportunities" }), _jsx("p", { className: "text-gray-600", children: "Manage your sales pipeline and track deal progress" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(Download, { className: "h-4 w-4" }), "Export"] }), _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", onClick: () => window.location.reload(), children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Refresh"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs(Card, { className: "bg-white", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Total Pipeline Value" }), _jsx(DollarSign, { className: "h-4 w-4 text-gray-400" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(totalValue) }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [opportunities.length, " opportunities"] })] })] }), _jsxs(Card, { className: "bg-white", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Weighted Pipeline" }), _jsx(Target, { className: "h-4 w-4 text-gray-400" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(weightedValue) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Probability adjusted value" })] })] }), _jsxs(Card, { className: "bg-white", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Avg Deal Size" }), _jsx(BarChart3, { className: "h-4 w-4 text-gray-400" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(avgDealSize) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Average opportunity value" })] })] }), _jsxs(Card, { className: "bg-white", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Win Rate" }), _jsx(Award, { className: "h-4 w-4 text-gray-400" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [winRate.toFixed(0), "%"] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Closed won percentage" })] })] })] }), _jsxs(Card, { className: "bg-white", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-lg font-semibold text-gray-900", children: "Pipeline by Stage" }), _jsx(CardDescription, { className: "text-gray-600", children: "Opportunities distribution across sales stages" })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex justify-center gap-8", children: stageMetrics.map((stage, index) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: `w-16 h-16 rounded-full ${stage.color} text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold`, children: stage.count }), _jsx("p", { className: "font-medium text-sm text-gray-900 mb-1", children: stage.label }), _jsx("p", { className: "text-xs text-gray-500", children: formatCurrency(stage.value) })] }, stage.id))) }) })] }), _jsx("div", { className: "flex items-center justify-between bg-white p-4 rounded-lg border", children: _jsxs("div", { className: "flex gap-4 flex-1", children: [_jsxs("div", { className: "relative max-w-sm", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Search opportunities...", className: "pl-10", value: filters.search, onChange: (e) => setFilters({ ...filters, search: e.target.value }) })] }), _jsxs(Select, { value: filters.stage, onValueChange: (value) => setFilters({ ...filters, stage: value }), children: [_jsx(SelectTrigger, { className: "w-40", children: _jsx(SelectValue, { placeholder: "All Stages" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Stages" }), stages.map(stage => (_jsx(SelectItem, { value: stage.id, children: stage.label }, stage.id)))] })] })] }) }), _jsxs(Tabs, { value: currentView, onValueChange: setCurrentView, className: "w-full", children: [_jsx("div", { className: "flex items-center justify-center mb-6", children: _jsxs(TabsList, { className: "grid w-64 grid-cols-2", children: [_jsx(TabsTrigger, { value: "list", children: "List View" }), _jsx(TabsTrigger, { value: "kanban", children: "Pipeline View" })] }) }), _jsx(TabsContent, { value: "list", className: "space-y-4", children: isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 3 }).map((_, index) => (_jsx(Card, { className: "animate-pulse", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-gray-200 rounded-lg" }), _jsxs("div", { children: [_jsx("div", { className: "h-5 bg-gray-200 rounded w-40 mb-2" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-32" })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "h-6 bg-gray-200 rounded w-20 mb-2" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-16" })] })] }) }) }, index)))) : filteredOpportunities.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-12 text-center", children: [_jsx(Target, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No Opportunities Found" }), _jsx("p", { className: "text-gray-600", children: "No opportunities match your current filters." })] }) })) : (_jsx("div", { className: "space-y-4", children: filteredOpportunities.map((opportunity) => (_jsx(OpportunityCard, { opportunity: opportunity, onEdit: handleEditOpportunity, onAddActivity: handleAddActivity, onViewHistory: handleViewHistory, onSendProposal: handleSendProposal, onMoveToNegotiation: handleMoveToNegotiation, onCloseDeal: handleCloseDeal }, opportunity.id))) })) }), _jsxs(TabsContent, { value: "kanban", className: "space-y-4", children: [_jsx("div", { className: "flex gap-6 overflow-x-auto pb-4", children: stages.map((stage) => (_jsx(PipelineColumn, { stage: stage, opportunities: getOpportunitiesForStage(stage.id), onDrop: handleDrop, onEdit: handleEditOpportunity, onAddActivity: handleAddActivity, onViewHistory: handleViewHistory, onSendProposal: handleSendProposal, onMoveToNegotiation: handleMoveToNegotiation, onCloseDeal: handleCloseDeal }, stage.id))) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "Pipeline Instructions" }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-blue-500 rounded" }), _jsx("span", { children: "Discovery" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-orange-500 rounded" }), _jsx("span", { children: "Proposal" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-purple-500 rounded" }), _jsx("span", { children: "Negotiation" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded" }), _jsx("span", { children: "Closed Won" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-red-500 rounded" }), _jsx("span", { children: "Closed Lost" })] })] })] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Drag opportunities between columns to change their stage" })] }) }) })] })] }), _jsx(Dialog, { open: showEditDialog, onOpenChange: setShowEditDialog, children: _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Edit Opportunity - ", selectedOpportunity?.lead_info?.company?.name] }), _jsx(DialogDescription, { children: "Update opportunity details and stage information" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Stage" }), _jsxs(Select, { value: editForm.stage, onValueChange: (value) => setEditForm({ ...editForm, stage: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: stages.map(stage => (_jsx(SelectItem, { value: stage.id, children: stage.label }, stage.id))) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Probability (%)" }), _jsx(Input, { type: "number", min: "0", max: "100", value: editForm.probability, onChange: (e) => setEditForm({ ...editForm, probability: e.target.value }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Deal Value ($)" }), _jsx(Input, { type: "number", value: editForm.value, onChange: (e) => setEditForm({ ...editForm, value: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Expected Close Date" }), _jsx(Input, { type: "date", value: editForm.estimated_close_date, onChange: (e) => setEditForm({ ...editForm, estimated_close_date: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Next Steps" }), _jsx(Input, { value: editForm.next_steps, onChange: (e) => setEditForm({ ...editForm, next_steps: e.target.value }), placeholder: "Describe the next steps to take..." })] }), _jsxs("div", { children: [_jsx(Label, { children: "Description" }), _jsx(Textarea, { value: editForm.description, onChange: (e) => setEditForm({ ...editForm, description: e.target.value }), placeholder: "Add opportunity description...", rows: 4 })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowEditDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: handleSaveEdit, children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "Save Changes"] })] })] }) }), _jsx(Dialog, { open: showActivityDialog, onOpenChange: setShowActivityDialog, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Add Activity - ", selectedOpportunity?.lead_info?.company?.name] }), _jsx(DialogDescription, { children: "Record a new activity for this opportunity" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Activity Type" }), _jsxs(Select, { value: activityForm.type, onValueChange: (value) => setActivityForm({ ...activityForm, type: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "call", children: "Phone Call" }), _jsx(SelectItem, { value: "email", children: "Email" }), _jsx(SelectItem, { value: "meeting", children: "Meeting" }), _jsx(SelectItem, { value: "demo", children: "Demo" }), _jsx(SelectItem, { value: "proposal", children: "Proposal" }), _jsx(SelectItem, { value: "negotiation", children: "Negotiation" }), _jsx(SelectItem, { value: "other", children: "Other" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Date" }), _jsx(Input, { type: "date", value: activityForm.date, onChange: (e) => setActivityForm({ ...activityForm, date: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Description" }), _jsx(Textarea, { value: activityForm.description, onChange: (e) => setActivityForm({ ...activityForm, description: e.target.value }), placeholder: "Detailed description of what happened...", rows: 4 })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowActivityDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: handleSaveActivity, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Activity"] })] })] }) }), _jsx(Dialog, { open: showProposalDialog, onOpenChange: setShowProposalDialog, children: _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5" }), "Send Proposal - ", selectedOpportunity?.lead_info?.company?.name] }), _jsx(DialogDescription, { children: "Create and send a comprehensive proposal to advance this opportunity" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Proposal Title *" }), _jsx(Input, { value: proposalForm.title, onChange: (e) => setProposalForm({ ...proposalForm, title: e.target.value }), placeholder: "Enter proposal title..." })] }), _jsxs("div", { children: [_jsx(Label, { children: "Proposal Description" }), _jsx(Textarea, { value: proposalForm.description, onChange: (e) => setProposalForm({ ...proposalForm, description: e.target.value }), placeholder: "Describe the proposed solution and key benefits...", rows: 4 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Validity Period (Days)" }), _jsxs(Select, { value: proposalForm.validityPeriod, onValueChange: (value) => setProposalForm({ ...proposalForm, validityPeriod: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "15", children: "15 days" }), _jsx(SelectItem, { value: "30", children: "30 days" }), _jsx(SelectItem, { value: "45", children: "45 days" }), _jsx(SelectItem, { value: "60", children: "60 days" }), _jsx(SelectItem, { value: "90", children: "90 days" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Delivery Method" }), _jsxs(Select, { value: proposalForm.deliveryMethod, onValueChange: (value) => setProposalForm({ ...proposalForm, deliveryMethod: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "email", children: "Email" }), _jsx(SelectItem, { value: "secure_portal", children: "Secure Portal" }), _jsx(SelectItem, { value: "in_person", children: "In-Person Presentation" }), _jsx(SelectItem, { value: "video_call", children: "Video Call Presentation" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Special Terms & Conditions" }), _jsx(Textarea, { value: proposalForm.specialTerms, onChange: (e) => setProposalForm({ ...proposalForm, specialTerms: e.target.value }), placeholder: "Any special terms, conditions, or customizations for this proposal...", rows: 3 })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowProposalDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: handleSaveProposal, disabled: !proposalForm.title, className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(FileText, { className: "h-4 w-4 mr-2" }), "Send Proposal"] })] })] }) }), _jsx(Dialog, { open: showHistoryDialog, onOpenChange: setShowHistoryDialog, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(History, { className: "h-5 w-5" }), "Opportunity History - ", selectedOpportunity?.lead_info?.company?.name] }), _jsx(DialogDescription, { children: "Complete activity history for this opportunity" })] }), _jsx(ScrollArea, { className: "h-[60vh] w-full", children: _jsx("div", { className: "space-y-4 pr-4", children: _jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx(History, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No activity history available for this opportunity" })] }) }) }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: () => setShowHistoryDialog(false), children: "Close" }) })] }) })] }) }));
}
