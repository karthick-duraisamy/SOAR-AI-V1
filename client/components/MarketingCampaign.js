import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, ArrowRight, Users, Mail, MessageSquare, Target, TrendingUp, Eye, MousePointer, UserMinus, Send, CheckCircle, BarChart3, Activity, Zap, Star, Download, Calendar, Building2, Globe, Settings, Plus, Edit, Brain, Lightbulb, AlertTriangle, RefreshCw, Linkedin, UserPlus, Copy, Save } from 'lucide-react';
const campaignTemplates = [
    {
        id: 'welcome-series',
        name: 'Welcome Series',
        description: 'Multi-touch welcome sequence for new leads',
        type: 'email',
        industry: 'All',
        subject: 'Welcome to the future of corporate travel - {{company_name}}',
        content: `Hi {{contact_name}},

Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.

Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:

✈️ Reduce travel costs by up to 35%
📊 Streamline booking and approval processes  
🌍 Access our global partner network
🤖 AI-powered travel recommendations

Ready to see how we can help? Let's schedule a 15-minute discovery call.`,
        cta: 'Schedule Discovery Call',
        estimatedOpenRate: 45,
        estimatedClickRate: 12
    },
    {
        id: 'cost-savings',
        name: 'Cost Savings Focus',
        description: 'Emphasizes ROI and cost reduction benefits',
        type: 'email',
        industry: 'Manufacturing',
        subject: '{{company_name}}: Cut travel costs by 35% with SOAR-AI',
        content: `{{contact_name}},

Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.

Here's what {{company_name}} could save annually:
• Current estimated budget: {{travel_budget}}
• Potential savings: {{calculated_savings}}
• ROI timeline: 3-6 months

Our Manufacturing clients report:
📉 35% reduction in travel expenses
⏱️ 50% faster booking processes
📋 90% compliance with travel policies
🎯 Better budget predictability

Want to see your personalized savings projection?`,
        cta: 'Get My Savings Report',
        estimatedOpenRate: 52,
        estimatedClickRate: 18
    },
    {
        id: 'compliance-focused',
        name: 'Compliance & Control',
        description: 'Targets compliance and policy management needs',
        type: 'email',
        industry: 'Financial Services',
        subject: 'Ensure 100% travel policy compliance at {{company_name}}',
        content: `Hi {{contact_name}},

Managing travel compliance for {{employees}} employees can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.

Key compliance features for {{industry}} companies:
🔒 Automated policy enforcement
📋 Real-time approval workflows  
📊 Comprehensive audit trails
🏛️ Regulatory compliance reporting
⚡ Instant policy violation alerts

{{company_name}} can achieve complete travel governance without slowing down your team.`,
        cta: 'See Compliance Demo',
        estimatedOpenRate: 48,
        estimatedClickRate: 15
    },
    {
        id: 'whatsapp-followup',
        name: 'WhatsApp Follow-up',
        description: 'Quick WhatsApp follow-up for engaged leads',
        type: 'whatsapp',
        industry: 'All',
        content: `Hi {{contact_name}}! 👋

Following up on our email about SOAR-AI's corporate travel solutions for {{company_name}}.

Quick question: What's your biggest travel management challenge right now?

I'd love to show you how we've helped similar {{industry}} companies:
• ✅ {{specific_benefit_1}}
• ✅ {{specific_benefit_2}}
• ✅ {{specific_benefit_3}}

Worth a 10-minute chat? 📞`,
        cta: 'Yes, let\'s chat!',
        estimatedOpenRate: 95,
        estimatedClickRate: 35
    },
    {
        id: 'linkedin-connection',
        name: 'LinkedIn Connection Request',
        description: 'Professional connection request with value proposition',
        type: 'linkedin',
        industry: 'All',
        linkedinType: 'connection',
        content: `Hi {{contact_name}},

I noticed your role as {{job_title}} at {{company_name}} and would love to connect! 

I specialize in helping {{industry}} companies optimize their corporate travel operations. Based on {{company_name}}'s profile, I believe there could be some valuable synergies.

Would you be open to connecting?`,
        cta: 'Connect',
        estimatedOpenRate: 65,
        estimatedClickRate: 25
    },
    {
        id: 'linkedin-message',
        name: 'LinkedIn Direct Message',
        description: 'Professional outreach message with specific value',
        type: 'linkedin',
        industry: 'Technology',
        linkedinType: 'message',
        content: `Hi {{contact_name}},

I hope you're doing well! I came across {{company_name}} and was impressed by your growth in the {{industry}} sector.

I'm reaching out because I've been helping similar tech companies reduce their travel costs by 30-40% while improving employee experience. Given {{company_name}}'s scale ({{employees}} employees), there could be significant opportunities.

Some quick wins I've identified for companies like yours:
🚀 Automated travel policy enforcement
💰 Real-time cost optimization
📱 Mobile-first booking experience
📊 Advanced travel analytics

Would you be interested in a brief 15-minute conversation to explore how this might apply to {{company_name}}?`,
        cta: 'Schedule 15-min call',
        estimatedOpenRate: 70,
        estimatedClickRate: 30
    },
    {
        id: 'linkedin-post-engagement',
        name: 'LinkedIn Post Engagement',
        description: 'Thought leadership post to attract corporate travel managers',
        type: 'linkedin',
        industry: 'All',
        linkedinType: 'post',
        content: `🚀 Corporate Travel Transformation: What we're seeing in 2024

After analyzing 500+ corporate travel programs this year, here are the top 3 trends:

1️⃣ AI-Driven Policy Compliance
Companies are achieving 95%+ policy adherence with automated enforcement. The days of manual expense report reviews are ending.

2️⃣ Predictive Cost Management  
Advanced analytics are helping CFOs predict travel spend 6 months in advance, enabling better budget planning and cost control.

3️⃣ Employee Experience Revolution
The best travel programs now prioritize traveler satisfaction alongside cost savings. Happy travelers = better compliance.

What trends are you seeing in your travel program? 

#CorporateTravel #TravelManagement #BusinessTravel #AI #CostOptimization`,
        cta: 'Engage with post',
        estimatedOpenRate: 85,
        estimatedClickRate: 15
    }
];
const mockCampaignData = {
    emailsSent: 1247,
    delivered: 1189,
    bounced: 58,
    opened: 534,
    uniqueOpened: 398,
    clicked: 142,
    unsubscribed: 23,
    whatsappDelivered: 423,
    whatsappRead: 387,
    linkedinConnections: 156,
    linkedinMessages: 89,
    linkedinPostViews: 2847,
    linkedinEngagements: 234,
    leadsGenerated: 89,
    responses: 156,
    followUpSet: 67
};
export function MarketingCampaign({ targetLeads, onNavigate, onBack }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showTemplateCreator, setShowTemplateCreator] = useState(false);
    const [customTemplates, setCustomTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        description: '',
        type: 'email',
        industry: 'All',
        content: '',
        cta: '',
        linkedinType: 'message'
    });
    const [campaignData, setCampaignData] = useState({
        name: '',
        objective: 'lead-nurturing',
        channels: ['email'],
        targetAudience: targetLeads,
        template: null,
        schedule: {
            startDate: new Date().toISOString().split('T')[0],
            timezone: 'UTC',
            sendTime: '09:00',
            frequency: 'immediate'
        },
        content: {
            email: {
                subject: '',
                body: '',
                cta: ''
            },
            whatsapp: {
                message: '',
                cta: ''
            },
            linkedin: {
                type: 'message',
                content: '',
                cta: '',
                subject: ''
            }
        },
        settings: {
            trackOpens: true,
            trackClicks: true,
            autoFollowUp: false,
            respectUnsubscribe: true,
            abTest: false
        }
    });
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLaunching, setIsLaunching] = useState(false);
    const [campaignLaunched, setCampaignLaunched] = useState(false);
    const [showMetrics, setShowMetrics] = useState(false);
    const steps = [
        { id: 1, name: 'Campaign Setup', description: 'Basic campaign configuration' },
        { id: 2, name: 'Audience & Targeting', description: 'Define target audience and segmentation' },
        { id: 3, name: 'Content Creation', description: 'Create campaign content and messaging' },
        { id: 4, name: 'Schedule & Settings', description: 'Set timing and campaign settings' },
        { id: 5, name: 'Review & Launch', description: 'Final review and campaign launch' }
    ];
    const allTemplates = [...campaignTemplates, ...customTemplates];
    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setCampaignData(prev => ({
            ...prev,
            channels: template.type === 'mixed' ? ['email', 'whatsapp', 'linkedin'] : [template.type],
            content: {
                ...prev.content,
                email: {
                    subject: template.subject || '',
                    body: template.type === 'email' ? template.content : '',
                    cta: template.cta
                },
                whatsapp: {
                    message: template.type === 'whatsapp' ? template.content : '',
                    cta: template.cta
                },
                linkedin: {
                    type: template.linkedinType || 'message',
                    content: template.type === 'linkedin' ? template.content : '',
                    cta: template.cta,
                    subject: template.subject || ''
                }
            }
        }));
    };
    const handleCreateTemplate = () => {
        if (!newTemplate.name || !newTemplate.content)
            return;
        const template = {
            id: `custom-${Date.now()}`,
            name: newTemplate.name,
            description: newTemplate.description,
            type: newTemplate.type,
            industry: newTemplate.industry,
            content: newTemplate.content,
            cta: newTemplate.cta,
            linkedinType: newTemplate.linkedinType,
            subject: newTemplate.subject,
            estimatedOpenRate: 40, // Default estimate
            estimatedClickRate: 10, // Default estimate
            createdBy: 'User',
            isCustom: true
        };
        setCustomTemplates([...customTemplates, template]);
        setShowTemplateCreator(false);
        setNewTemplate({
            name: '',
            description: '',
            type: 'email',
            industry: 'All',
            content: '',
            cta: '',
            linkedinType: 'message'
        });
    };
    const handleLaunchCampaign = async () => {
        setIsLaunching(true);
        // Simulate campaign launch
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLaunching(false);
        setCampaignLaunched(true);
        setShowMetrics(true);
    };
    const personalizeContent = (content, lead) => {
        return content
            .replace(/{{company_name}}/g, lead.company)
            .replace(/{{contact_name}}/g, lead.contact)
            .replace(/{{job_title}}/g, lead.title || 'Decision Maker')
            .replace(/{{industry}}/g, lead.industry)
            .replace(/{{employees}}/g, lead.employees?.toLocaleString() || 'N/A')
            .replace(/{{travel_budget}}/g, lead.travelBudget || 'Not specified')
            .replace(/{{calculated_savings}}/g, calculateSavings(lead.travelBudget))
            .replace(/{{specific_benefit_1}}/g, getBenefitForIndustry(lead.industry, 1))
            .replace(/{{specific_benefit_2}}/g, getBenefitForIndustry(lead.industry, 2))
            .replace(/{{specific_benefit_3}}/g, getBenefitForIndustry(lead.industry, 3));
    };
    const calculateSavings = (budget) => {
        if (!budget)
            return '$50,000+';
        const amount = parseInt(budget.replace(/[^\d]/g, ''));
        const multiplier = budget.includes('M') ? 1000000 : budget.includes('K') ? 1000 : 1;
        const totalBudget = amount * multiplier;
        const savings = Math.round(totalBudget * 0.35);
        if (savings >= 1000000) {
            return `$${(savings / 1000000).toFixed(1)}M`;
        }
        else if (savings >= 1000) {
            return `$${(savings / 1000).toFixed(0)}K`;
        }
        return `$${savings.toLocaleString()}`;
    };
    const getBenefitForIndustry = (industry, index) => {
        const benefits = {
            'Technology': ['API integrations', 'Automated expense reporting', 'Real-time analytics'],
            'Manufacturing': ['Multi-site coordination', 'Supply chain travel optimization', 'Cost control'],
            'Financial Services': ['Compliance management', 'Audit trail reporting', 'Risk management'],
            'Banking': ['Regulatory compliance', 'Secure booking platform', 'Policy enforcement'],
            'Consulting': ['Client billing integration', 'Project-based travel', 'Flexible policies'],
            'default': ['Cost savings', 'Time efficiency', 'Better compliance']
        };
        const industryBenefits = benefits[industry] || benefits.default;
        return industryBenefits[index - 1] || industryBenefits[0];
    };
    const insertPersonalizationVariable = (variable) => {
        const textarea = document.querySelector('textarea[placeholder="Write your template content here..."]');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.substring(0, start) + variable + text.substring(end);
            setNewTemplate(prev => ({ ...prev, content: newText }));
            // Set cursor position after the inserted variable
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + variable.length, start + variable.length);
            }, 0);
        }
    };
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Campaign Setup" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Campaign Name" }), _jsx(Input, { value: campaignData.name, onChange: (e) => setCampaignData(prev => ({ ...prev, name: e.target.value })), placeholder: "e.g., Q4 Enterprise Outreach" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Campaign Objective" }), _jsxs(Select, { value: campaignData.objective, onValueChange: (value) => setCampaignData(prev => ({ ...prev, objective: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "lead-nurturing", children: "Lead Nurturing" }), _jsx(SelectItem, { value: "conversion", children: "Lead Conversion" }), _jsx(SelectItem, { value: "reengagement", children: "Re-engagement" }), _jsx(SelectItem, { value: "onboarding", children: "New Client Onboarding" }), _jsx(SelectItem, { value: "upsell", children: "Upsell & Cross-sell" }), _jsx(SelectItem, { value: "brand-awareness", children: "Brand Awareness" })] })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-base font-medium", children: "Communication Channels" }), _jsxs("div", { className: "flex gap-4 mt-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "email", checked: campaignData.channels.includes('email'), onChange: (e) => {
                                                        if (e.target.checked) {
                                                            setCampaignData(prev => ({ ...prev, channels: [...prev.channels, 'email'] }));
                                                        }
                                                        else {
                                                            setCampaignData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'email') }));
                                                        }
                                                    } }), _jsxs(Label, { htmlFor: "email", className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-4 w-4" }), "Email"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "whatsapp", checked: campaignData.channels.includes('whatsapp'), onChange: (e) => {
                                                        if (e.target.checked) {
                                                            setCampaignData(prev => ({ ...prev, channels: [...prev.channels, 'whatsapp'] }));
                                                        }
                                                        else {
                                                            setCampaignData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'whatsapp') }));
                                                        }
                                                    } }), _jsxs(Label, { htmlFor: "whatsapp", className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-4 w-4" }), "WhatsApp"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "linkedin", checked: campaignData.channels.includes('linkedin'), onChange: (e) => {
                                                        if (e.target.checked) {
                                                            setCampaignData(prev => ({ ...prev, channels: [...prev.channels, 'linkedin'] }));
                                                        }
                                                        else {
                                                            setCampaignData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'linkedin') }));
                                                        }
                                                    } }), _jsxs(Label, { htmlFor: "linkedin", className: "flex items-center gap-2", children: [_jsx(Linkedin, { className: "h-4 w-4" }), "LinkedIn"] })] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx(Label, { className: "text-base font-medium", children: "Campaign Templates" }), _jsxs(Button, { variant: "outline", onClick: () => setShowTemplateCreator(true), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create Template"] })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Choose a template to get started quickly" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: allTemplates.filter(template => campaignData.channels.includes(template.type) ||
                                        (template.type === 'mixed' && campaignData.channels.length > 1)).map((template) => (_jsx(Card, { className: `cursor-pointer transition-all hover:shadow-md ${selectedTemplate?.id === template.id ? 'ring-2 ring-primary border-primary' : ''}`, onClick: () => handleTemplateSelect(template), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium", children: template.name }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsxs(Badge, { variant: "outline", children: [template.type === 'email' && _jsx(Mail, { className: "h-3 w-3 mr-1" }), template.type === 'whatsapp' && _jsx(MessageSquare, { className: "h-3 w-3 mr-1" }), template.type === 'linkedin' && _jsx(Linkedin, { className: "h-3 w-3 mr-1" }), template.type === 'mixed' && _jsx(Zap, { className: "h-3 w-3 mr-1" }), template.type] }), template.isCustom && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Custom" }))] })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-3", children: template.description }), template.linkedinType && (_jsxs("p", { className: "text-xs text-blue-600 mb-2", children: ["LinkedIn ", template.linkedinType] })), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: ["Open: ", template.estimatedOpenRate, "%"] }), _jsxs("span", { children: ["Click: ", template.estimatedClickRate, "%"] })] })] }) }, template.id))) })] }), _jsx(Dialog, { open: showTemplateCreator, onOpenChange: setShowTemplateCreator, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create Custom Template" }), _jsx(DialogDescription, { children: "Design your own campaign template with personalized content" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Template Name" }), _jsx(Input, { value: newTemplate.name || '', onChange: (e) => setNewTemplate(prev => ({ ...prev, name: e.target.value })), placeholder: "Enter template name" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Channel Type" }), _jsxs(Select, { value: newTemplate.type, onValueChange: (value) => setNewTemplate(prev => ({ ...prev, type: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "email", children: "Email" }), _jsx(SelectItem, { value: "whatsapp", children: "WhatsApp" }), _jsx(SelectItem, { value: "linkedin", children: "LinkedIn" }), _jsx(SelectItem, { value: "mixed", children: "Multi-Channel" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Target Industry" }), _jsxs(Select, { value: newTemplate.industry, onValueChange: (value) => setNewTemplate(prev => ({ ...prev, industry: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "All", children: "All Industries" }), _jsx(SelectItem, { value: "Technology", children: "Technology" }), _jsx(SelectItem, { value: "Manufacturing", children: "Manufacturing" }), _jsx(SelectItem, { value: "Financial Services", children: "Financial Services" }), _jsx(SelectItem, { value: "Banking", children: "Banking" }), _jsx(SelectItem, { value: "Consulting", children: "Consulting" }), _jsx(SelectItem, { value: "Healthcare", children: "Healthcare" })] })] })] }), newTemplate.type === 'linkedin' && (_jsxs("div", { children: [_jsx(Label, { children: "LinkedIn Type" }), _jsxs(Select, { value: newTemplate.linkedinType, onValueChange: (value) => setNewTemplate(prev => ({ ...prev, linkedinType: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "message", children: "Direct Message" }), _jsx(SelectItem, { value: "post", children: "Post/Content" }), _jsx(SelectItem, { value: "connection", children: "Connection Request" })] })] })] }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Description" }), _jsx(Input, { value: newTemplate.description || '', onChange: (e) => setNewTemplate(prev => ({ ...prev, description: e.target.value })), placeholder: "Brief description of this template" })] }), (newTemplate.type === 'email' || newTemplate.type === 'linkedin') && (_jsxs("div", { children: [_jsxs(Label, { children: ["Subject Line ", newTemplate.type === 'linkedin' && newTemplate.linkedinType === 'connection' ? '(Connection Note)' : ''] }), _jsx(Input, { value: newTemplate.subject || '', onChange: (e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value })), placeholder: "Enter subject line or connection note" })] })), _jsxs("div", { children: [_jsx(Label, { children: "Content" }), _jsx(Textarea, { value: newTemplate.content || '', onChange: (e) => setNewTemplate(prev => ({ ...prev, content: e.target.value })), placeholder: "Write your template content here...", rows: 12 }), _jsxs("div", { className: "mt-2 text-xs text-muted-foreground", children: [_jsx("p", { className: "font-medium mb-1", children: "Available personalization variables:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['{{company_name}}', '{{contact_name}}', '{{job_title}}', '{{industry}}', '{{employees}}', '{{travel_budget}}'].map(variable => (_jsx(Badge, { variant: "outline", className: "text-xs cursor-pointer hover:bg-gray-100", onClick: () => insertPersonalizationVariable(variable), children: variable }, variable))) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Call-to-Action" }), _jsx(Input, { value: newTemplate.cta || '', onChange: (e) => setNewTemplate(prev => ({ ...prev, cta: e.target.value })), placeholder: "e.g., Schedule a Demo, Connect, Learn More" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowTemplateCreator(false), children: "Cancel" }), _jsxs(Button, { onClick: handleCreateTemplate, disabled: !newTemplate.name || !newTemplate.content, children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "Create Template"] })] })] }) })] }));
            case 2:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Audience & Targeting" }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5" }), "Target Leads (", targetLeads.length, ")"] }), _jsx(CardDescription, { children: "Leads selected for this campaign" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: targetLeads.map((lead) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg", children: _jsx(Building2, { className: "h-4 w-4 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: lead.company }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [lead.contact, " \u2022 ", lead.industry] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx(Badge, { variant: lead.status === 'qualified' ? 'default' : 'secondary', children: lead.status }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["Score: ", lead.score] })] })] }, lead.id))) }) })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-base font-medium", children: "Audience Segmentation" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(Building2, { className: "h-8 w-8 mx-auto mb-2 text-blue-500" }), _jsx("p", { className: "font-medium", children: "Industries" }), _jsx("p", { className: "text-2xl font-bold", children: new Set(targetLeads.map(l => l.industry)).size })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(Users, { className: "h-8 w-8 mx-auto mb-2 text-green-500" }), _jsx("p", { className: "font-medium", children: "Company Sizes" }), _jsx("p", { className: "text-2xl font-bold", children: new Set(targetLeads.map(l => l.employees > 1000 ? 'Large' : 'SMB')).size })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(Globe, { className: "h-8 w-8 mx-auto mb-2 text-purple-500" }), _jsx("p", { className: "font-medium", children: "Locations" }), _jsx("p", { className: "text-2xl font-bold", children: new Set(targetLeads.map(l => l.location?.split(',')[1]?.trim() || 'Unknown')).size })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(Star, { className: "h-8 w-8 mx-auto mb-2 text-yellow-500" }), _jsx("p", { className: "font-medium", children: "Avg Score" }), _jsx("p", { className: "text-2xl font-bold", children: Math.round(targetLeads.reduce((sum, l) => sum + l.score, 0) / targetLeads.length) })] }) })] })] })] }));
            case 3:
                return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Content Creation" }), _jsxs(Tabs, { defaultValue: "email", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsxs(TabsTrigger, { value: "email", disabled: !campaignData.channels.includes('email'), children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), "Email Content"] }), _jsxs(TabsTrigger, { value: "whatsapp", disabled: !campaignData.channels.includes('whatsapp'), children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-2" }), "WhatsApp Content"] }), _jsxs(TabsTrigger, { value: "linkedin", disabled: !campaignData.channels.includes('linkedin'), children: [_jsx(Linkedin, { className: "h-4 w-4 mr-2" }), "LinkedIn Content"] })] }), _jsxs(TabsContent, { value: "email", className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Email Subject Line" }), _jsx(Input, { value: campaignData.content.email.subject, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, email: { ...prev.content.email, subject: e.target.value } }
                                                        })), placeholder: "Enter compelling subject line..." }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["Use ", '{{', " company_name ", '}}', ", ", '{{', " contact_name ", '}}', ", ", '{{', " industry ", '}}', " for personalization"] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Email Body" }), _jsx(Textarea, { value: campaignData.content.email.body, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, email: { ...prev.content.email, body: e.target.value } }
                                                        })), placeholder: "Write your email content...", rows: 12 })] }), _jsxs("div", { children: [_jsx(Label, { children: "Call-to-Action" }), _jsx(Input, { value: campaignData.content.email.cta, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, email: { ...prev.content.email, cta: e.target.value } }
                                                        })), placeholder: "e.g., Schedule a Demo, Get Quote, Learn More" })] })] }), _jsxs(TabsContent, { value: "whatsapp", className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "WhatsApp Message" }), _jsx(Textarea, { value: campaignData.content.whatsapp.message, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, whatsapp: { ...prev.content.whatsapp, message: e.target.value } }
                                                        })), placeholder: "Write your WhatsApp message...", rows: 8 }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Keep it conversational and under 1000 characters for best results" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Call-to-Action" }), _jsx(Input, { value: campaignData.content.whatsapp.cta, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, whatsapp: { ...prev.content.whatsapp, cta: e.target.value } }
                                                        })), placeholder: "e.g., Reply YES, Call me, Send details" })] })] }), _jsxs(TabsContent, { value: "linkedin", className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "LinkedIn Content Type" }), _jsxs(Select, { value: campaignData.content.linkedin.type, onValueChange: (value) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, linkedin: { ...prev.content.linkedin, type: value } }
                                                        })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "message", children: "Direct Message" }), _jsx(SelectItem, { value: "connection", children: "Connection Request" }), _jsx(SelectItem, { value: "post", children: "LinkedIn Post" })] })] })] }), (campaignData.content.linkedin.type === 'message' || campaignData.content.linkedin.type === 'connection') && (_jsxs("div", { children: [_jsx(Label, { children: campaignData.content.linkedin.type === 'connection' ? 'Connection Note' : 'Message Subject' }), _jsx(Input, { value: campaignData.content.linkedin.subject, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, linkedin: { ...prev.content.linkedin, subject: e.target.value } }
                                                        })), placeholder: campaignData.content.linkedin.type === 'connection' ? 'Brief connection note...' : 'Message subject...' })] })), _jsxs("div", { children: [_jsx(Label, { children: campaignData.content.linkedin.type === 'post' ? 'Post Content' : 'Message Content' }), _jsx(Textarea, { value: campaignData.content.linkedin.content, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, linkedin: { ...prev.content.linkedin, content: e.target.value } }
                                                        })), placeholder: `Write your LinkedIn ${campaignData.content.linkedin.type} content...`, rows: campaignData.content.linkedin.type === 'post' ? 10 : 8 }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: campaignData.content.linkedin.type === 'connection'
                                                            ? 'Keep connection requests under 300 characters'
                                                            : campaignData.content.linkedin.type === 'post'
                                                                ? 'Use hashtags and @mentions to increase visibility'
                                                                : 'Professional tone works best for LinkedIn messages' })] }), _jsxs("div", { children: [_jsx(Label, { children: "Call-to-Action" }), _jsx(Input, { value: campaignData.content.linkedin.cta, onChange: (e) => setCampaignData(prev => ({
                                                            ...prev,
                                                            content: { ...prev.content, linkedin: { ...prev.content.linkedin, cta: e.target.value } }
                                                        })), placeholder: "e.g., Connect, Schedule Call, View Profile" })] })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx(Label, { className: "text-base font-medium", children: "Content Preview" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "See how your content will look to recipients" }), targetLeads.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-sm", children: ["Preview for ", targetLeads[0].company] }) }), _jsxs(CardContent, { children: [campaignData.channels.includes('email') && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-medium mb-2", children: "Email Preview:" }), _jsxs("div", { className: "p-3 border rounded bg-gray-50", children: [_jsxs("p", { className: "font-medium text-sm", children: ["Subject: ", personalizeContent(campaignData.content.email.subject, targetLeads[0])] }), _jsx("div", { className: "mt-2 text-sm whitespace-pre-wrap", children: personalizeContent(campaignData.content.email.body, targetLeads[0]) }), campaignData.content.email.cta && (_jsx("div", { className: "mt-3", children: _jsx(Button, { size: "sm", children: campaignData.content.email.cta }) }))] })] })), campaignData.channels.includes('whatsapp') && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-medium mb-2", children: "WhatsApp Preview:" }), _jsxs("div", { className: "p-3 border rounded bg-green-50", children: [_jsx("div", { className: "text-sm whitespace-pre-wrap", children: personalizeContent(campaignData.content.whatsapp.message, targetLeads[0]) }), campaignData.content.whatsapp.cta && (_jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "outline", children: campaignData.content.whatsapp.cta }) }))] })] })), campaignData.channels.includes('linkedin') && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "LinkedIn Preview:" }), _jsxs("div", { className: "p-3 border rounded bg-blue-50", children: [campaignData.content.linkedin.subject && (_jsxs("p", { className: "font-medium text-sm mb-2", children: [campaignData.content.linkedin.type === 'connection' ? 'Connection Note: ' : 'Subject: ', personalizeContent(campaignData.content.linkedin.subject, targetLeads[0])] })), _jsx("div", { className: "text-sm whitespace-pre-wrap", children: personalizeContent(campaignData.content.linkedin.content, targetLeads[0]) }), campaignData.content.linkedin.cta && (_jsx("div", { className: "mt-3", children: _jsxs(Button, { size: "sm", variant: "outline", className: "bg-blue-600 text-white hover:bg-blue-700", children: [_jsx(Linkedin, { className: "h-4 w-4 mr-2" }), campaignData.content.linkedin.cta] }) }))] })] }))] })] }))] })] }) }));
            case 4:
                return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Schedule & Settings" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-5 w-5" }), "Campaign Schedule"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Start Date" }), _jsx(Input, { type: "date", value: campaignData.schedule.startDate, onChange: (e) => setCampaignData(prev => ({
                                                                    ...prev,
                                                                    schedule: { ...prev.schedule, startDate: e.target.value }
                                                                })) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Send Time" }), _jsx(Input, { type: "time", value: campaignData.schedule.sendTime, onChange: (e) => setCampaignData(prev => ({
                                                                    ...prev,
                                                                    schedule: { ...prev.schedule, sendTime: e.target.value }
                                                                })) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Frequency" }), _jsxs(Select, { value: campaignData.schedule.frequency, onValueChange: (value) => setCampaignData(prev => ({
                                                                    ...prev,
                                                                    schedule: { ...prev.schedule, frequency: value }
                                                                })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "immediate", children: "Send Immediately" }), _jsx(SelectItem, { value: "once", children: "Send Once" }), _jsx(SelectItem, { value: "weekly", children: "Weekly Follow-up" }), _jsx(SelectItem, { value: "monthly", children: "Monthly Nurture" })] })] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Settings, { className: "h-5 w-5" }), "Campaign Settings"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "Track Opens" }), _jsx(Switch, { checked: campaignData.settings.trackOpens, onCheckedChange: (checked) => setCampaignData(prev => ({
                                                                    ...prev,
                                                                    settings: { ...prev.settings, trackOpens: checked }
                                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "Track Clicks" }), _jsx(Switch, { checked: campaignData.settings.trackClicks, onCheckedChange: (checked) => setCampaignData(prev => ({
                                                                    ...prev,
                                                                    settings: { ...prev.settings, trackClicks: checked }
                                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "Auto Follow-up" }), _jsx(Switch, { checked: campaignData.settings.autoFollowUp, onCheckedChange: (checked) => setCampaignData(prev => ({
                                                                    ...prev,
                                                                    settings: { ...prev.settings, autoFollowUp: checked }
                                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "A/B Testing" }), _jsx(Switch, { checked: campaignData.settings.abTest, onCheckedChange: (checked) => setCampaignData(prev => ({
                                                                    ...prev,
                                                                    settings: { ...prev.settings, abTest: checked }
                                                                })) })] })] })] })] })] }) }));
            case 5:
                return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Review & Launch" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Campaign Summary" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Campaign Name:" }), _jsx("span", { className: "font-medium", children: campaignData.name || 'Untitled Campaign' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Objective:" }), _jsx("span", { className: "font-medium capitalize", children: campaignData.objective.replace('-', ' ') })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Channels:" }), _jsx("div", { className: "flex gap-1", children: campaignData.channels.map(channel => (_jsxs(Badge, { variant: "outline", children: [channel === 'email' && _jsx(Mail, { className: "h-3 w-3 mr-1" }), channel === 'whatsapp' && _jsx(MessageSquare, { className: "h-3 w-3 mr-1" }), channel === 'linkedin' && _jsx(Linkedin, { className: "h-3 w-3 mr-1" }), channel] }, channel))) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Target Leads:" }), _jsx("span", { className: "font-medium", children: targetLeads.length })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Start Date:" }), _jsx("span", { className: "font-medium", children: campaignData.schedule.startDate })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "h-5 w-5" }), "AI Predictions"] }) }), _jsx(CardContent, { className: "space-y-3", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: Math.round(targetLeads.length * 0.45) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Expected Opens" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-green-600", children: Math.round(targetLeads.length * 0.12) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Expected Clicks" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: Math.round(targetLeads.length * 0.08) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Expected Responses" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-orange-600", children: Math.round(targetLeads.length * 0.05) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Expected Conversions" })] })] }) })] })] }), _jsxs("div", { children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Final Content Review" }) }), _jsxs(CardContent, { children: [campaignData.channels.includes('email') && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-medium mb-2", children: "Email Campaign:" }), _jsxs("div", { className: "p-3 border rounded bg-gray-50 text-sm", children: [_jsxs("p", { className: "font-medium", children: ["Subject: ", campaignData.content.email.subject] }), _jsx("div", { className: "mt-2 whitespace-pre-wrap line-clamp-4", children: campaignData.content.email.body }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "outline", children: campaignData.content.email.cta }) })] })] })), campaignData.channels.includes('whatsapp') && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-medium mb-2", children: "WhatsApp Campaign:" }), _jsxs("div", { className: "p-3 border rounded bg-green-50 text-sm", children: [_jsx("div", { className: "whitespace-pre-wrap line-clamp-4", children: campaignData.content.whatsapp.message }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "outline", children: campaignData.content.whatsapp.cta }) })] })] })), campaignData.channels.includes('linkedin') && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "LinkedIn Campaign:" }), _jsxs("div", { className: "p-3 border rounded bg-blue-50 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Linkedin, { className: "h-4 w-4" }), _jsx("span", { className: "font-medium", children: campaignData.content.linkedin.type })] }), campaignData.content.linkedin.subject && (_jsxs("p", { className: "font-medium mb-2", children: ["Subject: ", campaignData.content.linkedin.subject] })), _jsx("div", { className: "whitespace-pre-wrap line-clamp-4", children: campaignData.content.linkedin.content }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "outline", children: campaignData.content.linkedin.cta }) })] })] }))] })] }), _jsx("div", { className: "mt-6", children: _jsx(Button, { onClick: handleLaunchCampaign, disabled: isLaunching, className: "w-full", size: "lg", children: isLaunching ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }), "Launching Campaign..."] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), "Launch Campaign"] })) }) })] })] })] }) }));
            default:
                return null;
        }
    };
    if (showMetrics && campaignLaunched) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: onBack, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Leads"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Campaign Metrics" }), _jsxs("p", { className: "text-muted-foreground", children: [campaignData.name || 'Marketing Campaign', " - Live Dashboard"] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export Report"] }), _jsxs(Button, { variant: "outline", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh"] })] })] }), _jsxs(Alert, { children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "Campaign launched successfully! Real-time metrics are updating automatically." })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(Send, { className: "h-8 w-8 mx-auto mb-2 text-blue-500" }), _jsx("p", { className: "text-2xl font-bold", children: mockCampaignData.emailsSent.toLocaleString() }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Emails Sent" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(CheckCircle, { className: "h-8 w-8 mx-auto mb-2 text-green-500" }), _jsx("p", { className: "text-2xl font-bold", children: mockCampaignData.delivered.toLocaleString() }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Delivered" }), _jsxs("p", { className: "text-xs text-green-600", children: [((mockCampaignData.delivered / mockCampaignData.emailsSent) * 100).toFixed(1), "%"] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(AlertTriangle, { className: "h-8 w-8 mx-auto mb-2 text-red-500" }), _jsx("p", { className: "text-2xl font-bold", children: mockCampaignData.bounced }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Bounced" }), _jsxs("p", { className: "text-xs text-red-600", children: [((mockCampaignData.bounced / mockCampaignData.emailsSent) * 100).toFixed(1), "%"] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(Eye, { className: "h-8 w-8 mx-auto mb-2 text-purple-500" }), _jsx("p", { className: "text-2xl font-bold", children: mockCampaignData.opened }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Opened" }), _jsxs("p", { className: "text-xs text-purple-600", children: [((mockCampaignData.opened / mockCampaignData.delivered) * 100).toFixed(1), "%"] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(MousePointer, { className: "h-8 w-8 mx-auto mb-2 text-orange-500" }), _jsx("p", { className: "text-2xl font-bold", children: mockCampaignData.clicked }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Clicked" }), _jsxs("p", { className: "text-xs text-orange-600", children: [((mockCampaignData.clicked / mockCampaignData.opened) * 100).toFixed(1), "%"] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(UserMinus, { className: "h-8 w-8 mx-auto mb-2 text-gray-500" }), _jsx("p", { className: "text-2xl font-bold", children: mockCampaignData.unsubscribed }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Unsubscribed" }), _jsxs("p", { className: "text-xs text-gray-600", children: [((mockCampaignData.unsubscribed / mockCampaignData.delivered) * 100).toFixed(1), "%"] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [campaignData.channels.includes('whatsapp') && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), "WhatsApp Campaign Metrics"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-green-600", children: mockCampaignData.whatsappDelivered }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Messages Delivered" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: mockCampaignData.whatsappRead }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Messages Read" }), _jsxs("p", { className: "text-xs text-blue-600", children: [((mockCampaignData.whatsappRead / mockCampaignData.whatsappDelivered) * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: Math.round(mockCampaignData.whatsappRead * 0.4) }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Responses" }), _jsxs("p", { className: "text-xs text-purple-600", children: [((mockCampaignData.whatsappRead * 0.4) / mockCampaignData.whatsappRead * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-orange-600", children: Math.round(mockCampaignData.whatsappRead * 0.25) }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Engagements" }), _jsxs("p", { className: "text-xs text-orange-600", children: [((mockCampaignData.whatsappRead * 0.25) / mockCampaignData.whatsappRead * 100).toFixed(1), "%"] })] })] }) })] })), campaignData.channels.includes('linkedin') && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Linkedin, { className: "h-5 w-5" }), "LinkedIn Campaign Metrics"] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: mockCampaignData.linkedinConnections }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Connections Sent" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-green-600", children: mockCampaignData.linkedinMessages }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Messages Sent" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: mockCampaignData.linkedinPostViews.toLocaleString() }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Post Views" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-orange-600", children: mockCampaignData.linkedinEngagements }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Engagements" }), _jsxs("p", { className: "text-xs text-orange-600", children: [((mockCampaignData.linkedinEngagements / mockCampaignData.linkedinPostViews) * 100).toFixed(1), "%"] })] })] }), _jsx(Separator, { className: "my-4" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Connection Acceptance Rate:" }), _jsx("span", { className: "font-medium", children: "67%" })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Message Response Rate:" }), _jsx("span", { className: "font-medium", children: "34%" })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Profile Views Generated:" }), _jsx("span", { className: "font-medium", children: "145" })] })] })] })] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-5 w-5" }), "Lead Generation"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Leads Generated" }), _jsx("span", { className: "text-2xl font-bold text-green-600", children: mockCampaignData.leadsGenerated })] }), _jsx(Progress, { value: (mockCampaignData.leadsGenerated / mockCampaignData.clicked) * 100 }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [((mockCampaignData.leadsGenerated / mockCampaignData.clicked) * 100).toFixed(1), "% click to lead conversion"] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), "Response Rate"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Total Responses" }), _jsx("span", { className: "text-2xl font-bold text-blue-600", children: mockCampaignData.responses })] }), _jsx(Progress, { value: (mockCampaignData.responses / mockCampaignData.delivered) * 100 }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [((mockCampaignData.responses / mockCampaignData.delivered) * 100).toFixed(1), "% overall response rate"] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "h-5 w-5" }), "Sales Funnel"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Follow-ups Set" }), _jsx("span", { className: "text-2xl font-bold text-purple-600", children: mockCampaignData.followUpSet })] }), _jsx(Progress, { value: (mockCampaignData.followUpSet / mockCampaignData.responses) * 100 }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [((mockCampaignData.followUpSet / mockCampaignData.responses) * 100).toFixed(1), "% moved to sales funnel"] })] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "h-5 w-5" }), "Campaign Performance Over Time"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-64 flex items-center justify-center text-muted-foreground", children: _jsxs("div", { className: "text-center", children: [_jsx(BarChart3, { className: "h-12 w-12 mx-auto mb-4" }), _jsx("p", { children: "Performance chart would be displayed here" }), _jsx("p", { className: "text-sm", children: "Showing opens, clicks, conversions, and channel performance over time" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "h-5 w-5" }), "AI Insights & Recommendations"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs(Alert, { children: [_jsx(Lightbulb, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "High Performance Alert: " }), "Your LinkedIn outreach is performing 45% above industry average. Consider scaling similar professional content."] })] }), _jsxs(Alert, { children: [_jsx(TrendingUp, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Channel Optimization: " }), "LinkedIn connection requests have a 67% acceptance rate vs 12% email open rate. Prioritize LinkedIn for initial outreach."] })] }), _jsxs(Alert, { children: [_jsx(Target, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Next Action: " }), "89 leads generated and 67 follow-ups scheduled. Set up multi-channel nurture sequence to maintain momentum across all channels."] })] })] }) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { onClick: () => onNavigate('leads-list', { status: 'qualified' }), children: [_jsx(Users, { className: "h-4 w-4 mr-2" }), "View Generated Leads"] }), _jsxs(Button, { variant: "outline", onClick: () => setShowMetrics(false), children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Create Follow-up Campaign"] }), _jsxs(Button, { variant: "outline", children: [_jsx(Copy, { className: "h-4 w-4 mr-2" }), "Duplicate Campaign"] }), _jsxs(Button, { variant: "outline", children: [_jsx(Linkedin, { className: "h-4 w-4 mr-2" }), "Export LinkedIn Leads"] })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: onBack, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Leads"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Marketing Campaign" }), _jsx("p", { className: "text-muted-foreground", children: "Create and launch targeted multi-channel marketing campaigns" })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Campaign Creation Progress" }), _jsxs("span", { className: "text-sm text-muted-foreground", children: ["Step ", currentStep, " of ", steps.length] })] }), _jsx("div", { className: "flex items-center justify-between mb-6", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep === step.id
                                            ? 'bg-primary text-primary-foreground'
                                            : currentStep > step.id
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'}`, children: currentStep > step.id ? (_jsx(CheckCircle, { className: "h-4 w-4" })) : (step.id) }), index < steps.length - 1 && (_jsx("div", { className: `h-0.5 w-16 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-muted'}` }))] }, step.id))) }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium", children: steps[currentStep - 1].name }), _jsx("p", { className: "text-sm text-muted-foreground", children: steps[currentStep - 1].description })] })] }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: renderStepContent() }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Button, { variant: "outline", onClick: () => setCurrentStep(Math.max(1, currentStep - 1)), disabled: currentStep === 1, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Previous"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: onBack, children: "Cancel" }), currentStep < steps.length && (_jsxs(Button, { onClick: () => setCurrentStep(Math.min(steps.length, currentStep + 1)), disabled: (currentStep === 1 && !campaignData.name) ||
                                    (currentStep === 3 && campaignData.channels.includes('email') && !campaignData.content.email.subject), children: ["Next", _jsx(ArrowRight, { className: "h-4 w-4 ml-2" })] }))] })] })] }));
}
