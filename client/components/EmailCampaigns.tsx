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

interface EmailCampaignsProps {
  onNavigate: (screen: string, filters?: any) => void;
}

const campaigns = [
  {
    id: 1,
    name: 'Q3 Enterprise Outreach',
    type: 'Prospecting',
    status: 'active',
    audience: 'Qualified Leads',
    totalRecipients: 245,
    sent: 245,
    delivered: 240,
    opened: 167,
    clicked: 58,
    replied: 31,
    converted: 12,
    bounced: 5,
    unsubscribed: 3,
    openRate: 68,
    clickRate: 24,
    replyRate: 13,
    conversionRate: 5,
    deliveryRate: 97.8,
    bounceRate: 2.0,
    unsubscribeRate: 1.2,
    createdDate: '2024-07-01',
    lastSent: '2024-07-14',
    nextSend: '2024-07-17',
    schedule: 'Every 3 days',
    subject: 'Optimize Your Corporate Travel with SOAR-AI',
    emailContent: `Hi [FIRSTNAME],

I hope this email finds you well. I noticed that [COMPANY] is a leading organization in the [INDUSTRY] sector, and I wanted to reach out regarding an opportunity that could significantly benefit your corporate travel operations.

At SOAR-AI, we specialize in helping companies like [COMPANY] reduce travel costs by up to 35% while improving employee satisfaction and streamlining booking processes. Given your role as [JOBTITLE], I believe you'd be interested in learning how we can help optimize your travel program.

Key benefits for [COMPANY]:
• Reduce travel expenses by 30-40%
• Automate policy compliance and approval workflows
• Provide real-time analytics and reporting
• Improve traveler experience with our mobile app
• 24/7 support and dedicated account management

I'd love to schedule a brief 15-minute call to discuss how SOAR-AI can specifically benefit [COMPANY]. Are you available for a quick conversation this week?

Best regards,
Sarah Johnson
Senior Account Executive
SOAR-AI Corporate Travel Solutions`,
    automationEnabled: true,
    tags: ['Enterprise', 'High-Value'],
    template: 'enterprise-intro',
    sendTime: '09:00',
    timezone: 'UTC',
    frequency: 'every-3-days',
    trackOpens: true,
    trackClicks: true,
    autoFollowUp: true,
    avgOpenTime: '2.3 hours',
    avgClickTime: '4.1 hours',
    topClickedLinks: [
      { url: 'https://soar-ai.com/demo', clicks: 28 },
      { url: 'https://soar-ai.com/pricing', clicks: 15 },
      { url: 'https://soar-ai.com/case-studies', clicks: 12 }
    ],
    deviceStats: {
      desktop: 58,
      mobile: 35,
      tablet: 7
    },
    locationStats: [
      { location: 'New York', opens: 45 },
      { location: 'San Francisco', opens: 38 },
      { location: 'Chicago', opens: 32 }
    ],
    performanceScore: 'high'
  },
  {
    id: 2,
    name: 'Follow-up Sequence',
    type: 'Nurturing',
    status: 'active',
    audience: 'Responded Leads',
    totalRecipients: 89,
    sent: 89,
    delivered: 87,
    opened: 72,
    clicked: 34,
    replied: 28,
    converted: 8,
    bounced: 2,
    unsubscribed: 1,
    openRate: 81,
    clickRate: 38,
    replyRate: 31,
    conversionRate: 9,
    deliveryRate: 97.8,
    bounceRate: 2.2,
    unsubscribeRate: 1.1,
    createdDate: '2024-06-15',
    lastSent: '2024-07-13',
    nextSend: '2024-07-16',
    schedule: 'Every 2 days',
    subject: 'Next Steps: Your Travel Solution',
    emailContent: `Hi [FIRSTNAME],

Thank you for your interest in SOAR-AI! I'm excited to help [COMPANY] optimize your corporate travel program.

Based on our previous conversation, I understand that [COMPANY] is looking to:
• Reduce travel costs and improve efficiency
• Streamline booking and approval processes
• Enhance traveler experience and satisfaction
• Gain better visibility into travel spending

I'd like to schedule a personalized demo to show you exactly how SOAR-AI can address these specific needs for [COMPANY]. During our 30-minute session, I'll demonstrate:

1. Cost savings opportunities specific to your industry
2. Automated policy compliance features
3. Real-time analytics and reporting capabilities
4. Mobile app and traveler experience enhancements

I have availability this week:
• Tuesday, July 16th at 2:00 PM EST
• Wednesday, July 17th at 10:00 AM EST  
• Thursday, July 18th at 3:00 PM EST

Which time works best for you? Or if you prefer a different time, just let me know and I'll accommodate your schedule.

Looking forward to speaking with you soon!

Best regards,
Sarah Johnson
Senior Account Executive
SOAR-AI Corporate Travel Solutions`,
    automationEnabled: true,
    tags: ['Follow-up', 'Engaged'],
    template: 'follow-up-sequence',
    sendTime: '10:00',
    timezone: 'UTC',
    frequency: 'every-2-days',
    trackOpens: true,
    trackClicks: true,
    autoFollowUp: true,
    avgOpenTime: '1.8 hours',
    avgClickTime: '3.2 hours',
    topClickedLinks: [
      { url: 'https://soar-ai.com/schedule-demo', clicks: 22 },
      { url: 'https://soar-ai.com/case-studies', clicks: 18 },
      { url: 'https://soar-ai.com/roi-calculator', clicks: 14 }
    ],
    deviceStats: {
      desktop: 62,
      mobile: 31,
      tablet: 7
    },
    locationStats: [
      { location: 'Boston', opens: 28 },
      { location: 'Seattle', opens: 24 },
      { location: 'Austin', opens: 20 }
    ],
    performanceScore: 'high'
  },
  {
    id: 3,
    name: 'Re-engagement Campaign',
    type: 'Re-engagement',
    status: 'paused',
    audience: 'Cold Leads',
    totalRecipients: 156,
    sent: 78,
    delivered: 74,
    opened: 34,
    clicked: 12,
    replied: 5,
    converted: 1,
    bounced: 4,
    unsubscribed: 2,
    openRate: 44,
    clickRate: 15,
    replyRate: 6,
    conversionRate: 1,
    deliveryRate: 94.9,
    bounceRate: 5.1,
    unsubscribeRate: 2.6,
    createdDate: '2024-06-01',
    lastSent: '2024-07-10',
    nextSend: null,
    schedule: 'Weekly',
    subject: 'We Miss You - Special Travel Offer Inside',
    emailContent: `Hi [FIRSTNAME],

It's been a while since we last connected, and I wanted to reach out with some exciting news that could benefit [COMPANY].

We've recently launched several new features that I believe would be particularly valuable for organizations like yours:

🎯 **NEW: AI-Powered Travel Optimization**
Our latest AI technology can now predict and prevent travel disruptions before they happen, potentially saving [COMPANY] thousands in rebooking costs.

💰 **LIMITED TIME: 30% Additional Savings**
For the next 30 days, we're offering an exclusive 30% discount on our implementation fees for new clients. This is on top of the 35% average cost savings our clients already see.

📊 **Enhanced Analytics Dashboard**
Get real-time insights into travel patterns, cost drivers, and policy compliance across all your locations.

I know corporate travel management can be challenging, especially with the complexities of managing [EMPLOYEES] employees across multiple locations. That's why I'd love to show you how other companies in [INDUSTRY] are solving these exact challenges with SOAR-AI.

Would you be interested in a brief 15-minute call to learn more about these new capabilities? I promise it will be worth your time.

You can schedule directly on my calendar here: [Schedule a Call]

Or simply reply to this email with your availability.

Best regards,
Sarah Johnson
Senior Account Executive
SOAR-AI Corporate Travel Solutions

P.S. This special offer expires on July 31st, so don't wait too long to reach out!`,
    automationEnabled: false,
    tags: ['Re-engagement', 'Special Offer'],
    template: 'reengagement',
    sendTime: '14:00',
    timezone: 'UTC',
    frequency: 'weekly',
    trackOpens: true,
    trackClicks: true,
    autoFollowUp: false,
    avgOpenTime: '3.1 hours',
    avgClickTime: '5.2 hours',
    topClickedLinks: [
      { url: 'https://soar-ai.com/special-offer', clicks: 8 },
      { url: 'https://soar-ai.com/new-features', clicks: 6 },
      { url: 'https://soar-ai.com/schedule', clicks: 4 }
    ],
    deviceStats: {
      desktop: 55,
      mobile: 38,
      tablet: 7
    },
    locationStats: [
      { location: 'Dallas', opens: 12 },
      { location: 'Miami', opens: 10 },
      { location: 'Denver', opens: 8 }
    ],
    performanceScore: 'medium'
  }
];

