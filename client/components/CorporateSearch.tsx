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

const mockCorporates = [
  {
    id: 1,
    name: "TechCorp International",
    type: "Technology Company",
    industry: "Software & IT Services",
    location: "San Francisco, USA",
    aiScore: 98,
    rating: 4.9,
    established: 2010,
    employees: 2500,
    specialties: ["Enterprise Software", "Cloud Solutions", "AI/ML Services"],
    travelBudget: "2.5M",
    annualTravelVolume: "5,000 trips",
    contracts: 12,
    revenue: 50000000,
    phone: "+1 (555) 123-4567",
    email: "corporate@techcorp.com",
    website: "www.techcorp.com",
    aiRecommendation: "High-value corporate with significant travel needs. Excellent potential for premium airline partnerships and volume discounts.",
    compliance: 95,
    financialStability: 98,
    travelFrequency: "Weekly",
    destinations: ["Global", "North America", "Europe", "Asia-Pacific"],
    preferredClass: "Business",
    teamSize: 150,
    travelManagers: 3,
    currentAirlines: ["United", "Delta", "British Airways"],
    paymentTerms: "Net 30",
    creditRating: "AAA",
    sustainabilityFocus: "High",
    technologyIntegration: ["API", "Mobile App", "Expense Management"],
    seasonality: "Year-round",
    meetingTypes: ["Conferences", "Client Visits", "Team Offsites"],
    companySize: "Enterprise",
    marketSegment: "Technology",
    decisionMakers: 5,
    contractValue: 2800000,
    competitorAirlines: 3,
    loyaltyPotential: 92,
    expansionPlans: "Aggressive",
    riskLevel: "Low"
  },
  {
    id: 2,
    name: "Global Manufacturing Ltd",
    type: "Manufacturing Corporation",
    industry: "Industrial Manufacturing",
    location: "Detroit, USA",
    aiScore: 92,
    rating: 4.7,
    established: 1985,
    employees: 5000,
    specialties: ["Automotive Parts", "Supply Chain", "Quality Control"],
    travelBudget: "1.8M",
    annualTravelVolume: "3,200 trips",
    contracts: 8,
    revenue: 75000000,
    phone: "+1 (555) 234-5678",
    email: "travel@globalmanufacturing.com",
    website: "www.globalmanufacturing.com",
    aiRecommendation: "Established manufacturing giant with consistent travel patterns. Strong potential for long-term partnership with volume commitments.",
    compliance: 88,
    financialStability: 94,
    travelFrequency: "Monthly",
    destinations: ["North America", "Europe", "Asia"],
    preferredClass: "Economy Plus",
    teamSize: 80,
    travelManagers: 2,
    currentAirlines: ["American", "Lufthansa"],
    paymentTerms: "Net 45",
    creditRating: "AA",
    sustainabilityFocus: "Medium",
    technologyIntegration: ["GDS", "Corporate Portal"],
    seasonality: "Q1/Q3 Heavy",
    meetingTypes: ["Supplier Visits", "Trade Shows"],
    companySize: "Large Enterprise",
    marketSegment: "Manufacturing",
    decisionMakers: 3,
    contractValue: 1950000,
    competitorAirlines: 2,
    loyaltyPotential: 85,
    expansionPlans: "Moderate",
    riskLevel: "Low"
  },
  {
    id: 3,
    name: "Sunrise Financial Services",
    type: "Financial Services",
    industry: "Banking & Finance",
    location: "New York, USA",
    aiScore: 95,
    rating: 4.8,
    established: 1995,
    employees: 1200,
    specialties: ["Investment Banking", "Wealth Management", "Corporate Finance"],
    travelBudget: "3.2M",
    annualTravelVolume: "6,800 trips",
    contracts: 15,
    revenue: 120000000,
    phone: "+1 (555) 345-6789",
    email: "corporate.travel@sunrisefinancial.com",
    website: "www.sunrisefinancial.com",
    aiRecommendation: "Premium financial services firm with high-frequency travel. Excellent candidate for business class partnerships and flexible booking options.",
    compliance: 97,
    financialStability: 99,
    travelFrequency: "Daily",
    destinations: ["Global", "Financial Centers"],
    preferredClass: "Business/First",
    teamSize: 200,
    travelManagers: 5,
    currentAirlines: ["Emirates", "Singapore Airlines", "Cathay Pacific"],
    paymentTerms: "Net 15",
    creditRating: "AAA",
    sustainabilityFocus: "High",
    technologyIntegration: ["API", "Mobile App", "Real-time Booking"],
    seasonality: "Year-round Peak",
    meetingTypes: ["Client Meetings", "Deal Closings", "Conferences"],
    companySize: "Large Enterprise",
    marketSegment: "Financial Services",
    decisionMakers: 7,
    contractValue: 4200000,
    competitorAirlines: 4,
    loyaltyPotential: 88,
    expansionPlans: "Aggressive",
    riskLevel: "Very Low"
  },
  {
    id: 4,
    name: "EcoEnergy Solutions",
    type: "Energy Company",
    industry: "Renewable Energy",
    location: "Austin, USA",
    aiScore: 89,
    rating: 4.6,
    established: 2015,
    employees: 800,
    specialties: ["Solar Energy", "Wind Power", "Sustainability Consulting"],
    travelBudget: "1.2M",
    annualTravelVolume: "2,400 trips",
    contracts: 6,
    revenue: 25000000,
    phone: "+1 (555) 456-7890",
    email: "logistics@ecoenergy.com",
    website: "www.ecoenergy.com",
    aiRecommendation: "Fast-growing renewable energy company with sustainability focus. Perfect match for airlines with carbon offset programs.",
    compliance: 85,
    financialStability: 87,
    travelFrequency: "Bi-weekly",
    destinations: ["North America", "Project Sites"],
    preferredClass: "Economy",
    teamSize: 45,
    travelManagers: 1,
    currentAirlines: ["Southwest", "JetBlue"],
    paymentTerms: "Net 30",
    creditRating: "A+",
    sustainabilityFocus: "Very High",
    technologyIntegration: ["Mobile App", "Carbon Tracking"],
    seasonality: "Spring/Summer Peak",
    meetingTypes: ["Site Visits", "Regulatory Meetings"],
    companySize: "Mid-Market",
    marketSegment: "Energy",
    decisionMakers: 2,
    contractValue: 1350000,
    competitorAirlines: 2,
    loyaltyPotential: 78,
    expansionPlans: "Rapid",
    riskLevel: "Medium"
  }
];

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

  const [filteredCorporates, setFilteredCorporates] = useState(mockCorporates);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCorporateProfile, setShowCorporateProfile] = useState(false);
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);

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

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Apply actual filtering logic
    let filtered = mockCorporates.filter(corporate => {
      // Industry filter
      if (searchParams.industry && searchParams.industry !== corporate.marketSegment.toLowerCase()) {
        return false;
      }

      // Location filter
      if (searchParams.location) {
        const locationMatch = {
          'north-america': ['USA', 'United States', 'North America'],
          'europe': ['Europe', 'UK', 'Germany', 'France'],
          'asia-pacific': ['Asia', 'Asia-Pacific', 'Japan', 'Singapore'],
          'global': ['Global'],
          'emerging': ['Emerging']
        };

        const matchingRegions = locationMatch[searchParams.location] || [];
        const corporateLocation = corporate.location;

        if (!matchingRegions.some(region => corporateLocation.includes(region))) {
          return false;
        }
      }

      // Travel Budget filter
      if (searchParams.travelBudget) {
        const budget = parseFloat(corporate.travelBudget.replace(/[^\d.]/g, ''));
        const budgetRanges = {
          'under-500k': [0, 0.5],
          '500k-1m': [0.5, 1],
          '1m-3m': [1, 3],
          '3m-5m': [3, 5],
          'above-5m': [5, Infinity]
        };

        const [min, max] = budgetRanges[searchParams.travelBudget] || [0, Infinity];
        if (budget < min || budget > max) {
          return false;
        }
      }

      // Company Size filter
      if (searchParams.companySize) {
        const sizeMapping = {
          'startup': ['Startup'],
          'small': ['Small'],
          'medium': ['Medium', 'Mid-Market'],
          'large': ['Large', 'Large Enterprise'],
          'enterprise': ['Enterprise']
        };

        const expectedSizes = sizeMapping[searchParams.companySize] || [];
        if (!expectedSizes.some(size => corporate.companySize.includes(size))) {
          return false;
        }
      }

      // Travel Frequency filter
      if (searchParams.travelFrequency) {
        const frequencyMapping = {
          'daily': 'Daily',
          'weekly': 'Weekly',
          'monthly': 'Monthly',
          'quarterly': 'Quarterly',
          'annual': 'Annual'
        };

        const expectedFreq = frequencyMapping[searchParams.travelFrequency];
        if (expectedFreq && corporate.travelFrequency !== expectedFreq) {
          return false;
        }
      }

      return true;
    });

    setFilteredCorporates(filtered);
    setIsSearching(false);
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

      // Add to mock data for display
      mockCorporates.push(companyDataForFrontend);
      setFilteredCorporates([...mockCorporates]);

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
      setSuccessMessage(`${companyDataForFrontend.name} has been successfully added to the corporate database.`);
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

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-500";
    if (score >= 90) return "text-blue-600";
    if (score >= 85) return "text-yellow-600";
    return "text-gray-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 95) return "default";
    if (score >= 90) return "secondary";
    return "outline";
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
    <div className="w-full h-full space-y-6 p-3">
      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Search Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Corporate Client Discovery
              </CardTitle>
              <CardDescription>
                AI-powered search to discover and evaluate potential corporate travel partnerships
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddCompanyDialog(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry Sector</Label>
              <Select value={searchParams.industry} onValueChange={(value) => setSearchParams({...searchParams, industry: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="financial services">Financial Services</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="telecommunications">Telecommunications</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Geographic Focus</Label>
              <Select value={searchParams.location} onValueChange={(value) => setSearchParams({...searchParams, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="global">Global Operations</SelectItem>
                  <SelectItem value="emerging">Emerging Markets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="travelBudget">Annual Travel Budget</Label>
              <Select value={searchParams.travelBudget} onValueChange={(value) => setSearchParams({...searchParams, travelBudget: value})}>
                <SelectTrigger>
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

            <div className="space-y-1.5">
              <Label htmlFor="companySize">Company Size</Label>
              <Select value={searchParams.companySize} onValueChange={(value) => setSearchParams({...searchParams, companySize: value})}>
                <SelectTrigger>
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

            <div className="space-y-1.5">
              <Label htmlFor="travelFrequency">Travel Frequency</Label>
              <Select value={searchParams.travelFrequency} onValueChange={(value) => setSearchParams({...searchParams, travelFrequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Travel</SelectItem>
                  <SelectItem value="weekly">Weekly Travel</SelectItem>
                  <SelectItem value="monthly">Monthly Travel</SelectItem>
                  <SelectItem value="quarterly">Quarterly Travel</SelectItem>
                  <SelectItem value="annual">Annual Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleSearch} disabled={isSearching} className="flex items-center gap-2">
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  AI Processing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Corporates
                </>
              )}
            </Button>

            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowAdvancedFilters(true)}>
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>

            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => {
                setSearchParams({
                  industry: '',
                  location: '',
                  travelBudget: '',
                  companySize: '',
                  travelFrequency: ''
                });
                setFilteredCorporates(mockCorporates);
              }}
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            {filteredCorporates.length} corporate prospects found matching your criteria
            {Object.values(searchParams).some(value => value) && (
              <span className="ml-2 text-blue-600">
                • Filters active: {Object.entries(searchParams).filter(([key, value]) => value).map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)).join(', ')}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredCorporates.map((corporate) => (
              <Card key={corporate.id} className="shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #C9C9C9' }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{corporate.name}</h3>
                          <Badge variant={getScoreBadge(corporate.aiScore)}>
                            AI Score: {corporate.aiScore}
                          </Badge>
                          {movedAsLeadIds.has(corporate.id) && (
                            <Badge variant="default" className="bg-green-500">
                              ✓ Moved to Leads
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1 text-sm">{corporate.type} • {corporate.industry}</p>
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
                          <a
                            href={`https://${corporate.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Globe className="h-3 w-3" />
                            {corporate.website}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{corporate.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        ${corporate.travelBudget} budget
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Revenue: ${(corporate.revenue / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Travel: {corporate.annualTravelVolume}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Frequency: {corporate.travelFrequency}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Credit: {corporate.creditRating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Class: {corporate.preferredClass}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Risk: {corporate.riskLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {corporate.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">AI Partnership Recommendation</p>
                        <p className="text-sm text-blue-800 mt-1">{corporate.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewProfile(corporate)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Full Profile
                    </Button>

                    <Button 
                      variant="secondary"
                      size="sm" 
                      onClick={() => handleMoveAsLead(corporate)}
                      disabled={movedAsLeadIds.has(corporate.id)}
                    >
                      {movedAsLeadIds.has(corporate.id) ? 'Moved to Leads' : 'Move as Lead'}
                    </Button>

                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact
                    </Button>


                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Dialog */}
      <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <DialogContent className="max-w-[60rem] w-[95vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Filter className="h-6 w-6 text-[#FD9646]" />
              Advanced Search Filters
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Apply detailed criteria to discover the most relevant corporate travel prospects for your business
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="business" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646]">Business Criteria</TabsTrigger>
                <TabsTrigger value="travel" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646]">Travel Patterns</TabsTrigger>
                <TabsTrigger value="financial" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646]">Financial Profile</TabsTrigger>
                <TabsTrigger value="technology" className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646]">Technology & Preferences</TabsTrigger>
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

          <DialogFooter className="pt-6 border-t gap-3">
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
              className="bg-[#FD9646] hover:bg-[#FD9646]/90"
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
              <Plus className="h-6 w-6 text-[#FD9646]" />
              Add New Company
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Add a new company to the corporate database for potential partnership opportunities
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
              <TabsTrigger 
                value="basic"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Business Details
              </TabsTrigger>
              <TabsTrigger 
                value="travel"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Travel Profile
              </TabsTrigger>
              <TabsTrigger 
                value="additional"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
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

          <DialogFooter className="pt-6 border-t gap-3">
            <Button variant="outline" onClick={() => setShowAddCompanyDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCompany} 
              disabled={!isFormValid() || isSubmitting}
              className="bg-[#FD9646] hover:bg-[#FD9646]/90"
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