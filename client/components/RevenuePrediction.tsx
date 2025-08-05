import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Target,
  Download,
  Filter,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Activity,
  Building2,
  Users,
  Calculator,
  Zap,
  Brain,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Lightbulb,
  Sparkles,
  Database,
  TrendingRight,
  X,
  Info,
  Star,
  Award,
  ChevronRight,
  BarChart2,
  Plane,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Briefcase,
  Package,
  FileText,
  Percent,
  Timer,
  Route,
  Hotel,
  Car
} from 'lucide-react';

interface RevenuePredictionProps {
  onNavigate: (screen: string, filters?: any) => void;
}

// Mock data for revenue predictions
const monthlyPredictions = [
  { month: 'Jan 2024', actualRevenue: 2850000, predictedRevenue: 2900000, deals: 45, confidence: 92 },
  { month: 'Feb 2024', actualRevenue: 3200000, predictedRevenue: 3100000, deals: 52, confidence: 89 },
  { month: 'Mar 2024', actualRevenue: 2980000, predictedRevenue: 3000000, deals: 48, confidence: 91 },
  { month: 'Apr 2024', actualRevenue: 3400000, predictedRevenue: 3350000, deals: 56, confidence: 94 },
  { month: 'May 2024', actualRevenue: 3650000, predictedRevenue: 3600000, deals: 61, confidence: 88 },
  { month: 'Jun 2024', actualRevenue: 3800000, predictedRevenue: 3750000, deals: 63, confidence: 90 },
  { month: 'Jul 2024', actualRevenue: null, predictedRevenue: 4100000, deals: 68, confidence: 87 },
  { month: 'Aug 2024', actualRevenue: null, predictedRevenue: 4350000, deals: 72, confidence: 85 },
  { month: 'Sep 2024', actualRevenue: null, predictedRevenue: 4200000, deals: 70, confidence: 83 },
  { month: 'Oct 2024', actualRevenue: null, predictedRevenue: 4500000, deals: 75, confidence: 81 },
  { month: 'Nov 2024', actualRevenue: null, predictedRevenue: 4800000, deals: 80, confidence: 79 },
  { month: 'Dec 2024', actualRevenue: null, predictedRevenue: 5200000, deals: 85, confidence: 77 }
];

const yearlyPredictions = [
  { year: '2022', actualRevenue: 32500000, predictedRevenue: 32800000, deals: 580, growth: 15.2 },
  { year: '2023', actualRevenue: 38200000, predictedRevenue: 38000000, deals: 665, growth: 17.5 },
  { year: '2024', actualRevenue: null, predictedRevenue: 48500000, deals: 790, growth: 27.0 },
  { year: '2025', actualRevenue: null, predictedRevenue: 62800000, deals: 950, growth: 29.5 },
  { year: '2026', actualRevenue: null, predictedRevenue: 81200000, deals: 1150, growth: 29.3 }
];

const corporatePredictions = [
  { company: 'Global Tech Industries', currentRevenue: 2400000, predictedRevenue: 3200000, growth: 33.3, confidence: 89, deals: 12, probability: 'High' },
  { company: 'Enterprise Solutions Inc', currentRevenue: 1800000, predictedRevenue: 2600000, growth: 44.4, confidence: 92, deals: 8, probability: 'Very High' },
  { company: 'Innovation Labs Corp', currentRevenue: 1500000, predictedRevenue: 2100000, growth: 40.0, confidence: 85, deals: 6, probability: 'High' },
  { company: 'Digital Dynamics Ltd', currentRevenue: 2200000, predictedRevenue: 2800000, growth: 27.3, confidence: 87, deals: 10, probability: 'High' },
  { company: 'Business Systems Group', currentRevenue: 1200000, predictedRevenue: 1800000, growth: 50.0, confidence: 83, deals: 5, probability: 'Medium' },
  { company: 'Advanced Manufacturing Co', currentRevenue: 3000000, predictedRevenue: 3600000, growth: 20.0, confidence: 91, deals: 15, probability: 'Very High' }
];

