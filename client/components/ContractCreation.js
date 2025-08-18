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
import { FileText, Plus, Copy, Eye, Download, Send, ArrowLeft, CheckCircle, Target, Signature, FileCheck, AlertCircle, Building2, Settings } from 'lucide-react';
const contractTemplates = [
    {
        id: 1,
        name: 'Master Service Agreement',
        category: 'Comprehensive',
        description: 'Full-service agreement covering all aspects of vendor relationship including services, terms, SLAs, and payment structures',
        duration: '12-36 months',
        complexity: 'High',
        clauses: ['Service Level Agreement', 'Payment Terms', 'Liability & Insurance', 'Termination Clauses', 'Performance Metrics'],
        estimatedTime: '2-3 weeks',
        recommendedFor: ['Long-term partnerships', 'High-value contracts', 'Complex service requirements']
    },
    {
        id: 2,
        name: 'Service Level Agreement',
        category: 'Performance',
        description: 'Focused on service quality metrics, KPIs, penalties, and performance standards with clear measurement criteria',
        duration: '6-24 months',
        complexity: 'Medium',
        clauses: ['Performance KPIs', 'Response Times', 'Quality Standards', 'Penalty Structures', 'Reporting Requirements'],
        estimatedTime: '1-2 weeks',
        recommendedFor: ['Service quality focus', 'Performance-based partnerships', 'Measurable deliverables']
    },
    {
        id: 3,
        name: 'Strategic Partnership Agreement',
        category: 'Strategic',
        description: 'Long-term strategic alliance with revenue sharing, joint marketing, and co-development opportunities',
        duration: '24-60 months',
        complexity: 'High',
        clauses: ['Revenue Sharing', 'Joint Marketing', 'Exclusivity Terms', 'IP Rights', 'Growth Incentives'],
        estimatedTime: '3-4 weeks',
        recommendedFor: ['Strategic alliances', 'Market expansion', 'Co-development projects']
    },
    {
        id: 4,
        name: 'Quick Start Agreement',
        category: 'Standard',
        description: 'Simplified contract for immediate deployment with standard terms and accelerated approval process',
        duration: '3-12 months',
        complexity: 'Low',
        clauses: ['Basic Service Terms', 'Standard Payment', 'Limited Liability', 'Standard Termination', 'Basic SLA'],
        estimatedTime: '3-5 days',
        recommendedFor: ['Urgent requirements', 'Pilot programs', 'Small-scale projects']
    },
    {
        id: 5,
        name: 'Volume-Based Agreement',
        category: 'Volume',
        description: 'Contract with tiered pricing based on volume commitments, with discounts and incentive structures',
        duration: '12-24 months',
        complexity: 'Medium',
        clauses: ['Volume Tiers', 'Discount Structures', 'Commitment Levels', 'Performance Bonuses', 'Volume Penalties'],
        estimatedTime: '1-2 weeks',
        recommendedFor: ['High-volume partnerships', 'Cost optimization', 'Bulk purchasing']
    }
];
export function ContractCreation({ vendorData, onNavigate, onBack }) {
    const [activeStep, setActiveStep] = useState('choose-method');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [contractData, setContractData] = useState({
        type: '',
        vendor: vendorData?.name || '',
        vendorEmail: vendorData?.email || '',
        client: '',
        value: '',
        startDate: '',
        endDate: '',
        terms: '',
        slaRequirements: '',
        paymentTerms: '30',
        autoRenewal: false,
        performanceBonus: false,
        exclusivity: false,
        customClauses: ''
    });
    const [emailSettings, setEmailSettings] = useState({
        subject: `Contract Proposal - ${vendorData?.name || 'Partnership Agreement'}`,
        body: `Dear ${vendorData?.name || 'Partner'} Team,

We are pleased to propose a partnership agreement based on our recent discussions and evaluation process.

Please find the contract proposal attached for your review. We believe this partnership will be mutually beneficial and look forward to working together.

Key highlights of this proposal:
• Service excellence commitment
• Competitive terms and pricing
• Clear performance metrics
• Streamlined communication channels

We would appreciate your feedback and are available to discuss any questions or modifications you may have.

Best regards,
SOAR-AI Contract Management Team`,
        ccRecipients: '',
        priority: 'normal'
    });
    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setContractData({
            ...contractData,
            type: template.name
        });
        setActiveStep('configure');
    };
    const handleCreateFromScratch = () => {
        setSelectedTemplate(null);
        setActiveStep('configure');
    };
    const handleGenerateContract = () => {
        console.log('Generating contract with data:', contractData);
        setActiveStep('review');
    };
    const handleSendContract = () => {
        console.log('Sending contract to vendor:', {
            vendor: vendorData,
            contract: contractData,
            email: emailSettings
        });
        alert('Contract sent successfully! The vendor will receive an email with the contract proposal and digital signature instructions.');
        if (onNavigate) {
            onNavigate('contracts', { status: 'Pending Signature' });
        }
    };
    const renderChooseMethod = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: "Choose Contract Creation Method" }), _jsxs("p", { className: "text-muted-foreground", children: ["Select how you'd like to create your contract with ", vendorData?.name] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(Card, { className: "cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center", children: _jsx(FileText, { className: "h-8 w-8 text-white" }) }), _jsx("h4", { className: "text-xl font-semibold mb-3", children: "Use Template" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Choose from pre-approved contract templates with industry best practices" }), _jsxs("div", { className: "space-y-2 text-sm text-left", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }), _jsx("span", { children: "Pre-approved legal terms" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }), _jsx("span", { children: "Faster approval process" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }), _jsx("span", { children: "Reduced legal review time" })] })] }), _jsx(Button, { className: "w-full mt-6", onClick: () => setActiveStep('templates'), children: "Browse Templates" })] }) }), _jsx(Card, { className: "cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center", children: _jsx(Plus, { className: "h-8 w-8 text-white" }) }), _jsx("h4", { className: "text-xl font-semibold mb-3", children: "Create from Scratch" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Build a custom contract tailored to your specific requirements" }), _jsxs("div", { className: "space-y-2 text-sm text-left", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }), _jsx("span", { children: "Complete customization" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }), _jsx("span", { children: "Unique terms and conditions" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-yellow-500" }), _jsx("span", { children: "Extended legal review required" })] })] }), _jsx(Button, { variant: "outline", className: "w-full mt-6", onClick: handleCreateFromScratch, children: "Start Custom Contract" })] }) })] })] }));
    const renderTemplateSelection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold", children: "Choose Contract Template" }), _jsx("p", { className: "text-muted-foreground", children: "Select the template that best fits your partnership needs" })] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveStep('choose-method'), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back"] })] }), _jsx("div", { className: "grid gap-6", children: contractTemplates.map((template) => (_jsx(Card, { className: `cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedTemplate?.id === template.id ? 'ring-2 ring-primary border-primary' : ''}`, onClick: () => handleTemplateSelect(template), children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h4", { className: "text-lg font-semibold", children: template.name }), _jsx(Badge, { variant: "outline", children: template.category }), _jsx(Badge, { variant: template.complexity === 'High' ? 'destructive' : template.complexity === 'Medium' ? 'secondary' : 'default', children: template.complexity })] }), _jsx("p", { className: "text-muted-foreground mb-4", children: template.description }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "DURATION" }), _jsx("p", { className: "font-medium", children: template.duration })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "ESTIMATED TIME" }), _jsx("p", { className: "font-medium", children: template.estimatedTime })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "COMPLEXITY" }), _jsx("p", { className: "font-medium", children: template.complexity })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "KEY CLAUSES" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: template.clauses.map((clause, index) => (_jsx(Badge, { variant: "secondary", className: "text-xs", children: clause }, index))) })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "RECOMMENDED FOR" }), _jsx("ul", { className: "mt-1 space-y-1", children: template.recommendedFor.map((item, index) => (_jsxs("li", { className: "text-sm flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-3 w-3 text-green-500 flex-shrink-0" }), item] }, index))) })] })] }), _jsxs("div", { className: "flex gap-2 ml-4", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "Preview"] }), _jsx(Button, { size: "sm", onClick: () => handleTemplateSelect(template), children: "Use Template" })] })] }) }) }, template.id))) })] }));
    const renderConfiguration = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold", children: "Configure Contract Details" }), _jsx("p", { className: "text-muted-foreground", children: selectedTemplate ? `Customizing: ${selectedTemplate.name}` : 'Creating custom contract' })] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveStep(selectedTemplate ? 'templates' : 'choose-method'), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back"] })] }), _jsxs(Tabs, { defaultValue: "basic", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "basic", children: "Basic Info" }), _jsx(TabsTrigger, { value: "terms", children: "Terms & SLA" }), _jsx(TabsTrigger, { value: "payment", children: "Payment" }), _jsx(TabsTrigger, { value: "advanced", children: "Advanced" })] }), _jsx(TabsContent, { value: "basic", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Contract Parties & Basic Information" }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "vendor", children: "Vendor" }), _jsx(Input, { id: "vendor", value: contractData.vendor, onChange: (e) => setContractData({ ...contractData, vendor: e.target.value }), placeholder: "Vendor company name", disabled: !!vendorData })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "vendorEmail", children: "Vendor Email" }), _jsx(Input, { id: "vendorEmail", type: "email", value: contractData.vendorEmail, onChange: (e) => setContractData({ ...contractData, vendorEmail: e.target.value }), placeholder: "vendor@company.com" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "client", children: "Client Department" }), _jsxs(Select, { value: contractData.client, onValueChange: (value) => setContractData({ ...contractData, client: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select client department" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "airline-operations", children: "Airline Operations" }), _jsx(SelectItem, { value: "business-travel", children: "Business Travel Department" }), _jsx(SelectItem, { value: "executive-services", children: "Executive Services" }), _jsx(SelectItem, { value: "regional-operations", children: "Regional Operations" }), _jsx(SelectItem, { value: "procurement", children: "Procurement" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "value", children: "Contract Value ($)" }), _jsx(Input, { id: "value", type: "number", value: contractData.value, onChange: (e) => setContractData({ ...contractData, value: e.target.value }), placeholder: "0" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Start Date" }), _jsx(Input, { id: "startDate", type: "date", value: contractData.startDate, onChange: (e) => setContractData({ ...contractData, startDate: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endDate", children: "End Date" }), _jsx(Input, { id: "endDate", type: "date", value: contractData.endDate, onChange: (e) => setContractData({ ...contractData, endDate: e.target.value }) })] })] }) })] }) }), _jsx(TabsContent, { value: "terms", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Service Level Agreement & Terms" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "slaRequirements", children: "SLA Requirements" }), _jsx(Textarea, { id: "slaRequirements", value: contractData.slaRequirements, onChange: (e) => setContractData({ ...contractData, slaRequirements: e.target.value }), placeholder: "Define response times, uptime requirements, quality standards...", rows: 4 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "terms", children: "General Terms & Conditions" }), _jsx(Textarea, { id: "terms", value: contractData.terms, onChange: (e) => setContractData({ ...contractData, terms: e.target.value }), placeholder: "Enter specific terms, conditions, and requirements...", rows: 6 })] })] })] }) }), _jsx(TabsContent, { value: "payment", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Payment Terms & Structure" }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { children: [_jsx(Label, { htmlFor: "paymentTerms", children: "Payment Terms (Days)" }), _jsxs(Select, { value: contractData.paymentTerms, onValueChange: (value) => setContractData({ ...contractData, paymentTerms: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "15", children: "Net 15 Days" }), _jsx(SelectItem, { value: "30", children: "Net 30 Days" }), _jsx(SelectItem, { value: "45", children: "Net 45 Days" }), _jsx(SelectItem, { value: "60", children: "Net 60 Days" })] })] })] }) })] }) }), _jsx(TabsContent, { value: "advanced", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Advanced Options" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "autoRenewal", checked: contractData.autoRenewal, onCheckedChange: (checked) => setContractData({ ...contractData, autoRenewal: !!checked }) }), _jsx(Label, { htmlFor: "autoRenewal", children: "Enable Auto-Renewal" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "performanceBonus", checked: contractData.performanceBonus, onCheckedChange: (checked) => setContractData({ ...contractData, performanceBonus: !!checked }) }), _jsx(Label, { htmlFor: "performanceBonus", children: "Include Performance Bonus Clauses" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "exclusivity", checked: contractData.exclusivity, onCheckedChange: (checked) => setContractData({ ...contractData, exclusivity: !!checked }) }), _jsx(Label, { htmlFor: "exclusivity", children: "Exclusivity Agreement" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "customClauses", children: "Custom Clauses" }), _jsx(Textarea, { id: "customClauses", value: contractData.customClauses, onChange: (e) => setContractData({ ...contractData, customClauses: e.target.value }), placeholder: "Add any custom clauses or special requirements...", rows: 4 })] })] })] }) })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", children: "Save as Draft" }), _jsxs(Button, { onClick: handleGenerateContract, children: [_jsx(FileCheck, { className: "h-4 w-4 mr-2" }), "Generate Contract"] })] })] }));
    const renderReview = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold", children: "Review & Send Contract" }), _jsx("p", { className: "text-muted-foreground", children: "Review contract details and send to vendor" })] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveStep('configure'), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Edit"] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Contract Preview" }), _jsx(CardDescription, { children: "Generated contract ready for review" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "space-y-4 p-6 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "text-center border-b pb-4", children: [_jsx("h2", { className: "text-xl font-bold", children: selectedTemplate?.name || 'Custom Contract Agreement' }), _jsxs("p", { className: "text-muted-foreground", children: ["Between SOAR-AI Airlines and ", contractData.vendor] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Vendor:" }), " ", contractData.vendor] }), _jsxs("div", { children: [_jsx("strong", { children: "Client:" }), " ", contractData.client] }), _jsxs("div", { children: [_jsx("strong", { children: "Contract Value:" }), " $", parseInt(contractData.value || '0').toLocaleString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Duration:" }), " ", contractData.startDate, " to ", contractData.endDate] }), _jsxs("div", { children: [_jsx("strong", { children: "Payment Terms:" }), " Net ", contractData.paymentTerms, " Days"] }), _jsxs("div", { children: [_jsx("strong", { children: "Auto-Renewal:" }), " ", contractData.autoRenewal ? 'Yes' : 'No'] })] }), contractData.slaRequirements && (_jsxs("div", { className: "mt-4", children: [_jsx("strong", { className: "block mb-2", children: "SLA Requirements:" }), _jsx("p", { className: "text-sm bg-white p-3 rounded border", children: contractData.slaRequirements })] })), contractData.terms && (_jsxs("div", { className: "mt-4", children: [_jsx("strong", { className: "block mb-2", children: "Terms & Conditions:" }), _jsx("p", { className: "text-sm bg-white p-3 rounded border", children: contractData.terms })] }))] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Download PDF"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Full Preview"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Copy, { className: "h-4 w-4 mr-2" }), "Copy Link"] })] })] })] }) }), _jsx("div", { children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Send to Vendor" }), _jsx(CardDescription, { children: "Configure email settings" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "emailSubject", children: "Email Subject" }), _jsx(Input, { id: "emailSubject", value: emailSettings.subject, onChange: (e) => setEmailSettings({ ...emailSettings, subject: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "emailBody", children: "Email Body" }), _jsx(Textarea, { id: "emailBody", value: emailSettings.body, onChange: (e) => setEmailSettings({ ...emailSettings, body: e.target.value }), rows: 8 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "ccRecipients", children: "CC Recipients (Optional)" }), _jsx(Input, { id: "ccRecipients", value: emailSettings.ccRecipients, onChange: (e) => setEmailSettings({ ...emailSettings, ccRecipients: e.target.value }), placeholder: "additional@email.com" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Priority" }), _jsxs(Select, { value: emailSettings.priority, onValueChange: (value) => setEmailSettings({ ...emailSettings, priority: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Low" }), _jsx(SelectItem, { value: "normal", children: "Normal" }), _jsx(SelectItem, { value: "high", children: "High" })] })] })] }), _jsxs(Alert, { children: [_jsx(Signature, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "The vendor will receive signing instructions and can digitally sign the contract online." })] }), _jsxs(Button, { className: "w-full", onClick: handleSendContract, children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), "Send Contract for Signature"] })] })] }) })] })] }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [onBack && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: onBack, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Vendor Search"] })), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Contract Creation" }), vendorData && (_jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Building2, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { className: "text-muted-foreground", children: "Creating contract with" }), _jsx(Badge, { variant: "outline", children: vendorData.name })] }))] })] }) }), _jsx("div", { className: "flex items-center justify-center mb-8", children: _jsx("div", { className: "flex items-center gap-2", children: [
                        { id: 'choose-method', label: 'Method', icon: Target },
                        { id: 'templates', label: 'Template', icon: FileText },
                        { id: 'configure', label: 'Configure', icon: Settings },
                        { id: 'review', label: 'Review', icon: CheckCircle }
                    ].map((step, index, array) => {
                        const isActive = activeStep === step.id;
                        const isCompleted = ['choose-method', 'templates', 'configure'].indexOf(activeStep) > ['choose-method', 'templates', 'configure'].indexOf(step.id);
                        const StepIcon = step.icon;
                        return (_jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' :
                                        isCompleted ? 'bg-green-100 text-green-700' :
                                            'bg-muted text-muted-foreground'}`, children: [_jsx(StepIcon, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm font-medium", children: step.label })] }), index < array.length - 1 && (_jsx("div", { className: "w-8 h-px bg-border mx-2" }))] }, step.id));
                    }) }) }), activeStep === 'choose-method' && renderChooseMethod(), activeStep === 'templates' && renderTemplateSelection(), activeStep === 'configure' && renderConfiguration(), activeStep === 'review' && renderReview()] }));
}
