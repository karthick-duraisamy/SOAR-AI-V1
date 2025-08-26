import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageSquare,
  Linkedin,
  Plus,
  CheckCircle,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface MarketingCampaignWizardProps {
  selectedLeads: any[];
  onBack: () => void;
  onComplete: (campaignData: any) => void;
}

const campaignTemplates = [
  {
    id: 'welcome-series',
    name: 'Welcome Series',
    description: 'Multi-touch welcome sequence for new leads',
    type: 'email',
    openRate: 45,
    clickRate: 12,
    content: `Hi {{contact_name}},

Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.

Based on your {{industry}} background, we've identified several opportunities to optimize your travel operations.

Best regards,
SOAR-AI Team`
  },
  {
    id: 'cost-savings',
    name: 'Cost Savings Focus',
    description: 'Emphasizes ROI and cost reduction benefits',
    type: 'email',
    openRate: 52,
    clickRate: 18,
    content: `{{contact_name}},

Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.

Want to see your personalized savings projection?

Best regards,
SOAR-AI Team`
  },
  {
    id: 'compliance-focused',
    name: 'Compliance & Control',
    description: 'Targets compliance and policy management needs',
    type: 'email',
    openRate: 48,
    clickRate: 15,
    content: `Hi {{contact_name}},

Managing travel compliance for {{company_name}} can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.

Best regards,
SOAR-AI Team`
  }
];

const steps = [
  { id: 1, name: 'Campaign Setup', description: 'Basic campaign configuration' },
  { id: 2, name: 'Audience & Targeting', description: 'Define target audience and segmentation' },
  { id: 3, name: 'Content Creation', description: 'Create campaign content and messaging' },
  { id: 4, name: 'Schedule & Settings', description: 'Set timing and campaign settings' },
  { id: 5, name: 'Review & Launch', description: 'Final review and campaign launch' }
];

