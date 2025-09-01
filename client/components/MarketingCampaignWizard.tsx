import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { useTemplateApi } from '../hooks/api/useTemplateApi';
import { useCampaignApi } from '../hooks/api/useCampaignApi';
import { 
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageSquare,
  Linkedin,
  Plus,
  CheckCircle,
  X,
  Save,
  Loader2,
  Brain,
  RefreshCw,
  Send
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

interface CampaignTemplate {
  id?: string | number;
  name: string;
  description: string;
  channel_type: 'email' | 'whatsapp' | 'linkedin' | 'mixed';
  target_industry: string;
  subject_line?: string;
  content: string;
  cta: string;
  linkedin_type?: 'message' | 'post' | 'connection';
  estimated_open_rate: number;
  estimated_click_rate: number;
  is_custom: boolean;
  created_by: string;
}

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
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [templateData, setTemplateData] = useState({
    name: '',
    channel_type: 'email' as 'email' | 'whatsapp' | 'linkedin' | 'mixed',
    target_industry: 'All',
    description: '',
    subject_line: '',
    content: '',
    cta: '',
    linkedin_type: 'message' as 'message' | 'post' | 'connection'
  });
  const [campaignData, setCampaignData] = useState({
    name: '',
    objective: 'Lead Nurturing',
    channels: ['email'],
    selectedTemplate: null as CampaignTemplate | null,
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
  const [isLaunching, setIsLaunching] = useState(false);
  const targetLeads = selectedLeads; // Alias for clarity in case 5

  const { 
    getTemplates, 
    createTemplate, 
    loading: apiLoading, 
    error: apiError 
  } = useTemplateApi();
  
  const { 
    createCampaign,
    loading: campaignLoading,
    error: campaignError
  } = useCampaignApi();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const allTemplates = await getTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setCampaignData(prev => ({
      ...prev,
      selectedTemplate: template,
      channels: template.channel_type === 'mixed' ? ['email', 'whatsapp', 'linkedin'] : [template.channel_type],
      content: {
        ...prev.content,
        email: {
          subject: template.subject_line || `Partnership Opportunity - ${template.name}`,
          body: template.content,
          cta: template.cta
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

  const handleCreateTemplate = async () => {
    if (!templateData.name || !templateData.content) {
      return;
    }

    try {
      const newTemplate = await createTemplate({
        name: templateData.name,
        description: templateData.description,
        channel_type: templateData.channel_type,
        target_industry: templateData.target_industry,
        subject_line: templateData.subject_line,
        content: templateData.content,
        cta: templateData.cta,
        linkedin_type: templateData.linkedin_type,
        estimated_open_rate: 40,
        estimated_click_rate: 10,
        is_custom: true,
        created_by: 'User'
      });

      // Add to local templates array
      setTemplates(prev => [newTemplate, ...prev]);

      // Reset form
      setTemplateData({
        name: '',
        channel_type: 'email',
        target_industry: 'All',
        description: '',
        subject_line: '',
        content: '',
        cta: '',
        linkedin_type: 'message'
      });

      setShowCreateTemplate(false);
    } catch (error) {
      console.error('Failed to create template:', error);
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

  const handleLaunchCampaign = async () => {
    setIsLaunching(true);
    
    try {
      // Create the campaign via API
      const response = await createCampaign({
        ...campaignData,
        targetAudience: selectedLeads
      });
      
      if (response.success) {
        // Show success message and complete
        onComplete({
          ...campaignData,
          campaignId: response.campaign.id,
          launched: true,
          launchDate: new Date().toISOString()
        });
      } else {
        throw new Error(response.error || 'Failed to launch campaign');
      }
    } catch (error: any) {
      console.error('Failed to launch campaign:', error);
      // You can add error handling UI here
      alert(`Failed to launch campaign: ${error.message}`);
    } finally {
      setIsLaunching(false);
    }
  };


  const getFilteredTemplates = () => {
    return templates.filter(template => 
      campaignData.channels.includes(template.channel_type) || 
      (template.channel_type === 'mixed' && campaignData.channels.length > 1)
    );
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
              <div className="flex items-center gap-4">
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

              {apiLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading templates...</span>
                </div>
              )}

              {apiError && (
                <Alert>
                  <AlertDescription>
                    Error loading templates: {apiError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map((template) => (
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
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {template.channel_type === 'email' && <Mail className="h-3 w-3 mr-1" />}
                            {template.channel_type === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                            {template.channel_type === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                            {template.channel_type}
                          </Badge>
                          {template.is_custom && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-xs">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Open: {template.estimated_open_rate}%</span>
                        <span>Click: {template.estimated_click_rate}%</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Tabs */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => {}}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        campaignData.channels.includes('email')
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Content
                    </button>
                    <button
                      onClick={() => {}}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        campaignData.channels.includes('whatsapp')
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      disabled={!campaignData.channels.includes('whatsapp')}
                    >
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      WhatsApp Content
                    </button>
                    <button
                      onClick={() => {}}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        campaignData.channels.includes('linkedin')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      disabled={!campaignData.channels.includes('linkedin')}
                    >
                      <Linkedin className="h-4 w-4 inline mr-2" />
                      LinkedIn Content
                    </button>
                  </nav>
                </div>

                {/* Email Content Tab */}
                {campaignData.channels.includes('email') && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label htmlFor="email-subject" className="text-sm font-medium text-gray-700">
                          Email Subject Line
                        </Label>
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
                          placeholder="Ensure 100% travel policy compliance at {{company_name}}"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email-body" className="text-sm font-medium text-gray-700">
                          Email Body
                        </Label>
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
                          placeholder="Hi {{contact_name}},

Managing travel compliance for {{employees}} employees can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.

Key compliance features for {{industry}} companies:
• Automated policy enforcement
• Real-time approval workflows
• Expense management integration
• Regulatory compliance reporting
• Instant policy violation alerts

{{company_name}} can achieve complete travel governance without slowing down your team."
                          rows={12}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none font-mono text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email-cta" className="text-sm font-medium text-gray-700">
                          Call-to-Action
                        </Label>
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
                          placeholder="See Compliance Demo"
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Available Personalization Variables */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Available personalization variables:
                  </Label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['{{company_name}}', '{{contact_name}}', '{{job_title}}', '{{industry}}', '{{employees}}', '{{travel_budget}}'].map(variable => (
                      <span 
                        key={variable}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                        onClick={() => insertPersonalizationVariable(variable)}
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Content Preview</CardTitle>
                    <CardDescription className="text-sm">See how your content will look to recipients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Preview for TechCorp Solutions */}
                    <div className="text-sm text-gray-600 mb-2">Preview for TechCorp Solutions</div>

                    {/* Email Preview */}
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="mb-2">
                        <span className="font-medium text-sm text-gray-700">Subject: </span>
                        <span className="text-sm">
                          {campaignData.content.email.subject?.replace('{{company_name}}', 'TechCorp Solutions') || 'Ensure 100% travel policy compliance at TechCorp Solutions'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Hi Sarah Johnson,</span>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
                        {campaignData.content.email.body?.replace('{{contact_name}}', 'Sarah Johnson')
                          .replace('{{employees}}', '2,500')
                          .replace('{{industry}}', 'Technology')
                          .replace('{{company_name}}', 'TechCorp Solutions') || 
                        `Managing travel compliance for 2,500 employees can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.

Key compliance features for Technology companies:
• Automated policy enforcement
• Real-time approval workflows
• Expense management integration
• Regulatory compliance reporting
• Instant policy violation alerts

TechCorp Solutions can achieve complete travel governance without slowing down your team.`}
                      </div>
                      {campaignData.content.email.cta && (
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          {campaignData.content.email.cta}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Campaign Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Campaign Summary</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Campaign Name:</span>
                      <span className="font-semibold text-gray-900">{campaignData.name || 'Nagu'}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Objective:</span>
                      <span className="font-semibold text-gray-900 capitalize">Lead Nurturing</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Channels:</span>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">email</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Target Leads:</span>
                      <span className="font-semibold text-gray-900">{targetLeads.length}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Start Date:</span>
                      <span className="font-semibold text-gray-900">2025-08-26</span>
                    </div>
                  </div>
                </div>

                {/* AI Predictions Section */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                      <div className="text-sm text-gray-500">Expected Opens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                      <div className="text-sm text-gray-500">Expected Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                      <div className="text-sm text-gray-500">Expected Responses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                      <div className="text-sm text-gray-500">Expected Conversions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Final Content Review */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Final Content Review</h3>

                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Email Campaign:</h4>

                  <div className="space-y-4">
                    {/* Subject Line */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Subject:</div>
                      <div className="bg-gray-50 p-3 rounded-md border text-sm font-medium">
                        Ensure 100% travel policy compliance at {'{{company_name}}'}
                      </div>
                    </div>

                    {/* Email Body Preview */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Message:</div>
                      <div className="bg-gray-50 p-4 rounded-md border text-sm leading-relaxed">
                        <div className="mb-3">Hi {'{{contact_name}}'}.</div>

                        <div className="mb-4">
                          Managing travel compliance for {'{{company_name}}'} employees can be challenging. SOAR-AI 
                          ensures 100% policy adherence while maintaining traveler satisfaction.
                        </div>

                        <div className="text-blue-600 underline text-sm">See Compliance Demo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex justify-center mt-12">
              <Button 
                onClick={handleLaunchCampaign}
                disabled={isLaunching || campaignLoading}
                className="bg-[#FD9646] hover:bg-[#FD9646]/90 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg w-full max-w-md"
                size="lg"
              >
                {(isLaunching || campaignLoading) ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Launching Campaign...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Launch Campaign
                  </>
                )}
              </Button>
            </div>
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

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Campaign</h1>
            <p className="text-gray-600">Create and launch targeted multi-channel marketing campaigns</p>
            <div className="flex items-center gap-4">      
          </div>           
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
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
              (currentStep === 3 && campaignData.channels.includes('email') && (!campaignData.content.email.subject || !campaignData.content.email.body))
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
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
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
                <Select value={templateData.channel_type} onValueChange={(value: 'email' | 'whatsapp' | 'linkedin' | 'mixed') => setTemplateData(prev => ({ ...prev, channel_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="mixed">Multi-Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target Industry */}
            <div className="space-y-2">
              <Label htmlFor="target-industry" className="text-sm font-medium text-gray-700">
                Target Industry
              </Label>
              <Select value={templateData.target_industry} onValueChange={(value) => setTemplateData(prev => ({ ...prev, target_industry: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
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
            {(templateData.channel_type === 'email' || templateData.channel_type === 'linkedin') && (
              <div className="space-y-2">
                <Label htmlFor="subject-line" className="text-sm font-medium text-gray-700">
                  {templateData.channel_type === 'email' ? 'Subject Line' : 'LinkedIn Subject/Connection Note'}
                </Label>
                <Input
                  id="subject-line"
                  value={templateData.subject_line}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, subject_line: e.target.value }))}
                  placeholder="Enter subject line or connection note"
                  className="w-full"
                />
              </div>
            )}

            {/* LinkedIn Type */}
            {templateData.channel_type === 'linkedin' && (
              <div className="space-y-2">
                <Label htmlFor="linkedin-type" className="text-sm font-medium text-gray-700">
                  LinkedIn Type
                </Label>
                <Select value={templateData.linkedin_type} onValueChange={(value: 'message' | 'post' | 'connection') => setTemplateData(prev => ({ ...prev, linkedin_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="message">Direct Message</SelectItem>
                    <SelectItem value="post">Post/Content</SelectItem>
                    <SelectItem value="connection">Connection Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

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
                {['{{company_name}}', '{{contact_name}}', '{{job_title}}', '{{industry}}', '{{employees}}', '{{travel_budget}}'].map(variable => (
                  <span 
                    key={variable}
                    className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => insertPersonalizationVariable(variable)}
                  >
                    {variable}
                  </span>
                ))}
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
              onClick={handleCreateTemplate}
              disabled={!templateData.name || !templateData.content || apiLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              {apiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}