import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Gift, Sparkles, Target, DollarSign, Calendar, Send, Eye, Settings, Brain, CheckCircle, Building2, Mail, Plus, ArrowRight } from 'lucide-react';
const aiSuggestedOffers = [
    {
        id: 1,
        title: 'Volume Discount Partnership',
        category: 'Volume-Based',
        confidence: 95,
        description: 'Tiered discount structure based on annual booking volume, perfect for high-volume corporates',
        benefits: [
            '15% discount on bookings over $1M annually',
            '20% discount on bookings over $2M annually',
            'Free seat upgrades for frequent travelers',
            'Priority booking and changes',
            'Dedicated account manager'
        ],
        estimatedSavings: '$375,000',
        validityPeriod: '12 months',
        targetAudience: 'High-volume corporate clients',
        aiReasoning: [
            'Corporate has $2.5M annual travel budget',
            '5,000+ trips annually indicates high volume',
            'Current business class preference shows premium willingness',
            'Strong financial stability (98%) ensures commitment'
        ],
        terms: {
            minimumSpend: '$1,000,000',
            validRoutes: 'All international routes',
            bookingWindow: '24/7 corporate booking portal',
            changePolicy: 'Flexible changes up to 24 hours',
            paymentTerms: 'Net 30 days'
        },
        matchScore: 95
    },
    {
        id: 2,
        title: 'Sustainability Partnership',
        category: 'Green Travel',
        confidence: 88,
        description: 'Carbon-neutral travel program with offset credits and sustainable aviation fuel options',
        benefits: [
            '100% carbon offset for all flights',
            'Sustainable Aviation Fuel (SAF) option',
            'Monthly sustainability reports',
            'Green travel rewards program',
            'Priority access to new eco-friendly aircraft'
        ],
        estimatedSavings: '$125,000',
        validityPeriod: '24 months',
        targetAudience: 'Sustainability-focused organizations',
        aiReasoning: [
            'Corporate has "High" sustainability focus',
            'Technology company likely has ESG commitments',
            'Carbon tracking in their technology requirements',
            'Premium positioning aligns with sustainability values'
        ],
        terms: {
            carbonOffset: 'Included in all bookings',
            safSurcharge: '5% premium for SAF flights',
            reporting: 'Monthly detailed carbon reporting',
            certification: 'Third-party verified offsets',
            renewableEnergy: 'Ground operations powered by renewables'
        },
        matchScore: 88
    },
    {
        id: 3,
        title: 'Technology Integration Offer',
        category: 'Digital Solutions',
        confidence: 92,
        description: 'Seamless API integration with corporate systems and advanced travel management tools',
        benefits: [
            'Free API integration and setup',
            'Real-time booking and management',
            'Automated expense reporting',
            'Mobile app with corporate branding',
            'Advanced analytics dashboard'
        ],
        estimatedSavings: '$85,000',
        validityPeriod: '18 months',
        targetAudience: 'Technology-forward companies',
        aiReasoning: [
            'Corporate requires API integration capabilities',
            'Mobile app and real-time booking preferences',
            'Large team (2,500 employees) needs automation',
            'Technology company values digital solutions'
        ],
        terms: {
            integrationCost: 'Waived (normally $25,000)',
            maintenanceFee: 'Included for first 18 months',
            apiLimits: 'Unlimited API calls',
            supportLevel: '24/7 technical support',
            customization: 'Full white-label mobile app'
        },
        matchScore: 92
    },
    {
        id: 4,
        title: 'Executive Travel Program',
        category: 'Premium Services',
        confidence: 85,
        description: 'VIP treatment for C-level executives with first-class upgrades and concierge services',
        benefits: [
            'Automatic first-class upgrades for C-level',
            'Airport lounge access for all travelers',
            'Priority boarding and baggage',
            'Concierge travel planning service',
            'Emergency travel support 24/7'
        ],
        estimatedSavings: '$95,000',
        validityPeriod: '12 months',
        targetAudience: 'Large enterprises with executive travel',
        aiReasoning: [
            'Large enterprise (2,500 employees) has executive team',
            'Current business class preference shows premium orientation',
            'High travel frequency suggests executive travel needs',
            'Strong financial position supports premium services'
        ],
        terms: {
            eligibleTravelers: 'C-level and VP-level executives',
            upgradePolicy: 'Subject to availability',
            loungeAccess: 'Global partner lounges included',
            conciergeHours: '24/7 availability',
            emergencySupport: 'Dedicated hotline'
        },
        matchScore: 85
    },
    {
        id: 5,
        title: 'Flexible Booking Solution',
        category: 'Operational Efficiency',
        confidence: 90,
        description: 'Maximum flexibility for changing business needs with minimal change fees',
        benefits: [
            'Zero change fees on all bookings',
            'Free cancellation up to 2 hours before',
            'Flexible date and route changes',
            'Group booking management tools',
            'Automated rebooking for disruptions'
        ],
        estimatedSavings: '$150,000',
        validityPeriod: '12 months',
        targetAudience: 'Companies with unpredictable travel schedules',
        aiReasoning: [
            'Weekly travel frequency suggests dynamic needs',
            'Technology sector often has changing project requirements',
            'Large team size requires flexible booking management',
            'Current airlines likely charging high change fees'
        ],
        terms: {
            changeFees: 'Waived completely',
            cancellationFees: 'Free up to 2 hours before departure',
            rebookingPolicy: 'Automatic for weather/operational delays',
            groupBookings: 'Bulk management tools included',
            notificationSystem: 'Proactive flight alerts'
        },
        matchScore: 90
    }
];
export function OfferCreation({ corporateData, onNavigate, onBack }) {
    const [activeStep, setActiveStep] = useState('ai-suggestions');
    const [selectedOffers, setSelectedOffers] = useState([]);
    const [customOffer, setCustomOffer] = useState({
        title: '',
        category: '',
        description: '',
        benefits: [],
        terms: '',
        validityPeriod: '12',
        estimatedSavings: '',
        targetRoutes: []
    });
    const [emailSettings, setEmailSettings] = useState({
        subject: `Exclusive Travel Offer for ${corporateData?.name}`,
        body: `Dear ${corporateData?.name} Team,

We're excited to present exclusive travel offers designed specifically for your organization's needs.

Based on our analysis of your travel patterns and requirements, we've crafted these personalized offers to deliver maximum value and enhance your travel experience.

These offers are valid for a limited time and have been tailored to your specific travel profile and preferences.

We look forward to partnering with you to make your corporate travel more efficient, cost-effective, and sustainable.

Best regards,
SOAR Airlines Partnership Team`,
        recipients: corporateData?.email || '',
        ccRecipients: '',
        priority: 'medium'
    });
    const handleOfferSelect = (offer) => {
        setSelectedOffers(prev => {
            const isSelected = prev.some(o => o.id === offer.id);
            if (isSelected) {
                return prev.filter(o => o.id !== offer.id);
            }
            else {
                return [...prev, offer];
            }
        });
    };
    const handleCreateCustomOffer = () => {
        setActiveStep('custom-offer');
    };
    const handleSendOffers = () => {
        console.log('Sending offers:', selectedOffers);
        console.log('Email settings:', emailSettings);
        alert(`Offers sent successfully to ${corporateData.name}! ${selectedOffers.length} offer(s) included in the email.`);
        if (onNavigate) {
            onNavigate('active-offers');
        }
    };
    const renderAISuggestions = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx(Brain, { className: "h-8 w-8 text-blue-500" }), _jsx(Sparkles, { className: "h-6 w-6 text-yellow-500" })] }), _jsx("h3", { className: "text-2xl font-bold mb-2", children: "AI-Recommended Offers" }), _jsxs("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: ["Our AI has analyzed ", corporateData.name, "'s travel patterns, preferences, and requirements to suggest the most relevant offers"] })] }), _jsx("div", { className: "grid gap-6", children: aiSuggestedOffers.map((offer) => (_jsx(Card, { className: `transition-all duration-200 hover:shadow-lg ${selectedOffers.some(o => o.id === offer.id) ? 'ring-2 ring-primary border-primary' : ''}`, children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h4", { className: "text-xl font-semibold", children: offer.title }), _jsx(Badge, { variant: "outline", children: offer.category }), _jsxs(Badge, { variant: "default", className: "bg-green-100 text-green-700", children: [_jsx(Brain, { className: "h-3 w-3 mr-1" }), offer.confidence, "% match"] })] }), _jsx("p", { className: "text-muted-foreground mb-4", children: offer.description }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "h-4 w-4 text-green-500" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Estimated Savings" }), _jsx("p", { className: "font-semibold", children: offer.estimatedSavings })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-blue-500" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Validity" }), _jsx("p", { className: "font-semibold", children: offer.validityPeriod })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-4 w-4 text-purple-500" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Match Score" }), _jsxs("p", { className: "font-semibold", children: [offer.matchScore, "%"] })] })] })] })] }), _jsxs("div", { className: "flex flex-col gap-2 ml-4", children: [_jsx(Button, { variant: selectedOffers.some(o => o.id === offer.id) ? "default" : "outline", size: "sm", onClick: () => handleOfferSelect(offer), children: selectedOffers.some(o => o.id === offer.id) ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-1" }), "Selected"] })) : (_jsxs(_Fragment, { children: [_jsx(Gift, { className: "h-4 w-4 mr-1" }), "Select Offer"] })) }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "Details"] })] })] }), _jsxs(Tabs, { defaultValue: "benefits", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "benefits", children: "Benefits" }), _jsx(TabsTrigger, { value: "ai-reasoning", children: "AI Analysis" }), _jsx(TabsTrigger, { value: "terms", children: "Terms" })] }), _jsx(TabsContent, { value: "benefits", className: "space-y-3", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: offer.benefits.map((benefit, index) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-sm", children: benefit })] }, index))) }) }), _jsx(TabsContent, { value: "ai-reasoning", className: "space-y-3", children: _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsxs("h5", { className: "font-semibold text-blue-800 mb-2", children: ["Why this offer matches ", corporateData.name, ":"] }), _jsx("ul", { className: "space-y-2", children: offer.aiReasoning.map((reason, index) => (_jsxs("li", { className: "flex items-start gap-2 text-sm text-blue-700", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" }), reason] }, index))) })] }) }), _jsx(TabsContent, { value: "terms", className: "space-y-3", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: Object.entries(offer.terms).map(([key, value]) => (_jsxs("div", { children: [_jsx("p", { className: "font-medium text-muted-foreground", children: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }), _jsx("p", { className: "font-semibold", children: value })] }, key))) }) })] })] }) }, offer.id))) }), _jsxs("div", { className: "flex items-center justify-between pt-6 border-t", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-muted-foreground", children: "Selected Offers:" }), _jsx(Badge, { variant: "default", children: selectedOffers.length })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { variant: "outline", onClick: handleCreateCustomOffer, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create Custom Offer"] }), _jsxs(Button, { onClick: () => setActiveStep('review-send'), disabled: selectedOffers.length === 0, children: ["Continue with Selected Offers", _jsx(ArrowRight, { className: "h-4 w-4 ml-2" })] })] })] })] }));
    const renderCustomOffer = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold", children: "Create Custom Offer" }), _jsxs("p", { className: "text-muted-foreground", children: ["Design a personalized offer for ", corporateData.name] })] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveStep('ai-suggestions'), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to AI Suggestions"] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Offer Details" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Offer Title" }), _jsx(Input, { id: "title", value: customOffer.title, onChange: (e) => setCustomOffer({ ...customOffer, title: e.target.value }), placeholder: "Enter offer title" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Category" }), _jsxs(Select, { value: customOffer.category, onValueChange: (value) => setCustomOffer({ ...customOffer, category: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select category" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "volume-based", children: "Volume-Based" }), _jsx(SelectItem, { value: "premium-services", children: "Premium Services" }), _jsx(SelectItem, { value: "digital-solutions", children: "Digital Solutions" }), _jsx(SelectItem, { value: "sustainability", children: "Sustainability" }), _jsx(SelectItem, { value: "operational-efficiency", children: "Operational Efficiency" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", value: customOffer.description, onChange: (e) => setCustomOffer({ ...customOffer, description: e.target.value }), placeholder: "Describe the offer and its value proposition", rows: 3 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "estimatedSavings", children: "Estimated Savings" }), _jsx(Input, { id: "estimatedSavings", value: customOffer.estimatedSavings, onChange: (e) => setCustomOffer({ ...customOffer, estimatedSavings: e.target.value }), placeholder: "e.g., $100,000" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "validityPeriod", children: "Validity Period (months)" }), _jsxs(Select, { value: customOffer.validityPeriod, onValueChange: (value) => setCustomOffer({ ...customOffer, validityPeriod: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "6", children: "6 months" }), _jsx(SelectItem, { value: "12", children: "12 months" }), _jsx(SelectItem, { value: "18", children: "18 months" }), _jsx(SelectItem, { value: "24", children: "24 months" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "terms", children: "Terms & Conditions" }), _jsx(Textarea, { id: "terms", value: customOffer.terms, onChange: (e) => setCustomOffer({ ...customOffer, terms: e.target.value }), placeholder: "Enter detailed terms and conditions", rows: 4 })] })] })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", children: "Save as Template" }), _jsx(Button, { onClick: () => setActiveStep('review-send'), children: "Add to Selected Offers" })] })] }));
    const renderReviewSend = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold", children: "Review & Send Offers" }), _jsxs("p", { className: "text-muted-foreground", children: ["Final review before sending to ", corporateData.name] })] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveStep('ai-suggestions'), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Selection"] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Selected Offers (", selectedOffers.length, ")"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [selectedOffers.map((offer) => (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold", children: offer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: offer.category })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-semibold text-green-600", children: offer.estimatedSavings }), _jsx("p", { className: "text-xs text-muted-foreground", children: "estimated savings" })] })] }), _jsx("p", { className: "text-sm mb-3", children: offer.description }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { children: ["Valid for ", offer.validityPeriod] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [offer.confidence, "% AI match"] })] })] }, offer.id))), _jsxs(Alert, { children: [_jsx(Gift, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "These offers will be packaged into a professional proposal email with detailed terms and next steps." })] })] })] }) }), _jsx("div", { children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Email Configuration" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "emailSubject", children: "Subject" }), _jsx(Input, { id: "emailSubject", value: emailSettings.subject, onChange: (e) => setEmailSettings({ ...emailSettings, subject: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "recipients", children: "Recipients" }), _jsx(Input, { id: "recipients", value: emailSettings.recipients, onChange: (e) => setEmailSettings({ ...emailSettings, recipients: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "ccRecipients", children: "CC (Optional)" }), _jsx(Input, { id: "ccRecipients", value: emailSettings.ccRecipients, onChange: (e) => setEmailSettings({ ...emailSettings, ccRecipients: e.target.value }), placeholder: "additional@email.com" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "emailBody", children: "Message" }), _jsx(Textarea, { id: "emailBody", value: emailSettings.body, onChange: (e) => setEmailSettings({ ...emailSettings, body: e.target.value }), rows: 8 })] }), _jsxs("div", { children: [_jsx(Label, { children: "Priority" }), _jsxs(Select, { value: emailSettings.priority, onValueChange: (value) => setEmailSettings({ ...emailSettings, priority: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Low" }), _jsx(SelectItem, { value: "medium", children: "Medium" }), _jsx(SelectItem, { value: "high", children: "High" })] })] })] }), _jsxs(Alert, { children: [_jsx(Mail, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "Detailed offer documents will be automatically attached to the email." })] }), _jsxs(Button, { className: "w-full", onClick: handleSendOffers, children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), "Send Offers via Email"] })] })] }) })] })] }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: onBack, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Corporate Search"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "AI Offer Creation" }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Building2, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { className: "text-muted-foreground", children: "Creating offers for" }), _jsx(Badge, { variant: "outline", children: corporateData.name })] })] })] }) }), _jsx("div", { className: "flex items-center justify-center mb-8", children: _jsx("div", { className: "flex items-center gap-2", children: [
                        { id: 'ai-suggestions', label: 'AI Suggestions', icon: Brain },
                        { id: 'custom-offer', label: 'Custom Offer', icon: Settings },
                        { id: 'review-send', label: 'Review & Send', icon: Send }
                    ].map((step, index, array) => {
                        const isActive = activeStep === step.id;
                        const isCompleted = ['ai-suggestions', 'custom-offer'].indexOf(activeStep) > ['ai-suggestions', 'custom-offer'].indexOf(step.id);
                        const StepIcon = step.icon;
                        return (_jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' :
                                        isCompleted ? 'bg-green-100 text-green-700' :
                                            'bg-muted text-muted-foreground'}`, children: [_jsx(StepIcon, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm font-medium", children: step.label })] }), index < array.length - 1 && (_jsx("div", { className: "w-8 h-px bg-border mx-2" }))] }, step.id));
                    }) }) }), activeStep === 'ai-suggestions' && renderAISuggestions(), activeStep === 'custom-offer' && renderCustomOffer(), activeStep === 'review-send' && renderReviewSend()] }));
}
