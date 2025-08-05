import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Send,
  PenTool,
  Calendar,
  DollarSign,
  User,
  Filter,
  Search,
  Shield,
  MessageSquare,
  Paperclip,
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Info,
  Lightbulb,
  BarChart3,
  Users,
  Star,
  Activity,
  ArrowRight,
  Package,
  Tag,
  Percent,
  FileDown,
  Save,
  ExternalLink
} from 'lucide-react';

const contracts = [
  {
    id: 'CTR-2024-001',
    vendor: 'Global Travel Solutions',
    client: 'Airline Operations',
    type: 'Master Service Agreement',
    value: 1250000,
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    signedDate: '2024-01-10',
    progress: 100,
    nextAction: 'Renewal Review',
    documents: 5,
    breachRisk: 'High',
    breachCount: 2,
    parties: ['SOAR-AI Airlines', 'Global Travel Solutions'],
    attachedOffer: {
      id: 'OFF-001',
      title: 'Premium Business Class Package',
      status: 'Active',
      discount: 25,
      validFrom: '2024-01-15',
      validTo: '2024-12-31',
      appliedDiscounts: ['DISC-001', 'DISC-003'],
      promoCodes: ['PROMO-001']
    },
    milestones: [
      { name: 'Contract Signing', date: '2024-01-10', status: 'completed' },
      { name: 'Service Launch', date: '2024-01-15', status: 'completed' },
      { name: 'Q2 Review', date: '2024-04-15', status: 'completed' },
      { name: 'Q3 Review', date: '2024-07-15', status: 'upcoming' },
      { name: 'Renewal Discussion', date: '2024-10-15', status: 'upcoming' }
    ],
    comments: [
      { id: 1, author: 'John Smith', date: '2024-06-15', content: 'Performance review completed. Some concerns about response times.' },
      { id: 2, author: 'Sarah Johnson', date: '2024-06-10', content: 'Vendor has provided action plan for improvement.' },
      { id: 3, author: 'Mike Wilson', date: '2024-06-05', content: 'Escalated SLA compliance issues to management.' }],

    attachments: [
      { name: 'Master Service Agreement.pdf', size: '2.4 MB', uploadDate: '2024-01-10', type: 'Contract' },
      { name: 'SLA Addendum.pdf', size: '856 KB', uploadDate: '2024-02-15', type: 'Amendment' },
      { name: 'Performance Report Q1.pdf', size: '1.2 MB', uploadDate: '2024-04-15', type: 'Report' },
      { name: 'Renewal Terms Draft.pdf', size: '1.8 MB', uploadDate: '2024-06-10', type: 'Draft' },
      { name: 'Vendor Response Letter.pdf', size: '425 KB', uploadDate: '2024-06-12', type: 'Correspondence' }
    ],
    lastActivity: '2024-06-15',
    performanceScore: 72,
    slaCompliance: 85,
    customerSatisfaction: 3.8,
    costEfficiency: 92,
    breachHistory: [
      { date: '2024-03-15', type: 'SLA Violation', resolved: true },
      { date: '2024-05-20', type: 'Performance', resolved: false }
    ],
    marketPosition: 'Leading',
    alternativeVendors: ['Corporate Journey Ltd', 'Elite Business Travel'],
    financialHealth: 'Good',
    technicalCapability: 'Excellent',
    relationshipScore: 4.2,
    terms: 'Standard enterprise terms with 30-day notice period for modifications. Performance penalties apply for SLA breaches exceeding 5% monthly threshold.',
    description: 'Comprehensive master service agreement covering all airline operations support services including booking systems, customer service, and operational support.'
  },
  {
    id: 'CTR-2024-002',
    vendor: 'Corporate Journey Ltd',
    client: 'Business Travel Dept',
    type: 'Service Level Agreement',
    value: 980000,
    status: 'Pending Signature',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    signedDate: null,
    progress: 85,
    nextAction: 'Awaiting Vendor Signature',
    documents: 3,
    breachRisk: 'Low',
    breachCount: 0,
    parties: ['SOAR-AI Airlines', 'Corporate Journey Ltd'],
    attachedOffer: {
      id: 'OFF-002',
      title: 'Economy Plus Group Rates',
      status: 'Active',
      discount: 15,
      validFrom: '2024-02-01',
      validTo: '2024-11-30',
      appliedDiscounts: ['DISC-002'],
      promoCodes: ['PROMO-002']
    },
    milestones: [
      { name: 'Contract Draft', date: '2024-05-15', status: 'completed' },
      { name: 'Legal Review', date: '2024-05-25', status: 'completed' },
      { name: 'Vendor Signature', date: '2024-06-01', status: 'pending' },
      { name: 'Service Launch', date: '2024-06-15', status: 'upcoming' }
    ],
    comments: [
      { id: 1, author: 'Jane Doe', date: '2024-05-28', content: 'Contract ready for vendor signature. Awaiting final approval from their legal team.' }],

    attachments: [
      { name: 'Service Level Agreement.pdf', size: '1.8 MB', uploadDate: '2024-05-15', type: 'Contract' },
      { name: 'Performance Metrics.pdf', size: '945 KB', uploadDate: '2024-05-20', type: 'Specification' },
      { name: 'Legal Review Notes.pdf', size: '623 KB', uploadDate: '2024-05-25', type: 'Review' }
    ],
    lastActivity: '2024-05-28',
    performanceScore: 88,
    slaCompliance: 96,
    customerSatisfaction: 4.3,
    costEfficiency: 87,
    breachHistory: [],
    marketPosition: 'Competitive',
    alternativeVendors: ['Global Travel Solutions', 'Premier Voyage Group'],
    financialHealth: 'Excellent',
    technicalCapability: 'Good',
    relationshipScore: 4.5,
    terms: 'Service level agreement with 99.5% uptime guarantee. Monthly performance reviews and quarterly business reviews included.',
    description: 'Dedicated service level agreement for business travel department operations with enhanced support and guaranteed response times.'
  },
  {
    id: 'CTR-2024-003',
    vendor: 'Elite Business Travel',
    client: 'Executive Services',
    type: 'Non-Disclosure Agreement',
    value: 0,
    status: 'Draft',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    signedDate: null,
    progress: 45,
    nextAction: 'Legal Review Required',
    documents: 2,
    breachRisk: 'Low',
    breachCount: 0,
    parties: ['SOAR-AI Airlines', 'Elite Business Travel'],
    attachedOffer: null,
    milestones: [
      { name: 'Initial Draft', date: '2024-06-01', status: 'completed' },
      { name: 'Legal Review', date: '2024-06-15', status: 'in-progress' },
      { name: 'Final Approval', date: '2024-06-25', status: 'upcoming' }
    ],
    comments: [],
    attachments: [
      { name: 'NDA Draft v1.pdf', size: '456 KB', uploadDate: '2024-06-01', type: 'Draft' },
      { name: 'Legal Requirements.pdf', size: '289 KB', uploadDate: '2024-06-05', type: 'Requirements' }
    ],
    lastActivity: '2024-06-10',
    performanceScore: 94,
    slaCompliance: 98,
    customerSatisfaction: 4.7,
    costEfficiency: 91,
    breachHistory: [],
    marketPosition: 'Premium',
    alternativeVendors: ['Global Travel Solutions'],
    financialHealth: 'Excellent',
    technicalCapability: 'Excellent',
    relationshipScore: 4.8,
    terms: 'Standard NDA terms with 2-year confidentiality period and mutual non-compete clauses.',
    description: 'Non-disclosure agreement for strategic partnership discussions and confidential information sharing.'
  },
  {
    id: 'CTR-2024-004',
    vendor: 'Premier Voyage Group',
    client: 'Regional Operations',
    type: 'Partnership Agreement',
    value: 620000,
    status: 'At Risk',
    startDate: '2023-01-01',
    endDate: '2024-07-31',
    signedDate: '2022-12-15',
    progress: 100,
    nextAction: 'Breach Resolution Required',
    documents: 7,
    breachRisk: 'High',
    breachCount: 3,
    parties: ['SOAR-AI Airlines', 'Premier Voyage Group'],
    attachedOffer: {
      id: 'OFF-003',
      title: 'Financial Services Executive',
      status: 'Draft',
      discount: 30,
      validFrom: '2024-03-01',
      validTo: '2024-12-31',
      appliedDiscounts: ['DISC-001', 'DISC-004'],
      promoCodes: ['PROMO-003']
    },
    milestones: [
      { name: 'Contract Signing', date: '2022-12-15', status: 'completed' },
      { name: 'Service Launch', date: '2023-01-01', status: 'completed' },
      { name: 'Contract Expired', date: '2024-01-01', status: 'overdue' },
      { name: 'Renewal Required', date: '2024-06-01', status: 'overdue' }
    ],
    comments: [
      { id: 1, author: 'David Chen', date: '2024-06-14', content: 'Escalated performance issues to senior management. Considering termination.' },
      { id: 2, author: 'Lisa Wong', date: '2024-06-10', content: 'Third breach this quarter. Vendor response inadequate.' },
      { id: 3, author: 'Mark Johnson', date: '2024-06-05', content: 'Performance metrics continue to decline despite interventions.' },
      { id: 4, author: 'Sarah Kim', date: '2024-05-28', content: 'Customer complaints increasing. Impact on regional operations significant.' },
      { id: 5, author: 'Tom Brown', date: '2024-05-20', content: 'Vendor action plan submitted but lacks concrete timelines.' },
      { id: 6, author: 'Anna Davis', date: '2024-05-15', content: 'SLA breach #3 for this quarter. Financial penalties applied.' },
      { id: 7, author: 'James Wilson', date: '2024-05-10', content: 'Emergency meeting scheduled with vendor leadership.' },
      { id: 8, author: 'Rachel Green', date: '2024-05-05', content: 'Performance deterioration continues. Alternative vendors being evaluated.' }],

    attachments: [
      { name: 'Partnership Agreement.pdf', size: '3.2 MB', uploadDate: '2022-12-15', type: 'Contract' },
      { name: 'Performance Report Q1.pdf', size: '1.1 MB', uploadDate: '2024-01-20', type: 'Report' },
      { name: 'Breach Notice #1.pdf', size: '234 KB', uploadDate: '2024-01-25', type: 'Notice' },
      { name: 'Vendor Response Plan.pdf', size: '678 KB', uploadDate: '2024-02-10', type: 'Response' },
      { name: 'Breach Notice #2.pdf', size: '287 KB', uploadDate: '2024-03-15', type: 'Notice' },
      { name: 'Performance Improvement Plan.pdf', size: '892 KB', uploadDate: '2024-04-01', type: 'Plan' },
      { name: 'Termination Evaluation.pdf', size: '1.5 MB', uploadDate: '2024-06-10', type: 'Analysis' }
    ],
    lastActivity: '2024-06-14',
    performanceScore: 45,
    slaCompliance: 62,
    customerSatisfaction: 2.8,
    costEfficiency: 78,
    breachHistory: [
      { date: '2024-01-20', type: 'Financial', resolved: false },
      { date: '2024-03-10', type: 'SLA Violation', resolved: true },
      { date: '2024-05-15', type: 'Performance', resolved: false }
    ],
    marketPosition: 'Declining',
    alternativeVendors: ['Global Travel Solutions', 'Corporate Journey Ltd'],
    financialHealth: 'Concerning',
    technicalCapability: 'Average',
    relationshipScore: 2.1,
    terms: 'Partnership agreement with revenue sharing model. Performance penalties and termination clauses for repeated breaches.',
    description: 'Strategic partnership agreement for regional operations with revenue sharing and performance-based compensation structure.'
  }
];

