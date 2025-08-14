
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { useLeadApi } from '../hooks/api/useLeadApi';
import { toast } from 'sonner';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  BarChart3,
  MessageSquare,
  Star,
  ArrowRight,
  Zap,
  Brain,
  Globe,
  Building2,
  DollarSign,
  RefreshCw
} from 'lucide-react';

interface LeadManagementProps {
  onNavigate: (screen: string, filters?: any) => void;
}

export function LeadManagement({ onNavigate }: LeadManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { getLeadStats, getRecentActivity, getTopLeads, getLeads } = useLeadApi();
  const [leadStats, setLeadStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topLeads, setTopLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const [stats, activity, leads] = await Promise.all([
        getLeadStats('all_time'),
        getRecentActivity(),
        getTopLeads()
      ]);
      
      setLeadStats(stats);
      setRecentActivity(activity);
      setTopLeads(leads);
    } catch (error) {
      toast.error('Failed to fetch lead data. Please try again.');
      console.error('Error fetching lead data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'default';
      case 'contacted': return 'secondary';
      case 'responded': return 'outline';
      case 'unqualified': return 'destructive';
      default: return 'outline';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'qualification': return 'text-green-600 bg-green-50 border-green-200';
      case 'disqualification': return 'text-red-600 bg-red-50 border-red-200';
      case 'email': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'response': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground">
            Manage qualified and unqualified leads with automated email campaigns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigate('email-campaigns')}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Email Campaigns
          </Button>
          <Button 
            size="sm"
            onClick={() => onNavigate('all-leads')}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View All Leads
          </Button>
        </div>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('all-leads')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats?.totalLeads?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              <span className={leadStats?.totalChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {leadStats?.totalChange >= 0 ? '+' : ''}{leadStats?.totalChange || 0}%
              </span> from last period
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('qualified-leads')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats?.qualifiedLeads || '0'}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{leadStats?.conversionRate || 0}%</span> conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('email-campaigns')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats?.emailOpenRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={leadStats?.emailOpenRateChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {leadStats?.emailOpenRateChange >= 0 ? '+' : ''}{leadStats?.emailOpenRateChange || 0}%
              </span> from last campaign
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats?.avgResponseTime || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500">{leadStats?.avgResponseTimeChange || 'No change'}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qualified">Qualified Leads</TabsTrigger>
          <TabsTrigger value="unqualified">Unqualified Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Lead Pipeline Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Lead Pipeline
                </CardTitle>
                <CardDescription>Current lead distribution and conversion funnel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Leads</span>
                    <span className="font-bold">{leadStats?.totalLeads?.toLocaleString() || '0'}</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Contacted</span>
                    <span className="font-bold">{leadStats?.contacted || '0'}</span>
                  </div>
                  <Progress 
                    value={leadStats ? (leadStats.contacted / leadStats.totalLeads) * 100 : 0} 
                    className="h-3" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Qualified</span>
                    <span className="font-bold">{leadStats?.qualifiedLeads || '0'}</span>
                  </div>
                  <Progress 
                    value={leadStats ? (leadStats.qualifiedLeads / leadStats.totalLeads) * 100 : 0} 
                    className="h-3" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Responded</span>
                    <span className="font-bold">{leadStats?.responded || '0'}</span>
                  </div>
                  <Progress 
                    value={leadStats ? (leadStats.responded / leadStats.totalLeads) * 100 : 0} 
                    className="h-3" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest lead interactions and status changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div 
                      key={activity.id || index} 
                      className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityTypeColor(activity.type)}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.lead}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{activity.value}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Qualified Leads */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Qualified Leads
                </CardTitle>
                <CardDescription>High-priority leads requiring immediate attention</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('qualified-leads')}
                className="text-blue-600 hover:text-blue-700"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLeads.length > 0 ? (
                  topLeads.map((lead, index) => (
                    <div 
                      key={lead.id || index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate('all-leads', { leadId: lead.id })}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {lead.company?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{lead.company}</h4>
                          <p className="text-sm text-gray-600">{lead.contact} • {lead.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {lead.industry}
                            </Badge>
                            <span className="text-xs text-gray-500">{lead.employees} employees</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Engagement</div>
                          <Badge className={`text-xs ${getEngagementColor(lead.engagement)}`}>
                            {lead.engagement}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Score</div>
                          <div className="text-lg font-bold text-gray-900">{lead.score}/100</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Value</div>
                          <div className="text-lg font-bold text-green-600">{lead.value}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Next Action</div>
                          <div className="text-sm text-gray-900">{lead.nextAction}</div>
                          <div className="text-xs text-gray-500">{lead.lastContact}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No qualified leads yet</p>
                    <p className="text-sm">Start by importing or adding new prospects</p>
                    <Button className="mt-4" onClick={() => onNavigate('corporate-search')}>
                      Find Prospects
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualified" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Qualified Leads
              </CardTitle>
              <CardDescription>
                Manage high-potential prospects and conversion opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  {leadStats?.qualifiedLeads || 0} qualified leads • {leadStats?.conversionRate || 0}% conversion rate
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate('qualified-leads')}
                  >
                    View Details
                  </Button>
                  <Button size="sm" onClick={() => onNavigate('email-campaigns')}>
                    Create Campaign
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate('qualified-leads')}>
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold">Qualified Leads</h3>
                  <p className="text-sm text-gray-600 mb-2">Manage high-potential prospects</p>
                  <Button variant="ghost" size="sm">Manage →</Button>
                </Card>
                
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate('email-campaigns')}>
                  <Mail className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">Email Campaigns</h3>
                  <p className="text-sm text-gray-600 mb-2">Automated outreach and follow-ups</p>
                  <Button variant="ghost" size="sm">Create →</Button>
                </Card>
                
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate('opportunities')}>
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold">Lead Analytics</h3>
                  <p className="text-sm text-gray-600 mb-2">Performance and conversion metrics</p>
                  <Button variant="ghost" size="sm">Analyze →</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unqualified" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-500" />
                Unqualified Leads
              </CardTitle>
              <CardDescription>
                Review and nurture prospects that didn't meet initial criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  {leadStats?.unqualified || 0} unqualified leads for review and nurturing
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate('unqualified-leads')}
                  >
                    View All
                  </Button>
                  <Button size="sm" onClick={() => onNavigate('email-campaigns')}>
                    Create Nurture Campaign
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Consider setting up automated nurture campaigns for unqualified leads to maintain engagement and identify future opportunities.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-500" />
                Email Campaigns
              </CardTitle>
              <CardDescription>
                Automated outreach and follow-up campaigns for lead nurturing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  {leadStats?.emailOpenRate || 0}% average open rate • {leadStats?.emailOpenRateChange >= 0 ? '+' : ''}{leadStats?.emailOpenRateChange || 0}% from last campaign
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate('email-campaigns')}
                  >
                    View Campaigns
                  </Button>
                  <Button size="sm" onClick={() => onNavigate('email-campaigns')}>
                    Create Campaign
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold">Quick Actions</h3>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onNavigate('email-campaigns')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Welcome Email
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onNavigate('email-campaigns')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Follow-up Sequence
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onNavigate('email-campaigns')}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      AI-Generated Campaign
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Campaign Performance</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Open Rate</span>
                      <span className="font-semibold">{leadStats?.emailOpenRate || 0}%</span>
                    </div>
                    <Progress value={leadStats?.emailOpenRate || 0} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Response Rate</span>
                      <span className="font-semibold">{Math.round((leadStats?.responded || 0) / (leadStats?.contacted || 1) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((leadStats?.responded || 0) / (leadStats?.contacted || 1) * 100)} className="h-2" />
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
