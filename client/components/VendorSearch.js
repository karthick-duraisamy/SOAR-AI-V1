import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { ContractCreation } from './ContractCreation';
import { Search, Filter, Star, MapPin, Users, Calendar, TrendingUp, Award, Globe, Phone, Mail, ExternalLink, Settings2, Building2, HandshakeIcon as Handshake } from 'lucide-react';
const mockVendors = [
    {
        id: 1,
        name: "Global Travel Solutions",
        type: "Travel Agency",
        location: "New York, USA",
        aiScore: 98,
        rating: 4.9,
        experience: 15,
        employees: 250,
        specialties: ["Corporate Travel", "International", "Group Bookings"],
        pricing: "Competitive",
        response: "< 2 hours",
        contracts: 23,
        revenue: 1250000,
        phone: "+1 (555) 123-4567",
        email: "contact@globaltravelsolutions.com",
        website: "www.globaltravelsolutions.com",
        aiRecommendation: "Highly recommended for large-scale corporate travel programs. Excellent track record and competitive pricing.",
        compliance: 95,
        financialStability: 98,
        passengerVolume: "50K-100K",
        specialization: ["Business", "Group"],
        iataAccredited: true,
        technologyCapability: ["GDS", "Direct API"],
        marketReach: "Global",
        growthPotential: "High",
        creditProfile: "Excellent",
        certifications: ["ISO 9001", "GDPR", "PCI DSS"]
    },
    {
        id: 2,
        name: "Corporate Journey Ltd",
        type: "Corporate Travel",
        location: "London, UK",
        aiScore: 95,
        rating: 4.8,
        experience: 12,
        employees: 180,
        specialties: ["Executive Travel", "Event Management", "Cost Optimization"],
        pricing: "Premium",
        response: "< 1 hour",
        contracts: 18,
        revenue: 980000,
        phone: "+44 20 7123 4567",
        email: "info@corporatejourney.co.uk",
        website: "www.corporatejourney.co.uk",
        aiRecommendation: "Perfect for premium executive travel requirements. Outstanding service quality and rapid response times.",
        compliance: 92,
        financialStability: 94,
        passengerVolume: "25K-50K",
        specialization: ["Business", "MICE"],
        iataAccredited: true,
        technologyCapability: ["GDS", "Direct API", "Mobile App"],
        marketReach: "Regional",
        growthPotential: "Medium",
        creditProfile: "Good",
        certifications: ["ISO 9001", "GDPR"]
    },
    {
        id: 3,
        name: "Elite Business Travel",
        type: "Travel Agency",
        location: "Singapore",
        aiScore: 92,
        rating: 4.7,
        experience: 10,
        employees: 120,
        specialties: ["Asia-Pacific", "Leisure Travel", "Technology Integration"],
        pricing: "Competitive",
        response: "< 3 hours",
        contracts: 15,
        revenue: 750000,
        phone: "+65 6123 4567",
        email: "hello@elitebusinesstravel.sg",
        website: "www.elitebusinesstravel.sg",
        aiRecommendation: "Excellent choice for Asia-Pacific operations. Strong technology platform and regional expertise.",
        compliance: 89,
        financialStability: 91,
        passengerVolume: "10K-25K",
        specialization: ["Leisure", "Business"],
        iataAccredited: true,
        technologyCapability: ["GDS", "Mobile App"],
        marketReach: "Regional",
        growthPotential: "High",
        creditProfile: "Good",
        certifications: ["ISO 9001", "PCI DSS"]
    },
    {
        id: 4,
        name: "Premier Voyage Group",
        type: "Travel Management",
        location: "Dubai, UAE",
        aiScore: 89,
        rating: 4.6,
        experience: 8,
        employees: 95,
        specialties: ["Middle East", "Luxury Travel", "VIP Services"],
        pricing: "Premium",
        response: "< 4 hours",
        contracts: 12,
        revenue: 620000,
        phone: "+971 4 123 4567",
        email: "contact@premiervoyage.ae",
        website: "www.premiervoyage.ae",
        aiRecommendation: "Ideal for Middle East operations and luxury travel requirements. Strong regional presence.",
        compliance: 87,
        financialStability: 88,
        passengerVolume: "5K-10K",
        specialization: ["Leisure", "VIP"],
        iataAccredited: false,
        technologyCapability: ["GDS"],
        marketReach: "Regional",
        growthPotential: "Medium",
        creditProfile: "Fair",
        certifications: ["GDPR"]
    }
];
export function VendorSearch({ initialFilters, onNavigate }) {
    const [searchParams, setSearchParams] = useState({
        serviceType: '',
        location: '',
        budget: '',
        timeline: '',
        specialRequirements: '',
        ...initialFilters
    });
    const [advancedFilters, setAdvancedFilters] = useState({
        passengerVolume: '',
        specialization: [],
        pastAirlineSales: '',
        iataAccreditation: '',
        technologyCapability: [],
        marketReach: '',
        growthPotential: '',
        creditProfile: '',
        certifications: []
    });
    const [filteredVendors, setFilteredVendors] = useState(mockVendors);
    const [isSearching, setIsSearching] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showContractCreation, setShowContractCreation] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const handleSearch = async () => {
        setIsSearching(true);
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFilteredVendors(mockVendors);
        setIsSearching(false);
    };
    const handleInitiateContract = (vendor) => {
        setSelectedVendor(vendor);
        setShowContractCreation(true);
    };
    const handleBackToSearch = () => {
        setShowContractCreation(false);
        setSelectedVendor(null);
    };
    const applyAdvancedFilters = () => {
        // Apply advanced filtering logic here
        console.log('Applying advanced filters:', advancedFilters);
        setShowAdvancedFilters(false);
    };
    const resetAdvancedFilters = () => {
        setAdvancedFilters({
            passengerVolume: '',
            specialization: [],
            pastAirlineSales: '',
            iataAccreditation: '',
            technologyCapability: [],
            marketReach: '',
            growthPotential: '',
            creditProfile: '',
            certifications: []
        });
    };
    const handleSpecializationChange = (value, checked) => {
        setAdvancedFilters(prev => ({
            ...prev,
            specialization: checked
                ? [...prev.specialization, value]
                : prev.specialization.filter(item => item !== value)
        }));
    };
    const handleTechnologyChange = (value, checked) => {
        setAdvancedFilters(prev => ({
            ...prev,
            technologyCapability: checked
                ? [...prev.technologyCapability, value]
                : prev.technologyCapability.filter(item => item !== value)
        }));
    };
    const handleCertificationChange = (value, checked) => {
        setAdvancedFilters(prev => ({
            ...prev,
            certifications: checked
                ? [...prev.certifications, value]
                : prev.certifications.filter(item => item !== value)
        }));
    };
    const getScoreColor = (score) => {
        if (score >= 95)
            return "text-green-600";
        if (score >= 90)
            return "text-blue-600";
        if (score >= 85)
            return "text-yellow-600";
        return "text-gray-600";
    };
    const getScoreBadge = (score) => {
        if (score >= 95)
            return "default";
        if (score >= 90)
            return "secondary";
        return "outline";
    };
    // Show ContractCreation if it's active
    if (showContractCreation && selectedVendor) {
        return (_jsx(ContractCreation, { vendorData: selectedVendor, onNavigate: onNavigate, onBack: handleBackToSearch }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Search, { className: "h-5 w-5" }), "Vendor Search Parameters"] }), _jsx(CardDescription, { children: "Define your requirements to get AI-powered vendor recommendations" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "serviceType", children: "Service Type" }), _jsxs(Select, { value: searchParams.serviceType, onValueChange: (value) => setSearchParams({ ...searchParams, serviceType: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select service type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "travel-agency", children: "Travel Agency" }), _jsx(SelectItem, { value: "corporate-travel", children: "Corporate Travel" }), _jsx(SelectItem, { value: "travel-management", children: "Travel Management" }), _jsx(SelectItem, { value: "ground-services", children: "Ground Services" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "location", children: "Preferred Location" }), _jsxs(Select, { value: searchParams.location, onValueChange: (value) => setSearchParams({ ...searchParams, location: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select location" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "north-america", children: "North America" }), _jsx(SelectItem, { value: "europe", children: "Europe" }), _jsx(SelectItem, { value: "asia-pacific", children: "Asia Pacific" }), _jsx(SelectItem, { value: "middle-east", children: "Middle East" }), _jsx(SelectItem, { value: "global", children: "Global Coverage" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "budget", children: "Budget Range" }), _jsxs(Select, { value: searchParams.budget, onValueChange: (value) => setSearchParams({ ...searchParams, budget: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select budget range" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "under-500k", children: "Under $500K" }), _jsx(SelectItem, { value: "500k-1m", children: "$500K - $1M" }), _jsx(SelectItem, { value: "1m-5m", children: "$1M - $5M" }), _jsx(SelectItem, { value: "above-5m", children: "Above $5M" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "timeline", children: "Implementation Timeline" }), _jsxs(Select, { value: searchParams.timeline, onValueChange: (value) => setSearchParams({ ...searchParams, timeline: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select timeline" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "immediate", children: "Immediate (1-2 weeks)" }), _jsx(SelectItem, { value: "short", children: "Short term (1-3 months)" }), _jsx(SelectItem, { value: "medium", children: "Medium term (3-6 months)" }), _jsx(SelectItem, { value: "long", children: "Long term (6+ months)" })] })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { htmlFor: "specialRequirements", children: "Special Requirements" }), _jsx(Input, { id: "specialRequirements", placeholder: "e.g., 24/7 support, specific certifications, language requirements", value: searchParams.specialRequirements, onChange: (e) => setSearchParams({ ...searchParams, specialRequirements: e.target.value }) })] })] }), _jsxs("div", { className: "flex gap-4 mt-6", children: [_jsx(Button, { onClick: handleSearch, disabled: isSearching, className: "flex items-center gap-2", children: isSearching ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "AI Processing..."] })) : (_jsxs(_Fragment, { children: [_jsx(Search, { className: "h-4 w-4" }), "Search Vendors"] })) }), _jsxs(Dialog, { open: showAdvancedFilters, onOpenChange: setShowAdvancedFilters, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4" }), "Advanced Filters"] }) }), _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Settings2, { className: "h-5 w-5" }), "Advanced Vendor Filtering Criteria"] }), _jsx(DialogDescription, { children: "Apply detailed criteria to find vendors that best match your specific requirements" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { children: "Passenger Volume (Monthly/Annual Count)" }), _jsxs(Select, { value: advancedFilters.passengerVolume, onValueChange: (value) => setAdvancedFilters({ ...advancedFilters, passengerVolume: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select passenger volume range" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "under-5k", children: "Under 5K" }), _jsx(SelectItem, { value: "5k-10k", children: "5K - 10K" }), _jsx(SelectItem, { value: "10k-25k", children: "10K - 25K" }), _jsx(SelectItem, { value: "25k-50k", children: "25K - 50K" }), _jsx(SelectItem, { value: "50k-100k", children: "50K - 100K" }), _jsx(SelectItem, { value: "above-100k", children: "Above 100K" })] })] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Average or forecasted number of passengers they handle/book" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Specialization" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mt-2", children: ['Leisure', 'Business', 'Group', 'MICE'].map((spec) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `spec-${spec}`, checked: advancedFilters.specialization.includes(spec), onCheckedChange: (checked) => handleSpecializationChange(spec, checked) }), _jsx(Label, { htmlFor: `spec-${spec}`, className: "text-sm", children: spec })] }, spec))) }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The segment they primarily operate in" })] })] }), _jsxs(DialogFooter, { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", onClick: resetAdvancedFilters, children: "Reset Filters" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setShowAdvancedFilters(false), children: "Cancel" }), _jsx(Button, { onClick: applyAdvancedFilters, children: "Apply Filters" })] })] })] })] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Award, { className: "h-5 w-5" }), "AI-Ranked Vendor Recommendations"] }), _jsxs(Badge, { variant: "secondary", children: [filteredVendors.length, " vendors found"] })] }), _jsx(CardDescription, { children: "Vendors ranked by AI algorithm based on your specific requirements" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-6", children: filteredVendors.map((vendor, index) => (_jsx(Card, { className: "relative", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold", children: ["#", index + 1] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: vendor.name }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3 w-3" }), vendor.location] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "h-3 w-3" }), vendor.employees, " employees"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), vendor.experience, " years"] })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs(Badge, { variant: getScoreBadge(vendor.aiScore), children: ["AI Score: ", vendor.aiScore, "/100"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400" }), _jsx("span", { className: "font-medium", children: vendor.rating })] })] }), _jsx(Progress, { value: vendor.aiScore, className: "w-24" })] })] }), _jsxs(Tabs, { defaultValue: "overview", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-5", children: [_jsx(TabsTrigger, { value: "overview", children: "Overview" }), _jsx(TabsTrigger, { value: "metrics", children: "Metrics" }), _jsx(TabsTrigger, { value: "capabilities", children: "Capabilities" }), _jsx(TabsTrigger, { value: "contact", children: "Contact" }), _jsx(TabsTrigger, { value: "ai-analysis", children: "AI Analysis" })] }), _jsxs(TabsContent, { value: "overview", className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Service Type" }), _jsx("p", { className: "font-medium", children: vendor.type })] }), _jsxs("div", { children: [_jsx(Label, { children: "Pricing Model" }), _jsx("p", { className: "font-medium", children: vendor.pricing })] }), _jsxs("div", { children: [_jsx(Label, { children: "Response Time" }), _jsx("p", { className: "font-medium", children: vendor.response })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Specialties" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: vendor.specialties.map((specialty) => (_jsx(Badge, { variant: "outline", children: specialty }, specialty))) })] })] }), _jsx(TabsContent, { value: "metrics", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [vendor.compliance, "%"] }), _jsx(Label, { className: "text-xs", children: "Compliance Score" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [vendor.financialStability, "%"] }), _jsx(Label, { className: "text-xs", children: "Financial Stability" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: vendor.contracts }), _jsx(Label, { className: "text-xs", children: "Active Contracts" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", (vendor.revenue / 1000).toFixed(0), "K"] }), _jsx(Label, { className: "text-xs", children: "Annual Revenue" })] })] }) }), _jsx(TabsContent, { value: "capabilities", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { children: "Technology Capabilities" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: vendor.technologyCapability.map((tech) => (_jsx(Badge, { variant: "secondary", children: tech }, tech))) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Certifications" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: vendor.certifications.map((cert) => (_jsx(Badge, { variant: "outline", children: cert }, cert))) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Market Reach" }), _jsx("p", { className: "font-medium", children: vendor.marketReach })] }), _jsxs("div", { children: [_jsx(Label, { children: "IATA Accredited" }), _jsx(Badge, { variant: vendor.iataAccredited ? "default" : "outline", children: vendor.iataAccredited ? "Yes" : "No" })] })] }) }), _jsx(TabsContent, { value: "contact", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Phone, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { children: "Phone" }), _jsx("p", { className: "font-medium", children: vendor.phone })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { children: "Email" }), _jsx("p", { className: "font-medium", children: vendor.email })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Globe, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { children: "Website" }), _jsx("a", { href: `https://${vendor.website}`, className: "font-medium text-blue-600 hover:underline", target: "_blank", rel: "noopener noreferrer", children: vendor.website })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Building2, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx(Label, { children: "Location" }), _jsx("p", { className: "font-medium", children: vendor.location })] })] })] }) }), _jsxs(TabsContent, { value: "ai-analysis", className: "space-y-4", children: [_jsx("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-blue-200", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 bg-blue-500 rounded-lg", children: _jsx(TrendingUp, { className: "h-4 w-4 text-white" }) }), _jsxs("div", { children: [_jsx(Label, { className: "text-blue-800 font-semibold", children: "AI Recommendation" }), _jsx("p", { className: "text-blue-700 mt-1", children: vendor.aiRecommendation })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Growth Potential" }), _jsx(Badge, { variant: vendor.growthPotential === 'High' ? 'default' : 'secondary', children: vendor.growthPotential })] }), _jsxs("div", { children: [_jsx(Label, { children: "Credit Profile" }), _jsx(Badge, { variant: vendor.creditProfile === 'Excellent' ? 'default' : 'outline', children: vendor.creditProfile })] }), _jsxs("div", { children: [_jsx(Label, { children: "Passenger Volume" }), _jsx("p", { className: "font-medium", children: vendor.passengerVolume })] })] })] })] }), _jsx(Separator, { className: "my-4" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "outline", className: "flex items-center gap-1", children: [_jsx(TrendingUp, { className: "h-3 w-3" }), "Rank #", index + 1] }), _jsxs(Badge, { variant: getScoreBadge(vendor.aiScore), children: [vendor.aiScore, "/100 Match"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-1" }), "View Profile"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Mail, { className: "h-4 w-4 mr-1" }), "Contact"] }), _jsxs(Button, { size: "sm", onClick: () => handleInitiateContract(vendor), className: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700", children: [_jsx(Handshake, { className: "h-4 w-4 mr-1" }), "Initiate Contract"] })] })] })] }) }, vendor.id))) }) })] })] }));
}