// Mock offers data for selection
const mockOffers = [
  {
    id: 'OFF-001',
    title: 'Premium Business Class Package',
    corporate: 'TechCorp International',
    type: 'Route-based',
    status: 'Active',
    discount: 25,
    validFrom: '2024-01-15',
    validTo: '2024-12-31',
    appliedDiscounts: ['DISC-001', 'DISC-003'],
    promoCodes: ['PROMO-001'],
    description: 'Comprehensive business class travel package for TechCorp International with flexible routing options and enhanced service features.'
  },
  {
    id: 'OFF-002',
    title: 'Economy Plus Group Rates',
    corporate: 'Global Manufacturing Ltd',
    type: 'Volume-based',
    status: 'Active',
    discount: 15,
    validFrom: '2024-02-01',
    validTo: '2024-11-30',
    appliedDiscounts: ['DISC-002'],
    promoCodes: ['PROMO-002'],
    description: 'Volume-based pricing structure for Global Manufacturing with guaranteed group discounts and flexible travel dates.'
  },
  {
    id: 'OFF-003',
    title: 'Financial Services Executive',
    corporate: 'Sunrise Financial Services',
    type: 'Flexible',
    status: 'Draft',
    discount: 30,
    validFrom: '2024-03-01',
    validTo: '2024-12-31',
    appliedDiscounts: ['DISC-001', 'DISC-004'],
    promoCodes: ['PROMO-003'],
    description: 'Premium first-class travel package for Sunrise Financial executives with maximum flexibility and luxury amenities.'
  },
  {
    id: 'OFF-004',
    title: 'Regional Travel Package',
    corporate: 'Regional Operations Corp',
    type: 'Route-based',
    status: 'Active',
    discount: 18,
    validFrom: '2024-02-15',
    validTo: '2024-11-15',
    appliedDiscounts: ['DISC-002'],
    promoCodes: ['PROMO-001'],
    description: 'Cost-effective regional travel solution with optimized routes and competitive pricing.'
  }
];