// Generate detailed company-specific predictions
const generateCompanyPredictions = (companyName: string) => {
  const baseRevenue = corporatePredictions.find(c => c.company === companyName)?.currentRevenue || 2000000;
  const growthRate = corporatePredictions.find(c => c.company === companyName)?.growth || 25;
  
  const monthlyData = [
    { month: 'Jan 2024', actual: Math.round(baseRevenue * 0.07), predicted: Math.round(baseRevenue * 0.08), confidence: 94 },
    { month: 'Feb 2024', actual: Math.round(baseRevenue * 0.08), predicted: Math.round(baseRevenue * 0.085), confidence: 91 },
    { month: 'Mar 2024', actual: Math.round(baseRevenue * 0.075), predicted: Math.round(baseRevenue * 0.078), confidence: 89 },
    { month: 'Apr 2024', actual: Math.round(baseRevenue * 0.09), predicted: Math.round(baseRevenue * 0.092), confidence: 93 },
    { month: 'May 2024', actual: Math.round(baseRevenue * 0.095), predicted: Math.round(baseRevenue * 0.098), confidence: 87 },
    { month: 'Jun 2024', actual: Math.round(baseRevenue * 0.1), predicted: Math.round(baseRevenue * 0.102), confidence: 90 },
    { month: 'Jul 2024', actual: null, predicted: Math.round(baseRevenue * 0.11), confidence: 85 },
    { month: 'Aug 2024', actual: null, predicted: Math.round(baseRevenue * 0.115), confidence: 83 },
    { month: 'Sep 2024', actual: null, predicted: Math.round(baseRevenue * 0.12), confidence: 81 },
    { month: 'Oct 2024', actual: null, predicted: Math.round(baseRevenue * 0.125), confidence: 79 },
    { month: 'Nov 2024', actual: null, predicted: Math.round(baseRevenue * 0.13), confidence: 77 },
    { month: 'Dec 2024', actual: null, predicted: Math.round(baseRevenue * 0.135), confidence: 75 }
  ];

  const yearlyData = [
    { year: '2022', actual: Math.round(baseRevenue * 0.85), predicted: Math.round(baseRevenue * 0.87), growth: 12.5 },
    { year: '2023', actual: baseRevenue, predicted: Math.round(baseRevenue * 0.98), growth: 17.6 },
    { year: '2024', actual: null, predicted: Math.round(baseRevenue * (1 + growthRate/100)), growth: growthRate },
    { year: '2025', actual: null, predicted: Math.round(baseRevenue * (1 + growthRate/100) * 1.25), growth: growthRate + 5 },
    { year: '2026', actual: null, predicted: Math.round(baseRevenue * (1 + growthRate/100) * 1.5), growth: growthRate + 3 }
  ];

  const quarterlyData = [
    { quarter: 'Q1 2024', actual: Math.round(baseRevenue * 0.23), predicted: Math.round(baseRevenue * 0.245), variance: 6.5 },
    { quarter: 'Q2 2024', actual: Math.round(baseRevenue * 0.285), predicted: Math.round(baseRevenue * 0.278), variance: -2.5 },
    { quarter: 'Q3 2024', actual: null, predicted: Math.round(baseRevenue * 0.345), variance: null },
    { quarter: 'Q4 2024', actual: null, predicted: Math.round(baseRevenue * 0.395), variance: null }
  ];

  return { monthlyData, yearlyData, quarterlyData };
};