export function EmailCampaigns({ onNavigate }: EmailCampaignsProps) {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewTab, setViewTab] = useState('overview');
  const [campaignList, setCampaignList] = useState<any[]>(campaigns);

  const { getCampaigns, loading: campaignsLoading } = useCampaignApi();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const fetchedCampaigns = await getCampaigns();
      // Transform API data to match the existing campaign structure
      const transformedCampaigns = fetchedCampaigns.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        type: campaign.campaign_type === 'nurture' ? 'Nurturing' : campaign.campaign_type,
        status: campaign.status,
        audience: 'Generated Leads',
        totalRecipients: campaign.emails_sent,
        sent: campaign.emails_sent,
        delivered: Math.floor(campaign.emails_sent * 0.98),
        opened: campaign.emails_opened,
        clicked: campaign.emails_clicked,
        replied: Math.floor(campaign.emails_clicked * 0.3),
        converted: Math.floor(campaign.emails_clicked * 0.1),
        bounced: Math.floor(campaign.emails_sent * 0.02),
        unsubscribed: Math.floor(campaign.emails_sent * 0.01),
        openRate: campaign.emails_sent > 0 ? Math.round((campaign.emails_opened / campaign.emails_sent) * 100) : 0,
        clickRate: campaign.emails_sent > 0 ? Math.round((campaign.emails_clicked / campaign.emails_sent) * 100) : 0,
        replyRate: campaign.emails_sent > 0 ? Math.round((campaign.emails_clicked * 0.3 / campaign.emails_sent) * 100) : 0,
        conversionRate: campaign.emails_sent > 0 ? Math.round((campaign.emails_clicked * 0.1 / campaign.emails_sent) * 100) : 0,
        deliveryRate: 98,
        bounceRate: 2,
        unsubscribeRate: 1,
        createdDate: new Date(campaign.created_at).toISOString().split('T')[0],
        lastSent: new Date(campaign.updated_at).toISOString().split('T')[0],
        nextSend: campaign.status === 'active' ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : null,
        schedule: 'Every 3 days',
        subject: campaign.subject_line,
        emailContent: campaign.email_content,
        automationEnabled: campaign.status === 'active',
        tags: ['Generated', 'API'],
        template: 'api-generated',
        sendTime: '09:00',
        timezone: 'UTC',
        frequency: 'every-3-days',
        trackOpens: true,
        trackClicks: true,
        autoFollowUp: true,
        avgOpenTime: '2.3 hours',
        avgClickTime: '4.1 hours',
        topClickedLinks: [
          { url: 'https://soar-ai.com/demo', clicks: Math.floor(campaign.emails_clicked * 0.5) },
          { url: 'https://soar-ai.com/pricing', clicks: Math.floor(campaign.emails_clicked * 0.3) },
          { url: 'https://soar-ai.com/case-studies', clicks: Math.floor(campaign.emails_clicked * 0.2) }
        ],
        deviceStats: {
          desktop: 58,
          mobile: 35,
          tablet: 7
        },
        locationStats: [
          { location: 'New York', opens: Math.floor(campaign.emails_opened * 0.3) },
          { location: 'San Francisco', opens: Math.floor(campaign.emails_opened * 0.25) },
          { location: 'Chicago', opens: Math.floor(campaign.emails_opened * 0.2) }
        ],
        performanceScore: campaign.emails_sent > 100 ? 'high' : 'medium'
      }));

      // Combine with existing mock campaigns
      setCampaignList([...transformedCampaigns, ...campaigns]);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      // Keep using mock data if API fails
      setCampaignList(campaigns);
    }
  };

  const handleViewCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowViewDialog(true);
    setViewTab('overview');
  };

  return (
    <div className="w-full h-full space-y-6 p-5" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
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
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-base)',
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-secondary-foreground)'
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
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

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              {campaignList.length}
            </div>
            <p style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family)'
            }}>
              <span className="text-green-600">{campaignList.filter(c => c.status === 'active').length} active</span>
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
              color: 'var(--color-foreground)'
            }}>
              {campaignList.length > 0 ? Math.round(campaignList.reduce((sum, c) => sum + c.openRate, 0) / campaignList.length) : 0}%
            </div>
            <p style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family)'
            }}>
              <span className="text-green-600">+5%</span> from last month
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
              color: 'var(--color-foreground)'
            }}>
              {campaignList.length > 0 ? Math.round(campaignList.reduce((sum, c) => sum + c.clickRate, 0) / campaignList.length) : 0}%
            </div>
            <p style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family)'
            }}>
              <span className="text-green-600">+3%</span> improvement
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
            <CardTitle style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-weight-medium)',
              fontFamily: 'var(--font-family)'
            }}>
              Conversion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div style={{ 
              fontSize: 'var(--text-2xl)', 
              fontWeight: 'var(--font-weight-medium)',
              fontFamily: 'var(--font-family)',
              color: 'var(--color-foreground)'
            }}>
              {campaignList.length > 0 ? Math.round(campaignList.reduce((sum, c) => sum + c.conversionRate, 0) / campaignList.length) : 0}%
            </div>
            <p style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family)'
            }}>
              {campaignList.length > 0 ? Math.round(campaignList.reduce((sum, c) => sum + c.replyRate, 0) / campaignList.length) : 0}% reply rate
            </p>
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
          <TabsTrigger 
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
          </TabsTrigger>
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
            {campaignList.map((campaign) => (
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
                      variant="default"
                      style={{
                        backgroundColor: campaign.status === 'active' ? 'var(--color-primary)' : 'var(--color-secondary)',
                        color: campaign.status === 'active' ? 'var(--color-primary-foreground)' : 'var(--color-secondary-foreground)'
                      }}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-muted-foreground)',
                    fontFamily: 'var(--font-family)'
                  }}>
                    {campaign.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {campaign.sent}
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
                        {campaign.openRate}%
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
                        {campaign.clickRate}%
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
                        {campaign.conversionRate}%
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Conversion
                      </p>
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

      {/* Campaign Details Modal - Fully Themed */}
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
              className="grid w-full grid-cols-4"
              style={{
                backgroundColor: 'var(--color-tabs-background)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-xs)',
                fontFamily: 'var(--font-family)'
              }}
            >
              <TabsTrigger 
                value="overview"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: viewTab === 'overview' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                  borderBottom: viewTab === 'overview' ? '1px solid var(--color-tabs-active-border)' : 'none',
                  backgroundColor: 'transparent'
                }}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: viewTab === 'performance' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                  borderBottom: viewTab === 'performance' ? '1px solid var(--color-tabs-active-border)' : 'none',
                  backgroundColor: 'transparent'
                }}
              >
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="recipients"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: viewTab === 'recipients' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                  borderBottom: viewTab === 'recipients' ? '1px solid var(--color-tabs-active-border)' : 'none',
                  backgroundColor: 'transparent'
                }}
              >
                Recipients
              </TabsTrigger>
              <TabsTrigger 
                value="content"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: viewTab === 'content' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                  borderBottom: viewTab === 'content' ? '1px solid var(--color-tabs-active-border)' : 'none',
                  backgroundColor: 'transparent'
                }}
              >
                Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4" style={{ marginTop: 'var(--space-lg)' }}>
              {/* Dashboard Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      Sent
                    </CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div style={{ 
                      fontSize: 'var(--text-2xl)', 
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-foreground)'
                    }}>
                      {selectedCampaign?.sent?.toLocaleString()}
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--color-muted-foreground)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      to {selectedCampaign?.totalRecipients} recipients
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
                      color: 'var(--color-foreground)'
                    }}>
                      {selectedCampaign?.openRate}%
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--color-muted-foreground)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      {selectedCampaign?.opened} opens
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
                      color: 'var(--color-foreground)'
                    }}>
                      {selectedCampaign?.clickRate}%
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--color-muted-foreground)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      {selectedCampaign?.clicked} clicks
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
                    <CardTitle style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      Conversion Rate
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div style={{ 
                      fontSize: 'var(--text-2xl)', 
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-foreground)'
                    }}>
                      {selectedCampaign?.conversionRate}%
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--color-muted-foreground)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      {selectedCampaign?.converted} conversions
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Timeline */}
              <Card style={{ 
                fontFamily: 'var(--font-family)',
                border: '1px solid #C9C9C9',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--space-lg)'
              }}>
                <CardHeader>
                  <CardTitle style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: 'var(--font-family)'
                  }}>
                    Campaign Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ 
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-foreground)'
                    }}>
                      Created
                    </span>
                    <span style={{ 
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-muted-foreground)'
                    }}>
                      {selectedCampaign?.createdDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ 
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-foreground)'
                    }}>
                      Last Sent
                    </span>
                    <span style={{ 
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-muted-foreground)'
                    }}>
                      {selectedCampaign?.lastSent}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ 
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-foreground)'
                    }}>
                      Next Send
                    </span>
                    <span style={{ 
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-muted-foreground)'
                    }}>
                      {selectedCampaign?.nextSend || 'Not scheduled'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4" style={{ marginTop: 'var(--space-lg)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      Campaign Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Type:
                      </span>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-muted-foreground)',
                        marginLeft: 'var(--space-sm)'
                      }}>
                        {selectedCampaign?.type}
                      </span>
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Audience:
                      </span>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-muted-foreground)',
                        marginLeft: 'var(--space-sm)'
                      }}>
                        {selectedCampaign?.audience}
                      </span>
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Schedule:
                      </span>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-muted-foreground)',
                        marginLeft: 'var(--space-sm)'
                      }}>
                        {selectedCampaign?.schedule}
                      </span>
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Status:
                      </span>
                      <Badge 
                        variant="default" 
                        style={{ 
                          marginLeft: 'var(--space-sm)',
                          backgroundColor: selectedCampaign?.status === 'active' ? 'var(--color-primary)' : 'var(--color-secondary)',
                          color: selectedCampaign?.status === 'active' ? 'var(--color-primary-foreground)' : 'var(--color-secondary-foreground)'
                        }}
                      >
                        {selectedCampaign?.status}
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
                    <CardTitle style={{ 
                      fontSize: 'var(--text-lg)', 
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Delivery Rate
                      </span>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {selectedCampaign?.deliveryRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Bounce Rate
                      </span>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {selectedCampaign?.bounceRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Reply Rate
                      </span>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {selectedCampaign?.replyRate}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4" style={{ marginTop: 'var(--space-lg)' }}>
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
                    Recipient Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {selectedCampaign?.deviceStats?.desktop || 0}%
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Desktop Opens
                      </p>
                    </div>
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {selectedCampaign?.deviceStats?.mobile || 0}%
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Mobile Opens
                      </p>
                    </div>
                    <div className="text-center">
                      <div style={{ 
                        fontSize: 'var(--text-xl)', 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        {selectedCampaign?.deviceStats?.tablet || 0}%
                      </div>
                      <p style={{ 
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--color-muted-foreground)',
                        fontFamily: 'var(--font-family)'
                      }}>
                        Tablet Opens
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4" style={{ marginTop: 'var(--space-lg)' }}>
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
                    Email Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Subject:
                      </span>
                      <p style={{ 
                        fontSize: 'var(--text-base)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-muted-foreground)',
                        marginTop: 'var(--space-xs)'
                      }}>
                        {selectedCampaign?.subject}
                      </p>
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)'
                      }}>
                        Message:
                      </span>
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
                          {selectedCampaign?.emailContent}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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