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
  Eye,
  Handshake, // Added for contract_signed
  Award,    // Added for deal_won
} from 'lucide-react';
import { toast } from "sonner";
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

interface LeadsListProps {
  initialFilters?: any;
  onNavigate: (screen: string, filters?: any) => void;
}

// Interface for History Entry (as expected from API)
interface HistoryEntry {
  id: string | number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  author: { username: string }; // Assuming author structure from API
}

// Interface for Lead (simplified for context)
interface Lead {
  id: number;
  company: string;
  contact: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  employees: number | string;
  revenue: string;
  location: string;
  status: string;
  score: number;
  source: string;
  lastContact: string;
  nextAction: string;
  notes: string;
  leadNotes: any[];
  engagement: string;
  travelBudget: string;
  decisionMaker: boolean;
  urgency: string;
  aiSuggestion: string;
  tags: string[];
  contractReady: boolean;
  lastActivity: string;
  followUpDate: string;
  assignedAgent: string | null;
  history_entries: HistoryEntry[]; // This will be populated from API calls
}

// Helper function to transform API history entry to a consistent format
const transformHistoryEntry = (entry: any) => {
  // Mapping from API's activity_type to our internal display type and icon
  const typeMap: { [key: string]: { display: string, icon: string } } = {
    'lead_created': { display: 'Lead Created', icon: 'plus' },
    'note_added': { display: 'Note Added', icon: 'message-square' },
    'phone_call': { display: 'Phone Call', icon: 'phone' },
    'meeting_scheduled': { display: 'Meeting Scheduled', icon: 'calendar' },
    'lead_qualified': { display: 'Lead Qualified', icon: 'check-circle' },
    'lead_disqualified': { display: 'Lead Disqualified', icon: 'x-circle' },
    'email_sent': { display: 'Email Sent', icon: 'mail' },
    'lead_responded': { display: 'Lead Responded', icon: 'message-circle' },
    'status_change': { display: 'Status Change', icon: 'refresh-cw' },
    'score_updated': { display: 'Score Updated', icon: 'trending-up' },
    'lead_assigned': { display: 'Lead Assigned', icon: 'user' },
    'proposal_sent': { display: 'Proposal Sent', icon: 'briefcase' },
    'contract_signed': { display: 'Contract Signed', icon: 'handshake' },
    'deal_won': { display: 'Deal Won', icon: 'award' },
    'discovery_call_scheduled': { display: 'Discovery Call Scheduled', icon: 'phone' },
    'custom': { display: 'Custom Activity', icon: 'activity' }, // For generic or unmapped types
  };

  return {
    id: entry.id,
    type: typeMap[entry.activity_type] ? typeMap[entry.activity_type].display : entry.activity_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), // Display type
    action: entry.title || typeMap[entry.activity_type]?.display || 'Unknown Action', // Title or mapped display
    user: entry.created_by?.username || 'Unknown User',
    timestamp: entry.created_at,
    details: entry.description,
    icon: typeMap[entry.activity_type] ? typeMap[entry.activity_type].icon : 'activity' // Default to 'activity'
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
    company: apiLead.company_name || 'Unknown Company',
    contact: `${apiLead.contact_first_name || ''} ${apiLead.contact_last_name || ''}`.trim() || 'Unknown Contact',
    title: apiLead.contact_position || 'Unknown Position',
    email: apiLead.contact_email || 'unknown@email.com',
    phone: apiLead.contact_phone || 'N/A',
    website: apiLead.company_website || `https://wwwwww. ${(apiLead.company_name || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
    industry: apiLead.company_industry || 'Unknown',
    employees: apiLead.company?.size || 0,
    revenue: apiLead.company?.annual_revenue ? `$${Math.floor(apiLead.company.annual_revenue / 1000)}K` : '$0K',
    location: apiLead.company?.location || 'Unknown Location',
    status: apiLead.status || 'new',
    score: apiLead.score || 50,
    source: apiLead.source || 'Unknown',
    lastContact: apiLead.last_contact_at ? new Date(apiLead.last_contact_at).toISOString().split('T')[0] : apiLead.created_at ? new Date(apiLead.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    nextAction: apiLead.next_action || 'Follow up',
    notes: combinedNotes,
    leadNotes: apiLead.lead_notes || [], // Store all notes for display
    engagement: apiLead.score >= 80 ? 'High' : apiLead.score >= 60 ? 'Medium' : 'Low',
    travelBudget: apiLead.company?.travel_budget ? `$${Math.floor(apiLead.company.travel_budget / 1000)}K` : '$0K',
    decisionMaker: apiLead.contact?.is_decision_maker || Math.random() > 0.5,
    urgency: apiLead.priority || 'Medium', // Assuming 'priority' field maps to urgency
    aiSuggestion: `AI Score: ${apiLead.score}. ${apiLead.score >= 80 ? 'High priority lead - contact immediately' : apiLead.score >= 60 ? 'Medium priority - follow up within 2 days' : 'Low priority - add to nurture campaign'}`,
    tags: [apiLead.company?.industry || 'General', apiLead.status || 'New'],
    contractReady: apiLead.status === 'qualified',
    lastActivity: apiLead.updated_at ? new Date(apiLead.updated_at).toISOString().split('T')[0] : apiLead.created_at ? new Date(apiLead.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    followUpDate: apiLead.next_action_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedAgent: apiLead.assigned_to?.username || null,
    // History will be fetched separately via API and mapped in the dialog
    history_entries: [] // This will be populated via getHistory API call
  };
};

// This function is now primarily for reference if needed, but history is fetched from API
// It's kept here as a fallback or for understanding the original logic.
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
  const [selectedLead, setSelectedLead] = useState<any>(null); // State for the lead selected in other dialogs
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false); // Changed from showNewLeadDialog
  const [showDisqualifyDialog, setShowDisqualifyDialog] = useState(false);
  const [selectedLeadForDisqualify, setSelectedLeadForDisqualify] = useState<any>(null);
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
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
  const [leadHistory, setLeadHistory] = useState<{ [key: number]: HistoryEntry[] }>({}); // Stores history entries fetched from API
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Loading state for history fetch
  const [filters, setFilters] = useState({
    status: initialFilters?.status || 'all',
    industry: 'all',
    score: 'all',
    engagement: 'all',
    search: ''
  });

  const [newCompanyForm, setNewCompanyForm] = useState({ // Changed from newLeadForm
    name: '',
    industry: '',
    location: '',
    employees: '',
    revenue: '',
    website: '',
    phone: '',
    email: '',
    travelBudget: '',
    companyType: '', // Added for company
    description: '', // Added for company
    establishedYear: '', // Added for company
    specialties: [] as string[], // Added for company
    operatingRegions: [] as string[] // Added for company
  });

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true);

      // Apply current filters when fetching
      const filterParams = {
        search: filters.search || '',
        status: filters.status !== 'all' ? filters.status : '',
        industry: filters.industry !== 'all' ? filters.industry : '',
        score: filters.score !== 'all' ? filters.score : '',
        engagement: filters.engagement !== 'all' ? filters.engagement : ''
      };

      console.log('Fetching leads with filters:', filterParams);
      const apiResponse = await leadApi.getLeads(filterParams);
      console.log('Raw API response:', apiResponse);

      // Handle different response formats
      let apiLeads = [];
      if (Array.isArray(apiResponse)) {
        apiLeads = apiResponse;
      } else if (apiResponse && Array.isArray(apiResponse.results)) {
        apiLeads = apiResponse.results;
      } else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
        apiLeads = apiResponse.data;
      } else {
        console.warn('Unexpected API response format:', apiResponse);
        apiLeads = [];
      }

      console.log('Processed leads array:', apiLeads);

      // Transform leads - history_entries are not included here as they are fetched on demand
      const transformedLeads = apiLeads.map((apiLead: any) => {
        console.log('Transforming lead:', apiLead);
        return transformApiLeadToUILead(apiLead);
      });

      console.log('Final transformed leads:', transformedLeads);
      setLeads(transformedLeads);

    } catch (error) {
      console.error('Error fetching leads:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to fetch leads from server');
      // Set empty array on error to avoid showing static data
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch leads on component mount
    fetchLeads();
  }, []); // Empty dependency array for initial mount

  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }));

      if (initialFilters.newLead) {
        // Logic to handle a new lead created from an external source (like a form submission)
        // This part assumes the lead data is already structured.
        const newLead = {
          id: Math.max(...leads.map(l => l.id), 0) + 1, // Ensure ID is unique, fallback to 0 if leads is empty
          company: initialFilters.newLead.company,
          contact: initialFilters.newLead.contact || 'Contact Name',
          title: initialFilters.newLead.title || 'Decision Maker',
          email: initialFilters.newLead.email,
          phone: initialFilters.newLead.phone,
          website: initialFilters.newLead.website || `https://wwwwww.${initialFilters.newLead.company.toLowerCase().replace(/\s+/g, '')}.com`,
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
          engagement: 'Low', // Default engagement
          travelBudget: initialFilters.newLead.travelBudget,
          decisionMaker: initialFilters.newLead.decisionMaker || true,
          urgency: 'Medium',
          aiSuggestion: `High-potential lead from corporate search. AI Score: ${initialFilters.newLead.aiScore || 75}. Recommend immediate outreach and qualification.`,
          tags: initialFilters.newLead.tags || ['Corporate Search', 'New Lead'],
          contractReady: false,
          lastActivity: new Date().toISOString().split('T')[0],
          followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          history_entries: [] // Will be fetched if needed, or use the provided notes as initial history
        };

        // For initial display, we can add a placeholder history entry from the notes
        if (initialFilters.newLead.notes) {
          newLead.history_entries.push({
            id: Date.now(), // Temporary ID
            type: 'note',
            title: 'Initial Notes',
            description: initialFilters.newLead.notes,
            timestamp: new Date().toISOString(),
            author: { username: 'System' }
          });
        }

        setLeads(prev => [newLead, ...prev]);
        setSuccessMessage(initialFilters.message || `${initialFilters.newLead.company} has been successfully added as a lead`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    }
  }, [initialFilters, leads]); // Dependency array includes initialFilters and leads for newLead logic

  // Refetch data when filters change (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loading) { // Don't refetch if already loading
        fetchLeads();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.status, filters.industry, filters.score, filters.engagement]);

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

  const handleSelectLead = (leadId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
      setSelectAll(true);
    } else {
      setSelectedLeads([]);
      setSelectAll(false);
    }
  };

  // Function to create a new lead via API
  const handleCreateNewLead = async () => {
    try {
      if (!newCompanyForm.name || !newCompanyForm.email || !newCompanyForm.industry) { // Adjusted to use newCompanyForm fields
        toast.error('Please fill in all required fields (Company Name, Email, and Industry)');
        return;
      }

      const leadData = {
        company: {
          name: newCompanyForm.name,
          industry: newCompanyForm.industry,
          location: newCompanyForm.location || '',
          size: newCompanyForm.employees ? 'medium' : 'startup', // Simplified size mapping
          annual_revenue: newCompanyForm.revenue ? parseFloat(newCompanyForm.revenue.replace(/[^0-9.]/g, '')) : null,
          travel_budget: newCompanyForm.travelBudget ? parseFloat(newCompanyForm.travelBudget.replace(/[^0-9.]/g, '')) : null,
          website: newCompanyForm.website || null,
          company_type: newCompanyForm.companyType || null, // Added company type
          description: newCompanyForm.description || null, // Added description
          established_year: newCompanyForm.establishedYear ? parseInt(newCompanyForm.establishedYear) : null, // Added established year
          specialties: newCompanyForm.specialties, // Added specialties
          operating_regions: newCompanyForm.operatingRegions // Added operating regions
        },
        contact: {
          first_name: newCompanyForm.name.split(' ')[0] || newCompanyForm.name, // Use company name as a fallback for contact first name
          last_name: newCompanyForm.name.split(' ').slice(1).join(' ') || '',
          email: newCompanyForm.email,
          phone: newCompanyForm.phone || '',
          position: 'N/A', // Placeholder as this is for company
          is_decision_maker: false // Default to false for company
        },
        status: 'new', // Default status for a new company
        source: 'Direct', // Default source for a new company
        priority: 'medium', // Default priority/urgency
        score: 50, // Default score
        estimated_value: newCompanyForm.travelBudget ? parseFloat(newCompanyForm.travelBudget.replace(/[^0-9.]/g, '')) : null,
        notes: newCompanyForm.description || '', // Use description as initial notes
        next_action: 'Initial outreach',
        next_action_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      console.log('Creating company with data:', leadData);

      // Assuming createLead API can also handle company creation or a new endpoint exists
      const createdLead = await leadApi.createLead(leadData); // This might need to be a new API call like createCompany

      console.log('Company created successfully:', createdLead);

      await fetchLeads(); // Refresh leads list to show the new company

      setShowNewCompanyDialog(false); // Changed from setShowNewLeadDialog
      setSuccessMessage(`New company "${newCompanyForm.name}" has been created successfully!`);
      setTimeout(() => setSuccessMessage(''), 5000);

      // Reset form
      setNewCompanyForm({ // Resetting newCompanyForm
        name: '',
        industry: '',
        location: '',
        employees: '',
        revenue: '',
        website: '',
        phone: '',
        email: '',
        travelBudget: '',
        companyType: '',
        description: '',
        establishedYear: '',
        specialties: [],
        operatingRegions: []
      });

      toast.success('Company added successfully!');

    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to create company. Please try again.');
    }
  };

  // Function to qualify a lead via API
  const handleQualifyLead = async (leadId: number) => {
    try {
      await leadApi.qualifyLead(leadId, { reason: 'Lead meets all qualification criteria' });

      // Update the local state
      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, status: 'qualified' } : l
      ));

      // Clear history for this lead to force refresh
      setLeadHistory(prev => ({
        ...prev,
        [leadId]: []
      }));

      toast.success('Lead qualified successfully');
    } catch (error) {
      console.error('Error qualifying lead:', error);
      toast.error('Failed to qualify lead');
    }
  };

  // Function to open dialog for disqualifying a lead
  const handleDisqualifyLead = (lead: any) => {
    setSelectedLeadForDisqualify(lead);
    setShowDisqualifyDialog(true);
    setDisqualifyReason('');
  };

  // Function to confirm disqualification via API
  const handleConfirmDisqualify = async () => {
    if (!selectedLeadForDisqualify) return;

    try {
      await leadApi.disqualifyLead(selectedLeadForDisqualify.id, disqualifyReason);

      // Update the local state
      setLeads(prev => prev.map(l => 
        l.id === selectedLeadForDisqualify.id ? { ...l, status: 'unqualified', notes: `${l.notes}\n\nDisqualified: ${disqualifyReason}` } : l
      ));

      // Clear history for this lead to force refresh
      setLeadHistory(prev => ({
        ...prev,
        [selectedLeadForDisqualify.id]: []
      }));

      toast.success('Lead disqualified successfully');

      // Close dialog and reset state
      setShowDisqualifyDialog(false);
      setSelectedLeadForDisqualify(null);
      setDisqualifyReason('');
    } catch (error) {
      console.error('Error disqualifying lead:', error);
      toast.error('Failed to disqualify lead. Please try again.');
    }
  };

  // Function to open dialog for contacting a lead
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
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    });
    setShowContactDialog(true);
  };

  // Function to send message (and create history entry) via API
  const handleSendMessage = async () => {
    if (!selectedLeadForContact || !contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // This API call should ideally create the message and a history entry
      await leadApi.sendMessage(selectedLeadForContact.id, {
        method: contactForm.method,
        subject: contactForm.subject,
        message: contactForm.message,
        followUpDate: contactForm.followUpDate
      });

      // Refresh leads list to show updated status (e.g., contacted) and history
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

  // Function to open dialog for adding a note
  const handleAddNote = (lead: any) => {
    setSelectedLeadForNote(lead);
    setNoteForm({
      note: '',
      nextAction: lead.nextAction || '',
      urgency: lead.urgency || 'Medium'
    });
    setShowAddNoteDialog(true);
  };

  // Function to open dialog for viewing lead history
  // This function is now correctly named and integrated with the modal state
  const handleHistoryClick = async (lead: Lead) => {
    setSelectedLeadForHistory(lead);
    setIsHistoryModalOpen(true); // Use the state to control modal visibility

    // Always fetch fresh history data
    setIsLoadingHistory(true);
    try {
      const history = await leadApi.getHistory(lead.id);
      console.log('Fetched history:', history);

      // Transform API response to internal format
      const transformedHistory = history.map((item: any) => ({
        id: item.id,
        type: item.history_type, // Use the type from the API response
        action: item.action,     // Use the action from the API response
        user: item.user_name || 'System', // Use user_name if available, else fallback
        timestamp: item.timestamp,
        details: item.details,
        icon: item.icon || 'plus' // Use icon from API, or 'plus' as default
      }));

      setLeadHistory(prev => ({
        ...prev,
        [lead.id]: transformedHistory
      }));
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history for this lead.');
      // Ensure that if an error occurs, the history for this lead is an empty array
      setLeadHistory(prev => ({
        ...prev,
        [lead.id]: []
      }));
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Function to save a note via API
  const handleSaveNote = async () => {
    if (!selectedLeadForNote || !noteForm.note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      setIsSavingNote(true);
      // Call API to add note, which should also create a history entry
      await leadApi.addNote(selectedLeadForNote.id, { 
        note: noteForm.note,
        next_action: noteForm.nextAction,
        urgency: noteForm.urgency,
        created_by: 'Current User' // This should ideally be handled by backend based on auth
      });

      // Refresh the leads list to get the latest data including the new note
      await fetchLeads();

      // Clear history cache for this lead to force a fresh fetch on next view
      setLeadHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[selectedLeadForNote.id];
        return newHistory;
      });

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
    } finally {
      setIsSavingNote(false);
    }
  };

  // Function to move qualified lead to opportunities
  const handleMoveToOpportunity = async (lead: Lead) => {
    try {
      // Prepare opportunity data from lead
      const opportunityData = {
        name: `${lead.company} - Corporate Travel Solution`,
        stage: 'proposal',
        probability: 65,
        dealValue: parseInt(lead.travelBudget.replace(/[^0-9]/g, '')) * 1000 || 250000, // Convert from K to actual value
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        notes: `Opportunity created from qualified lead. ${lead.notes}`,
        nextAction: 'Send initial proposal and schedule presentation'
      };

      // Call the API to move the lead to opportunity
      const response = await leadApi.moveToOpportunity(lead.id, opportunityData);

      // Remove the lead from the leads list locally
      setLeads(prev => prev.filter(l => l.id !== lead.id));

      // Show success message
      setSuccessMessage(response.message || `${lead.company} has been successfully moved to opportunities!`);
      setTimeout(() => setSuccessMessage(''), 5000);

      // Navigate to opportunities page with the new opportunity data
      if (onNavigate) {
        onNavigate('opportunities', { 
          newOpportunity: {
            ...response.opportunity,
            leadId: response.lead_id,
            company: lead.company,
            contact: lead.contact,
            title: lead.title,
            email: lead.email,
            phone: lead.phone,
            industry: lead.industry,
            employees: typeof lead.employees === 'number' ? lead.employees : parseInt(lead.employees as string) || 0,
            revenue: lead.revenue,
            location: lead.location,
            source: lead.source,
            travelBudget: lead.travelBudget,
            decisionMaker: lead.decisionMaker,
            tags: lead.tags || [lead.industry, 'Qualified Lead'],
            owner: lead.assignedAgent || 'Current User'
          },
          message: response.message || `${lead.company} has been converted to a sales opportunity`
        });
      }

      toast.success(`${lead.company} moved to opportunities successfully!`);

    } catch (error) {
      console.error('Error moving lead to opportunity:', error);
      toast.error('Failed to move lead to opportunities. Please try again.');
    }
  };

  // Filter leads based on current filter settings
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

  // Effect to update selectAll checkbox state based on filtered leads selection
  useEffect(() => {
    if (selectedLeads.length === 0) {
      setSelectAll(false);
    } else if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false); // Partially selected
    }
  }, [selectedLeads, filteredLeads]);

  // Render spinner loader while loading
  const renderSpinnerLoader = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading leads...</p>
        <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your data</p>
      </div>
    </div>
  );

  // Error state if API call fails
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
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowNewCompanyDialog(true)}> {/* Changed to showNewCompanyDialog */}
            <Plus className="h-4 w-4 mr-2" />
            Add New Company {/* Changed button text */}
          </Button>
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

      {/* Metrics Cards Section - Moved to top */}
      <div className="mb-6">
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
                              const relevantLeads = filteredLeads.filter(lead => lead.status === 'qualified'); // Consider only qualified leads for deal size
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
                              const totalLeads = leads.length; // Use total leads for overall conversion
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


      {/* Bulk Actions Bar - Shows when leads are selected */}
      {selectedLeads.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
                <span className="text-white font-medium text-sm">{selectedLeads.length}</span>
              </div>
              <span className="text-orange-800 font-medium">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
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
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Start Campaign
              </Button>

              <Button 
                size="sm"
                variant="outline" 
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  if (selectedLeads.length === 0) {
                    toast.error('Please select leads first');
                    return;
                  }
                  toast.success(`${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''} assigned to agent`);
                  setSelectedLeads([]);
                  setSelectAll(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Assign Agent
              </Button>

              <Button 
                size="sm"
                variant="outline" 
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setSelectedLeads([]);
                  setSelectAll(false);
                  toast.success('Selection cleared');
                }}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Showing Leads ({filteredLeads.length} results)</h2>
          <p className="text-sm text-gray-600">Comprehensive lead management with status tracking and AI suggestions</p>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={selectAll}
            onCheckedChange={(checked) => handleSelectAll(checked)}
            className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Select All</span>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        renderSpinnerLoader()
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
                    onClick={() => handleHistoryClick(lead)} // Use the updated handler
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                      onClick={() => handleMoveToOpportunity(lead)}
                    >
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

      {/* Add New Company Dialog */} {/* Changed dialog title and description */}
      <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle> {/* Changed title */}
            <DialogDescription>Create a new company with comprehensive information</DialogDescription> {/* Changed description */}
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-[5px]">
                <Label>Company Name *</Label>
                <Input
                  value={newCompanyForm.name} // Changed from newLeadForm.company
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, name: e.target.value})} // Changed from newLeadForm
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-[5px]">
                <Label>Industry *</Label>
                <Select value={newCompanyForm.industry} onValueChange={(value) => setNewCompanyForm({...newCompanyForm, industry: value})}>
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
              <div className="space-y-[5px]">
                <Label>Website</Label>
                <Input
                  value={newCompanyForm.website} // Changed from newLeadForm.website
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, website: e.target.value})} // Changed from newLeadForm
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-[5px]">
                <Label>Company Type</Label>
                <Select value={newCompanyForm.companyType} onValueChange={(value) => setNewCompanyForm({...newCompanyForm, companyType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Startup">Startup</SelectItem>
                    <SelectItem value="SME">SME</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Non-profit">Non-profit</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={newCompanyForm.location} // Changed from newLeadForm.location
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, location: e.target.value})} // Changed from newLeadForm
                  placeholder="City, State/Country"
                />
              </div>
              <div>
                <Label>Company Size (Employees)</Label>
                <Input
                  type="number"
                  value={newCompanyForm.employees} // Changed from newLeadForm.employees
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, employees: e.target.value})} // Changed from newLeadForm
                  placeholder="Number of employees"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Annual Revenue</Label>
                <Input
                  value={newCompanyForm.revenue} // Changed from newLeadForm.revenue
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, revenue: e.target.value})} // Changed from newLeadForm
                  placeholder="e.g., $50M, $2.5B"
                />
              </div>
              <div>
                <Label>Estimated Travel Budget</Label>
                <Input
                  value={newCompanyForm.travelBudget} // Changed from newLeadForm.travelBudget
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, travelBudget: e.target.value})} // Changed from newLeadForm
                  placeholder="e.g., $250K, $1.2M"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Established Year</Label>
                <Input
                  type="number"
                  value={newCompanyForm.establishedYear} // Changed from newLeadForm.establishedYear
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, establishedYear: e.target.value})} // Changed from newLeadForm
                  placeholder="e.g., 1998"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={newCompanyForm.phone} // Changed from newLeadForm.phone
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, phone: e.target.value})} // Changed from newLeadForm
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={newCompanyForm.email} // Changed from newLeadForm.email
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, email: e.target.value})} // Changed from newLeadForm
                  placeholder="company@example.com"
                />
              </div>
            </div>
            <div>
              <Label>Specialties</Label>
              <Input
                value={newCompanyForm.specialties.join(', ')}
                onChange={(e) => setNewCompanyForm({...newCompanyForm, specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                placeholder="e.g., Cloud Computing, AI, Data Analytics"
              />
            </div>
            <div>
              <Label>Operating Regions</Label>
              <Input
                value={newCompanyForm.operatingRegions.join(', ')}
                onChange={(e) => setNewCompanyForm({...newCompanyForm, operatingRegions: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                placeholder="e.g., North America, Europe, APAC"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newCompanyForm.description} // Changed from newLeadForm.notes
                onChange={(e) => setNewCompanyForm({...newCompanyForm, description: e.target.value})} // Changed from newLeadForm
                placeholder="Brief description of the company..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCompanyDialog(false)}> {/* Changed from setShowNewLeadDialog */}
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNewLead}
              disabled={!newCompanyForm.name || !newCompanyForm.email || !newCompanyForm.industry} // Adjusted validation for new company form
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Company {/* Changed button text */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Lead Dialog - Remains the same, contact is part of the lead/company info */}
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
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
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
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading history...</p>
              </div>
            ) : (leadHistory[selectedLeadForHistory?.id || 0] || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No history available for this lead.
              </div>
            ) : (
              <div className="space-y-4">
                {(leadHistory[selectedLeadForHistory?.id || 0] || []).map((entry) => {
                  // Use the existing transformHistoryEntry if it's suitable, or adjust
                  const mappedEntry = {
                    id: entry.id,
                    type: entry.type, // Already mapped by handleHistoryClick
                    action: entry.action,
                    user: entry.user || 'Unknown User',
                    timestamp: entry.timestamp,
                    details: entry.details,
                    icon: entry.icon // Use icon from transformed data
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

                  return (
                    <div key={entry.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getHistoryIcon(mappedEntry.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 uppercase font-medium">
                              {mappedEntry.type}
                            </span>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {mappedEntry.action}
                            </h4>
                            {/* Add urgency badge if available and relevant, e.g., from note_added */}
                            {entry.urgency && entry.urgency !== 'Medium' && (
                               <Badge className={`text-xs px-1 py-0 ${getUrgencyBadgeStyle(entry.urgency)}`}>
                                {entry.urgency}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(entry.timestamp), 'MM/dd/yyyy \'at\' HH:mm:ss')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">
                          {mappedEntry.details}
                        </p>

                        {/* Display next action if available, might come from note or other activity types */}
                        {entry.next_action && (
                          <p className="text-xs text-blue-600 mb-2">
                            <strong>Next Action:</strong> {entry.next_action}
                          </p>
                        )}

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span>by {mappedEntry.user}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={() => {
                setIsHistoryModalOpen(false);
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