import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useLeadApi } from '../hooks/api/useLeadApi';
import { Users, UserCheck, UserX, Mail, Phone, Calendar, Search, Filter, Download, RefreshCw, Plus, MessageSquare, History, User, ArrowRight, Building2, DollarSign, TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target, Gift, MapPin, Briefcase, Activity, ChevronRight, Megaphone, PhoneCall, CalendarDays, Presentation, MessageCircle, ExternalLink, ChevronDown, TrendingUp as TrendingUpIcon, Eye, Handshake, // Added for contract_signed
Award, // Added for deal_won
Save // Added for Save button in dialog
 } from 'lucide-react';
import { toast } from "sonner";
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; // Added Tabs components
import { CorporateProfile } from './CorporateProfile';
// Helper function to transform API history entry to a consistent format
const transformHistoryEntry = (entry) => {
    // Mapping from API's activity_type to our internal display type and icon
    const typeMap = {
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
const transformApiLeadToUILead = (apiLead) => {
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
        company: apiLead.company.name || 'Unknown Company',
        contact: `${apiLead.full_name || ''} ${apiLead.contact.last_name || ''}`.trim() || 'Unknown Contact',
        title: apiLead.contact.position || 'Unknown Position',
        email: apiLead.contact.email || 'unknown@email.com',
        phone: apiLead.contact.phone || 'N/A',
        website: apiLead.company.website || `https://wwwwww. ${(apiLead.company.name || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
        industry: apiLead.company.industry || 'Unknown',
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
const transformCompanyDataForViewProfile = (apiLead) => {
    console.log(apiLead, "apilead for view profile");
    // Transform backend data to match frontend expectations
    return {
        id: apiLead.id,
        name: apiLead.company.name,
        type: getCompanyTypeDisplay(apiLead.company.company_type || apiLead.company.size),
        industry: getIndustryDisplay(apiLead.company.industry),
        location: apiLead.company.location,
        aiScore: Math.floor(Math.random() * 20) + 80, // Random AI score for demo
        rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
        established: apiLead.company.year_established || (apiLead.company.created_at ? new Date(apiLead.company.created_at).getFullYear() : 2020),
        employees: apiLead.company.employee_count || Math.floor(Math.random() * 5000) + 100,
        specialties: apiLead.company.specialties ? apiLead.company.specialties.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : ["Business Services", "Corporate Solutions"],
        travelBudget: apiLead.company.travel_budget ? `${(apiLead.company.travel_budget / 1000000).toFixed(1)}M` : "1.0M",
        annualTravelVolume: apiLead.company.annual_travel_volume || `${Math.floor(Math.random() * 5000) + 1000} trips`,
        contracts: Math.floor(Math.random() * 20) + 1,
        revenue: apiLead.company.annual_revenue || Math.floor(Math.random() * 50000000) + 10000000,
        phone: apiLead.company.phone || "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
        email: apiLead.company.email || `contact@${apiLead.company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        website: apiLead.company.website || `www.${apiLead.company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        aiRecommendation: generateAIRecommendation(apiLead.company),
        compliance: Math.floor(Math.random() * 20) + 80,
        financialStability: Math.floor(Math.random() * 20) + 80,
        travelFrequency: apiLead.company.travel_frequency || getRandomTravelFrequency(),
        destinations: getRandomDestinations(),
        preferredClass: apiLead.company.preferred_class || getRandomPreferredClass(),
        teamSize: Math.floor((apiLead.company.employee_count || 1000) * 0.1),
        travelManagers: Math.floor(Math.random() * 5) + 1,
        currentAirlines: apiLead.company.current_airlines ? apiLead.company.current_airlines.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : getRandomAirlines(),
        paymentTerms: apiLead.company.payment_terms || getRandomPaymentTerms(),
        creditRating: apiLead.company.credit_rating || getRandomCreditRating(),
        sustainabilityFocus: apiLead.company.sustainability_focus || getRandomSustainabilityFocus(),
        technologyIntegration: apiLead.company.technology_integration ? apiLead.company.technology_integration.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : getRandomTechIntegration(),
        seasonality: getRandomSeasonality(),
        meetingTypes: getRandomMeetingTypes(),
        companySize: getSizeDisplay(apiLead.company.size),
        marketSegment: getIndustryDisplay(apiLead.company.industry),
        decisionMakers: Math.floor(Math.random() * 8) + 2,
        contractValue: Math.floor(Math.random() * 3000000) + 500000,
        competitorAirlines: Math.floor(Math.random() * 5) + 1,
        loyaltyPotential: Math.floor(Math.random() * 30) + 70,
        expansionPlans: apiLead.company.expansion_plans || getRandomExpansionPlans(),
        riskLevel: apiLead.company.risk_level || getRandomRiskLevel()
    };
};
// Helper functions
const getCompanyTypeDisplay = (size) => {
    const types = {
        startup: "Startup Company",
        small: "Small Business",
        medium: "Medium Corporation",
        large: "Large Corporation",
        enterprise: "Enterprise Corporation",
        corporation: "Corporation",
        llc: "LLC",
        partnership: "Partnership",
        nonprofit: "Non-Profit"
    };
    return types[size] || "Corporation";
};
const getIndustryDisplay = (industry) => {
    const industries = {
        technology: "Technology & Software",
        finance: "Finance & Banking",
        healthcare: "Healthcare",
        manufacturing: "Manufacturing",
        retail: "Retail & Consumer",
        consulting: "Consulting Services",
        telecommunications: "Telecommunications",
        energy: "Energy & Utilities",
        transportation: "Transportation & Logistics",
        education: "Education",
        government: "Government",
        other: "Other"
    };
    return industries[industry] || "Business Services";
};
const getSizeDisplay = (size) => {
    const sizes = {
        startup: "Startup",
        small: "Small",
        medium: "Medium",
        large: "Large",
        enterprise: "Enterprise"
    };
    return sizes[size] || "Medium";
};
const generateAIRecommendation = (company) => {
    const recommendations = [
        "High-potential corporate client with strong growth indicators. Excellent opportunity for partnership.",
        "Established company with consistent business patterns. Good candidate for long-term contracts.",
        "Growing organization with expanding travel needs. Consider volume-based pricing strategies.",
        "Premium client with sophisticated requirements. Focus on high-service offerings.",
        "Cost-conscious organization seeking value. Emphasize efficiency and competitive pricing."
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
};
const getRandomTravelFrequency = () => {
    const frequencies = ["Daily", "Weekly", "Monthly", "Bi-weekly", "Quarterly"];
    return frequencies[Math.floor(Math.random() * frequencies.length)];
};
const getRandomDestinations = () => {
    const destinations = [
        ["North America", "Europe"],
        ["Global", "Asia-Pacific", "Europe"],
        ["North America", "Asia-Pacific"],
        ["Domestic", "Regional"],
        ["Global", "Emerging Markets"]
    ];
    return destinations[Math.floor(Math.random() * destinations.length)];
};
const getRandomPreferredClass = () => {
    const classes = ["Economy", "Economy Plus", "Business", "First", "Business/First"];
    return classes[Math.floor(Math.random() * classes.length)];
};
const getRandomAirlines = () => {
    const airlines = [
        ["United", "Delta"],
        ["American", "Southwest"],
        ["Emirates", "Singapore Airlines"],
        ["British Airways", "Lufthansa"],
        ["Air France", "KLM"]
    ];
    return airlines[Math.floor(Math.random() * airlines.length)];
};
const getRandomPaymentTerms = () => {
    const terms = ["Net 15", "Net 30", "Net 45", "Net 60"];
    return terms[Math.floor(Math.random() * terms.length)];
};
const getRandomCreditRating = () => {
    const ratings = ["AAA", "AA", "A", "BBB", "A+"];
    return ratings[Math.floor(Math.random() * ratings.length)];
};
const getRandomSustainabilityFocus = () => {
    const focus = ["Very High", "High", "Medium", "Low"];
    return focus[Math.floor(Math.random() * focus.length)];
};
const getRandomTechIntegration = () => {
    const tech = [
        ["API", "Mobile App"],
        ["GDS", "Corporate Portal"],
        ["API", "Real-time Booking"],
        ["Mobile App", "Expense Management"],
        ["Corporate Portal", "Reporting"]
    ];
    return tech[Math.floor(Math.random() * tech.length)];
};
const getRandomSeasonality = () => {
    const patterns = ["Year-round", "Q1/Q3 Heavy", "Spring/Summer Peak", "Holiday Heavy"];
    return patterns[Math.floor(Math.random() * patterns.length)];
};
const getRandomMeetingTypes = () => {
    const types = [
        ["Business Meetings", "Conferences"],
        ["Client Visits", "Trade Shows"],
        ["Team Offsites", "Training"],
        ["Site Visits", "Regulatory Meetings"]
    ];
    return types[Math.floor(Math.random() * types.length)];
};
const getRandomExpansionPlans = () => {
    const plans = ["Aggressive", "Moderate", "Conservative", "Rapid", "Stable"];
    return plans[Math.floor(Math.random() * plans.length)];
};
const getRandomRiskLevel = () => {
    const risks = ["Very Low", "Low", "Medium", "High"];
    return risks[Math.floor(Math.random() * risks.length)];
};
// This function is now primarily for reference if needed, but history is fetched from API
// It's kept here as a fallback or for understanding the original logic.
const buildLeadHistory = (apiLead) => {
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
        apiLead.lead_notes.forEach((note) => {
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
export function LeadsList({ initialFilters, onNavigate }) {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const leadApi = useLeadApi();
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedLead, setSelectedLead] = useState(null); // State for the lead selected in other dialogs
    const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false); // Changed from showNewLeadDialog
    const [showDisqualifyDialog, setShowDisqualifyDialog] = useState(false);
    const [selectedLeadForDisqualify, setSelectedLeadForDisqualify] = useState(null);
    const [disqualifyReason, setDisqualifyReason] = useState('');
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [selectedLeadForContact, setSelectedLeadForContact] = useState(null);
    const [contactForm, setContactForm] = useState({
        method: 'Email',
        subject: '',
        message: '',
        followUpDate: ''
    });
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [leadsForViewProfile, setLeadsForViewProfile] = useState([]); // State for leads to view profile
    const [selectedCorporate, setSelectedCorporate] = useState(null);
    const [showCorporateProfile, setShowCorporateProfile] = useState(false);
    const [selectedLeadForNote, setSelectedLeadForNote] = useState(null);
    const [noteForm, setNoteForm] = useState({
        note: '',
        nextAction: '',
        urgency: 'Medium'
    });
    const [expandedNotes, setExpandedNotes] = useState({});
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
    // Actions dropdown states
    const [showInitiateCallModal, setShowInitiateCallModal] = useState(false);
    const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);
    const [showScheduleDemoModal, setShowScheduleDemoModal] = useState(false);
    const [selectedLeadForAction, setSelectedLeadForAction] = useState(null);
    // Assign Agent states
    const [showAssignAgentModal, setShowAssignAgentModal] = useState(false);
    const [selectedLeadForAssign, setSelectedLeadForAssign] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [assignmentPriority, setAssignmentPriority] = useState('Medium Priority');
    const [assignmentNotes, setAssignmentNotes] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedLeadForHistory, setSelectedLeadForHistory] = useState(null);
    const [leadHistory, setLeadHistory] = useState({}); // Stores history entries fetched from API
    const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Loading state for history fetch
    const [filters, setFilters] = useState({
        status: initialFilters?.status || 'all',
        industry: 'all',
        score: 'all',
        engagement: 'all',
        search: ''
    });
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 10; // Number of leads to display per page
    // New company form state
    const [newCompanyForm, setNewCompanyForm] = useState({
        name: '',
        type: '', // Added type for company
        industry: '',
        location: '',
        website: '',
        phone: '',
        email: '',
        established: '', // Year established
        employees: '', // Number of employees
        revenue: '', // Annual revenue in millions
        travelBudget: '', // Annual travel budget
        annualTravelVolume: '', // Annual travel volume (e.g., number of trips)
        travelFrequency: '', // How often they travel
        preferredClass: '', // Preferred travel class
        companySize: '', // Category like startup, small, medium, etc.
        creditRating: '',
        paymentTerms: '',
        sustainabilityFocus: '',
        riskLevel: '',
        expansionPlans: '',
        specialties: '', // Comma-separated specialties
        technologyIntegration: '', // Comma-separated tech integrations
        currentAirlines: '', // Comma-separated current airlines used
        notes: '' // Additional notes
    });
    const [newCompany, setNewCompany] = useState({
        name: '',
        type: '',
        industry: '',
        location: '',
        website: '',
        phone: '',
        email: '',
        established: '',
        employees: '',
        revenue: '',
        travelBudget: '',
        annualTravelVolume: '',
        travelFrequency: '',
        preferredClass: '',
        companySize: '',
        creditRating: '',
        paymentTerms: '',
        sustainabilityFocus: '',
        riskLevel: '',
        expansionPlans: '',
        specialties: '',
        technologyIntegration: '',
        currentAirlines: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const isFormValid = () => {
        return newCompanyForm.name.trim() !== '' &&
            newCompanyForm.industry !== '' &&
            newCompanyForm.companySize !== '' &&
            newCompanyForm.location.trim() !== '' &&
            newCompanyForm.email.trim() !== '';
    };
    // Fetch leads from API
    const fetchLeads = async () => {
        try {
            setLoading(true);
            setCurrentPage(1); // Reset to first page on new fetch
            // Apply current filtrs when fetching
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
            }
            else if (apiResponse && Array.isArray(apiResponse.results)) {
                apiLeads = apiResponse.results;
            }
            else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
                apiLeads = apiResponse.data;
            }
            else {
                console.warn('Unexpected API response format:', apiResponse);
                apiLeads = [];
            }
            console.log('Processed leads array:', apiLeads);
            // Transform leads - history_entries are not included here as they are fetched on demand
            const transformedLeads = apiLeads.map((apiLead) => {
                console.log('Transforming lead:', apiLead);
                return transformApiLeadToUILead(apiLead);
            });
            const transformedLeadsforViewProfile = apiLeads.map((apiLead) => {
                console.log('Transforming leadfor view profile:', apiLead);
                return transformCompanyDataForViewProfile(apiLead);
            });
            console.log('Final transformed leads:', transformedLeads, "ddddddddddddddddd", transformedLeadsforViewProfile);
            setLeads(transformedLeads);
            setLeadsForViewProfile(transformedLeadsforViewProfile);
        }
        catch (error) {
            console.error('Error fetching leads:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to fetch leads from server');
            // Set empty array on error to avoid showing static data
            setLeads([]);
        }
        finally {
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
    const getStatusBadgeStyle = (status) => {
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
    const getScoreColor = (score) => {
        if (score >= 80)
            return 'text-green-600';
        if (score >= 60)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const getUrgencyBadgeStyle = (urgency) => {
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
    const toggleNotesExpansion = (leadId) => {
        setExpandedNotes(prev => ({
            ...prev,
            [leadId]: !prev[leadId]
        }));
    };
    const handleSelectLead = (leadId, isChecked) => {
        if (isChecked) {
            setSelectedLeads(prev => [...prev, leadId]);
        }
        else {
            setSelectedLeads(prev => prev.filter(id => id !== leadId));
            setSelectAll(false);
        }
    };
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedLeads(filteredLeads.map(lead => lead.id));
            setSelectAll(true);
        }
        else {
            setSelectedLeads([]);
            setSelectAll(false);
        }
    };
    const handleBackToSearch = () => {
        setShowCorporateProfile(false);
        setSelectedCorporate(null);
    };
    // Function to create a new lead via API
    const handleCreateNewLead = async () => {
        setIsSubmitting(true); // Set submitting state
        try {
            // Basic validation for required fields
            if (!newCompanyForm.name.trim() || !newCompanyForm.email.trim() || !newCompanyForm.industry || !newCompanyForm.companySize || !newCompanyForm.location.trim()) {
                toast.error('Please fill in all required fields (Company Name, Email, Industry, Company Size, and Location)');
                setIsSubmitting(false); // Reset submitting state
                return;
            }
            const leadData = {
                company: {
                    name: newCompanyForm.name,
                    company_type: newCompanyForm.type || null, // Use company type
                    industry: newCompanyForm.industry,
                    location: newCompanyForm.location,
                    website: newCompanyForm.website || null,
                    employees: newCompanyForm.employees ? parseInt(newCompanyForm.employees) : null, // Parse employees to number
                    annual_revenue: newCompanyForm.revenue ? parseFloat(newCompanyForm.revenue) * 1000000 : null, // Convert millions to actual value
                    established_year: newCompanyForm.established ? parseInt(newCompanyForm.established) : null, // Parse year to number
                    company_size: newCompanyForm.companySize,
                    credit_rating: newCompanyForm.creditRating || null,
                    payment_terms: newCompanyForm.paymentTerms || null,
                    travel_budget: newCompanyForm.travelBudget ? parseFloat(newCompanyForm.travelBudget.replace(/[^0-9.]/g, '')) * 1000 : null, // Parse budget, assume K
                    annual_travel_volume: newCompanyForm.annualTravelVolume || null,
                    travel_frequency: newCompanyForm.travelFrequency || null,
                    preferred_class: newCompanyForm.preferredClass || null,
                    sustainability_focus: newCompanyForm.sustainabilityFocus || null,
                    risk_level: newCompanyForm.riskLevel || null,
                    expansion_plans: newCompanyForm.expansionPlans || null,
                    specialties: newCompanyForm.specialties ? newCompanyForm.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
                    technology_integration: newCompanyForm.technologyIntegration ? newCompanyForm.technologyIntegration.split(',').map(t => t.trim()).filter(Boolean) : [],
                    current_airlines: newCompanyForm.currentAirlines ? newCompanyForm.currentAirlines.split(',').map(a => a.trim()).filter(Boolean) : [],
                },
                contact: {
                    // For company leads, contact info might be generic or from the primary contact
                    first_name: newCompanyForm.name.split(' ')[0] || 'Primary', // Fallback if name is a single word
                    last_name: newCompanyForm.name.split(' ').slice(1).join(' ') || 'Contact',
                    email: newCompanyForm.email,
                    phone: newCompanyForm.phone || null,
                    position: 'N/A', // Position is not relevant for a company lead directly
                    is_decision_maker: null // Unknown for a company lead
                },
                status: 'new', // Default status for a new lead
                source: 'Direct Entry', // Source from manual entry
                priority: 'medium', // Default priority/urgency
                score: 50, // Default score
                estimated_value: newCompanyForm.travelBudget ? parseFloat(newCompanyForm.travelBudget.replace(/[^0-9.]/g, '')) * 1000 : null,
                notes: newCompanyForm.notes || '',
                next_action: 'Initial outreach and qualification',
                next_action_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default next action in 2 days
            };
            console.log('Creating lead with data:', leadData);
            // const createdLead = await leadApi.createLead(leadData);
            // console.log('Lead created successfully:', createdLead);
            // await fetchLeads(); // Refresh leads list to show the new lead
            setShowNewCompanyDialog(false); // Close the dialog
            setSuccessMessage(`New lead "${newCompanyForm.name}" has been created successfully!`);
            setTimeout(() => setSuccessMessage(''), 5000);
            // Reset form
            setNewCompanyForm({
                name: '',
                type: '',
                industry: '',
                location: '',
                website: '',
                phone: '',
                email: '',
                established: '',
                employees: '',
                revenue: '',
                travelBudget: '',
                annualTravelVolume: '',
                travelFrequency: '',
                preferredClass: '',
                companySize: '',
                creditRating: '',
                paymentTerms: '',
                sustainabilityFocus: '',
                riskLevel: '',
                expansionPlans: '',
                specialties: '',
                technologyIntegration: '',
                currentAirlines: '',
                notes: ''
            });
            toast.success('Lead created successfully!');
        }
        catch (error) {
            console.error('Error creating lead:', error);
            toast.error('Failed to create lead. Please try again.');
        }
        finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };
    const handleAddCompany = async () => {
        setIsSubmitting(true);
        setSuccessMessage('');
        try {
            // Map frontend fields to Django model fields - include ALL form sections
            const companyData = {
                // Basic Info
                name: newCompany.name,
                company_type: newCompany.type,
                industry: newCompany.industry,
                location: newCompany.location,
                email: newCompany.email,
                phone: newCompany.phone,
                website: newCompany.website || '',
                // Business Details
                employee_count: newCompany.employees ? parseInt(newCompany.employees) : null,
                annual_revenue: newCompany.revenue ? parseFloat(newCompany.revenue) * 1000000 : null, // Convert millions to actual amount
                year_established: newCompany.established ? parseInt(newCompany.established) : null,
                size: newCompany.companySize,
                credit_rating: newCompany.creditRating,
                payment_terms: newCompany.paymentTerms,
                // Travel Profile
                travel_budget: newCompany.travelBudget ? parseFloat(newCompany.travelBudget) * 1000000 : null, // Convert millions to actual amount
                annual_travel_volume: newCompany.annualTravelVolume,
                travel_frequency: newCompany.travelFrequency,
                preferred_class: newCompany.preferredClass,
                sustainability_focus: newCompany.sustainabilityFocus,
                risk_level: newCompany.riskLevel,
                current_airlines: newCompany.currentAirlines,
                // Additional Info
                expansion_plans: newCompany.expansionPlans,
                specialties: newCompany.specialties,
                technology_integration: newCompany.technologyIntegration,
                description: newCompany.notes || ''
            };
            console.log('Sending company data:', companyData);
            // const savedCompany = await companyApi.createCompany(companyData);
            // Reset form
            setNewCompany({
                name: '',
                type: '',
                industry: '',
                location: '',
                website: '',
                phone: '',
                email: '',
                established: '',
                employees: '',
                revenue: '',
                travelBudget: '',
                annualTravelVolume: '',
                travelFrequency: '',
                preferredClass: '',
                companySize: '',
                creditRating: '',
                paymentTerms: '',
                sustainabilityFocus: '',
                riskLevel: '',
                expansionPlans: '',
                specialties: '',
                technologyIntegration: '',
                currentAirlines: '',
                notes: ''
            });
            setShowAddCompanyDialog(false);
            setSuccessMessage(`${newCompany.name} has been successfully added to the corporate database.`);
            // Refresh the companies list to show the new company
            try {
                const createdLead = await leadApi.createLead(companyData);
                console.log('Lead created successfully:', createdLead);
                await fetchLeads();
            }
            catch (refreshError) {
                console.error('Error refreshing companies list:', refreshError);
            }
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        catch (error) {
            console.error('Error saving company:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save company';
            setSuccessMessage(`Error: ${errorMessage}`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Function to qualify a lead via API
    const handleQualifyLead = async (leadId) => {
        try {
            await leadApi.qualifyLead(leadId, { reason: 'Lead meets all qualification criteria' });
            // Update the local state
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'qualified' } : l));
            // Clear history for this lead to force refresh
            setLeadHistory(prev => ({
                ...prev,
                [leadId]: []
            }));
            toast.success('Lead qualified successfully');
        }
        catch (error) {
            console.error('Error qualifying lead:', error);
            toast.error('Failed to qualify lead');
        }
    };
    // Function to open dialog for disqualifying a lead
    const handleDisqualifyLead = (lead) => {
        setSelectedLeadForDisqualify(lead);
        setShowDisqualifyDialog(true);
        setDisqualifyReason('');
    };
    // Function to confirm disqualification via API
    const handleConfirmDisqualify = async () => {
        if (!selectedLeadForDisqualify)
            return;
        try {
            await leadApi.disqualifyLead(selectedLeadForDisqualify.id, disqualifyReason);
            // Update the local state
            setLeads(prev => prev.map(l => l.id === selectedLeadForDisqualify.id ? { ...l, status: 'unqualified', notes: `${l.notes}\n\nDisqualified: ${disqualifyReason}` } : l));
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
        }
        catch (error) {
            console.error('Error disqualifying lead:', error);
            toast.error('Failed to disqualify lead. Please try again.');
        }
    };
    // Function to open dialog for contacting a lead
    const handleContactLead = (lead) => {
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
        }
        catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        }
    };
    // Function to open dialog for adding a note
    const handleAddNote = (lead) => {
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
    const handleHistoryClick = async (lead) => {
        setSelectedLeadForHistory(lead);
        setShowHistoryDialog(true); // Use the state to control modal visibility
        // Always fetch fresh history data
        setIsLoadingHistory(true);
        try {
            const history = await leadApi.getHistory(lead.id);
            console.log('Fetched history:', history);
            // Transform API response to internal format
            const transformedHistory = history.map((item) => ({
                id: item.id,
                type: item.history_type, // Use the type from the API response
                action: item.action, // Use the action from the API response
                user: item.user_name || 'System', // Use user_name if available, else fallback
                timestamp: item.timestamp,
                details: item.details,
                icon: item.icon || 'plus', // Use icon from API, or 'plus' as default
                // Include urgency and next_action if they exist in the API response for specific history types
                urgency: item.urgency,
                next_action: item.next_action
            }));
            setLeadHistory(prev => ({
                ...prev,
                [lead.id]: transformedHistory
            }));
        }
        catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Failed to load history for this lead.');
            // Ensure that if an error occurs, the history for this lead is an empty array
            setLeadHistory(prev => ({
                ...prev,
                [lead.id]: []
            }));
        }
        finally {
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
        }
        catch (error) {
            console.error('Error saving note:', error);
            toast.error('Failed to save note. Please try again.');
        }
        finally {
            setIsSavingNote(false);
        }
    };
    // Handle action dropdown selections
    const handleInitiateCall = (lead) => {
        setSelectedLeadForAction(lead);
        setShowInitiateCallModal(true);
    };
    const handleScheduleMeeting = (lead) => {
        setSelectedLeadForAction(lead);
        setShowScheduleMeetingModal(true);
    };
    const handleScheduleDemo = (lead) => {
        setSelectedLeadForAction(lead);
        setShowScheduleDemoModal(true);
    };
    // Handle assign/reassign agent
    const handleAssignAgent = (lead) => {
        setSelectedLeadForAssign(lead);
        setSelectedAgent('');
        setAssignmentPriority('Medium Priority');
        setAssignmentNotes('');
        setShowAssignAgentModal(true);
    };
    const handleConfirmAssignAgent = async () => {
        if (!selectedAgent || !selectedLeadForAssign) {
            toast.error('Please select an agent');
            return;
        }
        try {
            setIsAssigning(true);
            // Call API to assign agent
            await leadApi.assignAgent(selectedLeadForAssign.id, {
                agent: selectedAgent,
                priority: assignmentPriority,
                notes: assignmentNotes
            });
            // Update local state
            setLeads(prev => prev.map(l => l.id === selectedLeadForAssign.id
                ? { ...l, assignedAgent: selectedAgent }
                : l));
            toast.success(`Lead assigned to ${selectedAgent} successfully!`);
            setShowAssignAgentModal(false);
            setSelectedLeadForAssign(null);
            setSelectedAgent('');
            setAssignmentNotes('');
        }
        catch (error) {
            console.error('Error assigning agent:', error);
            toast.error('Failed to assign agent. Please try again.');
        }
        finally {
            setIsAssigning(false);
        }
    };
    // Function to move qualified lead to opportunities
    const handleMoveToOpportunity = async (lead) => {
        try {
            // Prepare opportunity data from lead - match Django Opportunity model fields exactly
            const opportunityData = {
                name: `${lead.company} - Corporate Travel Solution`,
                stage: 'proposal',
                probability: 65,
                estimated_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                value: parseInt(lead.travelBudget.replace(/[^0-9]/g, '')) * 1000 || 250000,
                description: `Opportunity created from qualified lead. ${lead.notes}`,
                next_steps: 'Send initial proposal and schedule presentation'
            };
            console.log('Moving lead to opportunity with data:', { opportunity: opportunityData });
            // Call the API to move the lead to opportunity
            const response = await leadApi.moveToOpportunity(lead.id, opportunityData);
            // Remove the lead from the leads list locally
            setLeads(prev => prev.filter(l => l.id !== lead.id));
            // Show success message
            setSuccessMessage(response.message || `${lead.company} has been successfully moved to opportunities!`);
            setTimeout(() => setSuccessMessage(''), 5000);
            // Navigate to opportunities page with the new opportunity data
            // if (onNavigate) {
            //   onNavigate('opportunities', { 
            //     newOpportunity: {
            //       ...response.opportunity,
            //       leadId: response.lead_id,
            //       company: lead.company,
            //       contact: lead.contact,
            //       title: lead.title,
            //       email: lead.email,
            //       phone: lead.phone,
            //       industry: lead.industry,
            //       employees: typeof lead.employees === 'number' ? lead.employees : parseInt(lead.employees as string) || 0,
            //       revenue: lead.revenue,
            //       location: lead.location,
            //       source: lead.source,
            //       travelBudget: lead.travelBudget,
            //       decisionMaker: lead.decisionMaker,
            //       tags: lead.tags || [lead.industry, 'Qualified Lead'],
            //       owner: lead.assignedAgent || 'Current User'
            //     },
            //     message: response.message || `${lead.company} has been converted to a sales opportunity`
            //   });
            // }
            await fetchLeads();
            toast.success(`${lead.company} moved to opportunities successfully!`);
        }
        catch (error) {
            console.error('Error moving lead to opportunity:', error);
            toast.error('Failed to move lead to opportunities. Please try again.');
        }
    };
    // Filter leads based on current filter settings
    const filteredLeads = leads.filter(lead => {
        if (filters.status && filters.status !== 'all' && lead.status !== filters.status)
            return false;
        if (filters.industry && filters.industry !== 'all' && lead.industry !== filters.industry)
            return false;
        if (filters.score && filters.score !== 'all' && ((filters.score === 'high' && lead.score < 80) ||
            (filters.score === 'medium' && (lead.score < 60 || lead.score >= 80)) ||
            (filters.score === 'low' && lead.score >= 60)))
            return false;
        if (filters.engagement && filters.engagement !== 'all' && lead.engagement !== filters.engagement)
            return false;
        if (filters.search && !lead.company.toLowerCase().includes(filters.search.toLowerCase()) &&
            !lead.contact.toLowerCase().includes(filters.search.toLowerCase()))
            return false;
        return true;
    });
    // Calculate pagination details
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    const startIndex = (currentPage - 1) * leadsPerPage;
    const endIndex = startIndex + leadsPerPage;
    const currentLeads = filteredLeads.slice(startIndex, endIndex);
    // Effect to update selectAll checkbox state based on filtered leads selection
    useEffect(() => {
        if (selectedLeads.length === 0) {
            setSelectAll(false);
        }
        else if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) {
            setSelectAll(true);
        }
        else {
            setSelectAll(false); // Partially selected
        }
    }, [selectedLeads, filteredLeads]);
    // Render spinner loader while loading
    const renderSpinnerLoader = () => (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg font-medium", children: "Loading leads..." }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Please wait while we fetch your data" })] }) }));
    const handleViewProfile = (lead) => {
        console.log(leadsForViewProfile, 'leadsForViewProfile', lead, "lead");
        const item = leadsForViewProfile.find(entry => entry.id === lead.id);
        console.log(item, "item");
        setSelectedCorporate(item);
        setShowCorporateProfile(true);
    };
    // Error state if API call fails
    if (leadApi.error) {
        return (_jsxs("div", { className: "text-center py-8", children: [_jsx(AlertTriangle, { className: "h-12 w-12 mx-auto mb-4 text-red-500" }), _jsxs("p", { className: "text-red-600 mb-4", children: ["Error: ", leadApi.error] }), _jsxs(Button, { onClick: fetchLeads, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Try Again"] })] }));
    }
    // Show specific components based on state
    if (showCorporateProfile && selectedCorporate) {
        return (_jsx(Dialog, { open: showCorporateProfile, onOpenChange: setShowCorporateProfile, children: _jsx(DialogContent, { className: "max-w-2xl  cls-corporate-profile", children: _jsx("div", { className: "mt-4 max-h-[90vh] overflow-y-auto", children: _jsx(CorporateProfile, { corporateData: selectedCorporate, onBack: handleBackToSearch }) }) }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 p-6", children: [successMessage && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 mb-6", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }), _jsx("span", { className: "text-green-800", children: successMessage })] })), _jsxs("div", { className: "mb-6 flex justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-1", children: filters.status === 'qualified' ? 'Qualified Leads' :
                                    filters.status === 'unqualified' ? 'Unqualified Leads' :
                                        'All Leads' }), _jsx("p", { className: "text-gray-600", children: filters.status === 'qualified' ? 'High-potential leads ready for offer creation and contract initiation' :
                                    filters.status === 'unqualified' ? 'Leads requiring nurturing, re-engagement, or future follow-up' :
                                        'Comprehensive lead management with status tracking and AI suggestions' })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "outline", className: "text-gray-700  hover:bg-gray-50 cls-addcomapany", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export"] }), _jsxs(Button, { variant: "outline", className: "text-gray-700 hover:bg-gray-50 cls-addcomapany", onClick: fetchLeads, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh"] }), _jsxs(Button, { variant: "outline", className: "text-gray-700 hover:bg-gray-50 cls-addcomapany", onClick: () => onNavigate('email-campaigns'), children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), "Email Campaign"] }), _jsxs(Button, { className: "bg-orange-500 hover:bg-orange-600 text-white", onClick: () => setShowAddCompanyDialog(true), children: [" ", _jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add New Lead "] })] })] }), _jsx(Card, { className: "mb-6 bg-white border border-gray-200", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-5 justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 ", children: [_jsx(Filter, { className: "h-4 w-4 text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700 ", children: "Lead Filters" })] }), _jsx(Button, { variant: "outline", size: "sm", className: "text-gray-600 border-gray-300", onClick: () => setFilters({ status: 'all', industry: 'all', score: 'all', engagement: 'all', search: '' }), children: "Clear Filters" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-xs text-gray-600 mb-1 block", children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Company or contact...", className: "pl-10 text-sm border-gray-200", value: filters.search, onChange: (e) => setFilters({ ...filters, search: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs text-gray-600 mb-1 block", children: "Status" }), _jsxs(Select, { value: filters.status, onValueChange: (value) => setFilters({ ...filters, status: value }), children: [_jsx(SelectTrigger, { className: "text-sm border-gray-200", children: _jsx(SelectValue, { placeholder: "All statuses" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All statuses" }), _jsx(SelectItem, { value: "qualified", children: "Qualified" }), _jsx(SelectItem, { value: "contacted", children: "Contacted" }), _jsx(SelectItem, { value: "in-progress", children: "In Progress" }), _jsx(SelectItem, { value: "responded", children: "Responded" }), _jsx(SelectItem, { value: "unqualified", children: "Unqualified" }), _jsx(SelectItem, { value: "new", children: "New" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs text-gray-600 mb-1 block", children: "Industry" }), _jsxs(Select, { value: filters.industry, onValueChange: (value) => setFilters({ ...filters, industry: value }), children: [_jsx(SelectTrigger, { className: "text-sm border-gray-200", children: _jsx(SelectValue, { placeholder: "All industries" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All industries" }), _jsx(SelectItem, { value: "Technology", children: "Technology" }), _jsx(SelectItem, { value: "Manufacturing", children: "Manufacturing" }), _jsx(SelectItem, { value: "Financial Services", children: "Financial Services" }), _jsx(SelectItem, { value: "Banking", children: "Banking" }), _jsx(SelectItem, { value: "Consulting", children: "Consulting" }), _jsx(SelectItem, { value: "Retail", children: "Retail" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs text-gray-600 mb-1 block", children: "Score" }), _jsxs(Select, { value: filters.score, onValueChange: (value) => setFilters({ ...filters, score: value }), children: [_jsx(SelectTrigger, { className: "text-sm border-gray-200", children: _jsx(SelectValue, { placeholder: "All scores" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All scores" }), _jsx(SelectItem, { value: "high", children: "High (80+)" }), _jsx(SelectItem, { value: "medium", children: "Medium (60-79)" }), _jsx(SelectItem, { value: "low", children: "Low (<60)" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs text-gray-600 mb-1 block", children: "Engagement" }), _jsxs(Select, { value: filters.engagement, onValueChange: (value) => setFilters({ ...filters, engagement: value }), children: [_jsx(SelectTrigger, { className: "text-sm border-gray-200", children: _jsx(SelectValue, { placeholder: "All levels" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All levels" }), _jsx(SelectItem, { value: "Very High", children: "Very High" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })] })] })] }) }), _jsx("div", { className: "mb-6", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: loading ? (_jsx(_Fragment, { children: [...Array(4)].map((_, index) => (_jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { className: "h-4 w-24 mb-1" }), _jsx(Skeleton, { className: "h-8 w-12 mb-1" }), _jsx(Skeleton, { className: "h-3 w-32" })] }), _jsx(Skeleton, { className: "w-10 h-10 rounded-lg" })] }) }) }, index))) })) : (_jsx(_Fragment, { children: filters.status === 'unqualified' ? (
                        // Unqualified Leads View
                        _jsxs(_Fragment, { children: [_jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Unqualified Leads" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: filteredLeads.filter(lead => lead.status === 'unqualified').length }), _jsx("p", { className: "text-xs text-gray-500", children: "Requiring nurturing" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg", children: _jsx(UserX, { className: "h-5 w-5 text-gray-600" }) })] }) }) }), _jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Future Potential" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: (() => {
                                                                const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'unqualified');
                                                                const highScoreLeads = unqualifiedLeads.filter(lead => lead.score >= 60);
                                                                return unqualifiedLeads.length > 0 ? `${Math.round((highScoreLeads.length / unqualifiedLeads.length) * 100)}%` : '0%';
                                                            })() }), _jsx("p", { className: "text-xs text-gray-500", children: "May qualify in 6-12 months" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg", children: _jsx(TrendingUp, { className: "h-5 w-5 text-yellow-600" }) })] }) }) }), _jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Avg Score" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: (() => {
                                                                const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'unqualified');
                                                                if (unqualifiedLeads.length === 0)
                                                                    return '0';
                                                                const avgScore = unqualifiedLeads.reduce((sum, lead) => sum + lead.score, 0) / unqualifiedLeads.length;
                                                                return Math.round(avgScore);
                                                            })() }), _jsx("p", { className: "text-xs text-gray-500", children: "Below qualification threshold" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg", children: _jsx(Target, { className: "h-5 w-5 text-orange-600" }) })] }) }) }), _jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Re-engagement" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: (() => {
                                                                const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'unqualified');
                                                                const recentlyContacted = unqualifiedLeads.filter(lead => {
                                                                    const lastContact = new Date(lead.lastContact);
                                                                    const monthsAgo = (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24 * 30);
                                                                    return monthsAgo <= 3;
                                                                });
                                                                return unqualifiedLeads.length > 0 ? `${Math.round((recentlyContacted.length / unqualifiedLeads.length) * 100)}%` : '0%';
                                                            })() }), _jsx("p", { className: "text-xs text-gray-500", children: "Re-qualification success rate" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg", children: _jsx(RefreshCw, { className: "h-5 w-5 text-blue-600" }) })] }) }) })] })) : (
                        // Default View (All Leads, Qualified, etc.)
                        _jsxs(_Fragment, { children: [_jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Qualified Leads" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: filteredLeads.filter(lead => lead.status === 'qualified').length }), _jsx("p", { className: "text-xs text-gray-500", children: "High-potential prospects" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg", children: _jsx(Users, { className: "h-5 w-5 text-blue-600" }) })] }) }) }), _jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Contract Ready" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: filteredLeads.filter(lead => lead.status === 'qualified' && lead.contractReady).length }), _jsx("p", { className: "text-xs text-gray-500", children: "Ready for contract initiation" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg", children: _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }) })] }) }) }), _jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Avg Deal Size" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: (() => {
                                                                const relevantLeads = filteredLeads.filter(lead => lead.status === 'qualified'); // Consider only qualified leads for deal size
                                                                if (relevantLeads.length === 0)
                                                                    return '$0K';
                                                                const avgValue = relevantLeads.reduce((sum, lead) => {
                                                                    const value = parseInt(lead.travelBudget.replace(/[^0-9]/g, '')) || 0;
                                                                    return sum + value;
                                                                }, 0) / relevantLeads.length;
                                                                return `$${Math.round(avgValue)}K`;
                                                            })() }), _jsx("p", { className: "text-xs text-gray-500", children: "Average qualified deal value" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg", children: _jsx(DollarSign, { className: "h-5 w-5 text-yellow-600" }) })] }) }) }), _jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: "Conversion Rate" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: (() => {
                                                                const totalLeads = leads.length; // Use total leads for overall conversion
                                                                const qualifiedLeads = filteredLeads.filter(lead => lead.status === 'qualified').length;
                                                                return totalLeads > 0 ? `${Math.round((qualifiedLeads / totalLeads) * 100)}%` : '0%';
                                                            })() }), _jsx("p", { className: "text-xs text-gray-500", children: "Qualified to contact rate" })] }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg", children: _jsx(TrendingUp, { className: "h-5 w-5 text-purple-600" }) })] }) }) })] })) })) }) }), selectedLeads.length > 0 && (_jsx("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 shadow-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full", children: _jsx("span", { className: "text-white font-medium text-sm", children: selectedLeads.length }) }), _jsxs("span", { className: "text-orange-800 font-medium", children: [selectedLeads.length, " lead", selectedLeads.length > 1 ? 's' : '', " selected"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { size: "sm", className: "bg-orange-600 hover:bg-orange-700 text-white", onClick: () => {
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
                                    }, children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), "Start Campaign"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300 hover:bg-gray-50", onClick: () => {
                                        if (selectedLeads.length === 0) {
                                            toast.error('Please select leads first');
                                            return;
                                        }
                                        toast.success(`${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''} assigned to agent`);
                                        setSelectedLeads([]);
                                        setSelectAll(false);
                                    }, children: [_jsx(User, { className: "h-4 w-4 mr-2" }), "Assign Agent"] }), _jsx(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300 hover:bg-gray-50", onClick: () => {
                                        setSelectedLeads([]);
                                        setSelectAll(false);
                                        toast.success('Selection cleared');
                                    }, children: "Clear Selection" })] })] }) })), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { children: loading ? (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Search Leads" }), _jsx("p", { className: "text-sm text-gray-600", children: "Loading..." })] })) : (_jsxs(_Fragment, { children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Showing Leads (", filteredLeads.length, " results)"] }), _jsx("p", { className: "text-sm text-gray-600", children: "Comprehensive lead management with status tracking and AI suggestions" })] })) }), loading ? '' : _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Checkbox, { checked: selectAll, onCheckedChange: (checked) => handleSelectAll(checked), className: "w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Select All" })] })] }), loading ? (renderSpinnerLoader()) : (_jsx("div", { className: "space-y-4", children: currentLeads.map((lead) => (_jsx(Card, { className: "bg-white border border-gray-200 hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "checkbox", checked: selectedLeads.includes(lead.id), onChange: (e) => handleSelectLead(lead.id, e.target.checked), className: "w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500" }), _jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg", children: _jsx(Building2, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: lead.company }), _jsx(Badge, { className: `text-xs px-2 py-1 rounded-full ${getStatusBadgeStyle(lead.status)}`, children: lead.status === 'qualified' ? 'Qualified' :
                                                                    lead.status === 'contacted' ? 'Contacted' :
                                                                        lead.status === 'in-progress' ? 'In Progress' :
                                                                            lead.status === 'responded' ? 'Responded' :
                                                                                lead.status === 'unqualified' ? 'Unqualified' :
                                                                                    lead.status === 'new' ? 'New' :
                                                                                        lead.status }), lead.decisionMaker && (_jsx(Badge, { className: "text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border-green-200", children: "\uD83C\uDFC6 Decision Maker" })), lead.status === 'qualified' && lead.contractReady && (_jsx(Badge, { className: "text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border-green-200", children: "\uD83E\uDD1D Contract Ready" })), lead.nextAction === 'Move to contract' && (_jsx(Badge, { className: "text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 border-red-200", children: "\u26A0\uFE0F Action Required" }))] }), _jsxs("p", { className: "text-sm font-medium text-gray-700 mb-1", children: [lead.contact, " \u2022 ", lead.title] }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "h-3 w-3" }), lead.email] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "h-3 w-3" }), lead.phone] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3 w-3" }), lead.location] }), _jsxs("a", { href: lead.website, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline", children: [_jsx(ExternalLink, { className: "h-3 w-3" }), "Website"] })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: `text-sm font-semibold mb-1 ${getScoreColor(lead.score)}`, children: ["Score: ", lead.score] }), _jsxs("div", { className: "text-sm font-medium text-green-600 mb-1", children: [lead.travelBudget, " budget"] }), _jsxs(Badge, { className: `text-xs px-2 py-1 rounded-full ${getUrgencyBadgeStyle(lead.urgency)}`, children: [lead.urgency, " urgency"] })] })] }), lead.nextAction === 'Move to contract' && (_jsxs(Alert, { className: "mb-4 border-red-200 bg-red-50", children: [_jsx(ArrowRight, { className: "h-4 w-4 text-red-600" }), _jsx(AlertDescription, { className: "text-red-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("strong", { children: ["Next Action: ", lead.nextAction] }), _jsx("div", { className: "text-sm mt-1", children: "Lead is qualified and ready for contract negotiation." })] }), _jsx(Button, { size: "sm", variant: "outline", className: "text-red-600 border-red-300", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] }) })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Industry:" }), " ", lead.industry] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Company Size:" }), " ", typeof lead.employees === 'number' ? lead.employees.toLocaleString() : lead.employees, " employees"] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Revenue:" }), " ", lead.revenue] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Source:" }), " ", lead.source] }), lead.assignedAgent && (_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Assigned Agent:" }), " ", lead.assignedAgent] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Last Contact:" }), " ", lead.lastContact] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Follow-up Date:" }), " ", lead.followUpDate] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-600", children: "Engagement:" }), _jsx("span", { className: `ml-1 ${lead.engagement === 'High' ? 'text-green-600' : lead.engagement === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`, children: lead.engagement })] }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [lead.industry && (_jsx(Badge, { variant: "outline", className: "text-xs", children: lead.industry })), lead.decisionMaker && (_jsx(Badge, { variant: "outline", className: "text-xs", children: "High-Value" })), lead.status === 'qualified' && (_jsx(Badge, { variant: "outline", className: "text-xs", children: "Decision Maker" }))] })] })] }), _jsxs(Alert, { className: "mb-4 border-blue-200 bg-blue-50", children: [_jsx(Lightbulb, { className: "h-4 w-4 text-blue-600" }), _jsxs(AlertDescription, { className: "text-blue-800", children: [_jsx("strong", { children: "AI Suggestion:" }), " ", lead.status === 'qualified' ? 'Schedule product demo within 3 days. High conversion probability.' : 'Send detailed cost comparison proposal. Mention case studies.'] })] }), (lead.notes || (lead.leadNotes && lead.leadNotes.length > 0)) && (_jsx("div", { className: "mb-4 p-3 bg-gray-50 rounded-lg", children: _jsxs(Collapsible, { open: expandedNotes[lead.id] || false, onOpenChange: () => toggleNotesExpansion(lead.id), children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "h-auto p-0 font-semibold text-gray-800 hover:bg-transparent flex items-center gap-1", children: [_jsx(MessageSquare, { className: "h-4 w-4" }), "Notes & Updates", _jsx(ChevronDown, { className: `h-3 w-3 transition-transform duration-200 ${expandedNotes[lead.id] ? 'rotate-180' : ''}` })] }) }), lead.leadNotes && lead.leadNotes.length > 0 && (_jsxs("span", { className: "text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full", children: [lead.leadNotes.length, " note", lead.leadNotes.length !== 1 ? 's' : ''] }))] }), _jsxs(CollapsibleContent, { className: "space-y-2", children: [lead.notes && (_jsxs("div", { className: "text-sm text-gray-700 mb-2", children: [_jsx("strong", { children: "Original Notes:" }), " ", lead.notes.split(' | ')[0]] })), lead.leadNotes && lead.leadNotes.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-xs font-medium text-gray-600", children: "Recent Activity:" }), (expandedNotes[lead.id] ? lead.leadNotes : lead.leadNotes.slice(0, 2)).map((note, index) => (_jsxs("div", { className: "text-sm bg-white p-2 rounded border-l-2 border-blue-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("span", { className: "text-xs text-gray-500", children: [new Date(note.created_at).toLocaleDateString(), " \u2022 ", note.created_by?.username || 'User'] }), note.urgency && note.urgency !== 'Medium' && (_jsx(Badge, { className: `text-xs px-1 py-0 ${getUrgencyBadgeStyle(note.urgency)}`, children: note.urgency }))] }), _jsx("p", { className: "text-gray-700", children: note.note }), note.next_action && (_jsxs("p", { className: "text-xs text-blue-600 mt-1", children: [_jsx("strong", { children: "Next:" }), " ", note.next_action] }))] }, note.id || index))), !expandedNotes[lead.id] && lead.leadNotes.length > 2 && (_jsxs("div", { className: "text-xs text-gray-500 text-center", children: ["+", lead.leadNotes.length - 2, " more note", lead.leadNotes.length - 2 !== 1 ? 's' : '', " (click to expand)"] }))] }))] })] }) })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs(Button, { size: "sm", className: "bg-orange-500 hover:bg-orange-600 text-white", onClick: () => handleContactLead(lead), children: [_jsx(Mail, { className: "h-4 w-4 mr-1" }), "Contact"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300", onClick: () => handleAddNote(lead), children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-1" }), "Add Note"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-orange-700 border-orange-200 bg-orange-50", children: [_jsx(Megaphone, { className: "h-4 w-4 mr-1" }), "Campaign"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300", onClick: () => handleHistoryClick(lead), children: [_jsx(History, { className: "h-4 w-4 mr-1" }), "History"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-purple-700 border-purple-200 bg-purple-50", onClick: () => handleAssignAgent(lead), children: [_jsx(User, { className: "h-4 w-4 mr-1" }), lead.assignedAgent ? 'Reassign' : 'Assign Agent'] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: "outline", className: "text-blue-700 border-blue-200 bg-blue-50", children: [_jsx(Activity, { className: "h-4 w-4 mr-1" }), "Actions", _jsx(ChevronDown, { className: "h-4 w-4 ml-1" })] }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [_jsxs(DropdownMenuItem, { className: "flex items-center gap-2 cursor-pointer", onClick: () => handleInitiateCall(lead), children: [_jsx(PhoneCall, { className: "h-4 w-4" }), "Initiate Call"] }), _jsxs(DropdownMenuItem, { className: "flex items-center gap-2 cursor-pointer", onClick: () => handleScheduleMeeting(lead), children: [_jsx(CalendarDays, { className: "h-4 w-4" }), "Schedule Meeting"] }), _jsxs(DropdownMenuItem, { className: "flex items-center gap-2 cursor-pointer", onClick: () => handleScheduleDemo(lead), children: [_jsx(Presentation, { className: "h-4 w-4" }), "Schedule Demo"] })] })] }), lead.status === 'qualified' && (_jsxs(Button, { size: "sm", variant: "outline", className: "text-orange-700 border-orange-200 bg-orange-50", children: [_jsx(Gift, { className: "h-4 w-4 mr-1" }), "Create Offer"] })), lead.status === 'qualified' && (_jsxs(Button, { size: "sm", variant: "outline", className: "text-green-700 border-green-200 bg-green-50 hover:bg-green-100", onClick: () => handleMoveToOpportunity(lead), children: [_jsx(TrendingUpIcon, { className: "h-4 w-4 mr-1" }), "Move to Opportunity"] }))] }), _jsxs("div", { className: "flex gap-2", children: [lead.status !== 'qualified' && lead.status !== 'Inprogress' && lead.status !== 'new' && (_jsxs(Button, { size: "sm", variant: "outline", className: "text-green-700 border-green-300 hover:bg-green-50", onClick: () => handleQualifyLead(lead.id), children: [_jsx(UserCheck, { className: "h-4 w-4 mr-1" }), "Qualify"] })), lead.status !== 'unqualified' && lead.status !== 'Inprogress' && lead.status !== 'new' && (_jsxs(Button, { size: "sm", variant: "outline", className: "text-red-700 border-red-300 hover:bg-red-50", onClick: () => handleDisqualifyLead(lead), children: [_jsx(UserX, { className: "h-4 w-4 mr-1" }), "Disqualify"] })), _jsxs(Button, { size: "sm", variant: "outline", className: "text-gray-700 border-gray-300", onClick: () => handleViewProfile(lead), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "Details"] })] })] })] }) }, lead.id))) })), !loading && filteredLeads.length > 0 && (_jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-gray-200", children: [_jsx("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: _jsxs("span", { children: ["Showing ", startIndex + 1, "-", Math.min(endIndex, filteredLeads.length), " of ", filteredLeads.length, " results"] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(prev => Math.max(1, prev - 1)), disabled: currentPage <= 1, className: "text-gray-600 border-gray-300", children: [_jsx(ChevronDown, { className: "h-4 w-4 rotate-90" }), "Previous"] }), _jsxs("div", { className: "flex items-center gap-1", children: [Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        }
                                        else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        }
                                        else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        }
                                        else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (_jsx(Button, { variant: currentPage === pageNum ? "default" : "outline", size: "sm", onClick: () => setCurrentPage(pageNum), className: currentPage === pageNum
                                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                                : "text-gray-600 border-gray-300", children: pageNum }, pageNum));
                                    }), totalPages > 5 && currentPage < totalPages - 2 && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-400 px-1", children: "..." }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(totalPages), className: "text-gray-600 border-gray-300", children: totalPages })] }))] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)), disabled: currentPage >= totalPages, className: "text-gray-600 border-gray-300", children: ["Next", _jsx(ChevronDown, { className: "h-4 w-4 -rotate-90" })] })] })] })), !loading && filteredLeads.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No leads found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Try adjusting your filters or search criteria." }), _jsx(Button, { variant: "outline", onClick: () => setFilters({ status: 'all', industry: 'all', score: 'all', engagement: 'all', search: '' }), className: "text-gray-600 border-gray-300", children: "Clear All Filters" })] })), _jsx(Dialog, { open: showContactDialog, onOpenChange: setShowContactDialog, children: _jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-5 w-5 text-orange-600" }), "Contact ", selectedLeadForContact?.company] }), _jsxs(DialogDescription, { children: ["Send a personalized message to ", selectedLeadForContact?.contact] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Contact Method" }), _jsxs(Select, { value: contactForm.method, onValueChange: (value) => setContactForm({ ...contactForm, method: value }), children: [_jsx(SelectTrigger, { className: "border-orange-200 focus:border-orange-500 focus:ring-orange-500", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Email", children: "Email" }), _jsx(SelectItem, { value: "Phone", children: "Phone" }), _jsx(SelectItem, { value: "LinkedIn", children: "LinkedIn" }), _jsx(SelectItem, { value: "In-Person Meeting", children: "In-Person Meeting" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Subject" }), _jsx(Input, { value: contactForm.subject, onChange: (e) => setContactForm({ ...contactForm, subject: e.target.value }), placeholder: "Enter subject line...", className: "border-gray-300 focus:border-orange-500 focus:ring-orange-500" })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Message" }), _jsx(Textarea, { value: contactForm.message, onChange: (e) => setContactForm({ ...contactForm, message: e.target.value }), placeholder: "Enter your message...", className: "min-h-[200px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500", rows: 10 })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Follow-up Date" }), _jsx(Input, { type: "date", value: contactForm.followUpDate, onChange: (e) => setContactForm({ ...contactForm, followUpDate: e.target.value }), className: "border-gray-300 focus:border-orange-500 focus:ring-orange-500" })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowContactDialog(false);
                                        setSelectedLeadForContact(null);
                                        setContactForm({
                                            method: 'Email',
                                            subject: '',
                                            message: '',
                                            followUpDate: ''
                                        });
                                    }, className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { onClick: handleSendMessage, className: "bg-orange-500 hover:bg-orange-600 text-white", disabled: !contactForm.subject || !contactForm.message, children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), "Send Message"] })] })] }) }), _jsx(Dialog, { open: showAddNoteDialog, onOpenChange: setShowAddNoteDialog, children: _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-5 w-5 text-orange-600" }), "Add Note for ", selectedLeadForNote?.company] }), _jsx(DialogDescription, { children: "Update lead information and next actions" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Note" }), _jsx(Textarea, { value: noteForm.note, onChange: (e) => setNoteForm({ ...noteForm, note: e.target.value }), placeholder: "Add your notes...", className: "min-h-[120px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500", rows: 5 })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Next Action" }), _jsx(Input, { value: noteForm.nextAction, onChange: (e) => setNoteForm({ ...noteForm, nextAction: e.target.value }), placeholder: "Contract negotiation", className: "border-gray-300 focus:border-orange-500 focus:ring-orange-500" })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Urgency" }), _jsxs(Select, { value: noteForm.urgency, onValueChange: (value) => setNoteForm({ ...noteForm, urgency: value }), children: [_jsx(SelectTrigger, { className: "border-orange-200 focus:border-orange-500 focus:ring-orange-500", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Low", children: "Low" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Urgent", children: "Urgent" })] })] })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowAddNoteDialog(false);
                                        setSelectedLeadForNote(null);
                                        setNoteForm({
                                            note: '',
                                            nextAction: '',
                                            urgency: 'Medium'
                                        });
                                    }, className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { onClick: handleSaveNote, className: "bg-orange-500 hover:bg-orange-600 text-white", disabled: !noteForm.note.trim(), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Save Note"] })] })] }) }), _jsx(Dialog, { open: showHistoryDialog, onOpenChange: setShowHistoryDialog, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(History, { className: "h-5 w-5 text-gray-600" }), "Lead History - ", selectedLeadForHistory?.company] }), _jsxs(DialogDescription, { children: ["Complete activity history for ", selectedLeadForHistory?.contact, " at ", selectedLeadForHistory?.company] })] }), _jsx("div", { className: "space-y-4 max-h-[60vh] overflow-y-auto", children: isLoadingHistory ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" }), _jsx("p", { className: "text-gray-500", children: "Loading history..." })] })) : (leadHistory[selectedLeadForHistory?.id || 0] || []).length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No history available for this lead." })) : (_jsx("div", { className: "space-y-4", children: (leadHistory[selectedLeadForHistory?.id || 0] || []).map((entry) => {
                                    // Use the existing transformHistoryEntry if it's suitable, or adjust
                                    const mappedEntry = {
                                        id: entry.id,
                                        type: entry.type, // Already mapped by handleHistoryClick
                                        action: entry.action,
                                        user: entry.user || 'Unknown User',
                                        timestamp: entry.timestamp,
                                        details: entry.details,
                                        icon: entry.icon, // Use icon from transformed data
                                        urgency: entry.urgency, // Propagate urgency
                                        next_action: entry.next_action // Propagate next_action
                                    };
                                    const getHistoryIcon = (type) => {
                                        switch (type) {
                                            case 'lead_created':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center", children: _jsx(Plus, { className: "h-4 w-4 text-blue-600" }) });
                                            case 'note_added':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center", children: _jsx(MessageSquare, { className: "h-4 w-4 text-blue-600" }) });
                                            case 'phone_call':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center", children: _jsx(Phone, { className: "h-4 w-4 text-purple-600" }) });
                                            case 'meeting_scheduled':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center", children: _jsx(Calendar, { className: "h-4 w-4 text-pink-600" }) });
                                            case 'lead_qualified':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-green-100 flex items-center justify-center", children: _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }) });
                                            case 'lead_disqualified':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center", children: _jsx(UserX, { className: "h-4 w-4 text-red-600" }) });
                                            case 'email_sent':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center", children: _jsx(Mail, { className: "h-4 w-4 text-blue-600" }) });
                                            case 'lead_responded':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-green-100 flex items-center justify-center", children: _jsx(MessageCircle, { className: "h-4 w-4 text-green-600" }) });
                                            case 'status_change':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center", children: _jsx(RefreshCw, { className: "h-4 w-4 text-yellow-600" }) });
                                            case 'score_updated':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-4 w-4 text-orange-600" }) });
                                            case 'lead_assigned':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center", children: _jsx(User, { className: "h-4 w-4 text-indigo-600" }) });
                                            case 'proposal_sent':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center", children: _jsx(Briefcase, { className: "h-4 w-4 text-teal-600" }) });
                                            case 'contract_signed':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center", children: _jsx(Handshake, { className: "h-4 w-4 text-emerald-600" }) });
                                            case 'deal_won':
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center", children: _jsx(Award, { className: "h-4 w-4 text-lime-600" }) });
                                            default:
                                                return _jsx("div", { className: "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center", children: _jsx(Activity, { className: "h-4 w-4 text-gray-600" }) });
                                        }
                                    };
                                    return (_jsxs("div", { className: "flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors", children: [_jsx("div", { className: "flex-shrink-0 mt-1", children: getHistoryIcon(mappedEntry.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 uppercase font-medium", children: mappedEntry.type }), _jsx("h4", { className: "text-sm font-semibold text-gray-900", children: mappedEntry.action }), entry.urgency && entry.urgency !== 'Medium' && (_jsx(Badge, { className: `text-xs px-1 py-0 ${getUrgencyBadgeStyle(entry.urgency)}`, children: entry.urgency }))] }), _jsx("span", { className: "text-xs text-gray-500", children: format(new Date(entry.timestamp), 'MM/dd/yyyy \'at\' HH:mm:ss') })] }), _jsx("p", { className: "text-sm text-gray-700 mb-2", children: mappedEntry.details }), entry.next_action && (_jsxs("p", { className: "text-xs text-blue-600 mb-2", children: [_jsx("strong", { children: "Next Action:" }), " ", entry.next_action] })), _jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [_jsx(User, { className: "h-3 w-3" }), _jsxs("span", { children: ["by ", mappedEntry.user] })] })] })] }, entry.id));
                                }) })) }), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsx(Button, { onClick: () => {
                                    setShowHistoryDialog(false);
                                    setSelectedLeadForHistory(null);
                                }, className: "bg-orange-500 hover:bg-orange-600 text-white", children: "Close" }) })] }) }), _jsx(Dialog, { open: showDisqualifyDialog, onOpenChange: setShowDisqualifyDialog, children: _jsxs(DialogContent, { className: "max-w-md", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-red-700", children: [_jsx(UserX, { className: "h-5 w-5" }), "Disqualify Lead"] }), _jsxs(DialogDescription, { children: ["Please provide a reason for disqualifying ", selectedLeadForDisqualify?.company, ". This action will remove the lead from your active list."] })] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx(Label, { htmlFor: "disqualifyReason", className: "text-sm font-medium text-gray-700", children: "Reason for disqualify" }), _jsx(Textarea, { id: "disqualifyReason", value: disqualifyReason, onChange: (e) => setDisqualifyReason(e.target.value), placeholder: "Enter the reason for disqualifying this lead (optional)...", className: "mt-1 min-h-[120px] resize-none border-gray-300 focus:border-red-500 focus:ring-red-500", rows: 5 })] }) }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowDisqualifyDialog(false);
                                        setSelectedLeadForDisqualify(null);
                                        setDisqualifyReason('');
                                    }, className: "text-gray-600 border-gray-300", children: "Skip" }), _jsx(Button, { onClick: handleConfirmDisqualify, className: "bg-orange-500 hover:bg-orange-600 text-white", children: "Submit" })] })] }) }), _jsx(Dialog, { open: showAddCompanyDialog, onOpenChange: setShowAddCompanyDialog, children: _jsxs(DialogContent, { className: "max-w-[87rem] w-[95vw] max-h-[85vh] overflow-y-auto", children: [_jsxs(DialogHeader, { className: "pb-[24px] pt-[0px] pr-[0px] pl-[0px] m-[0px]", children: [_jsxs(DialogTitle, { className: "flex items-center gap-3 text-xl", children: [_jsx(Plus, { className: "h-6 w-6 text-orange-500" }), "Add New Company"] }), _jsx(DialogDescription, { className: "text-base mt-2", style: { 'color': '#717182' }, children: "Add a new company to the corporate database for potential partnership opportunities" })] }), _jsxs(Tabs, { defaultValue: "basic", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "basic", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Basic Info" }), _jsx(TabsTrigger, { value: "business", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Business Details" }), _jsx(TabsTrigger, { value: "travel", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Travel Profile" }), _jsx(TabsTrigger, { value: "additional", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Additional Info" })] }), _jsxs(ScrollArea, { className: "max-h-[55vh] pr-4", children: [_jsxs(TabsContent, { value: "basic", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company-name", className: "text-sm font-medium", children: "Company Name *" }), _jsx(Input, { id: "company-name", placeholder: "Enter company name", value: newCompany.name, onChange: (e) => setNewCompany({ ...newCompany, name: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company-type", className: "text-sm font-medium", children: "Company Type *" }), _jsxs(Select, { value: newCompany.type, onValueChange: (value) => setNewCompany({ ...newCompany, type: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select company type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "corporation", children: "Corporation" }), _jsx(SelectItem, { value: "llc", children: "LLC" }), _jsx(SelectItem, { value: "partnership", children: "Partnership" }), _jsx(SelectItem, { value: "nonprofit", children: "Non-Profit" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "industry", className: "text-sm font-medium", children: "Industry *" }), _jsxs(Select, { value: newCompany.industry, onValueChange: (value) => setNewCompany({ ...newCompany, industry: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select industry" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "technology", children: "Technology" }), _jsx(SelectItem, { value: "finance", children: "Finance & Banking" }), _jsx(SelectItem, { value: "manufacturing", children: "Manufacturing" }), _jsx(SelectItem, { value: "healthcare", children: "Healthcare" }), _jsx(SelectItem, { value: "energy", children: "Energy & Utilities" }), _jsx(SelectItem, { value: "consulting", children: "Consulting" }), _jsx(SelectItem, { value: "retail", children: "Retail" }), _jsx(SelectItem, { value: "telecommunications", children: "Telecommunications" }), _jsx(SelectItem, { value: "transportation", children: "Transportation" }), _jsx(SelectItem, { value: "education", children: "Education" }), _jsx(SelectItem, { value: "government", children: "Government" }), _jsx(SelectItem, { value: "other", children: "Other" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "location", className: "text-sm font-medium", children: "Location *" }), _jsx(Input, { id: "location", placeholder: "City, Country", value: newCompany.location, onChange: (e) => setNewCompany({ ...newCompany, location: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", className: "text-sm font-medium", children: "Email *" }), _jsx(Input, { id: "email", type: "email", placeholder: "contact@company.com", value: newCompany.email, onChange: (e) => setNewCompany({ ...newCompany, email: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", className: "text-sm font-medium", children: "Phone" }), _jsx(Input, { id: "phone", placeholder: "+1 (555) 123-4567", value: newCompany.phone, onChange: (e) => setNewCompany({ ...newCompany, phone: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "website", className: "text-sm font-medium", children: "Website" }), _jsx(Input, { id: "website", placeholder: "www.company.com", value: newCompany.website, onChange: (e) => setNewCompany({ ...newCompany, website: e.target.value }), className: "h-10" })] })] }), _jsxs(TabsContent, { value: "business", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "employees", className: "text-sm font-medium", children: "Number of Employees *" }), _jsx(Input, { id: "employees", type: "number", placeholder: "1000", value: newCompany.employees, onChange: (e) => setNewCompany({ ...newCompany, employees: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "revenue", className: "text-sm font-medium", children: "Annual Revenue (Millions)" }), _jsx(Input, { id: "revenue", type: "number", placeholder: "50", value: newCompany.revenue, onChange: (e) => setNewCompany({ ...newCompany, revenue: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "established", className: "text-sm font-medium", children: "Year Established" }), _jsx(Input, { id: "established", type: "number", placeholder: "2010", value: newCompany.established, onChange: (e) => setNewCompany({ ...newCompany, established: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company-size", className: "text-sm font-medium", children: "Company Size Category" }), _jsxs(Select, { value: newCompany.companySize, onValueChange: (value) => setNewCompany({ ...newCompany, companySize: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select size category" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "startup", children: "Starp (1-50)" }), _jsx(SelectItem, { value: "small", children: "Small (51-200)" }), _jsx(SelectItem, { value: "medium", children: "Medium (201-1000)" }), _jsx(SelectItem, { value: "large", children: "Large (1001-5000)" }), _jsx(SelectItem, { value: "enterprise", children: "Enterprise (5000+)" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "credit-rating", className: "text-sm font-medium", children: "Credit Rating" }), _jsxs(Select, { value: newCompany.creditRating, onValueChange: (value) => setNewCompany({ ...newCompany, creditRating: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select credit rating" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "AAA", children: "AAA" }), _jsx(SelectItem, { value: "AA", children: "AA" }), _jsx(SelectItem, { value: "A", children: "A" }), _jsx(SelectItem, { value: "BBB", children: "BBB" }), _jsx(SelectItem, { value: "BB", children: "BB" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "payment-terms", className: "text-sm font-medium", children: "Payment Terms" }), _jsxs(Select, { value: newCompany.paymentTerms, onValueChange: (value) => setNewCompany({ ...newCompany, paymentTerms: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select payment terms" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Net 15", children: "Net 15" }), _jsx(SelectItem, { value: "Net 30", children: "Net 30" }), _jsx(SelectItem, { value: "Net 45", children: "Net 45" }), _jsx(SelectItem, { value: "Net 60", children: "Net 60" })] })] })] })] })] }), _jsxs(TabsContent, { value: "travel", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "travel-budget", className: "text-sm font-medium", children: "Annual Travel Budget *" }), _jsx(Input, { id: "travel-budget", placeholder: "e.g., 2.5M", value: newCompany.travelBudget, onChange: (e) => setNewCompany({ ...newCompany, travelBudget: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "annual-travel-volume", className: "text-sm font-medium", children: "Annual Travel Volume" }), _jsx(Input, { id: "annual-travel-volume", placeholder: "e.g., 5,000 trips", value: newCompany.annualTravelVolume, onChange: (e) => setNewCompany({ ...newCompany, annualTravelVolume: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "travel-frequency", className: "text-sm font-medium", children: "Travel Frequency" }), _jsxs(Select, { value: newCompany.travelFrequency, onValueChange: (value) => setNewCompany({ ...newCompany, travelFrequency: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select frequency" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Daily", children: "Daily" }), _jsx(SelectItem, { value: "Weekly", children: "Weekly" }), _jsx(SelectItem, { value: "Monthly", children: "Monthly" }), _jsx(SelectItem, { value: "Quarterly", children: "Quarterly" }), _jsx(SelectItem, { value: "Bi-weekly", children: "Bi-weekly" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "preferred-class", className: "text-sm font-medium", children: "Preferred Travel Class" }), _jsxs(Select, { value: newCompany.preferredClass, onValueChange: (value) => setNewCompany({ ...newCompany, preferredClass: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select class preference" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Economy", children: "Economy" }), _jsx(SelectItem, { value: "Economy Plus", children: "Economy Plus" }), _jsx(SelectItem, { value: "Business", children: "Business" }), _jsx(SelectItem, { value: "First", children: "First Class" }), _jsx(SelectItem, { value: "Business/First", children: "Business/First" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "sustainability-focus", className: "text-sm font-medium", children: "Sustainability Focus" }), _jsxs(Select, { value: newCompany.sustainabilityFocus, onValueChange: (value) => setNewCompany({ ...newCompany, sustainabilityFocus: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select sustainability level" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Very High", children: "Very High" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "risk-level", className: "text-sm font-medium", children: "Risk Level" }), _jsxs(Select, { value: newCompany.riskLevel, onValueChange: (value) => setNewCompany({ ...newCompany, riskLevel: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select risk level" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Very Low", children: "Very Low" }), _jsx(SelectItem, { value: "Low", children: "Low" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "High", children: "High" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "current-airlines", className: "text-sm font-medium", children: "Current Airlines (comma-separated)" }), _jsx(Input, { id: "current-airlines", placeholder: "e.g., United, Delta, American", value: newCompany.currentAirlines, onChange: (e) => setNewCompany({ ...newCompany, currentAirlines: e.target.value }), className: "h-10" })] })] }), _jsxs(TabsContent, { value: "additional", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "expansion-plans", className: "text-sm font-medium", children: "Expansion Plans" }), _jsxs(Select, { value: newCompany.expansionPlans, onValueChange: (value) => setNewCompany({ ...newCompany, expansionPlans: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select expansion plans" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Aggressive", children: "Aggressive" }), _jsx(SelectItem, { value: "Moderate", children: "Moderate" }), _jsx(SelectItem, { value: "Conservative", children: "Conservative" }), _jsx(SelectItem, { value: "Rapid", children: "Rapid" }), _jsx(SelectItem, { value: "Stable", children: "Stable" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "specialties", className: "text-sm font-medium", children: "Specialties (comma-separated)" }), _jsx(Textarea, { id: "specialties", placeholder: "Enterprise Software, Cloud Solutions, AI/ML Services", value: newCompany.specialties, onChange: (e) => setNewCompany({ ...newCompany, specialties: e.target.value }), className: "min-h-[80px] resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "technology-integration", className: "text-sm font-medium", children: "Technology Integration (comma-separated)" }), _jsx(Textarea, { id: "technology-integration", placeholder: "API, Mobile App, Expense Management", value: newCompany.technologyIntegration, onChange: (e) => setNewCompany({ ...newCompany, technologyIntegration: e.target.value }), className: "min-h-[80px] resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "notes", className: "text-sm font-medium", children: "Additional Notes" }), _jsx(Textarea, { id: "notes", placeholder: "Any additional information about the company...", value: newCompany.notes, onChange: (e) => setNewCompany({ ...newCompany, notes: e.target.value }), className: "min-h-[120px] resize-none" })] })] })] })] }), _jsxs(DialogFooter, { className: "pt-6 border-t border-gray-300 gap-3", children: [_jsx(Button, { variant: "outline", className: "border-gray-300 text-gray-700 hover:bg-gray-50", onClick: () => setShowAddCompanyDialog(false), children: "Cancel" }), _jsx(Button, { onClick: handleAddCompany, disabled: !isFormValid() || isSubmitting, className: "bg-orange-500 hover:bg-orange-600 text-white", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "Add Lead"] })) })] })] }) }), _jsx(Dialog, { open: showInitiateCallModal, onOpenChange: setShowInitiateCallModal, children: _jsxs(DialogContent, { className: "max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(PhoneCall, { className: "h-5 w-5 text-blue-600" }), "Initiate Call - ", selectedLeadForAction?.company] }), _jsxs(DialogDescription, { children: ["Schedule a phone call with ", selectedLeadForAction?.contact, " at ", selectedLeadForAction?.company] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Call Type" }), _jsxs(Select, { defaultValue: "discovery", children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "discovery", children: "Discovery Call" }), _jsx(SelectItem, { value: "follow-up", children: "Follow-up Call" }), _jsx(SelectItem, { value: "presentation", children: "Sales Presentation" }), _jsx(SelectItem, { value: "negotiation", children: "Contract Discussion" }), _jsx(SelectItem, { value: "check-in", children: "Check-in Call" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Duration (minutes)" }), _jsxs(Select, { defaultValue: "30", children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "15", children: "15 minutes" }), _jsx(SelectItem, { value: "30", children: "30 minutes" }), _jsx(SelectItem, { value: "45", children: "45 minutes" }), _jsx(SelectItem, { value: "60", children: "60 minutes" }), _jsx(SelectItem, { value: "90", children: "90 minutes" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Scheduled Date & Time" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 mt-1", children: [_jsx(Input, { type: "date", placeholder: "dd-mm-yyyy", min: new Date().toISOString().split('T')[0] }), _jsx(Input, { type: "time", placeholder: "--:--" })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Call Agenda" }), _jsx(Textarea, { placeholder: "Discovery call with Sarah Johnson from TechCorp Solutions to discuss corporate travel needs and potential partnership opportunities.", className: "mt-1 min-h-[80px]", defaultValue: `Discovery call with ${selectedLeadForAction?.contact} from ${selectedLeadForAction?.company} to discuss corporate travel needs and potential partnership opportunities.` })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Preparation Notes" }), _jsx(Textarea, { placeholder: "Any additional preparation notes or context...", className: "mt-1 min-h-[80px]", defaultValue: `Company Profile: ${selectedLeadForAction?.industry} sector, ${selectedLeadForAction?.employees} employees
Budget: ${selectedLeadForAction?.travelBudget}
Current Status: ${selectedLeadForAction?.status}
Key Topics: Travel volume, preferred airlines, booking preferences, cost optimization` })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setShowInitiateCallModal(false), className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { className: "bg-blue-600 hover:bg-blue-700 text-white", onClick: () => {
                                        toast.success(`Call scheduled with ${selectedLeadForAction?.contact}`);
                                        setShowInitiateCallModal(false);
                                        setSelectedLeadForAction(null);
                                    }, children: [_jsx(PhoneCall, { className: "h-4 w-4 mr-2" }), "Schedule Call"] })] })] }) }), _jsx(Dialog, { open: showScheduleMeetingModal, onOpenChange: setShowScheduleMeetingModal, children: _jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-lg", children: [_jsx(CalendarDays, { className: "h-5 w-5 text-blue-600" }), "Schedule Meeting - ", selectedLeadForAction?.company] }), _jsxs(DialogDescription, { className: "text-sm text-gray-600", children: ["Schedule a business meeting with ", selectedLeadForAction?.contact, " and team"] })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Type" }), _jsxs(Select, { defaultValue: "business", children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "business", children: "Business Meeting" }), _jsx(SelectItem, { value: "discovery", children: "Discovery Call" }), _jsx(SelectItem, { value: "presentation", children: "Solution Presentation" }), _jsx(SelectItem, { value: "negotiation", children: "Contract Negotiation" }), _jsx(SelectItem, { value: "follow-up", children: "Follow-up Meeting" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Duration (minutes)" }), _jsxs(Select, { defaultValue: "60", children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "30", children: "30 minutes" }), _jsx(SelectItem, { value: "45", children: "45 minutes" }), _jsx(SelectItem, { value: "60", children: "60 minutes" }), _jsx(SelectItem, { value: "90", children: "90 minutes" }), _jsx(SelectItem, { value: "120", children: "120 minutes" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Title" }), _jsx(Input, { className: "mt-1", defaultValue: `Business Meeting - ${selectedLeadForAction?.company}`, placeholder: "Enter meeting title" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Scheduled Date & Time" }), _jsxs("div", { className: "flex gap-2 mt-1", children: [_jsx(Input, { type: "date", placeholder: "dd-mm-yyyy", min: new Date().toISOString().split('T')[0], className: "flex-1" }), _jsx(Input, { type: "time", placeholder: "--:--", className: "flex-1" })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Location/Format" }), _jsxs(Select, { defaultValue: "virtual", children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "virtual", children: "Virtual Meeting" }), _jsx(SelectItem, { value: "office", children: "Office Meeting" }), _jsx(SelectItem, { value: "client-site", children: "Client Site" }), _jsx(SelectItem, { value: "conference-room", children: "Conference Room" }), _jsx(SelectItem, { value: "phone", children: "Phone Call" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Expected Attendees" }), _jsx(Input, { className: "mt-1", defaultValue: `${selectedLeadForAction?.contact} (Procurement Director)`, placeholder: "Enter attendee names and roles" })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Agenda" }), _jsx(Textarea, { className: "mt-1 min-h-[80px]", defaultValue: "Travel program requirements, solution presentation, pricing discussion, next steps", placeholder: "Enter meeting agenda items" })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Meeting Objectives" }), _jsx(Textarea, { className: "mt-1 min-h-[80px]", defaultValue: "Understand travel needs, present SOAR-AI solutions, identify decision makers, establish timeline", placeholder: "Enter meeting objectives and expected outcomes" })] })] }), _jsxs(DialogFooter, { className: "flex gap-2 pt-4 border-t", children: [_jsx(Button, { variant: "outline", onClick: () => setShowScheduleMeetingModal(false), className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { className: "bg-blue-600 hover:bg-blue-700 text-white", onClick: () => {
                                        toast.success(`Meeting scheduled with ${selectedLeadForAction?.contact}`);
                                        setShowScheduleMeetingModal(false);
                                        setSelectedLeadForAction(null);
                                    }, children: [_jsx(CalendarDays, { className: "h-4 w-4 mr-2" }), "Schedule Meeting"] })] })] }) }), _jsx(Dialog, { open: showScheduleDemoModal, onOpenChange: setShowScheduleDemoModal, children: _jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-lg", children: [_jsx(Presentation, { className: "h-5 w-5 text-purple-600" }), "Schedule Demo - TechCorp Solutions"] }), _jsx(DialogDescription, { className: "text-sm text-gray-600", children: "Schedule a product demonstration for Sarah Johnson and team" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Type" }), _jsxs(Select, { defaultValue: "product", children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "product", children: "Product Demo" }), _jsx(SelectItem, { value: "platform", children: "Platform Overview" }), _jsx(SelectItem, { value: "custom", children: "Custom Solution Demo" }), _jsx(SelectItem, { value: "integration", children: "Integration Demo" }), _jsx(SelectItem, { value: "mobile", children: "Mobile App Demo" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Duration (minutes)" }), _jsxs(Select, { defaultValue: "45", children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "30", children: "30 minutes" }), _jsx(SelectItem, { value: "45", children: "45 minutes" }), _jsx(SelectItem, { value: "60", children: "60 minutes" }), _jsx(SelectItem, { value: "90", children: "90 minutes" }), _jsx(SelectItem, { value: "120", children: "120 minutes" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Title" }), _jsx(Input, { className: "mt-1", defaultValue: `SOAR-AI Product Demo - ${selectedLeadForAction?.company}`, placeholder: "Enter demo title" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Scheduled Date & Time" }), _jsxs("div", { className: "flex gap-2 mt-1", children: [_jsx(Input, { type: "date", placeholder: "dd-mm-yyyy", min: new Date().toISOString().split('T')[0], className: "flex-1" }), _jsx(Input, { type: "time", placeholder: "--:--", className: "flex-1" })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Demo Format" }), _jsxs(Select, { defaultValue: "virtual", children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "virtual", children: "Virtual Demo" }), _jsx(SelectItem, { value: "onsite", children: "On-site Demo" }), _jsx(SelectItem, { value: "hybrid", children: "Hybrid Demo" }), _jsx(SelectItem, { value: "recorded", children: "Recorded Demo" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Expected Attendees" }), _jsx(Input, { className: "mt-1", defaultValue: `${selectedLeadForAction?.contact} (Procurement Director)`, placeholder: "Enter attendee names and roles" })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Focus Areas" }), _jsx(Textarea, { className: "mt-1 min-h-[80px]", defaultValue: "Corporate travel booking platform, expense management, travel analytics, policy compliance", placeholder: "Enter specific features or use cases to highlight during the demo" })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Preparation Notes" }), _jsx(Textarea, { className: "mt-1 min-h-[80px]", defaultValue: `Prepare demo tailored for ${selectedLeadForAction?.industry} industry. Highlight cost savings and efficiency improvements.`, placeholder: "Enter any preparation notes or context for the demo" })] })] }), _jsxs(DialogFooter, { className: "flex gap-2 pt-4 border-t", children: [_jsx(Button, { variant: "outline", onClick: () => setShowScheduleDemoModal(false), className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button, { className: "bg-purple-600 hover:bg-purple-700 text-white", onClick: () => {
                                        toast.success(`Demo scheduled with ${selectedLeadForAction?.contact}`);
                                        setShowScheduleDemoModal(false);
                                        setSelectedLeadForAction(null);
                                    }, children: [_jsx(Presentation, { className: "h-4 w-4 mr-2" }), "Schedule Demo"] })] })] }) }), _jsx(Dialog, { open: showAssignAgentModal, onOpenChange: setShowAssignAgentModal, children: _jsxs(DialogContent, { className: "max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-lg font-semibold", children: [_jsx(User, { className: "h-5 w-5 text-orange-600" }), selectedLeadForAssign?.assignedAgent ? 'Reassign Sales Agent' : 'Assign Sales Agent', " - ", selectedLeadForAssign?.company] }), _jsx(DialogDescription, { className: "text-sm text-gray-600", children: selectedLeadForAssign?.assignedAgent
                                        ? `Reassign this lead from ${selectedLeadForAssign.assignedAgent} to a sales agent for personalized follow-up and management`
                                        : 'Assign this lead to a sales agent for personalized follow-up and management' })] }), _jsxs("div", { className: "space-y-5 py-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Select Sales Agent *" }), _jsxs(Select, { value: selectedAgent, onValueChange: setSelectedAgent, children: [_jsx(SelectTrigger, { className: "w-full", children: _jsx(SelectValue, { placeholder: "Choose a sales agent..." }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Sarah Wilson", children: _jsxs("div", { className: "flex flex-col items-start py-1", children: [_jsx("div", { className: "font-medium text-gray-900", children: "Sarah Wilson" }), _jsx("div", { className: "text-xs text-gray-500", children: "Manufacturing, Healthcare \u2022 8 leads" })] }) }), _jsx(SelectItem, { value: "John Doe", children: _jsxs("div", { className: "flex flex-col items-start py-1", children: [_jsx("div", { className: "font-medium text-gray-900", children: "John Doe" }), _jsx("div", { className: "text-xs text-gray-500", children: "Technology, Finance \u2022 12 leads" })] }) }), _jsx(SelectItem, { value: "Jane Smith", children: _jsxs("div", { className: "flex flex-col items-start py-1", children: [_jsx("div", { className: "font-medium text-gray-900", children: "Jane Smith" }), _jsx("div", { className: "text-xs text-gray-500", children: "Retail, Consulting \u2022 6 leads" })] }) }), _jsx(SelectItem, { value: "Mike Johnson", children: _jsxs("div", { className: "flex flex-col items-start py-1", children: [_jsx("div", { className: "font-medium text-gray-900", children: "Mike Johnson" }), _jsx("div", { className: "text-xs text-gray-500", children: "Energy, Manufacturing \u2022 9 leads" })] }) }), _jsx(SelectItem, { value: "David Brown", children: _jsxs("div", { className: "flex flex-col items-start py-1", children: [_jsx("div", { className: "font-medium text-gray-900", children: "David Brown" }), _jsx("div", { className: "text-xs text-gray-500", children: "Healthcare, Government \u2022 4 leads" })] }) })] })] })] }), selectedLeadForAssign?.assignedAgent && selectedAgent && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsxs("div", { className: "text-sm font-medium text-blue-900", children: ["Current Agent: ", selectedLeadForAssign.assignedAgent] }), _jsxs("div", { className: "text-sm text-blue-700", children: ["New Agent: ", selectedAgent] }), _jsxs("div", { className: "text-xs text-blue-600", children: ["Email: ", selectedAgent.toLowerCase().replace(' ', '.'), "@soarai.com"] }), _jsxs("div", { className: "text-xs text-blue-600", children: ["Specialties: ", selectedAgent === 'Sarah Wilson' ? 'Manufacturing, Healthcare' :
                                                        selectedAgent === 'John Doe' ? 'Technology, Finance' :
                                                            selectedAgent === 'Jane Smith' ? 'Retail, Consulting' :
                                                                selectedAgent === 'Mike Johnson' ? 'Energy, Manufacturing' :
                                                                    'Healthcare, Government'] }), _jsxs("div", { className: "text-xs text-blue-600", children: ["Current Leads: ", selectedAgent === 'Sarah Wilson' ? '8' :
                                                        selectedAgent === 'John Doe' ? '12' :
                                                            selectedAgent === 'Jane Smith' ? '6' :
                                                                selectedAgent === 'Mike Johnson' ? '9' : '4'] })] }) })), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Assignment Priority" }), _jsxs(Select, { value: assignmentPriority, onValueChange: setAssignmentPriority, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Low Priority", children: "Low Priority" }), _jsx(SelectItem, { value: "Medium Priority", children: "Medium Priority" }), _jsx(SelectItem, { value: "High Priority", children: "High Priority" }), _jsx(SelectItem, { value: "Urgent", children: "Urgent" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Assignment Notes" }), _jsx(Textarea, { value: assignmentNotes, onChange: (e) => setAssignmentNotes(e.target.value), placeholder: "Any specific instructions or context for the assigned agent...", className: "min-h-[80px] resize-none" })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 mb-2", children: "Lead Summary" }), _jsxs("div", { className: "space-y-1 text-sm text-gray-600", children: [_jsxs("div", { children: ["Industry: ", selectedLeadForAssign?.industry] }), _jsxs("div", { children: ["Budget: ", selectedLeadForAssign?.travelBudget] }), _jsxs("div", { children: ["Score: ", selectedLeadForAssign?.score] }), _jsxs("div", { children: ["Status: ", selectedLeadForAssign?.status] }), _jsxs("div", { children: ["AI Suggestion: ", selectedLeadForAssign?.score >= 80 ? 'Send detailed cost comparison proposal. Mention case studies.' : 'Add to SMB nurture campaign. Follow up in Q4 for growth stage.'] })] })] })] }), _jsxs(DialogFooter, { className: "flex gap-2 pt-4 border-t", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowAssignAgentModal(false);
                                        setSelectedLeadForAssign(null);
                                        setSelectedAgent('');
                                        setAssignmentNotes('');
                                    }, className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsx(Button, { onClick: handleConfirmAssignAgent, disabled: !selectedAgent || isAssigning, className: "bg-orange-500 hover:bg-orange-600 text-white", children: isAssigning ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Assigning..."] })) : (_jsxs(_Fragment, { children: [_jsx(User, { className: "h-4 w-4 mr-2" }), selectedLeadForAssign?.assignedAgent ? 'Reassign Agent' : 'Assign Agent'] })) })] })] }) })] }));
}