// Business statistics data
const businessStats = {
  totalBookings: 15847,
  totalRevenue: 48500000,
  averageBookingValue: 3058,
  totalFlights: 12456,
  totalHotels: 8234,
  totalCars: 3567,
  activeClients: 1247,
  newClientsThisMonth: 89,
  bookingGrowthRate: 23.5,
  revenueGrowthRate: 27.2,
  clientRetentionRate: 87.3,
  averageLeadTime: 14.2,
  cancelationRate: 3.8,
  repeatBookingRate: 64.2,
  avgDealClosure: 28,
  topDestinations: [
    { city: 'New York', bookings: 2345, revenue: 8900000 },
    { city: 'London', bookings: 1876, revenue: 7200000 },
    { city: 'Tokyo', bookings: 1456, revenue: 6100000 },
    { city: 'Singapore', bookings: 1234, revenue: 5400000 },
    { city: 'Dubai', bookings: 1123, revenue: 4800000 }
  ],
  bookingTrends: [
    { month: 'Jan 2024', bookings: 1234, revenue: 3890000, growth: 12.3 },
    { month: 'Feb 2024', bookings: 1567, revenue: 4560000, growth: 26.9 },
    { month: 'Mar 2024', bookings: 1345, revenue: 4120000, growth: 8.9 },
    { month: 'Apr 2024', bookings: 1678, revenue: 5230000, growth: 24.7 },
    { month: 'May 2024', bookings: 1789, revenue: 5680000, growth: 33.1 },
    { month: 'Jun 2024', bookings: 1456, revenue: 4890000, growth: 18.5 }
  ]
};

const predictionModels = [
  { 
    name: 'AI Neural Network', 
    accuracy: 94.2, 
    description: 'Deep learning model trained on historical data patterns',
    lastUpdated: '2024-07-15',
    status: 'active'
  },
  { 
    name: 'Regression Analysis', 
    accuracy: 89.7, 
    description: 'Statistical regression with seasonal adjustments',
    lastUpdated: '2024-07-14',
    status: 'active'
  },
  { 
    name: 'Time Series Forecasting', 
    accuracy: 91.3, 
    description: 'ARIMA model with trend and seasonality components',
    lastUpdated: '2024-07-13',
    status: 'active'
  },
  { 
    name: 'Market Intelligence', 
    accuracy: 87.1, 
    description: 'Industry trends and market condition analysis',
    lastUpdated: '2024-07-12',
    status: 'secondary'
  }
];

const keyMetrics = {
  totalPipelineValue: 125000000,
  weightedPipelineValue: 68000000,
  averageDealSize: 850000,
  conversionRate: 23.5,
  salesCycleLength: 45,
  forecastAccuracy: 91.8,
  quarterlyGrowthRate: 28.5,
  yearOverYearGrowth: 27.0
};

const scenarioPlanning = [
  {
    scenario: 'Conservative',
    probability: 85,
    q3Revenue: 12500000,
    q4Revenue: 14200000,
    yearEndRevenue: 45800000,
    description: 'Cautious growth with market uncertainties'
  },
  {
    scenario: 'Realistic',
    probability: 70,
    q3Revenue: 13800000,
    q4Revenue: 16200000,
    yearEndRevenue: 48500000,
    description: 'Expected growth based on current trends'
  },
  {
    scenario: 'Optimistic',
    probability: 45,
    q3Revenue: 15200000,
    q4Revenue: 18800000,
    yearEndRevenue: 52600000,
    description: 'Aggressive growth with favorable conditions'
  }
];

