import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
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
  RefreshCw,
  Plus,
  MessageSquare,
  Edit,
  History,
  User,
  ArrowRight,
  Building2,
  DollarSign,
  Clock,
  Globe,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Gift,
  MapPin,
  Briefcase,
  Activity,
  Bell,
  Settings,
  Info,
  ChevronRight,
  Megaphone,
  PhoneCall,
  CalendarDays,
  Presentation,
  Video,
  UserIcon,
  MessageCircle,
  PhoneCallIcon,
  CalendarIcon,
  ExternalLink,
  ChevronDown,
  Archive,
  TrendingUp as TrendingUpIcon,
  MoreVertical,
  Eye
} from 'lucide-react';
import { toast } from "sonner";
import { format } from 'date-fns';

interface LeadsListProps {
  initialFilters?: any;
  onNavigate: (screen: string, filters?: any) => void;
}

// Helper function to transform API history entry to a consistent format
const transformHistoryEntry = (entry: any) => {
  const iconMap: { [key: string]: string } = {
    'lead_created': 'plus',
    'lead_contacted': 'mail',
    'lead_responded': 'message-circle',
    'discovery_call_scheduled': 'phone',
    'lead_qualified': 'check-circle',
    'lead_disqualified': 'x-circle',
    'score_updated': 'trending-up',
    'note_added': 'message-square',
    'lead_assigned': 'user',
    'status_change': 'refresh-cw',
    'email_sent': 'mail',
    'phone_call': 'phone',
    'meeting_scheduled': 'calendar',
    'proposal_sent': 'briefcase',
    'contract_signed': 'handshake',
    'deal_won': 'trophy',
    'deal_lost': 'x',
  };

  return {
    id: entry.id,
    type: entry.type,
    action: entry.action,
    user: entry.user?.username || entry.created_by?.username || 'Unknown User',
    timestamp: entry.created_at || entry.timestamp,
    details: entry.details || entry.note,
    metadata: entry.metadata || {
      next_action: entry.next_action,
      urgency: entry.urgency
    },
    icon: iconMap[entry.type] || 'activity' // Default to 'activity' if type not mapped
  };
};


