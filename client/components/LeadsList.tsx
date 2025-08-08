import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { OfferCreation } from './OfferCreation';
import { MarketingCampaign } from './MarketingCampaign';
import { useLeadApi } from '../hooks/api/useLeadApi';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  MessageSquare,
  Star,
  ArrowRight,
  Building2,
  DollarSign,
  Clock,
  Globe,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Plus,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Target,
  Zap,
  FileText,
  Handshake,
  PenTool,
  Calculator,
  BarChart3,
  Gift,
  MapPin,
  Briefcase,
  User,
  Activity,
  Bell,
  Settings,
  Info,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Megaphone,
  PhoneCall,
  CalendarDays,
  Presentation,
  Video,
  History,
  UserIcon,
  MessageCircle,
  PhoneCallIcon,
  CalendarIcon,
  GiftIcon,
  ExternalLink,
  ChevronDown,
  Archive,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { toast } from "sonner";

interface LeadsListProps {
  initialFilters?: any;
  onNavigate: (screen: string, filters?: any) => void;
}

// Transform API lead data to match the component's expected format
const transformApiLeadToUILead = (apiLead: any) => {
  return {
    id: apiLead.id,
    company: apiLead.company?.name || 'Unknown Company',
    contact: `${apiLead.contact?.first_name || ''} ${apiLead.contact?.last_name || ''}`.trim() || 'Unknown Contact',
    title: apiLead.contact?.position || 'Unknown Position',
    email: apiLead.contact?.email || 'unknown@email.com',
    phone: apiLead.contact?.phone || 'N/A',
    website: `https://www.${(apiLead.company?.name || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
    industry: apiLead.company?.industry || 'Unknown',
    employees: apiLead.company?.size || 0,
    revenue: `$${Math.floor(Math.random() * 1000)}M`, // Placeholder since not in API
    location: apiLead.company?.location || 'Unknown Location',
    status: apiLead.status || 'new',
    score: apiLead.score || 50,
    source: apiLead.source || 'Unknown',
    lastContact: apiLead.created_at ? new Date(apiLead.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    nextAction: apiLead.next_action || 'Follow up',
    notes: apiLead.notes || '',
    engagement: apiLead.score >= 80 ? 'High' : apiLead.score >= 60 ? 'Medium' : 'Low',
    travelBudget: apiLead.estimated_value ? `$${Math.floor(apiLead.estimated_value / 1000)}K` : '$0K',
    decisionMaker: Math.random() > 0.5, // Placeholder logic
    urgency: apiLead.priority || 'Medium',
    aiSuggestion: `AI Score: ${apiLead.score}. ${apiLead.score >= 80 ? 'High priority lead - contact immediately' : apiLead.score >= 60 ? 'Medium priority - follow up within 2 days' : 'Low priority - add to nurture campaign'}`,
    tags: [apiLead.company?.industry || 'General', apiLead.status || 'New'],
    contractReady: apiLead.status === 'qualified',
    lastActivity: apiLead.updated_at ? new Date(apiLead.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    followUpDate: apiLead.next_action_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedAgent: apiLead.assigned_to?.username || null,
    history: [
      {
        id: 1,
        type: 'note',
        action: 'Lead created',
        user: 'System',
        timestamp: apiLead.created_at || new Date().toISOString(),
        details: apiLead.notes || 'Lead created in the system',
        icon: 'plus'
      }
    ]
  };
};

export function LeadsList({ initialFilters, onNavigate }: LeadsListProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const leadApi = useLeadApi();
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showOfferCreation, setShowOfferCreation] = useState(false);
  const [showCampaignCreation, setShowCampaignCreation] = useState(false);
  const [campaignLeads, setCampaignLeads] = useState([]);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    status: initialFilters?.status || '',
    industry: '',
    score: '',
    engagement: '',
    search: ''
  });
  const [contactForm, setContactForm] = useState({
    type: 'email',
    subject: '',
    message: '',
    followUpDate: ''
  });
  const [noteForm, setNoteForm] = useState({
    note: '',
    nextAction: '',
    urgency: 'Medium'
  });
  const [newLeadForm, setNewLeadForm] = useState({
    company: '',
    contact: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    employees: '',
    revenue: '',
    location: '',
    source: '',
    status: 'new',
    travelBudget: '',
    decisionMaker: false,
    notes: '',
    tags: []
  });

  const [callForm, setCallForm] = useState({
    type: 'discovery',
    scheduledTime: '',
    duration: '30',
    agenda: '',
    notes: ''
  });

  const [meetingForm, setMeetingForm] = useState({
    type: 'business_meeting',
    title: '',
    scheduledTime: '',
    duration: '60',
    location: 'virtual',
    attendees: '',
    agenda: '',
    objectives: ''
  });

  const [demoForm, setDemoForm] = useState({
    type: 'product_demo',
    title: '',
    scheduledTime: '',
    duration: '45',
    demoFormat: 'virtual',
    attendees: '',
    focus_areas: '',
    preparation_notes: ''
  });

  const [assignForm, setAssignForm] = useState({
    agent: '',
    notes: '',
    priority: 'medium'
  });

  // Disqualify modal state
  const [showDisqualifyDialog, setShowDisqualifyDialog] = useState(false);
  const [disqualifyForm, setDisqualifyForm] = useState({
    reason: ''
  });

  // Available sales agents
  const salesAgents = [
    { id: 'agent1', name: 'John Smith', email: 'john.smith@soarai.com', specialties: ['Enterprise', 'Technology'], currentLeads: 12 },
    { id: 'agent2', name: 'Sarah Wilson', email: 'sarah.wilson@soarai.com', specialties: ['Manufacturing', 'Healthcare'], currentLeads: 8 },
    { id: 'agent3', name: 'Mike Johnson', email: 'mike.johnson@soarai.com', specialties: ['Financial Services', 'Banking'], currentLeads: 15 },
    { id: 'agent4', name: 'Alice Brown', email: 'alice.brown@soarai.com', specialties: ['Retail', 'Consulting'], currentLeads: 10 },
    { id: 'agent5', name: 'David Kim', email: 'david.kim@soarai.com', specialties: ['Startups', 'SMB'], currentLeads: 6 },
    { id: 'agent6', name: 'Jennifer Lee', email: 'jennifer.lee@soarai.com', specialties: ['Government', 'Non-profit'], currentLeads: 7 },
    { id: 'agent7', name: 'Tom Wilson', email: 'tom.wilson@soarai.com', specialties: ['Travel', 'Hospitality'], currentLeads: 9 },
    { id: 'agent8', name: 'Rachel Green', email: 'rachel.green@soarai.com', specialties: ['Insurance', 'Real Estate'], currentLeads: 11 }
  ];

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const apiLeads = await leadApi.getLeads();
      const transformedLeads = apiLeads.map(transformApiLeadToUILead);
      setLeads(transformedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  // Apply initial filters when component mounts or initialFilters change
  useEffect(() => {
    // Fetch leads on component mount
    fetchLeads();

    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }));

      // Handle new lead data from corporate search
      if (initialFilters.newLead) {
        const newLead = {
          id: Math.max(...leads.map(l => l.id)) + 1,
          company: initialFilters.newLead.company,
          contact: initialFilters.newLead.contact || 'Contact Name',
          title: initialFilters.newLead.title || 'Decision Maker',
          email: initialFilters.newLead.email,
          phone: initialFilters.newLead.phone,
          website: initialFilters.newLead.website || `https://www.${initialFilters.newLead.company.toLowerCase().replace(/\s+/g, '')}.com`,
          industry: initialFilters.newLead.industry,
          employees: initialFilters.newLead.employees,
          revenue: initialFilters.newLead.revenue,
          location: initialFilters.newLead.location,
          status: 'new',
          score: initialFilters.newLead.aiScore || 75,
          source: initialFilters.newLead.source || 'Corporate Search',
          lastContact: new Date().toISOString().split('T')[0],
          nextAction: 'Initial contact and qualification',
          notes: initialFilters.newLead.notes,
          engagement: 'Low',
          travelBudget: initialFilters.newLead.travelBudget,
          decisionMaker: initialFilters.newLead.decisionMaker || true,
          urgency: 'Medium',
          aiSuggestion: `High-potential lead from corporate search. AI Score: ${initialFilters.newLead.aiScore || 75}. Recommend immediate outreach and qualification.`,
          tags: initialFilters.newLead.tags || ['Corporate Search', 'New Lead'],
          contractReady: false,
          lastActivity: new Date().toISOString().split('T')[0],
          followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          history: [
            {
              id: 1,
              type: 'note',
              action: 'Lead created from corporate search',
              user: 'System',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: initialFilters.newLead.notes,
              icon: 'plus'
            }
          ]
        };

        setLeads(prev => [newLead, ...prev]);
        setSuccessMessage(initialFilters.message || `${initialFilters.newLead.company} has been successfully added as a lead`);

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    }
  }, [initialFilters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'default';
      case 'contacted': return 'secondary';
      case 'in-progress': return 'secondary';
      case 'responded': return 'outline';
      case 'unqualified': return 'destructive';
      case 'new': return 'outline';
      default: return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'Very High': return 'text-green-500 bg-green-50';
      case 'High': return 'text-green-500 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'call': return PhoneCallIcon;
      case 'email': return Mail;
      case 'meeting': return CalendarIcon;
      case 'demo': return Presentation;
      case 'note': return MessageCircle;
      case 'file': return FileText;
      case 'check': return CheckCircle;
      case 'plus': return Plus;
      case 'archive': return Archive;
      case 'presentation': return Presentation;
      case 'user': return User;
      default: return MessageCircle;
    }
  };

  const getHistoryIconColor = (type: string) => {
    switch (type) {
      case 'call': return 'text-blue-600 bg-blue-100';
      case 'email': return 'text-green-500 bg-green-100';
      case 'meeting': return 'text-purple-600 bg-purple-100';
      case 'demo': return 'text-orange-600 bg-orange-100';
      case 'note': return 'text-gray-600 bg-gray-100';
      case 'file': return 'text-indigo-600 bg-indigo-100';
      case 'check': return 'text-green-500 bg-green-100';
      case 'plus': return 'text-blue-600 bg-blue-100';
      case 'archive': return 'text-yellow-600 bg-yellow-100';
      case 'presentation': return 'text-purple-600 bg-purple-100';
      case 'user': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNextActionSuggestions = (status: string, lastContact: string) => {
    const daysSinceContact = Math.floor((new Date().getTime() - new Date(lastContact).getTime()) / (1000 * 60 * 60 * 24));

    switch (status) {
      case 'contacted':
        if (daysSinceContact >= 3) {
          return {
            urgent: true,
            action: 'Follow-up required',
            description: `${daysSinceContact} days since last contact. Send follow-up email or schedule call.`,
            suggestions: ['Send follow-up email', 'Schedule phone call', 'Send LinkedIn message']
          };
        }
        return {
          urgent: false,
          action: 'Monitor response',
          description: 'Recently contacted. Wait for response or follow up in 1-2 days.',
          suggestions: ['Schedule follow-up reminder', 'Prepare additional materials']
        };
      case 'qualified':
        return {
          urgent: true,
          action: 'Move to contract',
          description: 'Lead is qualified and ready for contract negotiation.',
          suggestions: ['Initiate contract', 'Schedule demo', 'Send proposal']
        };
      case 'responded':
        return {
          urgent: true,
          action: 'Continue engagement',
          description: 'Lead has responded. Continue the conversation.',
          suggestions: ['Schedule meeting', 'Send detailed proposal', 'Qualify lead']
        };
      case 'unqualified':
        return {
          urgent: false,
          action: 'Nurture or archive',
          description: 'Lead doesn\'t meet current criteria. Consider nurture campaign.',
          suggestions: ['Add to nurture campaign', 'Schedule future follow-up', 'Archive lead']
        };
      default:
        return {
          urgent: false,
          action: 'Initial contact',
          description: 'New lead requires initial outreach.',
          suggestions: ['Send introduction email', 'Make initial call', 'Connect on LinkedIn']
        };
    }
  };

  const handleContact = (lead) => {
    setSelectedLead(lead);
    setContactForm({
      type: 'email',
      subject: `Partnership Opportunity - ${lead.company}`,
      message: `Hi ${lead.contact},\n\nI hope this message finds you well. I wanted to follow up regarding our corporate travel solutions that could benefit ${lead.company}.\n\nBased on your organization's profile, I believe we can help optimize your travel operations and reduce costs.\n\nWould you be available for a brief call this week to discuss how we can support your travel needs?\n\nBest regards,\nSOAR-AI Team`,
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowContactDialog(true);
  };

  const handleAddNote = (lead) => {
    setSelectedLead(lead);
    setNoteForm({
      note: '',
      nextAction: lead.nextAction,
      urgency: lead.urgency
    });
    setShowNoteDialog(true);
  };

  // Handle disqualify button click - opens modal
  const handleDisqualify = (lead) => {
    setSelectedLead(lead);
    setDisqualifyForm({
      reason: ''
    });
    setShowDisqualifyDialog(true);
  };

  // Handle disqualify form submission
  const handleDisqualifySubmit = () => {
    if (selectedLead) {
      // Remove the lead from the list
      setLeads(prev => prev.filter(lead => lead.id !== selectedLead.id));

      // Show toast notification
      toast.success(`You have successfully disqualified ${selectedLead.company}.`);

      // Close modal and reset form
      setShowDisqualifyDialog(false);
      setDisqualifyForm({ reason: '' });
      setSelectedLead(null);
    }
  };

  // Handle disqualify skip
  const handleDisqualifySkip = () => {
    if (selectedLead) {
      // Remove the lead from the list (same as submit)
      setLeads(prev => prev.filter(lead => lead.id !== selectedLead.id));

      // Show toast notification
      toast.success(`You have successfully disqualified ${selectedLead.company}.`);

      // Close modal and reset form
      setShowDisqualifyDialog(false);
      setDisqualifyForm({ reason: '' });
      setSelectedLead(null);
    }
  };

  const handleWorkflowActions = (lead) => {
    setSelectedLead(lead);
    setShowWorkflowDialog(true);
  };

  const handleCreateOffer = (lead) => {
    // Convert lead data to corporate data format expected by OfferCreation
    const corporateData = {
      id: lead.id,
      name: lead.company,
      type: `${lead.industry} Company`,
      industry: lead.industry,
      location: lead.location,
      aiScore: lead.score,
      rating: 4.5, // Default rating
      established: new Date().getFullYear() - 10, // Estimate
      employees: lead.employees,
      specialties: lead.tags || ['Corporate Client'],
      travelBudget: lead.travelBudget.replace('$', '').replace('K', '').replace('M', ''),
      annualTravelVolume: '1,000+ trips',
      contracts: 0,
      revenue: parseInt(lead.revenue.replace(/[^0-9]/g, '')) || 50000000,
      phone: lead.phone,
      email: lead.email,
      website: `www.${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
      aiRecommendation: lead.aiSuggestion,
      compliance: 90,
      financialStability: lead.score,
      travelFrequency: 'Weekly',
      destinations: ['North America', 'Global'],
      preferredClass: 'Business',
      teamSize: Math.floor(lead.employees / 10),
      travelManagers: 1,
      currentAirlines: ['Various'],
      paymentTerms: 'Net 30',
      creditRating: 'AA',
      sustainabilityFocus: 'Medium',
      technologyIntegration: ['API', 'Mobile App'],
      seasonality: 'Year-round',
      meetingTypes: ['Business Travel', 'Client Visits'],
      companySize: lead.employees > 1000 ? 'Enterprise' : 'Mid-Market',
      marketSegment: lead.industry,
      decisionMakers: lead.decisionMaker ? 2 : 1,
      contractValue: parseInt(lead.travelBudget.replace(/[^0-9]/g, '')) * 1000 || 500000,
      competitorAirlines: 2,
      loyaltyPotential: lead.score,
      expansionPlans: 'Moderate',
      riskLevel: 'Low'
    };

    setSelectedLead(corporateData);
    setShowOfferCreation(true);
  };

  const handleCreateCampaign = (lead) => {
    // Set the selected lead(s) for campaign creation
    setCampaignLeads([lead]);
    setShowCampaignCreation(true);
  };

  const handleBackFromOffer = () => {
    setShowOfferCreation(false);
    setSelectedLead(null);
  };

  const handleBackFromCampaign = () => {
    setShowCampaignCreation(false);
    setCampaignLeads([]);
  };

  const handleInitiateCall = (lead) => {
    setSelectedLead(lead);
    setCallForm({
      type: 'discovery',
      scheduledTime: '',
      duration: '30',
      agenda: `Discovery call with ${lead.contact} from ${lead.company} to discuss corporate travel needs and potential partnership opportunities.`,
      notes: ''
    });
    setShowCallDialog(true);
  };

  const handleScheduleMeeting = (lead) => {
    setSelectedLead(lead);
    setMeetingForm({
      type: 'business_meeting',
      title: `Business Meeting - ${lead.company}`,
      scheduledTime: '',
      duration: '60',
      location: 'virtual',
      attendees: `${lead.contact} (${lead.title})`,
      agenda: 'Travel program requirements, solution presentation, pricing discussion, next steps',
      objectives: 'Understand travel needs, present SOAR-AI solutions, identify decision makers, establish timeline'
    });
    setShowMeetingDialog(true);
  };

  const handleScheduleDemo = (lead) => {
    setSelectedLead(lead);
    setDemoForm({
      type: 'product_demo',
      title: `SOAR-AI Product Demo - ${lead.company}`,
      scheduledTime: '',
      duration: '45',
      demoFormat: 'virtual',
      attendees: `${lead.contact} (${lead.title})`,
      focus_areas: 'Corporate travel booking platform, expense management, travel analytics, policy compliance',
      preparation_notes: `Prepare demo tailored for ${lead.industry} industry. Highlight cost savings and efficiency improvements.`
    });
    setShowDemoDialog(true);
  };

  const handleViewHistory = (lead) => {
    setSelectedLead(lead);
    setShowHistoryDialog(true);
  };

  const handleMoveToOpportunity = (lead) => {
    // Convert lead to opportunity and navigate to opportunities screen
    const opportunityData = {
      leadId: lead.id,
      company: lead.company,
      contact: lead.contact,
      title: lead.title,
      email: lead.email,
      phone: lead.phone,
      industry: lead.industry,
      employees: lead.employees,
      revenue: lead.revenue,
      location: lead.location,
      score: lead.score,
      source: lead.source,
      travelBudget: lead.travelBudget,
      decisionMaker: lead.decisionMaker,
      tags: lead.tags,
      notes: lead.notes,
      stage: 'discovery',
      probability: 75,
      dealValue: parseInt(lead.travelBudget.replace(/[^0-9]/g, '')) * 1000 || 500000,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    // Update lead status to 'converted'
    setLeads(leads.map(l => 
      l.id === lead.id 
        ? { 
            ...l, 
            status: 'converted',
            lastActivity: new Date().toISOString().split('T')[0],
            history: [...l.history, {
              id: l.history.length + 1,
              type: 'note',
              action: 'Converted to opportunity',
              user: 'Current User',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: `Lead converted to opportunity with deal value: ${opportunityData.dealValue.toLocaleString()}`,
              icon: 'check'
            }]
          }
        : l
    ));

    setSuccessMessage(`${lead.company} has been successfully converted to an opportunity`);
    setTimeout(() => setSuccessMessage(''), 5000);

    // Navigate to opportunities with the new opportunity data
    onNavigate('opportunities', { 
      newOpportunity: opportunityData,
      message: `${lead.company} has been successfully converted to an opportunity`
    });
  };

  const handleAssignAgent = (lead) => {
    setSelectedLead(lead);
    setAssignForm({
      agent: lead.assignedAgent || '',
      notes: '',
      priority: 'medium'
    });
    setShowAssignDialog(true);
  };

  const handleSaveAssignment = () => {
    if (!assignForm.agent) {
      return;
    }

    const selectedAgent = salesAgents.find(agent => agent.id === assignForm.agent);

    // Handle multiple leads or single lead
    if (selectedLead.isMultiple) {
      // Bulk assignment
      setLeads(leads.map(lead => 
        selectedLead.selectedIds.includes(lead.id)
          ? {
              ...lead,
              assignedAgent: assignForm.agent,
              lastActivity: new Date().toISOString().split('T')[0],
              history: [
                ...lead.history,
                {
                  id: lead.history.length + 1,
                  type: 'note',
                  action: `Assigned to ${selectedAgent.name}`,
                  user: 'System',
                  timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                  details: `Lead assigned to sales agent ${selectedAgent.name} via bulk assignment. Priority: ${assignForm.priority}. ${assignForm.notes ? 'Notes: ' + assignForm.notes : ''}`,
                  icon: 'user'
                }
              ]
            }
          : lead
      ));

      setSuccessMessage(`${selectedLead.selectedCount} leads have been assigned to ${selectedAgent.name}`);
      clearSelection();
    } else {
      // Single lead assignment
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id 
          ? {
              ...lead,
              assignedAgent: assignForm.agent,
              lastActivity: new Date().toISOString().split('T')[0],
              history: [
                ...lead.history,
                {
                  id: lead.history.length + 1,
                  type: 'note',
                  action: `Assigned to ${selectedAgent.name}`,
                  user: 'System',
                  timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                  details: `Lead assigned to sales agent ${selectedAgent.name}. Priority: ${assignForm.priority}. ${assignForm.notes ? 'Notes: ' + assignForm.notes : ''}`,
                  icon: 'user'
                }
              ]
            }
          : lead
      ));

      setSuccessMessage(`${selectedLead.company} has been assigned to ${selectedAgent.name}`);
    }

    setTimeout(() => setSuccessMessage(''), 5000);
    setShowAssignDialog(false);
  };

  const getAssignedAgent = (agentId) => {
    return salesAgents.find(agent => agent.id === agentId);
  };

  // Multi-select handlers
  const handleSelectLead = (leadId, isChecked) => {
    if (isChecked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
      setSelectAll(true);
    } else {
      setSelectedLeads([]);
      setSelectAll(false);
    }
  };

  const handleBulkCampaign = () => {
    const selectedLeadsData = leads.filter(lead => selectedLeads.includes(lead.id));
    setCampaignLeads(selectedLeadsData);
    setShowCampaignCreation(true);
  };

  const handleBulkAssign = () => {
    const selectedLeadsData = leads.filter(lead => selectedLeads.includes(lead.id));
    // For bulk assign, we'll use the first selected lead for the dialog
    if (selectedLeadsData.length > 0) {
      setSelectedLead({
        ...selectedLeadsData[0],
        isMultiple: true,
        selectedIds: selectedLeads,
        selectedCount: selectedLeads.length
      });
      setAssignForm({
        agent: '',
        notes: '',
        priority: 'medium'
      });
      setShowAssignDialog(true);
    }
  };

  const clearSelection = () => {
    setSelectedLeads([]);
    setSelectAll(false);
  };

  // Update the filteredLeads to also update selection state
  const filteredLeads = leads.filter(lead => {
    if (filters.status && lead.status !== filters.status) return false;
    if (filters.industry && lead.industry !== filters.industry) return false;
    if (filters.score && (
      (filters.score === 'high' && lead.score < 80) ||
      (filters.score === 'medium' && (lead.score < 60 || lead.score >= 80)) ||
      (filters.score === 'low' && lead.score >= 60)
    )) return false;
    if (filters.engagement && lead.engagement !== filters.engagement) return false;
    if (filters.search && !lead.company.toLowerCase().includes(filters.search.toLowerCase()) && 
        !lead.contact.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Update select all state when filtered leads change
  useEffect(() => {
    if (selectedLeads.length === 0) {
      setSelectAll(false);
    } else if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedLeads, filteredLeads]);

  const handleSaveCall = () => {
    console.log('Scheduling call:', { lead: selectedLead, call: callForm });
    setShowCallDialog(false);

    // Update lead status and notes
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id 
        ? { 
            ...lead, 
            lastActivity: new Date().toISOString().split('T')[0],
            nextAction: `Call scheduled for ${callForm.scheduledTime}`,
            notes: lead.notes + `\n\nCall scheduled: ${callForm.scheduledTime} - ${callForm.agenda}`,
            followUpDate: callForm.scheduledTime,
            history: [...lead.history, {
              id: lead.history.length + 1,
              type: 'call',
              action: `${callForm.type} call scheduled`,
              user: 'Current User',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: `Scheduled ${callForm.duration}-minute ${callForm.type} call for ${callForm.scheduledTime}. ${callForm.agenda}`,
              icon: 'phone'
            }]
          }
        : lead
    ));

    setSuccessMessage(`Call scheduled with ${selectedLead.company} for ${callForm.scheduledTime}`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSaveMeeting = () => {
    console.log('Scheduling meeting:', { lead: selectedLead, meeting: meetingForm });
    setShowMeetingDialog(false);

    // Update lead status and notes
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id 
        ? { 
            ...lead, 
            lastActivity: new Date().toISOString().split('T')[0],
            nextAction: `Meeting scheduled for ${meetingForm.scheduledTime}`,
            notes: lead.notes + `\n\nMeeting scheduled: ${meetingForm.title} at ${meetingForm.scheduledTime}`,
            followUpDate: meetingForm.scheduledTime,
            history: [...lead.history, {
              id: lead.history.length + 1,
              type: 'meeting',
              action: `${meetingForm.type} scheduled`,
              user: 'Current User',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: `Scheduled ${meetingForm.duration}-minute ${meetingForm.type} for ${meetingForm.scheduledTime}. ${meetingForm.objectives}`,
              icon: 'calendar'
            }]
          }
        : lead
    ));

    setSuccessMessage(`Meeting scheduled with ${selectedLead.company} for ${meetingForm.scheduledTime}`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSaveDemo = () => {
    console.log('Scheduling demo:', { lead: selectedLead, demo: demoForm });
    setShowDemoDialog(false);

    // Update lead status and notes
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id 
        ? { 
            ...lead, 
            lastActivity: new Date().toISOString().split('T')[0],
            nextAction: `Demo scheduled for ${demoForm.scheduledTime}`,
            notes: lead.notes + `\n\nProduct demo scheduled: ${demoForm.title} at ${demoForm.scheduledTime}`,
            followUpDate: demoForm.scheduledTime,
            history: [...lead.history, {
              id: lead.history.length + 1,
              type: 'demo',
              action: `${demoForm.type} scheduled`,
              user: 'Current User',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: `Scheduled ${demoForm.duration}-minute ${demoForm.type} for ${demoForm.scheduledTime}. Focus: ${demoForm.focus_areas}`,
              icon: 'presentation'
            }]
          }
        : lead
    ));

    setSuccessMessage(`Product demo scheduled with ${selectedLead.company} for ${demoForm.scheduledTime}`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (leadApi.error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 mb-4">Error: {leadApi.error}</p>
        <Button onClick={fetchLeads}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // If we're showing offer creation, render that component instead
  if (showOfferCreation && selectedLead) {
    return (
      <OfferCreation 
        corporateData={selectedLead}
        onNavigate={onNavigate}
        onBack={handleBackFromOffer}
      />
    );
  }

  // If we're showing campaign creation, render that component instead
  if (showCampaignCreation && campaignLeads.length > 0) {
    return (
      <MarketingCampaign 
        targetLeads={campaignLeads}
        onNavigate={onNavigate}
        onBack={handleBackFromCampaign}
      />
    );
  }

  const handleCreateNewLead = async () => {
    try {
      // Prepare API data structure
      const leadData = {
        company: {
          name: newLeadForm.company,
          industry: newLeadForm.industry,
          location: newLeadForm.location,
          size: parseInt(newLeadForm.employees) || 0
        },
        contact: {
          first_name: newLeadForm.contact.split(' ')[0] || newLeadForm.contact,
          last_name: newLeadForm.contact.split(' ').slice(1).join(' ') || '',
          email: newLeadForm.email,
          phone: newLeadForm.phone,
          position: newLeadForm.title
        },
        status: newLeadForm.status,
        source: newLeadForm.source,
        priority: 'medium',
        score: 50,
        estimated_value: newLeadForm.travelBudget ? parseInt(newLeadForm.travelBudget.replace(/[^0-9]/g, '')) * 1000 : null,
        notes: newLeadForm.notes,
        next_action: 'Initial contact'
      };

      const createdLead = await leadApi.createLead(leadData);
      
      // Refresh the leads list to include the new lead
      await fetchLeads();
      
      setShowNewLeadDialog(false);
      setSuccessMessage(`New lead "${newLeadForm.company}" has been created successfully with status: ${newLeadForm.status}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Reset form
      setNewLeadForm({
        company: '',
        contact: '',
        title: '',
        email: '',
        phone: '',
        industry: '',
        employees: '',
        revenue: '',
        location: '',
        source: '',
        status: 'new',
        travelBudget: '',
        decisionMaker: false,
        notes: '',
        tags: []
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead. Please try again.');
    }
  };

  const handleSendContact = () => {
    console.log('Sending contact:', { lead: selectedLead, contact: contactForm });
    setShowContactDialog(false);
    // Update lead status
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id 
        ? { 
            ...lead, 
            lastContact: new Date().toISOString().split('T')[0], 
            status: 'contacted',
            lastActivity: new Date().toISOString().split('T')[0],
            followUpDate: contactForm.followUpDate,
            history: [...lead.history, {
              id: lead.history.length + 1,
              type: 'email',
              action: `${contactForm.type} sent`,
              user: 'Current User',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: `Sent ${contactForm.type} with subject: "${contactForm.subject}". Follow-up scheduled for ${contactForm.followUpDate}`,
              icon: 'mail'
            }]
          }
        : lead
    ));
  };

  const handleSaveNote = () => {
    console.log('Saving note:', { lead: selectedLead, note: noteForm });
    setShowNoteDialog(false);
    // Update lead notes
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id 
        ? { 
            ...lead, 
            notes: noteForm.note, 
            nextAction: noteForm.nextAction, 
            urgency: noteForm.urgency,
            lastActivity: new Date().toISOString().split('T')[0],
            history: [...lead.history, {
              id: lead.history.length + 1,
              type: 'note',
              action: 'Note added',
              user: 'Current User',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: noteForm.note,
              icon: 'note'
            }]
          }
        : lead
    ));
  };

  const handleQualify = (leadId: number, qualified: boolean) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            status: qualified ? 'qualified' : 'unqualified',
            lastActivity: new Date().toISOString().split('T')[0],
            score: qualified ? Math.max(lead.score, 80) : Math.min(lead.score, 59),
            history: [...lead.history, {
              id: lead.history.length + 1,
              type: 'note',
              action: qualified ? 'Lead qualified' : 'Lead unqualified',
              user: 'Current User',
              timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
              details: qualified ? `Lead qualified with score ${Math.max(lead.score, 80)}` : `Lead unqualified with score ${Math.min(lead.score, 59)}`,
              icon: qualified ? 'check' : 'archive'
            }]
          }
        : lead
    ));
  };

  // Get screen title based on current filter
  const getScreenTitle = () => {
    if (filters.status === 'qualified') return 'Qualified Leads';
    if (filters.status === 'unqualified') return 'Unqualified Leads';
    if (filters.status === 'contacted') return 'Contacted Leads';
    return 'All Leads';
  };

  const getScreenDescription = () => {
    if (filters.status === 'qualified') return 'High-potential leads ready for offer creation and contract initiation';
    if (filters.status === 'unqualified') return 'Leads requiring nurturing, re-engagement, or future follow-up';
    if (filters.status === 'contacted') return 'Leads that have been contacted and require follow-up actions';
    return 'Comprehensive lead management with status tracking and AI suggestions';
  };

  // Get qualified leads count for qualified screen stats
  const qualifiedLeadsCount = leads.filter(lead => lead.status === 'qualified').length;
  const contractReadyCount = leads.filter(lead => lead.status === 'qualified' && lead.contractReady).length;
  const unqualifiedLeadsCount = leads.filter(lead => lead.status === 'unqualified').length;
  const contactedLeadsCount = leads.filter(lead => lead.status === 'contacted').length;

  return (
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
          <h2 className="text-2xl font-bold">{getScreenTitle()}</h2>
          <p className="text-muted-foreground">{getScreenDescription()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('email-campaigns')}>
            <Mail className="h-4 w-4 mr-2" />
            Email Campaign
          </Button>
          <Button onClick={() => setShowNewLeadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Status-specific Stats */}
      {filters.status === 'qualified' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{qualifiedLeadsCount}</div>
              <p className="text-xs text-muted-foreground">High-potential prospects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contract Ready</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contractReadyCount}</div>
              <p className="text-xs text-muted-foreground">Ready for contract initiation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$420K</div>
              <p className="text-xs text-muted-foreground">Average qualified deal value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">74%</div>
              <p className="text-xs text-muted-foreground">Qualified to contract rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {filters.status === 'contacted' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacted Leads</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactedLeadsCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(lead => 
                  lead.status === 'contacted' && 
                  new Date(lead.followUpDate) <= new Date()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34%</div>
              <p className="text-xs text-muted-foreground">Contact to response rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 days</div>
              <p className="text-xs text-muted-foreground">Average time to respond</p>
            </CardContent>
          </Card>
        </div>
      )}

      {filters.status === 'unqualified' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unqualified Leads</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unqualifiedLeadsCount}</div>
              <p className="text-xs text-muted-foreground">Requiring nurturing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Future Potential</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45%</div>
              <p className="text-xs text-muted-foreground">May qualify in 6-12 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">41</div>
              <p className="text-xs text-muted-foreground">Below qualification threshold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Re-engagement</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12%</div>
              <p className="text-xs text-muted-foreground">Re-qualification success rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Lead Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-[5px]">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Company or contact..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
            {!initialFilters?.status && (
              <div className="space-y-[5px]">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="unqualified">Unqualified</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-[5px]">
              <Label>Industry</Label>
              <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Financial Services">Financial Services</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-[5px]">
              <Label>Score</Label>
              <Select value={filters.score} onValueChange={(value) => setFilters({...filters, score: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (80+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79)</SelectItem>
                  <SelectItem value="low">Low (&lt;60)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-[5px]">
              <Label>Engagement</Label>
              <Select value={filters.engagement} onValueChange={(value) => setFilters({...filters, engagement: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very High">Very High</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setFilters({ status: initialFilters?.status || '', industry: '', score: '', engagement: '', search: '' })}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      {selectedLeads.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleBulkCampaign} className="bg-orange-600 hover:bg-orange-700">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Start Campaign
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkAssign}>
                  <User className="h-4 w-4 mr-2" />
                  Assign Agent
                </Button>
                <Button size="sm" variant="outline" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{getScreenTitle()} ({filteredLeads.length} results)</CardTitle>
              <CardDescription>{getScreenDescription()}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => {
              const nextActionSuggestion = getNextActionSuggestions(lead.status, lead.lastContact);

              return (
                <Card key={lead.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Checkbox 
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={(checked) => handleSelectLead(lead.id, checked)}
                        />
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{lead.company}</h3>
                            <Badge variant={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                            {lead.decisionMaker && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Decision Maker
                              </Badge>
                            )}
                            {lead.status === 'qualified' && lead.contractReady && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Contract Ready
                              </Badge>
                            )}
                            {nextActionSuggestion.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                <Bell className="h-3 w-3 mr-1" />
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{lead.contact} • {lead.title}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {lead.location}
                            </span>
                            {lead.website && (
                              <a 
                                href={lead.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className={`text-sm font-medium px-2 py-1 rounded ${getScoreColor(lead.score)}`}>
                          Score: {lead.score}
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {lead.travelBudget} budget
                        </div>
                        <Badge variant={getUrgencyColor(lead.urgency)}>
                          {lead.urgency} urgency
                        </Badge>
                      </div>
                    </div>

                    {/* Workflow Suggestions */}
                    {(lead.status === 'contacted' || nextActionSuggestion.urgent) && (
                      <Alert className={`mb-4 ${nextActionSuggestion.urgent ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                        <Activity className={`h-4 w-4 ${nextActionSuggestion.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                        <AlertDescription className={nextActionSuggestion.urgent ? 'text-red-800' : 'text-blue-800'}>
                          <div className="flex items-center justify-between">
                            <div>
                              <strong>Next Action: {nextActionSuggestion.action}</strong>
                              <div className="text-sm mt-1">{nextActionSuggestion.description}</div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleWorkflowActions(lead)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Industry:</span> {lead.industry}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Company Size:</span> {lead.employees.toLocaleString()} employees
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Revenue:</span> {lead.revenue}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Source:</span> {lead.source}
                        </div>
                        {lead.assignedAgent && (
                          <div className="text-sm">
                            <span className="font-medium">Assigned Agent:</span> {getAssignedAgent(lead.assignedAgent)?.name || 'Unknown Agent'}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Last Contact:</span> {lead.lastContact}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Follow-up Date:</span> {lead.followUpDate}
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${getEngagementColor(lead.engagement)}`}>
                          <span className="font-medium">Engagement:</span> {lead.engagement}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    <Alert className="mb-4 border-blue-200 bg-blue-50">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>AI Suggestion:</strong> {lead.aiSuggestion}
                      </AlertDescription>
                    </Alert>

                    {/* Notes */}
                    {lead.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm"><strong>Notes:</strong> {lead.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => handleContact(lead)}>
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAddNote(lead)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Add Note
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCreateCampaign(lead)} className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200">
                          <Megaphone className="h-4 w-4 mr-1" />
                          Campaign
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewHistory(lead)} className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAssignAgent(lead)} className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200">
                          <User className="h-4 w-4 mr-1" />
                          {lead.assignedAgent ? 'Reassign' : 'Assign Agent'}
                        </Button>
                        {/* Qualified Lead Actions Dropdown */}
                        {lead.status === 'qualified' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                                <Activity className="h-4 w-4 mr-1" />
                                Actions
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                              <DropdownMenuItem onClick={() => handleInitiateCall(lead)}>
                                <PhoneCall className="h-4 w-4 mr-2 text-blue-600" />
                                Initiate Call
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleMeeting(lead)}>
                                <CalendarDays className="h-4 w-4 mr-2 text-indigo-600" />
                                Schedule Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleDemo(lead)}>
                                <Presentation className="h-4 w-4 mr-2 text-purple-600" />
                                Schedule Demo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {/* Create Offer Button */}
                        {lead.status === 'qualified' && (
                          <Button size="sm" variant="outline" onClick={() => handleCreateOffer(lead)} className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200">
                            <Gift className="h-4 w-4 mr-1" />
                            Create Offer
                          </Button>
                        )}
                        {/* Move to Opportunity Button */}
                        {lead.status === 'qualified' && (
                          <Button size="sm" variant="outline" onClick={() => handleMoveToOpportunity(lead)} className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                            <TrendingUpIcon className="h-4 w-4 mr-1" />
                            Move to Opportunity
                          </Button>
                        )}

                      </div>
                      <div className="flex gap-2">
                        {lead.status !== 'qualified' && (
                          <Button size="sm" variant="outline" onClick={() => handleQualify(lead.id, true)}>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Qualify
                          </Button>
                        )}
                        {lead.status !== 'unqualified' && (
                          <Button size="sm" variant="outline" onClick={() => handleDisqualify(lead)}>
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Disqualify
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add New Lead Dialog */}
      <Dialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Create a new lead with comprehensive company and contact information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-[5px]">
                <Label>Company Name *</Label>
                <Input
                  value={newLeadForm.company}
                  onChange={(e) => setNewLeadForm({...newLeadForm, company: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-[5px]">
                <Label>Contact Person *</Label>
                <Input
                  value={newLeadForm.contact}
                  onChange={(e) => setNewLeadForm({...newLeadForm, contact: e.target.value})}
                  placeholder="Enter contact name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-[5px]">
                <Label>Job Title</Label>
                <Input
                  value={newLeadForm.title}
                  onChange={(e) => setNewLeadForm({...newLeadForm, title: e.target.value})}
                  placeholder="e.g., Procurement Director"
                />
              </div>
              <div className="space-y-[5px]">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({...newLeadForm, email: e.target.value})}
                  placeholder="contact@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({...newLeadForm, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Industry *</Label>
                <Select value={newLeadForm.industry} onValueChange={(value) => setNewLeadForm({...newLeadForm, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                    <SelectItem value="Banking">Banking</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Size (Employees)</Label>
                <Input
                  type="number"
                  value={newLeadForm.employees}
                  onChange={(e) => setNewLeadForm({...newLeadForm, employees: e.target.value})}
                  placeholder="Number of employees"
                />
              </div>
              <div>
                <Label>Annual Revenue</Label>
                <Input
                  value={newLeadForm.revenue}
                  onChange={(e) => setNewLeadForm({...newLeadForm, revenue: e.target.value})}
                  placeholder="e.g., $50M, $2.5B"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={newLeadForm.location}
                  onChange={(e) => setNewLeadForm({...newLeadForm, location: e.target.value})}
                  placeholder="City, State/Country"
                />
              </div>
              <div>
                <Label>Lead Source *</Label>
                <Select value={newLeadForm.source} onValueChange={(value) => setNewLeadForm({...newLeadForm, source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="How did we find this lead?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                    <SelectItem value="Cold Email">Cold Email</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Initial Status *</Label>
                <Select value={newLeadForm.status} onValueChange={(value) => setNewLeadForm({...newLeadForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select initial status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="unqualified">Unqualified</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Set the initial status for this lead
                </p>
              </div>
            </div>
            <div>
              <Label>Estimated Travel Budget</Label>
              <Input
                value={newLeadForm.travelBudget}
                onChange={(e) => setNewLeadForm({...newLeadForm, travelBudget: e.target.value})}
                placeholder="e.g., $250K, $1.2M"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="decisionMaker"
                checked={newLeadForm.decisionMaker}
                onChange={(e) => setNewLeadForm({...newLeadForm, decisionMaker: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="decisionMaker">Contact is a decision maker</Label>
            </div>
            <div>
              <Label>Initial Notes</Label>
              <Textarea
                value={newLeadForm.notes}
                onChange={(e) => setNewLeadForm({...newLeadForm, notes: e.target.value})}
                placeholder="Any additional information about this lead..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewLeadDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNewLead}
              disabled={!newLeadForm.company || !newLeadForm.contact || !newLeadForm.email || !newLeadForm.industry || !newLeadForm.source}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Lead
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
              Lead History - {selectedLead?.company}
            </DialogTitle>
            <DialogDescription>
              Complete activity history for {selectedLead?.contact} at {selectedLead?.company}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            <div className="space-y-4 pr-4">
              {selectedLead?.history && selectedLead.history.length > 0 ? (
                selectedLead.history.map((item, index) => {
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
                            {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <UserIcon className="h-3 w-3" />
                          <span>by {item.user}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity history available for this lead</p>
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

      {/* Workflow Actions Dialog */}
      <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Workflow Actions - {selectedLead?.company}</DialogTitle>
            <DialogDescription>Choose the best next action for this lead</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              {getNextActionSuggestions(selectedLead.status, selectedLead.lastContact).suggestions.map((suggestion, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{suggestion}</p>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.includes('email') && 'Send a personalized follow-up email'}
                          {suggestion.includes('call') && 'Schedule and conduct a phone call'}
                          {suggestion.includes('LinkedIn') && 'Connect and message on LinkedIn'}
                          {suggestion.includes('meeting') && 'Schedule a discovery meeting'}
                          {suggestion.includes('proposal') && 'Prepare and send detailed proposal'}
                          {suggestion.includes('qualify') && 'Conduct lead qualification process'}
                          {suggestion.includes('campaign') && 'Add to automated nurture sequence'}
                          {suggestion.includes('reminder') && 'Set automated follow-up reminder'}
                          {suggestion.includes('materials') && 'Prepare supporting documentation'}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">
                      Execute
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWorkflowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact {selectedLead?.company}</DialogTitle>
            <DialogDescription>Send a personalized message to {selectedLead?.contact}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-[5px]">
              <Label>Contact Method</Label>
              <Select value={contactForm.type} onValueChange={(value) => setContactForm({...contactForm, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-[5px]">
              <Label>Subject</Label>
              <Input
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                placeholder="Enter subject line..."
              />
            </div>
            <div className="space-y-[5px]">
              <Label>Message</Label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
            <div className="space-y-[5px]">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={contactForm.followUpDate}
                onChange={(e) => setContactForm({...contactForm, followUpDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendContact}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note for {selectedLead?.company}</DialogTitle>
            <DialogDescription>Update lead information and next actions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note</Label>
              <Textarea
                value={noteForm.note}
                onChange={(e) => setNoteForm({...noteForm, note: e.target.value})}
                placeholder="Add your notes..."
                rows={4}
              />
            </div>
            <div>
              <Label>Next Action</Label>
              <Input
                value={noteForm.nextAction}
                onChange={(e) => setNoteForm({...noteForm, nextAction: e.target.value})}
                placeholder="Next action to take..."
              />
            </div>
            <div>
              <Label>Urgency</Label>
              <Select value={noteForm.urgency} onValueChange={(value) => setNoteForm({...noteForm, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>
              <Plus className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initiate Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              Initiate Call - {selectedLead?.company}
            </DialogTitle>
            <DialogDescription>
              Schedule a phone call with {selectedLead?.contact} at {selectedLead?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Call Type</Label>
                <Select value={callForm.type} onValueChange={(value) => setCallForm({...callForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery Call</SelectItem>
                    <SelectItem value="follow_up">Follow-up Call</SelectItem>
                    <SelectItem value="qualification">Qualification Call</SelectItem>
                    <SelectItem value="closing">Closing Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Select value={callForm.duration} onValueChange={(value) => setCallForm({...callForm, duration: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Scheduled Date & Time</Label>
              <Input
                type="datetime-local"
                value={callForm.scheduledTime}
                onChange={(e) => setCallForm({...callForm, scheduledTime: e.target.value})}
              />
            </div>
            <div>
              <Label>Call Agenda</Label>
              <Textarea
                value={callForm.agenda}
                onChange={(e) => setCallForm({...callForm, agenda: e.target.value})}
                placeholder="Outline the main topics to discuss during the call..."
                rows={4}
              />
            </div>
            <div>
              <Label>Preparation Notes</Label>
              <Textarea
                value={callForm.notes}
                onChange={(e) => setCallForm({...callForm, notes: e.target.value})}
                placeholder="Any additional preparation notes or context..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCall} className="bg-blue-600 hover:bg-blue-700">
              <PhoneCall className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Schedule Meeting - {selectedLead?.company}
            </DialogTitle>
            <DialogDescription>
              Schedule a business meeting with {selectedLead?.contact} and team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meeting Type</Label>
                <Select value={meetingForm.type} onValueChange={(value) => setMeetingForm({...meetingForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business_meeting">Business Meeting</SelectItem>
                    <SelectItem value="requirements_gathering">Requirements Gathering</SelectItem>
                    <SelectItem value="solution_presentation">Solution Presentation</SelectItem>
                    <SelectItem value="stakeholder_meeting">Stakeholder Meeting</SelectItem>
                    <SelectItem value="negotiation">Contract Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Select value={meetingForm.duration} onValueChange={(value) => setMeetingForm({...meetingForm, duration: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Meeting Title</Label>
              <Input
                value={meetingForm.title}
                onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})}
                placeholder="Enter meeting title..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Scheduled Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={meetingForm.scheduledTime}
                  onChange={(e) => setMeetingForm({...meetingForm, scheduledTime: e.target.value})}
                />
              </div>
              <div>
                <Label>Location/Format</Label>
                <Select value={meetingForm.location} onValueChange={(value) => setMeetingForm({...meetingForm, location: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual Meeting</SelectItem>
                    <SelectItem value="client_office">Client Office</SelectItem>
                    <SelectItem value="our_office">Our Office</SelectItem>
                    <SelectItem value="neutral_location">Neutral Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Expected Attendees</Label>
              <Input
                value={meetingForm.attendees}
                onChange={(e) => setMeetingForm({...meetingForm, attendees: e.target.value})}
                placeholder="List expected attendees and their roles..."
              />
            </div>
            <div>
              <Label>Meeting Agenda</Label>
              <Textarea
                value={meetingForm.agenda}
                onChange={(e) => setMeetingForm({...meetingForm, agenda: e.target.value})}
                placeholder="Outline the meeting agenda and topics to cover..."
                rows={4}
              />
            </div>
            <div>
              <Label>Meeting Objectives</Label>
              <Textarea
                value={meetingForm.objectives}
                onChange={(e) => setMeetingForm({...meetingForm, objectives: e.target.value})}
                placeholder="Define the key objectives and desired outcomes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMeetingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMeeting} className="bg-indigo-600 hover:bg-indigo-700">
              <CalendarDays className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Demo Dialog */}
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Presentation className="h-5 w-5" />
              Schedule Demo - {selectedLead?.company}
            </DialogTitle>
            <DialogDescription>
              Schedule a product demonstration for {selectedLead?.contact} and team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Demo Type</Label>
                <Select value={demoForm.type} onValueChange={(value) => setDemoForm({...demoForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product_demo">Product Demo</SelectItem>
                    <SelectItem value="platform_walkthrough">Platform Walkthrough</SelectItem>
                    <SelectItem value="custom_demo">Custom Demo</SelectItem>
                    <SelectItem value="proof_of_concept">Proof of Concept</SelectItem>
                    <SelectItem value="pilot_simulation">Pilot Simulation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Select value={demoForm.duration} onValueChange={(value) => setDemoForm({...demoForm, duration: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Demo Title</Label>
              <Input
                value={demoForm.title}
                onChange={(e) => setDemoForm({...demoForm, title: e.target.value})}
                placeholder="Enter demo title..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Scheduled Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={demoForm.scheduledTime}
                  onChange={(e) => setDemoForm({...demoForm, scheduledTime: e.target.value})}
                />
              </div>
              <div>
                <Label>Demo Format</Label>
                <Select value={demoForm.demoFormat} onValueChange={(value) => setDemoForm({...demoForm, demoFormat: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual Demo</SelectItem>
                    <SelectItem value="on_site">On-site Demo</SelectItem>
                    <SelectItem value="hybrid">Hybrid Demo</SelectItem>
                    <SelectItem value="recorded">Recorded Demo + Q&A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Expected Attendees</Label>
              <Input
                value={demoForm.attendees}
                onChange={(e) => setDemoForm({...demoForm, attendees: e.target.value})}
                placeholder="List demo attendees and their roles..."
              />
            </div>
            <div>
              <Label>Focus Areas</Label>
              <Textarea
                value={demoForm.focus_areas}
                onChange={(e) => setDemoForm({...demoForm, focus_areas: e.target.value})}
                placeholder="Key features and capabilities to highlight during the demo..."
                rows={4}
              />
            </div>
            <div>
              <Label>Preparation Notes</Label>
              <Textarea
                value={demoForm.preparation_notes}
                onChange={(e) => setDemoForm({...demoForm, preparation_notes: e.target.value})}
                placeholder="Preparation notes, custom scenarios, or specific requirements..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDemo} className="bg-purple-600 hover:bg-purple-700">
              <Presentation className="h-4 w-4 mr-2" />
              Schedule Demo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assign Sales Agent - {selectedLead?.isMultiple ? `${selectedLead.selectedCount} Leads` : selectedLead?.company}
            </DialogTitle>
            <DialogDescription>
              {selectedLead?.isMultiple 
                ? `Assign ${selectedLead.selectedCount} selected leads to a sales agent for personalized follow-up and management`
                : "Assign this lead to a sales agent for personalized follow-up and management"
              }
            </DialogDescription>
          </DialogHeader>
          <div 
            className="space-y-6"
            style={{ 
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)' /* 16px */
            }}
          >
            <div>
              <Label 
                style={{ 
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)', /* 14px */
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: '5px',
                  display: 'block'
                }}
              >
                Select Sales Agent *
              </Label>
              <Select value={assignForm.agent} onValueChange={(value) => setAssignForm({...assignForm, agent: value})}>
                <SelectTrigger style={{ fontFamily: 'var(--font-family)' }}>
                  <SelectValue placeholder="Choose a sales agent..." />
                </SelectTrigger>
                <SelectContent style={{ fontFamily: 'var(--font-family)' }}>
                  {salesAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div 
                            className="font-medium"
                            style={{ 
                              fontFamily: 'var(--font-family)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--foreground)'
                            }}
                          >
                            {agent.name}
                          </div>
                          <div 
                            className="text-xs text-muted-foreground"
                            style={{ 
                              fontFamily: 'var(--font-family)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--muted-foreground)'
                            }}
                          >
                            {agent.specialties.join(', ')} • {agent.currentLeads} leads
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {assignForm.agent && (
                <div 
                  className="mt-3 rounded-lg"
                  style={{ 
                    padding: 'var(--space-3xl)', /* 16px */
                    backgroundColor: 'var(--blue-brand-50)', /* Light blue background */
                    border: '1px solid var(--blue-brand-200)', /* Light blue border */
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-family)'
                  }}
                >
                  <div 
                    style={{ 
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)', /* 14px */
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--blue-brand-600)', /* Dark blue text */
                      marginBottom: 'var(--space-md)' /* 4px */
                    }}
                  >
                    {salesAgents.find(a => a.id === assignForm.agent)?.name}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)', /* 12px */
                      color: 'var(--blue-brand)',
                      marginBottom: 'var(--space-xs)' /* 1px */
                    }}
                  >
                    <strong>Email:</strong> {salesAgents.find(a => a.id === assignForm.agent)?.email}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)', /* 12px */
                      color: 'var(--blue-brand)',
                      marginBottom: 'var(--space-xs)' /* 1px */
                    }}
                  >
                    <strong>Specialties:</strong> {salesAgents.find(a => a.id === assignForm.agent)?.specialties.join(', ')}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)', /* 12px */
                      color: 'var(--blue-brand)'
                    }}
                  >
                    <strong>Current Leads:</strong> {salesAgents.find(a => a.id === assignForm.agent)?.currentLeads}
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label 
                style={{ 
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)', /* 14px */
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: '5px',
                  display: 'block'
                }}
              >
                Assignment Priority
              </Label>
              <Select value={assignForm.priority} onValueChange={(value) => setAssignForm({...assignForm, priority: value})}>
                <SelectTrigger style={{ fontFamily: 'var(--font-family)' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ fontFamily: 'var(--font-family)' }}>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label 
                style={{ 
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)', /* 14px */
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: '5px',
                  display: 'block'
                }}
              >
                Assignment Notes
              </Label>
              <Textarea
                value={assignForm.notes}
                onChange={(e) => setAssignForm({...assignForm, notes: e.target.value})}
                placeholder="Any specific instructions or context for the assigned agent..."
                rows={4}
                style={{ 
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)' /* 14px */
                }}
              />
            </div>
            {selectedLead && (
              <div 
                className="rounded-lg"
                style={{ 
                  padding: 'var(--space-3xl)', /* 16px */
                  backgroundColor: 'var(--muted)', /* Theme muted background */
                  border: '1px solid var(--border)', /* Theme border */
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                <div 
                  style={{ 
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)', /* 14px */
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    marginBottom: 'var(--space-lg)' /* 6px */
                  }}
                >
                  {selectedLead.isMultiple ? 'Bulk Assignment Summary' : 'Lead Summary'}
                </div>
                {selectedLead.isMultiple ? (
                  <div className="space-y-2">
                    <div 
                      style={{ 
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)', /* 12px */
                        color: 'var(--foreground)'
                      }}
                    >
                      <strong>Selected Leads:</strong> {selectedLead.selectedCount}
                    </div>
                    <div 
                      style={{ 
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)', /* 12px */
                        color: 'var(--foreground)'
                      }}
                    >
                      <strong>Lead Companies:</strong> {leads.filter(l => selectedLead.selectedIds.includes(l.id)).map(l => l.company).join(', ')}
                    </div>
                    <div 
                      className="mt-1"
                      style={{ 
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)', /* 12px */
                        color: 'var(--muted-foreground)',
                        marginTop: 'var(--space-xs)' /* 1px */
                      }}
                    >
                      All selected leads will be assigned to the chosen agent with the same priority and notes.
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      className="grid grid-cols-2 gap-2"
                      style={{ 
                        gap: 'var(--space-lg)', /* 6px */
                        marginBottom: 'var(--space-lg)' /* 6px */
                      }}
                    >
                      <div 
                        style={{ 
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-xs)', /* 12px */
                          color: 'var(--foreground)'
                        }}
                      >
                        <strong>Industry:</strong> {selectedLead.industry}
                      </div>
                      <div 
                        style={{ 
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-xs)', /* 12px */
                          color: 'var(--foreground)'
                        }}
                      >
                        <strong>Score:</strong> {selectedLead.score}
                      </div>
                      <div 
                        style={{ 
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-xs)', /* 12px */
                          color: 'var(--foreground)'
                        }}
                      >
                        <strong>Budget:</strong> {selectedLead.travelBudget}
                      </div>
                      <div 
                        style={{ 
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-xs)', /* 12px */
                          color: 'var(--foreground)'
                        }}
                      >
                        <strong>Status:</strong> {selectedLead.status}
                      </div>
                    </div>
                    <div 
                      style={{ 
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)', /* 12px */
                        color: 'var(--foreground)',
                        marginTop: 'var(--space-lg)' /* 6px */
                      }}
                    >
                      <strong>AI Suggestion:</strong> {selectedLead.aiSuggestion}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAssignment} 
              disabled={!assignForm.agent} 
              variant="default"
              className="transition-all duration-200 hover:opacity-90 hover:shadow-md"
              style={{ 
                backgroundColor: 'var(--primary)', /* #FD9646 - theme orange */
                color: 'var(--primary-foreground)', /* white */
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)', /* 14px */
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              <User className="h-4 w-4 mr-2" />
              {selectedLead?.isMultiple 
                ? `Assign ${selectedLead.selectedCount} Leads` 
                : (selectedLead?.assignedAgent ? 'Reassign Agent' : 'Assign Agent')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disqualify Modal Dialog */}
      <Dialog open={showDisqualifyDialog} onOpenChange={setShowDisqualifyDialog}>
        <DialogContent className="modal-content-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-destructive" />
              Disqualify Lead
            </DialogTitle>
            <DialogDescription>
              {selectedLead && (
                <>Please provide a reason for disqualifying <strong>{selectedLead.company}</strong>. This action will remove the lead from your active list.</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="disqualify-reason">Reason for disqualify</Label>
              <Textarea
                id="disqualify-reason"
                placeholder="Enter the reason for disqualifying this lead (optional)..."
                value={disqualifyForm.reason}
                onChange={(e) => setDisqualifyForm({ ...disqualifyForm, reason: e.target.value })}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleDisqualifySkip}
            >
              Skip
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisqualifySubmit} className="bg-[rgba(255,155,42,1)]"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}