export function RevenuePrediction({ onNavigate }: RevenuePredictionProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('yearly');
  const [selectedModel, setSelectedModel] = useState('AI Neural Network');
  const [selectedScenario, setSelectedScenario] = useState('Realistic');
  const [showCompanyDrillDown, setShowCompanyDrillDown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companyDrillDownTab, setCompanyDrillDownTab] = useState('monthly');
  const [filters, setFilters] = useState({
    region: 'all',
    industry: 'all',
    dealSize: 'all',
    confidence: 'all'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 30) return 'text-green-600';
    if (growth >= 20) return 'text-blue-600';
    if (growth >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'Very High': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewCompany = (corporate: any) => {
    setSelectedCompany(corporate);
    setShowCompanyDrillDown(true);
    setCompanyDrillDownTab('monthly');
  };

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Revenue Prediction Analytics
          </h2>
          <p className="text-muted-foreground">AI-powered revenue forecasting and sales predictions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(keyMetrics.totalPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(keyMetrics.forecastAccuracy)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.3%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YoY Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(keyMetrics.yearOverYearGrowth)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Above target</span> of 25%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(keyMetrics.averageDealSize)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> increase
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger 
            value="overview"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="monthly"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Monthly Forecast
          </TabsTrigger>
          <TabsTrigger 
            value="yearly"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Yearly Forecast
          </TabsTrigger>
          <TabsTrigger 
            value="corporate"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Corporate Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="scenarios"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Scenario Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Business Statistics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Business Performance Overview
              </CardTitle>
              <CardDescription>
                Comprehensive statistics on bookings, revenue, and key business metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <Package className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-2xl font-bold">{formatNumber(businessStats.totalBookings)}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                    <div className="text-xs" style={{ color: 'var(--color-blue-brand-600)' }}>+{formatPercentage(businessStats.bookingGrowthRate)} YoY</div>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-2xl font-bold">{formatCurrency(businessStats.totalRevenue)}</div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                    <div className="text-xs" style={{ color: 'var(--color-blue-brand-600)' }}>+{formatPercentage(businessStats.revenueGrowthRate)} YoY</div>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <Building2 className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-2xl font-bold">{formatNumber(businessStats.activeClients)}</div>
                    <div className="text-sm text-muted-foreground">Active Clients</div>
                    <div className="text-xs" style={{ color: 'var(--color-blue-brand-600)' }}>+{businessStats.newClientsThisMonth} this month</div>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <Calculator className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-2xl font-bold">{formatCurrency(businessStats.averageBookingValue)}</div>
                    <div className="text-sm text-muted-foreground">Avg Booking Value</div>
                    <div className="text-xs" style={{ color: 'var(--color-blue-brand-600)' }}>+15% increase</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Travel Services Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Travel Services Breakdown
              </CardTitle>
              <CardDescription>
                Distribution of bookings across different travel services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Flights</div>
                      <div className="text-sm text-muted-foreground">{formatNumber(businessStats.totalFlights)} bookings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatPercentage((businessStats.totalFlights / businessStats.totalBookings) * 100)}</div>
                    <div className="text-xs text-muted-foreground">of total</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Hotel className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Hotels</div>
                      <div className="text-sm text-muted-foreground">{formatNumber(businessStats.totalHotels)} bookings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatPercentage((businessStats.totalHotels / businessStats.totalBookings) * 100)}</div>
                    <div className="text-xs text-muted-foreground">of total</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Car className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Car Rentals</div>
                      <div className="text-sm text-muted-foreground">{formatNumber(businessStats.totalCars)} bookings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatPercentage((businessStats.totalCars / businessStats.totalBookings) * 100)}</div>
                    <div className="text-xs text-muted-foreground">of total</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Client Retention Rate</span>
                    <span className="font-medium">{formatPercentage(businessStats.clientRetentionRate)}</span>
                  </div>
                  <Progress value={businessStats.clientRetentionRate} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Repeat Booking Rate</span>
                    <span className="font-medium">{formatPercentage(businessStats.repeatBookingRate)}</span>
                  </div>
                  <Progress value={businessStats.repeatBookingRate} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Lead Time</span>
                    <span className="font-medium">{businessStats.averageLeadTime} days</span>
                  </div>
                  <Progress value={(businessStats.averageLeadTime / 30) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Deal Closure Time</span>
                    <span className="font-medium">{businessStats.avgDealClosure} days</span>
                  </div>
                  <Progress value={(businessStats.avgDealClosure / 60) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Destinations
                </CardTitle>
                <CardDescription>
                  Most popular travel destinations by booking volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {businessStats.topDestinations.map((destination, index) => (
                    <div key={destination.city} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{destination.city}</div>
                          <div className="text-sm text-muted-foreground">{formatNumber(destination.bookings)} bookings</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(destination.revenue)}</div>
                        <div className="text-xs text-muted-foreground">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Monthly Booking Trends
              </CardTitle>
              <CardDescription>
                Monthly performance trends showing bookings, revenue, and growth rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessStats.bookingTrends.map((trend) => (
                  <div key={trend.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium w-20">{trend.month}</div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="font-medium">{formatNumber(trend.bookings)}</div>
                          <div className="text-xs text-muted-foreground">Bookings</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{formatCurrency(trend.revenue)}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${trend.growth >= 20 ? 'text-green-600' : trend.growth >= 10 ? 'text-blue-600' : 'text-yellow-600'}`}>
                        {trend.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{formatPercentage(trend.growth)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Strong Q3 Performance Expected</p>
                    <p className="text-sm text-muted-foreground">Revenue projected to exceed target by 12%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Enterprise Segment Growth</p>
                    <p className="text-sm text-muted-foreground">Large deals increasing average contract value</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Seasonal Dip in December</p>
                    <p className="text-sm text-muted-foreground">Plan for typical holiday season slowdown</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">2025 Pipeline Building</p>
                    <p className="text-sm text-muted-foreground">Early indicators show 29% growth potential</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Data Quality & Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Historical Sales Data</span>
                    <Badge variant="outline">100% Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Intelligence</span>
                    <Badge variant="outline">Real-time</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Economic Indicators</span>
                    <Badge variant="outline">Daily Updates</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Industry Trends</span>
                    <Badge variant="outline">Weekly Sync</Badge>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Prediction Confidence</span>
                    <span className="text-sm font-medium">91.8%</span>
                  </div>
                  <Progress value={91.8} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on 36 months of historical data and current market conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Monthly Revenue Predictions
                  </CardTitle>
                  <CardDescription>
                    Detailed month-by-month revenue forecasting with confidence intervals
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {predictionModels.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Actual Revenue</TableHead>
                      <TableHead>Predicted Revenue</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Deals</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyPredictions.map((prediction) => {
                      const variance = prediction.actualRevenue 
                        ? ((prediction.actualRevenue - prediction.predictedRevenue) / prediction.predictedRevenue) * 100
                        : null;
                      
                      return (
                        <TableRow key={prediction.month}>
                          <TableCell className="font-medium">{prediction.month}</TableCell>
                          <TableCell>
                            {prediction.actualRevenue 
                              ? formatCurrency(prediction.actualRevenue)
                              : <span className="text-muted-foreground">Pending</span>
                            }
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(prediction.predictedRevenue)}
                          </TableCell>
                          <TableCell>
                            {variance !== null ? (
                              <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {variance >= 0 ? '+' : ''}{formatPercentage(variance)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{prediction.deals}</TableCell>
                          <TableCell>
                            <span className={getConfidenceColor(prediction.confidence)}>
                              {formatPercentage(prediction.confidence)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {prediction.month.includes('2024') && !prediction.actualRevenue ? (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">Growing</span>
                              </div>
                            ) : prediction.actualRevenue ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-600">Actual</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-400">Future</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Yearly Revenue Forecasting
              </CardTitle>
              <CardDescription>
                Long-term revenue projections with growth analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">2024</div>
                      <div className="text-sm text-muted-foreground">Current Year</div>
                      <div className="text-lg font-medium mt-2">{formatCurrency(48500000)}</div>
                      <div className="text-sm text-green-600">+27% growth</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">2025</div>
                      <div className="text-sm text-muted-foreground">Next Year</div>
                      <div className="text-lg font-medium mt-2">{formatCurrency(62800000)}</div>
                      <div className="text-sm text-green-600">+29.5% growth</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-purple-200 bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">2026</div>
                      <div className="text-sm text-muted-foreground">Long-term</div>
                      <div className="text-lg font-medium mt-2">{formatCurrency(81200000)}</div>
                      <div className="text-sm text-green-600">+29.3% growth</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Actual Revenue</TableHead>
                        <TableHead>Predicted Revenue</TableHead>
                        <TableHead>Total Deals</TableHead>
                        <TableHead>Growth Rate</TableHead>
                        <TableHead>Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyPredictions.map((prediction) => (
                        <TableRow key={prediction.year}>
                          <TableCell className="font-medium">{prediction.year}</TableCell>
                          <TableCell>
                            {prediction.actualRevenue 
                              ? formatCurrency(prediction.actualRevenue)
                              : <span className="text-muted-foreground">Projected</span>
                            }
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(prediction.predictedRevenue)}
                          </TableCell>
                          <TableCell>{prediction.deals}</TableCell>
                          <TableCell>
                            <span className={getGrowthColor(prediction.growth)}>
                              +{formatPercentage(prediction.growth)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {prediction.actualRevenue ? (
                              <Badge variant="outline" className="text-green-600">
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Forecast
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Corporate Revenue Analysis
              </CardTitle>
              <CardDescription>
                Individual corporate client revenue predictions and growth opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Region Filter</Label>
                    <Select value={filters.region} onValueChange={(value) => setFilters({...filters, region: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Industry Filter</Label>
                    <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Deal Size</Label>
                    <Select value={filters.dealSize} onValueChange={(value) => setFilters({...filters, dealSize: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        <SelectItem value="enterprise">Enterprise (&gt;$1M)</SelectItem>
                        <SelectItem value="mid-market">Mid-Market ($100K-$1M)</SelectItem>
                        <SelectItem value="small">Small (&lt;$100K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Confidence Level</Label>
                    <Select value={filters.confidence} onValueChange={(value) => setFilters({...filters, confidence: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="high">High (&gt;90%)</SelectItem>
                        <SelectItem value="medium">Medium (70-90%)</SelectItem>
                        <SelectItem value="low">Low (&lt;70%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Current Revenue</TableHead>
                        <TableHead>Predicted Revenue</TableHead>
                        <TableHead>Growth</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Active Deals</TableHead>
                        <TableHead>Probability</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {corporatePredictions.map((corporate) => (
                        <TableRow key={corporate.company}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{corporate.company}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(corporate.currentRevenue)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(corporate.predictedRevenue)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <ArrowUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">+{formatPercentage(corporate.growth)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={getConfidenceColor(corporate.confidence)}>
                              {formatPercentage(corporate.confidence)}
                            </span>
                          </TableCell>
                          <TableCell>{corporate.deals}</TableCell>
                          <TableCell>
                            <Badge className={getProbabilityColor(corporate.probability)}>
                              {corporate.probability}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleViewCompany(corporate)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Scenario Planning & Analysis
              </CardTitle>
              <CardDescription>
                Multiple revenue scenarios based on different market conditions and assumptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarioPlanning.map((scenario) => (
                    <Card 
                      key={scenario.scenario} 
                      className={`cursor-pointer transition-all ${
                        selectedScenario === scenario.scenario 
                          ? 'border-2 border-blue-500 bg-blue-50' 
                          : 'border hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedScenario(scenario.scenario)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{scenario.scenario}</h3>
                          <Badge variant="outline">
                            {formatPercentage(scenario.probability)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {scenario.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Q3 Revenue:</span>
                            <span className="font-medium">{formatCurrency(scenario.q3Revenue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Q4 Revenue:</span>
                            <span className="font-medium">{formatCurrency(scenario.q4Revenue)}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2">
                            <span>Year-End Total:</span>
                            <span className="font-bold">{formatCurrency(scenario.yearEndRevenue)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Impact Analysis</CardTitle>
                    <CardDescription>
                      Detailed breakdown of the selected scenario: {selectedScenario}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Key Assumptions</h4>
                        {selectedScenario === 'Conservative' && (
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Market uncertainties affect deal closure rates</li>
                            <li>• 15% slower sales cycle due to economic conditions</li>
                            <li>• Average deal size remains stable</li>
                            <li>• Conservative expansion in new markets</li>
                          </ul>
                        )}
                        {selectedScenario === 'Realistic' && (
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Current market trends continue</li>
                            <li>• Normal seasonal variations apply</li>
                            <li>• Expected customer acquisition rate</li>
                            <li>• Steady expansion into new verticals</li>
                          </ul>
                        )}
                        {selectedScenario === 'Optimistic' && (
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Favorable market conditions accelerate growth</li>
                            <li>• Successful product launches drive revenue</li>
                            <li>• Higher than expected deal closure rates</li>
                            <li>• Aggressive market expansion succeeds</li>
                          </ul>
                        )}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">Risk Factors</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Market Risk</span>
                            <Badge variant={selectedScenario === 'Conservative' ? 'destructive' : selectedScenario === 'Realistic' ? 'secondary' : 'outline'}>
                              {selectedScenario === 'Conservative' ? 'High' : selectedScenario === 'Realistic' ? 'Medium' : 'Low'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Competition Risk</span>
                            <Badge variant={selectedScenario === 'Optimistic' ? 'destructive' : 'secondary'}>
                              {selectedScenario === 'Optimistic' ? 'High' : 'Medium'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Execution Risk</span>
                            <Badge variant={selectedScenario === 'Optimistic' ? 'destructive' : selectedScenario === 'Realistic' ? 'secondary' : 'outline'}>
                              {selectedScenario === 'Optimistic' ? 'High' : selectedScenario === 'Realistic' ? 'Medium' : 'Low'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Company Drill-Down Dialog */}
      <Dialog open={showCompanyDrillDown} onOpenChange={setShowCompanyDrillDown}>
        <DialogContent className="w-[1104px] max-w-[1104px] max-h-[90vh] overflow-y-auto p-6 sm:w-[95vw] sm:max-w-[95vw] md:w-[1104px] md:max-w-[1104px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Revenue Prediction: {selectedCompany?.company}
            </DialogTitle>
            <DialogDescription>
              Detailed revenue forecasting and growth analysis for {selectedCompany?.company}
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-lg font-bold">{formatCurrency(selectedCompany.currentRevenue)}</div>
                    <div className="text-sm text-muted-foreground">Current Revenue</div>
                  </CardContent>
                </Card>
                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-lg font-bold">{formatCurrency(selectedCompany.predictedRevenue)}</div>
                    <div className="text-sm text-muted-foreground">Predicted Revenue</div>
                  </CardContent>
                </Card>
                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <ArrowUp className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-lg font-bold">+{formatPercentage(selectedCompany.growth)}</div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                  </CardContent>
                </Card>
                <Card className="border-2" style={{ borderColor: 'var(--color-blue-brand-200)', backgroundColor: 'var(--color-blue-brand-50)' }}>
                  <CardContent className="p-4 text-center">
                    <Target className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-blue-brand-600)' }} />
                    <div className="text-lg font-bold">{formatPercentage(selectedCompany.confidence)}</div>
                    <div className="text-sm text-muted-foreground">Confidence Level</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={companyDrillDownTab} onValueChange={setCompanyDrillDownTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
                  <TabsTrigger 
                    value="monthly"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Monthly Breakdown
                  </TabsTrigger>
                  <TabsTrigger 
                    value="yearly"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Yearly Projections
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quarterly"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Quarterly Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Monthly Revenue Predictions for {selectedCompany.company}
                      </CardTitle>
                      <CardDescription>
                        Detailed month-by-month revenue forecasting with confidence intervals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Actual Revenue</TableHead>
                              <TableHead>Predicted Revenue</TableHead>
                              <TableHead>Variance</TableHead>
                              <TableHead>Confidence</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateCompanyPredictions(selectedCompany.company).monthlyData.map((data) => {
                              const variance = data.actual 
                                ? ((data.actual - data.predicted) / data.predicted) * 100
                                : null;
                              
                              return (
                                <TableRow key={data.month}>
                                  <TableCell className="font-medium">{data.month}</TableCell>
                                  <TableCell>
                                    {data.actual 
                                      ? formatCurrency(data.actual)
                                      : <span className="text-muted-foreground">Pending</span>
                                    }
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatCurrency(data.predicted)}
                                  </TableCell>
                                  <TableCell>
                                    {variance !== null ? (
                                      <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {variance >= 0 ? '+' : ''}{formatPercentage(variance)}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <span className={getConfidenceColor(data.confidence)}>
                                      {formatPercentage(data.confidence)}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {data.actual ? (
                                      <Badge variant="outline" className="text-blue-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Actual
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Forecast
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="yearly" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Yearly Revenue Projections for {selectedCompany.company}
                      </CardTitle>
                      <CardDescription>
                        Long-term revenue forecasting with growth trajectory analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Year</TableHead>
                              <TableHead>Actual Revenue</TableHead>
                              <TableHead>Predicted Revenue</TableHead>
                              <TableHead>Growth Rate</TableHead>
                              <TableHead>Revenue Change</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateCompanyPredictions(selectedCompany.company).yearlyData.map((data) => {
                              const changeFromPrevious = data.actual || data.predicted;
                              
                              return (
                                <TableRow key={data.year}>
                                  <TableCell className="font-medium">{data.year}</TableCell>
                                  <TableCell>
                                    {data.actual 
                                      ? formatCurrency(data.actual)
                                      : <span className="text-muted-foreground">Projected</span>
                                    }
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatCurrency(data.predicted)}
                                  </TableCell>
                                  <TableCell>
                                    <span className={getGrowthColor(data.growth)}>
                                      +{formatPercentage(data.growth)}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <ArrowUp className="h-4 w-4 text-green-600" />
                                      <span className="text-green-600">
                                        +{formatCurrency((data.predicted || data.actual || 0) * (data.growth / 100))}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {data.actual ? (
                                      <Badge variant="outline" className="text-green-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Forecast
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quarterly" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5" />
                        Quarterly Performance Analysis for {selectedCompany.company}
                      </CardTitle>
                      <CardDescription>
                        Quarterly revenue breakdown with variance analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Quarter</TableHead>
                              <TableHead>Actual Revenue</TableHead>
                              <TableHead>Predicted Revenue</TableHead>
                              <TableHead>Variance</TableHead>
                              <TableHead>Performance</TableHead>
                              <TableHead>Trend</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateCompanyPredictions(selectedCompany.company).quarterlyData.map((data) => (
                              <TableRow key={data.quarter}>
                                <TableCell className="font-medium">{data.quarter}</TableCell>
                                <TableCell>
                                  {data.actual 
                                    ? formatCurrency(data.actual)
                                    : <span className="text-muted-foreground">Pending</span>
                                  }
                                </TableCell>
                                <TableCell className="font-medium">
                                  {formatCurrency(data.predicted)}
                                </TableCell>
                                <TableCell>
                                  {data.variance !== null ? (
                                    <span className={data.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                      {data.variance >= 0 ? '+' : ''}{formatPercentage(data.variance)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {data.variance !== null ? (
                                    data.variance >= 0 ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Above Target
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-red-100 text-red-800">
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                        Below Target
                                      </Badge>
                                    )
                                  ) : (
                                    <Badge variant="secondary">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Upcoming
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-600">Growing</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompanyDrillDown(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowCompanyDrillDown(false);
              onNavigate('corporate-search', { company: selectedCompany?.company });
            }}>
              <ChevronRight className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}