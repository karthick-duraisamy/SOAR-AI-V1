import { useState, useEffect } from 'react';
import { useCampaignApi } from '../hooks/api/useCampaignApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Mail, 
  Send, 
  Calendar, 
  Users, 
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Play,
  Pause,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Target,
  Zap,
  RefreshCw,
  Download,
  Copy,
  MessageSquare,
  Star,
  Globe,
  Filter,
  Search,
  Upload,
  FileText,
  Lightbulb,
  Activity,
  MousePointer,
  UserMinus,
  Linkedin,
  MessageCircle,
  ExternalLink,
  Save,
  X,
  Info,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  CalendarDays,
  SortAsc,
  SortDesc,
  ChevronRight,
  Building2,
  User,
  MailCheck,
  MailX,
  Reply,
  MousePointerClick,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';


interface EmailCampaignsProps {
  onNavigate: (screen: string, filters?: any) => void;
}

interface Campaign {
  id: number;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  subject_line: string;
  email_content: string;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  target_leads_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
  updated_at: string;
}

export function EmailCampaigns({ onNavigate }: EmailCampaignsProps) {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewTab, setViewTab] = useState('overview');
  const [campaignList, setCampaignList] = useState<Campaign[]>([]);
  const [launchingCampaign, setLaunchingCampaign] = useState<number | null>(null);
  const [checkingSmtp, setCheckingSmtp] = useState(false);

  const { getCampaigns, launchCampaign, checkSmtpStatus: fetchSmtpStatus, loading: campaignsLoading, error: campaignsError } = useCampaignApi();

  // Helper function to calculate overall metrics from API data
  const calculateMetrics = () => {
    if (campaignList.length === 0) {
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalReplied: 0,
        totalConverted: 0,
        avgOpenRate: 0,
        avgClickRate: 0,
        avgReplyRate: 0,
        avgConversionRate: 0
      };
    }

    const metrics = campaignList.reduce((acc, campaign) => {
      acc.totalSent += campaign.emails_sent;
      acc.totalOpened += campaign.emails_opened;
      acc.totalClicked += campaign.emails_clicked;
      acc.totalOpenRate += campaign.open_rate;
      acc.totalClickRate += campaign.click_rate;
      return acc;
    }, {
      totalSent: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalOpenRate: 0,
      totalClickRate: 0
    });

    // Calculate delivered (assume 98% delivery rate)
    const totalDelivered = Math.floor(metrics.totalSent * 0.98);

    // Calculate replied and converted (estimates based on click rate)
    const totalReplied = Math.floor(metrics.totalClicked * 0.3);
    const totalConverted = Math.floor(metrics.totalClicked * 0.1);

    return {
      totalCampaigns: campaignList.length,
      activeCampaigns: campaignList.filter(c => c.status === 'active').length,
      totalSent: metrics.totalSent,
      totalDelivered: totalDelivered,
      totalOpened: metrics.totalOpened,
      totalClicked: metrics.totalClicked,
      totalReplied: totalReplied,
      totalConverted: totalConverted,
      avgOpenRate: campaignList.length > 0 ? Math.round(metrics.totalOpenRate / campaignList.length) : 0,
      avgClickRate: campaignList.length > 0 ? Math.round(metrics.totalClickRate / campaignList.length) : 0,
      avgReplyRate: metrics.totalSent > 0 ? Math.round((totalReplied / metrics.totalSent) * 100) : 0,
      avgConversionRate: metrics.totalSent > 0 ? Math.round((totalConverted / metrics.totalSent) * 100) : 0
    };
  };

  const metrics = calculateMetrics();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const fetchedCampaigns = await getCampaigns();

      if (fetchedCampaigns && Array.isArray(fetchedCampaigns)) {
        setCampaignList(fetchedCampaigns);
      } else {
        console.warn('No campaigns data received from API');
        setCampaignList([]);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      setCampaignList([]);
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowViewDialog(true);
    setViewTab('overview');
  };

  const handleLaunchCampaign = async (campaignId: string) => {
    try {
      setLaunchingCampaign(campaignId);
      const response = await launchCampaign(campaignId);

      if (response.success) {
        const successRate = response.smtp_details?.success_rate || '0%';
        const totalProcessed = response.smtp_details?.total_processed || 0;

        toast.success(`Campaign launched successfully! ${response.emails_sent} emails sent out of ${totalProcessed} (${successRate} success rate)`);

        // Show detailed SMTP responses if available
        if (response.smtp_responses && response.smtp_responses.length > 0) {
          console.log('SMTP Response Details:', response.smtp_responses);
          console.log('Log file location:', response.log_file);

          // Count different status types
          const statusCounts = response.smtp_responses.reduce((acc: any, resp: any) => {
            acc[resp.status] = (acc[resp.status] || 0) + 1;
            return acc;
          }, {});

          console.log('SMTP Status Summary:', statusCounts);
        }

        // Refresh campaigns list
        loadCampaigns();
      } else {
        const errorDetails = response.smtp_responses ? 
          `\n\nSMTP Errors:\n${response.smtp_responses.map((r: any) => `${r.email}: ${r.message}`).join('\n')}` : '';

        toast.error(`${response.message}${errorDetails}`);

        // Log detailed error information
        if (response.log_file) {
          console.log('Error log file:', response.log_file);
        }
      }
    } catch (error: any) {
      toast.error(`Error launching campaign: ${error.message}`);
    } finally {
      setLaunchingCampaign(null);
    }
  };

  const checkSmtpStatus = async () => {
    setCheckingSmtp(true);
    try {
      const response = await fetchSmtpStatus();
      if (response.status === 'connected') {
        toast.success(`SMTP Server is connected successfully.`);
      } else {
        toast.error(`SMTP Server connection failed: ${response.message}`);
      }
    } catch (error: any) {
      toast.error(`Error checking SMTP status: ${error.message}`);
    } finally {
      setCheckingSmtp(false);
    }
  };

  const viewSmtpLogs = async (campaignId: string) => {
    try {
      const response = await fetchSmtpStatus(campaignId); // Assuming fetchSmtpStatus can also fetch logs with campaignId
      if (response.log_file) {
        console.log(`SMTP Logs for Campaign ${campaignId}:`, response.log_file);
        // Optionally, open the log file in a new tab or display in a modal
        window.open(response.log_file, '_blank');
      } else {
        toast.info('No SMTP logs found for this campaign.');
      }
    } catch (error: any) {
      toast.error(`Error fetching SMTP logs: ${error.message}`);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignTypeLabel = (type: string) => {
    switch (type) {
      case 'nurture':
        return 'Lead Nurture';
      case 'follow_up':
        return 'Follow-up';
      case 'promotion':
        return 'Promotional';
      case 'newsletter':
        return 'Newsletter';
      case 'announcement':
        return 'Announcement';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPerformanceScore = (campaign: Campaign) => {
    if (campaign.open_rate >= 50) return 'high';
    if (campaign.open_rate >= 25) return 'medium';
    return 'low';
  };

  return (
    <div className="w-full h-full space-y-6 p-5" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'var(--font-family)'
          }}>
            Email Campaigns
          </h2>
          <p style={{ 
            fontSize: 'var(--text-base)',
            color: 'var(--color-muted-foreground)',
            fontFamily: 'var(--font-family)'
          }}>
            Automated email outreach and nurturing campaigns
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={checkSmtpStatus}
            disabled={checkingSmtp}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            {checkingSmtp ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-green-300 border-t-green-600" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Check SMTP Status
          </Button>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {campaignsError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load campaigns: {campaignsError}
          </AlertDescription>
        </Alert>
      )}

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card style={{ 
            fontFamily: 'var(--font-family)',
            border: '1px solid #C9C9C9',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)'
              }}>
                Total Campaigns
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)',
                color: 'var(--color-foreground)'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  metrics.totalCampaigns
                )}
              </div>
              <div style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
                  </div>
                ) : (
                  `${metrics.activeCampaigns} active`
                )}
              </div>
            </CardContent>
          </Card>

          <Card style={{ 
            fontFamily: 'var(--font-family)',
            border: '1px solid #C9C9C9',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)'
              }}>
                Open Rate
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)',
                color: metrics.avgOpenRate >= 25 ? '#10b981' : metrics.avgOpenRate >= 15 ? '#f59e0b' : '#ef4444'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  `${metrics.avgOpenRate}%`
                )}
              </div>
              <div style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-3 w-20 bg-gray-200 rounded mt-1"></div>
                  </div>
                ) : (
                  `${metrics.totalOpened.toLocaleString()} total opens`
                )}
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(metrics.avgOpenRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ 
            fontFamily: 'var(--font-family)',
            border: '1px solid #C9C9C9',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)'
              }}>
                Click Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)',
                color: metrics.avgClickRate >= 5 ? '#10b981' : metrics.avgClickRate >= 2 ? '#f59e0b' : '#ef4444'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  `${metrics.avgClickRate}%`
                )}
              </div>
              <div style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-3 w-20 bg-gray-200 rounded mt-1"></div>
                  </div>
                ) : (
                  `${metrics.totalClicked.toLocaleString()} total clicks`
                )}
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(metrics.avgClickRate * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ 
            fontFamily: 'var(--font-family)',
            border: '1px solid #C9C9C9',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)'
              }}>
                Total Targets
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)',
                color: 'var(--color-foreground)'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  metrics.totalSent.toLocaleString()
                )}
              </div>
              <div style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                {campaignsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-3 w-24 bg-gray-200 rounded mt-1"></div>
                  </div>
                ) : (
                  `${Math.round((metrics.totalDelivered / metrics.totalSent) * 100) || 0}% delivery rate`
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Main Content with Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
        style={{ fontFamily: 'var(--font-family)' }}
      >
        <TabsList 
          className="grid w-full grid-cols-4"
          style={{
            backgroundColor: 'var(--color-tabs-background)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-xs)',
            fontFamily: 'var(--font-family)'
          }}
        >
          <TabsTrigger 
            value="campaigns"
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              color: activeTab === 'campaigns' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
              borderBottom: activeTab === 'campaigns' ? '1px solid var(--color-tabs-active-border)' : 'none',
              backgroundColor: 'transparent'
            }}
          >
            Campaigns
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              color: activeTab === 'templates' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
              borderBottom: activeTab === 'templates' ? '1px solid var(--color-tabs-active-border)' : 'none',
              backgroundColor: 'transparent'
            }}
          >
            Templates
          </TabsTrigger>
          {/* <TabsTrigger 
            value="automation"
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              color: activeTab === 'automation' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
              borderBottom: activeTab === 'automation' ? '1px solid var(--color-tabs-active-border)' : 'none',
              backgroundColor: 'transparent'
            }}
          >
            Automation
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              color: activeTab === 'analytics' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
              borderBottom: activeTab === 'analytics' ? '1px solid var(--color-tabs-active-border)' : 'none',
              backgroundColor: 'transparent'
            }}
          >
            Analytics
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6" style={{ marginTop: 'var(--space-lg)' }}>
          {/* Campaign Cards */}
          <div className="grid grid-cols-1 gap-4">
            {campaignsLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading campaigns...</span>
              </div>
            )}

            {!campaignsLoading && campaignList.length === 0 && (
              <Card style={{ 
                fontFamily: 'var(--font-family)',
                border: '1px solid #C9C9C9',
                borderRadius: 'var(--radius-md)'
              }}>
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first email campaign.</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>
            )}

            {!campaignsLoading && campaignList.map((campaign) => (
              <Card 
                key={campaign.id}
                style={{ 
                  fontFamily: 'var(--font-family)',
                  border: '1px solid #C9C9C9',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease-in-out'
                }}
                className="hover:shadow-md"
                onClick={() => handleViewCampaign(campaign)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ 
                      fontSize: 'var(--text-lg)', 
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      {campaign.name}
                    </CardTitle>
                    <Badge 
                      className={getStatusBadgeColor(campaign.status)}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-muted-foreground)',
                    fontFamily: 'var(--font-family)'
                  }}>
                    {campaign.subject_line}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{getCampaignTypeLabel(campaign.campaign_type)}</span>
                    <span>•</span>
                    <span>Created {formatDate(campaign.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {campaign.emails_sent.toLocaleString()}
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Sent
                      </p>
                    </div>
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {Math.round(campaign.open_rate)}%
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Open Rate
                      </p>
                    </div>
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {Math.round(campaign.click_rate)}%
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Click Rate
                      </p>
                    </div>
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {campaign.target_leads_count || 0}
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Targets
                      </p>
                    </div>
                  </div>

                  {/* Campaign Actions */}
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCampaign(campaign);
                      }}
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)'
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {(campaign.status === 'active' || campaign.status === 'completed') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewSmtpLogs(campaign.id.toString());
                        }}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                    )}
                    {campaign.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchCampaign(campaign.id.toString());
                        }}
                        disabled={launchingCampaign === campaign.id}
                        style={{
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-primary-foreground)'
                        }}
                      >
                        {launchingCampaign === campaign.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            Launching...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Launch Campaign
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Performance Indicators */}
                  <div className="mt-3 flex gap-2 text-xs">
                    <div className={`px-2 py-1 rounded-full text-white ${campaign.open_rate >= 25 ? 'bg-green-500' : campaign.open_rate >= 15 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {campaign.open_rate >= 25 ? 'High Open Rate' : campaign.open_rate >= 15 ? 'Average Open Rate' : 'Low Open Rate'}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-white ${campaign.click_rate >= 5 ? 'bg-green-500' : campaign.click_rate >= 2 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {campaign.click_rate >= 5 ? 'High CTR' : campaign.click_rate >= 2 ? 'Average CTR' : 'Low CTR'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6" style={{ marginTop: 'var(--space-lg)' }}>
          <Card style={{ 
            fontFamily: 'var(--font-family)',
            border: '1px solid #C9C9C9',
            borderRadius: 'var(--radius-md)'
          }}>
            <CardHeader>
              <CardTitle style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)'
              }}>
                Email Templates
              </CardTitle>
              <CardDescription style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                Manage your email templates and create new ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ 
                fontSize: 'var(--text-base)',
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                Template management functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6" style={{ marginTop: 'var(--space-lg)' }}>
          <Card style={{ 
            fontFamily: 'var(--font-family)',
            border: '1px solid #C9C9C9',
            borderRadius: 'var(--radius-md)'
          }}>
            <CardHeader>
              <CardTitle style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)'
              }}>
                Campaign Automation
              </CardTitle>
              <CardDescription style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                Set up automated email sequences and triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ 
                fontSize: 'var(--text-base)',
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                Automation rules and workflow management coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6" style={{ marginTop: 'var(--space-lg)' }}>
          <Card style={{ 
            fontFamily: 'var(--font-family)',
            border: '1px solid #C9C9C9',
            borderRadius: 'var(--radius-md)'
          }}>
            <CardHeader>
              <CardTitle style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)'
              }}>
                Campaign Analytics
              </CardTitle>
              <CardDescription style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                Detailed analytics and performance insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ 
                fontSize: 'var(--text-base)',
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family)'
              }}>
                Advanced analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign Details Modal */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-modal-2xl max-h-[90vh] overflow-y-auto" style={{ 
          fontFamily: 'var(--font-family)',
          backgroundColor: 'var(--color-background)',
          border: '1px solid #C9C9C9'
        }}>
          <DialogHeader>
            <DialogTitle style={{ 
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-foreground)'
            }}>
              {selectedCampaign?.name}
            </DialogTitle>
            <DialogDescription style={{ 
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-muted-foreground)'
            }}>
              Campaign performance and detailed analytics
            </DialogDescription>
          </DialogHeader>

          <Tabs 
            value={viewTab} 
            onValueChange={setViewTab} 
            className="w-full"
            style={{ fontFamily: 'var(--font-family)' }}
          >
            <TabsList 
              className="grid w-full grid-cols-3"
              style={{
                backgroundColor: 'var(--color-tabs-background)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-xs)',
                fontFamily: 'var(--font-family)'
              }}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4" style={{ marginTop: 'var(--space-lg)' }}>
              {selectedCampaign && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card style={{ 
                    fontFamily: 'var(--font-family)',
                    border: '1px solid #C9C9C9',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle style={{ fontSize: 'var(--text-sm)' }}>Sent</CardTitle>
                      <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-medium)' }}>
                        {selectedCampaign.emails_sent.toLocaleString()}
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-foreground)' }}>
                        to {selectedCampaign.target_leads_count} targets
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ 
                    fontFamily: 'var(--font-family)',
                    border: '1px solid #C9C9C9',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle style={{ fontSize: 'var(--text-sm)' }}>Open Rate</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-medium)' }}>
                        {Math.round(selectedCampaign.open_rate)}%
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-foreground)' }}>
                        {selectedCampaign.emails_opened} opens
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ 
                    fontFamily: 'var(--font-family)',
                    border: '1px solid #C9C9C9',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle style={{ fontSize: 'var(--text-sm)' }}>Click Rate</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-medium)' }}>
                        {Math.round(selectedCampaign.click_rate)}%
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-foreground)' }}>
                        {selectedCampaign.emails_clicked} clicks
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ 
                    fontFamily: 'var(--font-family)',
                    border: '1px solid #C9C9C9',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle style={{ fontSize: 'var(--text-sm)' }}>Status</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadgeColor(selectedCampaign.status)}>
                          {selectedCampaign.status}
                        </Badge>
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-foreground)' }}>
                        {getCampaignTypeLabel(selectedCampaign.campaign_type)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4" style={{ marginTop: 'var(--space-lg)' }}>
              {selectedCampaign && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card style={{ 
                    fontFamily: 'var(--font-family)',
                    border: '1px solid #C9C9C9',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <CardHeader>
                      <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Campaign Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Type:</span>
                        <span style={{ fontSize: 'var(--text-sm)', marginLeft: 'var(--space-sm)' }}>
                          {getCampaignTypeLabel(selectedCampaign.campaign_type)}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Created:</span>
                        <span style={{ fontSize: 'var(--text-sm)', marginLeft: 'var(--space-sm)' }}>
                          {formatDate(selectedCampaign.created_at)}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Last Updated:</span>
                        <span style={{ fontSize: 'var(--text-sm)', marginLeft: 'var(--space-sm)' }}>
                          {formatDate(selectedCampaign.updated_at)}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Performance:</span>
                        <Badge 
                          className={
                            getPerformanceScore(selectedCampaign) === 'high' ? 'bg-green-100 text-green-800' :
                            getPerformanceScore(selectedCampaign) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                          style={{ marginLeft: 'var(--space-sm)' }}
                        >
                          {getPerformanceScore(selectedCampaign)} performance
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ 
                    fontFamily: 'var(--font-family)',
                    border: '1px solid #C9C9C9',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <CardHeader>
                      <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: 'var(--text-sm)' }}>Delivery Rate</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>98%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: 'var(--text-sm)' }}>Bounce Rate</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: 'var(--text-sm)' }}>Unsubscribe Rate</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>0.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: 'var(--text-sm)' }}>Click-to-Open Rate</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                          {selectedCampaign.emails_opened > 0 ? 
                            Math.round((selectedCampaign.emails_clicked / selectedCampaign.emails_opened) * 100) : 0}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4" style={{ marginTop: 'var(--space-lg)' }}>
              {selectedCampaign && (
                <Card style={{ 
                  fontFamily: 'var(--font-family)',
                  border: '1px solid #C9C9C9',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <CardHeader>
                    <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Email Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Subject:</span>
                        <p style={{ fontSize: 'var(--text-base)', marginTop: 'var(--space-xs)' }}>
                          {selectedCampaign.subject_line}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Message:</span>
                        <div style={{ 
                          backgroundColor: 'var(--color-muted)',
                          padding: 'var(--space-lg)',
                          borderRadius: 'var(--radius-md)',
                          marginTop: 'var(--space-xs)',
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}>
                          <pre style={{ 
                            fontSize: 'var(--text-sm)',
                            fontFamily: 'var(--font-family)',
                            color: 'var(--color-foreground)',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                          }}>
                            dangerouslySetInnerHTML={{ __html: selectedCampaign.email_content || "" }}

                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowViewDialog(false)}
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-base)',
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-secondary-foreground)',
                border: '1px solid var(--color-border)'
              }}
            >
              Close
            </Button>
            <Button 
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-base)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)'
              }}
            >
              Edit Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}