// Mock discounts data
const mockDiscounts = [
  {
    id: 'DISC-001',
    name: 'Early Bird Discount',
    type: 'Percentage',
    value: 15,
    description: 'Discount for bookings made 60 days in advance'
  },
  {
    id: 'DISC-002',
    name: 'Volume Discount',
    type: 'Percentage',
    value: 20,
    description: 'Bulk booking discount for 10+ passengers'
  },
  {
    id: 'DISC-003',
    name: 'Student Discount',
    type: 'Fixed',
    value: 100,
    description: 'Fixed discount for verified students'
  },
  {
    id: 'DISC-004',
    name: 'Corporate Premium Discount',
    type: 'Percentage',
    value: 25,
    description: 'Premium discount for enterprise clients'
  }
];

// Mock promo codes data
const mockPromoCodes = [
  {
    id: 'PROMO-001',
    code: 'SAVE2024',
    name: 'New Year Promotion',
    type: 'Percentage',
    value: 10,
    description: 'New Year special offer for all bookings'
  },
  {
    id: 'PROMO-002',
    code: 'BIZTRAVEL',
    name: 'Business Travel Special',
    type: 'Fixed',
    value: 75,
    description: 'Special promotion for business travelers'
  },
  {
    id: 'PROMO-003',
    code: 'SUMMER20',
    name: 'Summer Vacation Deal',
    type: 'Percentage',
    value: 20,
    description: 'Summer holiday discount for leisure travel'
  }
];

const contractTemplates = [
  { id: 1, name: 'Master Service Agreement', category: 'Primary', description: 'Comprehensive service agreement template' },
  { id: 2, name: 'Service Level Agreement', category: 'Performance', description: 'SLA template with KPIs and metrics' },
  { id: 3, name: 'Non-Disclosure Agreement', category: 'Legal', description: 'Standard NDA template' },
  { id: 4, name: 'Partnership Agreement', category: 'Strategic', description: 'Strategic partnership template' },
  { id: 5, name: 'Amendment Template', category: 'Modification', description: 'Contract modification template' }
];

// AI Recommendations based on contract analysis
const aiRecommendations = {
  'CTR-2024-001': {
    recommendation: 'Renegotiate',
    confidence: 78,
    reasoning: [
      'High breach count (2) indicates performance issues',
      'SLA compliance at 85% - below industry standard',
      'Strong market position allows for better terms negotiation',
      'Cost efficiency at 92% demonstrates value but needs performance improvement'
    ],
    actions: [
      'Schedule performance review meeting within 2 weeks',
      'Renegotiate SLA terms with stricter penalties',
      'Implement monthly performance monitoring',
      'Consider 6-month probationary renewal'
    ],
    expectedImpact: 'Improved service quality, reduced breach risk by 60%',
    timeline: '30-45 days',
    riskLevel: 'Medium'
  },
  'CTR-2024-002': {
    recommendation: 'Renew',
    confidence: 92,
    reasoning: [
      'Excellent performance score (88%) and SLA compliance (96%)',
      'High customer satisfaction (4.3/5) with zero breaches',
      'Strong financial health and technical capabilities',
      'Cost-effective solution with competitive positioning'
    ],
    actions: [
      'Initiate renewal discussions 60 days before expiration',
      'Negotiate volume discounts for extended term',
      'Include performance bonuses for sustained excellence',
      'Consider expanding scope of services'
    ],
    expectedImpact: 'Continued high performance, potential 10-15% cost savings',
    timeline: '15-20 days',
    riskLevel: 'Low'
  },
  'CTR-2024-003': {
    recommendation: 'Renew',
    confidence: 95,
    reasoning: [
      'Outstanding performance metrics across all areas',
      'Perfect compliance record with no breaches',
      'Premium market position with excellent relationship score',
      'High customer satisfaction (4.7/5) and technical excellence'
    ],
    actions: [
      'Fast-track renewal process due to excellent performance',
      'Negotiate multi-year agreement with favorable terms',
      'Explore strategic partnership opportunities',
      'Consider preferred vendor status'
    ],
    expectedImpact: 'Long-term strategic partnership, enhanced service delivery',
    timeline: '10-15 days',
    riskLevel: 'Very Low'
  },
  'CTR-2024-004': {
    recommendation: 'Terminate',
    confidence: 89,
    reasoning: [
      'Poor performance score (45%) with multiple unresolved breaches',
      'Low SLA compliance (62%) and customer satisfaction (2.8/5)',
      'Concerning financial health and declining market position',
      'Multiple alternative vendors available with better track records'
    ],
    actions: [
      'Issue formal termination notice within 30 days',
      'Begin vendor transition planning immediately',
      'Document all breach instances for legal protection',
      'Initiate procurement process for replacement vendor'
    ],
    expectedImpact: 'Risk reduction by 80%, improved service quality expected',
    timeline: '60-90 days transition',
    riskLevel: 'High'
  }
};

