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
  DollarSign
} from 'lucide-react';

interface LeadManagementProps {
  onNavigate: (screen: string, filters?: any) => void;
}

// Removed static data: leadStats, recentActivity, topLeads

export function LeadManagement({ onNavigate }: LeadManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { getLeadStats, getRecentActivity, getTopLeads } = useLeadApi();
  const [leadStats, setLeadStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topLeads, setTopLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const stats = await getLeadStats('all_time');
        setLeadStats(stats);

        const activity = await getRecentActivity();
        setRecentActivity(activity);

        const leads = await getTopLeads();
        setTopLeads(leads);
      } catch (error) {
        toast.error('Failed to fetch lead data. Please try again.');
        console.error('Error fetching lead data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getLeadStats, getRecentActivity, getTopLeads]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'default';
      case 'in-progress': return 'secondary';
      case 'responded': return 'outline';
      case 'unqualified': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'qualified': return CheckCircle;
      case 'in-progress': return Clock;
      case 'responded': return MessageSquare;
      case 'unqualified': return UserX;
      default: return Users;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'qualification': return UserCheck;
      case 'email': return Mail;
      case 'response': return MessageSquare;
      case 'disqualification': return UserX;
      default: return Activity;
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'text-green-500';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Helper to render skeleton loaders
  const renderKeyMetricSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-1/3 mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );

  const renderActivitySkeleton = () => (
    <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
      <Skeleton className="w-4 h-4 rounded-full mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );

  const renderTopLeadSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Skeleton className="flex items-center justify-center w-10 h-10 rounded-lg" />
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-3 w-32 mt-1" />
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="text-right">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );


  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-muted-foreground">Manage qualified and unqualified leads with automated email campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('email-campaigns')}>
            <Mail className="h-4 w-4 mr-2" />
            Email Campaigns
          </Button>
          <Button onClick={() => onNavigate('leads-list')}>
            <Users className="h-4 w-4 mr-2" />
            View All Leads
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {renderKeyMetricSkeleton()}
            {renderKeyMetricSkeleton()}
            {renderKeyMetricSkeleton()}
            {renderKeyMetricSkeleton()}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leadStats?.totalLeads?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{leadStats?.totalChange}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leadStats?.qualifiedLeads}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{leadStats?.conversionRate}%</span> conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Open Rate</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leadStats?.emailOpenRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{leadStats?.emailOpenRateChange}%</span> from last campaign
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leadStats?.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">{leadStats?.avgResponseTimeChange}</span> improvement
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger 
            value="overview"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="qualified"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Qualified Leads
          </TabsTrigger>
          <TabsTrigger 
            value="unqualified"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Unqualified Leads
          </TabsTrigger>
          <TabsTrigger 
            value="campaigns"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Email Campaigns
          </TabsTrigger>
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
                    <span className="text-sm">Total Leads</span>
                    <span className="font-medium">{leadStats?.totalLeads?.toLocaleString()}</span>
                  </div>
                  <Progress value={leadStats ? (leadStats.contacted / leadStats.totalLeads) * 100 : 0} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contacted</span>
                    <span className="font-medium">{leadStats?.contacted}</span>
                  </div>
                  <Progress value={leadStats ? (leadStats.qualifiedLeads / leadStats.totalLeads) * 100 : 0} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Qualified</span>
                    <span className="font-medium">{leadStats?.qualifiedLeads}</span>
                  </div>
                  <Progress value={leadStats ? (leadStats.responded / leadStats.totalLeads) * 100 : 0} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Responded</span>
                    <span className="font-medium">{leadStats?.responded}</span>
                  </div>
                  <Progress value={leadStats ? (leadStats.conversionRate / 100) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest lead interactions and status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <>
                      {[...Array(4)].map((_, index) => renderActivitySkeleton())}
                    </>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No recent activity found</p>
                    </div>
                  ) : (
                    recentActivity.map((activity) => {
                      const getActivityIcon = (type: string) => {
                        switch (type) {
                          case 'qualification': return <UserCheck className="h-4 w-4 text-green-500" />;
                          case 'disqualification': return <UserX className="h-4 w-4 text-red-500" />;
                          case 'email': return <Mail className="h-4 w-4 text-blue-500" />;
                          case 'response': return <MessageSquare className="h-4 w-4 text-purple-500" />;
                          default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
                        }
                      };

                      const getStatusBadge = (status: string) => {
                        switch (status) {
                          case 'qualified': return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Qualified</Badge>;
                          case 'unqualified': return <Badge variant="destructive">Unqualified</Badge>;
                          case 'in-progress': return <Badge variant="secondary">In Progress</Badge>;
                          case 'responded': return <Badge variant="outline">Responded</Badge>;
                          default: return <Badge variant="outline">Unknown</Badge>;
                        }
                      };

                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{activity.lead}</h4>
                                <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(activity.status)}
                                <span className="text-xs text-gray-500">{activity.time}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {activity.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Qualified Leads */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Qualified Leads
                  </CardTitle>
                  <CardDescription>High-priority leads requiring immediate attention</CardDescription>
                </div>
                <Button variant="outline" onClick={() => onNavigate('qualified-leads')}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <>
                    {[...Array(3)].map((_, index) => renderTopLeadSkeleton())}
                  </>
                ) : topLeads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No top leads found</p>
                  </div>
                ) : (
                  topLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{lead.company}</h4>
                            <Badge variant={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lead.contact} • {lead.title}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{lead.industry}</span>
                            <span>{lead.employees.toLocaleString()} employees</span>
                            <span className={`font-medium ${getEngagementColor(lead.engagement)}`}>
                              {lead.engagement} engagement
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-green-500">{lead.value}</div>
                          <div className="text-sm text-muted-foreground">Score: {lead.score}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{lead.nextAction}</div>
                          <div className="text-xs text-muted-foreground">Last: {lead.lastContact}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('qualified-leads')}>
              <CardContent className="p-6 text-center">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-medium">Qualified Leads</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage high-potential prospects</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('unqualified-leads')}>
              <CardContent className="p-6 text-center">
                <UserX className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h3 className="font-medium">Unqualified Leads</h3>
                <p className="text-sm text-muted-foreground mt-1">Review and nurture prospects</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('email-campaigns')}>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">Email Campaigns</h3>
                <p className="text-sm text-muted-foreground mt-1">Automated outreach and follow-ups</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('leads-list')}>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium">Lead Analytics</h3>
                <p className="text-sm text-muted-foreground mt-1">Performance and conversion metrics</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="qualified">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You have {leadStats?.qualifiedLeads} qualified leads. 
              <Button variant="link" className="p-0 ml-1" onClick={() => onNavigate('qualified-leads')}>
                View detailed qualified leads &rarr;
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="unqualified">
          <Alert>
            <UserX className="h-4 w-4" />
            <AlertDescription>
              You have {leadStats?.unqualified} unqualified leads that may need attention.
              <Button variant="link" className="p-0 ml-1" onClick={() => onNavigate('unqualified-leads')}>
                Review unqualified leads &rarr;
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="campaigns">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Email campaigns are running with {leadStats?.emailOpenRate}% open rate.
              <Button variant="link" className="p-0 ml-1" onClick={() => onNavigate('email-campaigns')}>
                Manage email campaigns &rarr;
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}