import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MessageCircle, Send, Sparkles, Brain, Search, Building2, FileText, Gift, Users, Lightbulb, Target, TrendingUp, BarChart3, Mail, Settings, Bot, ChevronRight, Shield, Paperclip, Mic, CalendarDays, LayoutDashboard } from 'lucide-react';
export function AIAssistant({ onNavigate }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [selectedReport, setSelectedReport] = useState('');
    const quickActions = [
        {
            id: 'corporate-search',
            label: 'Corporate Search',
            description: 'Find and discover potential corporate partnerships',
            icon: Search,
            gradient: 'from-blue-50 to-blue-100',
            action: () => onNavigate('corporate-search')
        },
        {
            id: 'lead-management',
            label: 'Lead Management',
            description: 'View and manage your sales pipeline',
            icon: Target,
            gradient: 'from-emerald-50 to-emerald-100',
            action: () => onNavigate('lead-management')
        },
        {
            id: 'qualified-leads',
            label: 'Qualified Leads',
            description: 'High-potential prospects ready for conversion',
            icon: Users,
            gradient: 'from-violet-50 to-violet-100',
            action: () => onNavigate('qualified-leads')
        },
        {
            id: 'email-campaigns',
            label: 'Email Campaigns',
            description: 'Automated outreach and nurturing campaigns',
            icon: Mail,
            gradient: 'from-amber-50 to-amber-100',
            action: () => onNavigate('email-campaigns')
        },
        {
            id: 'opportunities',
            label: 'Opportunities',
            description: 'Sales pipeline tracking and deal management',
            icon: TrendingUp,
            gradient: 'from-teal-50 to-teal-100',
            action: () => onNavigate('opportunities')
        },
        {
            id: 'revenue-prediction',
            label: 'Revenue Prediction',
            description: 'AI-powered revenue forecasting and analytics',
            icon: Brain,
            gradient: 'from-rose-50 to-rose-100',
            action: () => onNavigate('revenue-prediction')
        },
        {
            id: 'contracts',
            label: 'Contract Management',
            description: 'Manage agreements and compliance tracking',
            icon: FileText,
            gradient: 'from-yellow-50 to-yellow-100',
            action: () => onNavigate('contracts')
        },
        {
            id: 'breach-monitoring',
            label: 'Risk Monitoring',
            description: 'Contract breach tracking and risk assessment',
            icon: Shield,
            gradient: 'from-red-50 to-red-100',
            action: () => onNavigate('breach-monitoring')
        }
    ];
    const handleQuickAction = (message) => {
        setShowWelcome(false);
        setInput(message);
        handleSendMessage(message);
    };
    const handleSendMessage = (messageText) => {
        const messageContent = messageText || input.trim();
        if (!messageContent || isProcessing)
            return;
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: messageContent,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);
        setShowWelcome(false);
        // Simulate AI processing
        setTimeout(() => {
            const aiResponse = generateAIResponse(messageContent);
            setMessages(prev => [...prev, aiResponse]);
            setIsProcessing(false);
        }, 1500);
    };
    const generateAIResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('corporate') || lowerMessage.includes('travel report')) {
            return {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'I\'ll help you generate a comprehensive corporate travel report. What specific details would you like to include?',
                timestamp: new Date(),
                filterOptions: [
                    { label: 'Travel Dates', value: 'dates', selected: false },
                    { label: 'Expense Categories', value: 'expenses', selected: false },
                    { label: 'Department Breakdown', value: 'departments', selected: false },
                    { label: 'Employee Details', value: 'employees', selected: false }
                ],
                actions: [
                    {
                        label: 'Corporate Search',
                        icon: Search,
                        action: () => onNavigate('corporate-search'),
                        variant: 'default'
                    },
                    {
                        label: 'View Dashboard',
                        icon: BarChart3,
                        action: () => onNavigate('dashboard'),
                        variant: 'outline'
                    }
                ]
            };
        }
        if (lowerMessage.includes('lead') || lowerMessage.includes('conversion')) {
            return {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'I can help you analyze your lead performance. Would you like to see qualified leads, conversion metrics, or the complete lead pipeline?',
                timestamp: new Date(),
                actions: [
                    {
                        label: 'View Qualified Leads',
                        icon: Users,
                        action: () => onNavigate('qualified-leads'),
                        variant: 'default'
                    },
                    {
                        label: 'Lead Dashboard',
                        icon: Target,
                        action: () => onNavigate('lead-management'),
                        variant: 'outline'
                    },
                    {
                        label: 'Opportunities',
                        icon: TrendingUp,
                        action: () => onNavigate('opportunities'),
                        variant: 'outline'
                    }
                ]
            };
        }
        if (lowerMessage.includes('contract') || lowerMessage.includes('compliance')) {
            return {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'I can help you review contract performance and compliance. Would you like to see active contracts, breach monitoring, or risk assessments?',
                timestamp: new Date(),
                actions: [
                    {
                        label: 'Contract Management',
                        icon: FileText,
                        action: () => onNavigate('contracts'),
                        variant: 'default'
                    },
                    {
                        label: 'Risk Monitoring',
                        icon: Shield,
                        action: () => onNavigate('breach-monitoring'),
                        variant: 'outline'
                    }
                ]
            };
        }
        if (lowerMessage.includes('revenue') || lowerMessage.includes('financial') || lowerMessage.includes('prediction')) {
            return {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'I can show you revenue predictions and financial analytics. Our AI-powered forecasting provides insights into future performance trends.',
                timestamp: new Date(),
                actions: [
                    {
                        label: 'Revenue Prediction',
                        icon: Brain,
                        action: () => onNavigate('revenue-prediction'),
                        variant: 'default'
                    },
                    {
                        label: 'Analytics Dashboard',
                        icon: BarChart3,
                        action: () => onNavigate('dashboard'),
                        variant: 'outline'
                    }
                ]
            };
        }
        if (lowerMessage.includes('email') || lowerMessage.includes('campaign') || lowerMessage.includes('outreach')) {
            return {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'I can help you manage email campaigns and automated outreach. Would you like to create a new campaign or review existing performance?',
                timestamp: new Date(),
                actions: [
                    {
                        label: 'Email Campaigns',
                        icon: Mail,
                        action: () => onNavigate('email-campaigns'),
                        variant: 'default'
                    },
                    {
                        label: 'Lead Management',
                        icon: Users,
                        action: () => onNavigate('lead-management'),
                        variant: 'outline'
                    }
                ]
            };
        }
        if (lowerMessage.includes('custom') || lowerMessage.includes('help')) {
            return {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'I\'m here to help you navigate SOAR-AI\'s features. You can ask me about corporate search, lead management, contracts, revenue predictions, or any other functionality.',
                timestamp: new Date(),
                suggestions: [
                    {
                        label: 'Find Corporate Clients',
                        description: 'Search and discover potential corporate partnerships',
                        icon: Search,
                        action: () => onNavigate('corporate-search')
                    },
                    {
                        label: 'Manage Leads',
                        description: 'View and qualify your sales leads',
                        icon: Users,
                        action: () => onNavigate('leads-list')
                    },
                    {
                        label: 'Track Opportunities',
                        description: 'Monitor your sales pipeline progress',
                        icon: Target,
                        action: () => onNavigate('opportunities')
                    }
                ]
            };
        }
        // Default response
        return {
            id: Date.now() + 1,
            type: 'assistant',
            content: `I understand you're looking for help with "${userMessage}". Let me guide you to the right section of SOAR-AI where you can accomplish this task.`,
            timestamp: new Date(),
            actions: [
                {
                    label: 'Explore Dashboard',
                    icon: LayoutDashboard,
                    action: () => onNavigate('dashboard'),
                    variant: 'default'
                },
                {
                    label: 'Corporate Search',
                    icon: Search,
                    action: () => onNavigate('corporate-search'),
                    variant: 'outline'
                }
            ]
        };
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const handleNewChat = () => {
        setMessages([]);
        setShowWelcome(true);
        setInput('');
        setSelectedReport('');
    };
    const handleFilterSelect = (messageId, filterValue) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId && msg.filterOptions) {
                return {
                    ...msg,
                    filterOptions: msg.filterOptions.map(filter => filter.value === filterValue
                        ? { ...filter, selected: !filter.selected }
                        : filter)
                };
            }
            return msg;
        }));
    };
    return (_jsxs("div", { className: "w-full h-full flex bg-gray-50 relative p-5", children: [_jsxs("div", { className: "flex-1 flex flex-col h-full", children: [_jsx("div", { className: "flex-shrink-0 flex items-center justify-between p-6 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[100] shadow-sm", style: { marginLeft: '250px' }, children: _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "SOAR-AI" }), _jsx("div", { className: "flex items-center gap-1 text-sm text-gray-500", children: _jsx(CalendarDays, { className: "h-4 w-4" }) })] }) }) }), _jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [_jsxs("div", { className: "flex-1 overflow-y-auto mt-[0px] mr-[0px] mb-[100px] ml-[0px]", children: [showWelcome && (_jsxs("div", { className: "h-full flex flex-col items-center justify-center p-8 space-y-8", children: [_jsx("div", { className: "relative", children: _jsxs("div", { className: "w-20 h-20 bg-primary rounded-2xl flex items-center justify-center relative", children: [_jsx(Bot, { className: "h-10 w-10 text-white" }), _jsx("div", { className: "absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-lg flex items-center justify-center", children: _jsx(MessageCircle, { className: "h-3 w-3 text-secondary-foreground" }) })] }) }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "Welcome, John Rose!" }), _jsx("p", { className: "text-gray-600", children: "Hello! What report would you like to generate today?" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full", children: [_jsxs(Button, { variant: "default", onClick: () => handleQuickAction('I need to generate a corporate travel report'), className: "h-auto p-4 flex flex-col items-center gap-2 text-center", children: [_jsx(Building2, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "Corporate Report" })] }), _jsxs(Button, { variant: "outline", onClick: () => handleQuickAction('Show me lead analysis and conversion metrics'), className: "h-auto p-4 flex flex-col items-center gap-2 text-center", children: [_jsx(TrendingUp, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "Lead Analysis" })] }), _jsxs(Button, { variant: "outline", onClick: () => handleQuickAction('I want to review contract performance and compliance'), className: "h-auto p-4 flex flex-col items-center gap-2 text-center", children: [_jsx(FileText, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "Contract Overview" })] }), _jsxs(Button, { variant: "outline", onClick: () => handleQuickAction('Show me revenue predictions and financial tracking'), className: "h-auto p-4 flex flex-col items-center gap-2 text-center", children: [_jsx(BarChart3, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "Revenue Tracking" })] }), _jsxs(Button, { variant: "outline", onClick: () => handleQuickAction('I need help creating a custom analysis report'), className: "h-auto p-4 flex flex-col items-center gap-2 text-center", children: [_jsx(Settings, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "Custom Analysis" })] })] })] })), !showWelcome && (_jsx("div", { className: "p-6 pb-0", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-4", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsxs("div", { className: "flex flex-col items-center text-center space-y-3 p-4", children: [_jsx("div", { className: "relative", children: _jsxs("div", { className: "w-16 h-16 bg-primary rounded-2xl flex items-center justify-center relative", children: [_jsx(Bot, { className: "h-8 w-8 text-white" }), _jsx("div", { className: "absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-[#133769] to-[#1a4a7a] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white", children: _jsx("span", { className: "text-xs font-medium tracking-tight", children: "SOAR AI" }) })] }) }), _jsxs("div", { className: "space-y-1 mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Hi John Rose!" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["I'm your SOAR-AI assistant \u2014 here to help with clients, contracts, offers, support tickets, and more.", _jsx("br", {}), "What would you like to do today?"] })] }), _jsxs("div", { className: "w-full max-w-2xl mx-auto mt-[100px]", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900 mb-4 text-center", children: "Quick suggestions:" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("button", { onClick: () => onNavigate('corporate-search'), className: "flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(Search, { className: "h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-sm", children: "Find Corporate Clients" }), _jsx("div", { className: "text-gray-500 text-xs", children: "Search for potential travel partners" })] })] }), _jsxs("button", { onClick: () => onNavigate('design-travel-offers'), className: "flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(Gift, { className: "h-4 w-4 text-primary flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-sm", children: "Create Travel Offers" }), _jsx("div", { className: "text-gray-500 text-xs", children: "Design personalized offers" })] })] }), _jsxs("button", { onClick: () => onNavigate('dashboard'), className: "flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(LayoutDashboard, { className: "h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-sm", children: "View Dashboard" }), _jsx("div", { className: "text-gray-500 text-xs", children: "See system overview" })] })] }), _jsxs("button", { onClick: () => onNavigate('admin-dashboard'), className: "flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(Shield, { className: "h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-sm", children: "Admin Dashboard" }), _jsx("div", { className: "text-gray-500 text-xs", children: "Comprehensive administration panel" })] })] })] })] })] }) }), messages.map((message) => (_jsx("div", { className: `flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[70%] ${message.type === 'user'
                                                            ? 'bg-primary text-white rounded-l-2xl rounded-tr-2xl'
                                                            : 'bg-white border border-gray-200 rounded-r-2xl rounded-tl-2xl shadow-sm'} p-4`, children: [message.type === 'assistant' && (_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "w-6 h-6 bg-primary rounded-lg flex items-center justify-center", children: _jsx(Bot, { className: "h-3 w-3 text-white" }) }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "AI Assistant" })] })), _jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: `text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`, children: message.content }), message.filterOptions && (_jsx("div", { className: "flex flex-wrap gap-2", children: message.filterOptions.map((filter) => (_jsx("button", { onClick: () => handleFilterSelect(message.id, filter.value), className: `px-3 py-1.5 text-xs rounded-full border transition-colors ${filter.selected
                                                                                ? 'bg-secondary border-secondary text-secondary-foreground'
                                                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`, children: filter.label }, filter.value))) })), message.actions && (_jsx("div", { className: "flex flex-wrap gap-2", children: message.actions.map((action, index) => {
                                                                            const ActionIcon = action.icon;
                                                                            return (_jsxs(Button, { size: "sm", variant: action.variant || 'default', onClick: action.action, className: "h-8 text-xs", children: [ActionIcon && _jsx(ActionIcon, { className: "h-3 w-3 mr-1" }), action.label] }, index));
                                                                        }) })), message.type === 'assistant' && message.id === messages[0]?.id && (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900", children: "Quick suggestions:" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => onNavigate('corporate-search'), className: "flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(Search, { className: "h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-xs", children: "Find Corporate Clients" }), _jsx("div", { className: "text-gray-500 text-xs", children: "Search for potential travel partners" })] })] }), _jsxs("button", { onClick: () => onNavigate('design-travel-offers'), className: "flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(Gift, { className: "h-4 w-4 text-primary flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-xs", children: "Create Travel Offers" }), _jsx("div", { className: "text-gray-500 text-xs", children: "Design personalized offers" })] })] }), _jsxs("button", { onClick: () => onNavigate('dashboard'), className: "flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(LayoutDashboard, { className: "h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-xs", children: "View Dashboard" }), _jsx("div", { className: "text-gray-500 text-xs", children: "See system overview" })] })] }), _jsxs("button", { onClick: () => onNavigate('admin-dashboard'), className: "flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300", children: [_jsx(Shield, { className: "h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700 text-xs", children: "Admin Dashboard" }), _jsx("div", { className: "text-gray-500 text-xs", children: "Comprehensive administration panel" })] })] })] })] })), message.suggestions && (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs font-medium text-gray-500", children: "Quick suggestions:" }), message.suggestions.map((suggestion, index) => {
                                                                                const SuggestionIcon = suggestion.icon;
                                                                                return (_jsxs("button", { onClick: suggestion.action, className: "flex items-center gap-2 w-full p-2 text-left text-xs rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors", children: [SuggestionIcon && _jsx(SuggestionIcon, { className: "h-3 w-3 text-gray-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-700", children: suggestion.label }), _jsx("div", { className: "text-gray-500", children: suggestion.description })] })] }, index));
                                                                            })] }))] }), _jsx("div", { className: `text-xs mt-2 ${message.type === 'user' ? 'text-primary-foreground opacity-80' : 'text-gray-400'}`, children: message.timestamp.toLocaleTimeString() })] }) }, message.id))), isProcessing && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-white border border-gray-200 rounded-r-2xl rounded-tl-2xl shadow-sm p-4 max-w-[70%]", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 bg-primary rounded-lg flex items-center justify-center", children: _jsx(Bot, { className: "h-3 w-3 text-white" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" }), _jsx("span", { className: "text-sm text-gray-600", children: "AI is thinking..." })] })] }) }) }))] }) }))] }), !showWelcome && (_jsxs("div", { className: "flex-shrink-0 border-t border-gray-200 bg-white sticky bottom-0 z-50 shadow-lg mt-[0px] mr-[24px] mb-[0px] ml-[0px]", children: [messages.length === 1 && (_jsx("div", { className: "bg-gray-50 p-4 border-b border-gray-200", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Sparkles, { className: "h-4 w-4 text-primary" }), _jsx("h4", { className: "text-sm font-medium text-gray-700", children: "Try These Tasks" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleQuickAction('Find technology companies with high travel budgets'), className: "text-xs h-8", children: [_jsx(Search, { className: "h-3 w-3 mr-1" }), "Find Tech Companies"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleQuickAction('Show me qualified leads that need follow-up'), className: "text-xs h-8", children: [_jsx(Users, { className: "h-3 w-3 mr-1" }), "Qualified Leads"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleQuickAction('Create an email campaign for unqualified leads'), className: "text-xs h-8", children: [_jsx(Mail, { className: "h-3 w-3 mr-1" }), "Email Campaign"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleQuickAction('Review contracts expiring this month'), className: "text-xs h-8", children: [_jsx(FileText, { className: "h-3 w-3 mr-1" }), "Contract Review"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleQuickAction('Show revenue predictions for next quarter'), className: "text-xs h-8", children: [_jsx(TrendingUp, { className: "h-3 w-3 mr-1" }), "Revenue Forecast"] })] })] }) })), _jsx("div", { className: "p-6 mt-[0px] mr-[24px] mb-[0px] ml-[0px]", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "relative flex items-center gap-3", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyPress, placeholder: "Type your message here...", className: "w-full px-4 py-3 pr-16 rounded-full border border-gray-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm shadow-sm hover:shadow-md transition-shadow duration-200", disabled: isProcessing }), _jsxs("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2", children: [_jsx("button", { className: "p-1 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(Paperclip, { className: "h-4 w-4 text-gray-400" }) }), _jsx("button", { className: "p-1 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(Mic, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsx(Button, { onClick: () => handleSendMessage(), disabled: !input.trim() || isProcessing, size: "sm", className: "rounded-full px-4", children: _jsx(Send, { className: "h-4 w-4" }) })] }) }) }), _jsx("div", { style: {
                                            backgroundColor: '#f8f9fa',
                                            padding: 'var(--space-lg)',
                                            borderTop: '1px solid #E6EAEF',
                                            marginBottom: '10px',
                                            marginRight: '8px'
                                        }, children: _jsxs("div", { className: "max-w-4xl mx-auto pl-5", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Lightbulb, { className: "h-4 w-4", style: { color: 'var(--color-primary)' } }), _jsx("h4", { style: {
                                                                fontSize: 'var(--text-sm)',
                                                                fontWeight: 'var(--font-weight-medium)',
                                                                fontFamily: 'var(--font-family)',
                                                                color: 'var(--color-foreground)'
                                                            }, children: "Try These Tasks" })] }), _jsx("p", { style: {
                                                        fontSize: 'var(--text-sm)',
                                                        color: 'var(--color-muted-foreground)',
                                                        fontFamily: 'var(--font-family)',
                                                        marginBottom: 'var(--space-lg)'
                                                    }, children: "Click to quickly fill the chat input with common requests" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [_jsxs("div", { style: {
                                                                backgroundColor: 'white',
                                                                border: '1px solid #C9C9C9',
                                                                borderRadius: 'var(--radius-md)',
                                                                padding: 'var(--space-lg)',
                                                                cursor: 'pointer',
                                                                transition: 'box-shadow 0.2s ease-in-out'
                                                            }, className: "hover:shadow-md", onClick: () => handleQuickAction('Find technology companies with high travel budgets'), children: [_jsx("div", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-primary)',
                                                                        marginBottom: 'var(--space-sm)'
                                                                    }, children: "Corporate Search" }), _jsx("div", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)',
                                                                        lineHeight: '1.3'
                                                                    }, children: "\"Find technology companies with high travel budgets\"" })] }), _jsxs("div", { style: {
                                                                backgroundColor: 'white',
                                                                border: '1px solid #C9C9C9',
                                                                borderRadius: 'var(--radius-md)',
                                                                padding: 'var(--space-lg)',
                                                                cursor: 'pointer',
                                                                transition: 'box-shadow 0.2s ease-in-out'
                                                            }, className: "hover:shadow-md", onClick: () => handleQuickAction('Create a sustainability-focused travel offer'), children: [_jsx("div", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-primary)',
                                                                        marginBottom: 'var(--space-sm)'
                                                                    }, children: "Offer Creation" }), _jsx("div", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)',
                                                                        lineHeight: '1.3'
                                                                    }, children: "\"Create a sustainability-focused travel offer\"" })] }), _jsxs("div", { style: {
                                                                backgroundColor: 'white',
                                                                border: '1px solid #C9C9C9',
                                                                borderRadius: 'var(--radius-md)',
                                                                padding: 'var(--space-lg)',
                                                                cursor: 'pointer',
                                                                transition: 'box-shadow 0.2s ease-in-out'
                                                            }, className: "hover:shadow-md", onClick: () => handleQuickAction('Monitor contract compliance for financial services clients'), children: [_jsx("div", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-primary)',
                                                                        marginBottom: 'var(--space-sm)'
                                                                    }, children: "Contract Management" }), _jsx("div", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)',
                                                                        lineHeight: '1.3'
                                                                    }, children: "\"Monitor contract compliance for financial services clients\"" })] }), _jsxs("div", { style: {
                                                                backgroundColor: 'white',
                                                                border: '1px solid #C9C9C9',
                                                                borderRadius: 'var(--radius-md)',
                                                                padding: 'var(--space-lg)',
                                                                cursor: 'pointer',
                                                                transition: 'box-shadow 0.2s ease-in-out'
                                                            }, className: "hover:shadow-md", onClick: () => handleQuickAction('Send notifications to corporate travel managers'), children: [_jsx("div", { style: {
                                                                        fontSize: 'var(--text-sm)',
                                                                        fontWeight: 'var(--font-weight-medium)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-primary)',
                                                                        marginBottom: 'var(--space-sm)'
                                                                    }, children: "Communication" }), _jsx("div", { style: {
                                                                        fontSize: 'var(--text-xs)',
                                                                        fontFamily: 'var(--font-family)',
                                                                        color: 'var(--color-foreground)',
                                                                        lineHeight: '1.3'
                                                                    }, children: "\"Send notifications to corporate travel managers\"" })] })] })] }) })] }))] })] }), _jsx("div", { className: "w-80 bg-white border-l border-gray-200 flex-shrink-0", children: _jsxs("div", { className: "h-full overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "System Status" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs text-gray-600", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { children: "1,247 Corporates" }), _jsx("div", { children: "324 Qualified Leads" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { children: "156 Contracts" }), _jsx("div", { children: "24 Active Offers" })] })] })] }) }), _jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Quick Actions" }), _jsx("p", { className: "text-sm text-gray-600", children: "Navigate directly to key sections" })] }), _jsx("div", { className: "p-6 space-y-3", children: quickActions.map((action) => {
                                const Icon = action.icon;
                                return (_jsx(Card, { className: `cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-r ${action.gradient} border-0`, onClick: action.action, children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Icon, { className: "h-5 w-5 text-gray-700" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "font-medium text-gray-900 text-sm mb-1", children: action.label }), _jsx("p", { className: "text-xs text-gray-600 leading-relaxed", children: action.description })] }), _jsx(ChevronRight, { className: "h-4 w-4 text-gray-400 flex-shrink-0" })] }) }) }, action.id));
                            }) })] }) })] }));
}
