import { useState, useEffect } from 'react';
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
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { CorporateProfile } from './CorporateProfile';

import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Users, 
  Calendar,
  TrendingUp,
  Award,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Settings2,
  Building2,
  FileText,
  ArrowRight,
  Eye,
  DollarSign,
  Briefcase,
  Target,
  Activity,
  BarChart3,
  Plane,
  Clock,
  Shield,
  Zap,
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Wallet,
  CreditCard,
  Calendar as CalendarIcon,
  Route,
  PlaneTakeoff,
  Building,
  Factory,
  Banknote,
  Leaf,
  Smartphone,
  LineChart,
  PieChart,
  BarChart4,
  X,
  UserPlus,
  Plus,
  Save,
  AlertCircle as AlertCircleIcon,
  CheckCircle
} from 'lucide-react';

// API utility functions
const API_BASE_URL = '/api';

const fetchCompanies = async (filters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/companies/search/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

const transformCompanyData = (company) => {
  // Transform backend data to match frontend expectations
  return {
    id: company.id,
    name: company.name,
    type: getCompanyTypeDisplay(company.size),
    industry: getIndustryDisplay(company.industry),
    location: company.location,
    aiScore: Math.floor(Math.random() * 20) + 80, // Random AI score for demo
    rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
    established: company.created_at ? new Date(company.created_at).getFullYear() : 2020,
    employees: company.employee_count || Math.floor(Math.random() * 5000) + 100,
    specialties: company.description ? company.description.split(',').map(s => s.trim()).slice(0, 3) : ["Business Services", "Corporate Solutions"],
    travelBudget: company.travel_budget ? `${(company.travel_budget / 1000000).toFixed(1)}M` : "1.0M",
    annualTravelVolume: `${Math.floor(Math.random() * 5000) + 1000} trips`,
    contracts: Math.floor(Math.random() * 20) + 1,
    revenue: company.annual_revenue || Math.floor(Math.random() * 50000000) + 10000000,
    phone: "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
    email: `contact@${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    website: company.website || `www.${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    aiRecommendation: generateAIRecommendation(company),
    compliance: Math.floor(Math.random() * 20) + 80,
    financialStability: Math.floor(Math.random() * 20) + 80,
    travelFrequency: getRandomTravelFrequency(),
    destinations: getRandomDestinations(),
    preferredClass: getRandomPreferredClass(),
    teamSize: Math.floor((company.employee_count || 1000) * 0.1),
    travelManagers: Math.floor(Math.random() * 5) + 1,
    currentAirlines: getRandomAirlines(),
    paymentTerms: getRandomPaymentTerms(),
    creditRating: getRandomCreditRating(),
    sustainabilityFocus: getRandomSustainabilityFocus(),
    technologyIntegration: getRandomTechIntegration(),
    seasonality: getRandomSeasonality(),
    meetingTypes: getRandomMeetingTypes(),
    companySize: getSizeDisplay(company.size),
    marketSegment: getIndustryDisplay(company.industry),
    decisionMakers: Math.floor(Math.random() * 8) + 2,
    contractValue: Math.floor(Math.random() * 3000000) + 500000,
    competitorAirlines: Math.floor(Math.random() * 5) + 1,
    loyaltyPotential: Math.floor(Math.random() * 30) + 70,
    expansionPlans: getRandomExpansionPlans(),
    riskLevel: getRandomRiskLevel()
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

interface CorporateSearchProps {
  initialFilters?: any;
  onNavigate?: (section: string, filters?: any) => void;
}

export function CorporateSearch({ initialFilters, onNavigate }: CorporateSearchProps) {
  const [searchParams, setSearchParams] = useState({
    industry: '',
    location: '',
    travelBudget: '',
    companySize: '',
    travelFrequency: '',
    ...initialFilters
  });

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const [filteredCorporates, setFilteredCorporates] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCorporateProfile, setShowCorporateProfile] = useState(false);
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const [error, setError] = useState('');

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

  const loadCompanies = async (filters = {}) => {
    setIsLoading(true);
    setError('');

    try {
      const companies = await fetchCompanies(filters);
      const transformedCompanies = companies.map(transformCompanyData);
      setFilteredCorporates(transformedCompanies);
    } catch (error) {
      console.error('Error loading companies:', error);
      setError('Failed to load companies. Please try again.');
      setFilteredCorporates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setError('');

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Merge basic search params with advanced filters
      const mergedFilters = {
        ...searchParams,
        ...advancedFilters
      };

      // Use loadCompanies instead of duplicate fetchCompanies call
      await loadCompanies(mergedFilters);
    } catch (error) {
      console.error('Error searching companies:', error);
      setError('Search failed. Please try again.');
      setFilteredCorporates([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewProfile = (corporate) => {
    setSelectedCorporate(corporate);
    setShowCorporateProfile(true);
  };

  const handleMoveAsLead = (corporate) => {
    // Convert corporate data to lead format
    const leadData = {
      company: corporate.name,
      contact: 'Contact Name', // Would be extracted from corporate data or user input
      title: 'Decision Maker',
      email: corporate.email,
      phone: corporate.phone,
      industry: corporate.industry,
      employees: corporate.employees,
      revenue: `$${corporate.revenue / 1000000}M`,
      location: corporate.location,
      source: 'Corporate Search',
      travelBudget: `$${corporate.travelBudget}`,
      decisionMaker: true,
      notes: `Moved from corporate search. AI Score: ${corporate.aiScore}. ${corporate.aiRecommendation}`,
      tags: ['Corporate Search', 'High Priority', corporate.companySize],
      aiScore: corporate.aiScore,
      contractValue: corporate.contractValue,
      specialties: corporate.specialties,
      travelFrequency: corporate.travelFrequency,
      destinations: corporate.destinations,
      preferredClass: corporate.preferredClass,
      sustainabilityFocus: corporate.sustainabilityFocus,
      technologyIntegration: corporate.technologyIntegration
    };

    // Add to moved leads tracking
    setMovedAsLeadIds(prev => new Set([...prev, corporate.id]));

    // Navigate to leads with the new lead data
    onNavigate('leads', { 
      newLead: leadData,
      message: `${corporate.name} has been successfully moved to leads management`
    });
  };

  const handleBackToSearch = () => {
    setShowCorporateProfile(false);
    setSelectedCorporate(null);
  };

  const handleAddCompany = async () => {
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Map frontend fields to Django model fields
      const companyData = {
        name: newCompany.name,
        industry: newCompany.industry,
        size: newCompany.companySize,
        location: newCompany.location,
        website: newCompany.website || '',
        annual_revenue: newCompany.revenue ? parseFloat(newCompany.revenue) : null,
        employee_count: newCompany.employees ? parseInt(newCompany.employees) : null,
        travel_budget: newCompany.travelBudget ? parseFloat(newCompany.travelBudget) : null,
        description: newCompany.notes || ''
      };

      console.log('Sending company data:', companyData);

      const response = await fetch('/api/companies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const savedCompany = await response.json();

      // Generate display data for the frontend
      const companyDataForFrontend = {
        id: savedCompany.id,
        name: newCompany.name,
        type: newCompany.type,
        industry: newCompany.industry,
        location: newCompany.location,
        website: newCompany.website,
        phone: newCompany.phone,
        email: newCompany.email,
        established: parseInt(newCompany.established) || 2024,
        employees: parseInt(newCompany.employees) || 100,
        revenue: parseInt(newCompany.revenue) * 1000000 || 1000000,
        travelBudget: newCompany.travelBudget,
        annualTravelVolume: newCompany.annualTravelVolume,
        travelFrequency: newCompany.travelFrequency,
        preferredClass: newCompany.preferredClass,
        companySize: newCompany.companySize,
        creditRating: newCompany.creditRating,
        paymentTerms: newCompany.paymentTerms,
        sustainabilityFocus: newCompany.sustainabilityFocus,
        riskLevel: newCompany.riskLevel,
        expansionPlans: newCompany.expansionPlans,
        specialties: newCompany.specialties.split(',').map(s => s.trim()).filter(s => s),
        technologyIntegration: newCompany.technologyIntegration.split(',').map(s => s.trim()).filter(s => s),
        currentAirlines: newCompany.currentAirlines.split(',').map(s => s.trim()).filter(s => s),
        aiScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
        rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0-5.0
        contracts: 0,
        aiRecommendation: `New corporate client with potential for ${newCompany.travelFrequency.toLowerCase()} travel needs. Consider outreach for partnership opportunities.`,
        compliance: Math.floor(Math.random() * 20) + 80,
        financialStability: Math.floor(Math.random() * 20) + 80,
        destinations: ["North America"], // Default
        teamSize: Math.floor(parseInt(newCompany.employees) * 0.1) || 10,
        travelManagers: 1,
        decisionMakers: 2,
        contractValue: 0,
        competitorAirlines: 1,
        loyaltyPotential: Math.floor(Math.random() * 30) + 70,
        seasonality: "Year-round",
        meetingTypes: ["Business Meetings"]
      };

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

      // Refresh the companies list
      await loadCompanies();

      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error saving company:', error);
      setSuccessMessage(`Error: Failed to save company. ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return newCompany.name.trim() !== '' && 
           newCompany.industry !== '' && 
           newCompany.companySize !== '' && 
           newCompany.location.trim() !== '';
  };

  // Show specific components based on state
  if (showCorporateProfile && selectedCorporate) {
    return (
      <CorporateProfile 
        corporateData={selectedCorporate}
        onBack={handleBackToSearch}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="h-6 w-6 text-gray-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Corporate Client Discovery</h1>
            <p className="text-sm text-gray-600">AI-powered search to discover and evaluate potential corporate travel partnerships</p>
          </div>
        </div>
        <Button onClick={() => setShowAddCompanyDialog(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        {/* Top Row - 3 columns */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Industry Sector</Label>
            <Select value={searchParams.industry} onValueChange={(value) => setSearchParams({...searchParams, industry: value})}>
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="financial services">Financial Services</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Geographic Focus</Label>
            <Select value={searchParams.location} onValueChange={(value) => setSearchParams({...searchParams, location: value})}>
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                <SelectItem value="global">Global Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Annual Travel Budget</Label>
            <Select value={searchParams.travelBudget} onValueChange={(value) => setSearchParams({...searchParams, travelBudget: value})}>
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-500k">Under $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="1m-3m">$1M - $3M</SelectItem>
                <SelectItem value="3m-5m">$3M - $5M</SelectItem>
                <SelectItem value="above-5m">Above $5M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom Row - 2 columns */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Company Size</Label>
            <Select value={searchParams.companySize} onValueChange={(value) => setSearchParams({...searchParams, companySize: value})}>
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup (1-50)</SelectItem>
                <SelectItem value="small">Small (51-200)</SelectItem>
                <SelectItem value="medium">Medium (201-1000)</SelectItem>
                <SelectItem value="large">Large (1001-5000)</SelectItem>
                <SelectItem value="enterprise">Enterprise (5000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Travel Frequency</Label>
            <Select value={searchParams.travelFrequency} onValueChange={(value) => setSearchParams({...searchParams, travelFrequency: value})}>
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Travel</SelectItem>
                <SelectItem value="weekly">Weekly Travel</SelectItem>
                <SelectItem value="monthly">Monthly Travel</SelectItem>
                <SelectItem value="quarterly">Quarterly Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 items-center">
          <Button 
            onClick={handleSearch} 
            disabled={isSearching} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                AI Processing...
              </>
            ) : (
              'Search Corporates'
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => setShowAdvancedFilters(true)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
        <p className="text-sm text-gray-600">
          {isLoading ? 'Loading...' : `${filteredCorporates.length} corporate prospects found matching your criteria`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading corporate data...</span>
        </div>
      )}

      {/* No Results State */}
      {!isLoading && filteredCorporates.length === 0 && !error && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or add a new company to get started.</p>
          <Button onClick={() => setShowAddCompanyDialog(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      )}

      {/* Results List */}
      {!isLoading && filteredCorporates.length > 0 && (
        <div className="space-y-4">
          {filteredCorporates.map((corporate) => (
          <Card key={corporate.id} className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Company Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{corporate.name}</h3>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                          AI Score {corporate.aiScore}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{corporate.type} • {corporate.industry}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {corporate.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {corporate.employees.toLocaleString()} employees
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Est. {corporate.established}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {corporate.website}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium text-sm">{corporate.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">${corporate.travelBudget} budget</div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>Revenue: ${(corporate.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>Credit: {corporate.creditRating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-purple-600" />
                      <span>Travel: {corporate.annualTravelVolume}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      <span>Class: {corporate.preferredClass}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span>Frequency: {corporate.travelFrequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-red-600" />
                      <span>Risk: {corporate.riskLevel}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {corporate.specialties.map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">AI Partnership Recommendation</p>
                        <p className="text-sm text-blue-800 mt-1">{corporate.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewProfile(corporate)}
                      className="border-gray-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Profile
                    </Button>

                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => handleMoveAsLead(corporate)}
                      disabled={movedAsLeadIds.has(corporate.id)}
                      className="border-gray-300"
                    >
                      {movedAsLeadIds.has(corporate.id) ? 'Moved as Lead' : 'Move as Lead'}
                    </Button>

                    <Button variant="outline" size="sm" className="border-gray-300">
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Advanced Filters Dialog */}
      <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <DialogContent className="max-w-[60rem] w-[95vw] max-h-[85vh] overflow-y-auto" style={{ maxWidth: 'min(var(--modal-width-xl, 80rem), calc(100% - 2rem))' }}>
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Filter className="h-6 w-6 text-orange-500" />
              Advanced Search Filters
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Apply detailed criteria to discover the most relevant corporate travel prospects for your business
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="business" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500">Business Criteria</TabsTrigger>
                <TabsTrigger value="travel" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500">Travel Patterns</TabsTrigger>
                <TabsTrigger value="financial" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500">Financial Profile</TabsTrigger>
                <TabsTrigger value="technology" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500">Technology & Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Industry Specialization</Label>
                    <div className="space-y-3">
                      {["Technology", "Finance", "Manufacturing", "Healthcare", "Energy", "Consulting"].map((industry) => (
                        <div key={industry} className="flex items-center space-x-3">
                          <Checkbox 
                            id={industry.toLowerCase()} 
                            checked={advancedFilters.industries.includes(industry.toLowerCase())}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAdvancedFilters(prev => ({
                                  ...prev,
                                  industries: [...prev.industries, industry.toLowerCase()]
                                }));
                              } else {
                                setAdvancedFilters(prev => ({
                                  ...prev,
                                  industries: prev.industries.filter(i => i !== industry.toLowerCase())
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={industry.toLowerCase()} className="text-sm cursor-pointer">{industry}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Company Maturity</Label>
                    <div className="space-y-3">
                      {["Startup (1-3 years)", "Growth (4-10 years)", "Established (11-25 years)", "Enterprise (25+ years)"].map((maturity) => (
                        <div key={maturity} className="flex items-center space-x-3">
                          <Checkbox id={maturity.toLowerCase().replace(/\s+/g, '-')} />
                          <Label htmlFor={maturity.toLowerCase().replace(/\s+/g, '-')} className="text-sm cursor-pointer">{maturity}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Employee Count Range</Label>
                  <Slider 
                    value={advancedFilters.employeeRange} 
                    onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, employeeRange: value }))}
                    max={10000} 
                    step={100} 
                    className="w-full" 
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{advancedFilters.employeeRange[0]}</span>
                    <span>{advancedFilters.employeeRange[1]}+</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="travel" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Travel Frequency</Label>
                    <Select 
                      value={advancedFilters.travelFrequency} 
                      onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, travelFrequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Travel</SelectItem>
                        <SelectItem value="weekly">Weekly Travel</SelectItem>
                        <SelectItem value="monthly">Monthly Travel</SelectItem>
                        <SelectItem value="quarterly">Quarterly Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preferred Class</Label>
                    <Select 
                      value={advancedFilters.preferredClass} 
                      onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, preferredClass: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium-economy">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Annual Travel Volume (Trips)</Label>
                  <Slider defaultValue={[1000]} max={20000} step={100} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>100</span>
                    <span>20,000+</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Annual Revenue Range</Label>
                    <Select 
                      value={advancedFilters.revenueRange} 
                      onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, revenueRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10m">Under $10M</SelectItem>
                        <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                        <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                        <SelectItem value="100m-500m">$100M - $500M</SelectItem>
                        <SelectItem value="above-500m">Above $500M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Credit Rating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aaa">AAA</SelectItem>
                        <SelectItem value="aa">AA</SelectItem>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="bbb">BBB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Travel Budget Range (Annual)</Label>
                  <Slider defaultValue={[1]} max={10} step={0.5} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$500K</span>
                    <span>$10M+</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technology" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Technology Integration Requirements</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {["API Integration", "Mobile App", "Expense Management", "Real-time Booking", "Carbon Tracking", "Reporting Tools"].map((tech) => (
                        <div key={tech} className="flex items-center space-x-3">
                          <Checkbox id={tech.toLowerCase().replace(/\s+/g, '-')} />
                          <Label htmlFor={tech.toLowerCase().replace(/\s+/g, '-')} className="text-sm cursor-pointer">{tech}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sustainability Focus</Label>
                    <Select 
                      value={advancedFilters.sustainabilityLevel} 
                      onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, sustainabilityLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sustainability level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very-high">Very High</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-300 gap-3">
            <Button 
              variant="ghost" 
              onClick={() => {
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
              }}
            >
              Reset All
            </Button>
            <Button variant="outline" onClick={() => setShowAdvancedFilters(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowAdvancedFilters(false);
                handleSearch();
              }} 
              className="bg-orange-500 hover:bg-orange-600"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Company Dialog */}
      <Dialog open={showAddCompanyDialog} onOpenChange={setShowAddCompanyDialog}>
        <DialogContent className="max-w-[87rem] w-[95vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-[24px] pt-[0px] pr-[0px] pl-[0px] m-[0px]">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Plus className="h-6 w-6 text-orange-500" />
              Add New Company
            </DialogTitle>
            <DialogDescription className="text-base mt-2" style={{'color':'#717182'}}>
              Add a new company to the corporate database for potential partnership opportunities
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
              <TabsTrigger 
                value="basic"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Business Details
              </TabsTrigger>
              <TabsTrigger 
                value="travel"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Travel Profile
              </TabsTrigger>
              <TabsTrigger 
                value="additional"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Additional Info
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="max-h-[55vh] pr-4">
              <TabsContent value="basic" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-sm font-medium">Company Name *</Label>
                    <Input
                      id="company-name"
                      placeholder="Enter company name"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-type" className="text-sm font-medium">Company Type *</Label>
                    <Select value={newCompany.type} onValueChange={(value) => setNewCompany({...newCompany, type: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="llc">LLC</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm font-medium">Industry *</Label>
                    <Select value={newCompany.industry} onValueChange={(value) => setNewCompany({...newCompany, industry: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance & Banking</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="energy">Energy & Utilities</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="telecommunications">Telecommunications</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={newCompany.location}
                      onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={newCompany.phone}
                      onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                  <Input
                    id="website"
                    placeholder="www.company.com"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                    className="h-10"
                  />
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="employees" className="text-sm font-medium">Number of Employees *</Label>
                    <Input
                      id="employees"
                      type="number"
                      placeholder="1000"
                      value={newCompany.employees}
                      onChange={(e) => setNewCompany({...newCompany, employees: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue" className="text-sm font-medium">Annual Revenue (Millions)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="50"
                      value={newCompany.revenue}
                      onChange={(e) => setNewCompany({...newCompany, revenue: e.target.value})}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="established" className="text-sm font-medium">Year Established</Label>
                    <Input
                      id="established"
                      type="number"
                      placeholder="2010"
                      value={newCompany.established}
                      onChange={(e) => setNewCompany({...newCompany, established: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-size" className="text-sm font-medium">Company Size Category</Label>
                    <Select value={newCompany.companySize} onValueChange={(value) => setNewCompany({...newCompany, companySize: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select size category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup (1-50)</SelectItem>
                        <SelectItem value="small">Small (51-200)</SelectItem>
                        <SelectItem value="medium">Medium (201-1000)</SelectItem>
                        <SelectItem value="large">Large (1001-5000)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (5000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="credit-rating" className="text-sm font-medium">Credit Rating</Label>
                    <Select value={newCompany.creditRating} onValueChange={(value) => setNewCompany({...newCompany, creditRating: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select credit rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AAA">AAA</SelectItem>
                        <SelectItem value="AA">AA</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="BBB">BBB</SelectItem>
                        <SelectItem value="BB">BB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-terms" className="text-sm font-medium">Payment Terms</Label>
                    <Select value={newCompany.paymentTerms} onValueChange={(value) => setNewCompany({...newCompany, paymentTerms: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="travel" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="travel-budget" className="text-sm font-medium">Annual Travel Budget *</Label>
                    <Input
                      id="travel-budget"
                      placeholder="e.g., 2.5M"
                      value={newCompany.travelBudget}
                      onChange={(e) => setNewCompany({...newCompany, travelBudget: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annual-travel-volume" className="text-sm font-medium">Annual Travel Volume</Label>
                    <Input
                      id="annual-travel-volume"
                      placeholder="e.g., 5,000 trips"
                      value={newCompany.annualTravelVolume}
                      onChange={(e) => setNewCompany({...newCompany, annualTravelVolume: e.target.value})}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="travel-frequency" className="text-sm font-medium">Travel Frequency</Label>
                    <Select value={newCompany.travelFrequency} onValueChange={(value) => setNewCompany({...newCompany, travelFrequency: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred-class" className="text-sm font-medium">Preferred Travel Class</Label>
                    <Select value={newCompany.preferredClass} onValueChange={(value) => setNewCompany({...newCompany, preferredClass: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select class preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Economy">Economy</SelectItem>
                        <SelectItem value="Economy Plus">Economy Plus</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="First">First Class</SelectItem>
                        <SelectItem value="Business/First">Business/First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sustainability-focus" className="text-sm font-medium">Sustainability Focus</Label>
                    <Select value={newCompany.sustainabilityFocus} onValueChange={(value) => setNewCompany({...newCompany, sustainabilityFocus: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select sustainability level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Very High">Very High</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk-level" className="text-sm font-medium">Risk Level</Label>
                    <Select value={newCompany.riskLevel} onValueChange={(value) => setNewCompany({...newCompany, riskLevel: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Very Low">Very Low</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-airlines" className="text-sm font-medium">Current Airlines (comma-separated)</Label>
                  <Input
                    id="current-airlines"
                    placeholder="e.g., United, Delta, American"
                    value={newCompany.currentAirlines}
                    onChange={(e) => setNewCompany({...newCompany, currentAirlines: e.target.value})}
                    className="h-10"
                  />
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="expansion-plans" className="text-sm font-medium">Expansion Plans</Label>
                  <Select value={newCompany.expansionPlans} onValueChange={(value) => setNewCompany({...newCompany, expansionPlans: value})}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select expansion plans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Rapid">Rapid</SelectItem>
                      <SelectItem value="Stable">Stable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties" className="text-sm font-medium">Specialties (comma-separated)</Label>
                  <Textarea
                    id="specialties"
                    placeholder="Enterprise Software, Cloud Solutions, AI/ML Services"
                    value={newCompany.specialties}
                    onChange={(e) => setNewCompany({...newCompany, specialties: e.target.value})}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technology-integration" className="text-sm font-medium">Technology Integration (comma-separated)</Label>
                  <Textarea
                    id="technology-integration"
                    placeholder="API, Mobile App, Expense Management"
                    value={newCompany.technologyIntegration}
                    onChange={(e) => setNewCompany({...newCompany, technologyIntegration: e.target.value})}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about the company..."
                    value={newCompany.notes}
                    onChange={(e) => setNewCompany({...newCompany, notes: e.target.value})}
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="pt-6 border-t border-gray-300 gap-3">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setShowAddCompanyDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCompany} 
              disabled={!isFormValid() || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Company
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}