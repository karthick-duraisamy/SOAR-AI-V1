import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Mail, Send, Eye, Settings, Users, Target, Zap, Building2, Repeat } from 'lucide-react';
const emailTemplates = [
    {
        id: 1,
        name: 'Partnership Invitation',
        category: 'Business Development',
        subject: 'Exclusive Partnership Opportunity - [AIRLINE_NAME] & [CORPORATE_NAME]',
        body: `Dear [CORPORATE_NAME] Travel Team,

I hope this message finds you well.

We at [AIRLINE_NAME] have been impressed by [CORPORATE_NAME]'s commitment to excellence and global reach. Given your substantial travel requirements ([TRAVEL_VOLUME] annually), we would like to explore a strategic partnership that could deliver significant value to your organization.

What we can offer:
• Preferential rates for business travel
• Dedicated account management
• Priority booking and flexible change policies
• Corporate sustainability reporting
• Seamless integration with your expense management systems

We believe a partnership between our organizations could result in substantial cost savings while enhancing your travel experience.

Would you be available for a brief call next week to discuss this opportunity?

Best regards,
[SENDER_NAME]
Corporate Partnerships Team
[AIRLINE_NAME]`,
        variables: ['AIRLINE_NAME', 'CORPORATE_NAME', 'TRAVEL_VOLUME', 'SENDER_NAME'],
        frequency: 'One-time',
        priority: 'High'
    },
    {
        id: 2,
        name: 'Quarterly Travel Report',
        category: 'Relationship Management',
        subject: 'Q[QUARTER] Travel Performance Report - [CORPORATE_NAME]',
        body: `Dear [CORPORATE_NAME] Team,

We're pleased to share your quarterly travel performance report and insights.

Travel Summary for Q[QUARTER]:
• Total flights: [FLIGHT_COUNT]
• Total savings: $[SAVINGS_AMOUNT]
• On-time performance: [ON_TIME_RATE]%
• Carbon offset: [CARBON_OFFSET] kg CO2

Key Highlights:
• [HIGHLIGHT_1]
• [HIGHLIGHT_2]
• [HIGHLIGHT_3]

Upcoming Opportunities:
We've identified several opportunities to further optimize your travel program in the next quarter.

Let's schedule a review meeting to discuss these insights and plan for the upcoming quarter.

Best regards,
[ACCOUNT_MANAGER]
Account Management Team
[AIRLINE_NAME]`,
        variables: ['QUARTER', 'CORPORATE_NAME', 'FLIGHT_COUNT', 'SAVINGS_AMOUNT', 'ON_TIME_RATE', 'CARBON_OFFSET', 'HIGHLIGHT_1', 'HIGHLIGHT_2', 'HIGHLIGHT_3', 'ACCOUNT_MANAGER', 'AIRLINE_NAME'],
        frequency: 'Quarterly',
        priority: 'Medium'
    },
    {
        id: 3,
        name: 'New Route Announcement',
        category: 'Product Updates',
        subject: 'New Route Alert: [ROUTE] - Perfect for [CORPORATE_NAME]',
        body: `Dear [CORPORATE_NAME] Travel Team,

Great news! We're excited to announce a new route that aligns perfectly with your travel patterns.

New Route Details:
• Route: [ROUTE]
• Launch Date: [LAUNCH_DATE]
• Frequency: [FREQUENCY] flights per week
• Aircraft: [AIRCRAFT_TYPE]

Based on your travel data, this route could benefit approximately [AFFECTED_TRAVELERS] of your travelers and potentially save $[ESTIMATED_SAVINGS] annually.

Special Launch Offer:
For the first 30 days, we're offering a 15% discount on this route for all [CORPORATE_NAME] bookings.

To take advantage of this offer or to discuss how this route fits into your travel strategy, please contact your dedicated account manager.

Best regards,
[ROUTE_MANAGER]
Network Planning Team
[AIRLINE_NAME]`,
        variables: ['ROUTE', 'CORPORATE_NAME', 'LAUNCH_DATE', 'FREQUENCY', 'AIRCRAFT_TYPE', 'AFFECTED_TRAVELERS', 'ESTIMATED_SAVINGS', 'ROUTE_MANAGER', 'AIRLINE_NAME'],
        frequency: 'As needed',
        priority: 'Medium'
    },
    {
        id: 4,
        name: 'Contract Renewal Reminder',
        category: 'Contract Management',
        subject: 'Contract Renewal - 90 Days Notice | [CORPORATE_NAME]',
        body: `Dear [CORPORATE_NAME] Team,

This is a friendly reminder that your corporate travel agreement is approaching its renewal date.

Contract Details:
• Agreement ID: [CONTRACT_ID]
• Current Term: [CURRENT_TERM]
• Renewal Date: [RENEWAL_DATE]
• Notice Period: 90 days (as per agreement)

Your Partnership Success:
Over the past year, our partnership has delivered:
• Total flights: [TOTAL_FLIGHTS]
• Cost savings: $[TOTAL_SAVINGS]
• Average on-time performance: [PERFORMANCE]%
• Traveler satisfaction: [SATISFACTION]/5

We value our partnership and would like to discuss renewal options that continue to deliver value to [CORPORATE_NAME].

Available for the new term:
• Enhanced service levels
• Improved pricing structure
• New technology integrations
• Expanded route network benefits

Let's schedule a renewal discussion meeting within the next 30 days.

Best regards,
[CONTRACT_MANAGER]
Contract Management Team
[AIRLINE_NAME]`,
        variables: ['CORPORATE_NAME', 'CONTRACT_ID', 'CURRENT_TERM', 'RENEWAL_DATE', 'TOTAL_FLIGHTS', 'TOTAL_SAVINGS', 'PERFORMANCE', 'SATISFACTION', 'CONTRACT_MANAGER', 'AIRLINE_NAME'],
        frequency: 'Annually',
        priority: 'High'
    },
    {
        id: 5,
        name: 'Travel Advisory Alert',
        category: 'Service Updates',
        subject: 'Travel Advisory: [DESTINATION] - [CORPORATE_NAME] Travelers',
        body: `Dear [CORPORATE_NAME] Travel Team,

We want to ensure your travelers are informed about current conditions affecting travel to [DESTINATION].

Advisory Details:
• Affected Destination: [DESTINATION]
• Type: [ADVISORY_TYPE]
• Effective: [EFFECTIVE_DATE]
• Duration: [DURATION]

Impact on Your Travel:
• Affected routes: [AFFECTED_ROUTES]
• Recommended actions: [RECOMMENDATIONS]
• Alternative options: [ALTERNATIVES]

We're monitoring the situation closely and will update you as conditions change. Our customer service team is available 24/7 for any rebooking assistance.

Current [CORPORATE_NAME] bookings affected: [AFFECTED_BOOKINGS]

For immediate assistance, your travelers can contact our dedicated corporate hotline or reach out to their account manager.

Stay safe and travel smart.

Best regards,
[OPERATIONS_MANAGER]
Operations Team
[AIRLINE_NAME]`,
        variables: ['CORPORATE_NAME', 'DESTINATION', 'ADVISORY_TYPE', 'EFFECTIVE_DATE', 'DURATION', 'AFFECTED_ROUTES', 'RECOMMENDATIONS', 'ALTERNATIVES', 'AFFECTED_BOOKINGS', 'OPERATIONS_MANAGER', 'AIRLINE_NAME'],
        frequency: 'As needed',
        priority: 'Urgent'
    }
];
export function NotificationSystem({ corporateData, onBack }) {
    const [activeStep, setActiveStep] = useState('select-template');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [emailData, setEmailData] = useState({
        to: corporateData?.email || '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        priority: 'medium'
    });
    const [autoSettings, setAutoSettings] = useState({
        enabled: false,
        frequency: 'monthly',
        startDate: '',
        conditions: [],
        recipients: [corporateData?.email || '']
    });
    const [variables, setVariables] = useState({});
    // Helper function to safely replace template variables
    const replaceTemplateVariables = (text, variableMap) => {
        if (!text || typeof text !== 'string')
            return text;
        let result = text;
        Object.entries(variableMap).forEach(([key, value]) => {
            const placeholder = `[${key}]`;
            result = result.split(placeholder).join(String(value || ''));
        });
        return result;
    };
    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        // Create default variable values based on corporate data
        const defaultVariables = {};
        // Set default values for all possible variables
        const variableDefaults = {
            AIRLINE_NAME: 'SOAR Airlines',
            CORPORATE_NAME: corporateData?.name || 'Corporate Client',
            TRAVEL_VOLUME: corporateData?.annualTravelVolume || '5,000 trips',
            SENDER_NAME: '[Your Name]',
            QUARTER: 'Q1',
            FLIGHT_COUNT: '450',
            SAVINGS_AMOUNT: '125,000',
            ON_TIME_RATE: '94',
            CARBON_OFFSET: '2,450',
            HIGHLIGHT_1: 'Achieved 94% on-time performance',
            HIGHLIGHT_2: 'Reduced average booking time by 25%',
            HIGHLIGHT_3: 'Carbon footprint reduced by 15%',
            ACCOUNT_MANAGER: '[Account Manager Name]',
            ROUTE: 'New York to London',
            LAUNCH_DATE: '2024-09-01',
            FREQUENCY: '7',
            AIRCRAFT_TYPE: 'Boeing 787-9',
            AFFECTED_TRAVELERS: '150',
            ESTIMATED_SAVINGS: '75,000',
            ROUTE_MANAGER: '[Route Manager Name]',
            CONTRACT_ID: `CTR-${corporateData?.id || '001'}`,
            CURRENT_TERM: '24 months',
            RENEWAL_DATE: '2024-12-31',
            TOTAL_FLIGHTS: '1,200',
            TOTAL_SAVINGS: '350,000',
            PERFORMANCE: '96',
            SATISFACTION: '4.5',
            CONTRACT_MANAGER: '[Contract Manager Name]',
            DESTINATION: 'Europe',
            ADVISORY_TYPE: 'Weather Advisory',
            EFFECTIVE_DATE: '2024-07-15',
            DURATION: '48 hours',
            AFFECTED_ROUTES: 'All European destinations',
            RECOMMENDATIONS: 'Allow extra travel time',
            ALTERNATIVES: 'Alternative routing via Frankfurt',
            AFFECTED_BOOKINGS: '12',
            OPERATIONS_MANAGER: '[Operations Manager Name]'
        };
        // Only include variables that are used in the selected template
        template.variables.forEach(variable => {
            defaultVariables[variable] = variableDefaults[variable] || `[${variable}]`;
        });
        setVariables(defaultVariables);
        // Populate email with template data
        const populatedSubject = replaceTemplateVariables(template.subject, defaultVariables);
        const populatedBody = replaceTemplateVariables(template.body, defaultVariables);
        setEmailData({
            ...emailData,
            subject: populatedSubject,
            body: populatedBody,
            priority: template.priority.toLowerCase()
        });
        setActiveStep('configure');
    };
    const handleVariableChange = (key, value) => {
        const updatedVariables = { ...variables, [key]: value };
        setVariables(updatedVariables);
        // Update email with new variables
        if (selectedTemplate) {
            const populatedSubject = replaceTemplateVariables(selectedTemplate.subject, updatedVariables);
            const populatedBody = replaceTemplateVariables(selectedTemplate.body, updatedVariables);
            setEmailData({
                ...emailData,
                subject: populatedSubject,
                body: populatedBody
            });
        }
    };
    const handleSendEmail = () => {
        console.log('Sending email:', emailData);
        console.log('Auto settings:', autoSettings);
        alert('Email sent successfully! ' + (autoSettings.enabled ? 'Auto-notifications have been configured.' : ''));
        onBack();
    };
    const renderTemplateSelection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: "Choose Email Template" }), _jsxs("p", { className: "text-muted-foreground", children: ["Select a template for communicating with ", corporateData?.name] })] }), _jsx("div", { className: "grid gap-6", children: emailTemplates.map((template) => (_jsx(Card, { className: `cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedTemplate?.id === template.id ? 'ring-2 ring-primary border-primary' : ''}`, onClick: () => handleTemplateSelect(template), children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h4", { className: "text-lg font-semibold", children: template.name }), _jsx(Badge, { variant: "outline", children: template.category }), _jsx(Badge, { variant: template.priority === 'High' ? 'destructive' : template.priority === 'Urgent' ? 'destructive' : 'default', children: template.priority })] }), _jsxs("p", { className: "text-sm text-muted-foreground mb-3", children: [_jsx("strong", { children: "Subject:" }), " ", template.subject.replace(/\[[^\]]+\]/g, '[Dynamic]')] }), _jsxs("p", { className: "text-sm text-muted-foreground line-clamp-3", children: [template.body.substring(0, 200), "..."] }), _jsxs("div", { className: "flex items-center gap-4 mt-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Repeat, { className: "h-3 w-3 text-muted-foreground" }), _jsx("span", { className: "text-xs text-muted-foreground", children: template.frequency })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Target, { className: "h-3 w-3 text-muted-foreground" }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [template.variables.length, " variables"] })] })] })] }), _jsxs("div", { className: "flex gap-2 ml-4", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "Preview"] }), _jsx(Button, { size: "sm", onClick: () => handleTemplateSelect(template), children: "Use Template" })] })] }) }) }, template.id))) })] }));
    const renderConfiguration = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold", children: "Configure Email & Notifications" }), _jsxs("p", { className: "text-muted-foreground", children: ["Template: ", selectedTemplate?.name] })] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveStep('select-template'), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Templates"] })] }), _jsxs(Tabs, { defaultValue: "email-content", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "email-content", children: "Email Content" }), _jsx(TabsTrigger, { value: "variables", children: "Variables" }), _jsx(TabsTrigger, { value: "recipients", children: "Recipients" }), _jsx(TabsTrigger, { value: "automation", children: "Automation" })] }), _jsx(TabsContent, { value: "email-content", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Email Details" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "to", children: "To" }), _jsx(Input, { id: "to", value: emailData.to, onChange: (e) => setEmailData({ ...emailData, to: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "priority", children: "Priority" }), _jsxs(Select, { value: emailData.priority, onValueChange: (value) => setEmailData({ ...emailData, priority: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Low" }), _jsx(SelectItem, { value: "medium", children: "Medium" }), _jsx(SelectItem, { value: "high", children: "High" }), _jsx(SelectItem, { value: "urgent", children: "Urgent" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "cc", children: "CC (Optional)" }), _jsx(Input, { id: "cc", value: emailData.cc, onChange: (e) => setEmailData({ ...emailData, cc: e.target.value }), placeholder: "additional@email.com" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "bcc", children: "BCC (Optional)" }), _jsx(Input, { id: "bcc", value: emailData.bcc, onChange: (e) => setEmailData({ ...emailData, bcc: e.target.value }), placeholder: "manager@airline.com" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "subject", children: "Subject" }), _jsx(Input, { id: "subject", value: emailData.subject, onChange: (e) => setEmailData({ ...emailData, subject: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "body", children: "Message Body" }), _jsx(Textarea, { id: "body", value: emailData.body, onChange: (e) => setEmailData({ ...emailData, body: e.target.value }), rows: 15 })] })] })] }) }), _jsx(TabsContent, { value: "variables", className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Template Variables" }), _jsx(CardDescription, { children: "Customize the dynamic content in your email template" })] }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: selectedTemplate?.variables.map((variable) => (_jsxs("div", { children: [_jsx(Label, { htmlFor: variable, children: variable.replace(/_/g, ' ') }), _jsx(Input, { id: variable, value: variables[variable] || '', onChange: (e) => handleVariableChange(variable, e.target.value), placeholder: `Enter ${variable.replace(/_/g, ' ').toLowerCase()}` })] }, variable))) }) })] }) }), _jsx(TabsContent, { value: "recipients", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Recipient Management" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx(Building2, { className: "h-5 w-5 text-blue-500" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: corporateData?.name }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Primary Contact" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Email" }), _jsx("p", { className: "font-medium", children: corporateData?.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Travel Managers" }), _jsxs("p", { className: "font-medium", children: [corporateData?.travelManagers, " contacts"] })] })] })] }), _jsxs(Alert, { children: [_jsx(Users, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "Additional recipients can be added in the CC/BCC fields in the Email Content tab." })] })] })] }) }), _jsx(TabsContent, { value: "automation", className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Auto-Notification Settings" }), _jsx(CardDescription, { children: "Set up automated email notifications for this corporate client" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "autoEnabled", checked: autoSettings.enabled, onCheckedChange: (checked) => setAutoSettings({ ...autoSettings, enabled: !!checked }) }), _jsx(Label, { htmlFor: "autoEnabled", children: "Enable automatic notifications" })] }), autoSettings.enabled && (_jsxs("div", { className: "space-y-4 pl-6 border-l-2 border-blue-200", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "frequency", children: "Frequency" }), _jsxs(Select, { value: autoSettings.frequency, onValueChange: (value) => setAutoSettings({ ...autoSettings, frequency: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "weekly", children: "Weekly" }), _jsx(SelectItem, { value: "monthly", children: "Monthly" }), _jsx(SelectItem, { value: "quarterly", children: "Quarterly" }), _jsx(SelectItem, { value: "annually", children: "Annually" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Start Date" }), _jsx(Input, { id: "startDate", type: "date", value: autoSettings.startDate, onChange: (e) => setAutoSettings({ ...autoSettings, startDate: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-base font-medium", children: "Trigger Conditions" }), _jsxs("div", { className: "mt-2 space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "condition1" }), _jsx(Label, { htmlFor: "condition1", className: "text-sm", children: "Contract renewal approaching (90 days)" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "condition2" }), _jsx(Label, { htmlFor: "condition2", className: "text-sm", children: "New route matching travel patterns" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "condition3" }), _jsx(Label, { htmlFor: "condition3", className: "text-sm", children: "Monthly performance report" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "condition4" }), _jsx(Label, { htmlFor: "condition4", className: "text-sm", children: "Travel advisory alerts" })] })] })] }), _jsxs(Alert, { children: [_jsx(Zap, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "Automated notifications will be sent based on the selected frequency and conditions. You can modify or disable them at any time." })] })] }))] })] }) })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", children: "Save Draft" }), _jsxs(Button, { variant: "outline", children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Preview Email"] }), _jsxs(Button, { onClick: handleSendEmail, children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), "Send Email"] })] })] }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: onBack, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Corporate Search"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Notification System" }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Building2, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { className: "text-muted-foreground", children: "Managing notifications for" }), _jsx(Badge, { variant: "outline", children: corporateData?.name })] })] })] }) }), _jsx("div", { className: "flex items-center justify-center mb-8", children: _jsx("div", { className: "flex items-center gap-2", children: [
                        { id: 'select-template', label: 'Template', icon: Mail },
                        { id: 'configure', label: 'Configure', icon: Settings },
                        { id: 'send', label: 'Send', icon: Send }
                    ].map((step, index, array) => {
                        const isActive = activeStep === step.id;
                        const isCompleted = ['select-template'].indexOf(activeStep) > ['select-template'].indexOf(step.id);
                        const StepIcon = step.icon;
                        return (_jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' :
                                        isCompleted ? 'bg-green-100 text-green-700' :
                                            'bg-muted text-muted-foreground'}`, children: [_jsx(StepIcon, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm font-medium", children: step.label })] }), index < array.length - 1 && (_jsx("div", { className: "w-8 h-px bg-border mx-2" }))] }, step.id));
                    }) }) }), activeStep === 'select-template' && renderTemplateSelection(), activeStep === 'configure' && renderConfiguration()] }));
}
