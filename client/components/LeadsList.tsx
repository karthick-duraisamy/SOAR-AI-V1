
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  User,
  Star,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useLeadApi } from '../hooks/api/useLeadApi';
import { useDebounce } from '../hooks/useDebounce';

interface Lead {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  priority: 'low' | 'medium' | 'high';
  source: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const LeadsList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { getLeads, loading, error } = useLeadApi();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data || []);
    } catch (err) {
      console.error('Failed to load leads:', err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.company_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      lead.contact_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      unqualified: 'bg-red-100 text-red-800',
      converted: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading leads: {error}</p>
        <Button onClick={loadLeads} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
          <p className="text-gray-600">Manage and track your sales leads</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="unqualified">Unqualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                    {lead.company_name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <User className="w-3 h-3 mr-1" />
                    {lead.contact_name}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Lead
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Status and Priority */}
              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                  <Star className="w-3 h-3 mr-1" />
                  {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-3 h-3 mr-2" />
                  <span className="truncate">{lead.email}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-3 h-3 mr-2" />
                    <span>{lead.phone}</span>
                  </div>
                )}
              </div>

              {/* Source */}
              <div className="flex items-center text-sm text-gray-600">
                <Building className="w-3 h-3 mr-2" />
                <span>Source: {lead.source}</span>
              </div>

              {/* Date */}
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-3 h-3 mr-2" />
                <span>Created: {formatDate(lead.created_at)}</span>
              </div>

              {/* Notes Preview */}
              {lead.notes && (
                <div className="text-sm text-gray-600 line-clamp-2">
                  <strong>Notes:</strong> {lead.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first lead'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
