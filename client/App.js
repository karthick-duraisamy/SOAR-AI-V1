import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import soarLogo from "./public/SOAR Logo.svg";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset, } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "./components/ui/breadcrumb";
import { TourGuide, defaultTourSteps, aiAssistantTourSteps, dashboardTourSteps, } from "./components/TourGuide";
import { AIAssistant } from "./components/AIAssistant";
import { Dashboard } from "./components/Dashboard";
import { CorporateSearch } from "./components/CorporateSearch";
import { LeadManagement } from "./components/LeadManagement";
import { LeadsList } from './components/LeadsList';
import { AllLeads } from './components/AllLeads';
import { EmailCampaigns } from "./components/EmailCampaigns";
import { Opportunities } from "./components/Opportunities";
import { RevenuePrediction } from "./components/RevenuePrediction";
import { ContractManagement } from "./components/ContractManagement";
import { BreachMonitoring } from "./components/BreachMonitoring";
import { OfferManagement } from "./components/OfferManagement";
import { CustomerSupportDashboard } from "./components/CustomerSupportDashboard";
import { TicketList } from "./components/TicketList";
import { TicketKanban } from "./components/TicketKanban";
import { TicketDetails } from "./components/TicketDetails";
import { AdminDashboard } from "./components/AdminDashboard";
import { Settings } from "./components/Settings";
import { Bot, LayoutDashboard, Search, FileText, TrendingUp, Users, AlertTriangle, Shield, Target, Settings as SettingsIcon, Plus, BarChart3, Home, UserCheck, Presentation, Mail, UsersIcon, Brain, ChevronUp, ChevronDown, MapPin, Play, ChevronRight, } from "lucide-react";
export default function App() {
    const [activeSection, setActiveSection] = useState("ai-assistant");
    const [sectionFilters, setSectionFilters] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({
        Highlights: true,
        COINHUB: true,
        COCAST: true,
        CONTRAQ: true,
        "Travel Offers": true,
    });
    // Enhanced breadcrumb path tracking
    const [breadcrumbPath, setBreadcrumbPath] = useState([
        { id: "ai-assistant", label: "AI Assistant", filters: {} },
    ]);
    // Enhanced Tour Guide State - Auto-open tour on page entry
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [currentTourType, setCurrentTourType] = useState("default");
    // Automatically open tour when entering the page
    useEffect(() => {
        // Auto-trigger tour after a short delay for better UX
        const timer = setTimeout(() => {
            setIsTourOpen(true);
            setCurrentTourType("default");
        }, 1000);
        return () => clearTimeout(timer);
    }, []); // Remove dependency on localStorage check
    const navigateToSection = (sectionId, filters = {}) => {
        console.log("navigateToSection called:", { sectionId, filters });
        setActiveSection(sectionId);
        setSectionFilters(filters);
        // Build breadcrumb path
        const newPath = buildBreadcrumbPath(sectionId, filters);
        setBreadcrumbPath(newPath);
    };
    const buildBreadcrumbPath = (sectionId, filters = {}) => {
        const basePath = [
            { id: "ai-assistant", label: "AI Assistant", filters: {} },
        ];
        // If navigating to AI Assistant, return base path
        if (sectionId === "ai-assistant") {
            return basePath;
        }
        // Build path based on section and context
        const currentPath = [...basePath];
        // Add main section
        const mainSection = getSectionInfo(sectionId, filters);
        if (mainSection) {
            currentPath.push(mainSection);
        }
        // Add sub-section if applicable
        const subSection = getSubSectionInfo(sectionId, filters);
        if (subSection) {
            currentPath.push(subSection);
        }
        return currentPath;
    };
    const getSectionInfo = (sectionId, filters) => {
        const sectionMap = {
            dashboard: { id: "dashboard", label: "Dashboard", filters: {} },
            "corporate-search": {
                id: "corporate-search",
                label: "Corporate Search",
                filters: {},
            },
            "lead-management": {
                id: "lead-management",
                label: "Lead Management",
                filters: {},
            },
            "leads-list": { id: "leads-list", label: "All Leads", filters: {} },
            leads: { id: "leads", label: "All Leads", filters: {} },
            "qualified-leads": {
                id: "qualified-leads",
                label: "Qualified Leads",
                filters: {},
            },
            "unqualified-leads": {
                id: "unqualified-leads",
                label: "Unqualified Leads",
                filters: {},
            },
            "email-campaigns": {
                id: "email-campaigns",
                label: "Email Campaigns",
                filters: {},
            },
            opportunities: {
                id: "opportunities",
                label: "Opportunities",
                filters: {},
            },
            "revenue-prediction": {
                id: "revenue-prediction",
                label: "Revenue Prediction",
                filters: {},
            },
            contracts: { id: "contracts", label: "Contract Management", filters: {} },
            "breach-monitoring": {
                id: "breach-monitoring",
                label: "Breach Monitoring",
                filters: {},
            },
            "design-travel-offers": {
                id: "design-travel-offers",
                label: "Travel Offers",
                filters: {},
            },
            "agent-dashboard": {
                id: "agent-dashboard",
                label: "Agent Dashboard",
                filters: {},
            },
            "support-dashboard": {
                id: "support-dashboard",
                label: "Support Dashboard",
                filters: {},
            },
            "admin-dashboard": {
                id: "admin-dashboard",
                label: "Admin Dashboard",
                filters: {},
            },
            "ticket-list": {
                id: "ticket-list",
                label: "Support Tickets",
                filters: {},
            },
            "ticket-kanban": {
                id: "ticket-kanban",
                label: "Workflow Board",
                filters: {},
            },
            "ticket-details": {
                id: "ticket-details",
                label: "Ticket Details",
                filters: {},
            },
            settings: { id: "settings", label: "Settings", filters: {} },
        };
        return sectionMap[sectionId] || null;
    };
    const getSubSectionInfo = (sectionId, filters) => {
        // Handle specific sub-sections based on filters or context
        if (filters.companyName) {
            return {
                id: `${sectionId}-profile`,
                label: `${filters.companyName} Profile`,
                filters,
            };
        }
        if (filters.leadId) {
            return { id: `${sectionId}-lead`, label: `Lead Details`, filters };
        }
        if (filters.ticketId) {
            return {
                id: `${sectionId}-ticket`,
                label: `Ticket #${filters.ticketId}`,
                filters,
            };
        }
        if (filters.campaignId) {
            return {
                id: `${sectionId}-campaign`,
                label: `Campaign Details`,
                filters,
            };
        }
        if (filters.contractId) {
            return {
                id: `${sectionId}-contract`,
                label: `Contract Details`,
                filters,
            };
        }
        if (filters.view === "profile") {
            return {
                id: `${sectionId}-profile`,
                label: "View Full Profile",
                filters,
            };
        }
        if (filters.view === "details") {
            return { id: `${sectionId}-details`, label: "View Details", filters };
        }
        if (filters.view === "edit") {
            return { id: `${sectionId}-edit`, label: "Edit", filters };
        }
        if (filters.status === "qualified") {
            return { id: `${sectionId}-qualified`, label: "Qualified View", filters };
        }
        if (filters.status === "unqualified") {
            return {
                id: `${sectionId}-unqualified`,
                label: "Unqualified View",
                filters,
            };
        }
        return null;
    };
    const navigateToBreadcrumb = (targetIndex) => {
        const targetPath = breadcrumbPath[targetIndex];
        if (targetPath) {
            setActiveSection(targetPath.id);
            setSectionFilters(targetPath.filters);
            setBreadcrumbPath(breadcrumbPath.slice(0, targetIndex + 1));
        }
    };
    const toggleGroupExpanded = (groupLabel) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupLabel]: !prev[groupLabel],
        }));
    };
    const handleTourStart = (tourType = "default") => {
        setCurrentTourType(tourType);
        setIsTourOpen(true);
    };
    const handleTourClose = () => {
        setIsTourOpen(false);
    };
    const handleTourComplete = () => {
        // Only store completion for the main tour, allow repeated viewing of specific tours
        if (currentTourType === "default") {
            localStorage.setItem("soar-ai-tour-completed", "true");
        }
        setIsTourOpen(false);
    };
    const getCurrentTourSteps = () => {
        switch (currentTourType) {
            case "ai-assistant":
                return aiAssistantTourSteps;
            case "dashboard":
                return dashboardTourSteps;
            default:
                return defaultTourSteps;
        }
    };
    const getCurrentTourTitle = () => {
        switch (currentTourType) {
            case "ai-assistant":
                return "AI Assistant Guide";
            case "dashboard":
                return "Dashboard Guide";
            default:
                return "SOAR-AI Complete Guide";
        }
    };
    // Function to get badge counts for different menu items
    const getBadgeCount = (itemId) => {
        const counts = {
            // leads-list was removed as per the instruction
            "qualified-leads": 3, // Qualified leads count
            "unqualified-leads": 1, // Unqualified leads count
            opportunities: 5, // Opportunities count
            "all-leads": 6, // Total leads count
        };
        return counts[itemId] || 0;
    };
    const renderContent = () => {
        switch (activeSection) {
            case "ai-assistant":
                return _jsx(AIAssistant, { onNavigate: navigateToSection });
            case "dashboard":
                return _jsx(Dashboard, { onNavigate: navigateToSection });
            case "corporate-search":
                return (_jsx(CorporateSearch, { initialFilters: sectionFilters, onNavigate: navigateToSection }));
            case "lead-management":
                return _jsx(LeadManagement, { onNavigate: navigateToSection });
            case 'leads-list':
                return _jsx(LeadsList, { onNavigate: navigateToSection, initialFilters: sectionFilters });
            case 'all-leads':
                return _jsx(AllLeads, { onNavigate: navigateToSection });
            // case "qualified-leads":
            //   return (
            //     <LeadsList
            //       initialFilters={{ ...sectionFilters, status: "qualified" }}
            //       onNavigate={navigateToSection}
            //     />
            //   );
            // case "unqualified-leads":
            //   return (
            //     <LeadsList
            //       initialFilters={{ ...sectionFilters, status: "unqualified" }}
            //       onNavigate={navigateToSection}
            //     />
            //   );
            case "email-campaigns":
                return _jsx(EmailCampaigns, { onNavigate: navigateToSection });
            case "opportunities":
                return (_jsx(Opportunities, { initialFilters: sectionFilters, onNavigate: navigateToSection }));
            case "revenue-prediction":
                return _jsx(RevenuePrediction, { onNavigate: navigateToSection });
            case "contracts":
                return _jsx(ContractManagement, { initialFilters: sectionFilters });
            case "breach-monitoring":
                return _jsx(BreachMonitoring, { initialFilters: sectionFilters });
            case "design-travel-offers":
                return (_jsx(OfferManagement, { initialTab: "dashboard", initialFilters: sectionFilters }));
            case "agent-dashboard":
                return _jsx(CustomerSupportDashboard, { onNavigate: navigateToSection });
            case "support-dashboard":
                return _jsx(CustomerSupportDashboard, { onNavigate: navigateToSection });
            case "admin-dashboard":
                return _jsx(AdminDashboard, { onNavigate: navigateToSection });
            case "ticket-list":
                return (_jsx(TicketList, { initialFilters: sectionFilters, onNavigate: navigateToSection }));
            case "ticket-kanban":
                return _jsx(TicketKanban, { onNavigate: navigateToSection });
            case "ticket-details":
                return (_jsx(TicketDetails, { ticketId: sectionFilters.ticketId, onNavigate: navigateToSection }));
            case "settings":
                return _jsx(Settings, { onScreenVisibilityChange: () => { } });
            default:
                return _jsx(AIAssistant, { onNavigate: navigateToSection });
        }
    };
    const getActiveLabel = () => {
        switch (activeSection) {
            case "ai-assistant":
                return "AI Assistant";
            case "dashboard":
                return "Dashboard";
            case "corporate-search":
                return "Corporate Search";
            case "lead-management":
                return "Lead Management";
            case "leads-list":
            case "leads":
                return "All Leads";
            case "all-leads":
                return "All Leads";
            case "qualified-leads":
                return "Qualified Leads";
            case "unqualified-leads":
                return "Unqualified Leads";
            case "email-campaigns":
                return "Email Campaigns";
            case "opportunities":
                return "Opportunities";
            case "revenue-prediction":
                return "Revenue Prediction";
            case "contracts":
                return "Contract Management";
            case "breach-monitoring":
                return "Breach Monitoring";
            case "design-travel-offers":
                return "Travel Offers Management";
            case "agent-dashboard":
                return "Agent Dashboard";
            case "support-dashboard":
                return "Support Dashboard";
            case "admin-dashboard":
                return "Admin Dashboard";
            case "ticket-list":
                return "Ticket List";
            case "ticket-kanban":
                return "Workflow Board";
            case "ticket-details":
                return "Ticket Details";
            case "settings":
                return "Settings";
            default:
                return "AI Assistant";
        }
    };
    const getActiveDescription = () => {
        switch (activeSection) {
            case "ai-assistant":
                return "Your intelligent assistant for corporate travel management";
            case "dashboard":
                return "System overview and key metrics";
            case "corporate-search":
                return "AI-powered corporate client discovery and engagement";
            case "lead-management":
                return "Lead pipeline management with qualification tracking";
            case "leads-list":
            case "leads":
                return "Comprehensive lead list with status and suggestions";
            case "all-leads":
                return "Comprehensive lead list with status and suggestions";
            case "qualified-leads":
                return "High-potential leads ready for conversion";
            case "unqualified-leads":
                return "Leads requiring nurturing and re-engagement";
            case "email-campaigns":
                return "Automated email outreach and nurturing campaigns";
            case "opportunities":
                return "Sales pipeline management with deal tracking and forecasting";
            case "revenue-prediction":
                return "AI-powered revenue forecasting and sales predictions";
            case "contracts":
                return "Contract lifecycle management";
            case "breach-monitoring":
                return "Contract breach tracking and risk assessment";
            case "design-travel-offers":
                return "Comprehensive offer lifecycle management with analytics and ATPCO integration";
            case "agent-dashboard":
                return "Agent workspace and performance metrics";
            case "support-dashboard":
                return "Customer support agent dashboard and analytics";
            case "admin-dashboard":
                return "Comprehensive customer support administration and analytics";
            case "ticket-list":
                return "View and manage customer support tickets";
            case "ticket-kanban":
                return "Visual workflow management with drag and drop";
            case "ticket-details":
                return "Detailed ticket view and conversation history";
            case "settings":
                return "System administration and configuration";
            default:
                return "Your intelligent assistant for corporate travel management";
        }
    };
    // Main business menu groups that can be collapsed
    const mainMenuGroups = [
        {
            label: "Highlights",
            items: [
                {
                    id: "ai-assistant",
                    label: "AI Assistant",
                    icon: Bot,
                    description: "Natural language interface",
                },
                {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                    description: "System overview",
                },
            ],
        },
        {
            label: "COINHUB",
            items: [
                {
                    id: "corporate-search",
                    label: "Corporate Search",
                    icon: Search,
                    description: "Find corporate clients",
                },
                {
                    id: "lead-management",
                    label: "Lead Dashboard",
                    icon: Target,
                    description: "Lead pipeline overview",
                },
                {
                    id: "leads-list",
                    label: "All Leads",
                    icon: UsersIcon,
                    description: "Complete lead management",
                },
                // Removed duplicate "All Leads" entry
                // {
                //   id: "qualified-leads",
                //   label: "Qualified Leads",
                //   icon: UserCheck,
                //   description: "High-potential prospects",
                // },
                // {
                //   id: "unqualified-leads",
                //   label: "Unqualified Leads",
                //   icon: UserX,
                //   description: "Nurturing opportunities",
                // },
                {
                    id: "email-campaigns",
                    label: "Email Campaigns",
                    icon: Mail,
                    description: "Automated outreach",
                },
                {
                    id: "opportunities",
                    label: "Opportunities",
                    icon: TrendingUp,
                    description: "Sales pipeline tracking",
                },
            ],
        },
        {
            label: "COCAST",
            subtitle: "Corporate Commercial Analytics & Sales Trend",
            items: [
                {
                    id: "revenue-prediction",
                    label: "Revenue Prediction",
                    icon: Brain,
                    description: "AI revenue forecasting & sales predictions",
                },
            ],
        },
        {
            label: "CONTRAQ",
            items: [
                {
                    id: "contracts",
                    label: "Contracts",
                    icon: FileText,
                    description: "Manage agreements",
                },
                {
                    id: "breach-monitoring",
                    label: "Risk Monitoring",
                    icon: AlertTriangle,
                    description: "Contract compliance",
                },
            ],
        },
        {
            label: "Travel Offers",
            items: [
                {
                    id: "design-travel-offers",
                    label: "Travel Offers",
                    icon: Presentation,
                    description: "Comprehensive offer management & creation",
                },
            ],
        },
    ];
    // Support and system menu groups that are always visible
    const supportMenuGroups = [
        {
            label: "CONVOY",
            items: [
                {
                    id: "agent-dashboard",
                    label: "Agent Dashboard",
                    icon: UserCheck,
                    description: "Agent workspace",
                },
                {
                    id: "ticket-list",
                    label: "Support Tickets",
                    icon: Users,
                    description: "Customer support",
                },
                {
                    id: "admin-dashboard",
                    label: "Admin Dashboard",
                    icon: Shield,
                    description: "System administration",
                },
            ],
        },
        {
            label: "System",
            items: [
                {
                    id: "settings",
                    label: "Settings",
                    icon: SettingsIcon,
                    description: "System configuration",
                },
            ],
        },
    ];
    return (_jsx(TooltipProvider, { children: _jsx(SidebarProvider, { children: _jsxs("div", { className: "min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 flex relative overflow-hidden", children: [_jsx(TourGuide, { isOpen: isTourOpen, onClose: handleTourClose, onComplete: handleTourComplete, steps: getCurrentTourSteps(), tourTitle: getCurrentTourTitle() }), _jsxs(Sidebar, { className: "border-r", "data-sidebar": true, children: [_jsx(SidebarHeader, { className: "border-b border-gray-200 p-4", children: _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: "flex-shrink-0", children: _jsx("img", { src: soarLogo, alt: "SOAR AI - Corporate Intelligence Platform", className: "h-12 w-auto" }) }) }) }), _jsxs(SidebarContent, { className: "space-y-0 bg-[rgba(255,255,255,1)]", children: [mainMenuGroups.map((group, groupIndex) => {
                                        const isExpanded = expandedGroups[group.label];
                                        return (_jsxs(SidebarGroup, { className: groupIndex > 0 ? "mt-1" : "", children: [_jsx(SidebarGroupLabel, { className: "py-0.5 px-2 mb-0.5 cursor-pointer hover:bg-[#EBF6FF] transition-colors rounded-md", onClick: () => toggleGroupExpanded(group.label), "data-slot": "sidebar-group-label", children: _jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsx("div", { className: "flex flex-col", children: _jsx("span", { className: "text-sm leading-tight", children: group.label }) }), isExpanded ? (_jsx(ChevronUp, { className: "h-3 w-3 text-muted-foreground" })) : (_jsx(ChevronDown, { className: "h-3 w-3 text-muted-foreground" }))] }) }), isExpanded && (_jsx(SidebarGroupContent, { "data-slot": "sidebar-group-content", children: _jsx(SidebarMenu, { "data-slot": "sidebar-menu", style: { gap: "var(--sidebar-item-spacing)" }, children: group.items.map((item) => {
                                                            const Icon = item.icon;
                                                            const isActive = activeSection === item.id;
                                                            return (_jsx(SidebarMenuItem, { style: {
                                                                    marginBottom: "var(--sidebar-item-spacing)",
                                                                }, children: _jsxs(SidebarMenuButton, { onClick: () => navigateToSection(item.id), isActive: isActive, className: `w-full justify-start gap-3 ${isActive
                                                                        ? "text-white hover:text-white"
                                                                        : ""}`, style: isActive
                                                                        ? {
                                                                            background: "linear-gradient(360deg, #17376B -17.65%, #2F66C0 155.88%)",
                                                                            borderRadius: "0px 20px 20px 0px",
                                                                        }
                                                                        : {
                                                                            marginTop: "var(--sidebar-button-margin-y)",
                                                                            marginBottom: "var(--sidebar-button-margin-y)",
                                                                        }, "data-slot": "sidebar-menu-button", "data-active": isActive, role: "menuitem", children: [_jsx(Icon, { className: "h-4 w-4 flex-shrink-0" }), _jsxs("div", { className: "flex-1 text-left min-w-0", children: [_jsx("div", { className: "font-medium text-sm truncate leading-tight", children: item.label }), _jsx("div", { className: "text-xs text-muted-foreground truncate leading-tight", style: isActive
                                                                                        ? {
                                                                                            color: "rgba(255, 255, 255, 0.8)",
                                                                                        }
                                                                                        : { color: "#717182" }, children: item.description })] }), (item.id === "qualified-leads" ||
                                                                            item.id === "unqualified-leads" ||
                                                                            item.id === "opportunities" ||
                                                                            item.id === "all-leads") && (_jsx(Badge, { className: "bg-[#FD9646] text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0", style: {
                                                                                backgroundColor: "#FD9646",
                                                                                color: "white",
                                                                                border: "none",
                                                                                marginLeft: "8px",
                                                                            }, children: getBadgeCount(item.id) }))] }) }, item.id));
                                                        }) }) }))] }, group.label));
                                    }), supportMenuGroups.map((group, groupIndex) => (_jsxs(SidebarGroup, { className: "mt-1", children: [_jsx(SidebarGroupLabel, { className: "py-0.5 px-2 mb-0.5", "data-slot": "sidebar-group-label", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm leading-tight", children: group.label }), group.subtitle && (_jsx("span", { className: "text-xs text-muted-foreground font-normal leading-tight", children: group.subtitle }))] }) }), _jsx(SidebarGroupContent, { "data-slot": "sidebar-group-content", children: _jsx(SidebarMenu, { "data-slot": "sidebar-menu", style: { gap: "var(--sidebar-item-spacing)" }, children: group.items.map((item) => {
                                                        const Icon = item.icon;
                                                        const isActive = activeSection === item.id;
                                                        return (_jsx(SidebarMenuItem, { style: {
                                                                marginBottom: "var(--sidebar-item-spacing)",
                                                            }, children: _jsxs(SidebarMenuButton, { onClick: () => navigateToSection(item.id), isActive: isActive, className: `w-full justify-start gap-3 ${isActive ? "text-white hover:text-white" : ""}`, style: isActive
                                                                    ? {
                                                                        background: "linear-gradient(360deg, #17376B -17.65%, #2F66C0 155.88%)",
                                                                        borderRadius: "0px 20px 20px 0px",
                                                                    }
                                                                    : {
                                                                        marginTop: "var(--sidebar-button-margin-y)",
                                                                        marginBottom: "var(--sidebar-button-margin-y)",
                                                                    }, "data-slot": "sidebar-menu-button", "data-active": isActive, role: "menuitem", children: [_jsx(Icon, { className: "h-4 w-4 flex-shrink-0" }), _jsxs("div", { className: "flex-1 text-left min-w-0", children: [_jsx("div", { className: "font-medium text-sm truncate leading-tight", children: item.label }), _jsx("div", { className: "text-xs text-muted-foreground truncate leading-tight", style: isActive
                                                                                    ? { color: "rgba(255, 255, 255, 0.8)" }
                                                                                    : {}, children: item.description })] }), (item.id === "qualified-leads" ||
                                                                        item.id === "unqualified-leads" ||
                                                                        item.id === "opportunities") && (_jsx(Badge, { className: "bg-[#FD9646] text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0", style: {
                                                                            backgroundColor: "#FD9646",
                                                                            color: "white",
                                                                            border: "none",
                                                                            marginLeft: "8px",
                                                                        }, children: getBadgeCount(item.id) }))] }) }, item.id));
                                                    }) }) })] }, group.label)))] })] }), _jsxs(SidebarInset, { className: "flex-1 w-full min-w-0", children: [_jsx("header", { className: "sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm", children: _jsxs("div", { className: "flex h-14 items-center justify-between w-full px-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SidebarTrigger, { className: "lg:hidden" }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm leading-tight", children: getActiveLabel() }), _jsx("p", { className: "text-xs text-muted-foreground leading-tight", children: getActiveDescription() })] }) })] }), _jsxs("div", { className: "flex items-center gap-3", "data-quick-actions": true, children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleTourStart("default"), className: "flex items-center gap-2 hover:bg-[#FD9646]/10 hover:border-[#FD9646]/30 hover:text-[#FD9646] transition-all duration-200", children: [_jsx(MapPin, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Tour Guide" })] }), activeSection === "ai-assistant" && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleTourStart("ai-assistant"), className: "flex items-center gap-1 text-xs hover:bg-[#FD9646]/10 hover:text-[#FD9646]", title: "AI Assistant Tour", children: _jsx(Play, { className: "h-3 w-3" }) })), activeSection === "dashboard" && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleTourStart("dashboard"), className: "flex items-center gap-1 text-xs hover:bg-[#FD9646]/10 hover:text-[#FD9646]", title: "Dashboard Tour", children: _jsx(Play, { className: "h-3 w-3" }) }))] }), _jsxs("div", { className: "flex items-center gap-1 action-buttons", children: [_jsxs(Button, { variant: "ghost", size: "sm", className: "flex items-center gap-1 text-xs hover:bg-[#FD9646]/10 hover:text-[#FD9646]", title: "Create New Lead", children: [_jsx(Plus, { className: "h-3 w-3" }), _jsx("span", { className: "hidden md:inline", children: "Lead" })] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "flex items-center gap-1 text-xs hover:bg-[#FD9646]/10 hover:text-[#FD9646]", title: "Send Email", children: [_jsx(Mail, { className: "h-3 w-3" }), _jsx("span", { className: "hidden md:inline", children: "Email" })] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "flex items-center gap-1 text-xs hover:bg-[#FD9646]/10 hover:text-[#FD9646]", title: "Generate Report", children: [_jsx(BarChart3, { className: "h-3 w-3" }), _jsx("span", { className: "hidden md:inline", children: "Report" })] })] }), activeSection !== "ai-assistant" && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => navigateToSection("ai-assistant"), className: "hidden md:flex items-center gap-2", children: [_jsx(Home, { className: "h-4 w-4" }), "AI Assistant"] })), _jsxs("div", { className: "hidden lg:flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }), _jsx("span", { className: "text-xs text-muted-foreground", children: "All Systems Operational" })] })] })] }) }), _jsxs("main", { className: "w-full min-h-0 flex-1 overflow-auto", style: {
                                    backgroundColor: "#F7FAFF" /* Light blue background matching theme */,
                                    padding: "var(--space-3xl)" /* 16px - using theme spacing */,
                                    fontFamily: "var(--font-family)",
                                    fontSize: "var(--text-lg)" /* 18px - using theme text size */,
                                    lineHeight: "1.4" /* Consistent with theme line-height */,
                                }, children: [activeSection !== "ai-assistant" &&
                                        breadcrumbPath.length > 1 && (_jsx("div", { className: "mb-6", children: _jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { className: "flex items-center gap-1", children: breadcrumbPath.map((pathItem, index) => (_jsx("div", { className: "flex items-center gap-1", children: index < breadcrumbPath.length - 1 ? (_jsxs(_Fragment, { children: [_jsx(BreadcrumbItem, { children: _jsxs(BreadcrumbLink, { onClick: () => navigateToBreadcrumb(index), className: "flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200", style: {
                                                                        fontSize: "var(--text-sm)",
                                                                        fontFamily: "var(--font-family)",
                                                                    }, children: [index === 0 && (_jsx(Home, { className: "h-3 w-3" })), pathItem.label] }) }), _jsx(BreadcrumbSeparator, { className: "text-muted-foreground", children: _jsx(ChevronRight, { className: "h-3 w-3" }) })] })) : (_jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { className: "font-medium text-foreground", style: {
                                                                fontSize: "var(--text-sm)",
                                                                fontFamily: "var(--font-family)",
                                                                fontWeight: "var(--font-weight-medium)",
                                                            }, children: pathItem.label }) })) }, `${pathItem.id}-${index}`))) }) }) })), _jsx("div", { className: "max-w-full mx-auto", style: {
                                            backgroundColor: "transparent" /* Let content define its own background */,
                                            fontFamily: "inherit",
                                            fontSize: "inherit",
                                            lineHeight: "inherit",
                                        }, children: renderContent() })] })] })] }) }) }));
}
