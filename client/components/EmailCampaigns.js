import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Mail, Send, Eye, Plus, CheckCircle, Target, Download } from 'lucide-react';
const campaignStats = {
    totalCampaigns: 24,
    activeCampaigns: 8,
    totalSent: 15420,
    openRate: 68,
    clickRate: 23,
    replyRate: 12,
    conversionRate: 8,
    avgResponseTime: '4.2 hours'
};
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
export function EmailCampaigns({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('campaigns');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [viewTab, setViewTab] = useState('overview');
    const handleViewCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        setShowViewDialog(true);
        setViewTab('overview');
    };
    return (_jsxs("div", { className: "w-full h-full space-y-6 p-5", style: { fontFamily: 'var(--font-family)' }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { style: {
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    fontFamily: 'var(--font-family)'
                                }, children: "Email Campaigns" }), _jsx("p", { style: {
                                    fontSize: 'var(--text-base)',
                                    color: 'var(--color-muted-foreground)',
                                    fontFamily: 'var(--font-family)'
                                }, children: "Automated email outreach and nurturing campaigns" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "secondary", style: {
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--text-base)',
                                    backgroundColor: 'var(--color-secondary)',
                                    color: 'var(--color-secondary-foreground)'
                                }, children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export Data"] }), _jsxs(Button, { onClick: () => setShowCreateDialog(true), style: {
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--text-base)',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-primary-foreground)'
                                }, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Campaign"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs(Card, { style: {
                            fontFamily: 'var(--font-family)',
                            border: '1px solid #C9C9C9',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: "Total Campaigns" }), _jsx(Mail, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { style: {
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)',
                                            color: 'var(--color-foreground)'
                                        }, children: campaignStats.totalCampaigns }), _jsx("p", { style: {
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-muted-foreground)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: _jsxs("span", { className: "text-green-600", children: [campaignStats.activeCampaigns, " active"] }) })] })] }), _jsxs(Card, { style: {
                            fontFamily: 'var(--font-family)',
                            border: '1px solid #C9C9C9',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: "Open Rate" }), _jsx(Eye, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { style: {
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)',
                                            color: 'var(--color-foreground)'
                                        }, children: [campaignStats.openRate, "%"] }), _jsxs("p", { style: {
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-muted-foreground)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: [_jsx("span", { className: "text-green-600", children: "+5%" }), " from last month"] })] })] }), _jsxs(Card, { style: {
                            fontFamily: 'var(--font-family)',
                            border: '1px solid #C9C9C9',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: "Click Rate" }), _jsx(Target, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { style: {
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)',
                                            color: 'var(--color-foreground)'
                                        }, children: [campaignStats.clickRate, "%"] }), _jsxs("p", { style: {
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-muted-foreground)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: [_jsx("span", { className: "text-green-600", children: "+3%" }), " improvement"] })] })] }), _jsxs(Card, { style: {
                            fontFamily: 'var(--font-family)',
                            border: '1px solid #C9C9C9',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: "Conversion Rate" }), _jsx(CheckCircle, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { style: {
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            fontFamily: 'var(--font-family)',
                                            color: 'var(--color-foreground)'
                                        }, children: [campaignStats.conversionRate, "%"] }), _jsxs("p", { style: {
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-muted-foreground)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: [campaignStats.replyRate, "% reply rate"] })] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", style: { fontFamily: 'var(--font-family)' }, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", style: {
                            backgroundColor: 'var(--color-tabs-background)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-xs)',
                            fontFamily: 'var(--font-family)'
                        }, children: [_jsx(TabsTrigger, { value: "campaigns", style: {
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: activeTab === 'campaigns' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                    borderBottom: activeTab === 'campaigns' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                    backgroundColor: 'transparent'
                                }, children: "Campaigns" }), _jsx(TabsTrigger, { value: "templates", style: {
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: activeTab === 'templates' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                    borderBottom: activeTab === 'templates' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                    backgroundColor: 'transparent'
                                }, children: "Templates" }), _jsx(TabsTrigger, { value: "automation", style: {
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: activeTab === 'automation' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                    borderBottom: activeTab === 'automation' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                    backgroundColor: 'transparent'
                                }, children: "Automation" }), _jsx(TabsTrigger, { value: "analytics", style: {
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: activeTab === 'analytics' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                    borderBottom: activeTab === 'analytics' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                    backgroundColor: 'transparent'
                                }, children: "Analytics" })] }), _jsx(TabsContent, { value: "campaigns", className: "space-y-6", style: { marginTop: 'var(--space-lg)' }, children: _jsx("div", { className: "grid grid-cols-1 gap-4", children: campaigns.map((campaign) => (_jsxs(Card, { style: {
                                    fontFamily: 'var(--font-family)',
                                    border: '1px solid #C9C9C9',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.2s ease-in-out'
                                }, className: "hover:shadow-md", onClick: () => handleViewCampaign(campaign), children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { style: {
                                                            fontSize: 'var(--text-lg)',
                                                            fontWeight: 'var(--font-weight-medium)',
                                                            fontFamily: 'var(--font-family)'
                                                        }, children: campaign.name }), _jsx(Badge, { variant: "default", style: {
                                                            backgroundColor: campaign.status === 'active' ? 'var(--color-primary)' : 'var(--color-secondary)',
                                                            color: campaign.status === 'active' ? 'var(--color-primary-foreground)' : 'var(--color-secondary-foreground)'
                                                        }, children: campaign.status })] }), _jsx(CardDescription, { style: {
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--color-muted-foreground)',
                                                    fontFamily: 'var(--font-family)'
                                                }, children: campaign.subject })] }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { style: {
                                                                fontSize: 'var(--text-xl)',
                                                                fontWeight: 'var(--font-weight-medium)',
                                                                fontFamily: 'var(--font-family)',
                                                                color: 'var(--color-foreground)'
                                                            }, children: campaign.sent }), _jsx("p", { style: {
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--color-muted-foreground)',
                                                                fontFamily: 'var(--font-family)'
                                                            }, children: "Sent" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { style: {
                                                                fontSize: 'var(--text-xl)',
                                                                fontWeight: 'var(--font-weight-medium)',
                                                                fontFamily: 'var(--font-family)',
                                                                color: 'var(--color-foreground)'
                                                            }, children: [campaign.openRate, "%"] }), _jsx("p", { style: {
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--color-muted-foreground)',
                                                                fontFamily: 'var(--font-family)'
                                                            }, children: "Open Rate" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { style: {
                                                                fontSize: 'var(--text-xl)',
                                                                fontWeight: 'var(--font-weight-medium)',
                                                                fontFamily: 'var(--font-family)',
                                                                color: 'var(--color-foreground)'
                                                            }, children: [campaign.clickRate, "%"] }), _jsx("p", { style: {
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--color-muted-foreground)',
                                                                fontFamily: 'var(--font-family)'
                                                            }, children: "Click Rate" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { style: {
                                                                fontSize: 'var(--text-xl)',
                                                                fontWeight: 'var(--font-weight-medium)',
                                                                fontFamily: 'var(--font-family)',
                                                                color: 'var(--color-foreground)'
                                                            }, children: [campaign.conversionRate, "%"] }), _jsx("p", { style: {
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--color-muted-foreground)',
                                                                fontFamily: 'var(--font-family)'
                                                            }, children: "Conversion" })] })] }) })] }, campaign.id))) }) }), _jsx(TabsContent, { value: "templates", className: "space-y-6", style: { marginTop: 'var(--space-lg)' }, children: _jsxs(Card, { style: {
                                fontFamily: 'var(--font-family)',
                                border: '1px solid #C9C9C9',
                                borderRadius: 'var(--radius-md)'
                            }, children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { style: {
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                fontFamily: 'var(--font-family)'
                                            }, children: "Email Templates" }), _jsx(CardDescription, { style: {
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-muted-foreground)',
                                                fontFamily: 'var(--font-family)'
                                            }, children: "Manage your email templates and create new ones" })] }), _jsx(CardContent, { children: _jsx("p", { style: {
                                            fontSize: 'var(--text-base)',
                                            color: 'var(--color-muted-foreground)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: "Template management functionality coming soon..." }) })] }) }), _jsx(TabsContent, { value: "automation", className: "space-y-6", style: { marginTop: 'var(--space-lg)' }, children: _jsxs(Card, { style: {
                                fontFamily: 'var(--font-family)',
                                border: '1px solid #C9C9C9',
                                borderRadius: 'var(--radius-md)'
                            }, children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { style: {
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                fontFamily: 'var(--font-family)'
                                            }, children: "Campaign Automation" }), _jsx(CardDescription, { style: {
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-muted-foreground)',
                                                fontFamily: 'var(--font-family)'
                                            }, children: "Set up automated email sequences and triggers" })] }), _jsx(CardContent, { children: _jsx("p", { style: {
                                            fontSize: 'var(--text-base)',
                                            color: 'var(--color-muted-foreground)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: "Automation rules and workflow management coming soon..." }) })] }) }), _jsx(TabsContent, { value: "analytics", className: "space-y-6", style: { marginTop: 'var(--space-lg)' }, children: _jsxs(Card, { style: {
                                fontFamily: 'var(--font-family)',
                                border: '1px solid #C9C9C9',
                                borderRadius: 'var(--radius-md)'
                            }, children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { style: {
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                fontFamily: 'var(--font-family)'
                                            }, children: "Campaign Analytics" }), _jsx(CardDescription, { style: {
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-muted-foreground)',
                                                fontFamily: 'var(--font-family)'
                                            }, children: "Detailed analytics and performance insights" })] }), _jsx(CardContent, { children: _jsx("p", { style: {
                                            fontSize: 'var(--text-base)',
                                            color: 'var(--color-muted-foreground)',
                                            fontFamily: 'var(--font-family)'
                                        }, children: "Advanced analytics dashboard coming soon..." }) })] }) })] }), _jsx(Dialog, { open: showViewDialog, onOpenChange: setShowViewDialog, children: _jsxs(DialogContent, { className: "max-w-modal-2xl max-h-[90vh] overflow-y-auto", style: {
                        fontFamily: 'var(--font-family)',
                        backgroundColor: 'var(--color-background)',
                        border: '1px solid #C9C9C9'
                    }, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { style: {
                                        fontFamily: 'var(--font-family)',
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: 'var(--font-weight-medium)',
                                        color: 'var(--color-foreground)'
                                    }, children: selectedCampaign?.name }), _jsx(DialogDescription, { style: {
                                        fontFamily: 'var(--font-family)',
                                        fontSize: 'var(--text-base)',
                                        color: 'var(--color-muted-foreground)'
                                    }, children: "Campaign performance and detailed analytics" })] }), _jsxs(Tabs, { value: viewTab, onValueChange: setViewTab, className: "w-full", style: { fontFamily: 'var(--font-family)' }, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", style: {
                                        backgroundColor: 'var(--color-tabs-background)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: 'var(--space-xs)',
                                        fontFamily: 'var(--font-family)'
                                    }, children: [_jsx(TabsTrigger, { value: "overview", style: {
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--text-base)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                color: viewTab === 'overview' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                                borderBottom: viewTab === 'overview' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                                backgroundColor: 'transparent'
                                            }, children: "Overview" }), _jsx(TabsTrigger, { value: "performance", style: {
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--text-base)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                color: viewTab === 'performance' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                                borderBottom: viewTab === 'performance' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                                backgroundColor: 'transparent'
                                            }, children: "Performance" }), _jsx(TabsTrigger, { value: "recipients", style: {
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--text-base)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                color: viewTab === 'recipients' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                                borderBottom: viewTab === 'recipients' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                                backgroundColor: 'transparent'
                                            }, children: "Recipients" }), _jsx(TabsTrigger, { value: "content", style: {
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--text-base)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                color: viewTab === 'content' ? 'var(--color-tabs-active-text)' : 'var(--color-tabs-inactive-text)',
                                                borderBottom: viewTab === 'content' ? '1px solid var(--color-tabs-active-border)' : 'none',
                                                backgroundColor: 'transparent'
                                            }, children: "Content" })] }), _jsxs(TabsContent, { value: "overview", className: "space-y-4", style: { marginTop: 'var(--space-lg)' }, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs(Card, { style: {
                                                        fontFamily: 'var(--font-family)',
                                                        border: '1px solid #C9C9C9',
                                                        borderRadius: 'var(--radius-md)',
                                                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                                    }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: "Sent" }), _jsx(Send, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { style: {
                                                                        fontSize: 'var(--text-2xl)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: selectedCampaign?.sent?.toLocaleString() }), _jsxs("p", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: ["to ", selectedCampaign?.totalRecipients, " recipients"] })] })] }), _jsxs(Card, { style: {
                                                        fontFamily: 'var(--font-family)',
                                                        border: '1px solid #C9C9C9',
                                                        borderRadius: 'var(--radius-md)',
                                                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                                    }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: "Open Rate" }), _jsx(Eye, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { style: {
                                                                        fontSize: 'var(--text-2xl)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: [selectedCampaign?.openRate, "%"] }), _jsxs("p", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: [selectedCampaign?.opened, " opens"] })] })] }), _jsxs(Card, { style: {
                                                        fontFamily: 'var(--font-family)',
                                                        border: '1px solid #C9C9C9',
                                                        borderRadius: 'var(--radius-md)',
                                                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                                    }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: "Click Rate" }), _jsx(Target, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { style: {
                                                                        fontSize: 'var(--text-2xl)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: [selectedCampaign?.clickRate, "%"] }), _jsxs("p", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: [selectedCampaign?.clicked, " clicks"] })] })] }), _jsxs(Card, { style: {
                                                        fontFamily: 'var(--font-family)',
                                                        border: '1px solid #C9C9C9',
                                                        borderRadius: 'var(--radius-md)',
                                                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                                    }, children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: "Conversion Rate" }), _jsx(CheckCircle, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { style: {
                                                                        fontSize: 'var(--text-2xl)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: [selectedCampaign?.conversionRate, "%"] }), _jsxs("p", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: [selectedCampaign?.converted, " conversions"] })] })] })] }), _jsxs(Card, { style: {
                                                fontFamily: 'var(--font-family)',
                                                border: '1px solid #C9C9C9',
                                                borderRadius: 'var(--radius-md)',
                                                marginTop: 'var(--space-lg)'
                                            }, children: [_jsx(CardHeader, { children: _jsx(CardTitle, { style: {
                                                            fontSize: 'var(--text-lg)',
                                                            fontWeight: 'var(--font-weight-medium)',
                                                            fontFamily: 'var(--font-family)'
                                                        }, children: "Campaign Timeline" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { style: {
                                                                        fontSize: 'var(--text-base)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: "Created" }), _jsx("span", { style: {
                                                                        fontSize: 'var(--text-base)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-muted-foreground)'
                                                                    }, children: selectedCampaign?.createdDate })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { style: {
                                                                        fontSize: 'var(--text-base)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: "Last Sent" }), _jsx("span", { style: {
                                                                        fontSize: 'var(--text-base)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-muted-foreground)'
                                                                    }, children: selectedCampaign?.lastSent })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { style: {
                                                                        fontSize: 'var(--text-base)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: "Next Send" }), _jsx("span", { style: {
                                                                        fontSize: 'var(--text-base)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-muted-foreground)'
                                                                    }, children: selectedCampaign?.nextSend || 'Not scheduled' })] })] })] })] }), _jsx(TabsContent, { value: "performance", className: "space-y-4", style: { marginTop: 'var(--space-lg)' }, children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { style: {
                                                    fontFamily: 'var(--font-family)',
                                                    border: '1px solid #C9C9C9',
                                                    borderRadius: 'var(--radius-md)'
                                                }, children: [_jsx(CardHeader, { children: _jsx(CardTitle, { style: {
                                                                fontSize: 'var(--text-lg)',
                                                                fontWeight: 'var(--font-weight-medium)',
                                                                fontFamily: 'var(--font-family)'
                                                            }, children: "Campaign Details" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontWeight: 'var(--font-weight-medium)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: "Type:" }), _jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-muted-foreground)',
                                                                            marginLeft: 'var(--space-sm)'
                                                                        }, children: selectedCampaign?.type })] }), _jsxs("div", { children: [_jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontWeight: 'var(--font-weight-medium)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: "Audience:" }), _jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-muted-foreground)',
                                                                            marginLeft: 'var(--space-sm)'
                                                                        }, children: selectedCampaign?.audience })] }), _jsxs("div", { children: [_jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontWeight: 'var(--font-weight-medium)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: "Schedule:" }), _jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-muted-foreground)',
                                                                            marginLeft: 'var(--space-sm)'
                                                                        }, children: selectedCampaign?.schedule })] }), _jsxs("div", { children: [_jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontWeight: 'var(--font-weight-medium)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: "Status:" }), _jsx(Badge, { variant: "default", style: {
                                                                            marginLeft: 'var(--space-sm)',
                                                                            backgroundColor: selectedCampaign?.status === 'active' ? 'var(--color-primary)' : 'var(--color-secondary)',
                                                                            color: selectedCampaign?.status === 'active' ? 'var(--color-primary-foreground)' : 'var(--color-secondary-foreground)'
                                                                        }, children: selectedCampaign?.status })] })] })] }), _jsxs(Card, { style: {
                                                    fontFamily: 'var(--font-family)',
                                                    border: '1px solid #C9C9C9',
                                                    borderRadius: 'var(--radius-md)'
                                                }, children: [_jsx(CardHeader, { children: _jsx(CardTitle, { style: {
                                                                fontSize: 'var(--text-lg)',
                                                                fontWeight: 'var(--font-weight-medium)',
                                                                fontFamily: 'var(--font-family)'
                                                            }, children: "Performance Metrics" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: "Delivery Rate" }), _jsxs("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontWeight: 'var(--font-weight-medium)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: [selectedCampaign?.deliveryRate, "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: "Bounce Rate" }), _jsxs("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontWeight: 'var(--font-weight-medium)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: [selectedCampaign?.bounceRate, "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: "Reply Rate" }), _jsxs("span", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontWeight: 'var(--font-weight-medium)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)'
                                                                        }, children: [selectedCampaign?.replyRate, "%"] })] })] })] })] }) }), _jsx(TabsContent, { value: "recipients", className: "space-y-4", style: { marginTop: 'var(--space-lg)' }, children: _jsxs(Card, { style: {
                                            fontFamily: 'var(--font-family)',
                                            border: '1px solid #C9C9C9',
                                            borderRadius: 'var(--radius-md)'
                                        }, children: [_jsx(CardHeader, { children: _jsx(CardTitle, { style: {
                                                        fontSize: 'var(--text-lg)',
                                                        fontWeight: 'var(--font-weight-medium)',
                                                        fontFamily: 'var(--font-family)'
                                                    }, children: "Recipient Analytics" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { style: {
                                                                        fontSize: 'var(--text-xl)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: [selectedCampaign?.deviceStats?.desktop || 0, "%"] }), _jsx("p", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: "Desktop Opens" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { style: {
                                                                        fontSize: 'var(--text-xl)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: [selectedCampaign?.deviceStats?.mobile || 0, "%"] }), _jsx("p", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: "Mobile Opens" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { style: {
                                                                        fontSize: 'var(--text-xl)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: [selectedCampaign?.deviceStats?.tablet || 0, "%"] }), _jsx("p", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        fontFamily: 'var(--font-family)'
                                                                    }, children: "Tablet Opens" })] })] }) })] }) }), _jsx(TabsContent, { value: "content", className: "space-y-4", style: { marginTop: 'var(--space-lg)' }, children: _jsxs(Card, { style: {
                                            fontFamily: 'var(--font-family)',
                                            border: '1px solid #C9C9C9',
                                            borderRadius: 'var(--radius-md)'
                                        }, children: [_jsx(CardHeader, { children: _jsx(CardTitle, { style: {
                                                        fontSize: 'var(--text-lg)',
                                                        fontWeight: 'var(--font-weight-medium)',
                                                        fontFamily: 'var(--font-family)'
                                                    }, children: "Email Content" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("span", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: "Subject:" }), _jsx("p", { style: {
                                                                        fontSize: 'var(--text-base)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-muted-foreground)',
                                                                        marginTop: 'var(--space-xs)'
                                                                    }, children: selectedCampaign?.subject })] }), _jsxs("div", { children: [_jsx("span", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)'
                                                                    }, children: "Message:" }), _jsx("div", { style: {
                                                                        backgroundColor: 'var(--color-muted)',
                                                                        padding: 'var(--space-lg)',
                                                                        borderRadius: 'var(--radius-md)',
                                                                        marginTop: 'var(--space-xs)',
                                                                        maxHeight: '300px',
                                                                        overflowY: 'auto'
                                                                    }, children: _jsx("pre", { style: {
                                                                            fontSize: 'var(--text-sm)',
                                                                            fontFamily: 'var(--font-family)',
                                                                            color: 'var(--color-foreground)',
                                                                            whiteSpace: 'pre-wrap',
                                                                            wordWrap: 'break-word'
                                                                        }, children: selectedCampaign?.emailContent }) })] })] }) })] }) })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowViewDialog(false), style: {
                                        fontFamily: 'var(--font-family)',
                                        fontSize: 'var(--text-base)',
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'var(--color-secondary-foreground)',
                                        border: '1px solid var(--color-border)'
                                    }, children: "Close" }), _jsx(Button, { style: {
                                        fontFamily: 'var(--font-family)',
                                        fontSize: 'var(--text-base)',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-primary-foreground)'
                                    }, children: "Edit Campaign" })] })] }) })] }));
}