// Transform API lead data to match the component's expected format
const transformApiLeadToUILead = (apiLead: any) => {
  // Get the latest note from lead_notes array if available
  const latestNote = apiLead.lead_notes && apiLead.lead_notes.length > 0 
    ? apiLead.lead_notes[0] // Notes are ordered by -created_at in the backend
    : null;

  // Combine original notes with latest lead notes
  const combinedNotes = [
    apiLead.notes || '',
    latestNote ? `[${new Date(latestNote.created_at).toLocaleDateString()}] ${latestNote.note}` : ''
  ].filter(Boolean).join(' | ');

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
    revenue: `$${Math.floor(Math.random() * 1000)}M`,
    location: apiLead.company?.location || 'Unknown Location',
    status: apiLead.status || 'new',
    score: apiLead.score || 50,
    source: apiLead.source || 'Unknown',
    lastContact: apiLead.created_at ? new Date(apiLead.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    nextAction: latestNote?.next_action || apiLead.next_action || 'Follow up',
    notes: combinedNotes,
    leadNotes: apiLead.lead_notes || [], // Store all notes for display
    engagement: apiLead.score >= 80 ? 'High' : apiLead.score >= 60 ? 'Medium' : 'Low',
    travelBudget: apiLead.estimated_value ? `$${Math.floor(apiLead.estimated_value / 1000)}K` : '$0K',
    decisionMaker: apiLead.contact?.is_decision_maker || Math.random() > 0.5,
    urgency: latestNote?.urgency || apiLead.priority || 'Medium',
    aiSuggestion: `AI Score: ${apiLead.score}. ${apiLead.score >= 80 ? 'High priority lead - contact immediately' : apiLead.score >= 60 ? 'Medium priority - follow up within 2 days' : 'Low priority - add to nurture campaign'}`,
    tags: [apiLead.company?.industry || 'General', apiLead.status || 'New'],
    contractReady: apiLead.status === 'qualified',
    lastActivity: apiLead.updated_at ? new Date(apiLead.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    followUpDate: apiLead.next_action_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedAgent: apiLead.assigned_to?.username || null,
    // History will be fetched separately via API and mapped in the dialog
    history_entries: apiLead.history_entries || [] 
  };
};

// Build comprehensive history for each lead (This function is now primarily for reference if needed, but history is fetched from API)
const buildLeadHistory = (apiLead: any) => {
  const history = [];
  let historyId = 1;

  // Lead creation
  history.push({
    id: historyId++,
    type: 'creation',
    action: 'Lead created',
    user: 'System',
    timestamp: apiLead.created_at || new Date().toISOString(),
    details: `Lead created from ${apiLead.source || 'unknown source'}. Initial contact information collected for ${apiLead.company?.name || 'company'}.`,
    icon: 'plus'
  });

  // Status changes
  if (apiLead.status === 'contacted') {
    history.push({
      id: historyId++,
      type: 'status_change',
      action: 'Lead contacted',
      user: apiLead.assigned_to?.username || 'Sales Team',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      details: `Initial contact made with ${apiLead.contact?.first_name || 'contact'}. Outreach sent via email.`,
      icon: 'mail'
    });
  }

  if (apiLead.status === 'responded') {
    history.push({
      id: historyId++,
      type: 'response',
      action: 'Lead responded',
      user: apiLead.contact?.first_name || 'Contact',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      details: `${apiLead.contact?.first_name || 'Contact'} responded to initial outreach. Expressed interest in travel solutions.`,
      icon: 'message-circle'
    });
  }

  if (apiLead.status === 'in-progress') {
    history.push({
      id: historyId++,
      type: 'call',
      action: 'Discovery call scheduled',
      user: apiLead.assigned_to?.username || 'Sales Team',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      details: 'Scheduled 30-minute discovery call. Discussed travel requirements and current pain points.',
      icon: 'phone'
    });
  }

  if (apiLead.status === 'qualified') {
    history.push({
      id: historyId++,
      type: 'qualification',
      action: 'Lead qualified as high-priority',
      user: apiLead.assigned_to?.username || 'Sales Manager',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      details: `Lead qualified based on budget (${apiLead.estimated_value ? `$${Math.floor(apiLead.estimated_value / 1000)}K` : 'TBD'}), authority, and timeline. Ready for proposal stage.`,
      icon: 'check-circle'
    });
  }

  if (apiLead.status === 'unqualified') {
    history.push({
      id: historyId++,
      type: 'disqualification',
      action: 'Lead disqualified',
      user: apiLead.assigned_to?.username || 'Sales Team',
      timestamp: new Date().toISOString(),
      details: 'Lead disqualified due to budget constraints or timeline mismatch. Moved to nurture campaign.',
      icon: 'x-circle'
    });
  }

  // Score updates
  if (apiLead.score && apiLead.score > 50) {
    history.push({
      id: historyId++,
      type: 'score_update',
      action: 'Lead score updated',
      user: 'AI System',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      details: `Lead score updated to ${apiLead.score} based on engagement metrics and profile analysis.`,
      icon: 'trending-up'
    });
  }

  // Add all lead notes to history
  if (apiLead.lead_notes && apiLead.lead_notes.length > 0) {
    apiLead.lead_notes.forEach((note: any) => {
      history.push({
        id: historyId++,
        type: 'note',
        action: 'Note added',
        user: note.created_by?.username || 'User',
        timestamp: note.created_at,
        details: note.note,
        icon: 'message-square',
        metadata: {
          next_action: note.next_action,
          urgency: note.urgency
        }
      });
    });
  }

  // Assignment changes
  if (apiLead.assigned_to) {
    history.push({
      id: historyId++,
      type: 'assignment',
      action: 'Lead assigned',
      user: 'Sales Manager',
      timestamp: apiLead.created_at || new Date().toISOString(),
      details: `Lead assigned to ${apiLead.assigned_to.first_name} ${apiLead.assigned_to.last_name} for follow-up.`,
      icon: 'user'
    });
  }

  // Sort history by timestamp (oldest first)
  return history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export function LeadsList({ initialFilters, onNavigate }: LeadsListProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const leadApi = useLeadApi();
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const [showDisqualifyDialog, setShowDisqualifyDialog] = useState(false);
  const [selectedLeadForDisqualify, setSelectedLeadForDisqualify] = useState<any>(null);
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedLeadForContact, setSelectedLeadForContact] = useState<any>(null);
  const [contactForm, setContactForm] = useState({
    method: 'Email',
    subject: '',
    message: '',
    followUpDate: ''
  });
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<any>(null);
  const [noteForm, setNoteForm] = useState({
    note: '',
    nextAction: '',
    urgency: 'Medium'
  });
  const [expandedNotes, setExpandedNotes] = useState<{[key: number]: boolean}>({});
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState<any>(null);
  const [leadHistories, setLeadHistories] = useState<{[key: number]: any[]}>({}); // This is now for local history if API fails or is not used
  const [filters, setFilters] = useState({
    status: initialFilters?.status || 'all',
    industry: 'all',
    score: 'all',
    engagement: 'all',
    search: ''
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

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const apiResponse = await leadApi.getLeads(); // Assuming getLeads returns { results: [], count: N }
      const apiLeads = apiResponse.results;
      console.log('Fetched leads:', apiLeads);

      // Transform leads and include history entries from API response
      const transformedLeads = apiLeads.map((apiLead: any) => ({
        ...transformApiLeadToUILead(apiLead),
        history_entries: apiLead.history || [] // Directly use history from API response
      }));
      setLeads(transformedLeads);

    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }));

      if (initialFilters.newLead) {
        const newLead = {
          id: Math.max(...leads.map(l => l.id)) + 1, // This might be problematic if leads is empty initially
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
          history_entries: [ // Placeholder for history, actual history will come from API
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
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    }
  }, [initialFilters]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'qualified':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'responded':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'unqualified':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'new':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUrgencyBadgeStyle = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleNotesExpansion = (leadId: number) => {
    setExpandedNotes(prev => ({
      ...prev,
      [leadId]: !prev[leadId]
    }));
  };

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

  const handleCreateNewLead = async () => {
    try {
      if (!newLeadForm.company || !newLeadForm.contact || !newLeadForm.email || !newLeadForm.industry) {
        toast.error('Please fill in all required fields (Company, Contact, Email, and Industry)');
        return;
      }

      const leadData = {
        company: {
          name: newLeadForm.company,
          industry: newLeadForm.industry,
          location: newLeadForm.location || '',
          size: newLeadForm.employees ? 'medium' : 'startup',
          annual_revenue: newLeadForm.revenue ? parseFloat(newLeadForm.revenue.replace(/[^0-9.]/g, '')) : null,
          travel_budget: newLeadForm.travelBudget ? parseFloat(newLeadForm.travelBudget.replace(/[^0-9.]/g, '')) : null
        },
        contact: {
          first_name: newLeadForm.contact.split(' ')[0] || newLeadForm.contact,
          last_name: newLeadForm.contact.split(' ').slice(1).join(' ') || '',
          email: newLeadForm.email,
          phone: newLeadForm.phone || '',
          position: newLeadForm.title || '',
          is_decision_maker: newLeadForm.decisionMaker || false
        },
        status: newLeadForm.status || 'new',
        source: newLeadForm.source || 'website',
        priority: 'medium',
        score: 50,
        estimated_value: newLeadForm.travelBudget ? parseFloat(newLeadForm.travelBudget.replace(/[^0-9.]/g, '')) : null,
        notes: newLeadForm.notes || '',
        next_action: 'Initial contact'
      };

      console.log('Creating lead with data:', leadData);

      const createdLead = await leadApi.createLead(leadData);

      console.log('Lead created successfully:', createdLead);

      // Add history entry for new lead (This part should also be handled by the backend and returned)
      // For now, assuming backend creates the initial history entry.
      // If not, this would need an API call like addHistoryEntry.

      await fetchLeads(); // Refresh to show the new lead

      setShowNewLeadDialog(false);
      setSuccessMessage(`New lead "${newLeadForm.company}" has been created successfully!`);
      setTimeout(() => setSuccessMessage(''), 5000);

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

      toast.success('Lead added successfully!');

    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead. Please try again.');
    }
  };

  const handleQualifyLead = async (leadId: number) => {
    try {
      await leadApi.qualifyLead(leadId);

      // Fetch updated lead data to reflect status change and potential history
      await fetchLeads();

      setSuccessMessage('Lead has been qualified successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      toast.success('Lead qualified successfully!');
    } catch (error) {
      console.error('Error qualifying lead:', error);
      toast.error('Failed to qualify lead. Please try again.');
    }
  };

  const handleDisqualifyLead = (lead: any) => {
    setSelectedLeadForDisqualify(lead);
    setShowDisqualifyDialog(true);
    setDisqualifyReason('');
  };

  const handleConfirmDisqualify = async () => {
    if (!selectedLeadForDisqualify) return;

    try {
      await leadApi.disqualifyLead(selectedLeadForDisqualify.id, disqualifyReason);

      // Fetch updated lead data
      await fetchLeads();

      setSuccessMessage('Lead has been disqualified successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      toast.success('Lead disqualified successfully!');

      // Close dialog and reset state
      setShowDisqualifyDialog(false);
      setSelectedLeadForDisqualify(null);
      setDisqualifyReason('');
    } catch (error) {
      console.error('Error disqualifying lead:', error);
      toast.error('Failed to disqualify lead. Please try again.');
    }
  };

  const handleContactLead = (lead: any) => {
    setSelectedLeadForContact(lead);
    setContactForm({
      method: 'Email',
      subject: `Partnership Opportunity - ${lead.company}`,
      message: `Hi ${lead.contact.split(' ')[0]},

I hope this message finds you well. I wanted to follow up regarding our corporate travel solutions that could benefit ${lead.company}.

Based on your organization's profile, I believe we can help optimize your travel operations and reduce costs.

Would you be available for a brief call this week to discuss how we can support your travel needs?

Best regards,
SOAR-AI Team`,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowContactDialog(true);
  };

  const handleSendMessage = async () => {
    if (!selectedLeadForContact || !contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Here you would typically call an API to send the message
      // And also create a history entry via API
      await leadApi.sendMessage(selectedLeadForContact.id, {
        method: contactForm.method,
        subject: contactForm.subject,
        message: contactForm.message,
        followUpDate: contactForm.followUpDate
      });

      // Update lead status to contacted if applicable and refresh
      await fetchLeads();

      setSuccessMessage(`Message sent to ${selectedLeadForContact.company} successfully!`);
      setTimeout(() => setSuccessMessage(''), 5000);
      toast.success('Message sent successfully!');

      // Close dialog and reset state
      setShowContactDialog(false);
      setSelectedLeadForContact(null);
      setContactForm({
        method: 'Email',
        subject: '',
        message: '',
        followUpDate: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleAddNote = (lead: any) => {
    setSelectedLeadForNote(lead);
    setNoteForm({
      note: '',
      nextAction: lead.nextAction || '',
      urgency: lead.urgency || 'Medium'
    });
    setShowAddNoteDialog(true);
  };

  const handleShowHistory = (lead: any) => {
    setSelectedLeadForHistory(lead);
    setShowHistoryDialog(true);
  };

  // Function to add history entry for any action (now should be done via API)
  const addHistoryEntry = (leadId: number, entry: any) => {
    // This function would ideally make an API call to create a history entry
    // For now, we'll simulate by updating local state if needed, but API is preferred
    console.warn("addHistoryEntry called locally. Prefer using API for history updates.");

    // Update the lead's history in the leads array for immediate UI feedback if necessary
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? {
              ...lead,
              history_entries: [
                ...(lead.history_entries || []),
                {
                  ...entry,
                  id: Date.now() + Math.random(), // Temp ID
                  timestamp: new Date().toISOString(),
                  user: { username: 'You' } // Assume current user
                }
              ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            }
          : lead
      )
    );

    // Also update the leadHistories state if it's used for fallback display
    setLeadHistories(prev => ({
      ...prev,
      [leadId]: [
        ...(prev[leadId] || []),
        {
          ...entry,
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString()
        }
      ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }));
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'lead_created':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Plus className="h-4 w-4 text-blue-600" /></div>;
      case 'note_added':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><MessageSquare className="h-4 w-4 text-blue-600" /></div>;
      case 'phone_call':
        return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><Phone className="h-4 w-4 text-purple-600" /></div>;
      case 'meeting_scheduled':
        return <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center"><Calendar className="h-4 w-4 text-pink-600" /></div>;
      case 'lead_qualified':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="h-4 w-4 text-green-600" /></div>;
      case 'lead_disqualified':
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><UserX className="h-4 w-4 text-red-600" /></div>;
      case 'email_sent':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Mail className="h-4 w-4 text-blue-600" /></div>;
      case 'lead_responded':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><MessageCircle className="h-4 w-4 text-green-600" /></div>;
      case 'status_change':
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center"><RefreshCw className="h-4 w-4 text-yellow-600" /></div>;
      case 'score_updated':
        return <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><TrendingUp className="h-4 w-4 text-orange-600" /></div>;
      case 'lead_assigned':
        return <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"><User className="h-4 w-4 text-indigo-600" /></div>;
      case 'proposal_sent':
        return <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center"><Briefcase className="h-4 w-4 text-teal-600" /></div>;
      case 'contract_signed':
        return <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><Handshake className="h-4 w-4 text-emerald-600" /></div>;
      case 'deal_won':
        return <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center"><Award className="h-4 w-4 text-lime-600" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Activity className="h-4 w-4 text-gray-600" /></div>;
    }
  };

  const handleSaveNote = async () => {
    if (!selectedLeadForNote || !noteForm.note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      // Call API to add note, which will also create a history entry
      await leadApi.addNote(selectedLeadForNote.id, {
        note: noteForm.note,
        next_action: noteForm.nextAction,
        urgency: noteForm.urgency
      });

      // Refresh leads to get the latest data including the new note and history
      await fetchLeads();

      // Close dialog and reset state
      setShowAddNoteDialog(false);
      setSelectedLeadForNote(null);
      setNoteForm({
        note: '',
        nextAction: '',
        urgency: 'Medium'
      });

      setSuccessMessage(`Note added to ${selectedLeadForNote.company} successfully!`);
      setTimeout(() => setSuccessMessage(''), 5000);
      toast.success('Note saved successfully!');

    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note. Please try again.');
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filters.status && filters.status !== 'all' && lead.status !== filters.status) return false;
    if (filters.industry && filters.industry !== 'all' && lead.industry !== filters.industry) return false;
    if (filters.score && filters.score !== 'all' && (
      (filters.score === 'high' && lead.score < 80) ||
      (filters.score === 'medium' && (lead.score < 60 || lead.score >= 80)) ||
      (filters.score === 'low' && lead.score >= 60)
    )) return false;
    if (filters.engagement && filters.engagement !== 'all' && lead.engagement !== filters.engagement) return false;
    if (filters.search && !lead.company.toLowerCase().includes(filters.search.toLowerCase()) && 
        !lead.contact.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    if (selectedLeads.length === 0) {
      setSelectAll(false);
    } else if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedLeads, filteredLeads]);

  const renderLoadingCards = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-64 mb-2" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
            <Skeleton className="h-16 w-full mb-4 rounded-lg" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 mb-6">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between">
        <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {filters.status === 'qualified' ? 'Qualified Leads' : 
           filters.status === 'unqualified' ? 'Unqualified Leads' : 
           'All Leads'}
        </h1>
        <p className="text-gray-600 text-sm">
          {filters.status === 'qualified' ? 'High-potential leads ready for offer creation and contract initiation' :
           filters.status === 'unqualified' ? 'Leads requiring nurturing, re-engagement, or future follow-up' :
           'Comprehensive lead management with status tracking and AI suggestions'}
        </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50" onClick={fetchLeads}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50" onClick={() => onNavigate('email-campaigns')}>
            <Mail className="h-4 w-4 mr-2" />
            Email Campaign
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowNewLeadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Metrics Cards Section - Moved to top */}
      <div className="mb-6">
        <div className="flex items-center justify-end  mb-4">

        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {loading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-8 w-12 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="w-10 h-10 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              {/* Dynamic cards based on status filter */}
              {filters.status === 'unqualified' ? (
                // Unqualified Leads View
                <>
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Unqualified Leads</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {filteredLeads.filter(lead => lead.status === 'unqualified').length}
                          </p>
                          <p className="text-xs text-gray-500">Requiring nurturing</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                          <UserX className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Future Potential</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'unqualified');
                              const highScoreLeads = unqualifiedLeads.filter(lead => lead.score >= 60);
                              return unqualifiedLeads.length > 0 ? `${Math.round((highScoreLeads.length / unqualifiedLeads.length) * 100)}%` : '0%';
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">May qualify in 6-12 months</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Avg Score</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'unqualified');
                              if (unqualifiedLeads.length === 0) return '0';
                              const avgScore = unqualifiedLeads.reduce((sum, lead) => sum + lead.score, 0) / unqualifiedLeads.length;
                              return Math.round(avgScore);
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">Below qualification threshold</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                          <Target className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Re-engagement</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'unqualified');
                              const recentlyContacted = unqualifiedLeads.filter(lead => {
                                const lastContact = new Date(lead.lastContact);
                                const monthsAgo = (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24 * 30);
                                return monthsAgo <= 3;
                              });
                              return unqualifiedLeads.length > 0 ? `${Math.round((recentlyContacted.length / unqualifiedLeads.length) * 100)}%` : '0%';
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">Re-qualification success rate</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <RefreshCw className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Default View (All Leads, Qualified, etc.)
                <>
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Qualified Leads</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {filteredLeads.filter(lead => lead.status === 'qualified').length}
                          </p>
                          <p className="text-xs text-gray-500">High-potential prospects</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Contract Ready</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {filteredLeads.filter(lead => lead.status === 'qualified' && lead.contractReady).length}
                          </p>
                          <p className="text-xs text-gray-500">Ready for contract initiation</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Avg Deal Size</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const relevantLeads = filters.status === 'qualified' ? 
                                filteredLeads.filter(lead => lead.status === 'qualified') :
                                filteredLeads.filter(lead => lead.status === 'qualified');
                              if (relevantLeads.length === 0) return '$0K';
                              const avgValue = relevantLeads.reduce((sum, lead) => {
                                const value = parseInt(lead.travelBudget.replace(/[^0-9]/g, '')) || 0;
                                return sum + value;
                              }, 0) / relevantLeads.length;
                              return `$${Math.round(avgValue)}K`;
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">Average qualified deal value</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                          <DollarSign className="h-5 w-5 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const totalLeads = filteredLeads.length;
                              const qualifiedLeads = filteredLeads.filter(lead => lead.status === 'qualified').length;
                              return totalLeads > 0 ? `${Math.round((qualifiedLeads / totalLeads) * 100)}%` : '0%';
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">Qualified to contact rate</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lead Filters */}
      <Card className="mb-6 bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-5 justify-between">
            <div className="flex items-center gap-2 ">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 ">Lead Filters</span>
            </div>            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600 border-gray-300"
              onClick={() => setFilters({ status: 'all', industry: 'all', score: 'all', engagement: 'all', search: '' })}
            >
              Clear Filters
            </Button>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Company or contact..."
                  className="pl-10 text-sm border-gray-200"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="text-sm border-gray-200">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Industry</Label>
              <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                <SelectTrigger className="text-sm border-gray-200">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Financial Services">Financial Services</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Score</Label>
              <Select value={filters.score} onValueChange={(value) => setFilters({...filters, score: value})}>
                <SelectTrigger className="text-sm border-gray-200">
                  <SelectValue placeholder="All scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All scores</SelectItem>
                  <SelectItem value="high">High (80+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79)</SelectItem>
                  <SelectItem value="low">Low (&lt;60)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Engagement</Label>
              <Select value={filters.engagement} onValueChange={(value) => setFilters({...filters, engagement: value})}>
                <SelectTrigger className="text-sm border-gray-200">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Leads Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">All Leads ({filteredLeads.length} results)</h2>
          <p className="text-sm text-gray-600">Comprehensive lead management with status tracking and AI suggestions</p>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Select All</span>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
          <Card key={lead.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Lead Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{lead.company}</h3>
                      <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeStyle(lead.status)}`}>
                        {lead.status === 'qualified' ? 'Qualified' : 
                         lead.status === 'contacted' ? 'Contacted' :
                         lead.status === 'in-progress' ? 'In Progress' :
                         lead.status === 'responded' ? 'Responded' :
                         lead.status === 'unqualified' ? 'Unqualified' :
                         lead.status === 'new' ? 'New' :
                         lead.status}
                      </Badge>
                      {lead.decisionMaker && (
                        <Badge className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border-green-200">
                          🏆 Decision Maker
                        </Badge>
                      )}
                      {lead.status === 'qualified' && lead.contractReady && (
                        <Badge className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border-green-200">
                          🤝 Contract Ready
                        </Badge>
                      )}
                      {lead.nextAction === 'Move to contract' && (
                        <Badge className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 border-red-200">
                          ⚠️ Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{lead.contact} • {lead.title}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {lead.location}
                      </span>
                      <a 
                        href={lead.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Website
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold mb-1 ${getScoreColor(lead.score)}`}>
                    Score: {lead.score}
                  </div>
                  <div className="text-sm font-medium text-green-600 mb-1">
                    {lead.travelBudget} budget
                  </div>
                  <Badge className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeStyle(lead.urgency)}`}>
                    {lead.urgency} urgency
                  </Badge>
                </div>
              </div>

              {/* Next Action Alert */}
              {lead.nextAction === 'Move to contract' && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <ArrowRight className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Next Action: {lead.nextAction}</strong>
                        <div className="text-sm mt-1">Lead is qualified and ready for contract negotiation.</div>
                      </div>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Lead Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Industry:</span> {lead.industry}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Company Size:</span> {typeof lead.employees === 'number' ? lead.employees.toLocaleString() : lead.employees} employees
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Revenue:</span> {lead.revenue}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Source:</span> {lead.source}
                  </div>
                  {lead.assignedAgent && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Assigned Agent:</span> {lead.assignedAgent}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Last Contact:</span> {lead.lastContact}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Follow-up Date:</span> {lead.followUpDate}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Engagement:</span> 
                    <span className={`ml-1 ${lead.engagement === 'High' ? 'text-green-600' : lead.engagement === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {lead.engagement}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {lead.industry && (
                      <Badge variant="outline" className="text-xs">
                        {lead.industry}
                      </Badge>
                    )}
                    {lead.decisionMaker && (
                      <Badge variant="outline" className="text-xs">
                        High-Value
                      </Badge>
                    )}
                    {lead.status === 'qualified' && (
                      <Badge variant="outline" className="text-xs">
                        Decision Maker
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>AI Suggestion:</strong> {lead.status === 'qualified' ? 'Schedule product demo within 3 days. High conversion probability.' : 'Send detailed cost comparison proposal. Mention case studies.'}
                </AlertDescription>
              </Alert>

              {/* Notes Section */}
              {(lead.notes || (lead.leadNotes && lead.leadNotes.length > 0)) && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Collapsible 
                    open={expandedNotes[lead.id] || false} 
                    onOpenChange={() => toggleNotesExpansion(lead.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-0 font-semibold text-gray-800 hover:bg-transparent flex items-center gap-1"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Notes & Updates
                          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${expandedNotes[lead.id] ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      {lead.leadNotes && lead.leadNotes.length > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          {lead.leadNotes.length} note{lead.leadNotes.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <CollapsibleContent className="space-y-2">
                      {/* Original notes */}
                      {lead.notes && (
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Original Notes:</strong> {lead.notes.split(' | ')[0]}
                        </div>
                      )}

                      {/* Recent lead notes */}
                      {lead.leadNotes && lead.leadNotes.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-600">Recent Activity:</div>
                          {(expandedNotes[lead.id] ? lead.leadNotes : lead.leadNotes.slice(0, 2)).map((note: any, index: number) => (
                            <div key={note.id || index} className="text-sm bg-white p-2 rounded border-l-2 border-blue-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">
                                  {new Date(note.created_at).toLocaleDateString()} • {note.created_by?.username || 'User'}
                                </span>
                                {note.urgency && note.urgency !== 'Medium' && (
                                  <Badge className={`text-xs px-1 py-0 ${getUrgencyBadgeStyle(note.urgency)}`}>
                                    {note.urgency}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-700">{note.note}</p>
                              {note.next_action && (
                                <p className="text-xs text-blue-600 mt-1">
                                  <strong>Next:</strong> {note.next_action}
                                </p>
                              )}
                            </div>
                          ))}
                          {!expandedNotes[lead.id] && lead.leadNotes.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{lead.leadNotes.length - 2} more note{lead.leadNotes.length - 2 !== 1 ? 's' : ''} (click to expand)
                            </div>
                          )}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => handleContactLead(lead)}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-gray-700 border-gray-300"
                    onClick={() => handleAddNote(lead)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                    <Megaphone className="h-4 w-4 mr-1" />
                    Campaign
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-gray-700 border-gray-300"
                    onClick={() => handleShowHistory(lead)}
                  >
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm" variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                    <User className="h-4 w-4 mr-1" />
                    Reassign
                  </Button>
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                    <Activity className="h-4 w-4 mr-1" />
                    Actions
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                  {lead.status === 'qualified' && (
                    <Button size="sm" variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                      <Gift className="h-4 w-4 mr-1" />
                      Create Offer
                    </Button>
                  )}
                  {lead.status === 'qualified' && (
                    <Button size="sm" variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      <TrendingUpIcon className="h-4 w-4 mr-1" />
                      Move to Opportunity
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {lead.status !== 'qualified' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-700 border-green-300 hover:bg-green-50"
                      onClick={() => handleQualifyLead(lead.id)}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Qualify
                    </Button>
                  )}
                  {lead.status !== 'unqualified' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-700 border-red-300 hover:bg-red-50"
                      onClick={() => handleDisqualifyLead(lead)}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Disqualify
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-gray-700 border-gray-300">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

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
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Lead Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              Contact {selectedLeadForContact?.company}
            </DialogTitle>
            <DialogDescription>
              Send a personalized message to {selectedLeadForContact?.contact}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Contact Method</Label>
              <Select 
                value={contactForm.method} 
                onValueChange={(value) => setContactForm({...contactForm, method: value})}
              >
                <SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="In-Person Meeting">In-Person Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Subject</Label>
              <Input
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                placeholder="Enter subject line..."
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Message</Label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                placeholder="Enter your message..."
                className="min-h-[200px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                rows={10}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Follow-up Date</Label>
              <Input
                type="date"
                value={contactForm.followUpDate}
                onChange={(e) => setContactForm({...contactForm, followUpDate: e.target.value})}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowContactDialog(false);
                setSelectedLeadForContact(null);
                setContactForm({
                  method: 'Email',
                  subject: '',
                  message: '',
                  followUpDate: ''
                });
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!contactForm.subject || !contactForm.message}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Add Note for {selectedLeadForNote?.company}
            </DialogTitle>
            <DialogDescription>
              Update lead information and next actions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Note</Label>
              <Textarea
                value={noteForm.note}
                onChange={(e) => setNoteForm({...noteForm, note: e.target.value})}
                placeholder="Add your notes..."
                className="min-h-[120px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                rows={5}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Next Action</Label>
              <Input
                value={noteForm.nextAction}
                onChange={(e) => setNoteForm({...noteForm, nextAction: e.target.value})}
                placeholder="Contract negotiation"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Urgency</Label>
              <Select 
                value={noteForm.urgency} 
                onValueChange={(value) => setNoteForm({...noteForm, urgency: value})}
              >
                <SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddNoteDialog(false);
                setSelectedLeadForNote(null);
                setNoteForm({
                  note: '',
                  nextAction: '',
                  urgency: 'Medium'
                });
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNote}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!noteForm.note.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-gray-600" />
              Lead History - {selectedLeadForHistory?.company}
            </DialogTitle>
            <DialogDescription>
              Complete activity history for {selectedLeadForHistory?.contact} at {selectedLeadForHistory?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedLeadForHistory?.history_entries?.length > 0 ? (
              selectedLeadForHistory.history_entries.map((entry: any) => {
                const transformedEntry = transformHistoryEntry(entry);
                return (
                  <div key={transformedEntry.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getHistoryIcon(transformedEntry.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 uppercase font-medium">
                            {transformedEntry.type.replace('_', ' ')}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {transformedEntry.action}
                          </h4>
                          {transformedEntry.metadata?.urgency && transformedEntry.metadata.urgency !== 'Medium' && (
                            <Badge className={`text-xs px-1 py-0 ${getUrgencyBadgeStyle(transformedEntry.metadata.urgency)}`}>
                              {transformedEntry.metadata.urgency}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(transformedEntry.timestamp), 'MM/dd/yyyy \'at\' HH:mm:ss')}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">
                        {transformedEntry.details}
                      </p>

                      {transformedEntry.metadata?.next_action && (
                        <p className="text-xs text-blue-600 mb-2">
                          <strong>Next Action:</strong> {transformedEntry.metadata.next_action}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>by {transformedEntry.user}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Available</h3>
                <p className="text-gray-600">No activity history found for this lead.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={() => {
                setShowHistoryDialog(false);
                setSelectedLeadForHistory(null);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disqualify Lead Dialog */}
      <Dialog open={showDisqualifyDialog} onOpenChange={setShowDisqualifyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <UserX className="h-5 w-5" />
              Disqualify Lead
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for disqualifying {selectedLeadForDisqualify?.company}. This action will remove the lead from your active list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="disqualifyReason" className="text-sm font-medium text-gray-700">
                Reason for disqualify
              </Label>
              <Textarea
                id="disqualifyReason"
                value={disqualifyReason}
                onChange={(e) => setDisqualifyReason(e.target.value)}
                placeholder="Enter the reason for disqualifying this lead (optional)..."
                className="mt-1 min-h-[120px] resize-none border-gray-300 focus:border-red-500 focus:ring-red-500"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDisqualifyDialog(false);
                setSelectedLeadForDisqualify(null);
                setDisqualifyReason('');
              }}
              className="text-gray-600 border-gray-300"
            >
              Skip
            </Button>
            <Button 
              onClick={handleConfirmDisqualify}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}