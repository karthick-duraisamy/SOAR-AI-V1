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
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  Globe,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Filter,
  Search,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  Activity,
  FileText,
  Handshake,
  Gift,
  Calculator,
  PieChart,
  Award,
  Zap,
  ArrowRight,
  History,
  MessageCircle,
  User
} from 'lucide-react';

interface OpportunitiesProps {
  initialFilters?: any;
  onNavigate: (screen: string, filters?: any) => void;
}

// Define opportunity interface
interface Opportunity {
  id: number;
  leadId?: number;
  name: string;
  stage: string;
  probability: number;
  value: number;
  estimated_close_date: string;
  description?: string;
  next_steps?: string;
  lead_info?: {
    company: {
      name: string;
      industry: string;
      location: string;
      employee_count?: number;
    };
    contact: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      position?: string;
    };
  };
}

const stages = [
  { id: 'proposal', label: 'Proposal', color: 'bg-orange-500', headerColor: 'bg-orange-50', probability: 65 },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-500', headerColor: 'bg-purple-50', probability: 80 },
  { id: 'closed-won', label: 'Closed Won', color: 'bg-green-500', headerColor: 'bg-green-50', probability: 100 },
  { id: 'closed-lost', label: 'Closed Lost', color: 'bg-red-500', headerColor: 'bg-red-50', probability: 0 }
];

const ItemTypes = {
  OPPORTUNITY: 'opportunity'
};

// Opportunity Card Component for Pipeline View
interface OpportunityCardProps {
  opportunity: any;
  onEdit: (opportunity: any) => void;
  onSendProposal: (opportunity: any) => void;
  onViewHistory: (opportunity: any) => void;
  onMoveToNegotiation: (opportunity: any) => void;
}