export function MarketingCampaignWizard({ selectedLeads, onBack, onComplete }: MarketingCampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    channelType: 'email',
    targetIndustry: 'all',
    description: '',
    subjectLine: '',
    content: '',
    cta: ''
  });
  const [campaignData, setCampaignData] = useState({
    name: '',
    objective: 'Lead Nurturing',
    channels: ['email'],
    selectedTemplate: null,
    content: {
      email: {
        subject: '',
        body: '',
        cta: ''
      }
    },
    settings: {
      trackOpens: true,
      trackClicks: true,
      autoFollowUp: false
    }
  });

  const handleTemplateSelect = (template: any) => {
    setCampaignData(prev => ({
      ...prev,
      selectedTemplate: template,
      content: {
        ...prev.content,
        email: {
          subject: `Partnership Opportunity - ${template.name}`,
          body: template.content,
          cta: 'Schedule a Demo'
        }
      }
    }));
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    setCampaignData(prev => ({
      ...prev,
      channels: checked 
        ? [...prev.channels, channel]
        : prev.channels.filter(c => c !== channel)
    }));
  };

  const insertPersonalizationVariable = (variable: string) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + variable + text.substring(end);
      
      setTemplateData(prev => ({ ...prev, content: newText }));
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(campaignData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Q4 Enterprise Outreach"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-objective">Campaign Objective</Label>
                  <Select value={campaignData.objective} onValueChange={(value) => setCampaignData(prev => ({ ...prev, objective: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead Nurturing">Lead Nurturing</SelectItem>
                      <SelectItem value="Lead Conversion">Lead Conversion</SelectItem>
                      <SelectItem value="Re-engagement">Re-engagement</SelectItem>
                      <SelectItem value="Onboarding">New Client Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-900">Communication Channels</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="email"
                    checked={campaignData.channels.includes('email')}
                    onCheckedChange={(checked) => handleChannelChange('email', checked as boolean)}
                  />
                  <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="whatsapp"
                    checked={campaignData.channels.includes('whatsapp')}
                    onCheckedChange={(checked) => handleChannelChange('whatsapp', checked as boolean)}
                  />
                  <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>WhatsApp</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="linkedin"
                    checked={campaignData.channels.includes('linkedin')}
                    onCheckedChange={(checked) => handleChannelChange('linkedin', checked as boolean)}
                  />
                  <Label htmlFor="linkedin" className="flex items-center gap-2 cursor-pointer">
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    <span>LinkedIn</span>
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-gray-900">Campaign Templates</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCreateTemplate(true)}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
              <p className="text-sm text-gray-600">Choose a template to get started quickly</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaignTemplates.filter(template => 
                  campaignData.channels.includes(template.type)
                ).map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                      campaignData.selectedTemplate?.id === template.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          {template.type}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Open: {template.openRate}%</span>
                        <span>Click: {template.clickRate}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience & Targeting</h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  Selected Leads ({selectedLeads.length})
                </CardTitle>
                <CardDescription>Leads selected for this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedLeads.slice(0, 10).map((lead, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-sm">{lead.company || `Company ${index + 1}`}</p>
                        <p className="text-xs text-gray-600">{lead.contact || 'Contact'} • {lead.industry || 'Industry'}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Score: {lead.score || Math.floor(Math.random() * 40) + 60}
                      </Badge>
                    </div>
                  ))}
                  {selectedLeads.length > 10 && (
                    <div className="text-center py-2 text-sm text-gray-600">
                      ... and {selectedLeads.length - 10} more leads
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedLeads.length}</div>
                  <p className="text-xs text-gray-600">Total Leads</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(selectedLeads.reduce((sum, lead) => sum + (lead.score || 65), 0) / selectedLeads.length) || 65}
                  </div>
                  <p className="text-xs text-gray-600">Avg Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(selectedLeads.map(l => l.industry)).size || 3}
                  </div>
                  <p className="text-xs text-gray-600">Industries</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(selectedLeads.filter(l => (l.score || 65) >= 75).length / selectedLeads.length * 100) || 60}%
                  </div>
                  <p className="text-xs text-gray-600">High Quality</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Creation</h3>

            {campaignData.channels.includes('email') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email-subject">Email Subject Line</Label>
                    <Input
                      id="email-subject"
                      value={campaignData.content.email.subject}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: {
                          ...prev.content,
                          email: { ...prev.content.email, subject: e.target.value }
                        }
                      }))}
                      placeholder="Enter compelling subject line..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-body">Email Body</Label>
                    <textarea
                      id="email-body"
                      value={campaignData.content.email.body}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: {
                          ...prev.content,
                          email: { ...prev.content.email, body: e.target.value }
                        }
                      }))}
                      placeholder="Write your email content..."
                      rows={10}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-cta">Call-to-Action</Label>
                    <Input
                      id="email-cta"
                      value={campaignData.content.email.cta}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: {
                          ...prev.content,
                          email: { ...prev.content.email, cta: e.target.value }
                        }
                      }))}
                      placeholder="e.g., Schedule a Demo, Get Quote, Learn More"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedLeads.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Content Preview</CardTitle>
                  <CardDescription>See how your content will look to recipients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-medium text-sm mb-2">
                      Subject: {campaignData.content.email.subject || 'Your subject line here'}
                    </p>
                    <div className="text-sm whitespace-pre-wrap mb-3">
                      {campaignData.content.email.body || 'Your email content will appear here'}
                    </div>
                    {campaignData.content.email.cta && (
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        {campaignData.content.email.cta}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Campaign Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="send-time">Send Time</Label>
                    <Input
                      id="send-time"
                      type="time"
                      defaultValue="09:00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Send Immediately</SelectItem>
                        <SelectItem value="once">Send Once</SelectItem>
                        <SelectItem value="weekly">Weekly Follow-up</SelectItem>
                        <SelectItem value="monthly">Monthly Nurture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Campaign Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Track Opens</Label>
                    <Checkbox
                      checked={campaignData.settings.trackOpens}
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, trackOpens: checked as boolean }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Track Clicks</Label>
                    <Checkbox
                      checked={campaignData.settings.trackClicks}
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, trackClicks: checked as boolean }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Follow-up</Label>
                    <Checkbox
                      checked={campaignData.settings.autoFollowUp}
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, autoFollowUp: checked as boolean }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Launch</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Campaign Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaign Name:</span>
                    <span className="font-medium">{campaignData.name || 'Untitled Campaign'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objective:</span>
                    <span className="font-medium">{campaignData.objective}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Channels:</span>
                    <div className="flex gap-1">
                      {campaignData.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                          {channel === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                          {channel === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Leads:</span>
                    <span className="font-medium">{selectedLeads.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Template:</span>
                    <span className="font-medium">{campaignData.selectedTemplate?.name || 'Custom'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expected Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(selectedLeads.length * 0.45)}
                      </div>
                      <p className="text-xs text-gray-600">Expected Opens</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(selectedLeads.length * 0.12)}
                      </div>
                      <p className="text-xs text-gray-600">Expected Clicks</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(selectedLeads.length * 0.08)}
                      </div>
                      <p className="text-xs text-gray-600">Expected Responses</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(selectedLeads.length * 0.05)}
                      </div>
                      <p className="text-xs text-gray-600">Expected Conversions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your campaign is ready to launch! Review the summary above and click "Launch Campaign" to start your marketing outreach.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Campaign</h1>
            <p className="text-gray-600">Create and launch targeted multi-channel marketing campaigns</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Creation Progress</h2>
            <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.id 
                    ? 'bg-orange-500 text-white' 
                    : currentStep > step.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="font-medium text-gray-900">{steps[currentStep - 1].name}</h3>
            <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="text-gray-700 border-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="text-gray-700 border-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!campaignData.name || campaignData.channels.length === 0)) ||
              (currentStep === 3 && campaignData.channels.includes('email') && !campaignData.content.email.subject)
            }
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {currentStep === 5 ? 'Launch Campaign' : 'Next'}
            {currentStep < 5 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>

      {/* Template Creator Dialog */}
      <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Create Custom Template</DialogTitle>
            <DialogDescription className="text-gray-600">
              Design your own campaign template with personalized content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Template Name and Channel Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name" className="text-sm font-medium text-gray-700">
                  Template Name
                </Label>
                <Input
                  id="template-name"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-type" className="text-sm font-medium text-gray-700">
                  Channel Type
                </Label>
                <Select value={templateData.channelType} onValueChange={(value) => setTemplateData(prev => ({ ...prev, channelType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target Industry */}
            <div className="space-y-2">
              <Label htmlFor="target-industry" className="text-sm font-medium text-gray-700">
                Target Industry
              </Label>
              <Select value={templateData.targetIndustry} onValueChange={(value) => setTemplateData(prev => ({ ...prev, targetIndustry: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <textarea
                id="description"
                value={templateData.description}
                onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
              />
            </div>

            {/* Subject Line */}
            <div className="space-y-2">
              <Label htmlFor="subject-line" className="text-sm font-medium text-gray-700">
                Subject Line
              </Label>
              <Input
                id="subject-line"
                value={templateData.subjectLine}
                onChange={(e) => setTemplateData(prev => ({ ...prev, subjectLine: e.target.value }))}
                placeholder="Enter subject line or connection note"
                className="w-full"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content
              </Label>
              <textarea
                id="template-content"
                value={templateData.content}
                onChange={(e) => setTemplateData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your template content here..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
              />
            </div>

            {/* Available Personalization Variables */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Available personalization variables:
              </Label>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <span 
                  className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => insertPersonalizationVariable('{{company_name}}')}
                >
                  {'{{company_name}}'}
                </span>
                <span 
                  className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => insertPersonalizationVariable('{{contact_name}}')}
                >
                  {'{{contact_name}}'}
                </span>
                <span 
                  className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => insertPersonalizationVariable('{{job_title}}')}
                >
                  {'{{job_title}}'}
                </span>
                <span 
                  className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => insertPersonalizationVariable('{{industry}}')}
                >
                  {'{{industry}}'}
                </span>
                <span 
                  className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => insertPersonalizationVariable('{{employees}}')}
                >
                  {'{{employees}}'}
                </span>
                <span 
                  className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => insertPersonalizationVariable('{{travel_budget}}')}
                >
                  {'{{travel_budget}}'}
                </span>
              </div>
            </div>

            {/* Call-to-Action */}
            <div className="space-y-2">
              <Label htmlFor="cta" className="text-sm font-medium text-gray-700">
                Call-to-Action
              </Label>
              <Input
                id="cta"
                value={templateData.cta}
                onChange={(e) => setTemplateData(prev => ({ ...prev, cta: e.target.value }))}
                placeholder="e.g. Schedule a Demo, Connect, Learn More"
                className="w-full"
              />
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateTemplate(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Handle template creation logic here
                console.log('Creating template:', templateData);
                
                // Reset form
                setTemplateData({
                  name: '',
                  channelType: 'email',
                  targetIndustry: 'all',
                  description: '',
                  subjectLine: '',
                  content: '',
                  cta: ''
                });
                
                setShowCreateTemplate(false);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              Create Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}