interface ContractManagementProps {
  initialFilters?: any;
}

export function ContractManagement({ initialFilters }: ContractManagementProps) {
  const [selectedContract, setSelectedContract] = useState(null);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [showContractDetail, setShowContractDetail] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [showOfferDetail, setShowOfferDetail] = useState(false);
  const [showChangeOffer, setShowChangeOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('summary');
  const [filters, setFilters] = useState({
    status: '',
    client: '',
    riskLevel: '',
    dateRange: '',
    ...initialFilters
  });

  const [newContract, setNewContract] = useState({
    vendor: '',
    client: '',
    type: '',
    value: '',
    startDate: '',
    endDate: '',
    parties: '',
    milestones: '',
    terms: '',
    attachedOffer: 'none'
  });

  // Helper functions
  const getDaysUntilExpiration = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpirationStatus = (endDate: string) => {
    const days = getDaysUntilExpiration(endDate);
    if (days < 0) return { status: 'expired', color: 'destructive', label: 'Expired' };
    if (days <= 30) return { status: 'critical', color: 'destructive', label: `${days} days left` };
    if (days <= 60) return { status: 'warning', color: 'secondary', label: `${days} days left` };
    if (days <= 90) return { status: 'caution', color: 'outline', label: `${days} days left` };
    return { status: 'normal', color: 'default', label: 'Active' };
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Renew': return 'default';
      case 'Renegotiate': return 'secondary';
      case 'Terminate': return 'destructive';
      default: return 'outline';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Renew': return CheckCircle2;
      case 'Renegotiate': return RefreshCw;
      case 'Terminate': return XCircle;
      default: return Info;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending Signature': return 'secondary';
      case 'Draft': return 'outline';
      case 'At Risk': return 'destructive';
      case 'Expired': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return CheckCircle;
      case 'Pending Signature': return Clock;
      case 'Draft': return Edit;
      case 'At Risk': return AlertTriangle;
      case 'Expired': return AlertTriangle;
      default: return FileText;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'outline';
    }
  };

  const getMilestoneStatus = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'pending': return 'outline';
      case 'upcoming': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const handleCreateContract = () => {
    console.log('Creating contract:', newContract);
    setIsCreatingContract(false);
    setNewContract({
      vendor: '',
      client: '',
      type: '',
      value: '',
      startDate: '',
      endDate: '',
      parties: '',
      milestones: '',
      terms: '',
      attachedOffer: 'none'
    });
  };

  const handleViewOffer = (contract) => {
    if (contract.attachedOffer) {
      setSelectedContract(contract);
      setSelectedOffer(contract.attachedOffer);
      setShowOfferDetail(true);
    }
  };

  const handleChangeOffer = (contract) => {
    setSelectedContract(contract);
    setSelectedOffer(contract.attachedOffer);
    setShowChangeOffer(true);
  };

  const renderPromoCodesAndDiscounts = (appliedDiscounts = [], promoCodes = []) => {
    return (
      <div className="flex flex-wrap gap-1">
        {appliedDiscounts.map(discountId => {
          const discount = mockDiscounts.find(d => d.id === discountId);
          return discount ? (
            <Badge key={discountId} variant="secondary" className="text-xs">
              <Percent className="h-3 w-3 mr-1" />
              {discount.name}
            </Badge>
          ) : null;
        })}
        {promoCodes.map(promoId => {
          const promo = mockPromoCodes.find(p => p.id === promoId);
          return promo ? (
            <Badge key={promoId} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {promo.code}
            </Badge>
          ) : null;
        })}
      </div>
    );
  };

  const handleViewContract = (contract) => {
    setSelectedContract(contract);
    setActiveDetailTab('summary');
    setShowContractDetail(true);
  };

  const handleShowAIRecommendation = (contract) => {
    setSelectedContract(contract);
    setShowAIRecommendation(true);
  };

  const handleDownloadContract = (contract) => {
    // Create contract data for download
    const contractData = {
      contract: {
        id: contract.id,
        vendor: contract.vendor,
        client: contract.client,
        type: contract.type,
        value: contract.value,
        status: contract.status,
        startDate: contract.startDate,
        endDate: contract.endDate,
        signedDate: contract.signedDate,
        parties: contract.parties,
        terms: contract.terms,
        description: contract.description
      },
      attachedOffer: contract.attachedOffer,
      milestones: contract.milestones,
      performance: {
        performanceScore: contract.performanceScore,
        slaCompliance: contract.slaCompliance,
        customerSatisfaction: contract.customerSatisfaction,
        costEfficiency: contract.costEfficiency,
        breachCount: contract.breachCount,
        breachHistory: contract.breachHistory
      },
      aiRecommendation: aiRecommendations[contract.id],
      exportDate: new Date().toISOString(),
      exportedBy: 'Current User'
    };

    // Convert to JSON string
    const dataStr = JSON.stringify(contractData, null, 2);

    // Create and download file
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contract.id}_Contract_Details_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    console.log(`Contract ${contract.id} downloaded successfully`);
  };

  const getExpiringContracts = () => {
    return contracts.filter(contract => {
      const days = getDaysUntilExpiration(contract.endDate);
      return days <= 90 && days >= 0;
    });
  };

  return (
    <div className="space-y-6 p-5">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contract Management</h2>
          <p className="text-muted-foreground">Manage contracts with AI-powered renewal recommendations and expiration tracking</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreatingContract} onOpenChange={setIsCreatingContract}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Contract</DialogTitle>
                <DialogDescription>
                  Generate a new contract with comprehensive details and milestone tracking
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select value={newContract.vendor} onValueChange={(value) => setNewContract({...newContract, vendor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global-travel">Global Travel Solutions</SelectItem>
                      <SelectItem value="corporate-journey">Corporate Journey Ltd</SelectItem>
                      <SelectItem value="elite-business">Elite Business Travel</SelectItem>
                      <SelectItem value="premier-voyage">Premier Voyage Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="client">Client Department</Label>
                  <Select value={newContract.client} onValueChange={(value) => setNewContract({...newContract, client: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airline-operations">Airline Operations</SelectItem>
                      <SelectItem value="business-travel">Business Travel Dept</SelectItem>
                      <SelectItem value="executive-services">Executive Services</SelectItem>
                      <SelectItem value="regional-operations">Regional Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Contract Type</Label>
                  <Select value={newContract.type} onValueChange={(value) => setNewContract({...newContract, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="attachedOffer">Attached Offer (Optional)</Label>
                  <Select value={newContract.attachedOffer} onValueChange={(value) => setNewContract({...newContract, attachedOffer: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select offer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Offer</SelectItem>
                      {mockOffers.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Contract Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="0"
                    value={newContract.value}
                    onChange={(e) => setNewContract({...newContract, value: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) => setNewContract({...newContract, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newContract.endDate}
                    onChange={(e) => setNewContract({...newContract, endDate: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="parties">Parties Involved</Label>
                  <Input
                    id="parties"
                    placeholder="e.g., SOAR-AI Airlines, Vendor Name, Third Party"
                    value={newContract.parties}
                    onChange={(e) => setNewContract({...newContract, parties: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="milestones">Key Milestones & Obligations</Label>
                  <Textarea
                    id="milestones"
                    placeholder="Define key milestones, deliverables, and obligations..."
                    value={newContract.milestones}
                    onChange={(e) => setNewContract({...newContract, milestones: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="terms">Special Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Enter any special terms, conditions, or requirements..."
                    value={newContract.terms}
                    onChange={(e) => setNewContract({...newContract, terms: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingContract(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContract}>
                  Generate Contract
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            Import Contract
          </Button>
        </div>
      </div>

      {/* Expiration Alert Banner */}
      {getExpiringContracts().length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Contracts Expiring Soon:</strong> {getExpiringContracts().length} contract{getExpiringContracts().length > 1 ? 's' : ''} require{getExpiringContracts().length === 1 ? 's' : ''} attention within the next 90 days.
            <Button variant="link" className="p-0 ml-2 text-yellow-800 underline">
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Contract Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending Signature">Pending Signature</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Client Department</Label>
              <Select value={filters.client} onValueChange={(value) => setFilters({...filters, client: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Airline Operations">Airline Operations</SelectItem>
                  <SelectItem value="Business Travel Dept">Business Travel Dept</SelectItem>
                  <SelectItem value="Executive Services">Executive Services</SelectItem>
                  <SelectItem value="Regional Operations">Regional Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Risk Level</Label>
              <Select value={filters.riskLevel} onValueChange={(value) => setFilters({...filters, riskLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All risk levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High Risk</SelectItem>
                  <SelectItem value="Medium">Medium Risk</SelectItem>
                  <SelectItem value="Low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expiration</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="critical">Critical (≤30 days)</SelectItem>
                  <SelectItem value="warning">Warning (≤60 days)</SelectItem>
                  <SelectItem value="caution">Caution (≤90 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>AI Recommendation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All recommendations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renew">Renew</SelectItem>
                  <SelectItem value="renegotiate">Renegotiate</SelectItem>
                  <SelectItem value="terminate">Terminate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contract-list" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger 
            value="contract-list"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Contract List
          </TabsTrigger>
          <TabsTrigger 
            value="expiring-soon"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Expiring Soon
          </TabsTrigger>
          <TabsTrigger 
            value="ai-recommendations"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contract-list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Overview</CardTitle>
              <CardDescription>All contracts with expiration tracking, breach indicators and AI recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => {
                  const StatusIcon = getStatusIcon(contract.status);
                  const expirationStatus = getExpirationStatus(contract.endDate);
                  const aiRec = aiRecommendations[contract.id];
                  const RecommendationIcon = getRecommendationIcon(aiRec?.recommendation);

                  return (
                    <Card key={contract.id} className="relative">
                      <CardContent className="p-6">
                        {/* Expiration Warning Strip */}
                        {(expirationStatus.status === 'critical' || expirationStatus.status === 'warning') && (
                          <div className={`absolute top-0 left-0 right-0 h-1 ${expirationStatus.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg">
                              <FileText className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{contract.id}</h3>
                                {contract.breachCount > 0 && (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {contract.breachCount} breach{contract.breachCount > 1 ? 'es' : ''}
                                  </Badge>
                                )}
                                {/* Expiration Badge */}
                                {expirationStatus.status !== 'normal' && (
                                  <Badge variant={expirationStatus.color} className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {expirationStatus.label}
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium">{contract.vendor}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>{contract.client}</span>
                                <span>{contract.type}</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {contract.startDate} - {contract.endDate}
                                </span>
                              </div>
                              {/* Attached Offer Display */}
                              {contract.attachedOffer && (
                                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Target className="h-4 w-4 text-blue-600" />
                                      <div>
                                        <p className="text-sm font-medium text-blue-800">{contract.attachedOffer.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="outline" className="text-xs">{contract.attachedOffer.discount}% discount</Badge>
                                          <Badge className="text-xs bg-blue-100 text-blue-800">{contract.attachedOffer.status}</Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="outline" onClick={() => handleViewOffer(contract)} title="View Offer Details">
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => handleChangeOffer(contract)} title="Change Offer">
                                        <ArrowRight className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  {/* Display Promo Codes and Discounts */}
                                  {(contract.attachedOffer.appliedDiscounts?.length > 0 || contract.attachedOffer.promoCodes?.length > 0) && (
                                    <div className="mt-2">
                                      {renderPromoCodesAndDiscounts(contract.attachedOffer.appliedDiscounts, contract.attachedOffer.promoCodes)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusColor(contract.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {contract.status}
                              </Badge>
                              <Badge variant={getRiskColor(contract.breachRisk)}>
                                <Shield className="h-3 w-3 mr-1" />
                                {contract.breachRisk} Risk
                              </Badge>
                            </div>
                            <div className="text-sm font-medium">
                              {contract.value > 0 ? `$${(contract.value / 1000).toFixed(0)}K` : 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* AI Recommendation Banner */}
                        {aiRec && (
                          <Alert className={`mb-4 ${aiRec.recommendation === 'Renew' ? 'border-green-200 bg-green-50' : aiRec.recommendation === 'Terminate' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                            <Brain className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                              <div>
                                <strong>AI Recommendation:</strong> 
                                <Badge variant={getRecommendationColor(aiRec.recommendation)} className="ml-2">
                                  <RecommendationIcon className="h-3 w-3 mr-1" />
                                  {aiRec.recommendation}
                                </Badge>
                                <span className="ml-2 text-sm">Confidence: {aiRec.confidence}%</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleShowAIRecommendation(contract)}
                              >
                                View Details
                              </Button>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs">Parties</Label>
                              <p className="text-sm">{contract.parties.join(', ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs">Performance</Label>
                              <p className="text-sm">{contract.performanceScore}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs">SLA Compliance</Label>
                              <p className="text-sm">{contract.slaCompliance}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs">Comments</Label>
                              <p className="text-sm">{contract.comments?.length || 0} notes</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Last activity: {contract.lastActivity}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewContract(contract)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleShowAIRecommendation(contract)}>
                              <Brain className="h-4 w-4 mr-1" />
                              AI Insights
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadContract(contract)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            {contract.status === 'Pending Signature' && (
                              <Button 
                                size="sm"
                                onClick={() => console.log('Initiating digital signature for:', contract.id)}
                              >
                                <PenTool className="h-4 w-4 mr-1" />
                                Sign
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiring Soon Tab */}
        <TabsContent value="expiring-soon" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Contracts Expiring Soon
              </CardTitle>
              <CardDescription>Contracts requiring renewal decisions within the next 90 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getExpiringContracts().map((contract) => {
                  const expirationStatus = getExpirationStatus(contract.endDate);
                  const aiRec = aiRecommendations[contract.id];
                  const RecommendationIcon = getRecommendationIcon(aiRec?.recommendation);
                  const daysLeft = getDaysUntilExpiration(contract.endDate);

                  return (
                    <Card key={contract.id} className={`border-l-4 ${daysLeft <= 30 ? 'border-l-red-500' : daysLeft <= 60 ? 'border-l-yellow-500' : 'border-l-blue-500'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{contract.id}</h3>
                              <Badge variant={expirationStatus.color} className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {daysLeft} days left
                              </Badge>
                              {aiRec && (
                                <Badge variant={getRecommendationColor(aiRec.recommendation)}>
                                  <RecommendationIcon className="h-3 w-3 mr-1" />
                                  {aiRec.recommendation}
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium text-lg">{contract.vendor}</p>
                            <p className="text-muted-foreground">{contract.client} • {contract.type}</p>
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Contract Value:</span> ${(contract.value / 1000).toFixed(0)}K
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold mb-1">{daysLeft}</div>
                            <div className="text-sm text-muted-foreground">days remaining</div>
                            <div className="text-sm mt-2">
                              Expires: <span className="font-medium">{contract.endDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Performance</div>
                            <div className="font-semibold">{contract.performanceScore}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">SLA Compliance</div>
                            <div className="font-semibold">{contract.slaCompliance}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Satisfaction</div>
                            <div className="font-semibold">{contract.customerSatisfaction}/5</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Breaches</div>
                            <div className="font-semibold">{contract.breachCount}</div>
                          </div>
                        </div>

                        {/* AI Recommendation */}
                        {aiRec && (
                          <Alert className={`mb-4 ${aiRec.recommendation === 'Renew' ? 'border-green-200 bg-green-50' : aiRec.recommendation === 'Terminate' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                            <Brain className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-center justify-between">
                                <div>
                                  <strong>AI Recommendation: {aiRec.recommendation}</strong>
                                  <div className="text-sm mt-1">Confidence: {aiRec.confidence}% • {aiRec.expectedImpact}</div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleShowAIRecommendation(contract)}
                                >
                                  View Analysis
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Initiate Renewal
                          </Button>
                          <Button variant="outline" onClick={() => handleShowAIRecommendation(contract)}>
                            <Brain className="h-4 w-4 mr-1" />
                            AI Analysis
                          </Button>
                          <Button variant="outline" onClick={() => handleViewContract(contract)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Contract
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="ai-recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Contract Recommendations
              </CardTitle>
              <CardDescription>Intelligent analysis and recommendations for all contracts based on performance, risk, and market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contracts.map((contract) => {
                  const aiRec = aiRecommendations[contract.id];
                  const RecommendationIcon = getRecommendationIcon(aiRec?.recommendation);

                  if (!aiRec) return null;

                  return (
                    <Card key={contract.id} className={`border-l-4 ${aiRec.recommendation === 'Renew' ? 'border-l-green-500' : aiRec.recommendation === 'Terminate' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{contract.id} - {contract.vendor}</h3>
                              <Badge variant={getRecommendationColor(aiRec.recommendation)} className="flex items-center gap-1">
                                <RecommendationIcon className="h-3 w-3" />
                                {aiRec.recommendation}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{contract.client} • {contract.type}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold mb-1">{aiRec.confidence}%</div>
                            <div className="text-sm text-muted-foreground">Confidence Score</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                                <Badge variant={aiRec.riskLevel === 'High' ? 'destructive' : aiRec.riskLevel === 'Medium' ? 'secondary' : 'default'}>
                                  {aiRec.riskLevel}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">Timeline</div>
                                <div className="font-medium">{aiRec.timeline}</div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">Expected Impact</div>
                                <div className="font-medium text-sm">{aiRec.expectedImpact}</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Key Reasoning</Label>
                            <ul className="space-y-1">
                              {aiRec.reasoning.map((reason, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Recommended Actions</Label>
                            <ul className="space-y-1">
                              {aiRec.actions.map((action, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="w-1/4 px-[0px] py-[8px]">
                            <Target className="h-4 w-4 mr-1" />
                            Implement Recommendation
                          </Button>
                          <Button variant="outline" onClick={() => handleViewContract(contract)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Contract
                          </Button>
                          <Button variant="outline" onClick={() => handleDownloadContract(contract)}>
                            <Download className="h-4 w-4 mr-1" />
                            Export Analysis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Templates</CardTitle>
              <CardDescription>Pre-configured templates for quick contract creation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contracts.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{getExpiringContracts().length} expiring soon</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(contracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">Active contracts</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(contracts.reduce((sum, c) => sum + c.performanceScore, 0) / contracts.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-600">Mixed performance</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(aiRecommendations).length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">Analysis complete</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contract Performance Overview</CardTitle>
              <CardDescription>Performance metrics and renewal recommendations across all contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => {
                  const aiRec = aiRecommendations[contract.id];
                  return (
                    <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{contract.vendor}</h4>
                        <p className="text-sm text-muted-foreground">{contract.id}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Performance</div>
                          <div className="font-semibold">{contract.performanceScore}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">SLA</div>
                          <div className="font-semibold">{contract.slaCompliance}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Satisfaction</div>
                          <div className="font-semibold">{contract.customerSatisfaction}/5</div>
                        </div>
                        {aiRec && (
                          <Badge variant={getRecommendationColor(aiRec.recommendation)}>
                            {aiRec.recommendation}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contract Details Dialog */}
      <Dialog open={showContractDetail} onOpenChange={setShowContractDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details - {selectedContract?.id}</DialogTitle>
            <DialogDescription>{selectedContract?.vendor} • {selectedContract?.type}</DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
                <TabsTrigger 
                  value="summary"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="documents"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Timeline
                </TabsTrigger>
                <TabsTrigger 
                  value="comments"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Comments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contract ID</Label>
                      <p className="font-medium">{selectedContract.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Vendor</Label>
                      <p className="font-medium">{selectedContract.vendor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Client Department</Label>
                      <p className="font-medium">{selectedContract.client}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contract Type</Label>
                      <p className="font-medium">{selectedContract.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contract Value</Label>
                      <p className="font-medium">${selectedContract.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <Badge variant={getStatusColor(selectedContract.status)}>
                        {selectedContract.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contract Period</Label>
                      <p className="font-medium">{selectedContract.startDate} to {selectedContract.endDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Signed Date</Label>
                      <p className="font-medium">{selectedContract.signedDate || 'Not signed'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Next Action Required</Label>
                      <p className="font-medium">{selectedContract.nextAction}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Risk Level</Label>
                      <Badge variant={getRiskColor(selectedContract.breachRisk)}>
                        {selectedContract.breachRisk} Risk
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-600">Parties Involved</Label>
                  <div className="mt-1">
                    {selectedContract.parties.map((party, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">
                        {party}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedContract.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedContract.description}</p>
                  </div>
                )}

                {selectedContract.terms && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Terms & Conditions</Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedContract.terms}</p>
                  </div>
                )}

                {/* Performance Metrics */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-3 block">Performance Metrics</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedContract.performanceScore}%</p>
                      <p className="text-sm text-muted-foreground">Performance Score</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedContract.slaCompliance}%</p>
                      <p className="text-sm text-muted-foreground">SLA Compliance</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{selectedContract.customerSatisfaction}/5</p>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">{selectedContract.breachCount}</p>
                      <p className="text-sm text-muted-foreground">Breaches</p>
                    </div>
                  </div>
                </div>

                {/* Attached Offer */}
                {selectedContract.attachedOffer && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-3 block">Attached Offer</Label>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{selectedContract.attachedOffer.title}</h4>
                            <p className="text-sm text-muted-foreground">{selectedContract.attachedOffer.id}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{selectedContract.attachedOffer.discount}% discount</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{selectedContract.attachedOffer.status}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewOffer(selectedContract)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Offer
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleChangeOffer(selectedContract)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Change
                            </Button>
                          </div>
                        </div>
                        {(selectedContract.attachedOffer.appliedDiscounts?.length > 0 || selectedContract.attachedOffer.promoCodes?.length > 0) && (
                          <div className="mt-3 pt-3 border-t">
                            {renderPromoCodesAndDiscounts(selectedContract.attachedOffer.appliedDiscounts, selectedContract.attachedOffer.promoCodes)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Contract Documents</h4>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Document
                  </Button>
                </div>
                {selectedContract.attachments && selectedContract.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedContract.attachments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} • {doc.type} • Uploaded {doc.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents attached to this contract</p>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <h4 className="font-medium">Contract Milestones</h4>
                <div className="space-y-4">
                  {selectedContract.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Badge variant={getMilestoneStatus(milestone.status)}>
                        {milestone.status}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-muted-foreground">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Contract Comments</h4>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>
                </div>
                {selectedContract.comments && selectedContract.comments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedContract.comments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {comment.author.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{comment.author}</p>
                              <p className="text-xs text-muted-foreground">{comment.date}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No comments on this contract</p>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContractDetail(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => handleDownloadContract(selectedContract)}>
              <Download className="h-4 w-4 mr-1" />
              Download Contract
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-1" />
              Edit Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Recommendation Dialog */}
      <Dialog open={showAIRecommendation} onOpenChange={setShowAIRecommendation}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Contract Analysis - {selectedContract?.id}
            </DialogTitle>
            <DialogDescription>
              Comprehensive AI-powered analysis and recommendations for {selectedContract?.vendor}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && aiRecommendations[selectedContract.id] && (
            <div className="space-y-6">
              {(() => {
                const aiRec = aiRecommendations[selectedContract.id];
                const RecommendationIcon = getRecommendationIcon(aiRec.recommendation);

                return (
                  <>
                    {/* Recommendation Header */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <RecommendationIcon className="h-8 w-8" />
                        <div>
                          <h3 className="text-xl font-semibold">Recommendation: {aiRec.recommendation}</h3>
                          <p className="text-muted-foreground">Confidence Score: {aiRec.confidence}%</p>
                        </div>
                      </div>
                      <Badge variant={getRecommendationColor(aiRec.recommendation)} className="text-lg p-2">
                        {aiRec.recommendation}
                      </Badge>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{selectedContract.performanceScore}%</div>
                          <div className="text-sm text-muted-foreground">Performance Score</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{selectedContract.slaCompliance}%</div>
                          <div className="text-sm text-muted-foreground">SLA Compliance</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{selectedContract.customerSatisfaction}/5</div>
                          <div className="text-sm text-muted-foreground">Satisfaction</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{selectedContract.breachCount}</div>
                          <div className="text-sm text-muted-foreground">Breaches</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Analysis Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Key Analysis Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiRec.reasoning.map((reason, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recommended Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiRec.actions.map((action, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Impact & Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Expected Impact</div>
                            <div className="font-medium">{aiRec.expectedImpact}</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Implementation Timeline</div>
                            <div className="font-medium">{aiRec.timeline}</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                            <Badge variant={aiRec.riskLevel === 'High' ? 'destructive' : aiRec.riskLevel === 'Medium' ? 'secondary' : 'default'}>
                              {aiRec.riskLevel}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Market Context */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Market Context & Alternatives</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Vendor Market Position</Label>
                            <p className="mt-1">{selectedContract.marketPosition}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Financial Health</Label>
                            <p className="mt-1">{selectedContract.financialHealth}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Technical Capability</Label>
                            <p className="mt-1">{selectedContract.technicalCapability}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Relationship Score</Label>
                            <p className="mt-1">{selectedContract.relationshipScore}/5</p>
                          </div>
                        </div>

                        {selectedContract.alternativeVendors.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium">Alternative Vendors</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedContract.alternativeVendors.map((vendor, index) => (
                                <Badge key={index} variant="outline">
                                  {vendor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIRecommendation(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => handleDownloadContract(selectedContract)}>
              <Download className="h-4 w-4 mr-1" />
              Export Analysis
            </Button>
            <Button>
              <Target className="h-4 w-4 mr-1" />
              Implement Recommendation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Offer Dialog */}
      <Dialog open={showOfferDetail} onOpenChange={setShowOfferDetail}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attached Offer Details</DialogTitle>
            <DialogDescription>
              Details of the offer attached to contract {selectedContract?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOffer && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">{selectedOffer.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedOffer.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-800">{selectedOffer.status}</Badge>
                  <Badge variant="outline">{selectedOffer.discount}% discount</Badge>
                </div>
              </div>

              {/* Applied Promo Codes and Discounts */}
              {(selectedOffer.appliedDiscounts?.length > 0 || selectedOffer.promoCodes?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Applied Promotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOffer.appliedDiscounts?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Applied Discounts</Label>
                          <div className="space-y-2">
                            {selectedOffer.appliedDiscounts.map(discountId => {
                              const discount = mockDiscounts.find(d => d.id === discountId);
                              return discount ? (
                                <div key={discountId} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Percent className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-sm">{discount.name}</p>
                                      <p className="text-xs text-muted-foreground">{discount.description}</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary">
                                    {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
                                  </Badge>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {selectedOffer.promoCodes?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Applied Promo Codes</Label>
                          <div className="space-y-2">
                            {selectedOffer.promoCodes.map(promoId => {
                              const promo = mockPromoCodes.find(p => p.id === promoId);
                              return promo ? (
                                <div key={promoId} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-sm font-mono text-blue-600">{promo.code}</p>
                                      <p className="text-xs text-muted-foreground">{promo.description}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">
                                    {promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}`}
                                  </Badge>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Valid Period</Label>
                    <p>{selectedOffer.validFrom} to {selectedOffer.validTo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Discount</Label>
                    <p>{selectedOffer.discount}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Type</Label>
                    <p>{selectedOffer.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge className="bg-blue-100 text-blue-800">{selectedOffer.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedOffer.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedOffer.description}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDetail(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowOfferDetail(false);
              handleChangeOffer(selectedContract);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Change Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Offer Dialog */}
      <Dialog open={showChangeOffer} onOpenChange={setShowChangeOffer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Attached Offer</DialogTitle>
            <DialogDescription>
              Select a different offer to attach to contract {selectedContract?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Current Contract</h4>
              <p>{selectedContract?.id} - {selectedContract?.vendor}</p>
              {selectedContract?.attachedOffer && (
                <p className="text-sm text-muted-foreground">
                  Currently attached: {selectedContract.attachedOffer.title}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Available Offers</Label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">No Offer</p>
                      <p className="text-xs text-muted-foreground">Remove the attached offer</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Select
                    </Button>
                  </div>
                </div>
                {mockOffers.map((offer) => (
                  <div key={offer.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{offer.title}</p>
                          <Badge variant="outline" className="text-xs">{offer.discount}% discount</Badge>
                          <Badge className="text-xs bg-blue-100 text-blue-800">{offer.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{offer.description}</p>
                        {(offer.appliedDiscounts?.length > 0 || offer.promoCodes?.length > 0) && (
                          <div className="mt-2">
                            {renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes)}
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant={selectedContract?.attachedOffer?.id === offer.id ? "default" : "outline"}
                        disabled={selectedContract?.attachedOffer?.id === offer.id}
                      >
                        {selectedContract?.attachedOffer?.id === offer.id ? "Current" : "Select"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeOffer(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowChangeOffer(false)}>
              Update Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}