function OpportunityCard({ opportunity, onEdit, onSendProposal, onViewHistory, onMoveToNegotiation }: OpportunityCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.OPPORTUNITY,
    item: { id: opportunity.id, stage: opportunity.stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getStageColor = (stageId: string) => {
    switch (stageId) {
      case 'proposal': return 'outline';
      case 'negotiation': return 'secondary';
      case 'closed_won': return 'default';
      case 'closed_lost': return 'destructive';
      default: return 'outline';
    }
  };

  const company = opportunity.lead_info?.company || { name: 'Unknown Company' };
  const contact = opportunity.lead_info?.contact || { first_name: 'Unknown', last_name: 'Contact' };

  return (
    <div
      ref={drag}
      className={`p-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-base">{company.name}</h4>
            <p className="text-sm text-muted-foreground">{contact.first_name} {contact.last_name}</p>
          </div>
        </div>
        <Badge variant={getStageColor(opportunity.stage)} className="text-xs">
          {opportunity.probability}%
        </Badge>
      </div>

      {/* Deal Value */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-lg">${(opportunity.value / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Close: {new Date(opportunity.estimated_close_date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Next Steps */}
      {opportunity.next_steps && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-start gap-2">
            <Target className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800 line-clamp-2">
              {opportunity.next_steps}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Current User</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {new Date(opportunity.updated_at || opportunity.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 mt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(opportunity);
          }}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onViewHistory(opportunity);
          }}
        >
          <History className="h-3 w-3 mr-1" />
          History
        </Button>
        {opportunity.stage === 'proposal' && (
          <Button 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onMoveToNegotiation(opportunity);
            }}
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Negotiate
          </Button>
        )}
      </div>
    </div>
  );
}

// Pipeline Column Component
interface PipelineColumnProps {
  stage: any;
  opportunities: any[];
  onDrop: (opportunityId: string, newStage: string) => void;
  onEdit: (opportunity: any) => void;
  onSendProposal: (opportunity: any) => void;
  onViewHistory: (opportunity: any) => void;
  onMoveToNegotiation: (opportunity: any) => void;
}

function PipelineColumn({ stage, opportunities, onDrop, onEdit, onSendProposal, onViewHistory, onMoveToNegotiation }: PipelineColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.OPPORTUNITY,
    drop: (item: { id: string; stage: string }) => {
      if (item.stage !== stage.id) {
        onDrop(item.id, stage.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.dealValue, 0);

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-0 ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
    >
      <div className={`${stage.headerColor} border-b-2 ${stage.color.split(' ')[1]} p-3 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{stage.label}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {opportunities.length}
            </Badge>
            <span className="text-xs text-muted-foreground">
              ${(totalValue / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      </div>

      <div className={`${stage.color.replace('bg-', 'bg-').replace('-500', '-100')} border-2 border-t-0 rounded-b-lg min-h-[600px] p-3 space-y-3`}>
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onEdit={onEdit}
            onSendProposal={onSendProposal}
            onViewHistory={onViewHistory}
            onMoveToNegotiation={onMoveToNegotiation}
          />
        ))}

        {opportunities.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Target className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Opportunities({ initialFilters, onNavigate }: OpportunitiesProps) {
  const { getOpportunities, getOpportunityPipeline, updateOpportunityStage } = useLeadApi();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    stage: 'all',
    owner: 'all',
    industry: 'all',
    search: ''
  });

  const [editForm, setEditForm] = useState({
    stage: 'proposal',
    probability: '',
    dealValue: '',
    expectedCloseDate: '',
    nextAction: '',
    notes: ''
  });

  const [activityForm, setActivityForm] = useState({
    type: 'call',
    action: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    validityPeriod: '30',
    specialTerms: '',
    deliveryMethod: 'email'
  });

  // Fetch opportunities data on component mount
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        const data = await getOpportunities(filters);
        setOpportunities(data);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        toast.error('Failed to fetch opportunities. Please try again.');
      } finally {
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
        lead_info: {
          company: {
            name: initialFilters.newOpportunity.company || 'Unknown Company',
            industry: initialFilters.newOpportunity.industry || 'Unknown',
            location: initialFilters.newOpportunity.location || 'Unknown Location',
            employee_count: initialFilters.newOpportunity.employees || 0
          },
          contact: {
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

  const getStageInfo = (stageId: string) => {
    return stages.find(s => s.id === stageId) || stages[0];
  };

  const getStageColor = (stageId: string) => {
    const stage = getStageInfo(stageId);
    switch (stageId) {
      case 'proposal': return 'outline';
      case 'negotiation': return 'secondary';
      case 'closed-won': return 'default';
      case 'closed-lost': return 'destructive';
      default: return 'outline';
    }
  };

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setEditForm({
      stage: opportunity.stage,
      probability: opportunity.probability.toString(),
      dealValue: opportunity.dealValue.toString(),
      expectedCloseDate: opportunity.expectedCloseDate,
      nextAction: opportunity.nextAction,
      notes: opportunity.notes
    });
    setShowEditDialog(true);
  };

  const handleAddActivity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setActivityForm({
      type: 'call',
      action: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowActivityDialog(true);
  };

  const handleSaveEdit = () => {
    setOpportunities(opportunities.map(opp => 
      opp.id === selectedOpportunity.id 
        ? {
            ...opp,
            stage: editForm.stage,
            probability: parseInt(editForm.probability),
            dealValue: parseInt(editForm.dealValue),
            expectedCloseDate: editForm.expectedCloseDate,
            nextAction: editForm.nextAction,
            notes: editForm.notes,
            lastActivity: new Date().toISOString().split('T')[0]
          }
        : opp
    ));
    setShowEditDialog(false);
    setSuccessMessage(`${selectedOpportunity.company} opportunity has been updated`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSaveActivity = () => {
    setOpportunities(opportunities.map(opp => 
      opp.id === selectedOpportunity.id 
        ? {
            ...opp,
            activities: [
              ...opp.activities,
              {
                id: opp.activities.length + 1,
                type: activityForm.type,
                action: activityForm.action,
                date: activityForm.date,
                description: activityForm.description,
                user: 'Current User',
                timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                icon: activityForm.type === 'call' ? 'phone' : activityForm.type === 'email' ? 'mail' : activityForm.type === 'meeting' ? 'calendar' : activityForm.type === 'demo' ? 'presentation' : 'note'
              }
            ],
            lastActivity: new Date().toISOString().split('T')[0]
          }
        : opp
    ));
    setShowActivityDialog(false);
    setSuccessMessage(`Activity added to ${selectedOpportunity.company} opportunity`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleMoveToNegotiation = (opportunity) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunity.id 
        ? {
            ...opp,
            stage: 'negotiation',
            probability: 80,
            nextAction: 'Negotiate contract terms and finalize deal',
            lastActivity: new Date().toISOString().split('T')[0],
            activities: [
              ...opp.activities,
              {
                id: opp.activities.length + 1,
                type: 'stage_change',
                action: 'Moved to Negotiation stage',
                date: new Date().toISOString().split('T')[0],
                description: 'Opportunity advanced to negotiation stage with 80% probability',
                user: 'Current User',
                timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                icon: 'arrowright'
              }
            ]
          }
        : opp
    ));
    setSuccessMessage(`${opportunity.company} opportunity moved to Negotiation stage`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSendProposal = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setProposalForm({
      title: `Travel Solutions Proposal - ${opportunity.company}`,
      description: `Comprehensive travel management solution tailored for ${opportunity.company}'s needs including cost optimization, policy compliance, and reporting analytics.`,
      validityPeriod: '30',
      specialTerms: '',
      deliveryMethod: 'email'
    });
    setShowProposalDialog(true);
  };

  const handleSaveProposal = () => {
    setOpportunities(opportunities.map(opp => 
      opp.id === selectedOpportunity.id 
        ? {
            ...opp,
            nextAction: 'Follow up on proposal review and feedback',
            lastActivity: new Date().toISOString().split('T')[0],
            activities: [
              ...opp.activities,
              {
                id: opp.activities.length + 1,
                type: 'proposal',
                action: 'Proposal sent',
                date: new Date().toISOString().split('T')[0],
                description: `${proposalForm.title} sent via ${proposalForm.deliveryMethod}. Valid for ${proposalForm.validityPeriod} days.`,
                user: 'Current User',
                timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                icon: 'file'
              }
            ]
          }
        : opp
    ));
    setShowProposalDialog(false);
    setSuccessMessage(`Proposal sent to ${selectedOpportunity.company} successfully`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleViewHistory = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowHistoryDialog(true);
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'demo': return Eye;
      case 'proposal': return FileText;
      case 'negotiation': return Handshake;
      case 'contract': return Handshake;
      case 'note': return MessageCircle;
      case 'stage_change': return ArrowRight;
      case 'conversion': return TrendingUp;
      case 'file': return FileText;
      case 'check': return CheckCircle;
      case 'plus': return Plus;
      case 'calendar': return Calendar;
      case 'presentation': return Eye;
      case 'handshake': return Handshake;
      case 'phone': return Phone;
      case 'mail': return Mail;
      case 'user': return User;
      default: return MessageCircle;
    }
  };

  const getHistoryIconColor = (type: string) => {
    switch (type) {
      case 'call': return 'text-blue-600 bg-blue-100';
      case 'phone': return 'text-blue-600 bg-blue-100';
      case 'email': return 'text-green-600 bg-green-100';
      case 'mail': return 'text-green-600 bg-green-100';
      case 'meeting': return 'text-purple-600 bg-purple-100';
      case 'calendar': return 'text-purple-600 bg-purple-100';
      case 'demo': return 'text-orange-600 bg-orange-100';
      case 'presentation': return 'text-orange-600 bg-orange-100';
      case 'proposal': return 'text-indigo-600 bg-indigo-100';
      case 'file': return 'text-indigo-600 bg-indigo-100';
      case 'negotiation': return 'text-yellow-600 bg-yellow-100';
      case 'handshake': return 'text-yellow-600 bg-yellow-100';
      case 'contract': return 'text-green-600 bg-green-100';
      case 'note': return 'text-gray-600 bg-gray-100';
      case 'stage_change': return 'text-purple-600 bg-purple-100';
      case 'conversion': return 'text-green-600 bg-green-100';
      case 'check': return 'text-green-600 bg-green-100';
      case 'plus': return 'text-blue-600 bg-blue-100';
      case 'user': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (filters.stage && filters.stage !== 'all' && opp.stage !== filters.stage) return false;
    if (filters.owner && filters.owner !== 'all' && opp.owner !== filters.owner) return false;
    if (filters.industry && filters.industry !== 'all' && opp.industry !== filters.industry) return false;
    if (filters.search && !opp.company.toLowerCase().includes(filters.search.toLowerCase()) && 
        !opp.contact.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Calculate pipeline metrics
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.dealValue, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.dealValue * opp.probability / 100), 0);
  const avgDealSize = totalValue / opportunities.length;
  const winRate = (opportunities.filter(opp => opp.stage === 'closed-won').length / opportunities.length) * 100;

  const stageMetrics = stages.map(stage => ({
    ...stage,
    count: opportunities.filter(opp => opp.stage === stage.id).length,
    value: opportunities.filter(opp => opp.stage === stage.id).reduce((sum, opp) => sum + opp.dealValue, 0)
  }));

  // Drag and Drop Handler
  const handleDrop = useCallback(async (opportunityId: string, newStage: string) => {
    try {
      // Update via API
      await updateOpportunityStage(parseInt(opportunityId), { stage: newStage });

      // Update local state
      setOpportunities(prevOpportunities =>
        prevOpportunities.map(opportunity =>
          opportunity.id === parseInt(opportunityId)
            ? { 
                ...opportunity, 
                stage: newStage,
                updated_at: new Date().toISOString()
              }
            : opportunity
        )
      );

      const stageName = stages.find(s => s.id === newStage)?.label;
      const oppName = opportunities.find(o => o.id === parseInt(opportunityId))?.lead_info?.company?.name || 'Opportunity';
      setSuccessMessage(`${oppName} moved to ${stageName} stage`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
      toast.error('Failed to update opportunity stage. Please try again.');
    }
  }, [opportunities, stages, updateOpportunityStage]);

  const getOpportunitiesForStage = (stageId: string) => {
    return filteredOpportunities.filter(opportunity => opportunity.stage === stageId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="space-y-6 p-5">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Opportunities</h2>
          <p className="text-muted-foreground">Manage your sales pipeline and track deal progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">{opportunities.length} opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(weightedValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Probability adjusted value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(avgDealSize / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Average opportunity value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Closed won percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline by Stage</CardTitle>
          <CardDescription>Opportunities distribution across sales stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {stageMetrics.map((stage) => (
              <div key={stage.id} className="text-center">
                <div className={`w-12 h-12 rounded-full ${stage.color} text-white flex items-center justify-center mx-auto mb-2`}>
                  {stage.count}
                </div>
                <p className="font-medium text-sm">{stage.label}</p>
                <p className="text-xs text-muted-foreground">${(stage.value / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Toggle and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              className="pl-10 w-64"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <Select value={filters.stage} onValueChange={(value) => setFilters({...filters, stage: value})}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(stage => (
                <SelectItem key={stage.id} value={stage.id}>{stage.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Opportunities Views */}
      <Tabs value={currentView} onValueChange={setCurrentView}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50" style={{ maxWidth: '400px' }}>
            <TabsTrigger 
              value="list"
              className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
            >
              List View
            </TabsTrigger>
            <TabsTrigger 
              value="kanban"
              className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
            >
              Pipeline View
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Opportunities List */}
        <TabsContent value="list" className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Opportunities Found</h3>
              <p className="text-gray-600">No opportunities match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOpportunities.map((opportunity) => {
            const stageInfo = getStageInfo(opportunity.stage);
            const company = opportunity.lead_info?.company || { name: 'Unknown Company', industry: 'Unknown', location: 'Unknown' };
            const contact = opportunity.lead_info?.contact || { first_name: 'Unknown', last_name: 'Contact', email: '', phone: '', position: '' };

            return (
              <Card key={opportunity.id} className="hover:shadow-md transition-shadow" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          <Badge variant={getStageColor(opportunity.stage)}>
                            {stageInfo.label}
                          </Badge>
                        </div>
                        <p className="font-medium">{contact.first_name} {contact.last_name} • {contact.position}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          {contact.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          )}
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {company.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-lg font-bold text-green-600">
                        ${(opportunity.value / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {opportunity.probability}% probability
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Close: {new Date(opportunity.estimated_close_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Probability: {opportunity.probability}%</span>
                    <span className="text-xs text-muted-foreground">Stage: {stageInfo.label}</span>
                  </div>
                  <Progress value={opportunity.probability} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Industry:</span> {opportunity.industry}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Company Size:</span> {opportunity.employees.toLocaleString()} employees
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Owner:</span> {opportunity.owner}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Source:</span> {opportunity.source}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Created:</span> {new Date(opportunity.createdDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Last Activity:</span> {new Date(opportunity.lastActivity).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Next Action:</span> {opportunity.nextAction}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {opportunity.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Notes:</strong> {opportunity.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEditOpportunity(opportunity)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddActivity(opportunity)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Activity
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewHistory(opportunity)} className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                      <History className="h-4 w-4 mr-1" />
                      History
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {opportunity.stage !== 'closed-won' && opportunity.stage !== 'closed-lost' && (
                      <>
                        {opportunity.stage === 'proposal' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleSendProposal(opportunity)} className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                              <FileText className="h-4 w-4 mr-1" />
                              Send Proposal
                            </Button>
                            <Button size="sm" onClick={() => handleMoveToNegotiation(opportunity)}>
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Move to Negotiation
                            </Button>
                          </>
                        )}
                        {opportunity.stage === 'negotiation' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Handshake className="h-4 w-4 mr-1" />
                            Close Deal
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </TabsContent>

        {/* Pipeline View - Drag & Drop Kanban Board */}
        <TabsContent value="kanban" className="space-y-4">
          {/* Pipeline Board */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage}
                opportunities={getOpportunitiesForStage(stage.id)}
                onDrop={handleDrop}
                onEdit={handleEditOpportunity}
                onSendProposal={handleSendProposal}
                onViewHistory={handleViewHistory}
                onMoveToNegotiation={handleMoveToNegotiation}
              />
            ))}
          </div>

          {/* Pipeline Instructions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-2">Pipeline Instructions</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded" />
                      <span className="text-sm">Proposal Stage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded" />
                      <span className="text-sm">Negotiation Stage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded" />
                      <span className="text-sm">Closed Won</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded" />
                      <span className="text-sm">Closed Lost</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Drag opportunities between columns to change their stage
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Opportunity Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Opportunity - {selectedOpportunity?.company}</DialogTitle>
            <DialogDescription>
              Update opportunity details and stage information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stage</Label>
                <Select value={editForm.stage} onValueChange={(value) => setEditForm({...editForm, stage: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>{stage.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Probability (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.probability}
                  onChange={(e) => setEditForm({...editForm, probability: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Deal Value ($)</Label>
                <Input
                  type="number"
                  value={editForm.dealValue}
                  onChange={(e) => setEditForm({...editForm, dealValue: e.target.value})}
                />
              </div>
              <div>
                <Label>Expected Close Date</Label>
                <Input
                  type="date"
                  value={editForm.expectedCloseDate}
                  onChange={(e) => setEditForm({...editForm, expectedCloseDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Next Action</Label>
              <Input
                value={editForm.nextAction}
                onChange={(e) => setEditForm({...editForm, nextAction: e.target.value})}
                placeholder="Describe the next action to take..."
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                placeholder="Add opportunity notes..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity - {selectedOpportunity?.company}</DialogTitle>
            <DialogDescription>
              Record a new activity for this opportunity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Activity Type</Label>
                <Select value={activityForm.type} onValueChange={(value) => setActivityForm({...activityForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={activityForm.date}
                  onChange={(e) => setActivityForm({...activityForm, date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Activity Summary</Label>
              <Input
                value={activityForm.action}
                onChange={(e) => setActivityForm({...activityForm, action: e.target.value})}
                placeholder="Brief summary of the activity..."
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={activityForm.description}
                onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                placeholder="Detailed description of what happened..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveActivity}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Proposal Dialog */}
      <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Send Proposal - {selectedOpportunity?.company}
            </DialogTitle>
            <DialogDescription>
              Create and send a comprehensive proposal to advance this opportunity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Proposal Title *</Label>
              <Input
                value={proposalForm.title}
                onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                placeholder="Enter proposal title..."
              />
            </div>
            <div>
              <Label>Proposal Description</Label>
              <Textarea
                value={proposalForm.description}
                onChange={(e) => setProposalForm({...proposalForm, description: e.target.value})}
                placeholder="Describe the proposed solution and key benefits..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Validity Period (Days)</Label>
                <Select value={proposalForm.validityPeriod} onValueChange={(value) => setProposalForm({...proposalForm, validityPeriod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="45">45 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delivery Method</Label>
                <Select value={proposalForm.deliveryMethod} onValueChange={(value) => setProposalForm({...proposalForm, deliveryMethod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="secure_portal">Secure Portal</SelectItem>
                    <SelectItem value="in_person">In-Person Presentation</SelectItem>
                    <SelectItem value="video_call">Video Call Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Special Terms & Conditions</Label>
              <Textarea
                value={proposalForm.specialTerms}
                onChange={(e) => setProposalForm({...proposalForm, specialTerms: e.target.value})}
                placeholder="Any special terms, conditions, or customizations for this proposal..."
                rows={3}
              />
            </div>
            {selectedOpportunity && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-800 mb-2">Opportunity Summary</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Deal Value:</strong> ${(selectedOpportunity.dealValue / 1000).toFixed(0)}K</div>
                  <div><strong>Industry:</strong> {selectedOpportunity.industry}</div>
                  <div><strong>Company Size:</strong> {selectedOpportunity.employees} employees</div>
                  <div><strong>Expected Close:</strong> {new Date(selectedOpportunity.expectedCloseDate).toLocaleDateString()}</div>
                </div>
                <div className="mt-2 text-sm">
                  <strong>Travel Budget:</strong> {selectedOpportunity.travelBudget}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProposalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProposal} disabled={!proposalForm.title} className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Send Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Opportunity History - {selectedOpportunity?.company}
            </DialogTitle>
            <DialogDescription>
              Complete activity history for {selectedOpportunity?.contact} at {selectedOpportunity?.company}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            <div className="space-y-4 pr-4">
              {selectedOpportunity?.activities && selectedOpportunity.activities.length > 0 ? (
                selectedOpportunity.activities.map((item, index) => {
                  const IconComponent = getHistoryIcon(item.icon);
                  const iconColor = getHistoryIconColor(item.type);

                  return (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconColor}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.type}
                            </Badge>
                            <span className="font-medium">{item.action}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.timestamp || item.date).toLocaleDateString()} at {new Date(item.timestamp || item.date + ' 12:00:00').toLocaleTimeString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>by {item.user}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity history available for this opportunity</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowHistoryDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DndProvider>
  );
}