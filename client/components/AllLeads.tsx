
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  MessageSquare,
  Edit,
  BarChart3,
  History,
  User,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  Eye,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { toast } from "sonner";

interface AllLeadsProps {
  onNavigate: (screen: string, filters?: any) => void;
}

interface Lead {
  id: number;
  company: { name: string; };
  contact: { first_name: string; last_name: string; position: string; email: string; phone: string; };
  status: string;
  source: string;
  priority: string;
  score: number;
  estimated_value: number;
  notes: string;
  assigned_to?: { username: string; };
  created_at: string;
  updated_at: string;
}

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

export function AllLeads({ onNavigate }: AllLeadsProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    industry: '',
    score: '',
    engagement: ''
  });

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/leads/');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads based on current filters
  const filteredLeads = leads.filter(lead => {
    if (filters.search && !lead.company.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !lead.contact.first_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !lead.contact.last_name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.status && lead.status !== filters.status) {
      return false;
    }
    
    if (filters.score) {
      if (filters.score === 'high' && lead.score < 80) return false;
      if (filters.score === 'medium' && (lead.score < 60 || lead.score >= 80)) return false;
      if (filters.score === 'low' && lead.score >= 60) return false;
    }
    
    return true;
  });

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
      setSelectAll(true);
    } else {
      setSelectedLeads([]);
      setSelectAll(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      industry: '',
      score: '',
      engagement: ''
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

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

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={fetchLeads}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button className="flex items-center gap-1 hover:text-orange-600">
          <Users className="h-4 w-4" />
          AI Assistant
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">All Leads</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Leads</h1>
          <p className="text-gray-600">Comprehensive lead management with status tracking and AI suggestions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-600 border-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="text-gray-600 border-gray-300" onClick={fetchLeads}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="text-gray-600 border-gray-300">
            <Mail className="h-4 w-4 mr-2" />
            Email Campaign
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg">Lead Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Company or contact..."
                  className="pl-10 border-gray-300"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Industry</Label>
              <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Score</Label>
              <Select value={filters.score} onValueChange={(value) => setFilters({...filters, score: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All scores</SelectItem>
                  <SelectItem value="high">High (80+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79)</SelectItem>
                  <SelectItem value="low">Low (<60)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Engagement */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Engagement</Label>
              <Select value={filters.engagement} onValueChange={(value) => setFilters({...filters, engagement: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="text-gray-600 border-gray-300">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            All Leads ({filteredLeads.length} results)
          </h2>
          <p className="text-sm text-gray-600">Comprehensive lead management with status tracking and AI suggestions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="select-all" className="text-sm text-gray-600">Select All</Label>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Lead Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{lead.company.name}</h3>
                      <Badge className={`${statusColors[lead.status] || 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded-md`}>
                        {lead.status === 'contacted' ? 'Contacted Ready' : 
                         lead.status === 'qualified' ? 'Decision Maker' :
                         lead.status}
                      </Badge>
                      {lead.status === 'contacted' && (
                        <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 font-medium">
                      {lead.contact.first_name} {lead.contact.last_name} • {lead.contact.position}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.contact.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.contact.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        San Francisco, CA
                      </span>
                      <span className="flex items-center gap-1 text-blue-600 hover:underline cursor-pointer">
                        <ExternalLink className="h-3 w-3" />
                        Website
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(lead.score)} mb-1`}>
                    Score: {lead.score}
                  </div>
                  <div className="text-green-600 font-semibold">
                    ${lead.estimated_value?.toLocaleString() || '450K'} budget
                  </div>
                  <Badge className={`${urgencyColors['high'] || 'bg-red-100 text-red-800'} text-xs mt-1`}>
                    High urgency
                  </Badge>
                </div>
              </div>

              {/* Next Action Alert */}
              {lead.status === 'contacted' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-red-800">Next Action: Move to contract</p>
                          <p className="text-sm text-red-700">Lead is qualified and ready for contract negotiation.</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Industry:</span> Technology
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Company Size:</span> 2,500 employees
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Revenue:</span> $150M
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Source:</span> LinkedIn
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Assigned Agent:</span> John Smith
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Last Contact:</span> 2024-07-12
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Follow-up Date:</span> 2024-07-15
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Engagement:</span> 
                    <span className="text-green-600 ml-1">High</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Enterprise</Badge>
                    <Badge variant="outline" className="text-xs">High-Value</Badge>
                    <Badge variant="outline" className="text-xs">Decision Maker</Badge>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800">AI Suggestion:</p>
                    <p className="text-sm text-blue-700">
                      Schedule product demo within 3 days. High conversion probability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {lead.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-700 border-gray-300">
                    <Edit className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Campaign
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-700 border-gray-300">
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm" variant="outline" className="text-purple-700 border-purple-300 bg-purple-50">
                    <User className="h-4 w-4 mr-1" />
                    Reassign
                  </Button>
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Actions
                  </Button>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
                    <Target className="h-4 w-4 mr-1" />
                    Create Offer
                  </Button>
                  <Button size="sm" variant="outline" className="text-green-700 border-green-300 bg-green-50">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Move to Opportunity
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                    Disqualify
                  </Button>
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

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or add new leads to get started.</p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      )}
    </div>
  );
}
