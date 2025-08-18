import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { CorporateProfile } from './CorporateProfile';
import { useCompanyApi } from '../hooks/api/useCompanyApi';
import { Search, Filter, Star, MapPin, Users, Calendar, Globe, Phone, Mail, Building2, Eye, DollarSign, Target, Activity, Plane, Clock, Shield, Brain, AlertCircle, X, UserPlus, Plus, Save, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
// Import useDebounce hook
import { useDebounce } from '../hooks/useDebounce';
// API utility functions
const transformCompanyData = (company) => {
    // Transform backend data to match frontend expectations
    return {
        id: company.id,
        name: company.name,
        type: getCompanyTypeDisplay(company.company_type || company.size),
        industry: getIndustryDisplay(company.industry),
        location: company.location,
        aiScore: Math.floor(Math.random() * 20) + 80, // Random AI score for demo
        rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
        established: company.year_established || (company.created_at ? new Date(company.created_at).getFullYear() : 2020),
        employees: company.employee_count || Math.floor(Math.random() * 5000) + 100,
        specialties: company.specialties ? company.specialties.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : ["Business Services", "Corporate Solutions"],
        travelBudget: company.travel_budget ? `${(company.travel_budget / 1000000).toFixed(1)}M` : "1.0M",
        annualTravelVolume: company.annual_travel_volume || `${Math.floor(Math.random() * 5000) + 1000} trips`,
        contracts: Math.floor(Math.random() * 20) + 1,
        revenue: company.annual_revenue || Math.floor(Math.random() * 50000000) + 10000000,
        phone: company.phone || "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
        email: company.email || `contact@${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        website: company.website || `www.${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        aiRecommendation: generateAIRecommendation(company),
        compliance: Math.floor(Math.random() * 20) + 80,
        financialStability: Math.floor(Math.random() * 20) + 80,
        travelFrequency: company.travel_frequency || getRandomTravelFrequency(),
        destinations: getRandomDestinations(),
        preferredClass: company.preferred_class || getRandomPreferredClass(),
        teamSize: Math.floor((company.employee_count || 1000) * 0.1),
        travelManagers: Math.floor(Math.random() * 5) + 1,
        currentAirlines: company.current_airlines ? company.current_airlines.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : getRandomAirlines(),
        paymentTerms: company.payment_terms || getRandomPaymentTerms(),
        creditRating: company.credit_rating || getRandomCreditRating(),
        sustainabilityFocus: company.sustainability_focus || getRandomSustainabilityFocus(),
        technologyIntegration: company.technology_integration ? company.technology_integration.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : getRandomTechIntegration(),
        seasonality: getRandomSeasonality(),
        meetingTypes: getRandomMeetingTypes(),
        companySize: getSizeDisplay(company.size),
        marketSegment: getIndustryDisplay(company.industry),
        decisionMakers: Math.floor(Math.random() * 8) + 2,
        contractValue: Math.floor(Math.random() * 3000000) + 500000,
        competitorAirlines: Math.floor(Math.random() * 5) + 1,
        loyaltyPotential: Math.floor(Math.random() * 30) + 70,
        expansionPlans: company.expansion_plans || getRandomExpansionPlans(),
        riskLevel: company.risk_level || getRandomRiskLevel()
    };
};
// Helper functions
const getCompanyTypeDisplay = (size) => {
    const types = {
        startup: "Startup Company",
        small: "Small Business",
        medium: "Medium Corporation",
        large: "Large Corporation",
        enterprise: "Enterprise Corporation",
        corporation: "Corporation",
        llc: "LLC",
        partnership: "Partnership",
        nonprofit: "Non-Profit"
    };
    return types[size] || "Corporation";
};
const getIndustryDisplay = (industry) => {
    const industries = {
        technology: "Technology & Software",
        finance: "Finance & Banking",
        healthcare: "Healthcare",
        manufacturing: "Manufacturing",
        retail: "Retail & Consumer",
        consulting: "Consulting Services",
        telecommunications: "Telecommunications",
        energy: "Energy & Utilities",
        transportation: "Transportation & Logistics",
        education: "Education",
        government: "Government",
        other: "Other"
    };
    return industries[industry] || "Business Services";
};
const getSizeDisplay = (size) => {
    const sizes = {
        startup: "Startup",
        small: "Small",
        medium: "Medium",
        large: "Large",
        enterprise: "Enterprise"
    };
    return sizes[size] || "Medium";
};
const generateAIRecommendation = (company) => {
    const recommendations = [
        "High-potential corporate client with strong growth indicators. Excellent opportunity for partnership.",
        "Established company with consistent business patterns. Good candidate for long-term contracts.",
        "Growing organization with expanding travel needs. Consider volume-based pricing strategies.",
        "Premium client with sophisticated requirements. Focus on high-service offerings.",
        "Cost-conscious organization seeking value. Emphasize efficiency and competitive pricing."
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
};
const getRandomTravelFrequency = () => {
    const frequencies = ["Daily", "Weekly", "Monthly", "Bi-weekly", "Quarterly"];
    return frequencies[Math.floor(Math.random() * frequencies.length)];
};
const getRandomDestinations = () => {
    const destinations = [
        ["North America", "Europe"],
        ["Global", "Asia-Pacific", "Europe"],
        ["North America", "Asia-Pacific"],
        ["Domestic", "Regional"],
        ["Global", "Emerging Markets"]
    ];
    return destinations[Math.floor(Math.random() * destinations.length)];
};
const getRandomPreferredClass = () => {
    const classes = ["Economy", "Economy Plus", "Business", "First", "Business/First"];
    return classes[Math.floor(Math.random() * classes.length)];
};
const getRandomAirlines = () => {
    const airlines = [
        ["United", "Delta"],
        ["American", "Southwest"],
        ["Emirates", "Singapore Airlines"],
        ["British Airways", "Lufthansa"],
        ["Air France", "KLM"]
    ];
    return airlines[Math.floor(Math.random() * airlines.length)];
};
const getRandomPaymentTerms = () => {
    const terms = ["Net 15", "Net 30", "Net 45", "Net 60"];
    return terms[Math.floor(Math.random() * terms.length)];
};
const getRandomCreditRating = () => {
    const ratings = ["AAA", "AA", "A", "BBB", "A+"];
    return ratings[Math.floor(Math.random() * ratings.length)];
};
const getRandomSustainabilityFocus = () => {
    const focus = ["Very High", "High", "Medium", "Low"];
    return focus[Math.floor(Math.random() * focus.length)];
};
const getRandomTechIntegration = () => {
    const tech = [
        ["API", "Mobile App"],
        ["GDS", "Corporate Portal"],
        ["API", "Real-time Booking"],
        ["Mobile App", "Expense Management"],
        ["Corporate Portal", "Reporting"]
    ];
    return tech[Math.floor(Math.random() * tech.length)];
};
const getRandomSeasonality = () => {
    const patterns = ["Year-round", "Q1/Q3 Heavy", "Spring/Summer Peak", "Holiday Heavy"];
    return patterns[Math.floor(Math.random() * patterns.length)];
};
const getRandomMeetingTypes = () => {
    const types = [
        ["Business Meetings", "Conferences"],
        ["Client Visits", "Trade Shows"],
        ["Team Offsites", "Training"],
        ["Site Visits", "Regulatory Meetings"]
    ];
    return types[Math.floor(Math.random() * types.length)];
};
const getRandomExpansionPlans = () => {
    const plans = ["Aggressive", "Moderate", "Conservative", "Rapid", "Stable"];
    return plans[Math.floor(Math.random() * plans.length)];
};
const getRandomRiskLevel = () => {
    const risks = ["Very Low", "Low", "Medium", "High"];
    return risks[Math.floor(Math.random() * risks.length)];
};
export function CorporateSearch({ initialFilters, onNavigate }) {
    const [searchParams, setSearchParams] = useState({
        industry: '',
        location: '',
        travelBudget: '',
        companySize: '',
        travelFrequency: '',
        globalSearch: '',
        ...initialFilters
    });
    // Debounce search parameters
    const debouncedSearchParams = useDebounce(searchParams, 500); // 500ms debounce delay
    // Initialize company API hook
    const companyApi = useCompanyApi();
    const [filteredCorporates, setFilteredCorporates] = useState([]);
    const [displayedCorporates, setDisplayedCorporates] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showCorporateProfile, setShowCorporateProfile] = useState(false);
    const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
    const [error, setError] = useState('');
    // Sort, Filter, and Pagination states
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [nameFilter, setNameFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    // Advanced filter states
    const [advancedFilters, setAdvancedFilters] = useState({
        industries: [],
        maturity: [],
        employeeRange: [100, 10000],
        travelFrequency: '',
        preferredClass: '',
        annualTravelVolume: [100, 20000],
        revenueRange: '',
        creditRating: '',
        travelBudgetRange: [0.5, 10],
        techRequirements: [],
        sustainabilityLevel: ''
    });
    const [selectedCorporate, setSelectedCorporate] = useState(null);
    const [movedAsLeadIds, setMovedAsLeadIds] = useState(new Set());
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // New company form state
    const [newCompany, setNewCompany] = useState({
        name: '',
        type: '',
        industry: '',
        location: '',
        website: '',
        phone: '',
        email: '',
        established: '',
        employees: '',
        revenue: '',
        travelBudget: '',
        annualTravelVolume: '',
        travelFrequency: '',
        preferredClass: '',
        companySize: '',
        creditRating: '',
        paymentTerms: '',
        sustainabilityFocus: '',
        riskLevel: '',
        expansionPlans: '',
        specialties: '',
        technologyIntegration: '',
        currentAirlines: '',
        notes: ''
    });
    const [contactForm, setContactForm] = useState({
        method: 'Email',
        subject: '',
        message: '',
        followUpDate: '',
        corporateData: null
    });
    const [showContactDialog, setShowContactDialog] = useState(false);
    const loadCompanies = useCallback(async (filters = {}) => {
        setIsLoading(true);
        setError('');
        try {
            const companies = await companyApi.searchCompanies(filters);
            const transformedCompanies = companies.map(transformCompanyData);
            console.log(companies, 'companies');
            setFilteredCorporates(transformedCompanies);
            applyFiltersAndSort(transformedCompanies);
        }
        catch (error) {
            console.error('Error loading companies:', error);
            setError('Failed to load companies. Please try again.');
            setFilteredCorporates([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []); // Remove companyApi dependency to prevent recreation
    // Load companies on component mount - use a separate effect with direct API call
    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);
            setError('');
            try {
                const companies = await companyApi.searchCompanies({});
                const transformedCompanies = companies.map(transformCompanyData);
                setFilteredCorporates(transformedCompanies);
                applyFiltersAndSort(transformedCompanies);
                console.log(companies, 'companies');
            }
            catch (error) {
                console.error('Error loading companies:', error);
                setError('Failed to load companies. Please try again.');
                setFilteredCorporates([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        initialLoad();
    }, []); // Only run once on mount
    // Optimize handleSearch to prevent duplicate calls
    const handleSearch = useCallback(async () => {
        // Prevent multiple simultaneous searches
        if (isSearching) {
            return;
        }
        setIsSearching(true);
        setError('');
        try {
            // Merge basic search params with advanced filters
            const mergedFilters = {
                ...searchParams, // Use searchParams directly instead of debouncedSearchParams
                ...advancedFilters
            };
            // Call the API directly instead of through loadCompanies to avoid dependency issues
            const companies = await companyApi.searchCompanies(mergedFilters);
            const transformedCompanies = companies.map(transformCompanyData);
            setFilteredCorporates(transformedCompanies);
            applyFiltersAndSort(transformedCompanies);
        }
        catch (error) {
            console.error('Error searching companies:', error);
            setError('Search failed. Please try again.');
            setFilteredCorporates([]);
        }
        finally {
            setIsSearching(false);
        }
    }, [isSearching, searchParams, advancedFilters]); // Use searchParams instead of debouncedSearchParams
    const handleViewProfile = (corporate) => {
        setSelectedCorporate(corporate);
        setShowCorporateProfile(true);
    };
    // Sort and filter logic
    const applyFiltersAndSort = useCallback((companies) => {
        let filtered = [...companies];
        // Apply name filter
        if (nameFilter.trim()) {
            filtered = filtered.filter(company => company.name.toLowerCase().includes(nameFilter.toLowerCase()));
        }
        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'aiScore':
                    comparison = a.aiScore - b.aiScore;
                    break;
                case 'rating':
                    comparison = parseFloat(a.rating) - parseFloat(b.rating);
                    break;
                case 'employees':
                    comparison = a.employees - b.employees;
                    break;
                case 'revenue':
                    comparison = a.revenue - b.revenue;
                    break;
                case 'established':
                    comparison = a.established - b.established;
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        // Calculate pagination
        const totalItems = filtered.length;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(calculatedTotalPages);
        // Reset to page 1 if current page exceeds total pages
        const validCurrentPage = currentPage > calculatedTotalPages ? 1 : currentPage;
        if (validCurrentPage !== currentPage) {
            setCurrentPage(validCurrentPage);
        }
        // Apply pagination
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCompanies = filtered.slice(startIndex, endIndex);
        setDisplayedCorporates(paginatedCompanies);
    }, [nameFilter, sortBy, sortOrder, currentPage, itemsPerPage]);
    // Effect to reapply filters when dependencies change
    useEffect(() => {
        if (filteredCorporates.length > 0) {
            applyFiltersAndSort(filteredCorporates);
        }
    }, [filteredCorporates, applyFiltersAndSort]);
    const handleSortChange = (newSortBy) => {
        if (newSortBy === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
        setCurrentPage(1); // Reset to first page when sorting changes
    };
    const handleNameFilterChange = (value) => {
        setNameFilter(value);
        setCurrentPage(1); // Reset to first page when filter changes
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleClearFilters = () => {
        // Reset search parameters
        setSearchParams({
            industry: '',
            location: '',
            travelBudget: '',
            companySize: '',
            travelFrequency: '',
            globalSearch: ''
        });
        // Reset advanced filters
        setAdvancedFilters({
            industries: [],
            maturity: [],
            employeeRange: [100, 10000],
            travelFrequency: '',
            preferredClass: '',
            annualTravelVolume: [100, 20000],
            revenueRange: '',
            creditRating: '',
            travelBudgetRange: [0.5, 10],
            techRequirements: [],
            sustainabilityLevel: ''
        });
        // Reset sort and filter states
        setNameFilter('');
        setSortBy('name');
        setSortOrder('asc');
        setCurrentPage(1);
        // Reload companies with no filters
        loadCompanies({});
    };
    const handleMoveAsLead = async (corporate) => {
        try {
            // Prepare the lead data in the format expected by the Django backend
            const leadData = {
                company: {
                    name: corporate.name,
                    industry: corporate.industry === 'Technology & Software' ? 'technology' :
                        corporate.industry === 'Finance & Banking' ? 'finance' :
                            corporate.industry === 'Business Services' ? 'consulting' : 'other',
                    location: corporate.location,
                    size: corporate.companySize?.toLowerCase() || 'medium',
                    annual_revenue: corporate.revenue || null,
                    travel_budget: corporate.contractValue || null,
                    employee_count: corporate.employees || null
                },
                contact: {
                    first_name: 'Contact', // Default contact info - would be better to get from user input
                    last_name: 'Person',
                    email: corporate.email,
                    phone: corporate.phone || '',
                    position: 'Decision Maker',
                    is_decision_maker: true
                },
                status: 'new',
                source: 'corporate_search',
                priority: corporate.aiScore >= 80 ? 'high' : corporate.aiScore >= 60 ? 'medium' : 'low',
                score: corporate.aiScore,
                estimated_value: corporate.contractValue || null,
                notes: `Moved from corporate search. AI Score: ${corporate.aiScore}. ${corporate.aiRecommendation}. Specialties: ${corporate.specialties?.join(', ') || 'N/A'}. Travel Frequency: ${corporate.travelFrequency || 'N/A'}. Preferred Class: ${corporate.preferredClass || 'N/A'}.`
            };
            // Call the API to create the lead
            const createdLead = await companyApi.createLead(leadData);
            // Add to moved leads tracking
            setMovedAsLeadIds(prev => new Set([...prev, corporate.id]));
            // Show success message
            setSuccessMessage(`${corporate.name} has been successfully moved to leads management`);
            setTimeout(() => setSuccessMessage(''), 5000);
            // Navigate to leads if onNavigate is available
            if (onNavigate) {
                onNavigate('leads-list', {
                    message: `${corporate.name} has been successfully moved to leads management`
                });
            }
        }
        catch (error) {
            console.error('Error moving corporate as lead:', error);
            setSuccessMessage(`Error: Failed to move ${corporate.name} as lead. Please try again.`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };
    const handleBackToSearch = () => {
        setShowCorporateProfile(false);
        setSelectedCorporate(null);
    };
    const handleAddCompany = async () => {
        setIsSubmitting(true);
        setSuccessMessage('');
        try {
            // Map frontend fields to Django model fields - include ALL form sections
            const companyData = {
                // Basic Info
                name: newCompany.name,
                company_type: newCompany.type,
                industry: newCompany.industry,
                location: newCompany.location,
                email: newCompany.email,
                phone: newCompany.phone,
                website: newCompany.website || '',
                // Business Details
                employee_count: newCompany.employees ? parseInt(newCompany.employees) : null,
                annual_revenue: newCompany.revenue ? parseFloat(newCompany.revenue) * 1000000 : null, // Convert millions to actual amount
                year_established: newCompany.established ? parseInt(newCompany.established) : null,
                size: newCompany.companySize,
                credit_rating: newCompany.creditRating,
                payment_terms: newCompany.paymentTerms,
                // Travel Profile
                travel_budget: newCompany.travelBudget ? parseFloat(newCompany.travelBudget) * 1000000 : null, // Convert millions to actual amount
                annual_travel_volume: newCompany.annualTravelVolume,
                travel_frequency: newCompany.travelFrequency,
                preferred_class: newCompany.preferredClass,
                sustainability_focus: newCompany.sustainabilityFocus,
                risk_level: newCompany.riskLevel,
                current_airlines: newCompany.currentAirlines,
                // Additional Info
                expansion_plans: newCompany.expansionPlans,
                specialties: newCompany.specialties,
                technology_integration: newCompany.technologyIntegration,
                description: newCompany.notes || ''
            };
            console.log('Sending company data:', companyData);
            const savedCompany = await companyApi.createCompany(companyData);
            // Reset form
            setNewCompany({
                name: '',
                type: '',
                industry: '',
                location: '',
                website: '',
                phone: '',
                email: '',
                established: '',
                employees: '',
                revenue: '',
                travelBudget: '',
                annualTravelVolume: '',
                travelFrequency: '',
                preferredClass: '',
                companySize: '',
                creditRating: '',
                paymentTerms: '',
                sustainabilityFocus: '',
                riskLevel: '',
                expansionPlans: '',
                specialties: '',
                technologyIntegration: '',
                currentAirlines: '',
                notes: ''
            });
            setShowAddCompanyDialog(false);
            setSuccessMessage(`${newCompany.name} has been successfully added to the corporate database.`);
            // Refresh the companies list to show the new company
            try {
                const companies = await companyApi.searchCompanies(searchParams);
                const transformedCompanies = companies.map(transformCompanyData);
                setFilteredCorporates(transformedCompanies);
                applyFiltersAndSort(transformedCompanies);
            }
            catch (refreshError) {
                console.error('Error refreshing companies list:', refreshError);
            }
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        catch (error) {
            console.error('Error saving company:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save company';
            setSuccessMessage(`Error: ${errorMessage}`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const isFormValid = () => {
        return newCompany.name.trim() !== '' &&
            newCompany.industry !== '' &&
            newCompany.companySize !== '' &&
            newCompany.location.trim() !== '' &&
            newCompany.email.trim() !== '';
    };
    // Show specific components based on state
    if (showCorporateProfile && selectedCorporate) {
        return (_jsx(Dialog, { open: showCorporateProfile, onOpenChange: setShowCorporateProfile, children: _jsx(DialogContent, { className: "max-w-2xl  cls-corporate-profile", children: _jsx("div", { className: "mt-4 max-h-[90vh] overflow-y-auto", children: _jsx(CorporateProfile, { corporateData: selectedCorporate, onBack: handleBackToSearch }) }) }) }));
    }
    // Function to open dialog for contacting a lead
    const handleContactCorporate = (corporate) => {
        setContactForm({
            method: 'Email',
            subject: `Partnership Opportunity - ${corporate.name}`,
            message: `Hi ,

        I hope this message finds you well. I wanted to follow up regarding our corporate travel solutions that could benefit ${corporate.name}.

        Based on your organization's profile, I believe we can help optimize your travel operations and reduce costs.

        Would you be available for a brief call this week to discuss how we can support your travel needs?

        Best regards,
        SOAR-AI Team`,
            followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            corporateData: corporate
        });
        setShowContactDialog(true);
    };
    return (_jsxs("div", { className: "w-full h-full bg-gray-50 p-6", children: [successMessage && (_jsxs(Alert, { className: "bg-green-50 border-green-200 mb-4", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }), _jsx(AlertDescription, { className: "text-green-800", children: successMessage })] })), _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Search, { className: "h-6 w-6 text-gray-600" }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Corporate Client Discovery" }), _jsx("p", { className: "text-sm text-gray-600", children: "AI-powered search to discover and evaluate potential corporate travel partnerships" })] })] }), _jsxs(Button, { onClick: () => setShowAddCompanyDialog(true), className: "cls-addcomapany", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Company"] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "grid grid-cols-3 gap-6 mb-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-900", children: "Industry Sector" }), _jsxs(Select, { value: searchParams.industry, onValueChange: (value) => setSearchParams({ ...searchParams, industry: value }), children: [_jsx(SelectTrigger, { className: "h-10 bg-white border-gray-300 text-gray-500", children: _jsx(SelectValue, { placeholder: "Select industry" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "technology", children: "Technology" }), _jsx(SelectItem, { value: "financial services", children: "Financial Services" }), _jsx(SelectItem, { value: "manufacturing", children: "Manufacturing" }), _jsx(SelectItem, { value: "healthcare", children: "Healthcare" }), _jsx(SelectItem, { value: "energy", children: "Energy" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-900", children: "Geographic Focus" }), _jsxs(Select, { value: searchParams.location, onValueChange: (value) => setSearchParams({ ...searchParams, location: value }), children: [_jsx(SelectTrigger, { className: "h-10 bg-white border-gray-300 text-gray-500", children: _jsx(SelectValue, { placeholder: "Select location" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "north-america", children: "North America" }), _jsx(SelectItem, { value: "europe", children: "Europe" }), _jsx(SelectItem, { value: "asia-pacific", children: "Asia Pacific" }), _jsx(SelectItem, { value: "global", children: "Global Operations" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-900", children: "Annual Travel Budget" }), _jsxs(Select, { value: searchParams.travelBudget, onValueChange: (value) => setSearchParams({ ...searchParams, travelBudget: value }), children: [_jsx(SelectTrigger, { className: "h-10 bg-white border-gray-300 text-gray-500", children: _jsx(SelectValue, { placeholder: "Select budget range" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "under-500k", children: "Under $500K" }), _jsx(SelectItem, { value: "500k-1m", children: "$500K - $1M" }), _jsx(SelectItem, { value: "1m-3m", children: "$1M - $3M" }), _jsx(SelectItem, { value: "3m-5m", children: "$3M - $5M" }), _jsx(SelectItem, { value: "above-5m", children: "Above $5M" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-6 mb-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-900", children: "Company Size" }), _jsxs(Select, { value: searchParams.companySize, onValueChange: (value) => setSearchParams({ ...searchParams, companySize: value }), children: [_jsx(SelectTrigger, { className: "h-10 bg-white border-gray-300 text-gray-500", children: _jsx(SelectValue, { placeholder: "Select company size" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "startup", children: "Startup (1-50)" }), _jsx(SelectItem, { value: "small", children: "Small (51-200)" }), _jsx(SelectItem, { value: "medium", children: "Medium (201-1000)" }), _jsx(SelectItem, { value: "large", children: "Large (1001-5000)" }), _jsx(SelectItem, { value: "enterprise", children: "Enterprise (5000+)" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-900", children: "Travel Frequency" }), _jsxs(Select, { value: searchParams.travelFrequency, onValueChange: (value) => setSearchParams({ ...searchParams, travelFrequency: value }), children: [_jsx(SelectTrigger, { className: "h-10 bg-white border-gray-300 text-gray-500", children: _jsx(SelectValue, { placeholder: "Select frequency" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "daily", children: "Daily Travel" }), _jsx(SelectItem, { value: "weekly", children: "Weekly Travel" }), _jsx(SelectItem, { value: "monthly", children: "Monthly Travel" }), _jsx(SelectItem, { value: "quarterly", children: "Quarterly Travel" })] })] })] })] }), _jsxs("div", { className: "flex space-x-3 items-center", children: [_jsxs(Button, { onClick: handleSearch, disabled: isSearching, className: "bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md flex items-center gap-2", children: [_jsx(Search, { className: "h-4 w-4" }), isSearching ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "AI Processing..."] })) : ('Search Corporates')] }), _jsxs(Button, { variant: "outline", onClick: () => setShowAdvancedFilters(true), className: "border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4" }), "Advanced Filters"] }), _jsxs(Button, { variant: "outline", onClick: handleClearFilters, className: "border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2", children: [_jsx(X, { className: "h-4 w-4" }), "Clear Filters"] })] })] }), error && (_jsxs(Alert, { className: "bg-red-50 border-red-200 mb-4", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-red-500" }), _jsx(AlertDescription, { className: "text-red-800", children: error })] })), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Search Results" }), _jsx("p", { className: "text-sm text-gray-600", children: isLoading ? 'Loading...' : `${filteredCorporates.length} total prospects found • Showing ${displayedCorporates.length} results` })] }), !isLoading && filteredCorporates.length > 0 && (_jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Filter by company name...", value: nameFilter, onChange: (e) => handleNameFilterChange(e.target.value), className: "pl-10 w-64 h-9" }), nameFilter && (_jsx("button", { onClick: () => handleNameFilterChange(''), className: "absolute right-2 top-1/2 transform -translate-y-1/2", children: _jsx(X, { className: "h-4 w-4 text-gray-400 hover:text-gray-600" }) }))] }) }))] }) }), isLoading && (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" }), _jsx("span", { className: "ml-3 text-gray-600", children: "Loading corporate data..." })] })), !isLoading && filteredCorporates.length === 0 && !error && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Building2, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No companies found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Try adjusting your search criteria or add a new company to get started." }), _jsxs(Button, { onClick: () => setShowAddCompanyDialog(true), className: "bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Company"] })] })), !isLoading && filteredCorporates.length > 0 && displayedCorporates.length === 0 && (nameFilter.trim() !== '') && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Search, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No matches found" }), _jsxs("p", { className: "text-gray-600 mb-4", children: ["No companies match your filter \"", nameFilter, "\". Try a different search term."] }), _jsxs(Button, { onClick: () => setNameFilter(''), variant: "outline", className: "border-gray-300", children: [_jsx(X, { className: "h-4 w-4 mr-2" }), "Clear Filter"] })] })), !isLoading && displayedCorporates.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-4", children: displayedCorporates.map((corporate) => (_jsx(Card, { className: "bg-white border border-gray-200", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Building2, { className: "h-6 w-6 text-blue-600" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: corporate.name }), _jsxs(Badge, { variant: "secondary", className: "bg-orange-500 hover:bg-orange-600 text-white text-xs", children: ["AI Score ", corporate.aiScore] })] }), _jsxs("p", { className: "text-sm text-gray-600 mb-1", children: [corporate.type, " \u2022 ", corporate.industry] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3 w-3" }), corporate.location] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "h-3 w-3" }), corporate.employees.toLocaleString(), " employees"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), "Est. ", corporate.established] }), _jsxs("span", { className: "flex items-center gap-1 cls-link", children: [_jsx(Globe, { className: "h-3 w-3" }), corporate.website] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center gap-1 mb-1", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-current" }), _jsx("span", { className: "font-medium text-sm", children: corporate.rating })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["$", corporate.travelBudget, " budget"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-x-8 gap-y-2 mb-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "h-4 w-4 text-green-600" }), _jsxs("span", { children: ["Revenue: $", (corporate.revenue / 1000000).toFixed(1), "M"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-4 w-4 text-blue-600" }), _jsxs("span", { children: ["Credit: ", corporate.creditRating] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Plane, { className: "h-4 w-4 text-purple-600" }), _jsxs("span", { children: ["Travel: ", corporate.annualTravelVolume] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-4 w-4 text-orange-600" }), _jsxs("span", { children: ["Class: ", corporate.preferredClass] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4 text-gray-600" }), _jsxs("span", { children: ["Frequency: ", corporate.travelFrequency] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "h-4 w-4 text-red-600" }), _jsxs("span", { children: ["Risk: ", corporate.riskLevel] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Specialties" }), _jsx("div", { className: "flex flex-wrap gap-2", children: corporate.specialties.map((specialty, index) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded", children: specialty }, index))) })] }), _jsx("div", { className: "mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Brain, { className: "h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-900", children: "AI Partnership Recommendation" }), _jsx("p", { className: "text-sm text-blue-800 mt-1", children: corporate.aiRecommendation })] })] }) }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleViewProfile(corporate), className: "border-gray-300", children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "View Full Profile"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleMoveAsLead(corporate), disabled: movedAsLeadIds.has(corporate.id), className: "border-gray-300 cls-addcomapany", children: [_jsx(UserPlus, { className: "h-4 w-4 mr-2" }), movedAsLeadIds.has(corporate.id) ? 'Moved as Lead' : 'Move as Lead'] }), _jsxs(Button, { variant: "outline", size: "sm", className: "border-gray-300", onClick: () => handleContactCorporate(corporate), children: [_jsx(Phone, { className: "h-4 w-4 mr-1" }), "Contact"] })] })] })] }) }) }, corporate.id))) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between mt-8 pt-6 border-t border-gray-200", children: [_jsx("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: _jsxs("span", { children: ["Showing ", ((currentPage - 1) * itemsPerPage) + 1, " to ", Math.min(currentPage * itemsPerPage, filteredCorporates.length), " of ", filteredCorporates.length, " results"] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: "border-gray-300", children: [_jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }), "Previous"] }), _jsx("div", { className: "flex items-center gap-1", children: (() => {
                                            const pages = [];
                                            const maxVisiblePages = 5;
                                            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                                            // Adjust start page if we're near the end
                                            if (endPage - startPage + 1 < maxVisiblePages) {
                                                startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                            }
                                            // Add first page and ellipsis if needed
                                            if (startPage > 1) {
                                                pages.push(_jsx(Button, { variant: 1 === currentPage ? "default" : "outline", size: "sm", onClick: () => handlePageChange(1), className: `w-9 h-9 p-0 ${1 === currentPage ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-gray-300'}`, children: "1" }, 1));
                                                if (startPage > 2) {
                                                    pages.push(_jsx("span", { className: "px-2 text-gray-500", children: "..." }, "ellipsis1"));
                                                }
                                            }
                                            // Add visible page numbers
                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(_jsx(Button, { variant: i === currentPage ? "default" : "outline", size: "sm", onClick: () => handlePageChange(i), className: `w-9 h-9 p-0 ${i === currentPage ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-gray-300'}`, children: i }, i));
                                            }
                                            // Add ellipsis and last page if needed
                                            if (endPage < totalPages) {
                                                if (endPage < totalPages - 1) {
                                                    pages.push(_jsx("span", { className: "px-2 text-gray-500", children: "..." }, "ellipsis2"));
                                                }
                                                pages.push(_jsx(Button, { variant: totalPages === currentPage ? "default" : "outline", size: "sm", onClick: () => handlePageChange(totalPages), className: `w-9 h-9 p-0 ${totalPages === currentPage ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-gray-300'}`, children: totalPages }, totalPages));
                                            }
                                            return pages;
                                        })() }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: "border-gray-300", children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] })] })] }))] })), _jsx(Dialog, { open: showAdvancedFilters, onOpenChange: setShowAdvancedFilters, children: _jsxs(DialogContent, { className: "max-w-[60rem] w-[95vw] max-h-[85vh] overflow-y-auto", style: { maxWidth: 'min(var(--modal-width-xl, 80rem), calc(100% - 2rem))' }, children: [_jsxs(DialogHeader, { className: "pb-6", children: [_jsxs(DialogTitle, { className: "flex items-center gap-3 text-xl", children: [_jsx(Filter, { className: "h-6 w-6 text-orange-500" }), "Advanced Search Filters"] }), _jsx(DialogDescription, { className: "text-base mt-2 cls-gray", children: "Apply detailed criteria to discover the most relevant corporate travel prospects for your business" })] }), _jsx("div", { className: "space-y-8", children: _jsxs(Tabs, { defaultValue: "business", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4 h-12 bg-gray-100 rounded-lg p-1", children: [_jsx(TabsTrigger, { value: "business", className: "text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500", children: "Business Criteria" }), _jsx(TabsTrigger, { value: "travel", className: "text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500", children: "Travel Patterns" }), _jsx(TabsTrigger, { value: "financial", className: "text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500", children: "Financial Profile" }), _jsx(TabsTrigger, { value: "technology", className: "text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500", children: "Technology & Preferences" })] }), _jsxs(TabsContent, { value: "business", className: "space-y-6 mt-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Industry Specialization" }), _jsx("div", { className: "space-y-3", children: ["Technology", "Finance", "Manufacturing", "Healthcare", "Energy", "Consulting"].map((industry) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Checkbox, { id: industry.toLowerCase(), checked: advancedFilters.industries.includes(industry.toLowerCase()), onCheckedChange: (checked) => {
                                                                                if (checked) {
                                                                                    setAdvancedFilters(prev => ({
                                                                                        ...prev,
                                                                                        industries: [...prev.industries, industry.toLowerCase()]
                                                                                    }));
                                                                                }
                                                                                else {
                                                                                    setAdvancedFilters(prev => ({
                                                                                        ...prev,
                                                                                        industries: prev.industries.filter(i => i !== industry.toLowerCase())
                                                                                    }));
                                                                                }
                                                                            } }), _jsx(Label, { htmlFor: industry.toLowerCase(), className: "text-sm cursor-pointer", children: industry })] }, industry))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Company Maturity" }), _jsx("div", { className: "space-y-3", children: ["Startup (1-3 years)", "Growth (4-10 years)", "Established (11-25 years)", "Enterprise (25+ years)"].map((maturity) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Checkbox, { id: maturity.toLowerCase().replace(/\s+/g, '-') }), _jsx(Label, { htmlFor: maturity.toLowerCase().replace(/\s+/g, '-'), className: "text-sm cursor-pointer", children: maturity })] }, maturity))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Employee Count Range" }), _jsx(Slider, { value: advancedFilters.employeeRange, onValueChange: (value) => setAdvancedFilters(prev => ({ ...prev, employeeRange: value })), max: 10000, step: 100, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-sm text-gray-500", children: [_jsx("span", { children: advancedFilters.employeeRange[0] }), _jsxs("span", { children: [advancedFilters.employeeRange[1], "+"] })] })] })] }), _jsxs(TabsContent, { value: "travel", className: "space-y-6 mt-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Travel Frequency" }), _jsxs(Select, { value: advancedFilters.travelFrequency, onValueChange: (value) => setAdvancedFilters(prev => ({ ...prev, travelFrequency: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select frequency" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "daily", children: "Daily Travel" }), _jsx(SelectItem, { value: "weekly", children: "Weekly Travel" }), _jsx(SelectItem, { value: "monthly", children: "Monthly Travel" }), _jsx(SelectItem, { value: "quarterly", children: "Quarterly Travel" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Preferred Class" }), _jsxs(Select, { value: advancedFilters.preferredClass, onValueChange: (value) => setAdvancedFilters(prev => ({ ...prev, preferredClass: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select class preference" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "economy", children: "Economy" }), _jsx(SelectItem, { value: "premium-economy", children: "Premium Economy" }), _jsx(SelectItem, { value: "business", children: "Business" }), _jsx(SelectItem, { value: "first", children: "First Class" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Annual Travel Volume (Trips)" }), _jsx(Slider, { defaultValue: [1000], max: 20000, step: 100, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-sm text-gray-500", children: [_jsx("span", { children: "100" }), _jsx("span", { children: "20,000+" })] })] })] }), _jsxs(TabsContent, { value: "financial", className: "space-y-6 mt-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Annual Revenue Range" }), _jsxs(Select, { value: advancedFilters.revenueRange, onValueChange: (value) => setAdvancedFilters(prev => ({ ...prev, revenueRange: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select revenue range" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "under-10m", children: "Under $10M" }), _jsx(SelectItem, { value: "10m-50m", children: "$10M - $50M" }), _jsx(SelectItem, { value: "50m-100m", children: "$50M - $100M" }), _jsx(SelectItem, { value: "100m-500m", children: "$100M - $500M" }), _jsx(SelectItem, { value: "above-500m", children: "Above $500M" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Credit Rating" }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select minimum rating" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "aaa", children: "AAA" }), _jsx(SelectItem, { value: "aa", children: "AA" }), _jsx(SelectItem, { value: "a", children: "A" }), _jsx(SelectItem, { value: "bbb", children: "BBB" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Travel Budget Range (Annual)" }), _jsx(Slider, { defaultValue: [1], max: 10, step: 0.5, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-sm text-gray-500", children: [_jsx("span", { children: "$500K" }), _jsx("span", { children: "$10M+" })] })] })] }), _jsx(TabsContent, { value: "technology", className: "space-y-6 mt-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Technology Integration Requirements" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: ["API Integration", "Mobile App", "Expense Management", "Real-time Booking", "Carbon Tracking", "Reporting Tools"].map((tech) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Checkbox, { id: tech.toLowerCase().replace(/\s+/g, '-') }), _jsx(Label, { htmlFor: tech.toLowerCase().replace(/\s+/g, '-'), className: "text-sm cursor-pointer", children: tech })] }, tech))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium", children: "Sustainability Focus" }), _jsxs(Select, { value: advancedFilters.sustainabilityLevel, onValueChange: (value) => setAdvancedFilters(prev => ({ ...prev, sustainabilityLevel: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select sustainability level" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "very-high", children: "Very High" }), _jsx(SelectItem, { value: "high", children: "High" }), _jsx(SelectItem, { value: "medium", children: "Medium" }), _jsx(SelectItem, { value: "low", children: "Low" })] })] })] })] }) })] }) }), _jsxs(DialogFooter, { className: "pt-6 border-t border-gray-300 gap-3", children: [_jsx(Button, { variant: "ghost", className: "text-gray-500 hover:text-gray-700 cls-addcomapany", onClick: () => {
                                        setAdvancedFilters({
                                            industries: [],
                                            maturity: [],
                                            employeeRange: [100, 10000],
                                            travelFrequency: '',
                                            preferredClass: '',
                                            annualTravelVolume: [100, 20000],
                                            revenueRange: '',
                                            creditRating: '',
                                            travelBudgetRange: [0.5, 10],
                                            techRequirements: [],
                                            sustainabilityLevel: ''
                                        });
                                    }, children: "Reset All" }), _jsx(Button, { variant: "outline", className: "cls-cancel text-gray-500 hover:text-gray-700", onClick: () => setShowAdvancedFilters(false), children: "Cancel" }), _jsx(Button, { onClick: () => {
                                        setShowAdvancedFilters(false);
                                        handleSearch();
                                    }, className: "bg-orange-500 hover:bg-orange-600 text-white", children: "Apply Filters" })] })] }) }), _jsx(Dialog, { open: showAddCompanyDialog, onOpenChange: setShowAddCompanyDialog, children: _jsxs(DialogContent, { className: "max-w-[87rem] w-[95vw] max-h-[85vh] overflow-y-auto", children: [_jsxs(DialogHeader, { className: "pb-[24px] pt-[0px] pr-[0px] pl-[0px] m-[0px]", children: [_jsxs(DialogTitle, { className: "flex items-center gap-3 text-xl", children: [_jsx(Plus, { className: "h-6 w-6 text-orange-500" }), "Add New Company"] }), _jsx(DialogDescription, { className: "text-base mt-2", style: { 'color': '#717182' }, children: "Add a new company to the corporate database for potential partnership opportunities" })] }), _jsxs(Tabs, { defaultValue: "basic", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "basic", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Basic Info" }), _jsx(TabsTrigger, { value: "business", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Business Details" }), _jsx(TabsTrigger, { value: "travel", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Travel Profile" }), _jsx(TabsTrigger, { value: "additional", className: "rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]", children: "Additional Info" })] }), _jsxs(ScrollArea, { className: "max-h-[55vh] pr-4", children: [_jsxs(TabsContent, { value: "basic", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company-name", className: "text-sm font-medium", children: "Company Name *" }), _jsx(Input, { id: "company-name", placeholder: "Enter company name", value: newCompany.name, onChange: (e) => setNewCompany({ ...newCompany, name: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company-type", className: "text-sm font-medium", children: "Company Type *" }), _jsxs(Select, { value: newCompany.type, onValueChange: (value) => setNewCompany({ ...newCompany, type: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select company type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "corporation", children: "Corporation" }), _jsx(SelectItem, { value: "llc", children: "LLC" }), _jsx(SelectItem, { value: "partnership", children: "Partnership" }), _jsx(SelectItem, { value: "nonprofit", children: "Non-Profit" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "industry", className: "text-sm font-medium", children: "Industry *" }), _jsxs(Select, { value: newCompany.industry, onValueChange: (value) => setNewCompany({ ...newCompany, industry: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select industry" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "technology", children: "Technology" }), _jsx(SelectItem, { value: "finance", children: "Finance & Banking" }), _jsx(SelectItem, { value: "manufacturing", children: "Manufacturing" }), _jsx(SelectItem, { value: "healthcare", children: "Healthcare" }), _jsx(SelectItem, { value: "energy", children: "Energy & Utilities" }), _jsx(SelectItem, { value: "consulting", children: "Consulting" }), _jsx(SelectItem, { value: "retail", children: "Retail" }), _jsx(SelectItem, { value: "telecommunications", children: "Telecommunications" }), _jsx(SelectItem, { value: "transportation", children: "Transportation" }), _jsx(SelectItem, { value: "education", children: "Education" }), _jsx(SelectItem, { value: "government", children: "Government" }), _jsx(SelectItem, { value: "other", children: "Other" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "location", className: "text-sm font-medium", children: "Location *" }), _jsx(Input, { id: "location", placeholder: "City, Country", value: newCompany.location, onChange: (e) => setNewCompany({ ...newCompany, location: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", className: "text-sm font-medium", children: "Email *" }), _jsx(Input, { id: "email", type: "email", placeholder: "contact@company.com", value: newCompany.email, onChange: (e) => setNewCompany({ ...newCompany, email: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", className: "text-sm font-medium", children: "Phone" }), _jsx(Input, { id: "phone", placeholder: "+1 (555) 123-4567", value: newCompany.phone, onChange: (e) => setNewCompany({ ...newCompany, phone: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "website", className: "text-sm font-medium", children: "Website" }), _jsx(Input, { id: "website", placeholder: "www.company.com", value: newCompany.website, onChange: (e) => setNewCompany({ ...newCompany, website: e.target.value }), className: "h-10" })] })] }), _jsxs(TabsContent, { value: "business", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "employees", className: "text-sm font-medium", children: "Number of Employees *" }), _jsx(Input, { id: "employees", type: "number", placeholder: "1000", value: newCompany.employees, onChange: (e) => setNewCompany({ ...newCompany, employees: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "revenue", className: "text-sm font-medium", children: "Annual Revenue (Millions)" }), _jsx(Input, { id: "revenue", type: "number", placeholder: "50", value: newCompany.revenue, onChange: (e) => setNewCompany({ ...newCompany, revenue: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "established", className: "text-sm font-medium", children: "Year Established" }), _jsx(Input, { id: "established", type: "number", placeholder: "2010", value: newCompany.established, onChange: (e) => setNewCompany({ ...newCompany, established: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company-size", className: "text-sm font-medium", children: "Company Size Category" }), _jsxs(Select, { value: newCompany.companySize, onValueChange: (value) => setNewCompany({ ...newCompany, companySize: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select size category" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "startup", children: "Starp (1-50)" }), _jsx(SelectItem, { value: "small", children: "Small (51-200)" }), _jsx(SelectItem, { value: "medium", children: "Medium (201-1000)" }), _jsx(SelectItem, { value: "large", children: "Large (1001-5000)" }), _jsx(SelectItem, { value: "enterprise", children: "Enterprise (5000+)" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "credit-rating", className: "text-sm font-medium", children: "Credit Rating" }), _jsxs(Select, { value: newCompany.creditRating, onValueChange: (value) => setNewCompany({ ...newCompany, creditRating: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select credit rating" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "AAA", children: "AAA" }), _jsx(SelectItem, { value: "AA", children: "AA" }), _jsx(SelectItem, { value: "A", children: "A" }), _jsx(SelectItem, { value: "BBB", children: "BBB" }), _jsx(SelectItem, { value: "BB", children: "BB" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "payment-terms", className: "text-sm font-medium", children: "Payment Terms" }), _jsxs(Select, { value: newCompany.paymentTerms, onValueChange: (value) => setNewCompany({ ...newCompany, paymentTerms: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select payment terms" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Net 15", children: "Net 15" }), _jsx(SelectItem, { value: "Net 30", children: "Net 30" }), _jsx(SelectItem, { value: "Net 45", children: "Net 45" }), _jsx(SelectItem, { value: "Net 60", children: "Net 60" })] })] })] })] })] }), _jsxs(TabsContent, { value: "travel", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "travel-budget", className: "text-sm font-medium", children: "Annual Travel Budget *" }), _jsx(Input, { id: "travel-budget", placeholder: "e.g., 2.5M", value: newCompany.travelBudget, onChange: (e) => setNewCompany({ ...newCompany, travelBudget: e.target.value }), className: "h-10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "annual-travel-volume", className: "text-sm font-medium", children: "Annual Travel Volume" }), _jsx(Input, { id: "annual-travel-volume", placeholder: "e.g., 5,000 trips", value: newCompany.annualTravelVolume, onChange: (e) => setNewCompany({ ...newCompany, annualTravelVolume: e.target.value }), className: "h-10" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "travel-frequency", className: "text-sm font-medium", children: "Travel Frequency" }), _jsxs(Select, { value: newCompany.travelFrequency, onValueChange: (value) => setNewCompany({ ...newCompany, travelFrequency: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select frequency" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Daily", children: "Daily" }), _jsx(SelectItem, { value: "Weekly", children: "Weekly" }), _jsx(SelectItem, { value: "Monthly", children: "Monthly" }), _jsx(SelectItem, { value: "Quarterly", children: "Quarterly" }), _jsx(SelectItem, { value: "Bi-weekly", children: "Bi-weekly" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "preferred-class", className: "text-sm font-medium", children: "Preferred Travel Class" }), _jsxs(Select, { value: newCompany.preferredClass, onValueChange: (value) => setNewCompany({ ...newCompany, preferredClass: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select class preference" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Economy", children: "Economy" }), _jsx(SelectItem, { value: "Economy Plus", children: "Economy Plus" }), _jsx(SelectItem, { value: "Business", children: "Business" }), _jsx(SelectItem, { value: "First", children: "First Class" }), _jsx(SelectItem, { value: "Business/First", children: "Business/First" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "sustainability-focus", className: "text-sm font-medium", children: "Sustainability Focus" }), _jsxs(Select, { value: newCompany.sustainabilityFocus, onValueChange: (value) => setNewCompany({ ...newCompany, sustainabilityFocus: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select sustainability level" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Very High", children: "Very High" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "risk-level", className: "text-sm font-medium", children: "Risk Level" }), _jsxs(Select, { value: newCompany.riskLevel, onValueChange: (value) => setNewCompany({ ...newCompany, riskLevel: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select risk level" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Very Low", children: "Very Low" }), _jsx(SelectItem, { value: "Low", children: "Low" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "High", children: "High" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "current-airlines", className: "text-sm font-medium", children: "Current Airlines (comma-separated)" }), _jsx(Input, { id: "current-airlines", placeholder: "e.g., United, Delta, American", value: newCompany.currentAirlines, onChange: (e) => setNewCompany({ ...newCompany, currentAirlines: e.target.value }), className: "h-10" })] })] }), _jsxs(TabsContent, { value: "additional", className: "space-y-6 mt-0", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "expansion-plans", className: "text-sm font-medium", children: "Expansion Plans" }), _jsxs(Select, { value: newCompany.expansionPlans, onValueChange: (value) => setNewCompany({ ...newCompany, expansionPlans: value }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Select expansion plans" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Aggressive", children: "Aggressive" }), _jsx(SelectItem, { value: "Moderate", children: "Moderate" }), _jsx(SelectItem, { value: "Conservative", children: "Conservative" }), _jsx(SelectItem, { value: "Rapid", children: "Rapid" }), _jsx(SelectItem, { value: "Stable", children: "Stable" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "specialties", className: "text-sm font-medium", children: "Specialties (comma-separated)" }), _jsx(Textarea, { id: "specialties", placeholder: "Enterprise Software, Cloud Solutions, AI/ML Services", value: newCompany.specialties, onChange: (e) => setNewCompany({ ...newCompany, specialties: e.target.value }), className: "min-h-[80px] resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "technology-integration", className: "text-sm font-medium", children: "Technology Integration (comma-separated)" }), _jsx(Textarea, { id: "technology-integration", placeholder: "API, Mobile App, Expense Management", value: newCompany.technologyIntegration, onChange: (e) => setNewCompany({ ...newCompany, technologyIntegration: e.target.value }), className: "min-h-[80px] resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "notes", className: "text-sm font-medium", children: "Additional Notes" }), _jsx(Textarea, { id: "notes", placeholder: "Any additional information about the company...", value: newCompany.notes, onChange: (e) => setNewCompany({ ...newCompany, notes: e.target.value }), className: "min-h-[120px] resize-none" })] })] })] })] }), _jsxs(DialogFooter, { className: "pt-6 border-t border-gray-300 gap-3", children: [_jsx(Button, { variant: "outline", className: "border-gray-300 text-gray-700 hover:bg-gray-50", onClick: () => setShowAddCompanyDialog(false), children: "Cancel" }), _jsx(Button, { onClick: handleAddCompany, disabled: !isFormValid() || isSubmitting, className: "bg-orange-500 hover:bg-orange-600 text-white", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "Add Company"] })) })] })] }) }), _jsx(Dialog, { open: showContactDialog, onOpenChange: setShowContactDialog, children: _jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-5 w-5 text-orange-600" }), "Contact ", contactForm?.corporateData?.name] }), _jsxs(DialogDescription, { children: ["Send a personalized message to  ", contactForm?.corporateData?.name] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Contact Method" }), _jsxs(Select, { value: contactForm.method, onValueChange: (value) => setContactForm({ ...contactForm, method: value }), children: [_jsx(SelectTrigger, { className: "border-orange-200 focus:border-orange-500 focus:ring-orange-500", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Email", children: "Email" }), _jsx(SelectItem, { value: "Phone", children: "Phone" }), _jsx(SelectItem, { value: "LinkedIn", children: "LinkedIn" }), _jsx(SelectItem, { value: "In-Person Meeting", children: "In-Person Meeting" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Subject" }), _jsx(Input, { value: contactForm.subject, onChange: (e) => setContactForm({ ...contactForm, subject: e.target.value }), placeholder: "Enter subject line...", className: "border-gray-300 focus:border-orange-500 focus:ring-orange-500" })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Message" }), _jsx(Textarea, { value: contactForm.message, onChange: (e) => setContactForm({ ...contactForm, message: e.target.value }), placeholder: "Enter your message...", className: "min-h-[200px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500", rows: 10 })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Follow-up Date" }), _jsx(Input, { type: "date", value: contactForm.followUpDate, onChange: (e) => setContactForm({ ...contactForm, followUpDate: e.target.value }), className: "border-gray-300 focus:border-orange-500 focus:ring-orange-500" })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowContactDialog(false);
                                        setContactForm({
                                            method: 'Email',
                                            subject: '',
                                            message: '',
                                            followUpDate: '',
                                            corporateData: null
                                        });
                                    }, className: "text-gray-600 border-gray-300", children: "Cancel" }), _jsxs(Button
                                // onClick={handleSendMessage}
                                , { 
                                    // onClick={handleSendMessage}
                                    className: "bg-orange-500 hover:bg-orange-600 text-white", disabled: !contactForm.subject || !contactForm.message, children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), "Send Message"] })] })] }) })] }));
}
